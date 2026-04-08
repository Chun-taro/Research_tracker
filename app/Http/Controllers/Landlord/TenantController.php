<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Landlord\CentralUser;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class TenantController extends Controller
{
    public function index(Request $request)
    {
        $query = Tenant::withCount('subscriptions');

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('slug', 'like', "%{$request->search}%");
        }

        return Inertia::render('Landlord/Tenants/Index', [
            'tenants' => $query->latest()->paginate(10),
            'plans' => \App\Models\Landlord\SubscriptionTier::where('is_active', true)->get(),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'institution_name' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants,slug',
            'domain' => 'nullable|string|max:255|unique:tenants,domain',
            'subscription_tier' => 'required|string|exists:landlord.subscription_tiers,slug',
            'theme_color' => 'nullable|string|max:7',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|string|email|max:255',
            'admin_password' => 'required|string|min:8',
        ]);

        if (empty($validated['domain'])) {
            $validated['domain'] = $validated['slug'] . '.' . config('app.base_domain', 'localhost');
        }

        // Generate isolated database name
        $validated['database'] = 'research_tracker_' . $validated['slug'];

        // Create the physical database
        \Illuminate\Support\Facades\DB::connection('landlord')->statement("CREATE DATABASE IF NOT EXISTS `{$validated['database']}`");

        $tenant = Tenant::create($validated);

        // 2. Create Profile in Department (Tenant DB)
        $tenant->makeCurrent();
        Artisan::call('migrate --database=mysql --path=database/migrations/tenant --force');

        \App\Models\User::create([
            'tenant_id' => $tenant->id,
            'name' => $validated['admin_name'],
            'email' => $validated['admin_email'],
            'email_hash' => hash('sha256', $validated['admin_email']),
            'password' => Hash::make($validated['admin_password']),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $tenant->forget();

        // Send Welcome Email
        \Illuminate\Support\Facades\Mail::to($validated['admin_email'])
            ->send(new \App\Mail\TenantWelcomeEmail($tenant, $validated['admin_password'], $validated['admin_name'], $validated['admin_email']));

        return redirect()->back()->with('success', 'Tenant created and database provisioned successfully.');
    }

    public function update(Request $request, Tenant $tenant)
    {
        // 1. Validate Tenant Metadata
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'institution_name' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants,slug,' . $tenant->id,
            'domain' => 'nullable|string|max:255|unique:tenants,domain,' . $tenant->id,
            'subscription_tier' => 'required|string|exists:landlord.subscription_tiers,slug',
            'is_active' => 'required|boolean',
        ]);

        // 2. Validate Admin Provisioning if any field is filled
        if ($request->anyFilled(['admin_name', 'admin_email', 'admin_password'])) {
            $request->validate([
                'admin_name' => 'required|string|max:255',
                'admin_email' => 'required|string|email|max:255',
                'admin_password' => 'required|string|min:8',
            ]);
        }

        $tenant->update($validated);

        // Provision additional admin if all fields are filled
        if ($request->filled(['admin_name', 'admin_email', 'admin_password'])) {
            try {
                // 2. Create Profile in Department
                $tenant->makeCurrent();

                $emailHash = hash('sha256', $request->admin_email);
                
                \App\Models\User::updateOrCreate(
                    ['email' => $request->admin_email],
                    [
                        'tenant_id' => $tenant->id,
                        'name' => $request->admin_name,
                        'email' => $request->admin_email,
                        'email_hash' => $emailHash,
                        'password' => Hash::make($request->admin_password),
                        'role' => 'admin',
                        'is_active' => true,
                    ]
                );

                // Send welcome email
                try {
                    Mail::to($request->admin_email)
                        ->send(new \App\Mail\TenantWelcomeEmail($tenant, $request->admin_password, $request->admin_name, $request->admin_email));
                } catch (\Exception $e) {
                    // Log mail failure but don't block user creation
                }

                $tenant->forget();

                return redirect()->back()->with('success', 'Tenant updated and new administrator provisioned successfully through Central Identity Hub.');
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to provision admin: ' . $e->getMessage())->withInput();
            }
        }

        return redirect()->back()->with('success', 'Tenant updated successfully.');
    }

    public function mockSubscription(Request $request, Tenant $tenant)
    {
        $tier = $request->get('tier', 'premium');
        $plan = \App\Models\Landlord\SubscriptionTier::where('slug', $tier)->first();
        if (!$plan) {
            return redirect()->back()->with('error', 'Invalid subscription tier selected.');
        }

        $amount = $plan->price;
        $expiresAt = now()->addYear(); // Standard subscription is 1 year

        \Illuminate\Support\Facades\DB::connection('landlord')->transaction(function () use ($tenant, $tier, $amount, $expiresAt) {
            $tenant->update([
                'subscription_tier' => $tier,
                'subscription_expires_at' => $expiresAt,
                'is_active' => true,
            ]);

            $subscription = \App\Models\Subscription::create([
                'tenant_id' => $tenant->id,
                'tier' => $tier,
                'amount' => $amount,
                'starts_at' => now(),
                'expires_at' => $expiresAt,
                'status' => 'active',
            ]);

            \App\Models\Payment::create([
                'tenant_id' => $tenant->id,
                'subscription_id' => $subscription->id,
                'amount' => $amount,
                'method' => 'mock_upgrade',
                'reference_number' => 'MOCK-' . strtoupper(\Illuminate\Support\Str::random(10)),
                'status' => 'paid',
                'paid_at' => now(),
            ]);
        });

        return redirect()->back()->with('success', "Mock subscription activated! Tier set to " . ucfirst($tier) . " (\u20b1" . number_format($amount, 2) . ") for 1 year.");
    }

    public function destroy(Tenant $tenant)
    {
        $tenant->delete();
        return redirect()->back()->with('success', 'Tenant archived successfully.');
    }
}

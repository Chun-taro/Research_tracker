<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

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
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants,slug',
            'domain' => 'nullable|string|max:255|unique:tenants,domain',
            'subscription_tier' => 'required|string|in:basic,standard,premium',
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

        // Run migrations for the new tenant
        $tenant->makeCurrent();
        \Illuminate\Support\Facades\Artisan::call('migrate --database=mysql --path=database/migrations/tenant --force');

        // Create the first Admin user in the Tenant Database
        \App\Models\User::create([
            'tenant_id' => $tenant->id,
            'name' => $validated['admin_name'],
            'email' => $validated['admin_email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['admin_password']),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $tenant->forget();

        // Send Welcome Email
        \Illuminate\Support\Facades\Mail::to($validated['admin_email'])
            ->send(new \App\Mail\TenantWelcomeEmail($tenant, $validated['admin_password'], $validated['admin_name'], $validated['admin_email']));

        return redirect()->back()->with('success', 'Department created and database provisioned successfully.');
    }

    public function update(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants,slug,' . $tenant->id,
            'domain' => 'nullable|string|max:255|unique:tenants,domain,' . $tenant->id,
            'subscription_tier' => 'required|string|in:basic,standard,premium',
            'is_active' => 'required|boolean',
        ]);

        $tenant->update($validated);

        return redirect()->back()->with('success', 'Department updated successfully.');
    }

    public function mockSubscription(Request $request, Tenant $tenant)
    {
        $tier = $request->get('tier', 'premium');
        $prices = [
            'basic' => 1000.00,
            'standard' => 2500.00,
            'premium' => 4000.00,
        ];

        $amount = $prices[$tier] ?? 4000.00;
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
        return redirect()->back()->with('success', 'Department archived successfully.');
    }
}

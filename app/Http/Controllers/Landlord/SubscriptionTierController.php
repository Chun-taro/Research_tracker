<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Models\Landlord\SubscriptionTier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionTierController extends Controller
{
    public function index()
    {
        return Inertia::render('Landlord/Subscriptions/Plans', [
            'plans' => SubscriptionTier::orderBy('price')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:landlord.subscription_tiers,slug',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|string|in:monthly,yearly',
            'features' => 'nullable|array',
            'limits' => 'nullable|array',
            'is_active' => 'required|boolean',
        ]);

        SubscriptionTier::create($validated);

        return redirect()->back()->with('success', 'Subscription plan created successfully.');
    }

    public function update(Request $request, SubscriptionTier $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|string|in:monthly,yearly',
            'features' => 'nullable|array',
            'limits' => 'nullable|array',
            'is_active' => 'required|boolean',
        ]);

        $plan->update($validated);

        return redirect()->back()->with('success', 'Subscription plan updated successfully.');
    }

    public function destroy(SubscriptionTier $plan)
    {
        if (\App\Models\Tenant::where('subscription_tier', $plan->slug)->exists()) {
            return redirect()->back()->with('error', 'Cannot delete plan that is currently assigned to tenants.');
        }

        $plan->delete();
        return redirect()->back()->with('success', 'Subscription plan deleted successfully.');
    }
}

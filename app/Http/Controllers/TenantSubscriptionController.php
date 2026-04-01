<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use App\Models\Tenant;
use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class TenantSubscriptionController extends Controller
{
    public function index()
    {
        $tenantId = app()->bound('currentTenant') ? app('currentTenant')->id : null;

        if (!$tenantId) {
            return redirect()->route('dashboard');
        }
        
        // We need to query the central landlord database for the subscription information of the current tenant
        $tenant = Tenant::on('landlord')->find($tenantId);
        $subscription = Subscription::on('landlord')->where('tenant_id', $tenantId)->latest()->first();

        // Pass available plans
        $plans = [
            'basic' => ['name' => 'Basic Plan', 'price' => 1000],
            'standard' => ['name' => 'Standard Plan', 'price' => 2500],
            'premium' => ['name' => 'Premium Plan', 'price' => 4000],
        ];

        return Inertia::render('Admin/Billing', [
            'tenant' => $tenant,
            'subscription' => $subscription,
            'plans' => $plans,
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'tier' => 'required|string|in:basic,standard,premium',
        ]);

        $tier = $request->tier;
        $prices = [
            'basic' => 1000,
            'standard' => 2500,
            'premium' => 4000,
        ];
        $priceInCents = $prices[$tier] * 100;
        $tenantId = app()->bound('currentTenant') ? app('currentTenant')->id : null;
        if (!$tenantId) { abort(403); }

        $secret = config('services.stripe.secret');

        if ($secret === 'sk_test_dummy') {
            // Bypass Stripe for local testing with dummy keys
            return redirect()->route('admin.billing.success', [
                'session_id' => 'dummy_session_' . rand(1000, 9999),
                'mock_tenant_id' => $tenantId,
                'mock_tier' => $tier,
                'mock_amount' => $prices[$tier]
            ]);
        }

        Stripe::setApiKey($secret);

        $checkout_session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'php',
                    'product_data' => [
                        'name' => ucfirst($tier) . ' Subscription Plan',
                        'description' => '1 Year Subscription for ' . (app()->bound('currentTenant') ? app('currentTenant')->name : 'Department'),
                    ],
                    'unit_amount' => $priceInCents,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('admin.billing.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('admin.billing.cancel'),
            'metadata' => [
                'tenant_id' => $tenantId,
                'tier' => $tier,
                'amount' => $prices[$tier],
            ],
        ]);

        return Inertia::location($checkout_session->url);
    }

    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');

        if (!$sessionId) {
            return redirect()->route('admin.billing.index')->with('error', 'Invalid payment session.');
        }

        $secret = config('services.stripe.secret');

        if ($secret === 'sk_test_dummy' && str_starts_with($sessionId, 'dummy_session_')) {
            $tenantId = $request->get('mock_tenant_id');
            $tier = $request->get('mock_tier');
            $amount = $request->get('mock_amount');
            $paymentIntent = 'pi_mock_' . rand(10000, 99999);
        } else {
            Stripe::setApiKey($secret);
            $session = StripeSession::retrieve($sessionId);

            if ($session->payment_status !== 'paid') {
                return redirect()->route('admin.billing.index')->with('error', 'Payment not completed.');
            }

            $tenantId = $session->metadata->tenant_id;
            $tier = $session->metadata->tier;
            $amount = $session->metadata->amount;
            $paymentIntent = $session->payment_intent;
        }

        DB::connection('landlord')->transaction(function () use ($tenantId, $tier, $amount, $paymentIntent) {
            $tenant = Tenant::on('landlord')->find($tenantId);
            
            // Check if payment already exists for this session to prevent duplicate processing
            $existingPayment = Payment::on('landlord')->where('reference_number', $paymentIntent)->first();
            
            if (!$existingPayment) {
                $tenant->update([
                    'subscription_tier' => $tier,
                    'subscription_expires_at' => now()->addYear(),
                    'is_active' => true,
                ]);

                $subscription = Subscription::on('landlord')->create([
                    'tenant_id' => $tenantId,
                    'tier' => $tier,
                    'amount' => $amount,
                    'starts_at' => now(),
                    'expires_at' => now()->addYear(),
                    'status' => 'active',
                ]);

                Payment::on('landlord')->create([
                    'tenant_id' => $tenantId,
                    'subscription_id' => $subscription->id,
                    'amount' => $amount,
                    'method' => 'stripe',
                    'reference_number' => $paymentIntent,
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);
            }
        });

        return redirect()->route('admin.billing.index')->with('success', 'Payment successful! Your subscription has been renewed for 1 year.');
    }

    public function cancel()
    {
        return redirect()->route('admin.billing.index')->with('error', 'Payment was cancelled.');
    }
}

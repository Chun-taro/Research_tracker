<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Payment;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_tenants' => Tenant::count(),
            'active_tenants' => Tenant::where('is_active', true)->count(),
            'total_users' => User::count(),
            'total_revenue' => Payment::where('status', 'paid')->sum('amount'),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
        ];

        $recent_tenants = Tenant::latest()->take(5)->get();

        $revenue_by_month = Payment::where('status', 'paid')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('SUM(amount) as total'))
            ->groupBy('month')
            ->get();

        $tier_distribution = Tenant::select('subscription_tier', DB::raw('count(*) as count'))
            ->groupBy('subscription_tier')
            ->get()
            ->pluck('count', 'subscription_tier');

        return Inertia::render('Landlord/Dashboard', [
            'stats' => $stats,
            'recentTenants' => $recent_tenants,
            'revenueByMonth' => $revenue_by_month,
            'tierDistribution' => $tier_distribution,
        ]);
    }
}

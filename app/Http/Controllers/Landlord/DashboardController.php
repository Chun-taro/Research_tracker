<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Payment;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use App\Services\SystemUpdateService;

class DashboardController extends Controller
{
    public function index(SystemUpdateService $updateService)
    {
        $updateStatus = $updateService->checkUpdate();
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

    public function systemHistory(SystemUpdateService $updateService)
    {
        return Inertia::render('Landlord/SystemHistory', [
            'updateStatus' => $updateService->checkUpdate(),
            'fullHistory' => $updateService->getHistory(30), // Get more items for the dedicated page
        ]);
    }

    public function rollback(Request $request)
    {
        $request->validate([
            'sha' => 'required|string',
        ]);

        try {
            $sha = $request->sha;

            // 1. Hard reset to the specific SHA
            shell_exec("git reset --hard {$sha} 2>&1");

            // 2. Run Landlord Migrations
            \Illuminate\Support\Facades\Artisan::call('migrate', [
                '--database' => 'landlord',
                '--path' => 'database/migrations/landlord',
                '--force' => true
            ]);

            // 3. Clear cache
            \Illuminate\Support\Facades\Artisan::call('cache:clear');

            return back()->with('success', "System core successfully rolled back to {$sha}.");
        } catch (\Exception $e) {
            return back()->with('error', 'Critical error during rollback: ' . $e->getMessage());
        }
    }
}

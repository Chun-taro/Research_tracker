<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Payment;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\Request;
use App\Models\SystemUpdateLog;

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
            'version' => config('app.version', 'v1.0.0'),
            'updateLogs' => SystemUpdateLog::latest()->take(5)->get(),
        ]);
    }

    public function updateTenants(Request $request)
    {
        $tenantCount = Tenant::count();
        $version = config('app.version', 'v1.0.0');

        // Create initial log entry
        $log = SystemUpdateLog::create([
            'version' => $version,
            'status' => 'pending',
            'tenant_count' => $tenantCount,
            'executed_by' => auth()->user()->name,
        ]);
        
        try {
            // Run migrations across all tenants
            Artisan::call('tenants:artisan', [
                'artisanCommand' => 'migrate --database=mysql --path=database/migrations/tenant --force'
            ]);

            $output = Artisan::output();
            
            // Sync version for ALL tenants
            Tenant::query()->update(['version' => $version]);
            
            $log->update([
                'status' => 'success',
                'output' => $output,
            ]);

            return back()->with('success', "Successfully triggered updates for {$tenantCount} departments. System is now synchronized.");
        } catch (\Exception $e) {
            $log->update([
                'status' => 'failed',
                'output' => $e->getMessage(),
            ]);
            return back()->with('error', "Failed to update departments: " . $e->getMessage());
        }
    }

    public function rollbackTenants(Request $request)
    {
        $tenantCount = Tenant::count();
        $version = config('app.version', 'v1.0.0');

        // Create log entry for rollback
        $log = SystemUpdateLog::create([
            'version' => $version,
            'status' => 'rollback_pending',
            'tenant_count' => $tenantCount,
            'executed_by' => auth()->user()->name,
        ]);

        try {
            // Rollback migrations across all tenants
            Artisan::call('tenants:artisan', [
                'artisanCommand' => 'migrate:rollback --database=mysql --path=database/migrations/tenant --force'
            ]);

            $output = Artisan::output();

            $log->update([
                'status' => 'rollback_success',
                'output' => $output,
            ]);

            return back()->with('success', "Successfully rolled back updates for {$tenantCount} departments.");
        } catch (\Exception $e) {
            $log->update([
                'status' => 'rollback_failed',
                'output' => $e->getMessage(),
            ]);
            return back()->with('error', "Failed to rollback departments: " . $e->getMessage());
        }
    }
}

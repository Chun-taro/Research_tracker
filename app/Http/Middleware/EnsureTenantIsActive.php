<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class EnsureTenantIsActive
{
    public function handle(Request $request, Closure $next)
    {
        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;

        // Smart Switch: If no tenant is found by domain, but user is logged in with a tenant_id,
        // we force that tenant to be current so the database switches correctly.
        if (!$tenant && Auth::check() && $tenantId = Auth::user()->tenant_id) {
            $userTenant = \App\Models\Tenant::on('landlord')->find($tenantId);
            if ($userTenant) {
                $userTenant->makeCurrent();
                $tenant = $userTenant;
            }
        }
        
        // Only block if a tenant is identified but is inactive.
        if ($tenant && !$tenant->is_active) {
            return \Inertia\Inertia::render('Errors/Inactive', [
                'message' => 'This tenant account is inactive. Please contact the system administrator to reactivate your workspace.',
                'type' => 'tenant'
            ]);
        }

        // Check if user is inactive (for logged in users)
        if ($request->user() && !$request->user()->is_active) {
            Auth::logout();
            return Inertia::render('Errors/Inactive', [
                'message' => 'Your personal account has been deactivated by the tenant administrator. Please contact your supervisor for details.',
                'type' => 'user'
            ]);
        }

        if ($tenant) {
            // Check if subscription is expired
            $isExpired = $tenant->subscription_expires_at && $tenant->subscription_expires_at->isPast();

            if ($isExpired) {
                $allowedRoutes = ['admin.billing.checkout', 'admin.billing.success', 'admin.billing.cancel', 'logout'];
                if (!$request->isMethod('GET') && !in_array($request->route()?->getName(), $allowedRoutes)) {
                    if ($request->wantsJson()) {
                        return response()->json(['message' => 'Subscription expired. Read-only mode active.'], 403);
                    }
                    return redirect()->back()->with('error', 'Your tenant subscription has expired. Please renew your plan to perform this action.');
                }
            }

            // Inject tenant info into all Inertia responses
            if (class_exists(\Inertia\Inertia::class)) {
                \Inertia\Inertia::share([
                    'tenant' => [
                        'id' => $tenant->id,
                        'name' => $tenant->name,
                        'slug' => $tenant->slug,
                        'logo_path' => $tenant->logo_path,
                        'theme_color' => $tenant->theme_color,
                        'subscription_tier' => $tenant->subscription_tier,
                    ],
                ]);
            }
        }

        return $next($request);
    }
}

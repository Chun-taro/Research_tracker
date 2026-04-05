<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;
        
        // Only block if a tenant is identified but is inactive.
        // If no tenant is found, we assume we are on the landlord domain or a route that doesn't require a tenant.
        if ($tenant && !$tenant->is_active) {
            abort(403, 'This department account is inactive or not found. Please contact the system administrator.');
        }

        if ($tenant) {
            // Check if version is out of date
            $isUpdateAvailable = $tenant->version !== config('app.version', 'v1.4.2');

            // Check if subscription is expired
            $isExpired = $tenant->subscription_expires_at && $tenant->subscription_expires_at->isPast();

            if ($isExpired) {
                $allowedRoutes = ['admin.billing.checkout', 'admin.billing.success', 'admin.billing.cancel', 'logout'];
                if (!$request->isMethod('GET') && !in_array($request->route()?->getName(), $allowedRoutes)) {
                    if ($request->wantsJson()) {
                        return response()->json(['message' => 'Subscription expired. Read-only mode active.'], 403);
                    }
                    return redirect()->back()->with('error', 'Your department subscription has expired. Please renew your plan to perform this action.');
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
                        'version' => $tenant->version,
                        'is_update_available' => $isUpdateAvailable,
                        'system_version' => config('app.version', 'v1.4.2'),
                    ],
                ]);
            }
        }

        return $next($request);
    }
}

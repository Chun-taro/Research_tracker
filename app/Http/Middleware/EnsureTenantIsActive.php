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

        if (!$tenant || !$tenant->is_active) {
            abort(403, 'This department account is inactive or not found.');
        }

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
                ],
            ]);
        }

        return $next($request);
    }
}

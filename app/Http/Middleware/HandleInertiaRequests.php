<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Tenant;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        // Resolve tenant from user or from request context (for guest landing pages)
        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;
        if (!$tenant && $user && $user->tenant_id) {
            $tenant = Tenant::find($user->tenant_id);
        }

        $isAdminOrLandlord = $user && ($user->role === 'admin' || $request->is('landlord*'));
        $updateCheck = $isAdminOrLandlord
            ? (new \App\Services\SystemUpdateService())->checkUpdate()
            : ['update_available' => false];
        $systemVersion = $isAdminOrLandlord
            ? (new \App\Services\SystemUpdateService())->getVersionTag()
            : null;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar_path' => $user->avatar_path,
                    'tenant_id' => $user->tenant_id,
                ] : null,
                'update_available' => $updateCheck['update_available'] ?? false,
            ],
            'tenant' => $tenant ? array_merge([
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'logo_path' => $tenant->logo_path,
                'theme_color' => $tenant->theme_color,
                'subscription_tier' => $tenant->subscription_tier,
            ], \App\Models\Landlord\SubscriptionTier::where('slug', $tenant->subscription_tier)->first()?->only(['features', 'limits']) ?? []) : null,
            'context' => $request->is('landlord*') ? 'landlord' : 'portal',
            'system_version' => $systemVersion,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}

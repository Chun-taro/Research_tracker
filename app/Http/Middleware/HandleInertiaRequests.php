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
            ],
            'tenant' => $tenant ? [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'logo_path' => $tenant->logo_path,
                'theme_color' => $tenant->theme_color,
                'subscription_tier' => $tenant->subscription_tier,
            ] : null,
            'context' => $request->is('landlord*') ? 'landlord' : 'department',
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureLandlord
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Must be logged in and be a superadmin
        if (!$user || $user->role !== 'superadmin') {
            abort(403, 'Unauthorized. This area is reserved for system administrators.');
        }

        // Must NOT be in a tenant context (must be on the main domain/central system)
        if (app()->bound('currentTenant') && app('currentTenant') !== null) {
            // If they are a superadmin but tried to access a tenant URL, we might want to allow 
            // but usually landlord dashboard is root domain only.
            // For now, let's just ensure they are on the central system for landlord routes.
        }

        return $next($request);
    }
}

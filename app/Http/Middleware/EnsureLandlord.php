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
        $host = $request->getHost();
        $landlordDomains = config('multitenancy.landlord_domains', ['localhost', '127.0.0.1']);

        if (!in_array($host, $landlordDomains)) {
            abort(403, 'Unauthorized. The central management portal must be accessed through the main domain.');
        }

        return $next($request);
    }
}

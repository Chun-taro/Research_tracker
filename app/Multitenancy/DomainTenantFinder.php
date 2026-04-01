<?php

namespace App\Multitenancy;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Spatie\Multitenancy\TenantFinder\TenantFinder;

class DomainTenantFinder extends TenantFinder
{
    public function findForRequest(Request $request): ?Tenant
    {
        $host = $request->getHost();

        // Try exact domain match first (custom domain or full subdomain)
        $tenant = Tenant::where('domain', $host)
            ->orWhere('custom_domain', $host)
            ->first();

        if ($tenant) {
            return $tenant;
        }

        // Try slug-based subdomain match: slug.*.* => extract first part
        $parts = explode('.', $host);
        if (count($parts) >= 2) {
            $slug = $parts[0];
            $tenant = Tenant::where('slug', $slug)->first();
        }

        return $tenant;
    }
}

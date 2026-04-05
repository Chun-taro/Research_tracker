<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use App\Models\SystemUpdateLog;

class SystemUpdateController extends Controller
{
    public function update(Request $request)
    {
        $tenant = app('currentTenant');
        $version = config('app.version', 'v1.4.2');

        if (!$tenant) {
            return back()->with('error', 'Tenant context not found.');
        }

        // Create log entry in Landlord DB
        $log = SystemUpdateLog::create([
            'version' => $version,
            'status' => 'tenant_pending',
            'tenant_count' => 1,
            'executed_by' => auth()->user()->name . " (" . $tenant->name . ")",
        ]);

        try {
            // Run migrations for THIS tenant only
            // Spatie multitenancy should already have the correct connection active
            Artisan::call('migrate', [
                '--database' => 'mysql',
                '--path' => 'database/migrations/tenant',
                '--force' => true,
            ]);

            $output = Artisan::output();

            // Update tenant version in Landlord DB
            $tenant->update(['version' => $version]);

            $log->update([
                'status' => 'tenant_success',
                'output' => "Tenant: {$tenant->name}\n\n" . $output,
            ]);

            return back()->with('success', 'Database updated successfully to version ' . $version);
        } catch (\Exception $e) {
            $log->update([
                'status' => 'tenant_failed',
                'output' => "Tenant: {$tenant->name}\n\nError: " . $e->getMessage(),
            ]);
            return back()->with('error', 'Failed to update database: ' . $e->getMessage());
        }
    }
}

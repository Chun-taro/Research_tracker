<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Tenant;
use App\Models\User;
use App\Models\Landlord\CentralUser;
use Illuminate\Support\Facades\DB;

echo "Starting Identity Cleanup (Restoring real emails to Tenant DBs)...\n";

$tenants = Tenant::all();

foreach ($tenants as $tenant) {
    echo "Processing Tenant: {$tenant->name} (DB: {$tenant->database})\n";
    
    try {
        // Switch to tenant DB
        config(["database.connections.mysql.database" => $tenant->database]);
        DB::purge('mysql');
        
        $anonymizedUsers = User::on('mysql')->where('email', '[ANONYMIZED]')->get();
        echo "Found " . $anonymizedUsers->count() . " anonymized users.\n";
        
        foreach ($anonymizedUsers as $user) {
            // Find corresponding CentralUser via hash or fallback (though we only have hash/ID)
            $centralUser = CentralUser::where('tenant_id', $tenant->id)
                ->where(DB::raw("SHA2(email, 256)"), $user->email_hash)
                ->first();
                
            if (!$centralUser) {
                // Try fallback: match only by hash across all central users if tenant_id didn't match (unlikely)
                 $centralUser = CentralUser::where(DB::raw("SHA2(email, 256)"), $user->email_hash)->first();
            }

            if ($centralUser) {
                echo "  Restoring email for: {$centralUser->name} -> {$centralUser->email}\n";
                $user->update(['email' => $centralUser->email]);
            } else {
                echo "  Warning: Could not find Central match for user hash: {$user->email_hash}\n";
            }
        }
    } catch (\Exception $e) {
        echo "  Error: " . $e->getMessage() . "\n";
    }
}

echo "\nCleanup Complete.\n";

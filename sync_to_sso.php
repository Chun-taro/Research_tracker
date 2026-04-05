<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\Tenant;
use App\Models\User;
use App\Models\Landlord\CentralUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

echo "--- STARTING SSO SYNC ---\n";

foreach (Tenant::all() as $tenant) {
    echo "Processing Tenant: {$tenant->name} ({$tenant->slug})\n";
    $tenant->makeCurrent();
    
    // Select users that have an email (not anonymized)
    $users = User::where('email', '!=', '[ANONYMIZED]')->get();
    
    foreach ($users as $user) {
        $realEmail = $user->email;
        $emailHash = hash('sha256', $realEmail);
        
        echo "  Syncing: {$realEmail}\n";
        
        // 1. Mirror to Landlord Hub
        CentralUser::updateOrCreate(
            ['email' => $realEmail, 'tenant_id' => $tenant->id],
            [
                'name' => $user->name,
                'password' => $user->password, // Password is already hashed in tenant DB
                'role' => $user->role,
                'is_active' => $user->is_active,
            ]
        );
        
        // 2. Update Tenant record with hash and anonymize
        $user->update([
            'email' => '[ANONYMIZED]',
            'email_hash' => $emailHash,
        ]);
    }
    
    $tenant->forget();
}

echo "--- SSO SYNC COMPLETED ---\n";

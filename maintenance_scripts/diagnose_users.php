<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Users in LANDLORD database (research_tracker):\n";
$users = \App\Models\User::on('landlord')->get();
foreach ($users as $u) {
    echo "- Email: " . $u->email . " | Role: " . $u->role . " | Tenant ID: " . $u->tenant_id . "\n";
}

echo "\nTenants available:\n";
$tenants = \App\Models\Tenant::all();
foreach ($tenants as $t) {
    echo "- ID: " . $t->id . " | Name: " . $t->name . " | DB: " . $t->database . "\n";
    
    // Attempt to check users in tenant DB
    try {
        config(["database.connections.mysql.database" => $t->database]);
        \Illuminate\Support\Facades\DB::purge('mysql');
        $tenantUsers = \App\Models\User::on('mysql')->get();
        echo "  Users in " . $t->database . ":\n";
        foreach ($tenantUsers as $tu) {
            echo "    * Email: " . $tu->email . " | Hash: " . ($tu->email_hash ?? 'N/A') . "\n";
        }
    } catch (\Exception $e) {
        echo "  Error checking " . $t->database . ": " . $e->getMessage() . "\n";
    }
}

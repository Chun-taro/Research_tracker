<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;

$tenants = Tenant::all();
foreach ($tenants as $tenant) {
    echo "Tenant: {$tenant->name} ({$tenant->slug})\n";
    $tenant->makeCurrent();
    $users = User::all();
    echo "Users count: " . $users->count() . "\n";
    foreach ($users as $user) {
        echo " - {$user->email} (Role: {$user->role})\n";
    }
    $tenant->forget();
    echo "-------------------\n";
}

<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\Tenant;
use App\Models\User;

foreach (Tenant::all() as $tenant) {
    echo "--- Tenant: {$tenant->name} ({$tenant->slug}) ---\n";
    $tenant->makeCurrent();
    
    $users = User::all();
    foreach ($users as $user) {
        echo "[{$user->role}] {$user->name} <{$user->email}>\n";
    }
    
    $tenant->forget();
    echo "\n";
}

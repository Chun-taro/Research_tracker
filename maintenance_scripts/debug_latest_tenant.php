<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Tenant;
use App\Models\User;

$tenant = Tenant::latest()->first();
if ($tenant) {
    echo "LATEST TENANT: " . $tenant->name . " (Slug: " . $tenant->slug . ")\n";
    $tenant->makeCurrent();
    $users = User::all();
    echo "USERS IN TENANT: " . $users->count() . "\n";
    foreach ($users as $user) {
        echo " - Email: " . $user->email . " | Role: " . $user->role . " | ID: " . $user->id . "\n";
    }
    $tenant->forget();
} else {
    echo "No tenants found.\n";
}

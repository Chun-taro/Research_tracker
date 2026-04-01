<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

$slug = "bspa"; // Change to the slug you're testing
$email = "dean@bspa.edu.ph"; // Change to the email you're testing
$password = "password"; // Default or specified password

$tenant = Tenant::where('slug', $slug)->first();
if (!$tenant) {
    die("Tenant not found\n");
}

$tenant->makeCurrent();

$user = User::where('email', $email)->first();
if (!$user) {
    echo "User NOT found in tenant DB\n";
} else {
    echo "User found: " . $user->name . "\n";
    echo "Role: " . $user->role . "\n";
    if (Hash::check($password, $user->password)) {
        echo "Password Match: YES\n";
    } else {
        echo "Password Match: NO\n";
    }
}

$tenant->forget();

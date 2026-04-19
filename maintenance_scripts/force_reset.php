<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$slug = 'bsnpa'; // Test the latest one
$tenant = Tenant::where('slug', $slug)->first();
if ($tenant) {
    echo "Updating tenant: " . $tenant->name . "\n";
    $tenant->makeCurrent();
    
    $user = User::where('email', 'admin@bsnpa.localhost')->first();
    if ($user) {
        $user->password = Hash::make('password'); // Hardcode to 'password'
        $user->save();
        echo "SUCCESS: Admin 'admin@bsnpa.localhost' password reset to 'password'\n";
    } else {
        echo "ERROR: Admin user not found in tenant DB\n";
    }
    $tenant->forget();
} else {
    echo "ERROR: Tenant not found\n";
}

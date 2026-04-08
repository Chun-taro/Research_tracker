<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$centralUser = \App\Models\Landlord\CentralUser::where('email', 'superadmin@researchtracker.com')->first();
var_dump($centralUser !== null);
var_dump(\Illuminate\Support\Facades\Hash::check('password', $centralUser->password));

try {
    $tenantUser = \App\Models\User::where('email', 'superadmin@researchtracker.com')->first();
    var_dump($tenantUser !== null);
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}

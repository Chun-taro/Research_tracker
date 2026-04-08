<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Tenant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Middleware\EnsureTenantIsActive;
use Illuminate\Http\Request;

echo "Starting Middleware Verification (Smart Switch)...\n";

// 1. Mock a logged in user with tenant_id = 1
$user = User::on('landlord')->where('tenant_id', 1)->first();
if (!$user) {
    die("Error: No user found for Tenant 1 in landlord DB.\n");
}
Auth::login($user);
echo "Logged in as: {$user->email} (Tenant ID: {$user->tenant_id})\n";

// 2. Mock a request
$request = Request::create('/dashboard', 'GET');

// 3. Run the middleware
$middleware = new EnsureTenantIsActive();
echo "Running Middleware...\n";

$middleware->handle($request, function($req) {
    echo "Middleware passed to next closure.\n";
    return new \Symfony\Component\HttpFoundation\Response();
});

// 4. Verify results
$currentTenant = app()->bound('currentTenant') ? app('currentTenant') : null;
if ($currentTenant) {
    echo "SUCCESS: currentTenant is bound! (ID: {$currentTenant->id}, Name: {$currentTenant->name})\n";
    $db = DB::connection('mysql')->getDatabaseName();
    echo "Current MySQL Database: {$db}\n";
    
    $tenantDb = $currentTenant->database;
    if ($db === $tenantDb) {
        echo "SUCCESS: Database connection correctly swapped to tenant DB!\n";
    } else {
        echo "FAILURE: Database connection still pointing to: {$db} (Expected: {$tenantDb})\n";
    }
} else {
    echo "FAILURE: currentTenant was not bound by the middleware.\n";
}

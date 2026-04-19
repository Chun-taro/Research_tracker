<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Landlord\CentralUser;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

echo "Starting Domain Separation Verification...\n";

function testLogin($email, $password, $host) {
    try {
        echo "Testing Login: Email=[{$email}], Host=[{$host}]... ";
        
        $request = LoginRequest::create('/login', 'POST', [
            'email' => $email,
            'password' => $password
        ]);
        
        // Mock the host
        $request->headers->set('host', $host);
        
        // We need to bypass the actual Auth::login for testing, but let's see if authenticate() throws
        $request->authenticate();
        echo "SUCCESS (Authenticated)\n";
    } catch (ValidationException $e) {
        $msg = $e->validator->errors()->first('email');
        echo "REJECTED: {$msg}\n";
    } catch (\Exception $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
}

// 1. Tenant Admin on Landlord Domain
testLogin('michaelangeloangeles0@gmail.com', 'password', '127.0.0.1');

// 2. Superadmin on Tenant Domain
testLogin('superadmin@researchtracker.com', 'password', 'bsit.localhost');

// 3. Superadmin on Landlord Domain
testLogin('superadmin@researchtracker.com', 'password', '127.0.0.1');

// 4. Tenant Admin on THEIR Tenant Domain
// Note: This requires the tenant for bsit.localhost to be resolved correctly in the test environment
// But since we are testing the Logic in LoginRequest, it should work if we mock currentTenant.
echo "Testing Tenant Admin on correct domain (with mock tenant)...\n";
$tenant = \App\Models\Tenant::on('landlord')->find(1);
$tenant->makeCurrent();
testLogin('michaelangeloangeles0@gmail.com', 'password', 'bsit.localhost');

echo "\nVerification Complete.\n";

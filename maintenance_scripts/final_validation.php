<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Http\Requests\Auth\LoginRequest;

function check($email, $host, $shouldSucceed) {
    try {
        $req = LoginRequest::create('/login', 'POST', ['email' => $email, 'password' => 'password']);
        $req->headers->set('host', $host);
        
        // Mock tenant resolution for tenant domains
        if ($host === 'bsit.localhost') {
            $t = \App\Models\Tenant::on('landlord')->where('domain', 'like', 'bsit.localhost%')->first();
            if ($t) $t->makeCurrent();
        }

        $req->authenticate();
        $isSuccess = true;
    } catch (\Exception $e) {
        $isSuccess = false;
        $error = $e->getMessage();
    }

    if ($isSuccess === $shouldSucceed) {
        echo "[PASS] {$email} on {$host}\n";
    } else {
        echo "[FAIL] {$email} on {$host}. Expected " . ($shouldSucceed ? 'SUCCESS' : 'FAILURE') . " but got " . ($isSuccess ? 'SUCCESS' : 'FAILURE: ' . $error) . "\n";
    }
}

echo "Running Final Validation...\n";
check('superadmin@researchtracker.com', '127.0.0.1', true); // Superadmin on central
check('michaelangeloangeles0@gmail.com', '127.0.0.1', false); // Tenant Admin on central (Should fail, not in landlord DB)
check('michaelangeloangeles0@gmail.com', 'bsit.localhost', true); // Tenant Admin on tenant domain (Should succeed from tenant DB)
check('superadmin@researchtracker.com', 'bsit.localhost', false); // Superadmin on tenant domain (Should fail, not in tenant DB)

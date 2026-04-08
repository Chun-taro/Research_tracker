<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Http\Requests\Auth\LoginRequest;

function check($email, $host) {
    $req = LoginRequest::create('/login', 'POST', [
        'email' => $email,
        'password' => 'password'
    ]);
    $req->headers->set('host', $host);
    $host = $req->getHost();
    $landlordDomains = config('multitenancy.landlord_domains', ['localhost', '127.0.0.1']);
    $isLandlordDomain = in_array($host, $landlordDomains);
    
    echo "Debug: Host=[$host], IsLandlord=[" . ($isLandlordDomain ? 'Y' : 'N') . "]\n";
    
    try {
        $req->authenticate();
        echo "[{$email}] on [{$host}]: SUCCESS\n";
    } catch (\Exception $e) {
        echo "[{$email}] on [{$host}]: REJECTED - " . $e->getMessage() . "\n";
    }
}

echo "Verification Results:\n";
check('michaelangeloangeles0@gmail.com', '127.0.0.1'); // Tenant admin on landlord domain
check('superadmin@researchtracker.com', 'bsit.localhost'); // Superadmin on tenant domain
check('superadmin@researchtracker.com', '127.0.0.1'); // Superadmin on landlord domain

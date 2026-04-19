<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Landlord\CentralUser;
use Illuminate\Support\Facades\DB;

echo "Starting Landlord Database Cleanup (User Isolation Transition)...\n";

$count = CentralUser::whereNotNull('tenant_id')->count();
echo "Found {$count} tenant-specific users in Landlord database.\n";

if ($count > 0) {
    echo "Purging... ";
    CentralUser::whereNotNull('tenant_id')->delete();
    echo "Done.\n";
} else {
    echo "No tenant users found in Landlord database. Already clean.\n";
}

$remaining = CentralUser::count();
echo "Total users remaining in Landlord database: {$remaining} (These should be Superadmins).\n";

echo "\nCleanup Complete.\n";

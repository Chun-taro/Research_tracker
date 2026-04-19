<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Tenant;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

echo "Starting Database Refactoring (Removing Versioning)...\n";

// 1. Remove 'version' from 'tenants' table (Landlord DB)
echo "Updating 'tenants' table in Landlord DB...\n";
if (Schema::connection('landlord')->hasColumn('tenants', 'version')) {
    Schema::connection('landlord')->table('tenants', function (Blueprint $table) {
        $table->dropColumn('version');
    });
    echo "Removed 'version' column from tenants table.\n";
} else {
    echo "'version' column already absent from tenants table.\n";
}

// 2. Drop 'system_update_logs' from Landlord DB
echo "Dropping 'system_update_logs' table...\n";
Schema::connection('landlord')->dropIfExists('system_update_logs');

// 3. Update 'submissions' table in all Tenant DBs
echo "Updating Tenant DBs...\n";
$tenants = Tenant::all();

foreach ($tenants as $tenant) {
    echo "Processing Tenant: {$tenant->name}...\n";
    $tenant->makeCurrent();
    
    // Add columns to submissions
    if (!Schema::connection('mysql')->hasColumn('submissions', 'file_path')) {
        Schema::connection('mysql')->table('submissions', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('remarks');
            $table->string('file_name')->nullable()->after('file_path');
            $table->string('file_type')->nullable()->after('file_name');
            $table->unsignedBigInteger('file_size')->nullable()->after('file_type');
            $table->unsignedBigInteger('uploaded_by')->nullable()->after('file_size');
        });
        echo "Added file columns to 'submissions' table.\n";
    }

    // Optional: Migrate existing latest version data if needed
    // (Skipping complex data migration for now to prioritize schema cleanup)

    // Drop submission_versions table
    Schema::connection('mysql')->dropIfExists('submission_versions');
    echo "Dropped 'submission_versions' table.\n";
    
    $tenant->forget();
}

echo "\nDatabase Refactoring Complete.\n";

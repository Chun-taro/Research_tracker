<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Tenant;
use App\Models\User;

$output = "# 🔐 System Admin Accounts\n\n";
$output .= "This file contains the administrative credentials for the Central System and all Departmental databases.\n\n";

// 1. Central System (Landlord)
$output .= "## 🏢 Central Management (Landlord)\n";
$output .= "| Name | Email | Role | URL |\n";
$output .= "| :--- | :--- | :--- | :--- |\n";

// Super Admin is in the landlord 'users' table
$superadmins = User::on('landlord')->where('role', 'superadmin')->get();
foreach ($superadmins as $admin) {
    $output .= "| {$admin->name} | `{$admin->email}` | **Super Admin** | `http://localhost:8000/login` |\n";
}
$output .= "\n---\n\n";

// 2. Departmental Systems (Tenants)
$output .= "## 🎓 Departmental Systems (Tenants)\n";
$tenants = Tenant::all();

foreach ($tenants as $tenant) {
    $output .= "### 🏛️ {$tenant->name}\n";
    $output .= "- **Slug:** `{$tenant->slug}`\n";
    $output .= "- **URL:** `http://{$tenant->domain}:8000/login`\n\n";
    
    $output .= "| Name | Email | Role | Status |\n";
    $output .= "| :--- | :--- | :--- | :--- |\n";
    
    $tenant->makeCurrent();
    $users = User::where('role', 'admin')->get();
    foreach ($users as $user) {
        $status = $user->is_active ? "✅ Active" : "❌ Inactive";
        $output .= "| {$user->name} | `{$user->email}` | **Admin** | {$status} |\n";
    }
    
    if ($users->isEmpty()) {
        $output .= "| *No Admin Created* | - | - | - |\n";
    }
    $tenant->forget();
    $output .= "\n\n";
}

$output .= "\n> [!IMPORTANT]\n";
$output .= "> **Default Password:** The default password for all newly created accounts is `password` unless otherwise specified during creation.\n";

file_put_contents('admin_accounts.md', $output);
echo "Admin accounts file generated: admin_accounts.md\n";

<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$tenants = \App\Models\Tenant::all();
foreach ($tenants as $t) {
    echo "ID: " . $t->id . "\n";
    echo "Name: " . $t->name . "\n";
    echo "Slug: " . $t->slug . "\n";
    echo "Domain: " . $t->domain . "\n";
    echo "Database: " . $t->database . "\n";
    echo "-------------------\n";
}

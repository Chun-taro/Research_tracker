<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$t = \App\Models\Tenant::find(1);
if ($t) {
    echo "Domain: [" . $t->domain . "]\n";
    echo "Slug: [" . $t->slug . "]\n";
} else {
    echo "Tenant 1 not found.\n";
}

<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$service = new App\Services\SystemUpdateService();
$result = $service->checkUpdate();

echo "Current Hash: " . $service->getCurrentVersion() . "\n";
echo "Latest Hash: " . $result['latest_hash'] . "\n";
echo "Update Available: " . ($result['update_available'] ? 'YES' : 'NO') . "\n";
if (isset($result['error'])) {
    echo "Error: " . $result['error'] . "\n";
}

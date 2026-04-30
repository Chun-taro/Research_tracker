<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $tenantId = app()->bound('currentTenant') ? app('currentTenant')->id : null;

        if (!$tenantId) {
            return;
        }

        Module::factory()
            ->count(50)
            ->state(['tenant_id' => $tenantId])
            ->create();
    }
}

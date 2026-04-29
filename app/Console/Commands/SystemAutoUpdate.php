<?php
namespace App\Console\Commands;

use App\Services\SystemUpdateService;
use Illuminate\Console\Command;

class SystemAutoUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:auto-update {--force : Run update even if no new version is detected}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically checks for updates on GitHub and applies them if found.';

    /**
     * Execute the console command.
     */
    public function handle(SystemUpdateService $updateService)
    {
        $this->info('Checking for system updates...');

        $status = $updateService->checkUpdate();

        if (isset($status['update_available']) && $status['update_available'] || $this->option('force')) {
            $this->info('Update detected! Applying changes...');
            
            $result = $updateService->performUpdate();

            if ($result['success']) {
                $this->info('System updated successfully!');
                
                // Detailed output log
                if (isset($result['output'])) {
                    foreach ($result['output'] as $key => $out) {
                        $this->line("<fg=blue>[{$key}]</> " . trim($out));
                    }
                }
            } else {
                $this->error('Failed to apply update: ' . $result['error']);
                return 1;
            }
        } else {
            $this->info('System is already up to date.');
        }

        return 0;
    }
}

<?php
namespace App\Console\Commands;

/**
 * Test Version: 1.0.2 - Watch Mode Test
 */

use App\Services\SystemUpdateService;
use Illuminate\Console\Command;

class SystemAutoUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:auto-update 
                            {--force : Run update even if no new version is detected} 
                            {--watch : Keep running and check for updates continuously}
                            {--interval=60 : Seconds to wait between checks when watching}';

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
        $watch = $this->option('watch');
        $interval = (int) $this->option('interval');

        if ($watch) {
            $this->info("Entering watch mode. Checking for updates every {$interval} seconds...");
            while (true) {
                $this->checkAndApply($updateService);
                sleep($interval);
            }
        } else {
            return $this->checkAndApply($updateService);
        }
    }

    /**
     * Check for updates and apply if found.
     */
    protected function checkAndApply(SystemUpdateService $updateService)
    {
        $this->line('[' . now()->toDateTimeString() . '] Checking for updates...');

        // Force a fresh check from GitHub, bypassing the 1-minute cache
        $status = $updateService->checkUpdate(true);

        if (isset($status['update_available']) && $status['update_available'] || $this->option('force')) {
            $this->info('Update detected! Applying changes...');
            
            $result = $updateService->performUpdate();

            if ($result['success']) {
                $this->info('System updated successfully!');
                
                if (isset($result['output'])) {
                    foreach ($result['output'] as $key => $out) {
                        $this->line("<fg=blue>[{$key}]</> " . trim($out));
                    }
                }
                return 0;
            } else {
                $this->error('Failed to apply update: ' . $result['error']);
                return 1;
            }
        }

        $this->line('System is up to date.');
        return 0;
    }
}

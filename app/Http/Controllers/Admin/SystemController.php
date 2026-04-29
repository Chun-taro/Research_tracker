<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SystemUpdateService;
use Inertia\Inertia;

class SystemController extends Controller
{
    public function checkJson(SystemUpdateService $updateService)
    {
        return response()->json($updateService->checkUpdate());
    }

    public function updates(SystemUpdateService $updateService)
    {
        $versionTag = $updateService->getVersionTag();
        $updateStatus = $updateService->checkUpdate();
        $history = $updateService->getHistory(20);

        // Map commit history into a changelog format the Updates page expects
        $changelog = collect($history)->map(function ($commit) {
            $message = $commit['message'] ?? '';

            // Derive type from conventional commit prefix
            $type = 'Update';
            if (str_starts_with($message, 'feat'))     $type = 'Feature';
            elseif (str_starts_with($message, 'fix'))  $type = 'Fix';
            elseif (str_starts_with($message, 'sec'))  $type = 'Security';
            elseif (str_starts_with($message, 'docs')) $type = 'Docs';
            elseif (str_starts_with($message, 'chore') || str_starts_with($message, 'refactor')) $type = 'Maintenance';

            // Strip conventional commit prefix (e.g., "feat: ", "fix(scope): ")
            $title = preg_replace('/^[a-z]+(\([^)]+\))?:\s*/i', '', $message);
            $title = ucfirst(trim(strtok($title, "\n")));

            return [
                'sha'     => $commit['sha'] ?? '',
                'url'     => $commit['url'] ?? '#',
                'version' => $commit['sha'] ?? '',
                'date'    => isset($commit['date']) ? substr($commit['date'], 0, 10) : '',
                'type'    => $type,
                'title'   => $title ?: $message,
                'is_current' => $commit['is_current'] ?? false,
            ];
        })->values()->toArray();

        return Inertia::render('Admin/System/Updates', [
            'system_version' => $versionTag,
            'update_status'  => $updateStatus,
            'changelog'      => $changelog,
        ]);
    }

    public function applyUpdate()
    {
        try {
            // 1. Run git pull to fetch the latest codebase
            $output = shell_exec('git pull origin main 2>&1');
            
            // 2. Run Landlord Migrations to ensure DB schema is up-to-date
            \Illuminate\Support\Facades\Artisan::call('migrate', [
                '--database' => 'landlord',
                '--path' => 'database/migrations/landlord',
                '--force' => true
            ]);

            // 3. Clear cache to force fresh state
            \Illuminate\Support\Facades\Artisan::call('cache:clear');

            if (str_contains($output, 'up to date')) {
                return back()->with('success', 'System is already up to date. Migrations verified.');
            }

            return back()->with('success', 'Update applied and database migrated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to apply update: ' . $e->getMessage());
        }
    }

    public function rollback(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'sha' => 'required|string',
        ]);

        try {
            $sha = $request->sha;

            // 1. Hard reset to the specific SHA
            shell_exec("git reset --hard {$sha} 2>&1");

            // 2. Run Landlord Migrations
            \Illuminate\Support\Facades\Artisan::call('migrate', [
                '--database' => 'landlord',
                '--path' => 'database/migrations/landlord',
                '--force' => true
            ]);

            // 3. Clear cache
            \Illuminate\Support\Facades\Artisan::call('cache:clear');

            return back()->with('success', "System rolled back to {$sha} successfully!");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to rollback: ' . $e->getMessage());
        }
    }
}

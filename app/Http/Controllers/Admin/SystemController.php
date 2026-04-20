<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SystemUpdateService;
use Inertia\Inertia;

class SystemController extends Controller
{
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
}

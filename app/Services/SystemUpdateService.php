<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class SystemUpdateService
{
    protected $repoOwner;
    protected $repoName;
    protected $branch;
    protected $token;

    public function __construct()
    {
        $this->repoOwner = config('services.github.owner', 'Chun-taro');
        $this->repoName = config('services.github.repo', 'Research_tracker');
        $this->branch = config('services.github.branch', 'main');
        $this->token = env('GITHUB_TOKEN');
    }

    /**
     * Get the current local commit hash.
     */
    public function getCurrentVersion()
    {
        try {
            return trim(shell_exec('git rev-parse HEAD'));
        } catch (\Exception $e) {
            return 'unknown';
        }
    }

    /**
     * Check for updates from GitHub.
     */
    public function checkUpdate()
    {
        return Cache::remember('github_update_check', 3600, function () {
            $currentHash = $this->getCurrentVersion();
            $latestData = $this->fetchLatestCommit();

            if (!$latestData) {
                return [
                    'update_available' => false,
                    'error' => 'Could not connect to GitHub',
                ];
            }

            $latestHash = $latestData['sha'] ?? null;
            $isNewer = $latestHash && $latestHash !== $currentHash;

            return [
                'update_available' => $isNewer,
                'current_hash' => substr($currentHash, 0, 7),
                'latest_hash' => substr($latestHash, 0, 7),
                'latest_message' => $latestData['commit']['message'] ?? '',
                'latest_date' => $latestData['commit']['author']['date'] ?? '',
                'repo_url' => "https://github.com/{$this->repoOwner}/{$this->repoName}",
                'history' => $this->getHistory(),
            ];
        });
    }

    /**
     * Get recent commit history.
     */
    public function getHistory($limit = 5)
    {
        try {
            $url = "https://api.github.com/repos/{$this->repoOwner}/{$this->repoName}/commits";
            $response = Http::withHeaders($this->getHeaders())
                ->get($url, [
                    'sha' => $this->branch,
                    'per_page' => $limit
                ]);

            if ($response->successful()) {
                $currentHash = $this->getCurrentVersion();
                return collect($response->json())->map(function($commit) use ($currentHash) {
                    return [
                        'sha' => substr($commit['sha'], 0, 7),
                        'full_sha' => $commit['sha'],
                        'message' => $commit['commit']['message'],
                        'author' => $commit['commit']['author']['name'],
                        'date' => $commit['commit']['author']['date'],
                        'is_current' => $commit['sha'] === $currentHash,
                        'url' => $commit['html_url'],
                    ];
                });
            }
        } catch (\Exception $e) {}

        return [];
    }

    /**
     * Get common headers for GitHub API.
     */
    protected function getHeaders()
    {
        $headers = [
            'User-Agent' => 'ResearchTracker-SaaS-Update-Check',
            'Accept' => 'application/vnd.github.v3+json',
        ];

        if ($this->token) {
            $headers['Authorization'] = 'token ' . $this->token;
        }

        return $headers;
    }

    /**
     * Fetch the latest commit from GitHub API.
     */
    protected function fetchLatestCommit()
    {
        try {
            $url = "https://api.github.com/repos/{$this->repoOwner}/{$this->repoName}/commits/{$this->branch}";
            $response = Http::withHeaders($this->getHeaders())->get($url);

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            // Silently fail, we'll return false
        }

        return null;
    }
}

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
        
        // Break cache automatically if a new git commit/pull is detected
        $this->autoInvalidateCacheIfUpdated();
    }

    /**
     * Automatically clears version caches if the local branch has advanced (git pull / commit).
     */
    protected function autoInvalidateCacheIfUpdated()
    {
        $currentHash = $this->getCurrentVersion();
        $cachedHash = Cache::get('system_last_known_hash');
        
        // Also check the raw local tag to detect tag-only changes
        $currentTag = $this->getRawLocalTag();
        $cachedTag = Cache::get('system_last_known_tag');
        
        $hashChanged = ($cachedHash && $currentHash !== 'unknown' && $currentHash !== $cachedHash);
        $tagChanged = ($cachedTag && $currentTag !== 'unknown' && $currentTag !== $cachedTag);

        if ($hashChanged || $tagChanged) {
            // Codebase or Tags changed! Bust the versioning and update caches instantly.
            Cache::forget('app_version_tag');
            Cache::forget('github_update_check');
        }
        
        if ($currentHash !== 'unknown') {
            Cache::put('system_last_known_hash', $currentHash);
        }
        if ($currentTag !== 'unknown') {
            Cache::put('system_last_known_tag', $currentTag);
        }
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
     * Get the raw local tag without caching.
     */
    protected function getRawLocalTag()
    {
        try {
            $tag = trim(shell_exec('git describe --tags --abbrev=0 2>&1'));
            if ($tag && !str_contains($tag, 'fatal') && !str_contains($tag, 'No names')) {
                return $tag;
            }
        } catch (\Exception $e) {
            // fall through
        }
        return 'unknown';
    }

    /**
     * Get the current version as a human-readable tag (e.g., v1.0.0).
     * Tries local git tags first, then falls back to the GitHub Releases API.
     */
    public function getVersionTag(): string
    {
        return Cache::remember('app_version_tag', 10, function () {
            // 1. Try local git describe (fast, no network)
            try {
                $tag = trim(shell_exec('git describe --tags --abbrev=0 2>&1'));
                if ($tag && !str_contains($tag, 'fatal') && !str_contains($tag, 'No names')) {
                    return $tag;
                }
            } catch (\Exception $e) {
                // continue to fallback
            }

            // 2. Try GitHub Releases API
            try {
                $url = "https://api.github.com/repos/{$this->repoOwner}/{$this->repoName}/releases/latest";
                $response = Http::withHeaders($this->getHeaders())->get($url);
                if ($response->successful()) {
                    return $response->json('tag_name', 'v1.0.0');
                }
            } catch (\Exception $e) {
                // continue to fallback
            }

            return 'v1.0.0';
        });
    }

    /**
     * Check for updates from GitHub.
     */
    public function checkUpdate($force = false)
    {
        if ($force) {
            Cache::forget('github_update_check');
        }

        return Cache::remember('github_update_check', 1, function () {
            $currentHash = $this->getCurrentVersion();
            $latestData = $this->fetchLatestCommit();

            if (!$latestData) {
                \Log::warning("SystemUpdateService: Failed to fetch latest commit from GitHub.");
                return [
                    'update_available' => false,
                    'error' => 'Could not connect to GitHub',
                ];
            }

            $latestHash = $latestData['sha'] ?? null;
            $isNewer = $latestHash && trim($latestHash) !== trim($currentHash);

            \Log::info("SystemUpdateService Check: Local={$currentHash}, Remote={$latestHash}, UpdateAvailable=" . ($isNewer ? 'YES' : 'NO'));

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
        // GitHub API First (Authoritative Source)
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
        } catch (\Exception $e) {
            \Log::info("SystemUpdateService: GitHub API unavailable, falling back to local history.");
        }

        // Local Fallback (if GitHub is unreachable or rate limited)
        return $this->getLocalHistory($limit);
    }

    /**
     * Get history from local git repository.
     */
    protected function getLocalHistory($limit = 5)
    {
        // Survival check: Is this even a git repository?
        if (!is_dir(base_path('.git'))) {
            return [];
        }

        try {
            $currentHash = $this->getCurrentVersion();
            
            // Check if git is available in the path
            $gitCheck = shell_exec("git --version 2>&1");
            if (!$gitCheck || str_contains($gitCheck, 'not found') || str_contains($gitCheck, 'not recognized')) {
                return [];
            }

            $output = shell_exec("git log -n {$limit} --pretty=format:\"%h|%H|%s|%an|%ai\" 2>&1");
            
            if (!$output || str_contains($output, 'fatal:')) {
                return [];
            }

            $commits = explode("\n", trim($output));
            return collect($commits)->map(function($line) use ($currentHash) {
                $parts = explode('|', $line);
                if (count($parts) < 5) return null;

                return [
                    'sha' => $parts[0],
                    'full_sha' => $parts[1],
                    'message' => $parts[2],
                    'author' => $parts[3],
                    'date' => $parts[4],
                    'is_current' => $parts[1] === $currentHash,
                    'url' => "https://github.com/{$this->repoOwner}/{$this->repoName}/commit/{$parts[1]}",
                ];
            })->filter()->values();
        } catch (\Exception $e) {
            \Log::warning("SystemUpdateService: Failed to fetch local git history. " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get common headers for GitHub API.
     */
    protected function fetchLatestCommit()
    {
        try {
            $url = "https://api.github.com/repos/{$this->repoOwner}/{$this->repoName}/commits/{$this->branch}";
            $response = Http::withHeaders($this->getHeaders())->get($url);

            if ($response->successful()) {
                return $response->json();
            }

            \Log::error("SystemUpdateService: GitHub API returned status {$response->status()}: " . $response->body());
        } catch (\Exception $e) {
            \Log::error("SystemUpdateService: Connection error: " . $e->getMessage());
        }

        return null;
    }

    protected function getHeaders()
    {
        $headers = [
            'User-Agent' => 'ResearchTracker-SaaS-Update-Check',
            'Accept' => 'application/vnd.github.v3+json',
        ];

        if ($this->token) {
            // Support both 'token' and 'Bearer' formats; Bearer is modern standard
            $headers['Authorization'] = str_starts_with($this->token, 'github_pat') 
                ? 'Bearer ' . $this->token 
                : 'token ' . $this->token;
        }

        return $headers;
    }
    /**
     * Create a new Git Tag on GitHub.
     */
    public function publishTag($tagName)
    {
        $currentSha = $this->getCurrentVersion();
        if ($currentSha === 'unknown') {
            throw new \Exception("Cannot publish tag: Local Git version is unknown.");
        }

        try {
            // 1. Create a Tag Object (Lightweight tags just need a ref)
            // POST /repos/{owner}/{repo}/git/refs
            $url = "https://api.github.com/repos/{$this->repoOwner}/{$this->repoName}/git/refs";
            
            $response = Http::withHeaders($this->getHeaders())->post($url, [
                'ref' => "refs/tags/{$tagName}",
                'sha' => $currentSha
            ]);

            if ($response->successful()) {
                // Bust the version cache immediately
                Cache::forget('app_version_tag');
                Cache::forget('github_update_check');
                return true;
            }

            $error = $response->json('message', 'Unknown GitHub Error');
            if ($error && str_contains($error, 'already exists')) {
                throw new \Exception("The tag '{$tagName}' already exists on GitHub.");
            }

            throw new \Exception("GitHub API Error: " . ($error ?? 'Unknown error'));
        } catch (\Exception $e) {
            throw new \Exception("Failed to publish tag: " . $e->getMessage());
        }
    }
    /**
     * Perform the actual update process.
     */
    public function performUpdate()
    {
        // Increase execution time for heavy tasks
        set_time_limit(600);

        $results = [];

        try {
            // 1. Git Pull
            $results['git'] = shell_exec('git pull origin ' . $this->branch . ' 2>&1');
            
            // 2. Composer Install
            $results['composer'] = shell_exec('composer install --no-interaction --prefer-dist 2>&1');

            // 3. NPM Install & Build
            $results['npm'] = shell_exec('npm install && npm run build 2>&1');

            // 4. Migrations
            \Illuminate\Support\Facades\Artisan::call('migrate', [
                '--database' => 'landlord',
                '--path' => 'database/migrations/landlord',
                '--force' => true
            ]);
            $results['migrate'] = \Illuminate\Support\Facades\Artisan::output();

            // 5. Clear Cache
            \Illuminate\Support\Facades\Artisan::call('cache:clear');
            \Illuminate\Support\Facades\Artisan::call('view:clear');
            \Illuminate\Support\Facades\Artisan::call('config:clear');

            // Bust version cache
            Cache::forget('app_version_tag');
            Cache::forget('github_update_check');

            return [
                'success' => true,
                'output' => $results,
            ];
        } catch (\Exception $e) {
            \Log::error("SystemUpdateService: Update failed - " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}

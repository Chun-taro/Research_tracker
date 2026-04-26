<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Multitenancy\Http\Middleware\NeedsTenant;
use Spatie\Multitenancy\Http\Middleware\EnsureValidTenantSession;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'tenant' => NeedsTenant::class,
            'tenant.session' => EnsureValidTenantSession::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'tenant.active' => \App\Http\Middleware\EnsureTenantIsActive::class,
            'landlord' => \App\Http\Middleware\EnsureLandlord::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                $status = $e->getStatusCode();
                
                if (in_array($status, [403, 404, 500, 503])) {
                    return \Inertia\Inertia::render('Errors/Error', [
                        'status' => $status,
                        'message' => app()->environment('local') ? $e->getMessage() : null,
                    ]);
                }
            }
            return null;
        });
    })->create();

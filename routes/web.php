<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ResearchCycleController;
use App\Http\Controllers\Admin\ResearchGroupController;
use App\Http\Controllers\Admin\TemplateController;
use App\Http\Controllers\Admin\SubmissionController;
use App\Http\Controllers\Admin\RepositoryController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Support\SupportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page - check if active if tenant is detected
Route::middleware(['tenant.active'])->get('/', function () {
    if (app()->bound('currentTenant') && app('currentTenant')) {
        return Inertia::render('TenantWelcome');
    }
    return Inertia::render('Welcome');
});

// Authenticated + Tenant routes
Route::middleware(['auth', 'verified', 'tenant.active'])->group(function () {

    // Dashboard - redirects based on role
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ------- ADMIN ROUTES -------
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {

        // User Management
        Route::resource('users', UserController::class);
        Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');

        // Research Cycles
        Route::resource('cycles', ResearchCycleController::class);

        // Research Groups
        Route::resource('groups', ResearchGroupController::class);
        Route::post('groups/{group}/assign-adviser', [ResearchGroupController::class, 'assignAdviser'])->name('groups.assign-adviser');
        Route::post('groups/{group}/assign-panelist', [ResearchGroupController::class, 'assignPanelist'])->name('groups.assign-panelist');

        // Templates
        Route::resource('templates', TemplateController::class);
        Route::get('templates/{template}/download', [TemplateController::class, 'download'])->name('templates.download');

        // Submissions (admin review)
        Route::get('submissions', [SubmissionController::class, 'index'])->name('submissions.index');
        Route::get('submissions/{submission}', [SubmissionController::class, 'show'])->name('submissions.show');
        Route::post('submissions/{submission}/approve', [SubmissionController::class, 'approve'])->name('submissions.approve');
        Route::post('submissions/{submission}/reject', [SubmissionController::class, 'reject'])->name('submissions.reject');
        Route::post('submissions/{submission}/request-revision', [SubmissionController::class, 'requestRevision'])->name('submissions.request-revision');

        // Repository
        Route::resource('repository', RepositoryController::class);
        Route::get('repository/{repository}/download', [RepositoryController::class, 'download'])->name('repository.download');

        // Schedules
        Route::resource('schedules', ScheduleController::class);

        // Reports
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/pdf', [ReportController::class, 'downloadPdf'])->name('reports.pdf');
        Route::get('reports/csv', [ReportController::class, 'downloadCsv'])->name('reports.csv');

        // Settings
        Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::patch('settings', [SettingsController::class, 'update'])->name('settings.update');

        // Billing
        Route::get('billing', [\App\Http\Controllers\TenantSubscriptionController::class, 'index'])->name('billing.index');
        Route::post('billing/checkout', [\App\Http\Controllers\TenantSubscriptionController::class, 'checkout'])->name('billing.checkout');
        Route::get('billing/success', [\App\Http\Controllers\TenantSubscriptionController::class, 'success'])->name('billing.success');
        Route::get('billing/cancel', [\App\Http\Controllers\TenantSubscriptionController::class, 'cancel'])->name('billing.cancel');


        // System Updates & Version Info
        Route::get('system/updates', [\App\Http\Controllers\Admin\SystemController::class, 'updates'])->name('system.updates');
        Route::post('system/updates/apply', [\App\Http\Controllers\Admin\SystemController::class, 'applyUpdate'])->name('system.updates.apply');
        Route::post('system/updates/rollback', [\App\Http\Controllers\Admin\SystemController::class, 'rollback'])->name('system.updates.rollback');
    });

    // ------- LANDLORD (CENTRAL SYSTEM) ROUTES -------
    Route::middleware(['landlord'])->prefix('landlord')->name('landlord.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Landlord\DashboardController::class, 'index'])->name('dashboard');
        
        // Tenant Management
        Route::get('/tenants', [App\Http\Controllers\Landlord\TenantController::class, 'index'])->name('tenants.index');
        Route::post('/tenants', [App\Http\Controllers\Landlord\TenantController::class, 'store'])->name('tenants.store');
        Route::patch('/tenants/{tenant}', [App\Http\Controllers\Landlord\TenantController::class, 'update'])->name('tenants.update');
        Route::delete('/tenants/{tenant}', [App\Http\Controllers\Landlord\TenantController::class, 'destroy'])->name('tenants.destroy');
        Route::post('/tenants/{tenant}/subscription', [App\Http\Controllers\Landlord\TenantController::class, 'mockSubscription'])->name('tenants.mock-subscription');

        // Subscription Plans Management
        Route::get('/plans', [App\Http\Controllers\Landlord\SubscriptionTierController::class, 'index'])->name('plans.index');
        Route::post('/plans', [App\Http\Controllers\Landlord\SubscriptionTierController::class, 'store'])->name('plans.store');
        Route::patch('/plans/{plan}', [App\Http\Controllers\Landlord\SubscriptionTierController::class, 'update'])->name('plans.update');
        Route::delete('/plans/{plan}', [App\Http\Controllers\Landlord\SubscriptionTierController::class, 'destroy'])->name('plans.destroy');

        // Revenue & Subscriptions Monitoring
        Route::get('/subscriptions', [\App\Http\Controllers\Landlord\SubscriptionController::class, 'index'])->name('subscriptions.index');

        // System History
        Route::get('/system-history', [\App\Http\Controllers\Landlord\DashboardController::class, 'systemHistory'])->name('system-history');

        // Support Tickets Management
        Route::get('/tickets', [\App\Http\Controllers\Landlord\SupportController::class, 'index'])->name('tickets.index');
        Route::patch('/tickets/{ticket}', [\App\Http\Controllers\Landlord\SupportController::class, 'update'])->name('tickets.update');

        // Rollback
        Route::post('/system/rollback', [\App\Http\Controllers\Landlord\DashboardController::class, 'rollback'])->name('system-rollback');
    });

    // ------- ADVISER ROUTES -------
    Route::middleware(['role:adviser'])->prefix('adviser')->name('adviser.')->group(function () {
        Route::get('groups', [ResearchGroupController::class, 'adviserIndex'])->name('groups.index');
        Route::get('submissions', [SubmissionController::class, 'adviserIndex'])->name('submissions.index');
        Route::get('submissions/{submission}', [SubmissionController::class, 'show'])->name('submissions.show');
        Route::post('submissions/{submission}/approve', [SubmissionController::class, 'approve'])->name('submissions.approve');
        Route::post('submissions/{submission}/request-revision', [SubmissionController::class, 'requestRevision'])->name('submissions.request-revision');
        Route::post('submissions/{submission}/comments', [SubmissionController::class, 'addComment'])->name('submissions.comment');
        Route::get('schedules', [ScheduleController::class, 'adviserIndex'])->name('schedules.index');
        Route::get('templates', [TemplateController::class, 'index'])->name('templates.index');
        Route::get('templates/{template}/download', [TemplateController::class, 'download'])->name('templates.download');
        Route::get('repository', [RepositoryController::class, 'index'])->name('repository.index');
        Route::get('repository/{repository}/download', [RepositoryController::class, 'download'])->name('repository.download');
    });

    // ------- PANELIST ROUTES -------
    Route::middleware(['role:panelist'])->prefix('panelist')->name('panelist.')->group(function () {
        Route::get('assignments', [ResearchGroupController::class, 'panelistIndex'])->name('assignments.index');
        Route::get('submissions/{submission}', [SubmissionController::class, 'show'])->name('submissions.show');
        Route::post('submissions/{submission}/approve', [SubmissionController::class, 'approve'])->name('submissions.approve');
        Route::post('submissions/{submission}/reject', [SubmissionController::class, 'reject'])->name('submissions.reject');
        Route::post('submissions/{submission}/request-revision', [SubmissionController::class, 'requestRevision'])->name('submissions.request-revision');
        Route::post('submissions/{submission}/comments', [SubmissionController::class, 'addComment'])->name('submissions.comment');
        Route::get('schedules', [ScheduleController::class, 'index'])->name('schedules.index');
    });

    // ------- STUDENT ROUTES -------
    Route::middleware(['role:student'])->prefix('student')->name('student.')->group(function () {
        Route::get('group', [ResearchGroupController::class, 'studentGroup'])->name('group');
        Route::post('group/create', [ResearchGroupController::class, 'createGroup'])->name('group.create');
        Route::post('group/join', [ResearchGroupController::class, 'joinGroup'])->name('group.join');
        Route::get('submissions', [SubmissionController::class, 'studentIndex'])->name('submissions.index');
        Route::post('submissions', [SubmissionController::class, 'store'])->name('submissions.store');
        Route::get('submissions/{submission}', [SubmissionController::class, 'show'])->name('submissions.show');
        Route::get('templates', [TemplateController::class, 'index'])->name('templates.index');
        Route::get('templates/{template}/download', [TemplateController::class, 'download'])->name('templates.download');
        Route::get('repository', [RepositoryController::class, 'index'])->name('repository.index');
        Route::get('repository/{repository}/download', [RepositoryController::class, 'download'])->name('repository.download');
        Route::get('schedules', [ScheduleController::class, 'studentIndex'])->name('schedules.index');

    // Shared Support Routes (accessible by all roles)
    Route::get('support', [SupportController::class, 'index'])->name('support.index');
    Route::post('support', [SupportController::class, 'store'])->name('support.store');
});

require __DIR__.'/auth.php';

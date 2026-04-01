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
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page
Route::get('/', function () {
    if (app('currentTenant')) {
        return Inertia::render('TenantWelcome');
    }
    return Inertia::render('Welcome');
});

// Authenticated + Tenant routes
Route::middleware(['auth', 'verified'])->group(function () {

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
    });

    // ------- LANDLORD (CENTRAL SYSTEM) ROUTES -------
    Route::middleware(['landlord'])->prefix('landlord')->name('landlord.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Landlord\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('tenants', \App\Http\Controllers\Landlord\TenantController::class);
        Route::get('subscriptions', [\App\Http\Controllers\Landlord\SubscriptionController::class, 'index'])->name('subscriptions.index');
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
    });
});

require __DIR__.'/auth.php';

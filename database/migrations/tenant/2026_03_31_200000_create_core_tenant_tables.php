<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Research Cycles
        Schema::create('research_cycles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->string('name'); // e.g. "1st Semester 2025-2026"
            $table->string('academic_year');
            $table->string('semester');
            $table->date('start_date');
            $table->date('end_date');
            $table->date('proposal_deadline')->nullable();
            $table->date('chapter_deadline')->nullable();
            $table->date('final_deadline')->nullable();
            $table->date('defense_deadline')->nullable();
            $table->string('status')->default('active'); // active, archived
            $table->softDeletes();
            $table->timestamps();
        });

        // Research Groups
        Schema::create('research_groups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->foreignId('research_cycle_id')->constrained('research_cycles')->cascadeOnDelete();
            $table->string('title');
            $table->text('abstract')->nullable();
            $table->string('status')->default('draft');
            // draft, submitted, under_review, revision_required, approved, rejected, completed
            $table->foreignId('adviser_id')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });

        // Group Members (students belonging to a research group)
        Schema::create('group_members', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->foreignId('research_group_id')->constrained('research_groups')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('role')->default('member'); // leader, member
            $table->timestamps();
        });

        // Panelist Assignments
        Schema::create('panelist_assignments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->foreignId('research_group_id')->constrained('research_groups')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // panelist user
            $table->timestamps();
        });

        // Defense Schedules
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->foreignId('research_group_id')->constrained('research_groups')->cascadeOnDelete();
            $table->string('type'); // proposal_defense, final_defense, consultation
            $table->dateTime('scheduled_at');
            $table->string('venue')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('scheduled'); // scheduled, done, cancelled
            $table->timestamps();
        });

        // Submissions
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->foreignId('research_group_id')->constrained('research_groups')->cascadeOnDelete();
            $table->string('type'); // title_proposal, chapter, final_manuscript, defense_requirements
            $table->string('status')->default('draft');
            $table->text('remarks')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        // Submission Versions (file history)
        Schema::create('submission_versions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->foreignId('submission_id')->constrained('submissions')->cascadeOnDelete();
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_type');
            $table->unsignedBigInteger('file_size');
            $table->integer('version')->default(1);
            $table->text('change_notes')->nullable();
            $table->timestamps();
        });

        // Comments / Feedback
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->morphs('commentable'); // polymorphic: submission, research_group, etc.
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->softDeletes();
            $table->timestamps();
        });

        // Templates
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->string('name');
            $table->string('category'); // title_proposal, chapter_format, defense_form, manuscript_format
            $table->string('description')->nullable();
            $table->string('file_path');
            $table->string('file_name');
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });

        // Repository (completed approved research)
        Schema::create('repository', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->foreignId('research_group_id')->constrained('research_groups')->cascadeOnDelete();
            $table->string('title');
            $table->text('abstract');
            $table->string('keywords')->nullable();
            $table->string('academic_year');
            $table->string('file_path');
            $table->string('file_name');
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
        });

        // Notifications
        Schema::create('notifications_log', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications_log');
        Schema::dropIfExists('repository');
        Schema::dropIfExists('templates');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('submission_versions');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('panelist_assignments');
        Schema::dropIfExists('group_members');
        Schema::dropIfExists('research_groups');
        Schema::dropIfExists('research_cycles');
    }
};

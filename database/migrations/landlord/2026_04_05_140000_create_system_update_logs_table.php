<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('landlord')->create('system_update_logs', function (Blueprint $table) {
            $table->id();
            $table->string('version');
            $table->string('status'); // success, failed, rollback
            $table->integer('tenant_count')->default(0);
            $table->longText('output')->nullable();
            $table->string('executed_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('landlord')->dropIfExists('system_update_logs');
    }
};

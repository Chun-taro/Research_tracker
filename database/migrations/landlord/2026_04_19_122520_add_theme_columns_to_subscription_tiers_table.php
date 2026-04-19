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
        Schema::connection('landlord')->table('subscription_tiers', function (Blueprint $table) {
            $table->string('primary_color')->default('#6366f1')->after('billing_cycle');
            $table->boolean('is_dark')->default(false)->after('primary_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('landlord')->table('subscription_tiers', function (Blueprint $table) {
            $table->dropColumn(['primary_color', 'is_dark']);
        });
    }
};

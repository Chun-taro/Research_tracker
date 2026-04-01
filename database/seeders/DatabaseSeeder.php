<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use App\Models\ResearchCycle;
use App\Models\ResearchGroup;
use App\Models\GroupMember;
use App\Models\PanelistAssignment;
use App\Models\Subscription;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Super Admin (Platform Owner) in Landlord DB
        $superAdmin = User::create([
            'name' => 'System Administrator',
            'email' => 'superadmin@researchtracker.com',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
            'is_active' => true,
        ]);

        $this->command->info('✅ Seeded Super Admin (Landlord DB)');

        // 2. Create sample tenant (BSIT Department)
        $dbName = 'research_tracker_bsit';
        
        // Create the database if it doesn't exist
        DB::connection('landlord')->statement("CREATE DATABASE IF NOT EXISTS `{$dbName}`");

        $tenant = Tenant::create([
            'name' => 'Bachelor of Science in Information Technology',
            'slug' => 'bsit',
            'domain' => 'bsit.localhost',
            'database' => $dbName,
            'theme_color' => '#3B82F6',
            'contact_email' => 'bsit@university.edu.ph',
            'contact_phone' => '+63 912 345 6789',
            'subscription_tier' => 'premium',
            'subscription_expires_at' => now()->addYear(),
            'is_active' => true,
        ]);

        Subscription::create([
            'tenant_id' => $tenant->id,
            'tier' => 'premium',
            'amount' => 4000.00,
            'starts_at' => now(),
            'expires_at' => now()->addYear(),
            'status' => 'active',
        ]);

        $this->command->info("✅ Created Tenant 'BSIT' in Landlord DB");

        // 3. Migrate and Seed the Tenant Database
        $tenant->makeCurrent();

        // Run migrations for the tenant database
        Artisan::call('migrate --database=tenant --path=database/migrations/tenant --force');
        $this->command->info("✅ Migrated Tenant DB: {$dbName}");

        // Now seed the tenant database
        // NOTE: Since the tenant is now current, all Eloquent calls for tenant models 
        // will automatically use the correct connection because SwitchTenantDatabaseTask swapped it.
        
        // Create Admin (Department Head) in Tenant DB
        $admin = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Dr. Maria Santos',
            'email' => 'admin@bsit.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+63 912 000 0001',
            'is_active' => true,
        ]);

        // Create Advisers
        $adviser1 = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Prof. Juan dela Cruz',
            'email' => 'jdelacruz@bsit.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'adviser',
            'phone' => '+63 912 000 0002',
            'is_active' => true,
        ]);
        $adviser2 = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Prof. Ana Reyes',
            'email' => 'areyes@bsit.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'adviser',
            'is_active' => true,
        ]);

        // Create Panelists
        $panelist1 = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Prof. Roberto Garcia',
            'email' => 'rgarcia@bsit.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'panelist',
            'is_active' => true,
        ]);
        $panelist2 = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Prof. Linda Torres',
            'email' => 'ltorres@bsit.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'panelist',
            'is_active' => true,
        ]);

        // Create Students
        $students = [];
        $studentData = [
            ['name' => 'John Doe', 'email' => 'john.doe@student.edu.ph'],
            ['name' => 'Jane Smith', 'email' => 'jane.smith@student.edu.ph'],
            ['name' => 'Carlos Mendoza', 'email' => 'c.mendoza@student.edu.ph'],
            ['name' => 'Maria Lopez', 'email' => 'm.lopez@student.edu.ph'],
            ['name' => 'Ryan Santos', 'email' => 'r.santos@student.edu.ph'],
            ['name' => 'Anna Cruz', 'email' => 'a.cruz@student.edu.ph'],
        ];
        foreach ($studentData as $s) {
            $students[] = User::create([
                'tenant_id' => $tenant->id,
                'name' => $s['name'],
                'email' => $s['email'],
                'password' => Hash::make('password'),
                'role' => 'student',
                'is_active' => true,
            ]);
        }

        // Create Research Cycle
        $cycle = ResearchCycle::create([
            'tenant_id' => $tenant->id,
            'name' => '1st Semester 2025-2026',
            'academic_year' => '2025-2026',
            'semester' => '1st Semester',
            'start_date' => '2025-08-01',
            'end_date' => '2025-12-31',
            'proposal_deadline' => '2025-09-15',
            'chapter_deadline' => '2025-10-31',
            'final_deadline' => '2025-11-30',
            'defense_deadline' => '2025-12-15',
            'status' => 'active',
        ]);

        // Create Research Groups
        $group1 = ResearchGroup::create([
            'tenant_id' => $tenant->id,
            'research_cycle_id' => $cycle->id,
            'title' => 'AI-Powered Student Performance Prediction System',
            'abstract' => 'This study aims to develop an AI-powered system that predicts student academic performance using machine learning algorithms based on historical data.',
            'status' => 'under_review',
            'adviser_id' => $adviser1->id,
        ]);

        $group2 = ResearchGroup::create([
            'tenant_id' => $tenant->id,
            'research_cycle_id' => $cycle->id,
            'title' => 'Mobile-Based Barangay Health Information System',
            'abstract' => 'This research proposes a mobile application for barangay health units to manage health records, immunization schedules, and community health data.',
            'status' => 'submitted',
            'adviser_id' => $adviser2->id,
        ]);

        $group3 = ResearchGroup::create([
            'tenant_id' => $tenant->id,
            'research_cycle_id' => $cycle->id,
            'title' => 'Blockchain-Based Academic Credentials System',
            'abstract' => 'A study on implementing blockchain technology for secure and verifiable academic credential management.',
            'status' => 'approved',
            'adviser_id' => $adviser1->id,
        ]);

        // Assign students to groups
        GroupMember::create(['tenant_id' => $tenant->id, 'research_group_id' => $group1->id, 'user_id' => $students[0]->id, 'role' => 'leader']);
        GroupMember::create(['tenant_id' => $tenant->id, 'research_group_id' => $group1->id, 'user_id' => $students[1]->id, 'role' => 'member']);
        GroupMember::create(['tenant_id' => $tenant->id, 'research_group_id' => $group2->id, 'user_id' => $students[2]->id, 'role' => 'leader']);
        GroupMember::create(['tenant_id' => $tenant->id, 'research_group_id' => $group2->id, 'user_id' => $students[3]->id, 'role' => 'member']);
        GroupMember::create(['tenant_id' => $tenant->id, 'research_group_id' => $group3->id, 'user_id' => $students[4]->id, 'role' => 'leader']);
        GroupMember::create(['tenant_id' => $tenant->id, 'research_group_id' => $group3->id, 'user_id' => $students[5]->id, 'role' => 'member']);

        // Assign panelists
        PanelistAssignment::create(['tenant_id' => $tenant->id, 'research_group_id' => $group1->id, 'user_id' => $panelist1->id]);
        PanelistAssignment::create(['tenant_id' => $tenant->id, 'research_group_id' => $group1->id, 'user_id' => $panelist2->id]);
        PanelistAssignment::create(['tenant_id' => $tenant->id, 'research_group_id' => $group2->id, 'user_id' => $panelist1->id]);
        PanelistAssignment::create(['tenant_id' => $tenant->id, 'research_group_id' => $group3->id, 'user_id' => $panelist2->id]);

        $this->command->info("✅ Fully Seeded Isolated DB for BSIT");

        $tenant->forget();
    }
}

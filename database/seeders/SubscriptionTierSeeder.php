<?php

namespace Database\Seeders;

use App\Models\Landlord\SubscriptionTier;
use Illuminate\Database\Seeder;

class SubscriptionTierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiers = [
            [
                'slug' => 'basic',
                'name' => 'Basic Plan',
                'price' => 5000.00,
                'billing_cycle' => 'yearly',
                'primary_color' => '#10b981',
                'is_dark' => false,
                'features' => ['Core Workflows', 'Student Submission Tracking'],
                'limits' => ['groups' => 5],
                'is_active' => true,
            ],
            [
                'slug' => 'standard',
                'name' => 'Standard Plan',
                'price' => 15000.00,
                'billing_cycle' => 'yearly',
                'primary_color' => '#6366f1',
                'is_dark' => false,
                'features' => ['Core Workflows', 'Advanced Scheduling', 'Priority Email Support'],
                'limits' => ['groups' => 20],
                'is_active' => true,
            ],
            [
                'slug' => 'premium',
                'name' => 'Premium Plan',
                'price' => 35000.00,
                'billing_cycle' => 'yearly',
                'primary_color' => '#f59e0b',
                'is_dark' => true,
                'features' => ['Core Workflows', 'Unlimited Groups', 'API Access', '24/7 Dedicated Support'],
                'limits' => ['groups' => 999999],
                'is_active' => true,
            ],
        ];

        foreach ($tiers as $tier) {
            SubscriptionTier::updateOrCreate(['slug' => $tier['slug']], $tier);
        }
    }
}

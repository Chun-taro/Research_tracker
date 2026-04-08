<?php

namespace App\Models\Landlord;

use Illuminate\Database\Eloquent\Model;

class SubscriptionTier extends Model
{
    protected $connection = 'landlord';
    protected $table = 'subscription_tiers';

    protected $fillable = [
        'slug',
        'name',
        'price',
        'billing_cycle',
        'features',
        'limits',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'limits' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];
}

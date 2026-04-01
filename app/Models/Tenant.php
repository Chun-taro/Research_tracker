<?php

namespace App\Models;

use Spatie\Multitenancy\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant
{
    protected $connection = 'landlord';

    protected $fillable = [
        'name',
        'slug',
        'domain',
        'custom_domain',
        'database',
        'logo_path',
        'theme_color',
        'contact_email',
        'contact_phone',
        'subscription_tier',
        'subscription_expires_at',
        'is_active',
    ];

    protected $casts = [
        'subscription_expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function getDomainName(): string
    {
        return $this->domain ?? $this->slug . '.' . config('app.base_domain', 'localhost');
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}

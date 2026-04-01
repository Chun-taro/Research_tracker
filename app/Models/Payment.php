<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $connection = 'landlord';
    protected $fillable = [
        'tenant_id', 'subscription_id', 'amount', 'method', 'reference_number', 'status', 'paid_at',
    ];

    protected $casts = ['paid_at' => 'datetime'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function subscription() { return $this->belongsTo(Subscription::class); }
}

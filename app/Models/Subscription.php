<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $connection = 'landlord';
    protected $fillable = ['tenant_id', 'tier', 'amount', 'starts_at', 'expires_at', 'status'];

    protected $casts = ['starts_at' => 'datetime', 'expires_at' => 'datetime'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function payments() { return $this->hasMany(Payment::class); }
}

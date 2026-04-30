<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'plan_id',
    ];

    protected $casts = [
        'plan_id' => 'integer',
    ];
}

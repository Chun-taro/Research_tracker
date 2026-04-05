<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemUpdateLog extends Model
{
    protected $connection = 'landlord';
    protected $table = 'system_update_logs';

    protected $fillable = [
        'version',
        'status',
        'tenant_count',
        'output',
        'executed_by',
    ];
}

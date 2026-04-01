<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'tenant_id', 'research_group_id', 'type', 'scheduled_at', 'venue', 'notes', 'status',
    ];

    protected $casts = ['scheduled_at' => 'datetime'];

    public function group() { return $this->belongsTo(ResearchGroup::class, 'research_group_id'); }
}

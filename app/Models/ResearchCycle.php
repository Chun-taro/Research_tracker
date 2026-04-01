<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResearchCycle extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'mysql';

    protected $fillable = [
        'tenant_id', 'name', 'academic_year', 'semester',
        'start_date', 'end_date', 'proposal_deadline',
        'chapter_deadline', 'final_deadline', 'defense_deadline', 'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'proposal_deadline' => 'date',
        'chapter_deadline' => 'date',
        'final_deadline' => 'date',
        'defense_deadline' => 'date',
    ];

    public function researchGroups() { return $this->hasMany(ResearchGroup::class); }
}

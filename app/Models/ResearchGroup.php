<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResearchGroup extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'mysql';

    protected $fillable = [
        'tenant_id', 'research_cycle_id', 'title', 'abstract', 'status', 'adviser_id',
    ];

    public function cycle() { return $this->belongsTo(ResearchCycle::class, 'research_cycle_id'); }
    public function adviser() { return $this->belongsTo(User::class, 'adviser_id'); }
    public function members() { return $this->hasMany(GroupMember::class); }
    public function students() { return $this->belongsToMany(User::class, 'group_members', 'research_group_id', 'user_id'); }
    public function panelists() { return $this->hasMany(PanelistAssignment::class); }
    public function submissions() { return $this->hasMany(Submission::class); }
    public function schedules() { return $this->hasMany(Schedule::class); }
    public function repository() { return $this->hasOne(Repository::class); }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'draft' => 'gray',
            'submitted' => 'blue',
            'under_review' => 'yellow',
            'revision_required' => 'orange',
            'approved' => 'green',
            'rejected' => 'red',
            'completed' => 'purple',
            default => 'gray',
        };
    }
}

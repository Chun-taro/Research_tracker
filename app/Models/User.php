<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $connection = 'mysql';

    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'password',
        'role',
        'avatar_path',
        'phone',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function isSuperAdmin(): bool { return $this->role === 'superadmin'; }
    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isAdviser(): bool { return $this->role === 'adviser'; }
    public function isPanelist(): bool { return $this->role === 'panelist'; }
    public function isStudent(): bool { return $this->role === 'student'; }

    public function tenant() { return $this->belongsTo(Tenant::class); }

    public function groupMemberships()
    {
        return $this->hasMany(GroupMember::class);
    }

    public function researchGroups()
    {
        return $this->belongsToMany(ResearchGroup::class, 'group_members', 'user_id', 'research_group_id');
    }

    public function advisedGroups()
    {
        return $this->hasMany(ResearchGroup::class, 'adviser_id');
    }

    public function panelistAssignments()
    {
        return $this->hasMany(PanelistAssignment::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}

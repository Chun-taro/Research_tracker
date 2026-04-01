<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Submission extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'mysql';

    protected $fillable = [
        'tenant_id', 'research_group_id', 'type', 'status', 'remarks', 'reviewed_by', 'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function group() { return $this->belongsTo(ResearchGroup::class, 'research_group_id'); }
    public function reviewer() { return $this->belongsTo(User::class, 'reviewed_by'); }
    public function versions() { return $this->hasMany(SubmissionVersion::class); }
    public function latestVersion() { return $this->hasOne(SubmissionVersion::class)->latestOfMany(); }
    public function comments() { return $this->morphMany(Comment::class, 'commentable'); }
}

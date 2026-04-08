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
        'file_path', 'file_name', 'file_type', 'file_size', 'uploaded_by'
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function group() { return $this->belongsTo(ResearchGroup::class, 'research_group_id'); }
    public function reviewer() { return $this->belongsTo(User::class, 'reviewed_by'); }
    public function uploader() { return $this->belongsTo(User::class, 'uploaded_by'); }
    public function comments() { return $this->morphMany(Comment::class, 'commentable'); }
}

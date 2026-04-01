<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubmissionVersion extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'tenant_id', 'submission_id', 'uploaded_by', 'file_path',
        'file_name', 'file_type', 'file_size', 'version', 'change_notes',
    ];

    public function submission() { return $this->belongsTo(Submission::class); }
    public function uploader() { return $this->belongsTo(User::class, 'uploaded_by'); }
}

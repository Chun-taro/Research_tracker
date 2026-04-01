<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Template extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'mysql';

    protected $fillable = [
        'tenant_id', 'name', 'category', 'description', 'file_path', 'file_name', 'uploaded_by', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function uploader() { return $this->belongsTo(User::class, 'uploaded_by'); }
}

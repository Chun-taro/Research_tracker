<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Repository extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'mysql';

    protected $table = 'repository';

    protected $fillable = [
        'tenant_id', 'research_group_id', 'title', 'abstract',
        'keywords', 'academic_year', 'file_path', 'file_name', 'is_archived',
    ];

    protected $casts = ['is_archived' => 'boolean'];

    public function group() { return $this->belongsTo(ResearchGroup::class, 'research_group_id'); }
}

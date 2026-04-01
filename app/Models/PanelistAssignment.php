<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PanelistAssignment extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = ['tenant_id', 'research_group_id', 'user_id', 'role'];

    public function group() { return $this->belongsTo(ResearchGroup::class, 'research_group_id'); }
    public function panelist() { return $this->belongsTo(User::class, 'user_id'); }
}

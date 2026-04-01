<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupMember extends Model
{
    protected $connection = 'mysql';

    protected $fillable = ['tenant_id', 'research_group_id', 'user_id', 'role'];

    public function group() { return $this->belongsTo(ResearchGroup::class, 'research_group_id'); }
    public function user() { return $this->belongsTo(User::class); }
}

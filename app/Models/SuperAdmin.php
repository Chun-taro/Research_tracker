<?php

namespace App\Models;

class SuperAdmin extends User
{
    protected $table = 'users';
    protected $connection = 'landlord';
}

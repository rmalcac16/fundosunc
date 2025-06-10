<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Raza extends Model
{
    use SoftDeletes;

    protected $fillable = ['nombre'];

    public function ganados()
    {
        return $this->hasMany(Ganado::class);
    }
}

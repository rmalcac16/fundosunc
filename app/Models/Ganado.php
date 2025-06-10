<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ganado extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'codigo',
        'nombre',
        'fecha_nacimiento',
        'genero',
        'estado',
        'padre_id',
        'madre_id',
        'raza_id',
        'fundo_id',
    ];

    public function fundo()
    {
        return $this->belongsTo(Fundo::class);
    }

    public function raza()
    {
        return $this->belongsTo(Raza::class);
    }

    public function padre()
    {
        return $this->belongsTo(Ganado::class, 'padre_id');
    }

    public function madre()
    {
        return $this->belongsTo(Ganado::class, 'madre_id');
    }
}

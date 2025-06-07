<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Fundo extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'imagen',
    ];

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->slug = Str::slug($model->nombre);
        });
    }
}

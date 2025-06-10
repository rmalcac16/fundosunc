<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ganados', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nombre');
            $table->date('fecha_nacimiento')->nullable();

            $table->foreignId('padre_id')->nullable()->constrained('ganados')->nullOnDelete();
            $table->foreignId('madre_id')->nullable()->constrained('ganados')->nullOnDelete();

            $table->enum('genero', ['macho', 'hembra']);
            $table->enum('estado', ['activo', 'produccion', 'vendido', 'muerto'])->default('activo');

            $table->foreignId('raza_id')->constrained()->onDelete('cascade');
            $table->foreignId('fundo_id')->constrained()->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ganados');
    }
};

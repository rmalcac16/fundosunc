<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FundoController;
use App\Http\Controllers\GanadoController;
use App\Http\Controllers\RazaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('razas', RazaController::class);

    Route::delete('fundos/{fundo}/force-delete', [FundoController::class, 'forceDelete'])->name('fundos.forceDelete');
    Route::post('fundos/{fundo}/restore', [FundoController::class, 'restore'])->name('fundos.restore');
    Route::resource('fundos', FundoController::class);

    Route::prefix('fundos/{fundo}')->group(function () {
        Route::post('ganados/{ganado}/restore', [GanadoController::class, 'restore'])->name('ganados.restore');
        Route::delete('ganados/{ganado}/force-delete', [GanadoController::class, 'forceDelete'])->name('ganados.forceDelete');
        Route::resource('ganados', GanadoController::class)->shallow();
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

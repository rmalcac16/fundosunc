<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FundoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::delete('fundos/{fundo}/force-delete', [FundoController::class, 'forceDelete'])->name('fundos.forceDelete');
    Route::post('fundos/{fundo}/restore', [FundoController::class, 'restore'])->name('fundos.restore');
    Route::resource('fundos', FundoController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

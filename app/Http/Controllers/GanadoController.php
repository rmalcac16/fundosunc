<?php

namespace App\Http\Controllers;

use App\Models\Fundo;
use App\Models\Ganado;
use App\Models\Raza;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GanadoController extends Controller
{
    public function index(Fundo $fundo)
    {
        $ganados = Ganado::withTrashed()
            ->where('fundo_id', $fundo->id)
            ->with('raza')
            ->get();

        $activeGanados = $ganados->filter(fn($g) => is_null($g->deleted_at))->values();
        $deletedGanados = $ganados->filter(fn($g) => !is_null($g->deleted_at))->values();

        $razas = Raza::all();

        return Inertia::render('Ganado/Index', [
            'fundo' => $fundo,
            'razas' => $razas,
            'activeGanados' => $activeGanados,
            'deletedGanados' => $deletedGanados,
        ]);
    }

    public function store(Request $request, Fundo $fundo)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:255|unique:ganados,codigo,NULL,id,fundo_id,' . $fundo->id,
            'nombre' => 'required|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'genero' => 'required|in:macho,hembra',
            'estado' => 'nullable|in:activo,produccion,vendido,muerto',
            'raza_id' => 'required|exists:razas,id',
            'padre_id' => 'nullable|exists:ganados,id',
            'madre_id' => 'nullable|exists:ganados,id',
        ]);

        $ganado = Ganado::create([
            'codigo' => $validated['codigo'],
            'nombre' => $validated['nombre'],
            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
            'genero' => $validated['genero'],
            'estado' => $validated['estado'] ?? 'activo',
            'raza_id' => $validated['raza_id'],
            'padre_id' => $validated['padre_id'] ?? null,
            'madre_id' => $validated['madre_id'] ?? null,
            'fundo_id' => $fundo->id,
        ]);

        return to_route('ganados.index', $fundo->id);
    }



    public function update(Request $request, Fundo $fundo, Ganado $ganado)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:255|unique:ganados,codigo,' . $ganado->id . ',id,fundo_id,' . $fundo->id,
            'nombre' => 'required|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'genero' => 'required|in:macho,hembra',
            'estado' => 'nullable|in:activo,produccion,vendido,muerto',
            'raza_id' => 'required|exists:razas,id',
            'padre_id' => 'nullable|exists:ganados,id',
            'madre_id' => 'nullable|exists:ganados,id',
        ]);

        $ganado->update([
            'codigo' => $validated['codigo'],
            'nombre' => $validated['nombre'],
            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
            'genero' => $validated['genero'],
            'estado' => $validated['estado'] ?? 'activo',
            'raza_id' => $validated['raza_id'],
            'padre_id' => $validated['padre_id'] ?? null,
            'madre_id' => $validated['madre_id'] ?? null,
        ]);

        return to_route('ganados.index', $fundo->id);
    }

    public function destroy(Fundo $fundo, Ganado $ganado)
    {
        $ganado->delete();
        return to_route('ganados.index', $fundo->id);
    }

    public function restore(Fundo $fundo, $ganadoId)
    {
        $ganado = Ganado::withTrashed()->findOrFail($ganadoId);

        $ganado->restore();

        return to_route('ganados.index', $fundo->id);
    }

    public function forceDelete(Fundo $fundo, $ganadoId)
    {
        $ganado = Ganado::withTrashed()->findOrFail($ganadoId);

        $ganado->forceDelete();

        return to_route('ganados.index', $fundo->id);
    }
}

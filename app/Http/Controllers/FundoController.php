<?php

namespace App\Http\Controllers;

use App\Models\Fundo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FundoController extends Controller
{
    public function index()
    {
        $fundos = Fundo::withTrashed()->get();

        $activeFundos = $fundos->filter(fn($f) => is_null($f->deleted_at))->values();
        $deletedFundos = $fundos->filter(fn($f) => !is_null($f->deleted_at))->values();

        return Inertia::render('Fundos/Index', [
            'activeFundos' => $activeFundos,
            'deletedFundos' => $deletedFundos,
        ]);
    }


    public function create()
    {
        return Inertia::render('Fundos/Create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255|unique:fundos,nombre',
            'descripcion' => 'nullable|string|max:1000',
            'imagen' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('imagen')) {
            $imagePath = $request->file('imagen')->store('fundos', 'public');
        }

        Fundo::create([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'],
            'imagen' => $imagePath,
        ]);

        return to_route('fundos.index')->with('success', 'Fundo creado correctamente.');
    }

    public function edit(Fundo $fundo)
    {
        return Inertia::render('Fundos/Edit', ['fundo' => $fundo]);
    }

    public function update(Request $request, Fundo $fundo)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255|unique:fundos,nombre,' . $fundo->id,
            'descripcion' => 'nullable|string|max:1000',
            'imagen' => 'nullable|image|max:2048',
            'clear_imagen' => 'sometimes|boolean',
        ]);

        $imagePath = $fundo->imagen;

        if ($request->boolean('clear_imagen')) {
            if ($fundo->imagen) {
                Storage::disk('public')->delete($fundo->imagen);
            }
            $imagePath = null;
        } elseif ($request->hasFile('imagen')) {
            if ($fundo->imagen) {
                Storage::disk('public')->delete($fundo->imagen);
            }
            $imagePath = $request->file('imagen')->store('fundos', 'public');
        }

        $fundo->update([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'],
            'imagen' => $imagePath,
        ]);

        return to_route('fundos.index')->with('success', 'Fundo actualizado correctamente.');
    }

    public function destroy(Fundo $fundo)
    {
        if ($fundo->imagen) {
            Storage::disk('public')->delete($fundo->imagen);
        }
        $fundo->delete();

        return to_route('fundos.index')->with('success', 'Fundo eliminado correctamente.');
    }

    public function restore($id)
    {
        $fundo = Fundo::withTrashed()->findOrFail($id);

        if (!$fundo->trashed()) {
            return back()->with('error', 'El fundo no está eliminado.');
        }

        $fundo->restore();

        return to_route('fundos.index')->with('success', 'Fundo restaurado correctamente.');
    }

    public function forceDelete($id)
    {

        $fundo = Fundo::withTrashed()->findOrFail($id);
        if ($fundo->imagen) {
            Storage::disk('public')->delete($fundo->imagen);
        }

        if (!$fundo->trashed()) {
            return to_route('fundos.index')->with('error', 'El fundo no está eliminado.');
        }

        $fundo->forceDelete();

        return to_route('fundos.index')->with('success', 'Fundo eliminado permanentemente.');
    }
}

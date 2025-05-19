<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TareaController extends Controller
{
    public function index()
    {
        return auth()->user()->tareas;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        $data['user_id'] = auth()->id();

        $tarea = Tarea::create($data);

        return response()->json($tarea, 201);
    }

    public function show($id)
    {
        $tarea = Tarea::findOrFail($id);

        if (Gate::denies('modificar-tarea', $tarea)) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($tarea);
    }

    public function update(Request $request, $id)
    {
        $tarea = Tarea::findOrFail($id);

        if (Gate::denies('modificar-tarea', $tarea)) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'in:pendiente,completada',
        ]);

        $tarea->update($data);

        return response()->json($tarea);
    }

    public function destroy($id)
    {
        $tarea = Tarea::findOrFail($id);

        if (Gate::denies('modificar-tarea', $tarea)) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $tarea->delete();

        return response()->json(['message' => 'Tarea eliminada']);
    }
}


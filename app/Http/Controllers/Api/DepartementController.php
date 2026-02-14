<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    public function index()
    {
        return response()->json(Departement::all(), 200);
    }

    public function store(Request $request)
    {
    
        $request->validate(['nom'=>'required|string|max:255']);

        $departement = Departement::create($request->only('nom'));

        return response()->json(['data' => $departement], 201);
    }

    public function show($id)
    {
        $departement = Departement::find($id);

        if (!$departement) {
            return response()->json(['message' => 'Département introuvable'], 404);
        }

        return response()->json($departement, 200);
    }

    public function update(Request $request, $id)
    {
        $departement = Departement::find($id);

        if (!$departement) {
            return response()->json(['message' => 'Département introuvable'], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
        ]);

        $departement->update($validated);

        return response()->json([
            'message' => 'Département modifié avec succès',
            'data' => $departement
        ], 200);
    }

    public function destroy($id)
    {
        $departement = Departement::find($id);

        if (!$departement) {
            return response()->json(['message' => 'Département introuvable'], 404);
        }

        $departement->delete();

        return response()->json(['message' => 'Département supprimé avec succès'], 200);
    }
}
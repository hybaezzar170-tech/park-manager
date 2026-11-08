<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    public function index(Request $request)
    {
        if ($request->query('all') === 'true') {
            return response()->json(Departement::all(), 200);
        }
        return response()->json(Departement::where('etat', 'actif')->get(), 200);
    }

    public function allDepartements()
    {
        return response()->json(Departement::all(), 200);
    }

    public function store(Request $request)
    {
    
        $request->validate([
            'nom'=>'required|string|max:255',
            'type'=>'nullable|string|max:255',
            'etat'=>'nullable|string|in:actif,inactif'
        ]);

        $departement = Departement::create($request->only('nom', 'type', 'etat'));

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
            'type' => 'sometimes|nullable|string|max:255',
            'etat' => 'sometimes|nullable|string|in:actif,inactif',
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

    public function toggleEtat($id)
    {
        $departement = Departement::find($id);

        if (!$departement) {
            return response()->json(['message' => 'Département introuvable'], 404);
        }

        $departement->etat = $departement->etat === 'actif' ? 'inactif' : 'actif';
        $departement->save();

        return response()->json([
            'message' => $departement->etat === 'actif' ? 'Département activé avec succès' : 'Département désactivé avec succès',
            'data' => $departement
        ], 200);
    }
}
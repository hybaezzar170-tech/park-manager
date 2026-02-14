<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conducteur;
use Illuminate\Http\Request;

class ConducteurController extends Controller
{
    public function index()
    {
        return response()->json(Conducteur::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'date_naissance' => 'required|date',
            'date_embauche' => 'required|date',
            'numero_permis' => 'required|string|unique:conducteurs',
            'adresse' => 'required|string',
            'ville' => 'required|string',
            'code_postal' => 'required|string|max:10',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|unique:conducteurs',
        ]);

        $conducteur = Conducteur::create($validated);

        return response()->json([
            'message' => 'Conducteur ajouté avec succès',
            'data' => $conducteur
        ], 201);
    }

    public function show($id)
    {
        $conducteur = Conducteur::find($id);

        if (!$conducteur) {
            return response()->json(['message' => 'Conducteur introuvable'], 404);
        }

        return response()->json($conducteur, 200);
    }

    public function update(Request $request, $id)
    {
        $conducteur = Conducteur::find($id);

        if (!$conducteur) {
            return response()->json(['message' => 'Conducteur introuvable'], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:100',
            'prenom' => 'sometimes|required|string|max:100',
            'date_naissance' => 'sometimes|required|date',
            'date_embauche' => 'sometimes|required|date',
            'numero_permis' => 'sometimes|required|string|unique:conducteurs,numero_permis,' . $id,
            'adresse' => 'sometimes|required|string',
            'ville' => 'sometimes|required|string',
            'code_postal' => 'sometimes|required|string|max:10',
            'telephone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|unique:conducteurs,email,' . $id,
        ]);

        $conducteur->update($validated);

        return response()->json([
            'message' => 'Conducteur modifié avec succès',
            'data' => $conducteur
        ], 200);
    }

    public function destroy($id)
    {
        $conducteur = Conducteur::find($id);

        if (!$conducteur) {
            return response()->json(['message' => 'Conducteur introuvable'], 404);
        }

        $conducteur->delete();

        return response()->json(['message' => 'Conducteur supprimé avec succès'], 200);
    }
}

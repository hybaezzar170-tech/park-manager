<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Taxe;

class TaxeController extends Controller
{
    // 🔹 Liste des taxes مع فلترة
    public function index(Request $request)
    {
        $query = Taxe::with('voiture');

        if ($request->has('voiture_id')) {
            $query->where('voiture_id', $request->voiture_id);
        }

        if ($request->has('annee')) {
            $query->where('annee', $request->annee);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->get(), 200);
    }

    // 🔹 Ajouter Taxe
    public function store(Request $request)
    {
        $validated = $request->validate([
            'voiture_id' => 'required|exists:voitures,id',
            'type_taxe' => 'required|string',
            'annee' => 'required|integer',
            'montant' => 'required|numeric',
            'date_paiement' => 'nullable|date',
            'date_expiration' => 'nullable|date',
            'statut' => 'nullable|in:payé,non payé',
            'recu' => 'nullable|string',
            'remarque' => 'nullable|string',
        ]);

        $taxe = Taxe::create($validated);

        return response()->json([
            'message' => 'Taxe ajoutée avec succès',
            'data' => $taxe
        ], 201);
    }

    // 🔹 Afficher une taxe
    public function show($id)
    {
        $taxe = Taxe::with('voiture')->find($id);

        if (!$taxe) {
            return response()->json(['message' => 'Taxe introuvable'], 404);
        }

        return response()->json($taxe, 200);
    }

    // 🔹 Modifier Taxe
    public function update(Request $request, $id)
    {
        $taxe = Taxe::find($id);

        if (!$taxe) {
            return response()->json(['message' => 'Taxe introuvable'], 404);
        }

        $validated = $request->validate([
            'voiture_id' => 'sometimes|exists:voitures,id',
            'type_taxe' => 'sometimes|string',
            'annee' => 'sometimes|integer',
            'montant' => 'sometimes|numeric',
            'date_paiement' => 'nullable|date',
            'date_expiration' => 'nullable|date',
            'statut' => 'nullable|in:payé,non payé',
            'recu' => 'nullable|string',
            'remarque' => 'nullable|string',
        ]);

        $taxe->update($validated);

        return response()->json([
            'message' => 'Taxe modifiée avec succès',
            'data' => $taxe
        ], 200);
    }

    // 🔹 Supprimer Taxe
    public function destroy($id)
    {
        $taxe = Taxe::find($id);

        if (!$taxe) {
            return response()->json(['message' => 'Taxe introuvable'], 404);
        }

        $taxe->delete();

        return response()->json(['message' => 'Taxe supprimée avec succès'], 200);
    }
}

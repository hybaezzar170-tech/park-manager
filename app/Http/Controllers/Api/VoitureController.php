<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Voiture;

class VoitureController extends Controller
{
    // 🔹 Liste voitures مع فلترة
    public function index(Request $request)
    {
        // Auto-return expired rentals
        $this->returnExpiredRentals();

        $query = Voiture::with(['departement', 'conducteur', 'fournisseur']);

        if ($request->has('departement_id')) {
            $query->where('departement_id', $request->departement_id);
        }

        if ($request->has('etat')) {
            $query->where('etat', $request->etat);
        }

        return response()->json($query->get(), 200);
    }

    // Helper method to return expired rentals
    private function returnExpiredRentals()
    {
        $expiredLocations = \App\Models\Location::where('etat', 'en_cours')
            ->where('date_fin', '<', \Carbon\Carbon::today())
            ->with('voiture')
            ->get();

        foreach ($expiredLocations as $location) {
            $location->etat = 'terminee';
            $location->save();

            $location->voiture->etat = 'disponible';
            $location->voiture->save();
        }
    }

    // 🔹 Ajouter voiture
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'matricule' => 'required|string|unique:voitures',
                'modele' => 'required|string',
                'num_serie' => 'required|string|unique:voitures,num_serie',
                'type_departement' => 'required|string',
                'departement_id' => 'required|exists:departements,id',
                'conducteur_id' => 'nullable|exists:conducteurs,id',
                'marque' => 'required|string',
                'couleur' => 'required|string',
                'mise_en_circulation' => 'required|date',
                'carburant' => 'required|string',
                'etat' => 'nullable|in:disponible,en_location,vendue,en_maintenance',
                'prix_achat' => 'nullable|numeric',
                'date_achat' => 'nullable|date',
                'fournisseur_id' => 'nullable|exists:fournisseurs,id',
            ]);

            $validated['etat'] = $validated['etat'] ?? 'disponible';

            $voiture = Voiture::create($validated);

            return response()->json([
                'message' => 'Voiture ajoutée avec succès',
                'data' => $voiture
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Voiture creation error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de l\'ajout: ' . $e->getMessage()
            ], 500);
        }
    }

    // 🔹 Afficher voiture
    public function show($id)
    {
        $voiture = Voiture::with(['departement', 'conducteur', 'fournisseur'])->find($id);

        if (!$voiture) {
            return response()->json(['message' => 'Voiture introuvable'], 404);
        }

        return response()->json($voiture, 200);
    }

    // 🔹 Modifier voiture
    public function update(Request $request, $id)
    {
        $voiture = Voiture::find($id);

        if (!$voiture) {
            return response()->json(['message' => 'Voiture introuvable'], 404);
        }

        $validated = $request->validate([
            'matricule' => 'sometimes|required|string|unique:voitures,matricule,' . $id,
            'modele' => 'sometimes|required|string',
            'num_serie' => 'sometimes|required|string|unique:voitures,num_serie,' . $id,
            'type_departement' => 'sometimes|required|string',
            'departement_id' => 'sometimes|required|exists:departements,id',
            'conducteur_id' => 'nullable|exists:conducteurs,id',
            'marque' => 'sometimes|required|string',
            'couleur' => 'sometimes|required|string',
            'mise_en_circulation' => 'sometimes|required|date',
            'carburant' => 'sometimes|required|string',
            'etat' => 'sometimes|required|in:disponible,en_location,vendue,en_maintenance',
            'prix_achat' => 'nullable|numeric',
            'date_achat' => 'nullable|date',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
        ]);

        $voiture->update($validated);

        return response()->json([
            'message' => 'Voiture modifiée avec succès',
            'data' => $voiture
        ], 200);
    }

    // 🔹 Supprimer voiture (avec sécurité)
    public function destroy($id)
    {
        $voiture = Voiture::find($id);

        if (!$voiture) {
            return response()->json(['message' => 'Voiture introuvable'], 404);
        }

        if ($voiture->etat === 'en_location') {
            return response()->json([
                'message' => 'Impossible de supprimer une voiture en location'
            ], 400);
        }

        $voiture->delete();

        return response()->json(['message' => 'Voiture supprimée avec succès'], 200);
    }
}

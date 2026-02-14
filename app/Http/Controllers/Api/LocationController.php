<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;
use App\Models\Voiture;

class LocationController extends Controller
{
    public function index()
    {
        return Location::with('voiture')->get();
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'voiture_id' => 'required|exists:voitures,id',
                'client' => 'required|string',
                'date_location' => 'required|date',
                'date_fin' => 'required|date|after_or_equal:date_location',
                'prix_location' => 'required|numeric',
                'etat' => 'nullable|in:en_cours,terminee,annulee'
            ]);

            $voiture = Voiture::findOrFail($validated['voiture_id']);

            if ($voiture->etat === 'en_location') {
                return response()->json(['error' => 'Voiture déjà en location'], 400);
            }

            $location = Location::create($validated);

            // Mettre à jour l'état de la voiture
            $voiture->etat = 'en_location';
            $voiture->save();

            return response()->json($location, 201);
        } catch (\Exception $e) {
            \Log::error('Location creation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de l\'enregistrement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        return Location::with('voiture')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);

        $validated = $request->validate([
            'voiture_id' => 'sometimes|required|exists:voitures,id',
            'client' => 'sometimes|required|string',
            'date_location' => 'sometimes|required|date',
            'date_fin' => 'sometimes|required|date|after_or_equal:date_location',
            'prix_location' => 'sometimes|required|numeric',
            'etat' => 'sometimes|required|in:en_cours,terminee,annulee'
        ]);

        $location->update($validated);

        // Si location terminée ou annulée, mettre voiture disponible
        if(isset($validated['etat']) && in_array($validated['etat'], ['terminee','annulee'])){
            $voiture = $location->voiture;
            $voiture->etat = 'disponible';
            $voiture->save();
        }

        return response()->json($location);
    }

    public function destroy($id)
    {
        $location = Location::findOrFail($id);
        $voiture = $location->voiture;

        // Si location supprimée alors voiture disponible
        if($voiture->etat === 'en_location'){
            $voiture->etat = 'disponible';
            $voiture->save();
        }

        $location->delete();

        return response()->json(['message'=>'Location supprimée avec succès']);
    }
}

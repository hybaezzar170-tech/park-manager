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

            // S'assurer que les dates sont valides
            $dateLocation = \Carbon\Carbon::parse($validated['date_location']);
            $dateFin = \Carbon\Carbon::parse($validated['date_fin']);
            
            if ($dateFin->lt($dateLocation)) {
                return response()->json([
                    'error' => 'La date de fin doit être supérieure ou égale à la date de location'
                ], 400);
            }

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

    // 🔹 Créer plusieurs locations en une seule fois
    public function bulkStore(Request $request)
    {
        try {
            $validated = $request->validate([
                'locations' => 'required|array|min:1',
                'locations.*.voiture_id' => 'required|exists:voitures,id',
                'locations.*.client' => 'required|string',
                'locations.*.date_location' => 'required|date',
                'locations.*.date_fin' => 'required|date|after_or_equal:locations.*.date_location',
                'locations.*.prix_location' => 'required|numeric',
                'locations.*.etat' => 'nullable|in:en_cours,terminee,annulee'
            ]);

            $createdLocations = [];
            $errors = [];

            foreach ($validated['locations'] as $index => $locationData) {
                try {
                    // Vérifier que les dates sont valides
                    $dateLocation = \Carbon\Carbon::parse($locationData['date_location']);
                    $dateFin = \Carbon\Carbon::parse($locationData['date_fin']);
                    
                    if ($dateFin->lt($dateLocation)) {
                        $errors[] = "Location " . ($index + 1) . ": La date de fin doit être supérieure ou égale à la date de location";
                        continue;
                    }

                    $voiture = Voiture::findOrFail($locationData['voiture_id']);

                    if ($voiture->etat === 'en_location') {
                        $errors[] = "Location " . ($index + 1) . ": Voiture " . $voiture->matricule . " déjà en location";
                        continue;
                    }

                    $location = Location::create($locationData);

                    // Mettre à jour l'état de la voiture
                    $voiture->etat = 'en_location';
                    $voiture->save();

                    $createdLocations[] = $location;
                } catch (\Exception $e) {
                    $errors[] = "Location " . ($index + 1) . ": " . $e->getMessage();
                }
            }

            if (!empty($errors)) {
                return response()->json([
                    'message' => 'Certaines locations n\'ont pas pu être créées',
                    'created' => $createdLocations,
                    'errors' => $errors
                ], 207); // Multi-Status
            }

            return response()->json([
                'message' => count($createdLocations) . ' location(s) créée(s) avec succès',
                'data' => $createdLocations
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Bulk location creation error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la création des locations',
                'error' => $e->getMessage()
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

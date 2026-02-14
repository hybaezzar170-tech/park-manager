<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reparation;
use App\Models\Ouvrier;
use App\Models\Voiture;
use App\Models\acc_;
use Illuminate\Http\Request;

class ReparationController extends Controller
{
    public function index()
    {
        try {
            $reparations = Reparation::with(['voiture', 'ouvrier', 'pieces'])->get();
            return response()->json($reparations);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch reparations'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'voiture_id' => 'required|exists:voitures,id',
                'ouvrier_id' => 'required|exists:ouvriers,id',
                'type_reparation' => 'required|string|max:255',
                'description' => 'required|string',
                'cout_main_oeuvre' => 'nullable|numeric|min:0',
                'date_debut' => 'required|date',
                'date_fin_prevue' => 'nullable|date|after_or_equal:date_debut',
                'statut' => 'nullable|in:en_cours,terminee,annulee',
                'notes' => 'nullable|string',
                'pieces' => 'nullable|array',
                'pieces.*.id' => 'required|exists:acc_,id',
                'pieces.*.quantite' => 'required|integer|min:1',
                'pieces.*.prix_unitaire' => 'required|numeric|min:0'
            ]);

            $validated['statut'] = $validated['statut'] ?? 'en_cours';
            
            // Create reparation
            $reparation = Reparation::create($validated);

            // Attach pieces if provided
            if (isset($validated['pieces'])) {
                foreach ($validated['pieces'] as $piece) {
                    $prixTotal = $piece['quantite'] * $piece['prix_unitaire'];
                    $reparation->pieces()->attach($piece['id'], [
                        'quantite' => $piece['quantite'],
                        'prix_unitaire' => $piece['prix_unitaire'],
                        'prix_total' => $prixTotal
                    ]);
                }
            }

            // Calculate total cost
            $reparation->calculateCoutTotal();

            // Update voiture status to en_maintenance
            $voiture = $reparation->voiture;
            if ($voiture) {
                $voiture->etat = 'en_maintenance';
                $voiture->save();
            }

            return response()->json($reparation->load(['voiture', 'ouvrier', 'pieces']), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create reparation'], 500);
        }
    }

    public function show($id)
    {
        try {
            $reparation = Reparation::with(['voiture', 'ouvrier', 'pieces'])->findOrFail($id);
            return response()->json($reparation);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Reparation not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'voiture_id' => 'required|exists:voitures,id',
                'ouvrier_id' => 'required|exists:ouvriers,id',
                'type_reparation' => 'required|string|max:255',
                'description' => 'required|string',
                'cout_main_oeuvre' => 'nullable|numeric|min:0',
                'date_debut' => 'required|date',
                'date_fin_prevue' => 'nullable|date|after_or_equal:date_debut',
                'date_fin_reelle' => 'nullable|date',
                'statut' => 'required|in:en_cours,terminee,annulee',
                'notes' => 'nullable|string'
            ]);

            $reparation = Reparation::findOrFail($id);
            $oldStatut = $reparation->statut;
            $reparation->update($validated);

            // If status changed to terminee, update voiture status
            if ($oldStatut !== 'terminee' && $validated['statut'] === 'terminee') {
                $reparation->date_fin_reelle = now();
                $reparation->save();
                
                $voiture = $reparation->voiture;
                if ($voiture) {
                    $voiture->etat = 'disponible';
                    $voiture->save();
                }
            }

            return response()->json($reparation->load(['voiture', 'ouvrier', 'pieces']));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update reparation'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $reparation = Reparation::findOrFail($id);
            $reparation->delete();
            return response()->json(['message' => 'Reparation deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete reparation'], 500);
        }
    }

    public function getActiveReparations()
    {
        try {
            $reparations = Reparation::enCours()->with(['voiture', 'ouvrier', 'pieces'])->get();
            return response()->json($reparations);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch active reparations'], 500);
        }
    }

    public function getReparationStats()
    {
        try {
            $stats = [
                'total_reparations' => Reparation::count(),
                'active_reparations' => Reparation::enCours()->count(),
                'completed_reparations' => Reparation::terminee()->count(),
                'total_cost' => Reparation::sum('cout_total'),
                'average_cost' => Reparation::avg('cout_total'),
                'cars_in_reparation' => Reparation::enCours()->distinct('voiture_id')->count(),
            ];
            
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch reparation stats'], 500);
        }
    }
}

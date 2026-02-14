<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reclamation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReclamationController extends Controller
{
    public function index()
    {
        try {
            $reclamations = Reclamation::with('voiture')
                ->orderBy('created_at', 'desc')
                ->get();
                
            return response()->json($reclamations);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch reclamations',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'sujet' => 'required|string|max:255',
                'description' => 'required|string',
                'type_reclamation' => 'required|string',
                'urgence' => 'required|string|in:basse,moyenne,haute,critique',
                'voiture_id' => 'nullable|exists:voitures,id',
                'email' => 'required|email'
            ]);

            // Pas de vérification d'authentification requise
            // Les réclamations peuvent être créées par n'importe qui
            
            $reclamation = Reclamation::create([
                'sujet' => $validated['sujet'],
                'description' => $validated['description'],
                'type_reclamation' => $validated['type_reclamation'],
                'urgence' => $validated['urgence'],
                'voiture_id' => $validated['voiture_id'],
                'email' => $validated['email'],
                'statut' => 'en_attente'
            ]);

            return response()->json([
                'message' => 'Réclamation créée avec succès',
                'reclamation' => $reclamation
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create reclamation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $reclamation = Reclamation::with(['user', 'admin'])
                ->findOrFail($id);
                
            return response()->json($reclamation);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch reclamation',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $reclamation = Reclamation::findOrFail($id);
            
            $validated = $request->validate([
                'statut' => 'required|in:en_attente,en_cours,resolu,rejete',
                'reponse' => 'nullable|string'
            ]);

            // Pas d'authentification requise pour la mise à jour
            $reclamation->update([
                'statut' => $validated['statut'],
                'reponse' => $validated['reponse']
            ]);

            return response()->json([
                'message' => 'Réclamation mise à jour avec succès',
                'reclamation' => $reclamation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update reclamation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $reclamation = Reclamation::findOrFail($id);
            $reclamation->delete();
            
            return response()->json([
                'message' => 'Réclamation supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete reclamation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserReclamations()
    {
        try {
            $user = Auth::user();
            $reclamations = Reclamation::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
                
            return response()->json($reclamations);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch user reclamations',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getStatistics()
    {
        try {
            $stats = [
                'total_reclamations' => Reclamation::count(),
                'en_attente' => Reclamation::where('statut', Reclamation::STATUT_EN_ATTENTE)->count(),
                'en_cours' => Reclamation::where('statut', Reclamation::STATUT_EN_COURS)->count(),
                'resolues' => Reclamation::where('statut', Reclamation::STATUT_RESOLU)->count(),
                'rejetees' => Reclamation::where('statut', Reclamation::STATUT_REJETE)->count(),
                'urgentes' => Reclamation::where('priorite', 'urgente')->count(),
                'hautes' => Reclamation::where('priorite', 'haute')->count(),
            ];
            
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

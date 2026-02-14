<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reclamation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReclamationController extends Controller
{
    // Liste toutes les réclamations
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

    // Créer une nouvelle réclamation
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'sujet' => 'required|string|max:255',
                'description' => 'required|string|min:10',
                'type_reclamation' => 'required|string',
                'urgence' => 'required|in:basse,moyenne,haute,critique',
                'voiture_id' => 'nullable|exists:voitures,id',
                'email' => 'required|email'
            ]);

            if (!Auth::check()) {
                return response()->json([
                    'error' => 'Unauthorized',
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $user = Auth::user();

            $reclamation = Reclamation::create([
                'user_id' => $user->id,
                'sujet' => $validated['sujet'],
                'description' => $validated['description'],
                'type_reclamation' => $validated['type_reclamation'],
                'urgence' => $validated['urgence'],
                'voiture_id' => $validated['voiture_id'] ?? null,
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

    // Afficher une réclamation spécifique
    public function show($id)
    {
        try {
            $reclamation = Reclamation::with('voiture')->findOrFail($id);
            return response()->json($reclamation);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch reclamation',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    // Mettre à jour une réclamation (statut / réponse)
    public function update(Request $request, $id)
    {
        try {
            $reclamation = Reclamation::findOrFail($id);

            $validated = $request->validate([
                'statut' => 'required|in:en_attente,en_cours,resolu,rejete',
                'reponse' => 'nullable|string'
            ]);

            $admin = Auth::user();

            $reclamation->update([
                'statut' => $validated['statut'],
                'reponse' => $validated['reponse'] ?? null,
                'admin_id' => $admin->id ?? null,
                'date_reponse' => now()
            ]);

            return response()->json([
                'message' => 'Réclamation mise à jour avec succès',
                'reclamation' => $reclamation
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update reclamation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Supprimer une réclamation
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

    // Obtenir les réclamations de l'utilisateur connecté
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

    // Statistiques simples des réclamations
    public function getStatistics()
    {
        try {
            $stats = [
                'total_reclamations' => Reclamation::count(),
                'en_attente' => Reclamation::where('statut', 'en_attente')->count(),
                'en_cours' => Reclamation::where('statut', 'en_cours')->count(),
                'resolues' => Reclamation::where('statut', 'resolu')->count(),
                'rejetees' => Reclamation::where('statut', 'rejete')->count(),
                'urgentes' => Reclamation::where('urgence', 'critique')->count(),
                'hautes' => Reclamation::where('urgence', 'haute')->count(),
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

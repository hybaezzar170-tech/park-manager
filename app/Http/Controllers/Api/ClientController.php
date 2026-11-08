<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    // 🔹 Lister tous les clients
    public function index()
    {
        $clients = Client::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'message' => 'Liste des clients récupérée avec succès',
            'data' => $clients
        ], 200);
    }

    // 🔹 Ajouter un client
    public function store(Request $request)
    {
        try {
            // Validation simplifiée pour diagnostiquer
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'telephone' => 'required|string|max:20',
                'email' => 'nullable|email|max:255',
                'adresse' => 'nullable|string|max:500'
            ]);

            $client = Client::create($validated);

            return response()->json([
                'message' => 'Client ajouté avec succès',
                'data' => $client
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Client creation error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de l\'ajout du client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 🔹 Afficher un client spécifique
    public function show($id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json([
                'message' => 'Client introuvable'
            ], 404);
        }

        return response()->json([
            'message' => 'Client récupéré avec succès',
            'data' => $client
        ], 200);
    }

    // 🔹 Modifier un client
    public function update(Request $request, $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json([
                'message' => 'Client introuvable'
            ], 404);
        }

        try {
            $validated = $request->validate([
                'nom' => 'sometimes|required|string|max:255',
                'prenom' => 'sometimes|required|string|max:255',
                'telephone' => 'sometimes|required|string|max:20',
                'email' => 'sometimes|nullable|email|max:255|unique:clients,email,' . $id,
                'adresse' => 'sometimes|nullable|string|max:500'
            ]);

            $client->update($validated);

            return response()->json([
                'message' => 'Client modifié avec succès',
                'data' => $client
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Client update error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la modification du client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 🔹 Supprimer un client
    public function destroy($id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json([
                'message' => 'Client introuvable'
            ], 404);
        }

        // Vérifier si le client a des locations en cours
        $locationsEnCours = $client->locations()->where('etat', 'en_cours')->count();
        
        if ($locationsEnCours > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer un client avec des locations en cours',
                'error' => 'Ce client a ' . $locationsEnCours . ' location(s) en cours'
            ], 400);
        }

        try {
            $client->delete();

            return response()->json([
                'message' => 'Client supprimé avec succès'
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Client deletion error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la suppression du client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 🔹 Rechercher des clients
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        if (!$query) {
            return response()->json([
                'message' => 'Veuillez fournir un terme de recherche',
                'data' => []
            ], 400);
        }

        $clients = Client::where(function($queryBuilder) use ($query) {
            $queryBuilder->where('nom', 'like', "%{$query}%")
                      ->orWhere('prenom', 'like', "%{$query}%")
                      ->orWhere('email', 'like', "%{$query}%")
                      ->orWhere('telephone', 'like', "%{$query}%");
        })->orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'Résultats de recherche pour "' . $query . '"',
            'data' => $clients
        ], 200);
    }
}

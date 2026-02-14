<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Piece;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PieceController extends Controller
{
    /**
     * Afficher la liste des pièces
     */
    public function index()
    {
        $pieces = Piece::with('fournisseur')->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $pieces,
            'message' => 'Pièces récupérées avec succès'
        ]);
    }

    /**
     * Afficher uniquement les pièces avec fournisseurs de type 'Vente pièce auto'
     */
    public function piecesWithAutoSuppliers()
    {
        $pieces = Piece::with('fournisseur')
            ->whereHas('fournisseur', function($query) {
                $query->where('type', 'Vente pièce auto');
            })
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $pieces,
            'message' => 'Pièces avec fournisseurs auto récupérées avec succès'
        ]);
    }

    /**
     * Afficher les pièces par type
     */
    public function byType($type)
    {
        $pieces = Piece::with('fournisseur')->byType($type)->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $pieces,
            'message' => "Pièces de type {$type} récupérées avec succès"
        ]);
    }

    /**
     * Afficher les pièces par modèle
     */
    public function byModele($modele)
    {
        $pieces = Piece::with('fournisseur')->byModele($modele)->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $pieces,
            'message' => "Pièces pour le modèle {$modele} récupérées avec succès"
        ]);
    }

    /**
     * Afficher les pièces en stock faible
     */
    public function lowStock()
    {
        $pieces = Piece::with('fournisseur')->lowStock()->orderBy('quantite', 'asc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $pieces,
            'message' => 'Pièces en stock faible récupérées avec succès'
        ]);
    }

    /**
     * Créer une nouvelle pièce
     */
    public function store(Request $request)
    {
        \Log::info('Piece store request received:', $request->all());
        
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'modele' => 'nullable|string|max:255',
            'quantite' => 'required|integer|min:0',
            'prix_achat' => 'nullable|numeric|min:0',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
            'type_piece' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $piece = Piece::create($request->all());
            $piece->load('fournisseur');
            
            \Log::info('Piece created successfully:', $piece->toArray());
            
            return response()->json([
                'success' => true,
                'data' => $piece,
                'message' => 'Pièce créée avec succès'
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Error creating piece: ' . $e->getMessage());
            \Log::error('Exception trace:', $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la pièce: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une pièce spécifique
     */
    public function show($id)
    {
        $piece = Piece::with('fournisseur')->find($id);
        
        if (!$piece) {
            return response()->json([
                'success' => false,
                'message' => 'Pièce non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $piece,
            'message' => 'Pièce récupérée avec succès'
        ]);
    }

    /**
     * Mettre à jour une pièce
     */
    public function update(Request $request, $id)
    {
        $piece = Piece::find($id);
        
        if (!$piece) {
            return response()->json([
                'success' => false,
                'message' => 'Pièce non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'modele' => 'nullable|string|max:255',
            'quantite' => 'required|integer|min:0',
            'prix_achat' => 'nullable|numeric|min:0',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
            'type_piece' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $piece->update($request->all());
            $piece->load('fournisseur');
            
            return response()->json([
                'success' => true,
                'data' => $piece,
                'message' => 'Pièce mise à jour avec succès'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la pièce: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une pièce
     */
    public function destroy($id)
    {
        $piece = Piece::find($id);
        
        if (!$piece) {
            return response()->json([
                'success' => false,
                'message' => 'Pièce non trouvée'
            ], 404);
        }

        try {
            $piece->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Pièce supprimée avec succès'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la pièce: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des pièces
     */
    public function statistics()
    {
        $total = Piece::count();
        $lowStock = Piece::lowStock()->count();
        $totalValue = Piece::sum('quantite * prix_achat');
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_pieces' => $total,
                'low_stock_pieces' => $lowStock,
                'total_value' => $totalValue
            ],
            'message' => 'Statistiques des pièces récupérées avec succès'
        ]);
    }
}

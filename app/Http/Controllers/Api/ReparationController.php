<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reparation;
use Illuminate\Http\Request;

class ReparationController extends Controller
{
    public function index()
    {
        $reparations = Reparation::with(['voiture', 'mecanicien', 'pieces'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($reparations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
            'cout_total' => 'nullable|numeric|min:0',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'statut' => 'required|in:en_attente,en_cours,terminee',
            'voiture_id' => 'nullable|exists:voitures,id',
            'mecanicien_id' => 'nullable|exists:ouvriers,id',
            'pieces_utilisees' => 'array',
            'pieces_utilisees.*' => 'exists:pieces,id'
        ]);

        $reparation = Reparation::create($request->all());

        // Attacher les pièces si fournies
        if ($request->has('pieces_utilisees')) {
            $piecesData = [];
            foreach ($request->pieces_utilisees as $pieceId) {
                $piecesData[$pieceId] = ['quantite_utilisee' => 1];
                
                // Déduire la quantité de la pièce
                $piece = \App\Models\Piece::find($pieceId);
                if ($piece && $piece->quantite > 0) {
                    $piece->decrement('quantite', 1);
                }
            }
            $reparation->pieces()->attach($piecesData);
        }

        return response()->json($reparation->load(['voiture', 'mecanicien', 'pieces']), 201);
    }

    public function show(Reparation $reparation)
    {
        return response()->json($reparation->load(['voiture', 'mecanicien', 'pieces']));
    }

    public function update(Request $request, Reparation $reparation)
    {
        $request->validate([
            'description' => 'required|string',
            'cout_total' => 'nullable|numeric|min:0',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'statut' => 'required|in:en_attente,en_cours,terminee',
            'voiture_id' => 'nullable|exists:voitures,id',
            'mecanicien_id' => 'nullable|exists:ouvriers,id',
            'pieces_utilisees' => 'array',
            'pieces_utilisees.*' => 'exists:pieces,id'
        ]);

        $reparation->update($request->all());

        // Mettre à jour les pièces si fournies
        if ($request->has('pieces_utilisees')) {
            // Récupérer les anciennes pièces pour remettre les quantités
            $oldPieces = $reparation->pieces()->pluck('piece_id')->toArray();
            
            // Remettre les quantités des anciennes pièces
            foreach ($oldPieces as $pieceId) {
                $piece = \App\Models\Piece::find($pieceId);
                if ($piece) {
                    $piece->increment('quantite', 1);
                }
            }
            
            // Détacher toutes les anciennes pièces
            $reparation->pieces()->detach();
            
            // Attacher les nouvelles pièces et déduire les quantités
            $piecesData = [];
            foreach ($request->pieces_utilisees as $pieceId) {
                $piecesData[$pieceId] = ['quantite_utilisee' => 1];
                
                // Déduire la quantité de la pièce
                $piece = \App\Models\Piece::find($pieceId);
                if ($piece && $piece->quantite > 0) {
                    $piece->decrement('quantite', 1);
                }
            }
            $reparation->pieces()->attach($piecesData);
        }

        return response()->json($reparation->load(['voiture', 'mecanicien', 'pieces']));
    }

    public function destroy(Reparation $reparation)
    {
        // Remettre les quantités des pièces avant suppression
        $pieces = $reparation->pieces;
        foreach ($pieces as $piece) {
            $piece->increment('quantite', $piece->pivot->quantite_utilisee);
        }
        
        $reparation->pieces()->detach();
        $reparation->delete();
        
        return response()->json(null, 204);
    }
}

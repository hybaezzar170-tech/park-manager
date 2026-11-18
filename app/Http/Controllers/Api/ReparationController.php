<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reparation;
use App\Models\Piece;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

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
            'pieces_utilisees' => 'sometimes|array',
            'pieces_utilisees.*' => 'exists:pieces,id'
        ]);

        $reparation = DB::transaction(function () use ($request) {

            $piecesData = [];

            // Vérifier le stock avant toute création
            foreach ($request->input('pieces_utilisees', []) as $pieceId) {
                $piece = Piece::where('id', $pieceId)
                    ->lockForUpdate()
                    ->first();

                if (!$piece || $piece->quantite < 1) {
                    throw ValidationException::withMessages([
                        'pieces_utilisees' => [
                            "Stock insuffisant pour la pièce ID {$pieceId}."
                        ]
                    ]);
                }

                $piecesData[$pieceId] = [
                    'quantite_utilisee' => 1
                ];

                $piece->decrement('quantite', 1);
            }

            $reparation = Reparation::create(
                $request->except('pieces_utilisees')
            );

            if (!empty($piecesData)) {
                $reparation->pieces()->attach($piecesData);
            }

            return $reparation;
        });

        return response()->json(
            $reparation->load(['voiture', 'mecanicien', 'pieces']),
            201
        );
    }

    public function show(Reparation $reparation)
    {
        return response()->json(
            $reparation->load(['voiture', 'mecanicien', 'pieces'])
        );
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
            'pieces_utilisees' => 'sometimes|array',
            'pieces_utilisees.*' => 'exists:pieces,id'
        ]);

        DB::transaction(function () use ($request, $reparation) {

            if ($request->has('pieces_utilisees')) {

                // Verrouiller et récupérer les anciennes pièces
                $oldPieces = $reparation->pieces()->get();

                // Restaurer le stock des anciennes pièces
                foreach ($oldPieces as $piece) {
                    $pieceLocked = Piece::where('id', $piece->id)
                        ->lockForUpdate()
                        ->first();

                    if ($pieceLocked) {
                        $pieceLocked->increment(
                            'quantite',
                            $piece->pivot->quantite_utilisee
                        );
                    }
                }

                // Détacher les anciennes pièces
                $reparation->pieces()->detach();

                $piecesData = [];

                // Vérifier et déduire le stock des nouvelles pièces
                foreach ($request->pieces_utilisees as $pieceId) {
                    $piece = Piece::where('id', $pieceId)
                        ->lockForUpdate()
                        ->first();

                    if (!$piece || $piece->quantite < 1) {
                        throw ValidationException::withMessages([
                            'pieces_utilisees' => [
                                "Stock insuffisant pour la pièce ID {$pieceId}."
                            ]
                        ]);
                    }

                    $piecesData[$pieceId] = [
                        'quantite_utilisee' => 1
                    ];

                    $piece->decrement('quantite', 1);
                }

                $reparation->pieces()->attach($piecesData);
            }

            $reparation->update(
                $request->except('pieces_utilisees')
            );
        });

        return response()->json(
            $reparation->load(['voiture', 'mecanicien', 'pieces'])
        );
    }

    public function destroy(Reparation $reparation)
    {
        DB::transaction(function () use ($reparation) {

            $pieces = $reparation->pieces()->get();

            foreach ($pieces as $piece) {
                $pieceLocked = Piece::where('id', $piece->id)
                    ->lockForUpdate()
                    ->first();

                if ($pieceLocked) {
                    $pieceLocked->increment(
                        'quantite',
                        $piece->pivot->quantite_utilisee
                    );
                }
            }

            $reparation->pieces()->detach();
            $reparation->delete();
        });

        return response()->json(null, 204);
    }
}

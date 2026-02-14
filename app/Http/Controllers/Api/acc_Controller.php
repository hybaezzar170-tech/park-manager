<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\acc_;  // 🔹 modèle à utiliser

class acc_Controller extends Controller
{
    public function index()
    {
        return response()->json(acc_::with(['fournisseur', 'voiture'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'voiture_id'     => 'required|exists:voitures,id',
            'reference'      => 'required|unique:acc_,reference',
            'nom'            => 'required|string',
            'categorie'      => 'required|string',
            'marque'         => 'nullable|string',
            'quantite'       => 'required|integer',
            'seuil_alerte'   => 'nullable|integer',
            'etat'           => 'nullable|string',
            'prix_achat'     => 'nullable|numeric',
            'prix_vente'     => 'nullable|numeric',
            'date_achat'     => 'nullable|date',
            'description'    => 'nullable|string',
        ]);

        $acc = acc_::create($validated);
        return response()->json($acc, 201);
    }

    public function show($id)
    {
        return response()->json(acc_::with(['fournisseur', 'voiture'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $acc = acc_::findOrFail($id);

        $validated = $request->validate([
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'voiture_id'     => 'required|exists:voitures,id',
            'reference'      => 'required|unique:acc_,reference,' . $id,
            'nom'            => 'required|string',
            'categorie'      => 'required|string',
            'marque'         => 'nullable|string',
            'quantite'       => 'required|integer',
            'seuil_alerte'   => 'nullable|integer',
            'etat'           => 'nullable|string',
            'prix_achat'     => 'nullable|numeric',
            'prix_vente'     => 'nullable|numeric',
            'date_achat'     => 'nullable|date',
            'description'    => 'nullable|string',
        ]);

        $acc->update($validated);

        return response()->json($acc);
    }

    public function destroy($id)
    {
        $acc = acc_::findOrFail($id);
        $acc->delete();

        return response()->json(['message' => 'Acc supprimé avec succès']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TaxeCirculation;

class TaxeCirculationController extends Controller
{
    public function index()
    {
        return TaxeCirculation::with('voiture')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'voiture_id' => 'required|exists:voitures,id',
            'annee' => 'required|digits:4|integer',
            'montant' => 'required|numeric',
            'date_paiement' => 'nullable|date',
            'status' => 'required|in:payé,non payé',
            'date_expiration' => 'nullable|date',
            'rappel_jours' => 'nullable|integer',
            'note' => 'nullable|string'
        ]);

        $taxe = TaxeCirculation::create($validated);
        return response()->json($taxe, 201);
    }

    public function show($id)
    {
        return TaxeCirculation::with('voiture')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $taxe = TaxeCirculation::findOrFail($id);
        $taxe->update($request->all());
        return response()->json($taxe);
    }

    public function destroy($id)
    {
        $taxe = TaxeCirculation::findOrFail($id);
        $taxe->delete();
        return response()->json(['message' => 'Taxe Circulation supprimée']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Assurance;

class AssuranceController extends Controller
{
    public function index()
    {
        return Assurance::with(['voiture','fournisseur'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'voiture_id' => 'required|exists:voitures,id',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
            'type_assurance' => 'required|string',
            'date_debut' => 'required|date',
            'date_expiration' => 'required|date',
            'rappel_jours' => 'nullable|integer',
            'note' => 'nullable|string'
        ]);

        $assurance = Assurance::create($validated);
        return response()->json($assurance, 201);
    }

    public function show($id)
    {
        return Assurance::with(['voiture','fournisseur'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $assurance = Assurance::findOrFail($id);
        $assurance->update($request->all());
        return response()->json($assurance);
    }

    public function destroy($id)
    {
        $assurance = Assurance::findOrFail($id);
        $assurance->delete();
        return response()->json(['message' => 'Assurance supprimée']);
    }
}

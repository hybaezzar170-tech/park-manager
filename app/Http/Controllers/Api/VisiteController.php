<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Visite;

class VisiteController extends Controller
{
    public function index()
    {
        return Visite::with('voiture')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'voiture_id' => 'required|exists:voitures,id',
            'date_visite' => 'required|date',
            'prochaine_visite' => 'nullable|date',
            'rappel_jours' => 'nullable|integer',
            'note' => 'nullable|string'
        ]);

        $visite = Visite::create($validated);
        return response()->json($visite, 201);
    }

    public function show($id)
    {
        return Visite::with('voiture')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $visite = Visite::findOrFail($id);
        $visite->update($request->all());
        return response()->json($visite);
    }

    public function destroy($id)
    {
        $visite = Visite::findOrFail($id);
        $visite->delete();
        return response()->json(['message' => 'Visite supprimée']);
    }
}

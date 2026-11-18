<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vente;
use App\Models\Voiture;
use Illuminate\Http\Request;

class VenteController extends Controller
{
    public function index()
    {
        return Vente::with('voiture')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'voiture_id' => 'required|exists:voitures,id',
            'client_id' => 'required|exists:clients,id',
            'prix_vente' => 'required|numeric|min:0.01',
            'date_vente' => 'required|date'
        ]);

        $voiture = Voiture::findOrFail($request->voiture_id);

        if ($voiture->etat === 'en_location') {
            return response()->json([
                'error' => 'Voiture en location'
            ], 400);
        }

        if ($voiture->etat === 'vendue') {
            return response()->json([
                'error' => 'Cette voiture est déjà vendue'
            ], 400);
        }

        $vente = Vente::create($request->all());

        $voiture->etat = 'vendue';
        $voiture->save();

        return response()->json($vente, 201);
    }
}

<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vente;
use App\Models\Voiture;
use Illuminate\Http\Request;

class VenteController extends Controller
{
    public function index() {
        return Vente::with('voiture')->get();
    }

    public function store(Request $request) {
        $request->validate([
            'voiture_id' => 'required|exists:voitures,id',
            'acheteur' => 'required',
            'prix_vente' => 'required|numeric',
            'date_vente' => 'required|date'
        ]);

        $voiture = Voiture::findOrFail($request->voiture_id);

        if ($voiture->etat === 'location') {
            return response()->json(['error' => 'Voiture en location'], 400);
        }

        $vente = Vente::create($request->all());

        $voiture->etat = 'vendue';
        $voiture->save();

        return response()->json($vente, 201);
    }
}

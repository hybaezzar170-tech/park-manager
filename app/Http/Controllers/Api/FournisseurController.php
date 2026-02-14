<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fournisseur;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    // Lister tous les fournisseurs
    public function index()
    {
        return response()->json(Fournisseur::all(), 200);
    }

    // Lister uniquement les fournisseurs de pièces
    public function piecesSuppliers()
    {
        $fournisseurs = Fournisseur::where('type', 'Vente pièce auto')->get();
        return response()->json($fournisseurs, 200);
    }

    // Ajouter un fournisseur
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'email' => 'nullable|email|unique:fournisseurs,email',
            'tel' => 'required|string|max:20',
            'fax' => 'nullable|string|max:20',
            'site_web' => 'nullable|string|max:255',
            'adresse' => 'required|string',
            'ville' => 'required|string|max:100',
            'code_postal' => 'required|string|max:20',
            'contact' => 'nullable|string|max:255',
        ]);

        $fournisseur = Fournisseur::create($request->all());
        return response()->json($fournisseur, 201);
    }

    // Afficher un fournisseur
    public function show($id)
    {
        $fournisseur = Fournisseur::find($id);
        if (!$fournisseur) return response()->json(['message'=>'Fournisseur non trouvé'],404);
        return response()->json($fournisseur,200);
    }

    // Modifier un fournisseur
    public function update(Request $request, $id)
    {
        $fournisseur = Fournisseur::find($id);
        if (!$fournisseur) return response()->json(['message'=>'Fournisseur non trouvé'],404);

        $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'prenom' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|unique:fournisseurs,email,'.$id,
            'tel' => 'sometimes|required|string|max:20',
            'fax' => 'nullable|string|max:20',
            'site_web' => 'nullable|string|max:255',
            'adresse' => 'sometimes|required|string',
            'ville' => 'sometimes|required|string|max:100',
            'code_postal' => 'sometimes|required|string|max:20',
            'contact' => 'nullable|string|max:255',
        ]);

        $fournisseur->update($request->all());
        return response()->json($fournisseur,200);
    }

    // Supprimer un fournisseur
    public function destroy($id)
    {
        $fournisseur = Fournisseur::find($id);
        if (!$fournisseur) return response()->json(['message'=>'Fournisseur non trouvé'],404);

        $fournisseur->delete();
        return response()->json(['message'=>'Fournisseur supprimé'],200);
    }
}

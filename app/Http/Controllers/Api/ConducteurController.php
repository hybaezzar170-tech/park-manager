<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conducteur;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ConducteurController extends Controller
{
    public function index(Request $request)
    {
        if ($request->query('all') === 'true') {
            return response()->json(Conducteur::all(), 200);
        }
        return response()->json(Conducteur::where('etat', 'actif')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'date_naissance' => 'required|date',
            'date_embauche' => 'required|date',
            'numero_permis' => 'required|string|unique:conducteurs',
            'adresse' => 'required|string',
            'ville' => 'required|string',
            'code_postal' => 'required|string|max:10',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|unique:conducteurs',
            'password' => 'nullable|string|min:6',
            'etat' => 'nullable|string|in:actif,inactif'
        ]);

        // Générer un mot de passe aléatoire si non fourni
        if (empty($validated['password'])) {
            $validated['password'] = Str::random(12);
            $generatedPassword = $validated['password'];
        } else {
            // Hasher le mot de passe fourni
            $validated['password'] = bcrypt($validated['password']);
            $generatedPassword = null;
        }

        // S'assurer que etat a une valeur par défaut
        $validated['etat'] = $validated['etat'] ?? 'actif';

        $conducteur = Conducteur::create($validated);

        // Préparer la réponse
        $response = [
            'message' => 'Conducteur ajouté avec succès',
            'data' => $conducteur
        ];

        // Ajouter le mot de passe généré à la réponse seulement si généré
        if ($generatedPassword) {
            $response['password'] = $generatedPassword;
            $response['message'] .= ' - Mot de passe généré : ' . $generatedPassword . ' (à communiquer au conducteur)';
        }

        return response()->json($response, 201);
    }

    public function show($id)
    {
        $conducteur = Conducteur::find($id);

        if (!$conducteur) {
            return response()->json(['message' => 'Conducteur introuvable'], 404);
        }

        return response()->json($conducteur, 200);
    }

    public function update(Request $request, $id)
    {
        $conducteur = Conducteur::find($id);

        if (!$conducteur) {
            return response()->json(['message' => 'Conducteur introuvable'], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:100',
            'prenom' => 'sometimes|required|string|max:100',
            'date_naissance' => 'sometimes|required|date',
            'date_embauche' => 'sometimes|required|date',
            'numero_permis' => 'sometimes|required|string|unique:conducteurs,numero_permis,' . $id,
            'adresse' => 'sometimes|required|string',
            'ville' => 'sometimes|required|string',
            'code_postal' => 'sometimes|required|string|max:10',
            'telephone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|unique:conducteurs,email,' . $id,
            'password' => 'nullable|string|min:6',
            'etat' => 'nullable|string|in:actif,inactif'
        ]);

        $conducteur->update($validated);

        return response()->json([
            'message' => 'Conducteur modifié avec succès',
            'data' => $conducteur
        ], 200);
    }

    public function destroy($id)
    {
        $conducteur = Conducteur::find($id);

        if (!$conducteur) {
            return response()->json(['message' => 'Conducteur introuvable'], 404);
        }

        $conducteur->delete();

        return response()->json(['message' => 'Conducteur supprimé avec succès'], 200);
    }

    public function toggleEtat($id)
    {
        $conducteur = Conducteur::find($id);

        if (!$conducteur) {
            return response()->json(['message' => 'Conducteur introuvable'], 404);
        }

        $conducteur->etat = $conducteur->etat === 'actif' ? 'inactif' : 'actif';
        $conducteur->save();

        return response()->json([
            'message' => 'État du conducteur modifié avec succès',
            'data' => $conducteur
        ], 200);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $conducteur = Conducteur::where('email', $validated['email'])->first();

        if (!$conducteur) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        // Vérifier si le conducteur est actif
        if ($conducteur->etat !== 'actif') {
            return response()->json(['message' => 'Votre compte est désactivé. Veuillez contacter l\'administrateur'], 403);
        }

        // Vérifier le mot de passe
        if (!password_verify($validated['password'], $conducteur->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        // Générer un token simple (pour cet exemple)
        $token = base64_encode($conducteur->email . ':' . time());

        return response()->json([
            'message' => 'Connexion réussie',
            'conducteur' => $conducteur,
            'token' => $token
        ], 200);
    }
}

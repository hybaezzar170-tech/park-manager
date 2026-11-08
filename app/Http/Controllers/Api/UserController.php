<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\CompteCreeMail;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->all();
        
        // Validation manuelle
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'sometimes|string|min:8',
            'role' => 'required|in:admin,user',
            'telephone' => 'nullable|string|max:20'
        ];
        
        // Validation basique
        if (empty($validated['name'])) {
            return response()->json(['success' => false, 'message' => 'Le nom est requis'], 422);
        }
        if (empty($validated['email'])) {
            return response()->json(['success' => false, 'message' => 'L\'email est requis'], 422);
        }
        if (empty($validated['role'])) {
            return response()->json(['success' => false, 'message' => 'Le rôle est requis'], 422);
        }
        
        // Validation email unique
        $existingUser = \App\Models\User::where('email', $validated['email'])->first();
        if ($existingUser) {
            return response()->json(['success' => false, 'message' => 'Cet email existe déjà'], 422);
        }
        
        // Validation rôle
        if (!in_array($validated['role'], ['admin', 'user'])) {
            return response()->json(['success' => false, 'message' => 'Rôle invalide'], 422);
        }

        // Générer un mot de passe si non fourni et que le rôle est "user"
        $password = $validated['password'] ?? null;
        if (!$password && $validated['role'] === 'user') {
            $password = $this->generatePassword($validated['name']);
        }

        $validated['password'] = Hash::make($password ?? $validated['password']);

        $user = User::create($validated);

        // Envoyer l'email avec les identifiants si c'est un user et qu'on a généré un mot de passe
        if ($validated['role'] === 'user' && $password) {
            \Log::info("Début envoi email pour: " . $user->email);
            
            try {
                Mail::to($user->email)->send(new CompteCreeMail([
                    'nom' => $user->name,
                    'prenom' => '',
                    'email' => $user->email,
                    'password' => $password,
                    'type' => $user->role
                ]));
                
                \Log::info("Email envoyé avec succès à: " . $user->email);
            } catch (\Exception $mailException) {
                // Continuer même si l'email échoue
                \Log::error('Erreur envoi email: ' . $mailException->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Utilisateur cree avec succes' . 
                ($password ? ' et email envoye' : '')
        ], 201);
    }

    /**
     * Générer un mot de passe automatique
     */
    private function generatePassword($name)
    {
        $parts = explode(' ', $name);
        $password = '';
        
        foreach ($parts as $part) {
            if (strlen($part) >= 2) {
                $password .= strtoupper(substr($part, 0, 2));
            }
        }
        
        return $password . rand(100, 999);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
            'role' => 'sometimes|required|in:admin,user'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Utilisateur modifié avec succès',
            'data' => $user
        ], 200);
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'Utilisateur supprimé'], 200);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        // Créer un token simple (vous pouvez utiliser Laravel Sanctum pour plus de sécurité)
        $token = base64_encode($user->id . ':' . $user->email . ':' . time());

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token
        ], 200);
    }
}

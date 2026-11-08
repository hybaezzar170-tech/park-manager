<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\CompteCreeMail;
use App\Services\SMSServiceSimple;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'sometimes|string|min:8',
            'role' => 'required|in:admin,user'
        ]);

        // Générer un mot de passe si non fourni et que le rôle est "user"
        $password = $validated['password'] ?? null;
        if (!$password && $validated['role'] === 'user') {
            $password = $this->generatePassword($validated['name']);
        }

        $validated['password'] = Hash::make($password ?? $validated['password']);

        $user = User::create($validated);

        // Test simple d'envoi d'email
        if ($validated['role'] === 'user' && $password) {
            try {
                // Email de test simple
                $to = $user->email;
                $subject = "Votre compte AutoPark a été créé";
                $message = "Bonjour {$validated['name']},\n\n";
                $message .= "Votre compte a été créé avec succès.\n\n";
                $message .= "Email: {$user->email}\n";
                $message .= "Mot de passe: {$password}\n";
                $message .= "Rôle: {$user->role}\n\n";
                $message .= "Merci d'utiliser AutoPark!";

                $headers = "From: noreply@autopark.com\r\n";
                $headers .= "Reply-To: noreply@autopark.com\r\n";
                $headers .= "X-Mailer: PHP/" . phpversion();

                // Envoi avec mail() PHP natif pour tester
                $sent = mail($to, $subject, $message, $headers);
                
                if ($sent) {
                    \Log::info("Email envoyé avec succès à: " . $to);
                } else {
                    \Log::error("Échec de l'envoi d'email à: " . $to);
                }
            } catch (\Exception $mailException) {
                // Continuer même si l'email échoue
                \Log::error('Erreur envoi email: ' . $mailException->getMessage());
            }
            
            // Envoyer un SMS si un numéro de téléphone est fourni
            if (!empty($validated['telephone'])) {
                \Log::info("Téléphone fourni: " . $validated['telephone'] . " - Début envoi SMS");
                
                try {
                    $smsService = new SMSServiceSimple();
                    $smsSent = $smsService->sendCredentialsSMS(
                        $validated['telephone'],
                        $user->name,
                        $user->email,
                        $password
                    );
                    
                    if ($smsSent) {
                        \Log::info("SMS envoyé avec succès à " . $validated['telephone']);
                    } else {
                        \Log::error("Échec de l'envoi SMS à " . $validated['telephone']);
                    }
                } catch (\Exception $smsException) {
                    \Log::error('Erreur envoi SMS: ' . $smsException->getMessage());
                }
            } else {
                \Log::info("Aucun numéro de téléphone fourni - SMS non envoyé");
            }
        }

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Utilisateur créé avec succès' . 
                ($password ? ' et email envoyé' : '') . 
                (!empty($validated['telephone']) && $password ? ' et SMS envoyé' : '')
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

        $token = base64_encode($user->id . ':' . $user->email . ':' . time());

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token
        ], 200);
    }
}

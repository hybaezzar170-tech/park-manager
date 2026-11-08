<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ouvrier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\CompteCreeMail;

class OuvrierController extends Controller
{
    /**
     * Afficher la liste des ouvriers
     */
    public function index()
    {
        $ouvriers = Ouvrier::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $ouvriers,
            'message' => 'Ouvriers récupérés avec succès'
        ]);
    }

    /**
     * Afficher les ouvriers actifs
     */
    public function actifs()
    {
        $ouvriers = Ouvrier::actifs()->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $ouvriers,
            'message' => 'Ouvriers actifs récupérés avec succès'
        ]);
    }

    /**
     * Afficher les ouvriers par type
     */
    public function byType($type)
    {
        if (!in_array($type, ['technicien', 'mecanicien'])) {
            return response()->json([
                'success' => false,
                'message' => 'Type invalide. Types autorisés: technicien, mecanicien'
            ], 400);
        }

        $ouvriers = Ouvrier::byType($type)->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $ouvriers,
            'message' => "Ouvriers de type {$type} récupérés avec succès"
        ]);
    }

    /**
     * Créer un nouvel ouvrier
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'type' => 'required|in:technicien,mecanicien',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'salaire' => 'nullable|numeric|min:0',
            'date_embauche' => 'nullable|date',
            'statut' => 'nullable|in:actif,inactif',
            'adresse' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Gérer le mot de passe
            $password = null;
            if ($request->filled('password')) {
                // Utiliser le mot de passe fourni
                $password = $request->password;
                $hashedPassword = bcrypt($password);
                $request->merge(['password' => $hashedPassword]);
            } elseif ($request->filled('email')) {
                // Générer un mot de passe automatiquement si email fourni mais pas de mot de passe
                $password = strtoupper(substr($request->prenom, 0, 2)) . substr($request->nom, 0, 2) . rand(100, 999);
                $request->merge(['password' => bcrypt($password)]);
            }

            $ouvrier = Ouvrier::create($request->all());

            // Envoyer l'email avec les identifiants si un email est fourni
            if ($password && $ouvrier->email) {
                try {
                    Mail::to($ouvrier->email)->send(new CompteCreeMail([
                        'nom' => $ouvrier->nom,
                        'prenom' => $ouvrier->prenom,
                        'email' => $ouvrier->email,
                        'password' => $password,
                        'type' => $ouvrier->type
                    ]));
                } catch (\Exception $mailException) {
                    // Continuer même si l'email échoue
                    \Log::error('Erreur envoi email: ' . $mailException->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'data' => $ouvrier,
                'message' => 'Ouvrier cree avec succes' . 
                    ($password ? ' et email envoye' : '')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'ouvrier: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un ouvrier spécifique
     */
    public function show($id)
    {
        $ouvrier = Ouvrier::find($id);
        
        if (!$ouvrier) {
            return response()->json([
                'success' => false,
                'message' => 'Ouvrier non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ouvrier,
            'message' => 'Ouvrier récupéré avec succès'
        ]);
    }

    /**
     * Mettre à jour un ouvrier
     */
    public function update(Request $request, $id)
    {
        $ouvrier = Ouvrier::find($id);
        
        if (!$ouvrier) {
            return response()->json([
                'success' => false,
                'message' => 'Ouvrier non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'type' => 'required|in:technicien,mecanicien',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'salaire' => 'nullable|numeric|min:0',
            'date_embauche' => 'nullable|date',
            'statut' => 'nullable|in:actif,inactif',
            'adresse' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Gérer le mot de passe
            $password = null;
            if ($request->filled('password')) {
                // Utiliser le mot de passe fourni
                $password = $request->password;
                $hashedPassword = bcrypt($password);
                $request->merge(['password' => $hashedPassword]);
            } elseif ($request->filled('email')) {
                // Générer un mot de passe automatiquement si email fourni mais pas de mot de passe
                $password = strtoupper(substr($request->prenom, 0, 2)) . substr($request->nom, 0, 2) . rand(100, 999);
                $request->merge(['password' => bcrypt($password)]);
            }

            $ouvrier->update($request->all());

            // Envoyer l'email avec les identifiants si un email est fourni
            if ($password && $ouvrier->email) {
                try {
                    Mail::to($ouvrier->email)->send(new CompteCreeMail([
                        'nom' => $ouvrier->nom,
                        'prenom' => $ouvrier->prenom,
                        'email' => $ouvrier->email,
                        'password' => $password,
                        'type' => $ouvrier->type
                    ]));
                } catch (\Exception $mailException) {
                    // Continuer même si l'email échoue
                    \Log::error('Erreur envoi email: ' . $mailException->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'data' => $ouvrier,
                'message' => 'Ouvrier mis à jour avec succes' . 
                    ($password ? ' et email envoye' : '')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de l\'ouvrier: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un ouvrier
     */
    public function destroy($id)
    {
        $ouvrier = Ouvrier::find($id);
        
        if (!$ouvrier) {
            return response()->json([
                'success' => false,
                'message' => 'Ouvrier non trouvé'
            ], 404);
        }

        try {
            $ouvrier->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Ouvrier supprimé avec succès'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'ouvrier: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des ouvriers
     */
    public function statistics()
    {
        $total = Ouvrier::count();
        $actifs = Ouvrier::actifs()->count();
        $techniciens = Ouvrier::byType('technicien')->count();
        $mecaniciens = Ouvrier::byType('mecanicien')->count();
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_ouvriers' => $total,
                'ouvriers_actifs' => $actifs,
                'techniciens' => $techniciens,
                'mecaniciens' => $mecaniciens,
                'ouvriers_inactifs' => $total - $actifs
            ],
            'message' => 'Statistiques des ouvriers récupérées avec succès'
        ]);
    }
}

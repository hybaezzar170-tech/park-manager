<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerte;
use App\Models\Assurance;
use App\Models\TaxeCirculation;
use App\Models\Visite;
use App\Models\Voiture;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AlerteController extends Controller
{
    public function index()
    {
        return Alerte::all();
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'type' => 'required|string|in:Assurance,Taxe circulation,Visite technique,Entretien'
            ]);

            $alerte = Alerte::create($validated);
            return response()->json($alerte, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function getExpirationAlerts()
    {
        $alerts = [];
        $today = Carbon::now();
        $warningDays = 3; // Alert 3 days before expiration
        $urgentDays = 1;   // Alert 1 day before expiration

        // Check Assurances
        $assurances = Assurance::with('voiture')->get();
        foreach ($assurances as $assurance) {
            if ($assurance->date_expiration) {
                $expirationDate = Carbon::parse($assurance->date_expiration);
                $daysUntil = $today->diffInDays($expirationDate, false);
                
                // Show expired items as urgent
                if ($daysUntil < 0) {
                    $alerts[] = [
                        'id' => 'assurance_' . $assurance->id,
                        'type' => 'Urgent',
                        'message' => "Assurance a expiré le " . $expirationDate->format('d/m/Y'),
                        'voiture' => $assurance->voiture->matricule . ' - ' . $assurance->voiture->modele,
                        'date_expiration' => $assurance->date_expiration,
                        'days_remaining' => $daysUntil,
                        'category' => 'Assurance'
                    ];
                } elseif ($daysUntil <= $urgentDays) {
                    $alerts[] = [
                        'id' => 'assurance_' . $assurance->id,
                        'type' => 'Urgent',
                        'message' => "Assurance expire le " . $expirationDate->format('d/m/Y'),
                        'voiture' => $assurance->voiture->matricule . ' - ' . $assurance->voiture->modele,
                        'date_expiration' => $assurance->date_expiration,
                        'days_remaining' => $daysUntil,
                        'category' => 'Assurance'
                    ];
                } elseif ($daysUntil <= $warningDays) {
                    $alerts[] = [
                        'id' => 'assurance_' . $assurance->id,
                        'type' => 'Warning',
                        'message' => "Assurance expire le " . $expirationDate->format('d/m/Y'),
                        'voiture' => $assurance->voiture->matricule . ' - ' . $assurance->voiture->modele,
                        'date_expiration' => $assurance->date_expiration,
                        'days_remaining' => $daysUntil,
                        'category' => 'Assurance'
                    ];
                }
            }
        }

        // Check Taxes Circulation
        $taxes = TaxeCirculation::with('voiture')->get();
        foreach ($taxes as $taxe) {
            if ($taxe->date_expiration) {
                $expirationDate = Carbon::parse($taxe->date_expiration);
                $daysUntil = $today->diffInDays($expirationDate, false);
                
                // Show expired items as urgent
                if ($daysUntil < 0) {
                    $alerts[] = [
                        'id' => 'taxe_' . $taxe->id,
                        'type' => 'Urgent',
                        'message' => "Taxe circulation a expiré le " . $expirationDate->format('d/m/Y'),
                        'voiture' => $taxe->voiture->matricule . ' - ' . $taxe->voiture->modele,
                        'date_expiration' => $taxe->date_expiration,
                        'days_remaining' => $daysUntil,
                        'category' => 'Taxe circulation'
                    ];
                } elseif ($daysUntil <= $urgentDays) {
                    $alerts[] = [
                        'id' => 'taxe_' . $taxe->id,
                        'type' => 'Urgent',
                        'message' => "Taxe circulation expire le " . $expirationDate->format('d/m/Y'),
                        'voiture' => $taxe->voiture->matricule . ' - ' . $taxe->voiture->modele,
                        'date_expiration' => $taxe->date_expiration,
                        'days_remaining' => $daysUntil,
                        'category' => 'Taxe circulation'
                    ];
                } elseif ($daysUntil <= $warningDays) {
                    $alerts[] = [
                        'id' => 'taxe_' . $taxe->id,
                        'type' => 'Warning',
                        'message' => "Taxe circulation expire le " . $expirationDate->format('d/m/Y'),
                        'voiture' => $taxe->voiture->matricule . ' - ' . $taxe->voiture->modele,
                        'date_expiration' => $taxe->date_expiration,
                        'days_remaining' => $daysUntil,
                        'category' => 'Taxe circulation'
                    ];
                }
            }
        }

        // Check Visites Techniques
        $visites = Visite::with('voiture')->get();
        foreach ($visites as $visite) {
            if ($visite->prochaine_visite) {
                $expirationDate = Carbon::parse($visite->prochaine_visite);
                $daysUntil = $today->diffInDays($expirationDate, false);
                
                // Show expired items as urgent
                if ($daysUntil < 0) {
                    $alerts[] = [
                        'id' => 'visite_' . $visite->id,
                        'type' => 'Urgent',
                        'message' => "Visite technique était prévue le " . $expirationDate->format('d/m/Y'),
                        'voiture' => $visite->voiture->matricule . ' - ' . $visite->voiture->modele,
                        'date_expiration' => $visite->prochaine_visite,
                        'days_remaining' => $daysUntil,
                        'category' => 'Visite technique'
                    ];
                } elseif ($daysUntil <= $urgentDays) {
                    $alerts[] = [
                        'id' => 'visite_' . $visite->id,
                        'type' => 'Urgent',
                        'message' => "Visite technique le " . $expirationDate->format('d/m/Y'),
                        'voiture' => $visite->voiture->matricule . ' - ' . $visite->voiture->modele,
                        'date_expiration' => $visite->prochaine_visite,
                        'days_remaining' => $daysUntil,
                        'category' => 'Visite technique'
                    ];
                } elseif ($daysUntil <= $warningDays) {
                    $alerts[] = [
                        'id' => 'visite_' . $visite->id,
                        'type' => 'Warning',
                        'message' => "Visite technique le " . $expirationDate->format('d/m/Y'),
                        'voiture' => $visite->voiture->matricule . ' - ' . $visite->voiture->modele,
                        'date_expiration' => $visite->prochaine_visite,
                        'days_remaining' => $daysUntil,
                        'category' => 'Visite technique'
                    ];
                }
            }
        }

        // Sort alerts by urgency and days remaining
        usort($alerts, function($a, $b) {
            if ($a['type'] === 'Urgent' && $b['type'] !== 'Urgent') return -1;
            if ($a['type'] !== 'Urgent' && $b['type'] === 'Urgent') return 1;
            return $a['days_remaining'] - $b['days_remaining'];
        });

        return response()->json($alerts);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExpirationAlert;
use App\Models\Assurance;
use App\Models\TaxeCirculation;
use App\Models\Visite;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ExpirationAlertController extends Controller
{
    public function index()
    {
        $alerts = [];
        $today = Carbon::now();
        $warningDays = 3; // Alert 3 days before expiration
        $urgentDays = 1;   // Alert 1 day before expiration

        // Check Assurances
        try {
            $assurances = Assurance::with('voiture')->get();
            foreach ($assurances as $assurance) {
                if ($assurance->date_expiration) {
                    $expirationDate = Carbon::parse($assurance->date_expiration);
                    $daysUntil = $today->diffInDays($expirationDate, false);
                    
                    // Show expired items as urgent
                    if ($daysUntil < 0) {
                        $alerts[] = [
                            'alert_type' => 'Assurance',
                            'voiture_matricule' => $assurance->voiture ? $assurance->voiture->matricule : 'Unknown',
                            'voiture_modele' => $assurance->voiture ? $assurance->voiture->modele : 'Unknown',
                            'expiration_date' => $assurance->date_expiration,
                            'days_remaining' => $daysUntil,
                            'urgency' => 'Urgent',
                            'message' => "Assurance a expiré le " . $expirationDate->format('d/m/Y'),
                            'reference_id' => 'assurance_' . $assurance->id,
                        ];
                    } elseif ($daysUntil <= $urgentDays) {
                        $alerts[] = [
                            'alert_type' => 'Assurance',
                            'voiture_matricule' => $assurance->voiture ? $assurance->voiture->matricule : 'Unknown',
                            'voiture_modele' => $assurance->voiture ? $assurance->voiture->modele : 'Unknown',
                            'expiration_date' => $assurance->date_expiration,
                            'days_remaining' => $daysUntil,
                            'urgency' => 'Urgent',
                            'message' => "Assurance expire le " . $expirationDate->format('d/m/Y'),
                            'reference_id' => 'assurance_' . $assurance->id,
                        ];
                    } elseif ($daysUntil <= $warningDays) {
                        $alerts[] = [
                            'alert_type' => 'Assurance',
                            'voiture_matricule' => $assurance->voiture ? $assurance->voiture->matricule : 'Unknown',
                            'voiture_modele' => $assurance->voiture ? $assurance->voiture->modele : 'Unknown',
                            'expiration_date' => $assurance->date_expiration,
                            'days_remaining' => $daysUntil,
                            'urgency' => 'Warning',
                            'message' => "Assurance expire le " . $expirationDate->format('d/m/Y'),
                            'reference_id' => 'assurance_' . $assurance->id,
                        ];
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::error('Error processing assurances: ' . $e->getMessage());
        }

        // Check Taxes Circulation
        try {
            $taxes = TaxeCirculation::with('voiture')->get();
            foreach ($taxes as $taxe) {
                // Skip alerts if status is 'payé'
                if ($taxe->status === 'payé') {
                    continue;
                }
                
                if ($taxe->date_expiration) {
                    $expirationDate = Carbon::parse($taxe->date_expiration);
                    $daysUntil = $today->diffInDays($expirationDate, false);
                    
                    // Show expired items as urgent
                    if ($daysUntil < 0) {
                        $alerts[] = [
                            'alert_type' => 'Taxe circulation',
                            'voiture_matricule' => $taxe->voiture ? $taxe->voiture->matricule : 'Unknown',
                            'voiture_modele' => $taxe->voiture ? $taxe->voiture->modele : 'Unknown',
                            'expiration_date' => $taxe->date_expiration,
                            'days_remaining' => $daysUntil,
                            'urgency' => 'Urgent',
                            'message' => "Taxe circulation a expiré le " . $expirationDate->format('d/m/Y'),
                            'reference_id' => 'taxe_' . $taxe->id,
                        ];
                    } elseif ($daysUntil <= $urgentDays) {
                        $alerts[] = [
                            'alert_type' => 'Taxe circulation',
                            'voiture_matricule' => $taxe->voiture ? $taxe->voiture->matricule : 'Unknown',
                            'voiture_modele' => $taxe->voiture ? $taxe->voiture->modele : 'Unknown',
                            'expiration_date' => $taxe->date_expiration,
                            'days_remaining' => $daysUntil,
                            'urgency' => 'Urgent',
                            'message' => "Taxe circulation expire le " . $expirationDate->format('d/m/Y'),
                            'reference_id' => 'taxe_' . $taxe->id,
                        ];
                    } elseif ($daysUntil <= $warningDays) {
                        $alerts[] = [
                            'alert_type' => 'Taxe circulation',
                            'voiture_matricule' => $taxe->voiture ? $taxe->voiture->matricule : 'Unknown',
                            'voiture_modele' => $taxe->voiture ? $taxe->voiture->modele : 'Unknown',
                            'expiration_date' => $taxe->date_expiration,
                            'days_remaining' => $daysUntil,
                            'urgency' => 'Warning',
                            'message' => "Taxe circulation expire le " . $expirationDate->format('d/m/Y'),
                            'reference_id' => 'taxe_' . $taxe->id,
                        ];
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::error('Error processing taxes: ' . $e->getMessage());
        }

        // Check Visites Techniques
        try {
            $visites = Visite::with('voiture')->get();
            foreach ($visites as $visite) {
                if ($visite->prochaine_visite) {
                    $expirationDate = Carbon::parse($visite->prochaine_visite);
                    $daysUntil = $today->diffInDays($expirationDate, false);
                    
                    // Show expired items as urgent
                    if ($daysUntil < 0) {
                        $alerts[] = [
                            'alert_type' => 'Visite technique',
                            'voiture_matricule' => $visite->voiture ? $visite->voiture->matricule : 'Unknown',
                            'voiture_modele' => $visite->voiture ? $visite->voiture->modele : 'Unknown',
                            'expiration_date' => $visite->prochaine_visite,
                            'days_remaining' => $daysUntil,
                            'urgency' => 'Urgent',
                            'message' => "Visite technique était prévue le " . $expirationDate->format('d/m/Y'),
                            'reference_id' => 'visite_' . $visite->id,
                        ];
                    } elseif ($daysUntil <= $urgentDays) {
                        $alerts[] = [
                            'alert_type' => 'Visite technique',
                            'voiture_matricule' => $visite->voiture ? $visite->voiture->matricule : 'Unknown',
                            'voiture_modele' => $visite->voiture ? $visite->voiture->modele : 'Unknown',
                            'expiration_date' => $visite->prochaine_visite,
                            'days_remaining' => $daysUntil,
                            'urgency' => 'Urgent',
                            'message' => "Visite technique le " . $expirationDate->format('d/m/Y'),
                            'reference_id' => 'visite_' . $visite->id,
                        ];
                    } elseif ($daysUntil <= $warningDays) {
                        $alerts[] = [
                            'alert_type' => 'Visite technique',
                            'voiture_matricule' => $visite->voiture ? $visite->voiture->matricule : 'Unknown',
                            'voiture_modele' => $visite->voiture ? $visite->voiture->modele : 'Unknown',
                            'expiration_date' => $visite->prochaine_visite,
                            'days_remaining' => $daysUntil,
                            'urgency' => 'Warning',
                            'message' => "Visite technique le " . $expirationDate->format('d/m/Y'),
                            'reference_id' => 'visite_' . $visite->id,
                        ];
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::error('Error processing visites: ' . $e->getMessage());
        }

        // Sort alerts by urgency and days remaining
        usort($alerts, function($a, $b) {
            if ($a['urgency'] === 'Urgent' && $b['urgency'] !== 'Urgent') return -1;
            if ($a['urgency'] !== 'Urgent' && $b['urgency'] === 'Urgent') return 1;
            return $a['days_remaining'] - $b['days_remaining'];
        });

        return response()->json($alerts);
    }

    public function store(Request $request)
    {
        // Not needed for this use case
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function show($id)
    {
        // Not needed for this use case
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function update(Request $request, $id)
    {
        // Not needed for this use case
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function destroy($id)
    {
        // Not needed for this use case
        return response()->json(['message' => 'Not implemented'], 501);
    }
}

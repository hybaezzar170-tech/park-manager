<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerte;
use App\Models\Assurance;
use App\Models\TaxeCirculation;
use App\Models\Visite;
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
            return response()->json([
                'error' => $e->getMessage()
            ], 422);
        }
    }

    public function getExpirationAlerts()
    {
        $alerts = [];

        // Comparer les dates sans tenir compte de l'heure
        $today = Carbon::today();

        $warningDays = 3;
        $urgentDays = 1;

        // Assurances des véhicules non vendus
        $assurances = Assurance::with('voiture')
            ->whereHas('voiture', function ($query) {
                $query->where('etat', '!=', 'vendue');
            })
            ->get();

        foreach ($assurances as $assurance) {
            if (!$assurance->date_expiration || !$assurance->voiture) {
                continue;
            }

            $expirationDate = Carbon::parse($assurance->date_expiration)->startOfDay();
            $daysUntil = (int) $today->diffInDays($expirationDate, false);

            if ($daysUntil <= $warningDays) {
                $alerts[] = [
                    'id' => 'assurance_' . $assurance->id,
                    'type' => $daysUntil <= $urgentDays ? 'Urgent' : 'Warning',
                    'message' => 'Assurance expire le ' . $expirationDate->format('d/m/Y'),
                    'voiture' => $assurance->voiture->matricule . ' - ' . $assurance->voiture->modele,
                    'date_expiration' => $assurance->date_expiration,
                    'days_remaining' => $daysUntil,
                    'category' => 'Assurance'
                ];
            }
        }

        // Taxes des véhicules non vendus
        $taxes = TaxeCirculation::with('voiture')
            ->whereHas('voiture', function ($query) {
                $query->where('etat', '!=', 'vendue');
            })
            ->get();

        foreach ($taxes as $taxe) {
            if (!$taxe->date_expiration || !$taxe->voiture) {
                continue;
            }

            $expirationDate = Carbon::parse($taxe->date_expiration)->startOfDay();
            $daysUntil = (int) $today->diffInDays($expirationDate, false);

            if ($daysUntil <= $warningDays) {
                $alerts[] = [
                    'id' => 'taxe_' . $taxe->id,
                    'type' => $daysUntil <= $urgentDays ? 'Urgent' : 'Warning',
                    'message' => 'Taxe circulation expire le ' . $expirationDate->format('d/m/Y'),
                    'voiture' => $taxe->voiture->matricule . ' - ' . $taxe->voiture->modele,
                    'date_expiration' => $taxe->date_expiration,
                    'days_remaining' => $daysUntil,
                    'category' => 'Taxe circulation'
                ];
            }
        }

        // Visites techniques des véhicules non vendus
        $visites = Visite::with('voiture')
            ->whereHas('voiture', function ($query) {
                $query->where('etat', '!=', 'vendue');
            })
            ->get();

        foreach ($visites as $visite) {
            if (!$visite->prochaine_visite || !$visite->voiture) {
                continue;
            }

            $expirationDate = Carbon::parse($visite->prochaine_visite)->startOfDay();
            $daysUntil = (int) $today->diffInDays($expirationDate, false);

            if ($daysUntil <= $warningDays) {
                $alerts[] = [
                    'id' => 'visite_' . $visite->id,
                    'type' => $daysUntil <= $urgentDays ? 'Urgent' : 'Warning',
                    'message' => 'Visite technique le ' . $expirationDate->format('d/m/Y'),
                    'voiture' => $visite->voiture->matricule . ' - ' . $visite->voiture->modele,
                    'date_expiration' => $visite->prochaine_visite,
                    'days_remaining' => $daysUntil,
                    'category' => 'Visite technique'
                ];
            }
        }

        // Trier les alertes : urgentes en premier
        usort($alerts, function ($a, $b) {
            if ($a['type'] === 'Urgent' && $b['type'] !== 'Urgent') {
                return -1;
            }

            if ($a['type'] !== 'Urgent' && $b['type'] === 'Urgent') {
                return 1;
            }

            return $a['days_remaining'] <=> $b['days_remaining'];
        });

        return response()->json($alerts);
    }
}

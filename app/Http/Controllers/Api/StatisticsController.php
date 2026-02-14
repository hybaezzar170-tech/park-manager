<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Voiture;
use App\Models\Conducteur;
use App\Models\Departement;
use App\Models\Fournisseur;
use App\Models\Piece;
use App\Models\Alerte;
use App\Models\Assurance;
use App\Models\Visite;
use App\Models\TaxeCirculation;
use App\Models\Maintenance;
use App\Models\Ouvrier;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    public function index()
    {
        try {
            // Statistics sécurisées avec try-catch pour chaque modèle
            $staticAlertsCount = 0;
            $expirationAlertsCount = 0;
            $activeMaintenancesCount = 0;
            $totalMaintenancesCount = 0;
            $piecesCount = 0;
            $reparationsCount = 0;
            $voituresCount = 0;
            $conducteursCount = 0;
            $departementsCount = 0;
            $fournisseursCount = 0;
            $ouvriersCount = 0;

            // Comptages sécurisés
            try {
                $staticAlertsCount = Alerte::count();
            } catch (\Exception $e) {
                // Table alertes n'existe pas
            }

            // Count expiration alerts
            $expirationAlertsCount = 0;
            try {
                $expirationAlertsCount = ExpirationAlertController::count();
            } catch (\Exception $e) {
                // Table expiration-alerts n'existe pas
            }

            // Count voitures
            $voituresCount = 0;
            try {
                $voituresCount = Voiture::count();
            } catch (\Exception $e) {
                // Table voitures n'existe pas
            }

            // Count conducteurs
            $conducteursCount = 0;
            try {
                $conducteursCount = Conducteur::count();
            } catch (\Exception $e) {
                // Table conducteurs n'existe pas
            }

            try {
                $departementsCount = Departement::count();
            } catch (\Exception $e) {
                // Table departements n'existe pas
            }

            try {
                $fournisseursCount = Fournisseur::count();
            } catch (\Exception $e) {
                // Table fournisseurs n'existe pas
            }

            try {
                $piecesCount = Piece::count();
            } catch (\Exception $e) {
                // Table pieces n'existe pas
            }

            try {
                $reparationsCount = \App\Models\Reparation::count();
            } catch (\Exception $e) {
                // Table reparations n'existe pas
            }

            try {
                $ouvriersCount = Ouvrier::count();
            } catch (\Exception $e) {
                // Table ouvriers n'existe pas
            }

            try {
                $activeMaintenancesCount = Maintenance::where('statut', 'en_cours')->count();
                $totalMaintenancesCount = Maintenance::count();
            } catch (\Exception $e) {
                // Table maintenances n'existe pas
            }

            // Count maintenance statistics
            $activeMaintenancesCount = Maintenance::where('statut', 'en_cours')->count();
            $totalMaintenancesCount = Maintenance::count();
            
            // Debug logging
            \Log::info('Maintenance stats - Active: ' . $activeMaintenancesCount . ', Total: ' . $totalMaintenancesCount);

            $statistics = [
                'users_count' => $voituresCount, 
                'voitures_count' => $voituresCount,
                'voitures_disponibles_count' => $voituresCount,
                'voitures_en_location_count' => 0,
                'voitures_vendues_count' => 0,
                'voitures_en_maintenance_count' => 0,
                'conducteurs_count' => $conducteursCount,
                'departements_count' => $departementsCount,
                'fournisseurs_count' => $fournisseursCount,
                'pieces_count' => $piecesCount,
                'alertes_count' => $staticAlertsCount + $expirationAlertsCount,
                'active_maintenances_count' => $activeMaintenancesCount,
                'total_maintenances_count' => $totalMaintenancesCount,
                'reparations_count' => $reparationsCount,
                'reparations_en_cours_count' => 0,
                'reparations_terminees_count' => 0,
                'techniciens_count' => 0,
                'mecaniciens_count' => $ouvriersCount,
                'ouvriers_count' => $ouvriersCount,
                'assurances_count' => 0,
                'visites_count' => 0,
                'taxes_circulation_count' => 0,
                'locations_count' => 0,
                'ventes_count' => 0
            ];

            return response()->json($statistics);
        } catch (\Exception $e) {
            \Log::error('Error fetching statistics: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch statistics'], 500);
        }
    }
}

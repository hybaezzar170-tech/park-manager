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
            // Comptages simples avec gestion d'erreurs
            $staticAlertsCount = 0;
            $expirationAlertsCount = 0;
            $activeMaintenancesCount = 0;
            $totalMaintenancesCount = 0;
            $piecesCount = 0;
            $reparationsCount = 0;
            $voituresCount = 0;
            $voituresDisponiblesCount = 0;
            $voituresEnLocationCount = 0;
            $voituresVenduesCount = 0;
            $voituresEnMaintenanceCount = 0;
            $locationsCount = 0;
            $ventesCount = 0;
            
            try {
                $staticAlertsCount = Alerte::count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $activeMaintenancesCount = Maintenance::where('statut', 'en_cours')->count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $totalMaintenancesCount = Maintenance::count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $piecesCount = Piece::count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $reparationsCount = \App\Models\Reparation::count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $voituresCount = Voiture::count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $voituresDisponiblesCount = Voiture::where('etat', 'disponible')->count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $voituresEnLocationCount = Voiture::where('etat', 'en_location')->count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $voituresVenduesCount = Voiture::where('etat', 'vendue')->count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $voituresEnMaintenanceCount = Voiture::where('etat', 'en_maintenance')->count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $locationsCount = \App\Models\Location::count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            
            try {
                $ventesCount = \App\Models\Vente::count();
            } catch (\Exception $e) {
                // Ignorer les erreurs
            }
            try {
                $voituresCount = Voiture::count();
            } catch (\Exception $e) {
                $voituresCount = 0;
            }
            
            try {
                $conducteursCount = Conducteur::count();
            } catch (\Exception $e) {
                $conducteursCount = 0;
            }
            
            try {
                $departementsCount = Departement::count();
            } catch (\Exception $e) {
                $departementsCount = 0;
            }
            
            try {
                $fournisseursCount = Fournisseur::count();
            } catch (\Exception $e) {
                $fournisseursCount = 0;
            }
            
            try {
                $ouvriersCount = Ouvrier::count();
            } catch (\Exception $e) {
                $ouvriersCount = 0;
            }

            $statistics = [
                'alertes_count' => $staticAlertsCount,
                'active_maintenances_count' => $activeMaintenancesCount,
                'total_maintenances_count' => $totalMaintenancesCount,
                'pieces_count' => $piecesCount,
                'reparations_count' => $reparationsCount, 
                'voitures_count' => $voituresCount,
                'voitures_disponibles_count' => $voituresDisponiblesCount,
                'voitures_en_location_count' => $voituresEnLocationCount,
                'voitures_vendues_count' => $voituresVenduesCount,
                'voitures_en_maintenance_count' => $voituresEnMaintenanceCount,
                'conducteurs_count' => $conducteursCount,
                'departements_count' => $departementsCount,
                'fournisseurs_count' => $fournisseursCount,
                'pieces_count' => $piecesCount,
                'alertes_count' => $staticAlertsCount + $expirationAlertsCount,
                'users_count' => $voituresCount, 
                'conducteurs_count' => $conducteursCount,
                'departements_count' => $departementsCount,
                'fournisseurs_count' => $fournisseursCount,
                'ouvriers_count' => $ouvriersCount,
                'assurances_count' => 0,
                'visites_count' => 0,
                'taxes_circulation_count' => 0,
                'locations_count' => $locationsCount,
                'ventes_count' => $ventesCount
            ];

            return response()->json($statistics);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch statistics'], 500);
        }
    }
}

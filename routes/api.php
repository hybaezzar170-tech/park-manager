
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VoitureController;
use App\Http\Controllers\Api\DepartementController;
use App\Http\Controllers\Api\ConducteurController;
use App\Http\Controllers\Api\FournisseurController;
use App\Http\Controllers\Api\PieceController;
use App\Http\Controllers\Api\AlerteController;
use App\Http\Controllers\Api\ExpirationAlertController;
use App\Http\Controllers\Api\VisiteController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\ReparationController;
use App\Http\Controllers\Api\OuvrierController;
use App\Http\Controllers\Api\VenteController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\TaxeController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\AssuranceController;
use App\Http\Controllers\Api\ReclamationController;
use App\Http\Controllers\Api\TaxeCirculationController;

// Routes publiques : authentification uniquement
Route::post('login', [UserController::class, 'login']);
Route::post('conducteurs/login', [ConducteurController::class, 'login']);

// Toutes les autres routes nécessitent un token Sanctum valide
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Utilisateurs
    Route::apiResource('users', UserController::class);

    // Voitures
    Route::apiResource('voitures', VoitureController::class);
    Route::get('voitures/{id}/details', [VoitureController::class, 'details']);
    Route::get('voitures/{voitureId}/maintenances', [MaintenanceController::class, 'getMaintenanceHistory']);

    // Départements
    Route::get('departements/all', [DepartementController::class, 'allDepartements']);
    Route::put('departements/{id}/toggle-etat', [DepartementController::class, 'toggleEtat']);
    Route::apiResource('departements', DepartementController::class);

    // Conducteurs
    Route::put('conducteurs/{id}/toggle-etat', [ConducteurController::class, 'toggleEtat']);
    Route::apiResource('conducteurs', ConducteurController::class);

    // Fournisseurs
    Route::apiResource('fournisseurs', FournisseurController::class);
    Route::get('fournisseurs/pieces-suppliers', [FournisseurController::class, 'piecesSuppliers']);

    // Pièces
    Route::apiResource('pieces', PieceController::class);
    Route::get('pieces/with-auto-suppliers', [PieceController::class, 'piecesWithAutoSuppliers']);

    // Alertes et visites
    Route::apiResource('alertes', AlerteController::class);
    Route::apiResource('visites', VisiteController::class);
    Route::apiResource('expiration-alerts', ExpirationAlertController::class);

    // Ventes et locations
    Route::apiResource('ventes', VenteController::class);
    Route::apiResource('locations', LocationController::class);
    Route::post('locations/bulk', [LocationController::class, 'bulkStore']);

    // Taxes et assurances
    Route::apiResource('taxes', TaxeController::class);
    Route::apiResource('assurances', AssuranceController::class);
    Route::apiResource('taxes-circulation', TaxeCirculationController::class);

    // Réparations et ouvriers
    Route::apiResource('reparations', ReparationController::class);
    Route::apiResource('ouvriers', OuvrierController::class);
    Route::get('ouvriers/actifs', [OuvrierController::class, 'actifs']);
    Route::get('ouvriers/type/{type}', [OuvrierController::class, 'byType']);
    Route::get('ouvriers/statistics', [OuvrierController::class, 'statistics']);

    // Maintenances
    Route::apiResource('maintenances', MaintenanceController::class);
    Route::get('maintenances/active', [MaintenanceController::class, 'getActiveMaintenances']);
    Route::post('maintenances/check-expired', [MaintenanceController::class, 'checkExpiredServices']);

    // Clients
    Route::get('clients/search', [ClientController::class, 'search']);
    Route::apiResource('clients', ClientController::class);

    // Statistiques
    Route::get('statistics', [StatisticsController::class, 'index']);

    // Réclamations
    Route::get('reclamations/user', [ReclamationController::class, 'getUserReclamations']);
    Route::get('reclamations/statistics', [ReclamationController::class, 'getStatistics']);
    Route::apiResource('reclamations', ReclamationController::class);
});

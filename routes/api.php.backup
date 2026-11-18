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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Login
Route::post('login', [UserController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {

    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Resources
    // Route::apiResource('users', UserController::class); // Déplacé vers les routes publiques
});

// Public routes (no authentication required)
Route::apiResource('users', UserController::class);
Route::apiResource('voitures', VoitureController::class);
Route::get('voitures/{id}/details', [VoitureController::class, 'details']);
Route::get('departements/all', [DepartementController::class, 'allDepartements']);
Route::put('departements/{id}/toggle-etat', [DepartementController::class, 'toggleEtat']);
Route::apiResource('departements', DepartementController::class);
Route::put('conducteurs/{id}/toggle-etat', [ConducteurController::class, 'toggleEtat']);
Route::post('conducteurs/login', [ConducteurController::class, 'login']);
Route::apiResource('conducteurs', ConducteurController::class);
Route::apiResource('fournisseurs', FournisseurController::class);
Route::apiResource('pieces', PieceController::class);
Route::apiResource('alertes', AlerteController::class);
Route::apiResource('visites', VisiteController::class);
Route::apiResource('expiration-alerts', ExpirationAlertController::class);
Route::apiResource('ventes', VenteController::class);
Route::apiResource('locations', LocationController::class);
Route::post('locations/bulk', [LocationController::class, 'bulkStore']);
Route::apiResource('taxes', TaxeController::class);
Route::apiResource('assurances', AssuranceController::class);
Route::apiResource('taxes-circulation', TaxeCirculationController::class);
Route::apiResource('reparations', ReparationController::class);
Route::apiResource('ouvriers', OuvrierController::class);
Route::apiResource('maintenances', MaintenanceController::class);

// Routes pour la gestion des clients
Route::apiResource('clients', ClientController::class);
Route::get('clients/search', [ClientController::class, 'search']);

    // Extra routes
    Route::get('fournisseurs/pieces-suppliers', [FournisseurController::class, 'piecesSuppliers']);
    Route::get('pieces/with-auto-suppliers', [PieceController::class, 'piecesWithAutoSuppliers']);
    Route::get('statistics', [StatisticsController::class, 'index']);
    Route::get('ouvriers/actifs', [OuvrierController::class, 'actifs']);
    Route::get('ouvriers/type/{type}', [OuvrierController::class, 'byType']);
    Route::get('ouvriers/statistics', [OuvrierController::class, 'statistics']);
   Route::get('maintenances/active', [MaintenanceController::class, 'getActiveMaintenances']);
Route::put('maintenances/{maintenance}', [MaintenanceController::class, 'update']);
Route::post('maintenances', [MaintenanceController::class, 'store']);
    Route::get('voitures/{voitureId}/maintenances', [MaintenanceController::class, 'getMaintenanceHistory']);
    Route::post('maintenances/check-expired', [MaintenanceController::class, 'checkExpiredServices']);
    Route::get('reclamations/user', [ReclamationController::class, 'getUserReclamations']);
    Route::get('reclamations/statistics', [ReclamationController::class, 'getStatistics']);
Route::apiResource('reclamations', ReclamationController::class);
Route::put('reclamations/{reclamation}', [ReclamationController::class, 'update']);

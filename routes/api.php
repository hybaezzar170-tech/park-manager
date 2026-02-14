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
    Route::apiResource('departements', DepartementController::class);
    Route::apiResource('conducteurs', ConducteurController::class);
    Route::apiResource('fournisseurs', FournisseurController::class);
    Route::apiResource('pieces', PieceController::class);
    Route::apiResource('alertes', AlerteController::class);
    Route::apiResource('visites', VisiteController::class);
    Route::apiResource('expiration-alerts', ExpirationAlertController::class);
    Route::apiResource('ventes', VenteController::class);
    Route::apiResource('locations', LocationController::class);
    Route::apiResource('taxes', TaxeController::class);
    Route::apiResource('assurances', AssuranceController::class);
    Route::apiResource('taxes-circulation', TaxeCirculationController::class);
    Route::apiResource('maintenances', MaintenanceController::class);
    Route::apiResource('reparations', ReparationController::class);
    Route::apiResource('ouvriers', OuvrierController::class);

    // Extra routes
    Route::get('fournisseurs/pieces-suppliers', [FournisseurController::class, 'piecesSuppliers']);
    Route::get('pieces/with-auto-suppliers', [PieceController::class, 'piecesWithAutoSuppliers']);

    Route::get('statistics', [StatisticsController::class, 'index']);

    Route::get('ouvriers/actifs', [OuvrierController::class, 'actifs']);
    Route::get('ouvriers/type/{type}', [OuvrierController::class, 'byType']);
    Route::get('ouvriers/statistics', [OuvrierController::class, 'statistics']);

    Route::get('maintenances/active', [MaintenanceController::class, 'getActiveMaintenances']);
    Route::get('maintenances/stats', [MaintenanceController::class, 'getMaintenanceStats']);
    Route::get('voitures/{voitureId}/maintenances', [MaintenanceController::class, 'getMaintenanceHistory']);
    Route::post('maintenances/check-expired', [MaintenanceController::class, 'checkExpiredServices']);

    Route::get('reclamations/user', [ReclamationController::class, 'getUserReclamations']);
    Route::get('reclamations/statistics', [ReclamationController::class, 'getStatistics']);

// Public routes (no authentication required)
Route::apiResource('reclamations', ReclamationController::class);
Route::put('reclamations/{reclamation}', [ReclamationController::class, 'update']);
Route::get('statistics', [StatisticsController::class, 'index']);

Route::get('ouvriers/actifs', [OuvrierController::class, 'actifs']);
Route::get('ouvriers/type/{type}', [OuvrierController::class, 'byType']);
Route::get('ouvriers/statistics', [OuvrierController::class, 'statistics']);

Route::get('maintenances/active', [MaintenanceController::class, 'getActiveMaintenances']);
Route::get('maintenances/stats', [MaintenanceController::class, 'getMaintenanceStats']);
Route::get('voitures/{voitureId}/maintenances', [MaintenanceController::class, 'getMaintenanceHistory']);
Route::post('maintenances/check-expired', [MaintenanceController::class, 'checkExpiredServices']);

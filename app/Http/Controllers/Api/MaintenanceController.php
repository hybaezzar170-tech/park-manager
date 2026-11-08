<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use App\Models\Voiture;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MaintenanceController extends Controller
{
    public function index()
    {
        try {
            $maintenances = Maintenance::with('voiture')
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json($maintenances);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch maintenances'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Log des données reçues
            \Log::info('Maintenance store request:', $request->all());
            
            // Récupérer les données essentielles
            $data = [
                'voiture_id' => $request->input('voiture_id'),
                'type_maintenance' => $request->input('type_maintenance'),
                'description' => $request->input('description'),
                'cout' => $request->input('cout'),
                'date_debut' => $request->input('date_debut'),
                'date_fin_prevue' => $request->input('date_fin_prevue'),
                'technicien' => $request->input('technicien'),
                'notes' => $request->input('notes'),
                'statut' => 'en_cours'
            ];
            
            \Log::info('Processed maintenance data:', $data);
            
            // Update voiture status to en_maintenance
            $voiture = Voiture::find($data['voiture_id']);
            if ($voiture) {
                $voiture->etat = 'en_maintenance';
                $voiture->save();
                \Log::info('Voiture status updated to en_maintenance');
            } else {
                \Log::error('Voiture not found with ID: ' . $data['voiture_id']);
            }

            // Create maintenance
            $maintenance = Maintenance::create($data);
            \Log::info('Maintenance created with ID: ' . $maintenance->id);
            
            return response()->json([
                'success' => true,
                'data' => $maintenance,
                'message' => 'Maintenance created successfully'
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Error creating maintenance: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create maintenance: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $maintenance = Maintenance::with('voiture')->findOrFail($id);
            return response()->json($maintenance);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Maintenance not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $maintenance = Maintenance::findOrFail($id);
            
            $request->validate([
                'description' => 'nullable|string',
                'cout' => 'nullable|numeric|min:0',
                'date_fin_prevue' => 'nullable|date|after_or_equal:date_debut',
                'date_fin_reelle' => 'nullable|date',
                'statut' => 'nullable|in:en_cours,terminee,annulee',
                'technicien' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
            ]);

            $maintenance->update($request->all());

            // Update voiture status if maintenance is completed
            if ($request->statut === 'terminee') {
                $voiture = $maintenance->voiture;
                $voiture->etat = 'disponible';
                $voiture->save();
                
                // Set end date if not provided
                if (!$request->date_fin_reelle) {
                    $maintenance->date_fin_reelle = now();
                    $maintenance->save();
                }
            }

            $maintenance->load('voiture');
            return response()->json($maintenance);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update maintenance'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $maintenance = Maintenance::findOrFail($id);
            
            // Update voiture status back to disponible
            $voiture = $maintenance->voiture;
            $voiture->etat = 'disponible';
            $voiture->save();
            
            $maintenance->delete();
            
            return response()->json(['message' => 'Maintenance deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete maintenance'], 500);
        }
    }

    public function getActiveMaintenances()
    {
        try {
            $maintenances = Maintenance::with(['voiture', 'ouvrier'])
                ->where('statut', 'en_cours')
                ->orderBy('date_debut', 'desc')
                ->get();
            
            // Debug log
            \Log::info('Active maintenances fetched:', ['count' => $maintenances->count()]);
            
            return response()->json([
                'success' => true,
                'data' => $maintenances,
                'count' => $maintenances->count()
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch active maintenances: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch active maintenances'], 500);
        }
    }

    public function getMaintenanceHistory($voitureId)
    {
        try {
            $maintenances = Maintenance::where('voiture_id', $voitureId)
                ->with('voiture')
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json($maintenances);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch maintenance history'], 500);
        }
    }

    public function getMaintenanceStats()
    {
        try {
            $stats = [
                'total_maintenances' => Maintenance::count(),
                'active_maintenances' => Maintenance::where('statut', 'en_cours')->count(),
                'completed_maintenances' => Maintenance::where('statut', 'terminee')->count(),
                'cancelled_maintenances' => Maintenance::where('statut', 'annulee')->count(),
                'overdue_maintenances' => Maintenance::where('statut', 'en_cours')
                    ->where('date_fin_prevue', '<', now())
                    ->count(),
                'total_cost' => Maintenance::sum('cout'),
                'average_cost' => Maintenance::avg('cout'),
                'cars_in_maintenance' => Maintenance::where('statut', 'en_cours')
                    ->distinct('voiture_id')
                    ->count(),
            ];
            
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch maintenance stats'], 500);
        }
    }

    public function checkExpiredServices()
    {
        try {
            $today = Carbon::now();
            $updatedCount = 0;

            // Check expired maintenances
            $expiredMaintenances = Maintenance::where('statut', 'en_cours')
                ->where('date_fin_prevue', '<', $today)
                ->get();

            foreach ($expiredMaintenances as $maintenance) {
                // Update maintenance status
                $maintenance->statut = 'terminee';
                $maintenance->date_fin_reelle = $today;
                $maintenance->save();

                // Update voiture status to disponible
                $voiture = $maintenance->voiture;
                if ($voiture) {
                    $voiture->etat = 'disponible';
                    $voiture->save();
                }

                $updatedCount++;
            }

            // Check expired locations
            $expiredLocations = Location::where('etat', 'en_cours')
                ->where('date_fin', '<', $today)
                ->get();

            foreach ($expiredLocations as $location) {
                // Update location status
                $location->etat = 'terminee';
                $location->save();

                // Update voiture status to disponible
                $voiture = $location->voiture;
                if ($voiture) {
                    $voiture->etat = 'disponible';
                    $voiture->save();
                }

                $updatedCount++;
            }

            return response()->json([
                'message' => 'Expired services checked successfully',
                'updated_count' => $updatedCount
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to check expired services'], 500);
        }
    }
}

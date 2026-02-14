<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Maintenance;
use App\Models\Voiture;
use App\Models\Location;
use Carbon\Carbon;

class CheckExpiredServices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-expired-services';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and update expired maintenances and locations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
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
            $this->info("Maintenance #{$maintenance->id} expired and voiture {$voiture->matricule} set to disponible");
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
            $this->info("Location #{$location->id} expired and voiture {$voiture->matricule} set to disponible");
        }

        $this->info("Checked expired services. Updated {$updatedCount} records.");
        return 0;
    }
}

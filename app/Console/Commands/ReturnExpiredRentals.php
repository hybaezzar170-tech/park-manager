<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Location;
use App\Models\Voiture;
use Carbon\Carbon;

class ReturnExpiredRentals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rentals:return-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Return cars that have passed their rental end date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find all active locations where date_fin has passed
        $expiredLocations = Location::where('etat', 'en_cours')
            ->where('date_fin', '<', Carbon::today())
            ->with('voiture')
            ->get();

        foreach ($expiredLocations as $location) {
            // Update location status
            $location->etat = 'terminee';
            $location->save();

            // Update car status back to disponible
            $location->voiture->etat = 'disponible';
            $location->voiture->save();

            $this->info("Location #{$location->id} marked as terminee, car #{$location->voiture->id} returned to disponible");
        }

        if ($expiredLocations->isEmpty()) {
            $this->info('No expired rentals found.');
        } else {
            $this->info("Total rentals processed: " . $expiredLocations->count());
        }
    }
}

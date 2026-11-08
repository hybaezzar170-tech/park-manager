<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Departement;
use App\Models\Conducteur;
use App\Models\Fournisseur;
use App\Models\Location;
use App\Models\Vente;
use App\Models\Maintenance;
use App\Models\Reparation;
use App\Models\Assurance;
use App\Models\Visite;
use App\Models\TaxeCirculation;

class Voiture extends Model
{
    use HasFactory;
    protected $fillable = [
        'matricule','modele','num_serie',
        'departement_id','conducteur_id','marque','couleur',
        'mise_en_circulation','carburant','etat',
        'prix_achat', 'date_achat', 'fournisseur_id'
    ];

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function conducteur()
    {
        return $this->belongsTo(Conducteur::class);
    }

    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    public function ventes()
    {
        return $this->hasMany(Vente::class);
    }

    public function maintenances()
    {
        return $this->hasMany(Maintenance::class);
    }

    public function reparations()
    {
        return $this->hasMany(Reparation::class);
    }

    public function assurance()
    {
        return $this->hasOne(Assurance::class);
    }

    public function visite()
    {
        return $this->hasOne(Visite::class);
    }

    public function taxecirculation()
    {
        return $this->hasOne(TaxeCirculation::class);
    }

    public function maintenanceEnCours()
    {
        return $this->hasOne(Maintenance::class)->where('statut', 'en_cours');
    }
}

  

   


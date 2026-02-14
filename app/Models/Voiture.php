<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Departement;
use App\Models\Conducteur;

class Voiture extends Model
{
    use HasFactory;
protected $fillable = [
    'matricule','modele','num_serie','type_departement',
    'departement_id','conducteur_id','marque','couleur',
    'mise_en_circulation','carburant','etat',
    'prix_achat', 'date_achat', 'fournisseur_id'
];

public function fournisseur() {
    return $this->belongsTo(Fournisseur::class);
}

    public function departement() {
        return $this->belongsTo(Departement::class);
    }

    public function conducteur() {
        return $this->belongsTo(Conducteur::class);
    }

    public function maintenances()
    {
        return $this->hasMany(Maintenance::class);
    }

    public function maintenanceEnCours()
    {
        return $this->hasOne(Maintenance::class)->where('statut', 'en_cours');
    }
}


  

   


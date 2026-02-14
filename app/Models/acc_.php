<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class acc_ extends Model
{
    use HasFactory;
     protected $fillable = [
        'fournisseur_id',
        'voiture_id',
        'reference',
        'nom',
        'categorie',
        'marque',
        'quantite',
        'seuil_alerte',
        'etat',
        'prix_achat',
        'prix_vente',
        'date_achat',
        'description'
    ];
    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }
    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }

}

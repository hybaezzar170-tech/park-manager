<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vente extends Model
{
    use HasFactory;

    protected $fillable = [
        'voiture_id',
        'acheteur',
        'prix_vente',
        'date_vente'
    ];

    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }
}

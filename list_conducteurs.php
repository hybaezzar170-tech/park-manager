<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';

echo "=== LISTE DES CONDUCTEURS ===\n";
echo "Format: ID | Nom Prénom | Email | Adresse | Ville | Téléphone | État\n";
echo str_repeat("=", 80) . "\n";

$conducteurs = App\Models\Conducteur::all();

foreach($conducteurs as $c) {
    printf(
        "%-3d | %-20s | %-25s | %-30s | %-15s | %-15s\n",
        $c->id,
        $c->nom . ' ' . $c->prenom,
        $c->email,
        $c->adresse . ', ' . $c->ville,
        $c->telephone,
        $c->etat
    );
}

echo "\nTotal: " . $conducteurs->count() . " conducteurs\n";

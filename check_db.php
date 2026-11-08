<?php

// Script pour créer la base de données et mettre à jour .env

echo "Création de la base de données alba_app...\n";

try {
    // Connexion à MySQL sans spécifier de base
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    
    // Créer la base de données alba_app
    $pdo->exec("CREATE DATABASE IF NOT EXISTS alba_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Base de données 'alba_app' créée avec succès!\n";
    
    // Vérifier que la base existe
    $stmt = $pdo->query("SHOW DATABASES LIKE 'alba_app'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Base de données 'alba_app' est bien présente!\n";
    } else {
        echo "❌ Erreur: La base de données n'a pas pu être créée!\n";
        exit(1);
    }
    
    echo "\nMise à jour du fichier .env...\n";
    
    // Lire le fichier .env
    $envFile = __DIR__ . '/.env';
    $envContent = file_get_contents($envFile);
    
    // Remplacer DB_DATABASE=laravel par DB_DATABASE=alba_app
    $envContent = str_replace('DB_DATABASE=laravel', 'DB_DATABASE=alba_app', $envContent);
    
    // Écrire le fichier .env mis à jour
    file_put_contents($envFile, $envContent);
    
    echo "✅ Fichier .env mis à jour avec DB_DATABASE=alba_app\n";
    echo "\n🎉 Configuration terminée! Vous pouvez maintenant:\n";
    echo "1. Relancer votre serveur Laravel: php artisan serve\n";
    echo "2. Tester la connexion à l'application\n";
    echo "3. Créer des utilisateurs avec envoi SMS\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    exit(1);
}
?>

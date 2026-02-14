<?php
require 'vendor/autoload.php';

$pdo = new PDO('mysql:host=127.0.0.1;dbname=alba_app', 'root', '');
$result = $pdo->query('DESC voitures');
$columns = $result->fetchAll(PDO::FETCH_ASSOC);

echo "Voitures table columns:\n";
print_r($columns);
?>

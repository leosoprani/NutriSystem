<?php
// Configurações para Locaweb
$host = 'nutrisystem.mysql.dbaas.com.br'; // Geralmente localhost na Locaweb
$db   = 'nutrisystem';
$user = 'nutrisystem'; // Você precisará criar estas credenciais no painel da Locaweb
$pass = 'Nutrisystebd@1';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // throw new \PDOException($e->getMessage(), (int)$e->getCode());
     die(json_encode(['error' => 'Connection failed: ' . $e->getMessage()]));
}

// Headers para CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
?>

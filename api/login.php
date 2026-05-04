<?php
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['error' => 'Dados de login incompletos']);
    exit;
}

$email = $data['email'];
$password = $data['password'];

// 1. Verificar se é Nutricionista (Tenants)
$stmt = $pdo->prepare("SELECT * FROM tenants WHERE email = ? AND password = ? AND status = 'Ativo'");
$stmt->execute([$email, $password]);
$tenant = $stmt->fetch();

if ($tenant) {
    echo json_encode([
        'success' => true,
        'type' => 'nutritionist',
        'user' => [
            'id' => $tenant['id'],
            'name' => $tenant['name'],
            'email' => $tenant['email'],
            'slug' => $tenant['slug'],
            'plan' => $tenant['plan']
        ]
    ]);
    exit;
}

// 2. Verificar se é Paciente
$stmt = $pdo->prepare("SELECT * FROM patients WHERE email = ? AND password = ?");
$stmt->execute([$email, $password]);
$patient = $stmt->fetch();

if ($patient) {
    if ($patient['status'] === 'Bloqueado') {
        echo json_encode(['error' => 'Seu acesso está bloqueado. Entre em contato com seu nutricionista.']);
    } else {
        echo json_encode([
            'success' => true,
            'type' => 'patient',
            'user' => $patient
        ]);
    }
    exit;
}

echo json_encode(['error' => 'E-mail ou senha incorretos']);
?>

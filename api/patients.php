<?php
include 'config.php';

// Habilitar erros para depuração (Remova em produção após fixar)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $tenant_id = $_GET['tenant_id'] ?? null;
    if ($tenant_id) {
        $stmt = $pdo->prepare("SELECT * FROM patients WHERE tenant_id = ? ORDER BY last_visit DESC");
        $stmt->execute([$tenant_id]);
    } else {
        $stmt = $pdo->query("SELECT * FROM patients ORDER BY last_visit DESC");
    }
    echo json_encode($stmt->fetchAll());
}

if ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['email'])) {
            throw new Exception("Dados inválidos recebidos");
        }

        $sql = "INSERT INTO patients (tenant_id, name, email, password, phone, birth_date, plan_type, status, last_visit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            $data['tenant_id'] ?? 1, 
            $data['name'] ?? 'Sem Nome', 
            $data['email'], 
            $data['password'] ?? '123456',
            $data['phone'] ?? null,
            $data['birthDate'] ?? null,
            $data['plan_type'] ?? 'Emagrecimento', 
            $data['status'] ?? 'Ativo'
        ]);

        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);

    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Código para erro de duplicidade (Unique constraint)
            echo json_encode(['success' => false, 'error' => 'Este e-mail já está cadastrado para outro paciente.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Erro no Banco: ' . $e->getMessage()]);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
?>

<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $patient_id = $_GET['patient_id'] ?? null;
    
    if (!$patient_id) {
        echo json_encode(['error' => 'Patient ID required']);
        exit;
    }

    try {
        // Busca o plano alimentar mais recente do paciente
        $stmt = $pdo->prepare("SELECT * FROM meal_plans WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([$patient_id]);
        $plan = $stmt->fetch();

        if ($plan) {
            echo json_encode(['success' => true, 'plan' => $plan]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Nenhum plano encontrado']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>

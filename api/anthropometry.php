<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $patient_id = $_GET['patient_id'] ?? null;
    if ($patient_id) {
        $stmt = $pdo->prepare("SELECT * FROM anthropometry WHERE patient_id = ? ORDER BY date DESC");
        $stmt->execute([$patient_id]);
        $data = $stmt->fetchAll();
        echo json_encode($data);
    } else {
        echo json_encode(['error' => 'Patient ID required']);
    }
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $sql = "INSERT INTO anthropometry (patient_id, date, weight, height, bmi, fat_mass_pct, lean_mass_pct, chest, waist, abdomen, hip, biceps, thigh, calf) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['patient_id'],
        $data['date'] ?? date('Y-m-d'),
        $data['weight'],
        $data['height'],
        $data['bmi'],
        $data['fat_mass_pct'],
        $data['lean_mass_pct'],
        $data['chest'] ?? null,
        $data['waist'] ?? null,
        $data['abdomen'] ?? null,
        $data['hip'] ?? null,
        $data['biceps'] ?? null,
        $data['thigh'] ?? null,
        $data['calf'] ?? null
    ]);
    
    echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
}
?>

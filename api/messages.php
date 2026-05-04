<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $patient_id = $_GET['patient_id'] ?? null;
    if ($patient_id) {
        $stmt = $pdo->prepare("SELECT sender, message as text, DATE_FORMAT(created_at, '%H:%i') as time FROM messages WHERE patient_id = ? ORDER BY created_at ASC");
        $stmt->execute([$patient_id]);
        echo json_encode($stmt->fetchAll());
    } else {
        echo json_encode(['error' => 'Patient ID missing']);
    }
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data && isset($data['patient_id'], $data['sender'], $data['text'])) {
        $stmt = $pdo->prepare("INSERT INTO messages (patient_id, sender, message) VALUES (?, ?, ?)");
        $stmt->execute([$data['patient_id'], $data['sender'], $data['text']]);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Invalid data']);
    }
}
?>

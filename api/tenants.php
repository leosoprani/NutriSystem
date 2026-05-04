<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM tenants ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            echo json_encode(['error' => 'No data provided']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO tenants (name, email, password, slug, plan, monthly_value) VALUES (?, ?, ?, ?, ?, ?)");
        try {
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['password'],
                $data['slug'],
                $data['plan'] ?? 'Básico',
                $data['monthly_value'] ?? 149.90
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'PATCH':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'])) {
            echo json_encode(['error' => 'ID missing']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE tenants SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo json_encode(['error' => 'ID missing']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM tenants WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>

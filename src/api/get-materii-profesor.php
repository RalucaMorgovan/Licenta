<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: *");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$userId = isset($data['user_id']) ? (int)$data['user_id'] : 0;

if ($userId <= 0) {
    echo json_encode([
        "status" => "error",
        "message" => "ID utilizator lipsă sau invalid"
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM profesori WHERE user_id = ? LIMIT 1");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if (!$row = $result->fetch_assoc()) {
    echo json_encode([
        "status" => "error",
        "message" => "Profesorul nu a fost găsit"
    ]);
    exit;
}

$profesorId = (int)$row['id'];

$stmt = $conn->prepare("
    SELECT 
        mc.id AS materie_clasa_id,
        m.nume AS materie,
        c.nume AS clasa
    FROM materii_clase mc
    JOIN materii m ON mc.materie_id = m.id
    JOIN clase c ON mc.clasa_id = c.id
    WHERE mc.profesor_id = ?
    ORDER BY c.nume, m.nume
");
$stmt->bind_param("i", $profesorId);
$stmt->execute();
$res = $stmt->get_result();

$materii = [];
while ($r = $res->fetch_assoc()) {
    $materii[] = $r;
}

echo json_encode([
    "status" => "success",
    "profesor_id" => $profesorId,
    "materii" => $materii
]);

$conn->close();

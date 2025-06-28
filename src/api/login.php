<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: *");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$parola = $data['parola'] ?? '';

if (!$email || !$parola) {
    echo json_encode(['status' => 'error', 'message' => 'Email sau parolă lipsă']);
    exit;
}

$query = "
SELECT u.id, u.rol, e.cod_feedback
FROM utilizatori u
LEFT JOIN elevi e ON e.id = u.id
WHERE u.email = ? AND u.parola = ?
LIMIT 1
";

$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $email, $parola);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        'status' => 'success',
        'id' => $row['id'],
        'rol' => $row['rol'],
        'cod_feedback' => $row['cod_feedback'] ?? null
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Date incorecte']);
}

$conn->close();
?>

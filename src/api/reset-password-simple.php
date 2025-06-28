<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
header("Content-Type: application/json");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$email  = $data['email']  ?? '';
$parola = $data['parola'] ?? '';

if (!$email || !$parola) {
    echo json_encode([
      "status"  => "error",
      "message" => "Email sau parolă lipsă"
    ]);
    exit;
}

$stmt = $conn->prepare("UPDATE utilizatori SET parola = ? WHERE email = ?");
$stmt->bind_param("ss", $parola, $email);

if ($stmt->execute()) {
    echo json_encode([
      "status"  => "success",
      "message" => "Parola a fost resetată cu succes."
    ]);
} else {
    echo json_encode([
      "status"  => "error",
      "message" => "Eroare la resetarea parolei: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();

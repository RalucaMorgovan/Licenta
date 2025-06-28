<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$profesor_id = $data['id'] ?? null;

if (!$profesor_id) {
  echo json_encode(["status" => "error", "message" => "ID profesor lipsă"]);
  exit;
}

$conn->query("DELETE FROM materii_clase WHERE profesor_id = $profesor_id");

$stmt = $conn->prepare("DELETE FROM profesori WHERE id = ?");
$stmt->bind_param("i", $profesor_id);
$success = $stmt->execute();

if ($success) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => "Eroare la ștergere"]);
}

$conn->close();

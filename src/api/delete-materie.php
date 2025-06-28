<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;

if (!$id) {
  echo json_encode(["status" => "error", "message" => "ID lipsă"]);
  exit;
}

$stmt = $conn->prepare("DELETE FROM materii_clase WHERE id = ?");
$stmt->bind_param("i", $id);
$success = $stmt->execute();

if ($success) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => "Eroare la ștergere"]);
}

$conn->close();

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$elev_id = $data['id'] ?? null;


if (!$elev_id) {
  echo json_encode(["status" => "error", "message" => "ID elev lipsă"]);
  exit;
}

$stmt = $conn->prepare("DELETE FROM elevi WHERE id = ?");
$stmt->bind_param("i", $elev_id);
$success = $stmt->execute();

if ($success) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => "Eroare la ștergere"]);
}

$conn->close();

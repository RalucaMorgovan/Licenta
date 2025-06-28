<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$clasa_id = $data['clasa_id'] ?? null;
$profesor_id = $data['profesor_id'] ?? null;

if (!$id || !$clasa_id || !$profesor_id) {
  echo json_encode(["status" => "error", "message" => "Date lipsă"]);
  exit;
}

$stmt = $conn->prepare("UPDATE materii_clase SET clasa_id = ?, profesor_id = ? WHERE id = ?");
$stmt->bind_param("iii", $clasa_id, $profesor_id, $id);

if ($stmt->execute()) {
  echo json_encode(["status" => "success", "message" => "Actualizat cu succes!"]);
} else {
  echo json_encode(["status" => "error", "message" => "Eroare la actualizare"]);
}

$conn->close();
?>

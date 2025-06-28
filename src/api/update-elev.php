<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$elev_id   = $data['id'] ?? null;
$nume      = $data['nume'] ?? null;
$prenume   = $data['prenume'] ?? null;
$email     = $data['email'] ?? null;
$parola    = $data['parola'] ?? null;
$clasa_id  = $data['clasa_id'] ?? null;

if (!$elev_id) {
  echo json_encode(["status" => "error", "message" => "ID elev lipsă"]);
  exit;
}

$stmt = $conn->prepare("UPDATE elevi SET nume = ?, prenume = ?, email = ?, parola = ?, clasa_id = ? WHERE id = ?");
$stmt->bind_param("ssssii", $nume, $prenume, $email, $parola, $clasa_id, $elev_id);
$success = $stmt->execute();

if ($success) {
  echo json_encode(["status" => "success", "message" => "Elev actualizat"]);
} else {
  echo json_encode(["status" => "error", "message" => "Eroare la actualizare"]);
}

$conn->close();

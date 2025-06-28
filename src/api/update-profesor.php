<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");
require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$id         = $data['id'] ?? null;
$nume       = $data['nume'] ?? null;
$email      = $data['email'] ?? null;
$materie_id = $data['materie_id'] ?? null;
$clasa_id   = $data['clasa_id'] ?? null;

if (!$id || !$nume || !$email || !$materie_id || !$clasa_id) {
  echo json_encode(["status" => "error", "message" => "Date lipsă"]);
  exit;
}

$stmt = $conn->prepare("UPDATE profesori SET nume = ?, email = ? WHERE id = ?");
$stmt->bind_param("ssi", $nume, $email, $id);
$ok1 = $stmt->execute();
$stmt->close();

$stmt2 = $conn->prepare("UPDATE materii_clase SET materie_id = ?, clasa_id = ? WHERE profesor_id = ?");
$stmt2->bind_param("iii", $materie_id, $clasa_id, $id);
$ok2 = $stmt2->execute();
$stmt2->close();

if ($ok1 && $ok2) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => "Eroare la actualizare."]);
}

$conn->close();

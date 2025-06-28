<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$nume       = $data['nume'] ?? null;
$clasa_id   = $data['clasa_id'] ?? null;
$materie_id = $data['materie_id'] ?? null;

if (!$nume || !$clasa_id || !$materie_id) {
  echo json_encode(["status" => "error", "message" => "Date lipsă"]);
  exit;
}

$email = strtolower(str_replace(' ', '', $nume)) . '@prof.teodornes.ro';

$parola = substr(str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"), 0, 8);

$stmt = $conn->prepare("INSERT INTO profesori (nume, email, parola) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $nume, $email, $parola);
$success = $stmt->execute();

if (!$success) {
  echo json_encode(["status" => "error", "message" => "Eroare la inserare profesor"]);
  $stmt->close();
  $conn->close();
  exit;
}

$profesor_id = $conn->insert_id;

$stmt2 = $conn->prepare("INSERT INTO materii_clase (materie_id, clasa_id, profesor_id) VALUES (?, ?, ?)");
$stmt2->bind_param("iii", $materie_id, $clasa_id, $profesor_id);
$stmt2->execute();

echo json_encode([
  "status" => "success",
  "email" => $email,
  "parola" => $parola
]);

$conn->close();

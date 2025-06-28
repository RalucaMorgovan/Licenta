<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);

$nume = $data['nume'] ?? null;
$clasa_id = $data['clasa_id'] ?? null;
$profesor_id = $data['profesor_id'] ?? null;

if (!$nume || !$clasa_id || !$profesor_id) {
  echo json_encode(["status" => "error", "message" => "Date lipsă"]);
  exit;
}

$stmt = $conn->prepare("INSERT INTO materii (nume) VALUES (?)");
$stmt->bind_param("s", $nume);
$ok = $stmt->execute();

if ($ok) {
  $materie_id = $conn->insert_id;

  $stmt2 = $conn->prepare("INSERT INTO materii_clase (materie_id, clasa_id, profesor_id) VALUES (?, ?, ?)");
  $stmt2->bind_param("iii", $materie_id, $clasa_id, $profesor_id);
  $ok2 = $stmt2->execute();

  if ($ok2) {
    echo json_encode(["status" => "success"]);
  } else {
    echo json_encode(["status" => "error", "message" => "Eroare la inserare în materii_clase"]);
  }
} else {
  echo json_encode(["status" => "error", "message" => "Eroare la inserare în materii"]);
}

$conn->close();

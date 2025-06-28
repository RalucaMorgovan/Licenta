<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");


require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$nume     = $data['nume'] ?? '';
$prenume  = $data['prenume'] ?? '';
$clasa_id = $data['clasa_id'] ?? null;


if (!$nume || !$prenume || !$clasa_id) {
  echo json_encode(["status" => "error", "message" => "Date lipsă"]);
  exit;
}


function generateEmail($nume, $prenume) {
  $nume = strtolower(preg_replace('/[^a-z]/i', '', iconv('UTF-8', 'ASCII//TRANSLIT', $nume)));
  $prenume = strtolower(preg_replace('/[^a-z]/i', '', iconv('UTF-8', 'ASCII//TRANSLIT', $prenume)));
  return "$nume.$prenume@elev.teodornes.ro";
}

function generateParola($length = 6) {
  return substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, $length);
}

function generateCodFeedback($length = 8) {
  return substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, $length);
}

$email  = generateEmail($nume, $prenume);
$parola = generateParola();
$cod_feedback = generateCodFeedback();



$stmt = $conn->prepare("INSERT INTO elevi (nume, prenume, clasa_id, email, parola, cod_feedback) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssisss", $nume, $prenume, $clasa_id, $email, $parola, $cod_feedback);

$stmt->execute();

if ($stmt->affected_rows > 0) {
  echo json_encode([
    "status" => "success",
    "email" => $email,
    "parola" => $parola
  ]);
} else {
  echo json_encode(["status" => "error", "message" => "Inserare eșuată"]);
}

$conn->close();
?>

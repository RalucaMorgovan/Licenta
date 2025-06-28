<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$elev_id = $data['elev_id'] ?? null;

if (!$elev_id) {
  echo json_encode(["status" => "error", "message" => "ID elev lipsă"]);
  exit;
}

$query = "
  SELECT e.nume, e.prenume, c.nume AS clasa, m.nume AS materie, mc.id AS materie_clasa_id,
         (SELECT COUNT(*) FROM feedback_completat f 
          WHERE f.cod_feedback = e.cod_feedback AND f.materie_clasa_id = mc.id) AS completat
  FROM elevi e
  JOIN clase c ON e.clasa_id = c.id
  JOIN materii_clase mc ON mc.clasa_id = c.id
  JOIN materii m ON mc.materie_id = m.id
  WHERE e.id = ?
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $elev_id);
$stmt->execute();
$result = $stmt->get_result();

$materii = [];
$nume = "";
$prenume = "";
$clasa = "";

while ($row = $result->fetch_assoc()) {
  $nume = $row['nume'];
  $prenume = $row['prenume'];
  $clasa = $row['clasa'];
  $materii[] = [
    "materie" => $row['materie'],
    "materie_clasa_id" => $row['materie_clasa_id'],
    "completat" => $row['completat']
  ];
}

echo json_encode([
  "status" => "success",
  "nume" => $nume,
  "prenume" => $prenume,
  "clasa" => $clasa,
  "materii" => $materii
]);
?>

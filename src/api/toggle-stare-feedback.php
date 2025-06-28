<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD']==='OPTIONS') {
  http_response_code(204);
  exit;
}
header("Content-Type: application/json");
require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$nouActiv      = isset($data['activ']) ? (int)$data['activ'] : null;
$dataInchidere = $data['data_inchidere'] ?? null;

if ($nouActiv===null) {
  echo json_encode(["status"=>"error","message"=>"Parametru activ lipsă"]);
  exit;
}

$stmt = $conn->prepare("
  UPDATE stare_feedback
     SET activ = ?, data_inchidere = ?
   WHERE id    = 1
");
$stmt->bind_param("is", $nouActiv, $dataInchidere);
$stmt->execute();

echo json_encode([
  "status"         => $stmt->affected_rows>=0 ? "success" : "error",
  "activ"          => (bool)$nouActiv,
  "data_inchidere" => $dataInchidere
]);

$conn->close();

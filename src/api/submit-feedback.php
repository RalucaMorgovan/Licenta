<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);

$cod_feedback     = trim($data['cod_feedback']     ?? '');
$materie_clasa_id = intval($data['materie_clasa_id'] ?? 0);
$raspunsuri       = $data['raspunsuri']             ?? [];
$dorinta          = trim($data['dorinta']          ?? '');
$gand_profesor    = trim($data['gand_profesor']    ?? '');
$prezenta         = trim($data['prezenta']         ?? '');


if (!$cod_feedback || !$materie_clasa_id) {
  echo json_encode(["status" => "error", "message" => "cod_feedback sau materie_clasa_id lipsă"]);
  exit;
}

if (!is_array($raspunsuri) || count($raspunsuri) !== 16) {
  echo json_encode(["status" => "error", "message" => "Trebuie trimise exact 16 răspunsuri"]);
  exit;
}

if (!$dorinta) {
  echo json_encode(["status" => "error", "message" => "Câmpul dorință lipsește"]);
  exit;
}
if (!$gand_profesor) {
  echo json_encode(["status" => "error", "message" => "Câmpul gând profesor lipsește"]);
  exit;
}
if (!$prezenta) {
  echo json_encode(["status" => "error", "message" => "Câmpul prezență lipsește"]);
  exit;
}

$stmt2 = $conn->prepare("
  INSERT INTO feedback_completat (cod_feedback, materie_clasa_id)
  VALUES (?, ?)
");
$stmt2->bind_param("si", $cod_feedback, $materie_clasa_id);
if (!$stmt2->execute()) {
  echo json_encode(["status" => "error", "message" => "Eroare la feedback_completat: " . $stmt2->error]);
  exit;
}

$sql = "
  INSERT INTO feedback (
    cod_feedback,
    materie_clasa_id,
    q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
    q11, q12, q13, q14, q15, q16,
    dorinta,
    gand_profesor,
    prezenta
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  )
";
$stmt = $conn->prepare($sql);
if (!$stmt) {
  echo json_encode(["status" => "error", "message" => "Eroare pregătire query: " . $conn->error]);
  exit;
}

$types = "si" . str_repeat("i", 16) . "sss";
$params = [ $types, &$cod_feedback, &$materie_clasa_id ];
for ($j = 0; $j < 16; $j++) {
  $params[] = &$raspunsuri[$j];
}
$params[] = &$dorinta;
$params[] = &$gand_profesor;
$params[] = &$prezenta;

call_user_func_array([$stmt, 'bind_param'], $params);

if (!$stmt->execute()) {
  echo json_encode(["status" => "error", "message" => "Eroare execuție: " . $stmt->error]);
  exit;
}

echo json_encode(["status" => "success"]);
$conn->close();

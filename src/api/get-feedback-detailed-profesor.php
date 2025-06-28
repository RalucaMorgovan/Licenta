<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0);
}
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);
$pid  = $data['profesor_id'] ?? null;
if (!$pid || !is_numeric($pid)) {
    echo json_encode(["status"=>"error","message"=>"ID profesor invalid"]);
    exit;
}

$query = "
  SELECT
    f.cod_feedback,
    f.data,
    m.nume    AS materie,
    c.nume    AS clasa,
    f.q1,  f.q2,  f.q3,  f.q4,  f.q5,
    f.q6,  f.q7,  f.q8,  f.q9,  f.q10,
    f.q11, f.q12, f.q13, f.q14, f.q15, f.q16,
    f.dorinta,
    f.gand_profesor,
    f.prezenta
  FROM feedback AS f
  JOIN materii_clase AS mc ON f.materie_clasa_id = mc.id
  JOIN materii          AS m  ON mc.materie_id       = m.id
  JOIN clase            AS c  ON mc.clasa_id         = c.id
  WHERE mc.profesor_id = ?
  ORDER BY f.data DESC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $pid);
$stmt->execute();
$res = $stmt->get_result();

$details = [];
while ($row = $res->fetch_assoc()) {
  $details[] = $row;
}

echo json_encode([
  "status"  => "success",
  "details" => $details
]);

$stmt->close();
$conn->close();

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once("db.php");

$data     = json_decode(file_get_contents("php://input"), true);
$clasa_id = intval($data['clasa_id'] ?? 0);
if (!$clasa_id) {
  echo json_encode(['status'=>'error','message'=>'ID clasă lipsă']);
  exit;
}

$stmt0 = $conn->prepare("SELECT COUNT(*) AS total_elevi FROM elevi WHERE clasa_id = ?");
$stmt0->bind_param("i", $clasa_id);
$stmt0->execute();
$res0 = $stmt0->get_result()->fetch_assoc();
$totalElevi = intval($res0['total_elevi']);
$stmt0->close();

$stmtV = $conn->prepare("
  SELECT COUNT(DISTINCT f.cod_feedback) AS votanti
    FROM feedback_completat f
    JOIN materii_clase mc ON f.materie_clasa_id = mc.id
    WHERE mc.clasa_id = ?
");
$stmtV->bind_param("i", $clasa_id);
$stmtV->execute();
$resV = $stmtV->get_result()->fetch_assoc();
$votanti = intval($resV['votanti']);
$stmtV->close();

$query = "
  SELECT
    f.cod_feedback,
    f.data,
    m.nume    AS materie,
    p.nume    AS profesor,
    f.q1,  f.q2,  f.q3,  f.q4,  f.q5,
    f.q6,  f.q7,  f.q8,  f.q9,  f.q10,
    f.q11, f.q12, f.q13, f.q14, f.q15, f.q16,
    f.dorinta,
    f.gand_profesor,
    f.prezenta
  FROM feedback AS f
  JOIN feedback_completat fc
    ON fc.cod_feedback        = f.cod_feedback
   AND fc.materie_clasa_id    = f.materie_clasa_id
  JOIN materii_clase AS mc 
    ON f.materie_clasa_id     = mc.id
  JOIN materii          AS m  
    ON mc.materie_id          = m.id
  JOIN profesori        AS p  
    ON mc.profesor_id        = p.id
  JOIN clase            AS c  
    ON mc.clasa_id           = c.id
  WHERE c.id = ?
  ORDER BY f.data DESC
";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $clasa_id);
$stmt->execute();
$result = $stmt->get_result();

$feedbackuri = [];
while ($row = $result->fetch_assoc()) {
  $feedbackuri[] = $row;
}
$stmt->close();
$conn->close();

$procentaj = $totalElevi
  ? round(($votanti / $totalElevi) * 100, 2)
  : 0;

echo json_encode([
  'status'      => 'success',
  'total_elevi' => $totalElevi,
  'votanti'     => $votanti,
  'procentaj'   => $procentaj,
  'feedbackuri' => $feedbackuri
]);

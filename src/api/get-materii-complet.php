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

$query = "
SELECT 
  mc.id,  -- acest id este necesar pentru ștergere
  m.nume AS materie,
  c.nume AS clasa,
  p.nume AS profesor
FROM materii_clase mc
JOIN materii m ON mc.materie_id = m.id
JOIN clase c ON mc.clasa_id = c.id
JOIN profesori p ON mc.profesor_id = p.id
";

$result = $conn->query($query);

$materii = [];

while ($row = $result->fetch_assoc()) {
  $materii[] = $row;
}

echo json_encode(["status" => "success", "materii" => $materii]);
$conn->close();

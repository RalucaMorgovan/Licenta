<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once("db.php");

$query = "
  SELECT 
    p.id,
    p.nume,
    p.email,
    m.nume AS materie,
    c.nume AS clasa
  FROM materii_clase mc
  JOIN profesori p ON mc.profesor_id = p.id
  JOIN materii m ON mc.materie_id = m.id
  JOIN clase c ON mc.clasa_id = c.id
";

$result = $conn->query($query);

$profesori = [];

while ($row = $result->fetch_assoc()) {
  $profesori[] = $row;
}

echo json_encode(["status" => "success", "profesori" => $profesori]);
$conn->close();

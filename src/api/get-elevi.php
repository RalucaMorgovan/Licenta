<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");

require_once("db.php");

$query = "
  SELECT e.id, e.nume, e.prenume, e.email, e.parola, c.nume AS clasa
  FROM elevi e
  JOIN clase c ON e.clasa_id = c.id
  ORDER BY c.nume ASC, e.nume ASC
";

$result = $conn->query($query);
$elevi = [];

while ($row = $result->fetch_assoc()) {
  $elevi[] = $row;
}

echo json_encode(["status" => "success", "elevi" => $elevi]);
$conn->close();
?>

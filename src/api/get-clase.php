<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: *");


require_once("db.php");

$result = $conn->query("SELECT id, nume FROM clase ORDER BY nume ASC");

$clase = [];
while ($row = $result->fetch_assoc()) {
  $clase[] = $row;
}

echo json_encode(["status" => "success", "clase" => $clase]);
$conn->close();


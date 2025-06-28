<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once("db.php");

$query = "SELECT id, nume FROM materii";
$result = $conn->query($query);

$materii = [];
while ($row = $result->fetch_assoc()) {
  $materii[] = $row;
}

echo json_encode(["status" => "success", "materii" => $materii]);
$conn->close();

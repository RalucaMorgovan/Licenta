<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once("db.php");

$result = $conn->query("
  SELECT activ, data_inchidere
    FROM stare_feedback
   WHERE id = 1
   LIMIT 1
");

if ($row = $result->fetch_assoc()) {
  echo json_encode([
    "status"        => "success",
    "activ"         => (bool)$row['activ'],
    "data_inchidere"=> $row['data_inchidere']
  ]);
} else {

  echo json_encode([
    "status"        => "success",
    "activ"         => true,
    "data_inchidere"=> null
  ]);
}

$conn->close();

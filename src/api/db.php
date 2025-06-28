<?php
$host = "localhost";
$user = "root";
$pass = "root";
$dbname = "feedback_scoala";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Conexiune eșuată: " . $conn->connect_error);
}
?>

<?php
$host = "localhost";
$user = "root";
$pass = "root";
$dbname = "feedback_scoala";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Conexiune esuată: " . $conn->connect_error);
}

$conn->query("DELETE FROM utilizatori");

$elevi = $conn->query("SELECT email, parola FROM elevi");
while ($e = $elevi->fetch_assoc()) {
    $email = $e['email'];
    $parola = $e['parola'];
    $conn->query("INSERT INTO utilizatori (email, parola, rol) VALUES ('$email', '$parola', 'elev')");
}

$profesori = $conn->query("SELECT email, parola FROM profesori");
while ($p = $profesori->fetch_assoc()) {
    $email = $p['email'];
    $parola = $p['parola'];
    $conn->query("INSERT INTO utilizatori (email, parola, rol) VALUES ('$email', '$parola', 'profesor')");
}

$conn->query("INSERT INTO utilizatori (email, parola, rol) VALUES 
    ('secretara@teodornes.ro', 'secret123', 'secretara'),
    ('director@teodornes.ro', 'director123', 'director')
");

echo "Utilizatorii au fost populați cu succes!";
$conn->close();
?>

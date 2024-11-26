<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli("localhost", "root", "", "campo_minado");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Sanitize and validate input (CRUCIAL!)
$name = $conn->real_escape_string($_POST["namebox"]);
$email = $conn->real_escape_string($_POST["emailbox"]);
$birthday = $conn->real_escape_string($_POST["birthdaybox"]);
$cpf = $conn->real_escape_string($_POST["cpfbox"]);
$telefone = $conn->real_escape_string($_POST["telefonebox"]);
$username = $conn->real_escape_string($_POST["usernamebox"]); // Or use prepared statements
$password = $conn->real_escape_string($_POST["passwordbox"]); // Or use prepared statements


// Query the database
$sql = "INSERT INTO usuarios (nome, email, dtnasc, cpf, telefone, usuario, senha, pontos)  VALUES('$name','$email','$birthday','$cpf','$telefone','$username','$password', 0)"; // Use prepared statements!
$result = $conn->query($sql);

if ($result) {
    // Successful login
    echo json_encode(["success" => true]);
} else {
    // Failed login
    echo json_encode(["success" => false, "error" => "Invalid credentials"]);
}

$conn->close();
?>
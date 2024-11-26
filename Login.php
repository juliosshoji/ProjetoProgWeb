<?php

require_once "CampoMinado.php";

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli("localhost", "root", "", "campo_minado");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Sanitize and validate input (CRUCIAL!)
$username = $conn->real_escape_string($_POST["usernamebox"]); // Or use prepared statements
$password = $conn->real_escape_string($_POST["passwordbox"]); // Or use prepared statements

// Query the database
$sql = "SELECT * FROM usuarios WHERE usuario = '$username' AND senha = '$password'"; // Use prepared statements!
$result = $conn->query($sql);

if ($result->num_rows == 1) {
    // Successful login
    setcookie("username", $username, time()+3600, "/");
    $_SESSION["username"] = $username;
    echo json_encode(["success" => true]);
} else {
    // Failed login
    echo json_encode(["success" => false, "error" => "Invalid credentials"]);
}

$conn->close();
?>





<?php

require "CampoMinado.php";
require "credentials.php";

session_start();

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if ($conn->connect_error) {
    die(json_encode(["sucess" => false, "error" => "Conexão com Banco de Dados falhou: " . $conn->connect_error]));
}

$username = $conn->real_escape_string($_POST["usernamebox"]); 
$password = $conn->real_escape_string($_POST["passwordbox"]); 

$sql = "SELECT * FROM usuarios WHERE usuario = '$username' AND senha = '$password'"; 
$result = $conn->query($sql);

if ($result->num_rows == 1) {
    $_SESSION["username"] = $username;
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Credenciais inválidas"]);
}

$conn->close();
?>





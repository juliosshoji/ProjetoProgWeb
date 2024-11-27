<?php

require_once "CampoMinado.php";
require "credentials.php";

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if ($conn->connect_error) {
    die(json_encode(["sucess" => false, "error" => "Conexão com Banco de Dados falhou: " . $conn->connect_error]));
}

$name = $conn->real_escape_string($_POST["namebox"]);
$email = $conn->real_escape_string($_POST["emailbox"]);
$birthday = $conn->real_escape_string($_POST["birthdaybox"]);
$cpf = $conn->real_escape_string($_POST["cpfbox"]);
$telefone = $conn->real_escape_string($_POST["telefonebox"]);
$username = $conn->real_escape_string($_POST["usernamebox"]);
$password = $conn->real_escape_string($_POST["passwordbox"]);

$sql = "SELECT * FROM usuarios WHERE usuarios.usuario = '$username'";
$result = $conn->query($sql);
if($result->num_rows > 0) {
    die(json_encode(["sucess" => false, "error" => "Nome de usuário já existe"])); 
}


$sql = "INSERT INTO usuarios (nome, email, dtnasc, cpf, telefone, usuario, senha, pontos)  VALUES('$name','$email','$birthday','$cpf','$telefone','$username','$password', 0)"; // Use prepared statements!
$result = $conn->query($sql);

if ($result) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Erro inserindo usuário no banco de dados"]);
}

$conn->close();
?>
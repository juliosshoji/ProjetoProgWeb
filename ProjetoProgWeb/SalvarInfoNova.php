<?php 

    session_start();

    require_once "CampoMinado.php";

    header('Content-Type: application/json');
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    $conn = new mysqli("localhost", "root", "", "campo_minado");

    if ($conn->connect_error) {
        die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
    }

    $username = $_SESSION["username"];

    $name = $conn->real_escape_string($_POST["namebox"]);
    $email = $conn->real_escape_string($_POST["emailbox"]);
    $birthday = $conn->real_escape_string($_POST["birthdaybox"]);
    $cpf = $conn->real_escape_string($_POST["cpfbox"]);
    $telefone = $conn->real_escape_string($_POST["telefonebox"]);
    $newusername = $conn->real_escape_string($_POST["usernamebox"]); 
    $password = $conn->real_escape_string($_POST["passwordbox"]);


    if($username !== $newusername){
        $sql = "SELECT * FROM usuarios WHERE usuarios.usuario = '$newusername'";
        $result = $conn->query($sql);
        if($result->num_rows > 0) {
            die(json_encode(["sucess" => false, "error" => "Nome de usuário já existe"])); 
        }
    }
    if($password === ""){
        $sql = "UPDATE usuarios SET nome = '$name', email = '$email', dtnasc = '$birthday', cpf = '$cpf', telefone = '$telefone', usuario = '$newusername' WHERE usuario = '$username'";
    }
    else {
        $sql = "UPDATE usuarios SET nome = '$name', email = '$email', dtnasc = '$birthday', cpf = '$cpf', telefone = '$telefone', usuario = '$newusername', senha = '$password' WHERE usuario = '$username'";
    }
    
    $result = $conn->query($sql);

    if ($result) {
        $_SESSION["username"] = $newusername;
        echo json_encode(["success" => true, "error" => "", "newuser" => $newusername]);
    } else {
        echo json_encode(["success" => false, "error" => "Erro atualizando usuário no banco de dados"]);
    }

    $conn->close();
?>

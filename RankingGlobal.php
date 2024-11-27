<?php

    require "credentials.php";

    session_start();
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    header('Content-Type: application/json');
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    if(!isset($_SESSION["username"])){
        die(json_encode(["sucess" => false, "error"=> "Usuário não autenticado"]));
    }

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    if ($conn->connect_error) {
        die(json_encode(["sucess" => false, "error" => "Conexão com Banco de Dados falhou: " . $conn->connect_error]));
    }


    $sql = "SELECT  u.nome, 
    u.pontos
    FROM
    usuarios u 
    ORDER BY u.pontos DESC
    LIMIT 10";

    $result = $conn->query($sql);
    if ($result) {
        $data = [];

        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["sucess" => true, "partida" => $data]);
    } else {
        echo json_encode(["sucess" => false, "error"=> "Erro na consulta ao Banco de Dados"]);
    }

    $conn->close();

?>

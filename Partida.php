<?php

<<<<<<< HEAD
    
=======
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
>>>>>>> 983cdb5 (Finalizando)
    header('Content-Type: application/json');
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

<<<<<<< HEAD
=======
    if(!isset($_SESSION["username"])){
        die(json_encode(["sucess" => false, "error"=> "Not logged-in"]));
    }

>>>>>>> 983cdb5 (Finalizando)
    $conn = new mysqli("localhost", "root", "", "campo_minado");

    if ($conn->connect_error) {
        die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
    }

    $username = $_COOKIE["username"];
    $dimensions = $conn->real_escape_string($_POST["dimensions"]);
    $bombqtd = (int) $conn->real_escape_string($_POST["bombqtd"]);
    $modality = $conn->real_escape_string($_POST["modality"]);
    $time = $conn->real_escape_string($_POST["time"]);
    $status = $conn->real_escape_string($_POST["result"]);
    $points = $conn->real_escape_string($_POST["points"]);

    date_default_timezone_set("America/Sao_Paulo");
    $currentTime = date("Y-m-d H:i:s", time());
    $sql = "SELECT id FROM usuarios WHERE usuario = '$username'";
    $result = $conn->query($sql);

    $user_id = (int) $result->fetch_assoc()["id"];

    $sql = "INSERT INTO partidas (usuario_id, dimensoes, qtdbombas, modalidade, tempo, dthora, resultado, pontos) VALUES (
        '$user_id',
        '$dimensions',
        $bombqtd,
        '$modality',
        '$time',
        '$currentTime',
        '$status',
        $points
        )
    ";

    $result = $conn->query(query: $sql);
    if ($result) {
        $sql = "UPDATE usuarios SET pontos = pontos + '$points' WHERE id = '$user_id'";
        $result = $conn->query(query: $sql);
        if($result){
            echo json_encode(value: ["sucess" => true]);
        } else {
            echo json_encode(value: ["sucess"=> false, "eror" => "Game saved, but points not applied"]);
        }
    }
    else {
        echo json_encode(value: ["sucess"=> false, "error" => "Could not save game"]);
    }

    $conn->close();
?>
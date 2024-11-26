<?php
    header('Content-Type: application/json');
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

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

    $currentTime = date("Y-m-d H:i:s");
    $sql = "SELECT id FROM usuarios WHERE usuario = '$username'";
    $result = $conn->query($sql);

    $user_id = (int) $result->fetch_all()[0];

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
        echo json_encode(value: ["sucess" => true]);
    }
    else {
        echo json_encode(value: ["sucess"=> false, "error" => "Could not save game"]);
    }

    $conn->close();
?>
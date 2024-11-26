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

    $sql = "SELECT  u.nome, 
    p.dimensoes, 
    p.qtdbombas,
    p.modalidade,
    p.tempo,
    p.resultado,
    p.dthora
    FROM
    usuarios u 
    INNER JOIN partidas p ON u.id = p.usuario_id
    WHERE u.usuario = '$username'
    ORDER BY p.dthora";

    $result = $conn->query($sql);
    if ($result) {
        $data = [];

        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["sucess" => true, "partida" => $data]);
    } else {
        echo json_encode(["sucess" => false, "error"=> "Error with query"]);
    }

    $conn->close();

?>

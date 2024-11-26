<?php
    session_start();
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

    $conn = new mysqli("localhost", "root", "", "campo_minado");

    if ($conn->connect_error) {
        die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
    }

    if(!isset($_SESSION["username"])){
        die(json_encode(["sucess" => false, "error"=> "Not logged-in"]));
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
        echo json_encode(["sucess" => false, "error"=> "Error with query"]);
    }

    $conn->close();

?>

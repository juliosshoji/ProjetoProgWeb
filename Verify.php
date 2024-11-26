<?php 

    session_start();

    header('Content-Type: application/json');
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    if(isset($_SESSION["username"]))
    {
        echo json_encode(["sucess" => true]);
    }
    else {
        echo json_encode(["sucess"=> false]);
    }


?>

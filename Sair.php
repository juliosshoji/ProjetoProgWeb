<?php 

    session_start();

    require_once "CampoMinado.php";

    header('Content-Type: application/json');

    setcookie("username","", time()-3600,"/");
    if (!isset( $_COOKIE["username"])) {
        unset($_COOKIE["username"]);
        unset($_SESSION["username"]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Error exiting"]);
    }
?>

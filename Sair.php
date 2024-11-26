<?php 

<<<<<<< HEAD
=======
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");

>>>>>>> 983cdb5 (Finalizando)
    session_start();

    require_once "CampoMinado.php";

    header('Content-Type: application/json');
<<<<<<< HEAD

    setcookie("username","", time()-3600,"/");
    if (!isset( $_COOKIE["username"])) {
        unset($_COOKIE["username"]);
        unset($_SESSION["username"]);
=======
    unset($_SESSION["username"]);

    if (!isset( $_SESSION["username"])) {
>>>>>>> 983cdb5 (Finalizando)
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Error exiting"]);
    }
<<<<<<< HEAD
=======

    session_destroy();
>>>>>>> 983cdb5 (Finalizando)
?>

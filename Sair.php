<?php 

    session_start();
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");

    

    header('Content-Type: application/json');
    unset($_SESSION["username"]);

    if (!isset( $_SESSION["username"])) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Error exiting"]);
    }

    session_destroy();
?>

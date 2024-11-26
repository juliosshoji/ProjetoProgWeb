<?php 
    header('Content-Type: application/json');
    setcookie("username","", time()-3600,"/");
    if (!isset( $_COOKIE["username"])) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Error exiting"]);
    }
?>

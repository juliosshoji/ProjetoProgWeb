<?php 
                 
    session_start();
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
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

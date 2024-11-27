<?php
    session_start();

    if(!isset($_SESSION['contador'])){
        $_SESSION['contador'] = 1;
    }
    else {
        $_SESSION['contador']++;
    }

    require_once "credentials.php";
    
    function inicializarBancoDeDados() {
            $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD);
            if ($conn->connect_error) {
                die(json_encode(["sucess" => false, "error" => "Conexão com Banco de Dados falhou: " . $conn->connect_error]));
            }
    
            $sql =  "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
            $result = $conn->query($sql);
            if (!$result) {
                echo die(json_encode(["sucess"=> false, "error"=> "Erro criando Database"]));
            }

            $sql = "USE " . DB_NAME;
            $result = $conn->query($sql);
            if (!$result) {
                echo die(json_encode(["sucess"=> false, "error"=> "Erro selecionando Database"]));
            }

            $sql = "CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                dtnasc DATE NOT NULL,
                cpf CHAR(11) NOT NULL,
                telefone CHAR(15) NOT NULL,
                usuario VARCHAR(50) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                pontos INT NOT NULL
            )";
            $result = $conn->query($sql);
            if (!$result) {
                echo die(json_encode(["sucess"=> false, "error" => "Erro criando tabela usuarios"]));
            }

    
            $sql = ("CREATE TABLE IF NOT EXISTS partidas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                dimensoes CHAR(11) NOT NULL,
                qtdbombas INT NOT NULL,
                modalidade CHAR(20) NOT NULL,
                tempo TIME NOT NULL,
                dthora DATETIME NOT NULL,
                resultado ENUM('vitoria', 'derrota') NOT NULL,
                pontos INT NOT NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            )");
            $result = $conn->query($sql);
            if (!$result) {
                echo die(json_encode(["sucess"=> false, "error" => "Erro criando tabela partidas"]));
            }
    }
    
    inicializarBancoDeDados();
    
?>

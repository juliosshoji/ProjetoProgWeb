<?php
    session_start();

    if(!isset($_SESSION['contador'])){
        $_SESSION['contador'] = 1;
    }
    else {
        $_SESSION['contador']++;
    }
    
    
    
    const DB_HOST = 'localhost';
    const DB_NAME = 'campo_minado';
    const DB_USER =  'root';
    const DB_PASSWORD = '';
    
    
    function inicializarBancoDeDados() {
        try {
            $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASSWORD);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
            $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
            $pdo->exec("USE " . DB_NAME);
    
            $pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                dtnasc DATE NOT NULL,
                cpf CHAR(11) NOT NULL,
                telefone CHAR(15) NOT NULL,
                usuario VARCHAR(50) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                pontos INT NOT NULL
            )");
    
            $pdo->exec("CREATE TABLE IF NOT EXISTS partidas (
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

            $pdo->exec("SET @@global.time_zone = '-4:00'");
    
        } catch (PDOException $e) {
            die("Erro ao inicializar o banco de dados: " . $e->getMessage());
        }
    }
    
    if($_SESSION['contador'] === 1){
        inicializarBancoDeDados();
    }
?>

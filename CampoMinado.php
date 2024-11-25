<?php
// Configuração do banco de dados
const DB_HOST = 'localhost';
const DB_NAME = 'campo_minado';
const DB_USER = 'root';
const DB_PASSWORD = '';

// Função para conectar ao banco de dados
function getDatabaseConnection() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die("Erro ao conectar ao banco de dados: " . $e->getMessage());
    }
}

// Função para criar o banco de dados e tabelas, caso ainda não existam
function inicializarBancoDeDados() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Criação do banco de dados, se não existir
        $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME);

        // Conectar ao banco de dados recém-criado
        $pdo = getDatabaseConnection();

        // Criação da tabela de usuários
        $pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL
        )");

        // Criação da tabela de partidas
        $pdo->exec("CREATE TABLE IF NOT EXISTS partidas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            tempo INT NOT NULL,
            resultado ENUM('vitoria', 'derrota') NOT NULL,
            pontos INT NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )");
    } catch (PDOException $e) {
        die("Erro ao inicializar o banco de dados: " . $e->getMessage());
    }
}

// Inicializa a sessão para controle de autenticação
session_start();

// Inicializar o banco de dados na primeira execução
inicializarBancoDeDados();

// Função para autenticar o usuário
function autenticarUsuario() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $email = $_POST['email'] ?? '';
        $senha = $_POST['senha'] ?? '';

        $pdo = getDatabaseConnection();

        $stmt = $pdo->prepare("SELECT id, senha FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && password_verify($senha, $usuario['senha'])) {
            $_SESSION['usuario_id'] = $usuario['id'];
            return true;
        }
    }
    return false;
}

// Função para verificar se o usuário está autenticado
function isUsuarioAutenticado() {
    return isset($_SESSION['usuario_id']);
}

// Função para registrar um novo usuário
function registrarUsuario() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nome = $_POST['nome'] ?? '';
        $email = $_POST['email'] ?? '';
        $senha = $_POST['senha'] ?? '';

        $pdo = getDatabaseConnection();

        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
        return $stmt->execute([$nome, $email, $senhaHash]);
    }
    return false;
}

// Função para registrar o resultado de uma partida
function registrarPartida() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $usuarioId = $_SESSION['usuario_id'] ?? null;
        $tempo = $_POST['tempo'] ?? null;
        $resultado = $_POST['resultado'] ?? null;
        $pontos = $_POST['pontos'] ?? null;

        if ($usuarioId && $tempo && $resultado && $pontos !== null) {
            $pdo = getDatabaseConnection();

            $stmt = $pdo->prepare("INSERT INTO partidas (usuario_id, tempo, resultado, pontos) VALUES (?, ?, ?, ?)");
            return $stmt->execute([$usuarioId, $tempo, $resultado, $pontos]);
        }
    }
    return false;
}

// Função para obter o ranking dos jogadores
function obterRanking() {
    $pdo = getDatabaseConnection();

    $stmt = $pdo->query("SELECT u.nome, SUM(p.pontos) AS total_pontos
                         FROM usuarios u
                         LEFT JOIN partidas p ON u.id = p.usuario_id
                         GROUP BY u.id
                         ORDER BY total_pontos DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Verificação de autenticação para proteger páginas restritas
if (!isUsuarioAutenticado() && basename($_SERVER['PHP_SELF']) !== 'login.php') {
    header("Location: login.php");
    exit;
}

?>

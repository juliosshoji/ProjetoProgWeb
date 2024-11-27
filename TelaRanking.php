<!DOCTYPE html>
<html lang="pt">
    <head>
        <meta charset="UTF-8">
        <title>Histórico do Jogador</title>
        <link rel="stylesheet" href="./StyleInformacoes.css">
        <script src="./DinamicaJogo.js"></script>
    </head>

    <body>
        <?php
            session_start(); 
            if(!isset($_SESSION["username"])){
                header("Location: ./TelaLogin.html");
            }    
        ?>
        <div class="bloco">
            <h1>Histórico de Partidas</h1>
            <div id = "ranking"></div>
            <div class="button-container">
                <a href="./TelaJogo.php">
                    <div id="exit-button" class="button">Sair</div>
                </a>
            </div>
        </div>
    </body>
</html>
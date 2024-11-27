<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./StyleInformacoes.css">
    <title>Campo Minado - Fim de Jogo</title>
    <script src="./DinamicaJogo.js"></script>
</head>
<body>
    <?php
        session_start();
        if(!isset($_SESSION["username"])){
            header("Location: ./TelaLogin.html");
        }    
    ?>
    <div class="container">
        <h1>Fim de Jogo</h1>
        <h2>Quer tentar novamente?</h2>
        <div class="button-container">
            <div id="restart-button" class="button">Reiniciar Jogo</div>
        </div>
        <div class="button-container">
            <div id="exit-button" class="button">Sair</div>
        </div>
    </div>
</body>
</html>

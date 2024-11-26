<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TelaPrincipal</title>

    <link rel="stylesheet" href="./StyleInformacoes.css">
    <script src="./DinamicaJogo.js"></script>
</head>
<body >
<<<<<<< HEAD:TelaJogo.html
=======
    <?php 
        session_start();
        if(!isset($_SESSION["username"])){
            header("Location: ./TelaLogin.html");
        }    
    ?>
>>>>>>> 983cdb5 (Finalizando):TelaJogo.php
    <div class="container-principal">
        <div class="subcontainer-jogo">
            <table id="tableJogo"></table>
        </div>

        <div class="container-direita">
            <div class="subcontainer-configuracoes">
                <div style="display: flex;">
                    <div class="button" id="botaoInicio" >Início</div>
                    <div class="button" id="botaoRivotril" style="background-color: brown;">Rivotril</div> 
                </div>
                <div class="button tempo">00:00</div> 
                    <p>Tempo</p>
                <div class="button" style="display: flex; justify-content: center; align-items: center;">
                    <input type="text" id="tamanhoJogo" placeholder="Ex: 6x6" value="6x6" 
                        style="border:none; background:none; text-align:center; width: 80px; padding: 5px; color: white; font-size: 18px">
                </div>
                    <p>Linha x Coluna</p>
                <div class="button" style="display: flex; justify-content: center; align-items: center;">
                    <input type="number" id="botaoBomba" min="2" placeholder="Ex: 5" value="5" 
                        style="border:none; background:none; text-align:center; width: 50px; padding: 5px; color: white; font-size: 18px;">
                </div>
                    <p>Número de Bombas</p>
                <div class="button" style="background-color: rgb(0, 212, 11);" onclick="cheatMode()">
                    Modo Trapaça    
                </div>
            </div>
            <div id="historico" class="subcontainer-historico"></div>
        </div>

        <div class="subcontainer-footer">
            <a href="./TelaFimDeJogo.php">
                <div class="button">Sair ou Reiniciar</div>
            </a>
            <a href="./TelaRanking.php">
                <div class="button">Ranking Global</div>
            </a>
            <a href="./TelaEditarInfo.php">
                <div class="button">Editar Perfil</div>
            </a>
        </div>
    </div>
</body>
</html>

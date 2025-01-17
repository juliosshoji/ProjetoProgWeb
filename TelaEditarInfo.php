<!--Higor Gabriel Santana Magalhães RA: 247483-->

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Perfil - Campo Minado</title>
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
    <div class="container">
        <h1 style="color: red;">Campo Minado</h1>
        <h2>Editar Perfil</h2>
        <form id="editForm" name="editProfile" onsubmit="salvarAlteracoes(event)">
            <div class="form-group">
                <label for="namebox">Nome Completo:</label>
                <input type="text" id="namebox" name="namebox">
            </div>

            <div class="form-group">
                <label for="emailbox">E-mail:</label>
                <input type="email" id="emailbox" name="emailbox">
            </div>

            <div class="form-group">
                <label for="birthdaybox">Data de nascimento (Ex.: 01/01/2001):</label>
                <input type="date" id="birthdaybox" name="birthdaybox">
            </div>

            <div class="form-group">
                <label for="cpfbox">Digite seu CPF:</label>
                <input type="text" id="cpfbox" name="cpfbox">
            </div>

            <div class="form-group">
                <label for="telefonebox">Telefone (Ex.: 5511999999999):</label>
                <input type="tel" id="telefonebox" name="telefonebox">
            </div>

            <div class="form-group">
                <label for="usernamebox">Nome de Usuário:</label>
                <input type="text" id="usernamebox" name="usernamebox">
            </div>

            <div class="form-group">
                <label for="passwordbox">Nova Senha:</label>
                <input type="password" id="passwordbox" name="passwordbox" placeholder="Deixe em branco se não quiser alterar">
            </div>

            <div class="form-group">
                <label for="confirmpasswordbox">Confirmar nova senha:</label>
                <input type="password" id="confirmpasswordbox" name="confirmpasswordbox" placeholder="Deixe em branco se não quiser alterar">
            </div>

            <div class="button-container">
                <input type="submit" value="Salvar Alterações">
            </div>
        </form>
    </div>
</body>

</html>

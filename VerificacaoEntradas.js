"use strict";

const containsLetters = (str) => /[a-zA-Z]/.test(str);

function validateLoginInput(){

    const user = document.forms["login"]["usernamebox"].value;
    const password = document.forms["login"]["passwordbox"].value;



    // Verifica se os campos estão vazios
    if (!user || !password) {
        // Mostra uma mensagem solicitando a entrada correta
        alert("Usuário e senha não podem ser vazios. Por favor, preencha ambos.");
        window.location.href = "TelaLogin.html"
        return false;
    }
    // Se os campos estiverem preenchidos, prossegue com o fluxo desejado
    window.location.href = "TelaJogo.html";
    return true;
}

function validateRegisterInput(){

    const name = document.forms["register"]["namebox"].value;
    const email = document.forms["register"]["emailbox"].value;
    const birthday = document.forms["register"]["birthdaybox"].value;
    const cpf = document.forms["register"]["cpfbox"].value;
    const telefone = document.forms["register"]["telefonebox"].value;
    const username = document.forms["register"]["usernamebox"].value;
    const password = document.forms["register"]["passwordbox"].value;
    const confirmpassword = document.forms["register"]["confirmpasswordbox"].value;

    if(!name || !email || !birthday || !cpf || !telefone || !username || !password || !confirmpassword){
        alert("Preencha todos os campos!");
        return false;
    }
    if(username.lastIndexOf("@") != -1){
        alert("Não utilize o caractere @ no nome de usuário!");
        return false;
    }
    if(email.lastIndexOf("@") == -1){
        alert("Por favor, insira um e-mail, válido!");
        return false;
    }
    if(password != confirmpassword){
        alert("As senhas não coincidem!");
        return false;
    }
    if(cpf.lastIndexOf(".") != -1){
        cpf.replace(".", "");
    }
    if(cpf.lastIndexOf("-") != -1){
        cpf.replace("-","");
    }
    if(containsLetters(cpf)){
        alert("Não inclua caracteres no CPF!");
        return false;
    }
    if(telefone.lastIndexOf("+") != -1){
        telefone.replace("+", "");
    }
    if(telefone.lastIndexOf("-") != -1){
        telefone.replace("-","");
    }
    if(telefone.lastIndexOf(" ") != -1){
        telefone.replace(" ", "");
    }
    if(containsLetters(telefone)){
        alert("Telefone inválido, não inclua caracteres!");
        return false;
    }
    
    window.location.href = "TelaLogin.html";

    return true;
}
"use strict";

let timerInterval;
let elapsedTime = 0;
let remainingTime = 0;
let rivotrilMode = false;

function startTimer() {
    const timeButton = document.querySelector('.button.tempo');
    elapsedTime = 0; 
    clearInterval(timerInterval); 

    timerInterval = setInterval(() => {
        elapsedTime++;
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        timeButton.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
}

function startCountdown(duration) {
    const timeButton = document.querySelector('.button.tempo');
    remainingTime = duration;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timeButton.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            alert('O tempo acabou! Você perdeu.');
            endGame(); 
        }
    }, 1000);
}

function generateBombs(numBombs, rows, cols) {
    const bombs = new Set();
    while (bombs.size < numBombs) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);
        const position = `${randomRow},${randomCol}`;
        bombs.add(position);
    }
    return bombs;
}

function countAdjacentBombs(row, col, rows, cols, bombs) {
    let adjacentBombs = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            const position = `${newRow},${newCol}`;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (bombs.has(position)) {
                    adjacentBombs++;
                }
            }
        }
    }
    return adjacentBombs;
}

function createBoard(rows, cols, bombs) { 
    const board = document.getElementById('tableJogo');
    board.innerHTML = ''; 
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            cell.classList.add('square-escondido');
            cell.dataset.position = `${i},${j}`;
            row.appendChild(cell);
            const position = `${i},${j}`;
            if (bombs.has(position)) {
                cell.dataset.bomb = true; 
            } else {
                const adjacentBombs = countAdjacentBombs(i, j, rows, cols, bombs);
                cell.dataset.adjacentBombs = adjacentBombs;
            }
        }
        board.appendChild(row); 
    }
}

function revealCell(element, rows, cols, bombs) {
    if (!element.classList.contains('square-escondido')) {
        return;
    }
    element.classList.remove('square-escondido');
    if (element.dataset.bomb) {
        element.classList.add('square-bomba'); 
        element.textContent = '💣';
        alert('Você clicou em uma bomba! Você perdeu.');
        endGame(); 
    } else {
        const adjacentBombs = parseInt(element.dataset.adjacentBombs, 10);
        if (adjacentBombs > 0) {
            element.textContent = adjacentBombs;
        } else {
            element.classList.add('square-sem-nada');
            propagateReveal(element, rows, cols, bombs);
        }

        if (document.querySelectorAll('td.square-escondido').length === document.querySelectorAll('td[data-bomb="true"]').length) {
            victory(); 
        }
    }
}

function victory() {
    alert('Parabéns! Você venceu o jogo!');
    endGame();
}

function propagateReveal(element, rows, cols, bombs) {
    const [row, col] = element.dataset.position.split(',').map(Number);
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const neighbor = document.querySelector(`td[data-position="${newRow},${newCol}"]`);
                if (neighbor && neighbor.classList.contains('square-escondido')) {
                    revealCell(neighbor, rows, cols, bombs);
                }
            }
        }
    }
}

function setupGame() {
    const squares = document.querySelectorAll('td');
    squares.forEach(square => {
        square.addEventListener('click', function() {
            const gameSizeInput = document.getElementById('tamanhoJogo').value;
            const [rows, cols] = gameSizeInput.split('x').map(Number);
            const bombs = new Set(Array.from(document.querySelectorAll('[data-bomb="true"]')).map(el => el.dataset.position));
            revealCell(square, rows, cols, bombs);
        });
    });
}

function startGame() {
    const startButton = document.getElementById('botaoInicio');
    const rivotrilToggle = document.getElementById('botaoRivotril');

    startButton.addEventListener('click', function() {
        const gameSizeInput = document.getElementById('tamanhoJogo').value;
        const [rows, cols] = gameSizeInput.split('x').map(Number);
        const numBombs = parseInt(document.getElementById('botaoBomba').value, 10);

        if (isNaN(rows) || isNaN(cols) || isNaN(numBombs)) {
            alert('Por favor, insira um valor válido para o tamanho do jogo.');
            return;
        }

        const bombs = generateBombs(numBombs, rows, cols); 
        createBoard(rows, cols, bombs); 
        setupGame();

        if (rivotrilMode) {
            const maxTime = rows * cols;
            startCountdown(maxTime);
        } else {
            startTimer();
        }
        startButton.disabled = true;
    });

    rivotrilToggle.addEventListener('click', function() {
        rivotrilMode = !rivotrilMode;
        rivotrilToggle.style.backgroundColor = rivotrilMode ? 'green' : '';
    });
}

function cheatMode() {
    const squares = document.querySelectorAll('td.square-escondido');
    squares.forEach(square => {
        if (square.dataset.bomb) {
            square.textContent = '💣';
        } else {
            const adjacentBombs = square.dataset.adjacentBombs;
            square.textContent = adjacentBombs > 0 ? adjacentBombs : '';
        }
    });

    setTimeout(() => {
        squares.forEach(square => {
            square.textContent = ''; 
        });
    }, 2000); 
}

function endGame() {
    clearInterval(timerInterval);
    window.location.href = "TelaFimDeJogo.html";
}

window.onload = startGame;

const containsLetters = (str) => /[a-zA-Z]/.test(str);

function validateLoginInput(){

    const user = document.forms["login"]["usernamebox"].value;
    const password = document.forms["login"]["passwordbox"].value;
    if (!user || !password) {
        alert("Usuário e senha não podem ser vazios. Por favor, preencha ambos.");
        window.location.href = "TelaLogin.html"
        return false;
    }
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

document.addEventListener("DOMContentLoaded", function() {
    // Adiciona evento de clique ao botão de reiniciar
    document.getElementById("restart-button").addEventListener("click", function() {
        window.location.href = "./TelaJogo.html";
    });

    // Adiciona evento de clique ao botão de sair
    document.getElementById("exit-button").addEventListener("click", function() {
        window.location.href = "./TelaLogin.html";
    });
});

// Variáveis simulando as informações atuais do usuário
let nomeAtual = "Neymar Junior";
let emailAtual = "neymar.njr@gmail.com";
let dataNascimentoAtual = "1992-02-05";
let cpfAtual = "123.456.789-00";
let telefoneAtual = "5511887654567";
let nomeUsuarioAtual = "NJR";

// Função para carregar as informações atuais no formulário
function carregarInformacoesAtuais() {
    document.getElementById("namebox").value = nomeAtual;
    document.getElementById("emailbox").value = emailAtual;
    document.getElementById("birthdaybox").value = dataNascimentoAtual;
    document.getElementById("cpfbox").value = cpfAtual;
    document.getElementById("telefonebox").value = telefoneAtual;
    document.getElementById("usernamebox").value = nomeUsuarioAtual;
}

// Função para validar os campos
function validarEntradas() {
    const nome = document.getElementById("namebox").value;
    const email = document.getElementById("emailbox").value;
    const cpf = document.getElementById("cpfbox").value;
    const telefone = document.getElementById("telefonebox").value;
    const nomeUsuario = document.getElementById("usernamebox").value;
    const senha = document.getElementById("passwordbox").value;
    const confirmarSenha = document.getElementById("confirmpasswordbox").value;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!nome || !email || !cpf || !telefone || !nomeUsuario) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return false;
    }

    // Verifica se o e-mail tem um formato válido
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert("Por favor, insira um e-mail válido.");
        return false;
    }

    // Verifica se as senhas coincidem, se forem preenchidas
    if (senha || confirmarSenha) {
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem.");
            return false;
        }
    }

    // Verifica se o CPF tem o formato esperado (simples validação de formato)
    const regexCPF = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    if (!regexCPF.test(cpf)) {
        alert("Por favor, insira um CPF válido no formato XXX.XXX.XXX-XX.");
        return false;
    }

    // Verifica se o telefone está no formato esperado
    const regexTelefone = /^\d{13}$/; // Exemplo de formato de telefone com 13 dígitos
    if (!regexTelefone.test(telefone)) {
        alert("Por favor, insira um número de telefone válido com 13 dígitos, incluindo o código do país.");
        return false;
    }

    return true; // Se tudo estiver válido
}

// Função para salvar as novas informações e atualizar as variáveis
function salvarAlteracoes(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    // Valida as entradas antes de salvar
    if (!validarEntradas()) {
        return; // Se a validação falhar, não salva as alterações
    }

    // Atualiza as variáveis com os novos valores inseridos pelo usuário
    nomeAtual = document.getElementById("namebox").value;
    emailAtual = document.getElementById("emailbox").value;
    dataNascimentoAtual = document.getElementById("birthdaybox").value;
    cpfAtual = document.getElementById("cpfbox").value;
    telefoneAtual = document.getElementById("telefonebox").value;
    nomeUsuarioAtual = document.getElementById("usernamebox").value;

    // Exibe uma mensagem de confirmação (simulando salvamento)
    alert("Informações salvas com sucesso!");

    // Redireciona para a TelaJogo após a confirmação
    window.location.href = "TelaJogo.html"; // Aqui você coloca o caminho correto para a TelaJogo
}

// Chama a função carregar as informações assim que a página carregar
window.onload = carregarInformacoesAtuais;
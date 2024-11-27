"use strict";

let timerInterval;
let elapsedTime = 0;
let remainingTime = 0;
let rivotrilMode = false;
let numBombs = 0;
let rows = 0;
let cols = 0;
let victoryMark = false;


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

function revealCell(element, row, col, bombs) {
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
            propagateReveal(element, row, col, bombs);
        }

        if (document.querySelectorAll('td.square-escondido').length === document.querySelectorAll('td[data-bomb="true"]').length) {
            if(!victoryMark){
                victory(); 
            }
        }
    }
}

function victory() {
    victoryMark = true;
    alert('Parabéns! Você venceu o jogo!');
    endGame();
}

function propagateReveal(element, row, col, bombs) {
    const [rowS, colS] = element.dataset.position.split(',').map(Number);
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = rowS + i;
            const newCol = colS + j;
            if (newRow >= 0 && newRow < row && newCol >= 0 && newCol < col) {
                const neighbor = document.querySelector(`td[data-position="${newRow},${newCol}"]`);
                if (neighbor && neighbor.classList.contains('square-escondido')) {
                    revealCell(neighbor, row, col, bombs);
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
            const [row, col] = gameSizeInput.split('x').map(Number);
            const bombs = new Set(Array.from(document.querySelectorAll('[data-bomb="true"]')).map(el => el.dataset.position));
            revealCell(square, row, col, bombs);
        });
    });
}

function startGame() {



    const startButton = document.getElementById('botaoInicio');
    const rivotrilToggle = document.getElementById('botaoRivotril');
    victoryMark = false;

    if(startButton){
        startButton.addEventListener('click', function() {
            const gameSizeInput = document.getElementById('tamanhoJogo').value;
            [rows, cols] = gameSizeInput.split('x').map(Number);
            numBombs = parseInt(document.getElementById('botaoBomba').value, 10);
    
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
    }
    if(rivotrilToggle){
        rivotrilToggle.addEventListener('click', function() {
            rivotrilMode = !rivotrilMode;
            rivotrilToggle.style.backgroundColor = rivotrilMode ? 'green' : '';
        });
    }   
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

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Partida.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if(response.sucess){
                window.location.href = "./TelaFimDeJogo.php";
            } else {
                alert(response.error || "Erro no servidor, partida não salva!");
            }
        }
    };
    let pontos = 0;
    if(victoryMark){
        if(rivotrilMode){
            pontos = (numBombs*10 + ((rows*cols)-remainingTime))*2;
        }
        else {
            pontos = (numBombs*10) - (elapsedTime*0.05);
        }
    }
    const params = "dimensions=" + encodeURIComponent(rows + "x" + cols) + "&bombqtd=" + encodeURIComponent(numBombs) + "&modality=" + encodeURIComponent(rivotrilMode ? "rivotril" : "normal") 
    + "&time=" + encodeURIComponent(Math.floor(elapsedTime/3600) +":"+ Math.floor(elapsedTime/60)+ ":"+(elapsedTime%60)) + "&result=" + encodeURIComponent(victoryMark ? 'vitoria' : 'derrota') + "&points=" + encodeURIComponent(pontos); // Formato query string
    xhr.send(params);

    clearInterval(timerInterval);
}

window.onload = startGame;

const containsLetters = (str) => /[a-zA-Z]/.test(str);

function validateLoginInput(event){
        event.preventDefault();
    
        const xhr = new XMLHttpRequest();
        const form = document.getElementById('loginForm');
        const formData = new FormData(form);
    
        xhr.open('POST', 'Login.php', true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    window.location.href = './TelaJogo.php';
                } else {
                    alert(response.error || 'Erro ao fazer login.');
                }
            } else {
                alert('Erro na requisição. Tente novamente.');
            }
        };
    
        xhr.onerror = function () {
            alert('Erro na conexão.');
        };
    
        xhr.send(formData);
}

function validateRegisterInput(event){

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
    if(containsLetters(cpf) || cpf.includes("-") || cpf.includes(".")  ){
        alert("Não inclua caracteres no CPF!");
        return false;
    }
    if(containsLetters(telefone) || telefone.includes("+") || telefone.includes("-") || telefone.includes(" ")){
        alert("Telefone inválido, não inclua caracteres!");
        return false;
    }

    event.preventDefault();
    
    const xhr = new XMLHttpRequest();
    const form = document.getElementById('registerForm');
    const formData = new FormData(form);

    xhr.open('POST', 'Cadastro.php', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            if (response.success) {
                window.location.href = './TelaLogin.html';
            } else {
                alert(response.error || 'Erro ao cadastrar');
            }
        } else {
            alert('Erro na requisição. Tente novamente.');
        }
    };
    
    xhr.onerror = function () {
        alert('Erro na conexão.');
    };
    
    xhr.send(formData);
}

document.addEventListener("DOMContentLoaded", function() {
    const restartButton = document.getElementById("restart-button");
    if(restartButton){
        restartButton.addEventListener("click", function() {
            window.location.href = "./TelaJogo.php";
        });
    }

    const exitButton = document.getElementById("exit-button");
    if(exitButton){
        exitButton.addEventListener("click", function() {
            if(window.location.pathname == "/ProjetoProgWeb/TelaFimDeJogo.php"){
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'Sair.php', true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        if(!response.sucess){
                            window.location.href = "./TelaLogin.html";
                        } else {
                            window.location.href = "./TelaJogo.php";
                        }
                    }
                };

                xhr.send('');
            } else {
                if(window.location.href == "/ProjetoProgWeb/TelaDeRanking.php"){
                    window.location.href = "./TelaJogo.php";
                }
            }    
        });
    }
    if(window.location.pathname !== "/ProjetoProgWeb/TelaLogin.html" && window.location.pathname !== "/ProjetoProgWeb/TelaCadastro.html"){
        verifyLogin();
    }
    const historic = document.getElementById("historico");
    if(historic !== null){
        drawHistoric(historic);
    }
    if(window.location.pathname === "/ProjetoProgWeb/TelaRanking.php"){
        drawRanking();
    }
    if(window.location.pathname === "/ProjetoProgWeb/TelaEditarInfo.php"){
        informacoesAtuais();
    }

    
});

function drawHistoric(historic){

        const xhr = new XMLHttpRequest();
    
        xhr.open('POST', 'Historico.php', true);
    
        xhr.onload = function () {
            if (xhr.status === 200) {
                
                    const data = JSON.parse(xhr.responseText);
    
                    
                    if (!data.sucess) {
                        historic.innerHTML = `<p>Erro: ${data.error}</p>`;
                        return;
                    }
                    let html;
                    if(!data.vazio){
                        html = `<p>Histórico</p><br><p>Nome do player: ${data.partida[0].nome}</p><table>`;
                        html += `
                            <tr>
                                <th>Dimensões</th>
                                <th>Bombas</th>
                                <th>Modalidade</th>
                                <th>Tempo (h:m:s)</th>
                                <th>Resultado</th>
                                <th>Data/Hora</th>
                            </tr>
                        `;
                        data.partida.forEach(partida => {
                            html += `
                                <tr>
                                    <td>${partida.dimensoes}</td>
                                    <td>${partida.qtdbombas}</td>
                                    <td>${partida.modalidade}</td>
                                    <td>${partida.tempo}</td>
                                    <td>${partida.resultado}</td>
                                    <td>${partida.dthora}</td>
                                </tr>
                            `;
                        });
                        html += '</table>';
                        
                    } else {
                        html = `<p>Histórico</p><br><table>
                            <td>Sem partidas</td>
                        </table>`;
                    }
                    historic.innerHTML = html;
            } else {
                historic.innerHTML = `<p>Erro ao carregar os resultados. Código: ${xhr.status}</p>`;
            }
        };
    
        xhr.onerror = function () {
            historic.innerHTML = `<p>Erro ao fazer a requisição.</p>`;
        };
    
        xhr.send();

}

function verifyLogin(){
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'Verify.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if(!response.sucess){
                    alert("Usuário não autenticado");
                    window.location.href = "./TelaLogin.html";
                } 
            }
        };
        xhr.send('');
}

function drawRanking(){

    const ranking = document.getElementById("ranking");
    if(!ranking){
        return;
    }

    const xhr = new XMLHttpRequest();
    
        xhr.open('POST', 'RankingGlobal.php', true);
    
        xhr.onload = function () {
            if (xhr.status === 200) {
                
                    const data = JSON.parse(xhr.responseText);
    
                    
                    if (!data.sucess) {
                        ranking.innerHTML = `<p>Erro: ${data.error}</p>`;
                        return;
                    }
    
                    let html = `<table>`;
                    html += `
                        <tr>
                            <th>Colocação</th>
                            <th>Nome</th>
                            <th>Pontos</th>
                        </tr>
                    `;
                    let index = 1;
                    data.partida.forEach(partida => {
                        html += `
                            <tr>
                                <td>${index}º</td>
                                <td>${partida.nome}</td>
                                <td>${partida.pontos}</td>
                            </tr>
                        `;
                        index++;
                    });
    
                    html += '</table>';
                    ranking.innerHTML = html;
                
            } else {
                ranking.innerHTML = `<p>Erro ao carregar os resultados. Código: ${xhr.status}</p>`;
            }
        };
    
        xhr.onerror = function () {
            historic.innerHTML = `<p>Erro ao fazer a requisição.</p>`;
        };
    
        xhr.send();
}

function validarEntradas() {
    const nome = document.getElementById("namebox").value;
    const email = document.getElementById("emailbox").value;
    const cpf = document.getElementById("cpfbox").value;
    const telefone = document.getElementById("telefonebox").value;
    const nomeUsuario = document.getElementById("usernamebox").value;
    const senha = document.getElementById("passwordbox").value;
    const confirmarSenha = document.getElementById("confirmpasswordbox").value;

    if (!nome || !email || !cpf || !telefone || !nomeUsuario) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return false;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert("Por favor, insira um e-mail válido.");
        return false;
    }

    if (senha || confirmarSenha) {
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem.");
            return false;
        }
    }

    if(containsLetters(cpf) || cpf.includes("-") || cpf.includes(".")){
        alert("Não inclua caracteres no CPF!");
        return false;
    }
    if(containsLetters(telefone) || telefone.includes("+") || telefone.includes("-") || telefone.includes(" ")){
        alert("Telefone inválido, não inclua caracteres!");
        return false;
    }
    return true;
}

function salvarAlteracoes(event) {
    event.preventDefault();

    if (!validarEntradas()) {
        return;
    }

    event.preventDefault();
    
    const xhr = new XMLHttpRequest();
    const form = document.getElementById('editForm');
    const formData = new FormData(form);

    xhr.open('POST', 'SalvarInfoNova.php', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                console.log(response.newuser);
                window.location.href = './TelaJogo.php';
            } else {
                console.log(response);
                alert(response.error || "Erro ao atualizar informações");
            }
        } else {
            alert('Erro na requisição. Tente novamente.');
        }
    };
    
    xhr.onerror = function () {
        alert('Erro na conexão.');
    };
    
    xhr.send(formData);

}

function informacoesAtuais(){
    const xhr = new XMLHttpRequest();
    
        xhr.open('POST', 'EditarInfo.php', true);
    
        xhr.onload = function () {
            if (xhr.status === 200) {
                
                    const data = JSON.parse(xhr.responseText);
    
                    
                    if (!data.sucess) {
                        return;
                    }
                    document.getElementById("namebox").value = data.info[0].nome;
                    document.getElementById("emailbox").value = data.info[0].email;
                    document.getElementById("birthdaybox").value = data.info[0].dtnasc;
                    document.getElementById("cpfbox").value = data.info[0].cpf;
                    document.getElementById("telefonebox").value = data.info[0].telefone;
                    document.getElementById("usernamebox").value = data.info[0].usuario;
                
            } else {
                alert("Erro no servidor");
            }
        };
    
        xhr.onerror = function () {
            alert("Erro carregando informações do player atual!");
        };
    
        xhr.send();

}
let timerInterval;
let tempoPassado = 0;
let tempoRestante = 0;

function iniciarContagemTempo() {
    const botaoTempo = document.querySelector('.Button.tempo');
    tempoPassado = 0; 
    clearInterval(timerInterval); 

    timerInterval = setInterval(() => {
        tempoPassado++;
        const minutos = Math.floor(tempoPassado / 60);
        const segundos = tempoPassado % 60;
        botaoTempo.textContent = `${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
    }, 1000);
}

function iniciarContagemRegressiva(duracao) {
    const botaoTempo = document.querySelector('.Button.tempo');
    tempoRestante = duracao;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        tempoRestante--;
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        botaoTempo.textContent = `${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
        
        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            alert('O tempo acabou! Você perdeu.');
            finalizarJogo(); 
        }
    }, 1000);
}

function gerarBombas(numBombas, linhas, colunas) {
    const bombas = new Set()
    while (bombas.size < numBombas) {
        const linhaAleatoria = Math.floor(Math.random() * linhas);
        const colunaAleatoria = Math.floor(Math.random() * colunas);
        const posicao = `${linhaAleatoria},${colunaAleatoria}`;
        bombas.add(posicao);
    }
    return bombas;
}

function contarBombasAdjacentes(linha, coluna, linhas, colunas, bombas) {
    let bombasAdjacentes = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const novaLinha = linha + i;
            const novaColuna = coluna + j;
            const posicao = `${novaLinha},${novaColuna}`;
            if (novaLinha >= 0 && novaLinha < linhas && novaColuna >= 0 && novaColuna < colunas) {
                if (bombas.has(posicao)) {
                    bombasAdjacentes++;
                }
            }
        }
    }
    return bombasAdjacentes;
}

function criarTabuleiro(linhas, colunas, bombas) { 
    const Tabuleiro = document.getElementById('tableJogo');
    Tabuleiro.innerHTML = ''; 
    for (let i = 0; i < linhas; i++) {
        const linha = document.createElement('tr');
        for (let n = 0; n < colunas; n++) {
            const coluna = document.createElement('td');
            coluna.classList.add('squareEscondido');
            coluna.dataset.posicao = `${i},${n}`;
            linha.appendChild(coluna);
            const posicao = `${i},${n}`;
            if (bombas.has(posicao)) {
                coluna.dataset.bomba = true; 
            } else {
                const bombasAdjacentes = contarBombasAdjacentes(i, n, linhas, colunas, bombas);
                coluna.dataset.bombasAdjacentes = bombasAdjacentes;
            }
        }
        Tabuleiro.appendChild(linha); 
    }
}

function revelarCelula(elemento, linhas, colunas, bombas) {
    if (!elemento.classList.contains('squareEscondido')) {
        return;
    }
    elemento.classList.remove('squareEscondido');
    if (elemento.dataset.bomba) {
        elemento.classList.add('squareBomba'); 
        elemento.textContent = '💣';
        alert('Você clicou em uma bomba! Você perdeu.');
        finalizarJogo(); 
    } else {
        const bombasAdjacentes = parseInt(elemento.dataset.bombasAdjacentes, 10);
        if (bombasAdjacentes > 0) {
            elemento.textContent = bombasAdjacentes;
        } else {
            elemento.classList.add('squareSemNada');
            propagarRevelacao(elemento, linhas, colunas, bombas);
        }
    }
}

function propagarRevelacao(elemento, linhas, colunas, bombas) {
    const [linha, coluna] = elemento.dataset.posicao.split(',').map(Number);
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const novaLinha = linha + i;
            const novaColuna = coluna + j;
            if (novaLinha >= 0 && novaLinha < linhas && novaColuna >= 0 && novaColuna < colunas) {
                const vizinho = document.querySelector(`td[data-posicao="${novaLinha},${novaColuna}"]`);
                if (vizinho && vizinho.classList.contains('squareEscondido')) {
                    revelarCelula(vizinho, linhas, colunas, bombas);
                }
            }
        }
    }
}

function configurarJogo() {
    const quadrados = document.querySelectorAll('td');
    quadrados.forEach(quadrado => {
        quadrado.addEventListener('click', function() {
            const InputTamanhoJogo = document.getElementById('tamanhoJogo').value;
            const [linhas, colunas] = InputTamanhoJogo.split('x').map(Number);
            const bombas = new Set(Array.from(document.querySelectorAll('[data-bomba="true"]')).map(el => el.dataset.posicao));
            revelarCelula(quadrado, linhas, colunas, bombas);
        });
    });
}

function modoTrapaca() {
    const quadrados = document.querySelectorAll('td.squareEscondido');
    
    quadrados.forEach(quadrado => {
        if (quadrado.dataset.bomba) {
            quadrado.textContent = '💣';
        } else {
            const bombasAdjacentes = quadrado.dataset.bombasAdjacentes;
            quadrado.textContent = bombasAdjacentes > 0 ? bombasAdjacentes : '';
        }
    });

    setTimeout(() => {
        quadrados.forEach(quadrado => {
            quadrado.textContent = ''; 
        });
    }, 2000); 
}

function iniciarJogo() {
    const botaoInicio = document.getElementById('botaoInicio');
    const botaoTrapaca = document.querySelector('.Button[style*="rgb(0, 212, 11)"]');
    const botaoRivotril = document.getElementById('botaoRivotril');
    
    botaoInicio.addEventListener('click', function() {
        const InputTamanhoJogo = document.getElementById('tamanhoJogo').value;
        const [linhas, colunas] = InputTamanhoJogo.split('x').map(Number);
        const numBombas = parseInt(document.getElementById('botaoBomba').value, 10);

        if (isNaN(linhas) || isNaN(colunas) || isNaN(numBombas)) {
            alert('Por favor, insira um valor válido para o tamanho do jogo.');
            return;
        }

        const bombas = gerarBombas(numBombas, linhas, colunas); 
        criarTabuleiro(linhas, colunas, bombas); 
        configurarJogo();
        iniciarContagemTempo();
        botaoInicio.style.backgroundColor = '#8B0000';
        botaoInicio.disabled = true;
    });

    botaoTrapaca.addEventListener('click', modoTrapaca);

    botaoRivotril.addEventListener('click', function() {
        const InputTamanhoJogo = document.getElementById('tamanhoJogo').value;
        const [linhas, colunas] = InputTamanhoJogo.split('x').map(Number);
        const numBombas = parseInt(document.getElementById('botaoBomba').value, 10);
        const tempoMaximo = linhas * colunas; 

        if (isNaN(linhas) || isNaN(colunas) || isNaN(numBombas)) {
            alert('Por favor, insira um valor válido para o tamanho do jogo.');
            return;
        }

        const bombas = gerarBombas(numBombas, linhas, colunas); 
        criarTabuleiro(linhas, colunas, bombas); 
        configurarJogo();
        iniciarContagemRegressiva(tempoMaximo); 
        botaoRivotril.style.backgroundColor = '#8B0000';
        botaoRivotril.disabled = true;
    });
}

function finalizarJogo() {
    clearInterval(timerInterval);
    alert("Fim de jogo!"); 
    document.getElementById('botaoInicio').disabled = false;
    document.getElementById('botaoRivotril').disabled = false;
}

window.onload = iniciarJogo;
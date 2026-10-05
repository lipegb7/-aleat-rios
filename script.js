let saldo = 1000;
let numeroSelecionado = null;

const saldoElement = document.getElementById("saldo");
const numeroSorteado = document.getElementById("numeroSorteado");
const valorAposta = document.getElementById("valorAposta");
const apostarBtn = document.getElementById("apostarBtn");
const mensagem = document.getElementById("mensagem");
const historicoLista = document.getElementById("historicoLista");

const botoesNumeros = document.querySelectorAll(".numeros button");


// ==============================
// ESCOLHER NÚMERO
// ==============================

botoesNumeros.forEach(botao => {

    botao.addEventListener("click", () => {

        botoesNumeros.forEach(b => {
            b.classList.remove("selecionado");
        });

        botao.classList.add("selecionado");

        numeroSelecionado = Number(botao.dataset.numero);

        mensagem.textContent =
            `Número ${numeroSelecionado} selecionado. Agora escolha o valor da aposta.`;

        mensagem.className = "mensagem";
    });

});


// ==============================
// FAZER APOSTA
// ==============================

apostarBtn.addEventListener("click", () => {

    if (numeroSelecionado === null) {

        mostrarMensagem(
            "Escolha um número antes de apostar!",
            "erro"
        );

        return;
    }

    const aposta = Number(valorAposta.value);

    if (!Number.isFinite(aposta) || aposta < 10) {

        mostrarMensagem(
            "O valor mínimo da aposta virtual é 10 créditos.",
            "erro"
        );

        return;
    }

    if (aposta > saldo) {

        mostrarMensagem(
            "Você não possui créditos suficientes.",
            "erro"
        );

        return;
    }


    // Desconta a aposta
    saldo -= aposta;

    atualizarSaldo();


    // Gera número aleatório entre 1 e 10
    const sorteado = Math.floor(Math.random() * 10) + 1;


    // Mostra o resultado
    numeroSorteado.textContent = sorteado;


    // Pequeno atraso visual
    apostarBtn.disabled = true;

    setTimeout(() => {

        verificarResultado(
            sorteado,
            aposta
        );

        apostarBtn.disabled = false;

    }, 500);

});


// ==============================
// VERIFICAR RESULTADO
// ==============================

function verificarResultado(sorteado, aposta) {

    if (sorteado === numeroSelecionado) {

        // Multiplicador de 10x
        const premio = aposta * 10;

        saldo += premio;

        atualizarSaldo();

        mostrarMensagem(
            `🎉 ACERTOU! Você ganhou ${premio} créditos!`,
            "sucesso"
        );

        adicionarHistorico(
            numeroSelecionado,
            sorteado,
            aposta,
            premio,
            true
        );

    } else {

        mostrarMensagem(
            `❌ Não foi dessa vez! O número sorteado foi ${sorteado}.`,
            "erro"
        );

        adicionarHistorico(
            numeroSelecionado,
            sorteado,
            aposta,
            0,
            false
        );

    }


    // Limpa seleção
    numeroSelecionado = null;

    botoesNumeros.forEach(botao => {
        botao.classList.remove("selecionado");
    });


    // Verifica se ficou sem créditos
    if (saldo <= 0) {

        setTimeout(() => {

            mostrarMensagem(
                "💸 Seus créditos acabaram. Recarregando créditos virtuais...",
                "erro"
            );

            setTimeout(() => {

                saldo = 1000;

                atualizarSaldo();

                mostrarMensagem(
                    "🔄 Você recebeu 1000 créditos virtuais novamente!",
                    "sucesso"
                );

            }, 2000);

        }, 500);

    }

}


// ==============================
// ATUALIZAR SALDO
// ==============================

function atualizarSaldo() {

    saldoElement.textContent = saldo.toLocaleString("pt-BR");

}


// ==============================
// MENSAGENS
// ==============================

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    mensagem.className = `mensagem ${tipo}`;

}


// ==============================
// HISTÓRICO
// ==============================

function adicionarHistorico(
    escolhido,
    sorteado,
    aposta,
    premio,
    ganhou
) {

    const vazio = document.querySelector(".vazio");

    if (vazio) {
        vazio.remove();
    }


    const item = document.createElement("div");

    item.classList.add(
        "historico-item",
        ganhou ? "ganhou" : "perdeu"
    );


    if (ganhou) {

        item.innerHTML = `
            <div>
                <strong>🎯 Número ${escolhido}</strong>
                <br>
                <small>
                    Sorteado: ${sorteado} |
                    Aposta: ${aposta} 🪙
                </small>
            </div>

            <div class="ganhou-texto">
                +${premio} 🪙
            </div>
        `;

    } else {

        item.innerHTML = `
            <div>
                <strong>🎯 Número ${escolhido}</strong>
                <br>
                <small>
                    Sorteado: ${sorteado} |
                    Aposta: ${aposta} 🪙
                </small>
            </div>

            <div class="perdeu-texto">
                -${aposta} 🪙
            </div>
        `;

    }


    historicoLista.prepend(item);

}

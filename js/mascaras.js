
// Máscaras de entrada
// INÍCIO ###################################################
function aplicarMascaras() {
    // Máscara para CPF
    const cpfInput = document.querySelector("input[name='cpf']");
    if (cpfInput) {
        Inputmask("999.999.999-99").mask(cpfInput);
    }

    // Máscara para telefone
    const telefoneInput = document.querySelector("#telefone-aluno");
    if (telefoneInput) {
        Inputmask("(99) 99999-9999").mask(telefoneInput);
    }

    // Máscara para CEP
    const cepInput = document.querySelector("input[name='cep']");
    if (cepInput) {
        Inputmask("99999-999").mask(cepInput);
    }

    // Máscara para data de vencimento
    const vencimentoInput = document.querySelector("input[name='vencimento']");
    if (vencimentoInput) {
        Inputmask("99/99/9999").mask(vencimentoInput);
    }
}


function formatarValor(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    if (valor.length > 0) {
        valor = (parseInt(valor) / 100).toFixed(2).replace('.', ','); // Converte para centavos e formata
        valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona os pontos a cada 3 dígitos
        input.value = 'R$ ' + valor; // Adiciona o símbolo da moeda
    } else {
        input.value = ''; // Caso o campo esteja vazio
    }
}
// ## FINAL Máscaras de entrada #################################

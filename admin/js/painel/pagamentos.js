// PAGAMENTOS
// INÍCIO ###################################################
// Função para carregar os pagamentos
function loadPagamentos() {
    db.collection("pagamentos").get().then((querySnapshot) => {
        const pagamentosContainer = document.querySelector("#pagamentos .data-table tbody");
        pagamentosContainer.innerHTML = ''; // Limpar conteúdo anterior

        querySnapshot.forEach(doc => {
            const pagamento = doc.data();
            const pagamentoItem = document.createElement("tr");

            pagamentoItem.innerHTML = `
                    <td style="text-align: center;">${pagamento.matricula}</td>
                    <td>${pagamento.aluno}</td>
                    <td style="text-align: center;">R$ ${pagamento.valor.toFixed(2)}</td>
                    <td style="text-align: center;">${pagamento.vencimento.toDate().toLocaleDateString()}</td>
                    <td style="text-align: center;"><span class="status-badge ${pagamento.status}">${pagamento.status}</span></td>
                    <td style="text-align: center;">${pagamento.metodo}</td>
                    <td style="text-align: center;">
                        <button class="btn-action edit" title="Editar" data-id="${doc.id}" onclick="editPagamento('${doc.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action delete" title="Excluir" data-id="${doc.id}" onclick="deletePagamento('${doc.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
            pagamentosContainer.appendChild(pagamentoItem);
        });
    });
}

// Função para adicionar um novo pagamento
document.getElementById("add-pagamento-btn").addEventListener("click", () => {
    const modal = document.getElementById("modal-pagamento");
    modal.classList.add("active");
    // Carregar os alunos no dropdown ao abrir o modal
    dropAlunos(db);
});

// Função para salvar o pagamento no Firestore
document.querySelector("#modal-pagamento form").addEventListener("submit", function (event) {
    event.preventDefault();

    const pagamento = {
        aluno: event.target.alunoId.options[event.target.alunoId.selectedIndex].text, // Obter o nome do aluno selecionado
        valor: parseFloat(event.target.valor.value.replace('R$ ', '').replace('.', '').replace(',', '.')), // Converte o valor para número
        vencimento: firebase.firestore.Timestamp.fromDate(new Date(event.target.vencimento.value)),
        status: 'pendente', // Status padrão como "pendente"
        metodo: event.target.metodo.value,
        observacoes: event.target.observacoes.value,
        // matricula: generateMatriculaPagamento(), // Gerar matrícula para pagamento, se necessário
        dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection("pagamentos").add(pagamento)
        .then(() => {
            alert("Pagamento cadastrado com sucesso!");
            loadPagamentos(); // Recarregar a lista de pagamentos
            document.getElementById("modal-pagamento").classList.remove("active");
            document.querySelector("#modal-pagamento form").reset();
        })
        .catch(error => {
            console.error("Erro ao cadastrar pagamento: ", error);
        });
});

// Função para editar um pagamento
function editPagamento(pagamentoId) {
    const modal = document.getElementById("modal-pagamento");
    modal.classList.add("active");

    db.collection("pagamentos").doc(pagamentoId).get().then(doc => {
        if (doc.exists) {
            const pagamento = doc.data();
            document.querySelector("select[name='alunoId']").value = pagamento.alunoId;
            document.querySelector("input[name='valor']").value = pagamento.valor;
            document.querySelector("input[name='vencimento']").value = pagamento.vencimento.toDate().toISOString().split('T')[0];
            document.querySelector("select[name='metodo']").value = pagamento.metodo;
            document.querySelector("textarea[name='observacoes']").value = pagamento.observacoes;
        }
    });
}

// Função para excluir um pagamento
function deletePagamento(pagamentoId) {
    if (confirm("Tem certeza que deseja excluir este pagamento?")) {
        db.collection("pagamentos").doc(pagamentoId).delete()
            .then(() => {
                alert("Pagamento excluído com sucesso!");
                loadPagamentos(); // Recarregar a lista de pagamentos
            })
            .catch(error => {
                console.error("Erro ao excluir pagamento: ", error);
            });
    }
}

// Função para gerar um código de pagamento (caso seja necessário)
function generateMatriculaPagamento() {
    return 'PGT' + Math.floor(Math.random() * 1000000);
}
// FINAL ###################################################

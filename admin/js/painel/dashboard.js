        // DASHBOARD
        // INÍCIO ###################################################
        // Função para carregar os dados do Firestore
        function loadDashboardData() {

            // Log do localStorage para verificar os dados armazenados
            console.log("Dados armazenados no localStorage:");
            console.log("Nome: ", localStorage.getItem('nomeUsuario'));
            console.log("Email: ", localStorage.getItem('emailUsuario'));
            console.log("Função: ", localStorage.getItem('funcaoUsuario'));

            // Referência à coleção de alunos
            db.collection("alunos").get().then((querySnapshot) => {
                let totalAlunos = querySnapshot.size;
                document.getElementById('total-alunos').textContent = totalAlunos;

                let alunosAtivos = querySnapshot.docs.filter(doc => doc.data().status === 'ativo').length;
                document.getElementById('alunos-ativos').textContent = alunosAtivos;
            });

            // Referência à coleção de pagamentos
            db.collection("pagamentos").get().then((querySnapshot) => {
                let receitaMensal = querySnapshot.docs.reduce((total, doc) => total + doc.data().valor, 0);
                document.getElementById('receita-mensal').textContent = `R$ ${receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                let pagamentosPendentes = querySnapshot.docs.filter(doc => doc.data().status === 'pendente').length;
                document.getElementById('pagamentos-pendentes').textContent = pagamentosPendentes;
            });
        }

        // Função para carregar os alunos mais recentes
        function loadRecentAlunos() {
            db.collection("alunos").orderBy("dataCadastro", "desc").limit(5).get().then((querySnapshot) => {
                const alunosContainer = document.getElementById("recent-alunos");
                alunosContainer.innerHTML = ''; // Limpar conteúdo anterior
                querySnapshot.forEach(doc => {
                    const aluno = doc.data();
                    const alunoItem = document.createElement("div");
                    alunoItem.classList.add("recent-item");
                    alunoItem.innerHTML = `
                    <div class="item-info">
                        <strong>${aluno.nome}</strong>
                        <span>${aluno.email}</span>
                    </div>
                    `;
                    alunosContainer.appendChild(alunoItem);
                });
            });
        }
        // FIM ###################################################

// Função para carregar os alunos no dropdown de seleção
function dropAlunos(db) {
    const alunoSelect = document.querySelector("select[name='alunoId']"); // Seleciona o dropdown dos alunos

    db.collection("alunos").get().then((querySnapshot) => {
        // Limpar o dropdown antes de adicionar as opções
        alunoSelect.innerHTML = '<option value="">Selecione um Aluno</option>';

        // Criar um array para armazenar os alunos
        const alunos = [];

        querySnapshot.forEach(doc => {
            const aluno = doc.data();
            alunos.push({ id: doc.id, nome: aluno.nome }); // Armazenar o ID e nome do aluno
        });

        // Ordenar os alunos por nome de forma alfabética (A-Z)
        alunos.sort((a, b) => a.nome.localeCompare(b.nome));

        // Preencher o dropdown com os alunos ordenados
        alunos.forEach(aluno => {
            const option = document.createElement("option");
            option.value = aluno.id; // Usa o ID do aluno como valor
            option.textContent = aluno.nome; // Mostra o nome do aluno no dropdown

            alunoSelect.appendChild(option); // Adiciona a opção no dropdown
        });
    }).catch(error => {
        console.error("Erro ao carregar alunos: ", error);
    });
}
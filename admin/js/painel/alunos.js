// ALUNOS
// INÍCIO ###################################################
// Função para carregar os alunos
function loadAlunos() {
    db.collection("alunos").get().then((querySnapshot) => {
        const alunosContainer = document.querySelector(".data-table tbody");
        alunosContainer.innerHTML = ''; // Limpar conteúdo anterior

        querySnapshot.forEach(doc => {
            const aluno = doc.data();
            const alunoItem = document.createElement("tr");

            alunoItem.innerHTML = `
                    <td style="text-align: center;">${aluno.matricula}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.email}</td>
                    <td style="text-align: center;">${aluno.telefone}</td>
                    <td style="text-align: center;">${aluno.plano}</td>
                    <td><span class="status-badge ${aluno.status}">${aluno.status}</span></td>
                    <td style="text-align: center;">
                        <button class="btn-action edit" title="Editar" data-id="${doc.id}" onclick="editAluno('${doc.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                `;
            alunosContainer.appendChild(alunoItem);
        });
    });
}

// Função para adicionar um novo aluno
document.getElementById("add-aluno-btn").addEventListener("click", () => {
    const modal = document.getElementById("modal-aluno");
    modal.classList.add("active");
});

// Função para salvar o aluno no Firestore
document.querySelector("#modal-aluno form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Verifica se o CPF já está cadastrado na coleção "alunos"
    db.collection("alunos").where("cpf", "==", event.target.cpf.value).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                alert("CPF já cadastrado.");
            } else {
                // CPF não existe, então cria o novo aluno

                // Espera pela matrícula única antes de prosseguir
                generateMatricula().then((matricula) => {
                    const aluno = {
                        nome: event.target.nome.value,
                        cpf: event.target.cpf.value,
                        email: event.target.email.value,
                        telefone: event.target.telefone.value,
                        dataNascimento: event.target.dataNascimento.value,
                        endereco: event.target.endereco.value,
                        numero: event.target.complemento.value,
                        complemento: event.target.complemento.value,
                        bairro: event.target.bairro.value,
                        cidade: event.target.cidade.value,
                        estado: event.target.estado.value,
                        cep: event.target.cep.value,
                        plano: event.target.plano.value,
                        vencimento: event.target.vencimento.value,
                        status: 'ativo',
                        matricula: matricula, // Matrícula agora é garantidamente única
                        dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
                    };

                    // Cadastro do aluno no Firestore
                    db.collection("alunos").add(aluno)
                        .then((docRef) => {
                            // Verificar se o e-mail já está cadastrado no Firebase Authentication
                            firebase.auth().fetchSignInMethodsForEmail(aluno.email)
                                .then((methods) => {
                                    if (methods.length > 0) {
                                        // O e-mail já está registrado, não vamos criar novamente
                                        alert("Este e-mail já está associado a uma conta.");
                                    } else {
                                        // O e-mail não está registrado, criar um novo usuário
                                        firebase.auth().createUserWithEmailAndPassword(aluno.email, "senhaTemporaria")
                                            .then((userCredential) => {
                                                const user = userCredential.user;

                                                // Enviar e-mail de redefinição de senha
                                                firebase.auth().sendPasswordResetEmail(aluno.email)
                                                    .then(() => {
                                                        alert("Cadastro realizado com sucesso! Um e-mail foi enviado para o endereço de e-mail do usuário.");
                                                    })
                                                    .catch((error) => {
                                                        console.error("Erro ao enviar e-mail de redefinição de senha:", error);
                                                    });
                                            })
                                            .catch((error) => {
                                                // Aqui tratamos outros erros ao tentar criar o usuário
                                                if (error.code === 'auth/email-already-in-use') {
                                                    alert("Este e-mail existente. O aluno foi associado a este.");
                                                    alert("Aluno Cadastrado com Sucesso.");
                                                } else if (error.code === 'auth/invalid-email') {
                                                    alert("E-mail inválido.");
                                                } else if (error.code === 'auth/weak-password') {
                                                    alert("A senha deve ter pelo menos 6 caracteres.");
                                                } else {
                                                    console.error("Erro ao criar usuário no Firebase:", error);
                                                }
                                            });
                                    }

                                    // Fechar o modal e resetar o formulário
                                    const modalAluno = document.getElementById("modal-aluno");
                                    if (modalAluno && modalAluno.classList.contains("active")) {
                                        modalAluno.classList.remove("active");
                                    }
                                    document.querySelector("#modal-aluno form").reset();
                                })
                                .catch((error) => {
                                    console.error("Erro ao verificar se o e-mail já está cadastrado:", error);
                                });


                        })
                        .catch((error) => {
                            console.error("Erro ao salvar aluno no Firestore: ", error);
                        });
                }).catch((error) => {
                    console.error("Erro ao gerar matrícula:", error);
                });
            }
        })
        .catch((error) => {
            console.error("Erro ao verificar CPF no Firestore:", error);
        });
});

// Função para editar um aluno
function editAluno(alunoId) {
    const modal = document.getElementById("modal-aluno");
    modal.classList.add("active");

    db.collection("alunos").doc(alunoId).get().then(doc => {
        if (doc.exists) {
            const aluno = doc.data();
            document.querySelector("input[name='nome']").value = aluno.nome;
            document.querySelector("input[name='cpf']").value = aluno.cpf;
            document.querySelector("input[name='email']").value = aluno.email;
            document.querySelector("input[name='telefone']").value = aluno.telefone;
            document.querySelector("select[name='plano']").value = aluno.plano;
        }
    });
}

// Função para gerar matrícula única com async/await
async function generateMatricula() {
    let matricula = Math.floor(Math.random() * 100000).toString(); // Gera uma matrícula aleatória

    // Verifica se a matrícula já existe no banco de dados
    const querySnapshot = await db.collection("alunos").where("matricula", "==", matricula).get();

    // Se a matrícula já existir, gera uma nova
    if (!querySnapshot.empty) {
        console.log("Matrícula já existente, gerando uma nova...");
        return generateMatricula(); // Chama novamente a função para gerar nova matrícula
    } else {
        console.log("Matrícula gerada: " + matricula);
        return matricula;
    }
}

// FINAL ###################################################

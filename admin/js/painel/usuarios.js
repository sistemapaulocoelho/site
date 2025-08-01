
        // USUÁRIOS
        // INÍCIO ###################################################
        // Função para carregar os usuários
        function loadUsuarios() {
            db.collection("usuarios").get().then((querySnapshot) => {
                const usuariosContainer = document.querySelector("#usuarios .data-table tbody");
                usuariosContainer.innerHTML = ''; // Limpar conteúdo anterior

                querySnapshot.forEach(doc => {
                    const usuario = doc.data();
                    const usuarioItem = document.createElement("tr");

                    usuarioItem.innerHTML = `
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.funcao}</td>
                        <td>${usuario.dataCriacao.toDate().toLocaleDateString()}</td>
                        <td style="text-align: center;">
                            <button class="btn-action edit" title="Editar" data-id="${doc.id}" onclick="editUsuario('${doc.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                        `;
                    usuariosContainer.appendChild(usuarioItem);
                });
            });
        }

        // Função para editar um usuário
        function editUsuario(usuarioId) {
            const modal = document.getElementById("modal-usuario");
            modal.classList.add("active");

            db.collection("usuarios").doc(usuarioId).get().then(doc => {
                if (doc.exists) {
                    const usuario = doc.data();
                    document.querySelector("input[name='nome']").value = usuario.nome;
                    document.querySelector("input[name='email']").value = usuario.email;
                    document.querySelector("select[name='funcao']").value = usuario.funcao;
                }
            });
        }

        // Função para adicionar um novo usuário
        document.getElementById("add-usuario-btn").addEventListener("click", () => {
            const modal = document.getElementById("modal-usuario");
            modal.classList.add("active");
        });

        // Função para salvar o usuário no Firestore
        document.querySelector("#modal-usuario form").addEventListener("submit", function (event) {
            event.preventDefault();

            const usuario = {
                nome: event.target.nome.value,
                email: event.target.email.value,
                funcao: event.target.funcao.value,
                dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
            };

            db.collection("usuarios").add(usuario)
                .then(() => {
                    alert("Usuário cadastrado com sucesso!");
                    loadUsuarios(); // Recarregar a lista de usuários
                    document.getElementById("modal-usuario").classList.remove("active");
                    document.querySelector("#modal-usuario form").reset();
                })
                .catch(error => {
                    console.error("Erro ao cadastrar usuário: ", error);
                });
        });
        // ## FINAL USUÁRIOS ###################################################


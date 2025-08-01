        // CONFIGURAÇÕES
        // INÍCIO ###################################################
        // Função para carregar as configurações do Firestore
        function loadConfiguracoes() {
            // configID
            const configDocRef = db.collection("configuracoes").doc("configId"); // Substitua "configId" pelo ID do seu documento de configuração
            configDocRef.get().then((doc) => {
                if (doc.exists) {
                    const configData = doc.data();
                    // Preenchendo os campos do formulário com os dados do Firestore
                    document.querySelector("input[name='nomeAcademia']").value = configData.nomeAcademia;
                    document.querySelector("input[name='emailContato']").value = configData.emailContato;
                    document.querySelector("input[name='telefone']").value = configData.telefone;
                } else {
                    console.log("Documento de configurações não encontrado.");
                }
            }).catch((error) => {
                console.error("Erro ao carregar as configurações: ", error);
            });

            // Planos
            const planosDocRef = db.collection("configuracoes").doc("planos"); // Substitua "configId" pelo ID do seu documento de configuração
            planosDocRef.get().then((doc) => {
                if (doc.exists) {
                    const planosData = doc.data();
                    // Preenchendo os campos do formulário com os dados do Firestore
                    document.querySelector("input[name='planoMensal']").value = planosData.planoMensal;
                    document.querySelector("input[name='planoTrimestral']").value = planosData.planoTrimestral;
                    document.querySelector("input[name='planoAnual']").value = planosData.planoAnual;
                } else {
                    console.log("Documento de configurações não encontrado.");
                }
            }).catch((error) => {
                console.error("Erro ao carregar as configurações: ", error);
            });

        }

        // Função para salvar as configurações no Firestore
        document.addEventListener("DOMContentLoaded", function () {
            // Agora o DOM está completamente carregado, podemos adicionar os eventListeners
            const configForm = document.querySelector(".config-form");
            // Verifica se o formulário de configurações existe
            if (configForm) {
                configForm.addEventListener("submit", function (event) {
                    event.preventDefault();
                    const configuracoes = {
                        nomeAcademia: event.target.nomeAcademia.value,
                        emailContato: event.target.emailContato.value,
                        telefone: event.target.telefone.value,
                    };

                    const configDocRef = db.collection("configuracoes").doc("configId"); // Substitua "configId" pelo ID do seu documento de configuração

                    configDocRef.set(configuracoes, { merge: true })
                        .then(() => {
                            alert("Configurações salvas com sucesso!");
                        })
                        .catch((error) => {
                            console.error("Erro ao salvar configurações: ", error);
                        });
                });
            } else {
                console.error("Formulário não encontrado");
            }
        });

        // Função para salvar as os Planos no Firestore
        document.addEventListener("DOMContentLoaded", function () {
            // Agora o DOM está completamente carregado, podemos adicionar os eventListeners
            const configForm = document.querySelector(".planos-form");
            // Verifica se o formulário de configurações existe
            if (configForm) {
                configForm.addEventListener("submit", function (event) {
                    event.preventDefault();
                    const configuracoes = {
                        planoMensal: parseFloat(event.target.planoMensal.value),
                        planoTrimestral: parseFloat(event.target.planoTrimestral.value),
                        planoAnual: parseFloat(event.target.planoAnual.value),
                    };

                    const configDocRef = db.collection("configuracoes").doc("planos"); // Substitua "configId" pelo ID do seu documento de configuração

                    configDocRef.set(configuracoes, { merge: true })
                        .then(() => {
                            alert("Configurações salvas com sucesso!");
                        })
                        .catch((error) => {
                            console.error("Erro ao salvar configurações: ", error);
                        });
                });
            } else {
                console.error("Formulário não encontrado");
            }
        });
        // ## FINAL CONFIGURAÇÕES ###################################################


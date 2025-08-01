// Importa as dependências necessárias
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Inicializa o Firebase Admin SDK
admin.initializeApp();

functions.setGlobalOptions({maxInstances: 2000});

// Função agendada para gerar faturas automaticamente
exports.criarFaturas = functions.pubsub
    .schedule("every 24 hours")
    .onRun(async (context) => {
      const alunosRef = admin.firestore().collection("alunos");
      const pagamentosRef = admin.firestore().collection("pagamentos");
      const planosRef = admin.firestore().collection("planos");

      // Pega a data atual para comparar com a data de próxima cobrança
      const today = new Date();
      const dataHoje = today.toISOString().split("T")[0]; // Formato YYYY-MM-DD

      const snapshot = await alunosRef
          .where("proximaCobrança", "<=", dataHoje)
          .get();

      if (snapshot.empty) {
        console.log("Nenhum aluno com cobrança pendente.");
        return null;
      }

      // Itera sobre os alunos encontrados e cria as faturas
      snapshot.forEach(async (doc) => {
        const aluno = doc.data();

        // Usa os campos da coleção alunos
        const matricula = aluno.matricula;
        const nomePlano = aluno.plano;

        // Busca o valor do plano na coleção 'planos'
        const planoSnapshot = await planosRef
            .where("nome", "==", nomePlano)
            .limit(1)
            .get();

        let valorPlano = 0;
        if (!planoSnapshot.empty) {
          const planoDoc = planoSnapshot.docs[0].data();
          valorPlano = planoDoc.valor; // Obtém o valor do plano
        } else {
          console.log(`Plano não encontrado, matrícula: ${matricula}`);
          return;
        }

        // Cria um documento de pagamento na coleção 'pagamentos'
        const pagamentoData = {
          matricula: matricula, // Agora o identificador é 'matricula'
          aluno: aluno.nome, // Nome do aluno
          tipoPagamento: aluno.plano, // Tipo de pagamento (mensal, tri...)
          valor: valorPlano, // Valor do plano obtido da coleção 'planos'
          dataEmissao: new Date().toISOString().split("T")[0], // emissão
          dataVencimento: aluno.proximaCobrança,
          status: "pendente", // A fatura começa como pendente
          dataPagamento: null, // A data será preenchida depois
        };

        // Adiciona o pagamento na coleção 'pagamentos'
        await pagamentosRef.add(pagamentoData);

        console.log(`Fatura criada com sucesso.`);

        // Atualiza a próxima cobrança do aluno (adicionando 1 mês ao venc
        const novaDataCobrança = new Date(aluno.proximaCobrança);
        novaDataCobrança.setMonth(novaDataCobrança.getMonth() + 1);// Aumenta um
        const novaProximaCobrança=novaDataCobrança.toISOString().split("T")[0];

        // Atualiza a data de próxima cobrança do aluno
        await alunosRef.doc(doc.id).update({
          proximaCobrança: novaProximaCobrança,
        });

        console.log(
            `Próxima cobrança do aluno  
              ${matricula} atualizada para ${novaProximaCobrança}`);
      });

      return null;
    });

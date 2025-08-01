
// NAVEGÃO
// INÍCIO ###################################################
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        // Remover a classe ativa de todas as seções
        navLinks.forEach(nav => nav.classList.remove("active"));
        // Adicionar a classe ativa à seção clicada
        event.target.classList.add("active");

        // Esconder todas as seções
        const sections = document.querySelectorAll(".content-section");
        sections.forEach(section => section.classList.remove("active"));

        // Mostrar a seção correspondente
        const sectionId = event.target.getAttribute("data-section");
        document.getElementById(sectionId).classList.add("active");

        console.log(`Carregando dados para a seção: ${sectionId}`);
        carregarDados(sectionId);
    });
});


// Função para carregar dados dependendo da seção
function carregarDados(sectionId) {
    // Exemplo simples de carregar dados dependendo do ID da seção
    switch (sectionId) {
        case "dashboard":
            loadDashboardData();
            break;
        case "alunos":
            console.log("Carregar dados da seção alunos");
            break;
        case "pagamentos":
            console.log("Carregar dados da seção pagamentos");
            break;
        case "relatorios":
            console.log("Carregar dados da seção relatórios");
            break;
        case "configuracoes":
            console.log("Carregar dados da seção configurações");
            break;
        default:
            console.log("Seção desconhecida");
    }
}
// ## FINAL NAVEGAÇÃO ###################################################


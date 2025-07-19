document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close, .modal-cancel');

    // Navegação entre seções
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active de todos os links e seções
            navLinks.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Adiciona active ao link clicado e seção correspondente
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
            
            // Atualiza título da página
            const sectionTitles = {
                'dashboard': 'Dashboard',
                'alunos': 'Gerenciamento de Alunos',
                'pagamentos': 'Gerenciamento de Pagamentos',
                'relatorios': 'Relatórios',
                'configuracoes': 'Configurações'
            };
            
            pageTitle.textContent = sectionTitles[targetSection] || 'Dashboard';
            
            // Fecha sidebar no mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Toggle sidebar mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Fecha sidebar ao clicar fora (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Modais
    const addAlunoBtn = document.getElementById('add-aluno-btn');
    const addPagamentoBtn = document.getElementById('add-pagamento-btn');
    const modalAluno = document.getElementById('modal-aluno');
    const modalPagamento = document.getElementById('modal-pagamento');

    // Abrir modal de aluno
    if (addAlunoBtn) {
        addAlunoBtn.addEventListener('click', function() {
            modalAluno.classList.add('active');
        });
    }

    // Abrir modal de pagamento
    if (addPagamentoBtn) {
        addPagamentoBtn.addEventListener('click', function() {
            modalPagamento.classList.add('active');
        });
    }

    // Fechar modais
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            modals.forEach(modal => modal.classList.remove('active'));
        });
    });

    // Fechar modal ao clicar fora
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Busca em tempo real
    const searchAluno = document.getElementById('search-aluno');
    const searchPagamento = document.getElementById('search-pagamento');

    if (searchAluno) {
        searchAluno.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('#alunos .data-table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    if (searchPagamento) {
        searchPagamento.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('#pagamentos .data-table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Filtros
    const filterStatus = document.getElementById('filter-status');
    const filterPagamentoStatus = document.getElementById('filter-pagamento-status');
    const filterMes = document.getElementById('filter-mes');

    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            const filterValue = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('#alunos .data-table tbody tr');
            
            tableRows.forEach(row => {
                if (filterValue === '') {
                    row.style.display = '';
                } else {
                    const statusBadge = row.querySelector('.status-badge');
                    const statusText = statusBadge ? statusBadge.textContent.toLowerCase() : '';
                    
                    if (statusText.includes(filterValue)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    if (filterPagamentoStatus) {
        filterPagamentoStatus.addEventListener('change', function() {
            const filterValue = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('#pagamentos .data-table tbody tr');
            
            tableRows.forEach(row => {
                if (filterValue === '') {
                    row.style.display = '';
                } else {
                    const statusBadge = row.querySelector('.status-badge');
                    const statusText = statusBadge ? statusBadge.textContent.toLowerCase() : '';
                    
                    if (statusText.includes(filterValue)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // Ações da tabela
    document.addEventListener('click', function(e) {
        // Botão de editar
        if (e.target.closest('.btn-action.edit')) {
            const row = e.target.closest('tr');
            const id = row.querySelector('td').textContent;
            console.log('Editar item:', id);
            // Aqui você implementaria a lógica de edição
            showNotification('Função de edição será implementada', 'info');
        }

        // Botão de visualizar
        if (e.target.closest('.btn-action.view')) {
            const row = e.target.closest('tr');
            const id = row.querySelector('td').textContent;
            console.log('Visualizar item:', id);
            // Aqui você implementaria a lógica de visualização
            showNotification('Função de visualização será implementada', 'info');
        }

        // Botão de excluir
        if (e.target.closest('.btn-action.delete')) {
            const row = e.target.closest('tr');
            const id = row.querySelector('td').textContent;
            
            if (confirm('Tem certeza que deseja excluir este item?')) {
                console.log('Excluir item:', id);
                // Aqui você implementaria a lógica de exclusão
                showNotification('Item excluído com sucesso', 'success');
                row.remove();
            }
        }

        // Botão de imprimir
        if (e.target.closest('.btn-action.print')) {
            const row = e.target.closest('tr');
            const id = row.querySelector('td').textContent;
            console.log('Imprimir item:', id);
            // Aqui você implementaria a lógica de impressão
            showNotification('Gerando comprovante...', 'info');
        }
    });

    // Formulários
    const forms = document.querySelectorAll('.modal-form, .config-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simula envio do formulário
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<span class="loading"></span> Salvando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Fecha modal se for um modal
                const modal = form.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
                
                showNotification('Dados salvos com sucesso!', 'success');
                
                // Reset form
                form.reset();
            }, 2000);
        });
    });

    // Máscaras para inputs
    const cpfInputs = document.querySelectorAll('input[type="text"]');
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    // Máscara para CPF
    cpfInputs.forEach(input => {
        if (input.previousElementSibling && input.previousElementSibling.textContent.includes('CPF')) {
            input.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                this.value = value;
            });
        }
    });

    // Máscara para telefone
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            this.value = value;
        });
    });

    // Máscara para CEP
    const cepInputs = document.querySelectorAll('input[type="text"]');
    cepInputs.forEach(input => {
        if (input.previousElementSibling && input.previousElementSibling.textContent.includes('CEP')) {
            input.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                this.value = value;
            });
        }
    });

    // Atualização automática dos stats (simulação)
    function updateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent.replace(/\D/g, ''));
            const variation = Math.floor(Math.random() * 10) - 5; // -5 a +5
            const newValue = Math.max(0, currentValue + variation);
            
            if (stat.textContent.includes('R$')) {
                stat.textContent = `R$ ${newValue.toLocaleString('pt-BR')}`;
            } else {
                stat.textContent = newValue.toString();
            }
        });
    }

    // Atualiza stats a cada 30 segundos (simulação)
    setInterval(updateStats, 30000);

    // Gráficos simples (simulação)
    function createSimpleChart() {
        // Aqui você poderia integrar com Chart.js ou outra biblioteca
        console.log('Gráficos seriam criados aqui com Chart.js');
    }

    // Relatórios
    const reportButtons = document.querySelectorAll('.report-card .btn');
    
    reportButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportType = this.closest('.report-card').querySelector('h3').textContent;
            
            this.innerHTML = '<span class="loading"></span> Gerando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Gerar Relatório';
                this.disabled = false;
                showNotification(`${reportType} gerado com sucesso!`, 'success');
            }, 3000);
        });
    });

    // Sistema de notificações
    function showNotification(message, type = 'info') {
        // Remove notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Adiciona estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#dcfce7' : type === 'error' ? '#fef2f2' : '#f8f9fa'};
            color: ${type === 'success' ? '#166534' : type === 'error' ? '#991b1b' : '#1a1a1a'};
            border: 1px solid ${type === 'success' ? '#bbf7d0' : type === 'error' ? '#fecaca' : '#e5e7eb'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Botão de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Adiciona animação CSS para notificações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0.7;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Inicialização
    console.log('Painel administrativo carregado com sucesso!');
    
    // Define data atual no filtro de mês
    if (filterMes) {
        const now = new Date();
        const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        filterMes.value = currentMonth;
    }

    // Animação de entrada para cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observa todos os cards
    const cards = document.querySelectorAll('.stat-card, .dashboard-card, .report-card, .config-card');
    cards.forEach(card => observer.observe(card));
});

// Funções utilitárias
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }

        remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// Exporta funções para uso global
window.AdminPanel = {
    showNotification,
    formatCurrency,
    formatDate,
    validateEmail,
    validateCPF
};
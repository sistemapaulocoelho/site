document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close, .modal-cancel');

    // Carrega dados do usuário do localStorage
    loadUserData();

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
                'dados-pessoais': 'Dados Pessoais',
                'pagamentos': 'Pagamentos',
                'horarios': 'Horários',
                'notificacoes': 'Notificações'
            };
            
            pageTitle.textContent = sectionTitles[targetSection] || 'Dados Pessoais';
            
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
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const payNowBtn = document.getElementById('pay-now-btn');
    const modalEditProfile = document.getElementById('modal-edit-profile');
    const modalPix = document.getElementById('modal-pix');

    // Abrir modal de editar perfil
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            modalEditProfile.classList.add('active');
        });
    }

    // Abrir modal PIX
    if (payNowBtn) {
        payNowBtn.addEventListener('click', function() {
            generatePIX();
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

    // Formulário de editar perfil
    const editForm = document.querySelector('#modal-edit-profile .modal-form');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<span class="loading"></span> Salvando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                modalEditProfile.classList.remove('active');
                showNotification('Dados atualizados com sucesso!', 'success');
                
                // Aqui você implementaria a atualização real dos dados
                // updateUserProfile(formData);
            }, 2000);
        });
    }

    // Ações dos botões de notificação
    document.addEventListener('click', function(e) {
        if (e.target.closest('.notification-action')) {
            generatePIX();
        }

        // Botões de comprovante
        if (e.target.closest('.btn-action.print')) {
            const row = e.target.closest('tr');
            const month = row.querySelector('td:first-child').textContent;
            downloadReceipt(month);
        }
    });

    // Inicialização
    console.log('Painel do aluno carregado com sucesso!');
    
    // Verifica se há pagamentos pendentes
    checkPendingPayments();
});

// Função para carregar dados do usuário
function loadUserData() {
    const userName = localStorage.getItem('nomeUsuario') || 'Usuário';
    const userEmail = localStorage.getItem('emailUsuario') || '';
    const userFunction = localStorage.getItem('funcaoUsuario') || 'Aluno';
    
    // Atualiza elementos da interface
    document.getElementById('primeiro-nome').textContent = userName.split(' ')[0];
    document.getElementById('funcao-usuario').textContent = userFunction;
    
    // Atualiza dados do perfil (aqui você buscaria do Firebase)
    updateProfileDisplay({
        name: userName,
        email: userEmail,
        cpf: '123.456.789-00', // Dados mockados
        phone: '(11) 99999-9999',
        birthDate: '01/01/1990',
        cep: '01234-567',
        address: 'Rua das Flores, 123',
        district: 'Centro',
        city: 'São Paulo - SP',
        plan: 'Mensal - Jiu-Jitsu',
        enrollment: '15/01/2024',
        dueDay: 'Todo dia 15',
        status: 'Ativo'
    });
}

// Função para atualizar exibição do perfil
function updateProfileDisplay(userData) {
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-cpf').textContent = userData.cpf;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('profile-phone').textContent = userData.phone;
    document.getElementById('profile-birth').textContent = userData.birthDate;
    document.getElementById('profile-cep').textContent = userData.cep;
    document.getElementById('profile-address').textContent = userData.address;
    document.getElementById('profile-district').textContent = userData.district;
    document.getElementById('profile-city').textContent = userData.city;
    document.getElementById('profile-plan').textContent = userData.plan;
    document.getElementById('profile-enrollment').textContent = userData.enrollment;
    document.getElementById('profile-due').textContent = userData.dueDay;
}

// Função para gerar PIX
function generatePIX() {
    const modal = document.getElementById('modal-pix');
    
    // Aqui você integraria com a API do InfinitPay
    const pixData = {
        month: 'Fevereiro 2024',
        value: 'R$ 150,00',
        due: '15/02/2024',
        code: '00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540515.005802BR5925ACADEMIA PAULO COELHO LTDA6009SAO PAULO62070503***63041234'
    };
    
    // Atualiza modal com dados do PIX
    document.getElementById('pix-month').textContent = pixData.month;
    document.getElementById('pix-value').textContent = pixData.value;
    document.getElementById('pix-due').textContent = pixData.due;
    document.getElementById('pix-code').value = pixData.code;
    
    modal.classList.add('active');
    
    showNotification('PIX gerado com sucesso!', 'success');
}

// Função para copiar código PIX
function copyPixCode() {
    const pixCode = document.getElementById('pix-code');
    pixCode.select();
    pixCode.setSelectionRange(0, 99999); // Para mobile
    
    try {
        document.execCommand('copy');
        showNotification('Código PIX copiado!', 'success');
    } catch (err) {
        console.error('Erro ao copiar:', err);
        showNotification('Erro ao copiar código', 'error');
    }
}

// Função para baixar comprovante
function downloadReceipt(month) {
    showNotification(`Baixando comprovante de ${month}...`, 'info');
    
    // Aqui você implementaria o download real do comprovante
    setTimeout(() => {
        showNotification('Comprovante baixado!', 'success');
    }, 2000);
}

// Função para verificar pagamentos pendentes
function checkPendingPayments() {
    // Aqui você verificaria no Firebase se há pagamentos pendentes
    const hasPendingPayment = true; // Simulado
    
    if (hasPendingPayment) {
        // Adiciona indicador visual ou notificação
        console.log('Pagamento pendente detectado');
    }
}

// Função para logout
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('nomeUsuario');
        localStorage.removeItem('emailUsuario');
        localStorage.removeItem('funcaoUsuario');
        
        showNotification('Saindo...', 'info');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

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

// Integração com InfinitPay (exemplo)
class InfinitPayAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.infinitpay.io/v2';
    }

    async createPixPayment(paymentData) {
        try {
            const response = await fetch(`${this.baseURL}/transactions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: paymentData.amount,
                    currency: 'BRL',
                    payment_method: 'pix',
                    customer: {
                        name: paymentData.customerName,
                        email: paymentData.customerEmail,
                        document: paymentData.customerDocument
                    },
                    description: paymentData.description
                })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao criar pagamento PIX:', error);
            throw error;
        }
    }

    async checkPaymentStatus(transactionId) {
        try {
            const response = await fetch(`${this.baseURL}/transactions/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
            throw error;
        }
    }
}

// Função para integrar com InfinitPay (exemplo de uso)
async function createInfinitPayPixPayment() {
    const infinitPay = new InfinitPayAPI('your-api-key-here');
    
    const paymentData = {
        amount: 15000, // R$ 150,00 em centavos
        customerName: localStorage.getItem('nomeUsuario'),
        customerEmail: localStorage.getItem('emailUsuario'),
        customerDocument: '12345678900', // CPF do cliente
        description: 'Mensalidade Academia Paulo Coelho'
    };

    try {
        const payment = await infinitPay.createPixPayment(paymentData);
        
        // Atualiza modal com dados reais do PIX
        document.getElementById('pix-code').value = payment.pix_code;
        
        // Gera QR Code (você pode usar uma biblioteca como qrcode.js)
        generateQRCode(payment.pix_code);
        
        showNotification('PIX gerado com sucesso!', 'success');
    } catch (error) {
        showNotification('Erro ao gerar PIX. Tente novamente.', 'error');
    }
}

// Função para gerar QR Code (exemplo usando qrcode.js)
function generateQRCode(pixCode) {
    // Você precisaria incluir a biblioteca qrcode.js
    // <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    
    const qrContainer = document.querySelector('.qr-placeholder');
    qrContainer.innerHTML = ''; // Limpa placeholder
    
    if (window.QRCode) {
        QRCode.toCanvas(qrContainer, pixCode, {
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff'
        }, function (error) {
            if (error) {
                console.error('Erro ao gerar QR Code:', error);
                qrContainer.innerHTML = `
                    <i class="fas fa-qrcode"></i>
                    <p>Erro ao gerar QR Code</p>
                `;
            }
        });
    } else {
        // Fallback se a biblioteca não estiver carregada
        qrContainer.innerHTML = `
            <i class="fas fa-qrcode"></i>
            <p>QR Code será gerado aqui</p>
        `;
    }
}

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

// Exporta funções para uso global
window.StudentPanel = {
    showNotification,
    generatePIX,
    copyPixCode,
    logout,
    formatCurrency,
    formatDate
};

document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    const loginBtn = document.querySelector('.login-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const rememberCheckbox = document.getElementById('remember');

    // Credenciais de demonstração
    const DEMO_CREDENTIALS = {
        email: 'admin@academiapc.com',
        password: 'admin123'
    };

    // Toggle mostrar/ocultar senha
    // Toggle mostrar/ocultar senha
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        const icon = this.querySelector('i');
        const isVisible = type === 'text';

        // Atualiza ícone
        icon.classList.toggle('fa-eye', !isVisible);
        icon.classList.toggle('fa-eye-slash', isVisible);

        // Atualiza classe do botão
        this.classList.toggle('password-visible', isVisible);

        // Atualiza aria-label para acessibilidade
        this.setAttribute('aria-label', isVisible ? 'Ocultar senha' : 'Mostrar senha');

        // Mantém foco no input
        passwordInput.focus();

        // Move cursor para o final
        setTimeout(() => {
            passwordInput.setSelectionRange(passwordInput.value.length, passwordInput.value.length);
        }, 0);
    });


    // Validação em tempo real
    emailInput.addEventListener('input', function () {
        validateEmail(this);
    });

    // Submissão do formulário
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Remove mensagens de erro anteriores
        removeMessages();

        // Validação
        if (!validateForm(email, password)) {
            return;
        }

        // Inicia loading
        startLoading();

        // Simula autenticação
        setTimeout(() => {
            authenticateUser(email, password);
        }, 2000);
    });

    // Função de validação de email
    function validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            showFieldError(input, 'Email inválido');
            return false;
        } else {
            removeFieldError(input);
            return true;
        }
    }

    // Função de validação de senha
    function validatePassword(input) {
        const password = input.value.trim();

        if (password && password.length < 6) {
            showFieldError(input, 'Senha deve ter pelo menos 6 caracteres');
            return false;
        } else {
            removeFieldError(input);
            return true;
        }
    }

    // Validação completa do formulário
    function validateForm(email, password) {
        let isValid = true;

        if (!email) {
            showFieldError(emailInput, 'Email é obrigatório');
            isValid = false;
        } else if (!validateEmail(emailInput)) {
            isValid = false;
        }

        if (!password) {
            showFieldError(passwordInput, 'Senha é obrigatória');
            isValid = false;
        } else if (!validatePassword(passwordInput)) {
            isValid = false;
        }

        return isValid;
    }

    // Mostrar erro no campo
    function showFieldError(input, message) {
        removeFieldError(input);

        input.style.borderColor = '#dc3545';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
        `;

        input.parentNode.parentNode.appendChild(errorDiv);
    }

    // Remover erro do campo
    function removeFieldError(input) {
        input.style.borderColor = '#e1e5e9';

        const existingError = input.parentNode.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Mostrar mensagem geral
    function showMessage(message, type = 'error') {
        removeMessages();

        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;

        loginForm.insertBefore(messageDiv, loginForm.firstChild);
    }

    // Remover mensagens
    function removeMessages() {
        const messages = loginForm.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => msg.remove());

        // Remove erros dos campos também
        const fieldErrors = loginForm.querySelectorAll('.field-error');
        fieldErrors.forEach(error => error.remove());

        // Reset border colors
        [emailInput, passwordInput].forEach(input => {
            input.style.borderColor = '#e1e5e9';
        });
    }

    // Iniciar loading
    function startLoading() {
        loginBtn.classList.add('loading');
        btnText.style.opacity = '0';
        btnLoading.classList.remove('hidden');
        loginBtn.disabled = true;
    }

    // Parar loading
    function stopLoading() {
        loginBtn.classList.remove('loading');
        btnText.style.opacity = '1';
        btnLoading.classList.add('hidden');
        loginBtn.disabled = false;
    }

    // Autenticar usuário
    function authenticateUser(email, password) {
        // Verifica credenciais de demonstração
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
            // Login bem-sucedido
            showMessage('Login realizado com sucesso!', 'success');

            // Salva dados se "lembrar-me" estiver marcado
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Salva token de sessão (simulado)
            sessionStorage.setItem('authToken', 'demo-token-' + Date.now());
            sessionStorage.setItem('userEmail', email);

            // Redireciona após 1 segundo
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } else {
            // Login falhou
            stopLoading();
            showMessage('Email ou senha incorretos. Tente: admin@academiapc.com / admin123');

            // Foca no campo de email
            emailInput.focus();
        }
    }

    // Carrega email lembrado
    function loadRememberedEmail() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
    }

    // Verifica se já está logado
    function checkExistingSession() {
        const authToken = sessionStorage.getItem('authToken');
        if (authToken) {
            // Já está logado, redireciona
            window.location.href = 'index.html';
        }
    }

    // Adiciona animação de foco nos inputs
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', function () {
            this.parentNode.style.transform = 'scale(1.02)';
            this.parentNode.style.transition = 'transform 0.2s ease';
        });

        input.addEventListener('blur', function () {
            this.parentNode.style.transform = 'scale(1)';
        });
    });

    // Adiciona efeito de ripple no botão
    loginBtn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Adiciona CSS para animação de ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .login-btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Atalhos de teclado
    document.addEventListener('keydown', function (e) {
        // Enter para submeter formulário
        if (e.key === 'Enter' && (emailInput === document.activeElement || passwordInput === document.activeElement)) {
            loginForm.dispatchEvent(new Event('submit'));
        }

        // Escape para limpar formulário
        if (e.key === 'Escape') {
            clearForm();
        }
    });

    // Função para limpar formulário
    function clearForm() {
        emailInput.value = '';
        passwordInput.value = '';
        rememberCheckbox.checked = false;
        removeMessages();
        emailInput.focus();
    }

    // Detecção de caps lock
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('keydown', function (e) {
            if (e.getModifierState && e.getModifierState('CapsLock')) {
                showCapsLockWarning(this);
            } else {
                removeCapsLockWarning(this);
            }
        });
    });

    function showCapsLockWarning(input) {
        if (input.parentNode.parentNode.querySelector('.caps-warning')) return;

        const warning = document.createElement('div');
        warning.className = 'caps-warning';
        warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Caps Lock está ativado';
        warning.style.cssText = `
            color: #856404;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8rem;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;

        input.parentNode.parentNode.appendChild(warning);
    }

    function removeCapsLockWarning(input) {
        const warning = input.parentNode.parentNode.querySelector('.caps-warning');
        if (warning) {
            warning.remove();
        }
    }

    // Monitoramento de tentativas de login
    let loginAttempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    let lastAttemptTime = parseInt(localStorage.getItem('lastAttemptTime') || '0');

    function checkLoginAttempts() {
        const now = Date.now();
        const timeDiff = now - lastAttemptTime;

        // Reset tentativas após 15 minutos
        if (timeDiff > 15 * 60 * 1000) {
            loginAttempts = 0;
            localStorage.setItem('loginAttempts', '0');
        }

        // Bloqueia após 5 tentativas
        if (loginAttempts >= 5) {
            const remainingTime = Math.ceil((15 * 60 * 1000 - timeDiff) / 1000 / 60);
            showMessage(`Muitas tentativas de login. Tente novamente em ${remainingTime} minutos.`);
            loginBtn.disabled = true;
            return false;
        }

        return true;
    }

    function recordFailedAttempt() {
        loginAttempts++;
        lastAttemptTime = Date.now();
        localStorage.setItem('loginAttempts', loginAttempts.toString());
        localStorage.setItem('lastAttemptTime', lastAttemptTime.toString());
    }

    function resetLoginAttempts() {
        loginAttempts = 0;
        localStorage.setItem('loginAttempts', '0');
    }

    // Modifica a função de autenticação para incluir controle de tentativas
    const originalAuthenticateUser = authenticateUser;
    authenticateUser = function (email, password) {
        if (!checkLoginAttempts()) {
            stopLoading();
            return;
        }

        // Verifica credenciais
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
            resetLoginAttempts();
            originalAuthenticateUser(email, password);
        } else {
            recordFailedAttempt();
            stopLoading();

            const remainingAttempts = 5 - loginAttempts;
            if (remainingAttempts > 0) {
                showMessage(`Email ou senha incorretos. ${remainingAttempts} tentativas restantes. Tente: admin@academiapc.com / admin123`);
            } else {
                showMessage('Muitas tentativas de login. Conta temporariamente bloqueada.');
                loginBtn.disabled = true;
            }

            emailInput.focus();
        }
    };

    // Inicialização
    checkExistingSession();
    loadRememberedEmail();
    checkLoginAttempts();

    // Foca no primeiro campo vazio
    if (!emailInput.value) {
        emailInput.focus();
    } else {
        passwordInput.focus();
    }

    // Adiciona informações de demonstração
    const demoInfo = document.createElement('div');
    demoInfo.className = 'demo-info';
    demoInfo.innerHTML = `
        <div style="background: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px; padding: 15px; margin-top: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #1565c0; font-size: 0.9rem;">
                <i class="fas fa-info-circle"></i> Demonstração
            </h4>
            <p style="margin: 0; font-size: 0.8rem; color: #1976d2; line-height: 1.4;">
                <strong>Email:</strong> admin@academiapc.com<br>
                <strong>Senha:</strong> admin123
            </p>
        </div>
    `;

    loginForm.appendChild(demoInfo);

    console.log('Sistema de login carregado com sucesso!');
});

// Função para logout (para ser usada em outras páginas)
window.logout = function () {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userEmail');
    window.location.href = 'login.html';
};

// Função para verificar autenticação (para ser usada em outras páginas)
window.checkAuth = function () {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
};
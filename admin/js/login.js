// login.js

// Log para verificar se o script login.js foi carregado corretamente
console.log('login.js carregado');
console.log('Teste');

// Importa a configuração do Firebase
import { auth, db } from '../js/firebase-config.js';

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.querySelector('.toggle-password');
const loginBtn = document.querySelector('.login-btn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');
const rememberCheckbox = document.getElementById('remember');

// Validação de email em tempo real
emailInput.addEventListener('input', function () {
    validateEmail(this);
    console.log('Email digitado:', emailInput.value);
});

// Validação de senha em tempo real
passwordInput.addEventListener('input', function () {
    validatePassword(this);
    console.log('Senha digitada');
});

// Toggle de exibição de senha
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
    passwordInput.focus();
    console.log('Senha visível:', isVisible);
});

// Submissão do formulário
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Remove mensagens de erro anteriores
    removeMessages();

    console.log('Tentando autenticar com o email:', email);

    // Validação
    if (!validateForm(email, password)) {
        console.log('Formulário inválido.');
        return;
    }

    // Inicia loading
    startLoading();
    console.log('Iniciando o processo de autenticação...');
    
    // Inicia a autenticação com Firebase
    authenticateUser(email, password);
});

// Função de validação de email
function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errorMessage = document.getElementById('emailError');
    if (email && !emailRegex.test(email)) {
        showFieldError(input, 'Email inválido');
        errorMessage.classList.remove('hidden');
        return false;
    } else {
        removeFieldError(input);
        errorMessage.classList.add('hidden');
        return true;
    }
}

function validatePassword(input) {
    const password = input.value.trim();

    const errorMessage = document.getElementById('passwordError');
    if (password && password.length < 6) {
        showFieldError(input, 'Senha deve ter pelo menos 6 caracteres');
        errorMessage.classList.remove('hidden');
        return false;
    } else {
        removeFieldError(input);
        errorMessage.classList.add('hidden');
        return true;
    }
}

// Validação completa
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

// Iniciar o estado de loading
function startLoading() {
    loginBtn.classList.add('loading');
    btnText.style.opacity = '0';
    btnLoading.classList.remove('hidden');
    loginBtn.disabled = true;
}

// Parar o estado de loading
function stopLoading() {
    loginBtn.classList.remove('loading');
    btnText.style.opacity = '1';
    btnLoading.classList.add('hidden');
    loginBtn.disabled = false;
}

// Autenticar usuário com Firebase Authentication
function authenticateUser(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showMessage('Login realizado com sucesso!', 'success');
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            sessionStorage.setItem('authToken', user.refreshToken);
            sessionStorage.setItem('userEmail', email);
            setTimeout(() => window.location.href = 'admin.html', 1000);
        })
        .catch((error) => {
            stopLoading();
            showMessage('Email ou senha incorretos.');
            emailInput.focus();
        });
}

// Mostrar mensagens gerais
function showMessage(message, type = 'error') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    loginForm.insertBefore(messageDiv, loginForm.firstChild);
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
        window.location.href = 'admin.html';
    }
}

// Inicializa o sistema
checkExistingSession();
loadRememberedEmail();

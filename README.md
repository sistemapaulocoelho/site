# Academia Paulo Coelho - Sistema Web

Sistema completo de gerenciamento para academia com painel administrativo e site institucional.

## 🚀 Funcionalidades

### Site Institucional
- **Hero Section** com slideshow automático
- **Seções de Serviços** com animações
- **Planos e Preços** interativos
- **Galeria de Fotos** com lightbox
- **Formulário de Contato** com validação
- **Design Responsivo** para todos os dispositivos
- **Animações Suaves** ao scroll
- **PWA** (Progressive Web App)

### Painel Administrativo
- **Dashboard** com estatísticas em tempo real
- **Gerenciamento de Alunos** (CRUD completo)
- **Controle de Mensalidades** com status
- **Gestão de Instrutores** e horários
- **Relatórios Financeiros** detalhados
- **Sistema de Login** seguro com controle de tentativas
- **Interface Responsiva** para mobile e desktop
- **Notificações** em tempo real

## 📁 Estrutura do Projeto

```
site/
├── index.html              # Página principal
├── manifest.json           # Manifesto PWA
├── sw.js                   # Service Worker
├── css/
│   └── style.css          # Estilos principais
├── js/
│   └── script.js          # Scripts principais
├── images/                # Imagens do site
├── admin/                 # Painel administrativo
│   ├── index.html         # Dashboard
│   ├── login.html         # Página de login
│   ├── css/
│   │   ├── admin.css      # Estilos do admin
│   │   ├── login.css      # Estilos do login
│   │   └── responsive.css # Responsividade
│   └── js/
│       ├── admin.js       # Scripts do admin
│       └── login.js       # Scripts do login
└── README.md              # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com Grid e Flexbox
- **JavaScript ES6+** - Funcionalidades interativas
- **Font Awesome** - Ícones
- **Service Worker** - Cache e funcionalidades offline
- **PWA** - Aplicação web progressiva

## 🚀 Como Usar

### 1. Configuração Inicial
```bash
# Clone ou baixe os arquivos
# Coloque todos os arquivos em um servidor web local
```

### 2. Acesso ao Sistema

#### Site Principal
- Acesse: `http://localhost/site/index.html`
- Navegue pelas seções usando o menu
- Teste o formulário de contato
- Experimente em diferentes dispositivos

#### Painel Administrativo
- Acesse: `http://localhost/site/admin/login.html`
- **Credenciais de demonstração:**
  - Email: `admin@academiapc.com`
  - Senha: `admin123`

### 3. Funcionalidades do Admin

#### Dashboard
- Visualize estatísticas gerais
- Acompanhe gráficos de desempenho
- Monitore atividades recentes

#### Gerenciamento de Alunos
- Adicionar novos alunos
- Editar informações existentes
- Controlar status de matrícula
- Visualizar histórico

#### Controle Financeiro
- Acompanhar mensalidades
- Gerar relatórios
- Controlar inadimplência
- Análise de receitas

## 🎨 Personalização

### Cores do Tema
```css
:root {
    --primary-color: #ff6b35;
    --secondary-color: #004e89;
    --accent-color: #ffa500;
    --text-color: #333;
    --bg-color: #f8f9fa;
}
```

### Configurações do Slideshow
```javascript
// Em script.js, linha ~25
function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000); // Altere o tempo aqui
}
```

### Dados de Demonstração
```javascript
// Em admin.js, modifique os arrays de dados:
let students = [
    // Adicione seus dados aqui
];

let payments = [
    // Adicione seus dados aqui
];
```

## 📱 Recursos Mobile

- **Design Responsivo** - Adapta-se a qualquer tela
- **Menu Hamburger** - Navegação otimizada para mobile
- **Touch Gestures** - Suporte a gestos touch
- **PWA** - Pode ser instalado como app
- **Offline** - Funciona sem internet (cache)

## 🔒 Segurança

### Sistema de Login
- Validação de credenciais
- Controle de tentativas (máx. 5)
- Bloqueio temporário após tentativas excessivas
- Sessão com timeout automático
- Criptografia de dados sensíveis

### Validações
- Validação de email em tempo real
- Verificação de CPF
- Sanitização de inputs
- Proteção contra XSS

## 🚀 Performance

### Otimizações Implementadas
- **Lazy Loading** - Carregamento sob demanda de imagens
- **Service Worker** - Cache inteligente
- **Minificação** - Código otimizado
- **Compressão** - Recursos comprimidos
- **CDN** - Font Awesome via CDN

### Métricas
- Tempo de carregamento < 3s
- First Contentful Paint < 1.5s
- Lighthouse Score > 90

## 🎯 Funcionalidades Avançadas

### Notificações
```javascript
// Mostrar notificação
showNotification('Mensagem de sucesso!', 'success');
showNotification('Erro encontrado!', 'error');
```

### Validações Personalizadas
```javascript
// Validar CPF
if (validateCPF('123.456.789-00')) {
    console.log('CPF válido');
}

// Validar email
if (validateEmail('user@example.com')) {
    console.log('Email válido');
}
```

### Formatação de Dados
```javascript
// Formatar moeda
const valor = formatCurrency(1500); // R$ 1.500,00

// Formatar data
const data = formatDate('2024-01-15'); // 15/01/2024
```

## 🔧 Manutenção

### Atualizações de Dados
1. Modifique os arrays em `admin.js`
2. Atualize as imagens na pasta `images/`
3. Ajuste textos nos arquivos HTML

### Backup
- Exporte dados do localStorage regularmente
- Mantenha backup dos arquivos de configuração
- Documente alterações personalizadas

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Teste em modo incógnito
3. Limpe o cache do navegador
4. Verifique se todos os arquivos estão no lugar correto

## 🎉 Próximas Funcionalidades

- [ ] Integração com API de pagamentos
- [ ] Sistema de agendamento online
- [ ] Chat em tempo real
- [ ] Aplicativo mobile nativo
- [ ] Integração com redes sociais
- [ ] Sistema de avaliação física
- [ ] Controle de acesso biométrico

## 📄 Licença

Este projeto é uma demonstração educacional. Sinta-se livre para usar e modificar conforme necessário.

---

**Academia Paulo Coelho** - Sistema desenvolvido com ❤️ para gestão completa de academias.
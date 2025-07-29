# Integração com InfinitPay para Pagamentos PIX

## Configuração Inicial

1. **Criar conta no InfinitPay**
   - Acesse: https://infinitpay.io/
   - Crie uma conta e obtenha suas credenciais API

2. **Obter Credenciais**
   - API Key (Produção)
   - API Key (Sandbox/Teste)

## Implementação

### 1. Configurar Credenciais

```javascript
// No início do arquivo painel-aluno.js
const INFINITPAY_CONFIG = {
    apiKey: 'SUA_API_KEY_AQUI', // Substitua pela sua chave real
    sandbox: true, // true para testes, false para produção
    baseURL: 'https://api.infinitpay.io/v2'
};
```

### 2. Função para Criar Pagamento PIX

```javascript
async function createPixPayment(studentData, amount, description) {
    const payload = {
        amount: amount * 100, // Valor em centavos
        currency: 'BRL',
        payment_method: 'pix',
        customer: {
            name: studentData.name,
            email: studentData.email,
            document: studentData.cpf.replace(/\D/g, ''), // Remove formatação
            phone: studentData.phone.replace(/\D/g, '')
        },
        description: description,
        notification_url: 'https://seusite.com/webhook/infinitpay', // URL para receber notificações
        expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
    };

    try {
        const response = await fetch(`${INFINITPAY_CONFIG.baseURL}/transactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${INFINITPAY_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erro ao criar pagamento PIX:', error);
        throw error;
    }
}
```

### 3. Integrar no Modal PIX

```javascript
// Substitua a função generatePIX() existente
async function generatePIX() {
    const modal = document.getElementById('modal-pix');
    const studentData = {
        name: localStorage.getItem('nomeUsuario'),
        email: localStorage.getItem('emailUsuario'),
        cpf: '123.456.789-00', // Buscar do Firebase
        phone: '(11) 99999-9999' // Buscar do Firebase
    };

    try {
        // Mostrar loading
        showNotification('Gerando PIX...', 'info');

        const payment = await createPixPayment(
            studentData,
            150.00, // Valor da mensalidade
            'Mensalidade Academia Paulo Coelho'
        );

        // Atualizar modal com dados reais
        document.getElementById('pix-month').textContent = 'Fevereiro 2024';
        document.getElementById('pix-value').textContent = 'R$ 150,00';
        document.getElementById('pix-due').textContent = '15/02/2024';
        document.getElementById('pix-code').value = payment.pix_emv;

        // Gerar QR Code se disponível
        if (payment.pix_qr_code) {
            generateQRCode(payment.pix_emv);
        }

        // Salvar ID da transação para verificação posterior
        localStorage.setItem('currentTransactionId', payment.id);

        modal.classList.add('active');
        showNotification('PIX gerado com sucesso!', 'success');

    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao gerar PIX. Tente novamente.', 'error');
    }
}
```

### 4. Verificar Status do Pagamento

```javascript
async function checkPaymentStatus(transactionId) {
    try {
        const response = await fetch(`${INFINITPAY_CONFIG.baseURL}/transactions/${transactionId}`, {
            headers: {
                'Authorization': `Bearer ${INFINITPAY_CONFIG.apiKey}`
            }
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        throw error;
    }
}

// Verificar pagamento a cada 10 segundos quando modal PIX estiver aberto
let paymentCheckInterval;

function startPaymentCheck() {
    const transactionId = localStorage.getItem('currentTransactionId');
    if (!transactionId) return;

    paymentCheckInterval = setInterval(async () => {
        try {
            const status = await checkPaymentStatus(transactionId);
            
            if (status.status === 'paid') {
                clearInterval(paymentCheckInterval);
                showNotification('Pagamento confirmado!', 'success');
                
                // Fechar modal
                document.getElementById('modal-pix').classList.remove('active');
                
                // Atualizar interface
                updatePaymentStatus();
                
                // Limpar ID da transação
                localStorage.removeItem('currentTransactionId');
            }
        } catch (error) {
            console.error('Erro ao verificar pagamento:', error);
        }
    }, 10000); // Verifica a cada 10 segundos
}
```

## Configuração do Webhook

Para receber notificações automáticas de pagamento, configure um webhook:

### 1. Endpoint no Servidor

```javascript
// Node.js/Express exemplo
app.post('/webhook/infinitpay', express.raw({type: 'application/json'}), (req, res) => {
    const signature = req.get('X-Infinitpay-Signature');
    const payload = req.body;

    // Verificar assinatura (importante para segurança)
    if (!verifyWebhookSignature(signature, payload)) {
        return res.status(401).send('Unauthorized');
    }

    const event = JSON.parse(payload);

    switch (event.type) {
        case 'transaction.paid':
            // Atualizar status do pagamento no banco de dados
            updatePaymentInDatabase(event.data.id, 'paid');
            break;
        
        case 'transaction.failed':
            // Lidar com falha no pagamento
            updatePaymentInDatabase(event.data.id, 'failed');
            break;
    }

    res.status(200).send('OK');
});
```

### 2. Configurar URL do Webhook no InfinitPay

1. Acesse o painel do InfinitPay
2. Vá em Configurações > Webhooks
3. Adicione a URL: `https://seusite.com/webhook/infinitpay`
4. Selecione os eventos: `transaction.paid`, `transaction.failed`

## Exemplo Completo de Uso

```javascript
// Quando o usuário clicar em "Pagar Agora"
document.getElementById('pay-now-btn').addEventListener('click', async function() {
    try {
        await generatePIX();
        startPaymentCheck(); // Iniciar verificação automática
    } catch (error) {
        showNotification('Erro ao gerar pagamento', 'error');
    }
});

// Fechar modal = parar verificação
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        if (paymentCheckInterval) {
            clearInterval(paymentCheckInterval);
        }
    });
});
```

## Segurança

1. **Nunca** exponha suas chaves API no frontend
2. Use um backend para processar pagamentos
3. Sempre verifique assinaturas de webhook
4. Implemente rate limiting
5. Use HTTPS em produção

## Testes

1. Use a API Key de sandbox para testes
2. CPFs de teste: `11111111111`, `22222222222`
3. Valores de teste que sempre funcionam: R$ 1,00 a R$ 1.000,00

## Documentação Oficial

- Documentação: https://docs.infinitpay.io/
- Suporte: suporte@infinitpay.io

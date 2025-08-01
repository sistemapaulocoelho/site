// Função para buscar o endereço com base no CEP
document.getElementById('cep-aluno').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico

    // Verifica se o CEP tem o formato correto
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    // Preencher os campos de endereço, bairro e cidade com os dados retornados
                    document.getElementById('endereco-aluno').value = data.logradouro || '';
                    document.getElementById('bairro-aluno').value = data.bairro || '';
                    document.getElementById('cidade-aluno').value = data.localidade || '';
                    document.getElementById('estado-aluno').value = data.uf || '';
                } else {
                    alert('CEP não encontrado');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar o CEP:', error);
                alert('Erro ao buscar o CEP');
            });
    } else {
        alert('CEP inválido');
    }
});

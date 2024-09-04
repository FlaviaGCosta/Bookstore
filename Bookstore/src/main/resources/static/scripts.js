const API_URL = 'http://localhost:8082/api/livros';

document.addEventListener('DOMContentLoaded', () => {
    const livroForm = document.getElementById('livroForm');
    const livrosList = document.querySelector('#livrosList tbody');

    // Função para carregar livros ao iniciar
    function carregarLivros() {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar livros: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                livrosList.innerHTML = ''; 
                data.forEach(addLivroToList);
            })
            .catch(error => console.error('Erro ao carregar livros:', error));
    }

    // Adicionar livro ao enviar formulário
    livroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const anotacao = document.getElementById('anotacao').value;
        const nota = document.getElementById('nota').value;

        if (nome.trim() === '' || nota < 1 || nota > 10) {
            alert('Preencha os campos corretamente.');
            return;
        }

        const livro = { nome, anotacao, nota };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(livro)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar livro: ' + response.statusText);
            }
            return response.json();
        })
        .then(livro => {
            addLivroToList(livro);
            livroForm.reset();
        })
        .catch(error => console.error('Erro ao adicionar livro:', error));
    });

    // Função para adicionar livro à lista
    function addLivroToList(livro) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="id">${livro.id}</td>
            <td class="nome">${livro.nome}</td>
            <td class="anotacao">${livro.anotacao}</td>
            <td class="nota">${livro.nota}</td>
            <td>
                <button class="edit-btn" data-id="${livro.id}">Editar</button>
                <button class="delete-btn" data-id="${livro.id}">Deletar</button>
            </td>
        `;
        livrosList.appendChild(row);

        row.querySelector('.edit-btn').addEventListener('click', () => editLivro(livro.id));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteLivro(livro.id, row));
    }

    // Função para deletar livro usando o ID
    function deleteLivro(id, row) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar livro: ' + response.statusText);
            }
            alert('Livro deletado com sucesso!');
            row.remove();
        })
        .catch(error => console.error('Erro ao deletar livro:', error));
    }

    // Função para editar livro
    function editLivro(id) {
        const row = document.querySelector(`.edit-btn[data-id="${id}"]`).closest('tr');
        const nomeAtual = row.querySelector('.nome').textContent;
        const anotacaoAtual = row.querySelector('.anotacao').textContent;
        const notaAtual = row.querySelector('.nota').textContent;

        const novoNome = prompt("Editar Nome:", nomeAtual);
        const novaAnotacao = prompt("Editar Anotação:", anotacaoAtual);
        const novaNota = prompt("Editar Nota (1-10):", notaAtual);

        if (novoNome && novaAnotacao && novaNota >= 1 && novaNota <= 10) {
            const updatedLivro = {
                nome: novoNome,
                anotacao: novaAnotacao,
                nota: parseInt(novaNota)
            };

            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedLivro)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao editar livro: ' + response.statusText);
                }
                alert("Livro atualizado com sucesso!");
                row.querySelector('.nome').textContent = novoNome;
                row.querySelector('.anotacao').textContent = novaAnotacao;
                row.querySelector('.nota').textContent = novaNota;
            })
            .catch(error => console.error('Erro ao editar livro:', error));
        } else {
            alert("Dados inválidos ou operação cancelada.");
        }
    }

    // Carregar livros ao iniciar
    carregarLivros();
});
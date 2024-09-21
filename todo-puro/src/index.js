let form = document.getElementById('form');
let input = document.getElementById('task');
const list = document.getElementById('list');

let itemToUpdate = null; // Variável para armazenar o item a ser atualizado
let currentId = null; // ID da tarefa atual a ser atualizada

// Função para deletar o item
function deleteItem(id) {
    console.log(`Deletando item com ID: ${id}`); // Verifica o ID que está sendo passado
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
    }).then(() => loadTasks()) // Recarrega as tarefas após a exclusão
      .catch(err => console.error('Erro ao deletar:', err));
}

// Função para abrir o modal de update
function updateItem(id, text) {
    currentId = id; // Armazena o ID da tarefa a ser atualizada
    document.getElementById('updateInput').value = text; // Preenche o input com a tarefa atual

    const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
    updateModal.show(); // Abre o modal
}

// Função para carregar as tarefas
async function loadTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();
        console.log(tasks); // Log das tarefas carregadas
        list.innerHTML = ''; // Limpa a lista antes de adicionar
        tasks.forEach(task => {
            list.insertAdjacentHTML('beforeend', `
                <li class="item mb-2" data-id="${task.id}">
                    <span>${task.text}</span>
                    <div>
                        <span class="me-3" style="cursor:pointer;" onClick="deleteItem(${task.id})">
                            <img src="../assets/svg/lixeira.svg" alt="lixeira">
                        </span>
                        <span style="cursor:pointer;" onClick="updateItem(${task.id}, '${task.text.replace(/'/g, "\\'")}')">
                            <img src="../assets/svg/pencil.svg" width="20px" alt="pencil">
                        </span>
                    </div>
                </li>
            `);
        });
    } catch (error) {
        console.error('Erro ao carregar as tarefas:', error);
    }
}

// Evento para adicionar uma nova tarefa
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = input.value;

    if (inputValue.trim() === '') {
        return alert("Escreva a tarefa antes de enviar");
    }

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputValue })
    }).then(() => {
        input.value = '';
        loadTasks(); // Recarrega as tarefas
    });
});

// Evento para salvar a atualização
document.getElementById('saveUpdate').addEventListener('click', () => {
    const updatedValue = document.getElementById('updateInput').value;
    
    if (updatedValue.trim() !== '') {
        fetch(`http://localhost:3000/tasks/${currentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: updatedValue })
        }).then(() => {
            const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
            updateModal.hide(); // Fecha o modal
            loadTasks(); // Recarrega as tarefas
        });
    } else {
        alert("Escreva algo para atualizar a tarefa");
    }
});

// Carrega as tarefas ao iniciar
loadTasks();

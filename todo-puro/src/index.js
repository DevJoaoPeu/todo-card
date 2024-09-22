class TaskManager {
    constructor() {
        this.form = document.getElementById('form');
        this.input = document.getElementById('task');
        this.list = document.getElementById('list');
        this.url = 'http://localhost:3000/tasks';
        this.modal = new bootstrap.Modal(document.getElementById('updateModal'));
        this.closeModal = document.querySelector('button[data-bs-dismiss="modal"]')
        this.inputModal = document.getElementById('updateInput')
        this.currentId = null;

        this.init();
    }

    init() {
        this.loadTasks();
        this.form.addEventListener('submit', (e) => this.addTask(e));
        this.closeModal.addEventListener('click', () => this.closeModalMetod())
        this.list.addEventListener('click', (e) => this.handleListClick(e));
        document.getElementById('saveUpdate').addEventListener('click', () => this.updateTask());
    }

    async loadTasks() {
        try {
            const response = await axios.get(this.url);
            const tasks = response.data;
            this.list.innerHTML = ''; 
            tasks.forEach(task => {
                this.list.insertAdjacentHTML('beforeend', `
                    <li class="item mb-2" data-id="${task.id}">
                        <span>${task.text}</span>
                        <div>
                            <span class="delete-btn me-3" style="cursor:pointer;" data-id="${task.id}">
                                <img src="../assets/svg/lixeira.svg" alt="lixeira">
                            </span>
                            <span style="cursor:pointer;" data-id="${task.id}" class="update-btn" data-text="${task.text}">
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

    async addTask(e) {
        e.preventDefault();
        const inputValue = this.input.value;
        if (inputValue.trim() === '') {
            return alert("Escreva a tarefa antes de enviar");
        }
        
        try {
            await axios.post(this.url, { text: inputValue });
            this.input.value = '';
            this.loadTasks();
        } catch (error) {
            console.error('Erro ao adicionar a tarefa:', error);
        }
    }

    async deleteItem(id) {
        try {
            await axios.delete(`${this.url}/${id}`);
            this.loadTasks();
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
    }

    updateItem(id, text) {
        this.currentId = id; 
        this.inputModal.value = text; 
        this.modal.show(); 
    }

    async updateTask() {
        const updateTask = this.inputModal.value

        if (updateTask.trim() !== '') {
            try {
                await axios.put(`${this.url}/${this.currentId}`, { text: updateTask });
                this.modal.hide(); 
                this.loadTasks();
            } catch (error) {
                console.error('Erro ao atualizar a tarefa:', error);
            }
        } else {
            alert("Escreva algo para atualizar a tarefa");
        }
    }

    handleListClick(e) {
        if (e.target.closest('.delete-btn')) {
            const id = e.target.closest('.delete-btn').getAttribute('data-id');
            this.deleteItem(id);
        }

        if (e.target.closest('.update-btn')) {
            const id = e.target.closest('.update-btn').getAttribute('data-id');
            const text = e.target.closest('.update-btn').getAttribute('data-text');
            this.updateItem(id, text);
        }
    }

    closeModalMetod() {
        this.modal.hide()
    }
}

new TaskManager();

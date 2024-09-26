class TaskManager {
    constructor() {
        this.form = document.getElementById('form');
        this.input = document.getElementById('task');
        this.list = document.getElementById('list');
        this.url = 'http://localhost:3000/items';
        this.modal = new bootstrap.Modal(document.getElementById('updateModal'));
        this.closeModal = document.querySelector('button[data-bs-dismiss="modal"]')
        this.inputModal = document.getElementById('updateInput')
        this.saveNewTaskButton = document.getElementById('saveUpdate')
        this.listTitle = document.getElementById('list-title')
        this.listCompleted = document.getElementById('completed')
        this.completedTitle = document.getElementById('completed-title')

        this.count = 0
        this.currentId = null;

        this.init();
    }

    init() {
    this.loadTasks();
    this.form.addEventListener('submit', (e) => this.addTask(e));
    this.closeModal.addEventListener('click', () => this.closeModalMetod());
    this.saveNewTaskButton.addEventListener('click', () => this.updateTask());
    this.list.addEventListener('click', (e) => this.handleListClick(e));
    this.listCompleted.addEventListener('click', (e) => this.handleListClick(e));
    
    this.checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (e) => {
            const id = e.target.closest('.item').getAttribute('data-id');
            const completed = e.target.checked;
            
            this.updateTaskCompleted(id, completed);
        });
    });
}

 async loadTasks() {
    try {
        const response = await axios.get(this.url);
        const tasks = response.data;
        this.count = tasks.length;

        if (tasks.length === 0) {
            this.listTitle.innerText = 'No tasks defined';
            this.completedTitle.innerText = '';
            return;
        }

        this.listTitle.innerText = `-- To do ${this.count} --`;
        this.list.innerHTML = ''; // Limpa a lista de pendentes
        this.listCompleted.innerHTML = ''; // Limpa a lista de concluídas

        // Renderiza as tarefas nas respectivas listas
        tasks.forEach(task => {
            const taskHTML = `
                <li class="item mb-2" data-id="${task.id}">
                    <span>${task.text}</span>
                    <div class="align-items-center">
                        <input class="check me-3" type="checkbox" ${task.completed ? 'checked' : ''} />
                        <span class="delete-btn me-3" style="cursor:pointer;" data-id="${task.id}">
                            <img src="../assets/svg/lixeira.svg" alt="lixeira">
                        </span>
                        <span style="cursor:pointer;" data-id="${task.id}" class="update-btn" data-text="${task.text}">
                            <img src="../assets/svg/pencil.svg" width="20px" alt="pencil">
                        </span>
                    </div>
                </li>
            `;

            if (task.completed) {
                this.listCompleted.insertAdjacentHTML('beforeend', taskHTML); 
            } else {
                this.list.insertAdjacentHTML('beforeend', taskHTML); 
            }
        });

        this.checkboxes = document.querySelectorAll('.check');
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = e.target.closest('.item').getAttribute('data-id');
                const completed = e.target.checked;

                this.updateTaskCompleted(id, completed);
            });
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
            await axios.post(this.url, { text: inputValue, completed: false });
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

        if (updateTask.trim() === '') {
            alert("Escreva algo para atualizar a tarefa");
            return
        }

        try {
            await axios.put(`${this.url}/${this.currentId}`, { text: updateTask, completed: false });
            this.modal.hide(); 
            this.loadTasks();
        } catch (error) {
            console.error('Erro ao atualizar a tarefa:', error);
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

    async updateTaskCompleted(id, completed) {
        try {
            // Atualiza o status da tarefa no backend
            await axios.patch(`${this.url}/${id}`, { completed });

            // Recarrega as tarefas para atualizar a UI
            this.loadTasks();
        } catch (error) {
            console.error('Erro ao atualizar a tarefa:', error);
        }
    }
    closeModalMetod() {
        this.modal.hide()
    }
}

new TaskManager();

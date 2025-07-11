class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.editingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        const form = document.getElementById('todoForm');
        const statusFilter = document.getElementById('statusFilter');
        const deleteAllBtn = document.getElementById('deleteAllBtn');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        statusFilter.addEventListener('change', (e) => this.handleFilter(e));
        deleteAllBtn.addEventListener('click', () => this.deleteAll());
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        setTimeout(() => {
            notification.textContent = '';
            notification.className = 'notification';
        }, 2500);
    }

    handleSubmit(e) {
        e.preventDefault();
        const taskInput = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput');
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = '';
        const taskText = taskInput.value.trim();
        const dueDate = dateInput.value;
        if (!taskText) {
            this.showError('Yuk, isi dulu nama to-do-nya!');
            return;
        }
        if (!dueDate) {
            this.showError('Tanggal to-do-nya jangan lupa diisi ya!');
            return;
        }
        const today = new Date();
        const selectedDate = new Date(dueDate);
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            this.showError('Tanggalnya jangan di masa lalu dong!');
            return;
        }
        const todo = {
            id: Date.now(),
            text: taskText,
            date: dueDate,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        this.todos.push(todo);
        this.saveTodos();
        this.render();
        this.showNotification('To-do baru berhasil ditambah! Semangat ya!', 'success');
        taskInput.value = '';
        dateInput.value = '';
        taskInput.focus();
    }

    handleFilter(e) {
        this.currentFilter = e.target.value;
        this.render();
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        setTimeout(() => {
            errorMessage.textContent = '';
        }, 3000);
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
        this.showNotification('To-do sudah dihapus. Good job!', 'danger');
    }

    toggleComplete(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.status = todo.status === 'pending' ? 'completed' : 'pending';
            this.saveTodos();
            this.render();
            this.showNotification(todo.status === 'completed' ? 'Yeay, to-do selesai!' : 'To-do diubah jadi belum selesai.', 'success');
        }
    }

    deleteAll() {
        if (this.todos.length === 0) return;
        if (confirm('Kamu yakin mau hapus semua to-do?')) {
            this.todos = [];
            this.saveTodos();
            this.render();
            this.showNotification('Semua to-do sudah dihapus. Mulai dari awal lagi, yuk!', 'danger');
        }
    }

    getFilteredTodos() {
        if (this.currentFilter === 'all') {
            return this.todos;
        }
        if (this.currentFilter === 'pending') {
            return this.todos.filter(todo => todo.status === 'pending');
        }
        if (this.currentFilter === 'completed') {
            return this.todos.filter(todo => todo.status === 'completed');
        }
        return this.todos;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();
        if (filteredTodos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <p>Belum ada to-do nih. Yuk, tambah sekarang!</p>
                </div>
            `;
            return;
        }
        todoList.innerHTML = filteredTodos.map(todo => {
            if (this.editingId === todo.id) {
                return `
                <div class="todo-item ${todo.status}">
                    <div class="task-text">
                        <input type="text" id="editText${todo.id}" value="${this.escapeHtml(todo.text)}" class="edit-input" placeholder="Edit nama to-do..." />
                    </div>
                    <div class="task-date">
                        <input type="date" id="editDate${todo.id}" value="${todo.date}" class="edit-input" />
                    </div>
                    <div class="task-status">
                        <span class="status-badge ${todo.status}">${todo.status === 'completed' ? 'Sudah Selesai' : 'Belum Selesai'}</span>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn save-btn" title="Simpan" onclick="todoApp.saveEdit(${todo.id})"><span class="icon">💾</span></button>
                        <button class="action-btn cancel-btn" title="Batal" onclick="todoApp.cancelEdit()"><span class="icon">✖️</span></button>
                    </div>
                </div>
                `;
            } else {
                return `
                <div class="todo-item ${todo.status}">
                    <div class="task-text">${this.escapeHtml(todo.text)}</div>
                    <div class="task-date">${this.formatDate(todo.date)}</div>
                    <div class="task-status">
                        <span class="status-badge ${todo.status}">${todo.status === 'completed' ? 'Sudah Selesai' : 'Belum Selesai'}</span>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn edit-btn" title="Edit" onclick="todoApp.startEdit(${todo.id})"><span class="icon">✏️</span></button>
                        <button class="action-btn complete-btn" title="Selesai" onclick="todoApp.toggleComplete(${todo.id})" ${todo.status === 'completed' ? 'disabled' : ''}><span class="icon">✔️</span></button>
                        <button class="action-btn delete-btn" title="Hapus" onclick="todoApp.deleteTodo(${todo.id})"><span class="icon">🗑️</span></button>
                    </div>
                </div>
                `;
            }
        }).join('');
    }

    startEdit(id) {
        this.editingId = id;
        this.render();
        setTimeout(() => {
            const input = document.getElementById('editText' + id);
            if (input) input.focus();
        }, 100);
    }

    saveEdit(id) {
        const textInput = document.getElementById('editText' + id);
        const dateInput = document.getElementById('editDate' + id);
        if (!textInput || !dateInput) return;
        const newText = textInput.value.trim();
        const newDate = dateInput.value.trim();
        if (!newText || !newDate) {
            this.showNotification('Nama dan tanggal to-do nggak boleh kosong ya!', 'danger');
            return;
        }
        const today = new Date();
        const selectedDate = new Date(newDate);
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            this.showNotification('Tanggalnya jangan di masa lalu dong!', 'danger');
            return;
        }
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = newText;
            todo.date = newDate;
            this.saveTodos();
            this.editingId = null;
            this.render();
            this.showNotification('To-do berhasil diupdate!', 'success');
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.render();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

const todoApp = new TodoApp();
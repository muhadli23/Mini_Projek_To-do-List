document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const filterArea = document.querySelector('.filter-area');
    const taskCount = document.getElementById('task-count');
    const clearCompletedBtn = document.getElementById('clear-completed');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function updateTaskCount() {
        const count = todos.filter(todo => !todo.completed).length;
        taskCount.textContent = count + ' tugas tersisa';
    }

    function renderTodos() {
        list.innerHTML = '';
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }
        filteredTodos.forEach((todo, idx) => {
            const li = document.createElement('li');
            if (todo.completed) li.classList.add('completed');
            const span = document.createElement('span');
            span.textContent = todo.text;
            span.style.cursor = 'pointer';
            span.onclick = () => {
                const realIdx = todos.indexOf(todo);
                todos[realIdx].completed = !todos[realIdx].completed;
                saveTodos();
                renderTodos();
            };
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Hapus';
            delBtn.className = 'delete-btn';
            delBtn.onclick = () => {
                const realIdx = todos.indexOf(todo);
                todos.splice(realIdx, 1);
                saveTodos();
                renderTodos();
            };
            li.appendChild(span);
            li.appendChild(delBtn);
            list.appendChild(li);
        });
        updateTaskCount();
    }

    if (filterArea) {
        filterArea.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                renderTodos();
            }
        });
    }

    if (clearCompletedBtn) {
        clearCompletedBtn.onclick = function() {
            todos = todos.filter(todo => !todo.completed);
            saveTodos();
            renderTodos();
        };
    }

    form.onsubmit = function(e) {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            saveTodos();
            renderTodos();
            input.value = '';
        }
    };

    renderTodos();
});
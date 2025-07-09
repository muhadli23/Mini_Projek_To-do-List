// ... Logika utama to-do list ...
document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dateInput = document.getElementById('date-input');
    const todoList = document.getElementById('todo-list');
    const filter = document.getElementById('filter');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        let filtered = todos;
        const todayStr = new Date().toISOString().split('T')[0];
        if (filter.value === 'today') {
            filtered = todos.filter(t => t.date === todayStr);
        } else if (filter.value === 'upcoming') {
            filtered = todos.filter(t => t.date > todayStr);
        }
        filtered.forEach((todo, idx) => {
            const li = document.createElement('li');
            if (todo.done) li.classList.add('done');
            const info = document.createElement('div');
            info.className = 'todo-info';
            info.innerHTML = `<span>${todo.text}</span><span class="todo-date">${todo.date}</span>`;
            li.appendChild(info);
            // Tombol Edit
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.onclick = (e) => {
                e.stopPropagation();
                // Form edit sederhana
                li.innerHTML = '';
                const editForm = document.createElement('form');
                editForm.className = 'edit-form';
                const editText = document.createElement('input');
                editText.type = 'text';
                editText.value = todo.text;
                editText.required = true;
                const editDate = document.createElement('input');
                editDate.type = 'date';
                editDate.value = todo.date;
                editDate.required = true;
                const saveBtn = document.createElement('button');
                saveBtn.type = 'submit';
                saveBtn.textContent = 'Simpan';
                const cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.textContent = 'Batal';
                cancelBtn.onclick = (ev) => {
                    ev.preventDefault();
                    renderTodos();
                };
                editForm.append(editText, editDate, saveBtn, cancelBtn);
                editForm.onsubmit = (ev) => {
                    ev.preventDefault();
                    todo.text = editText.value.trim();
                    todo.date = editDate.value;
                    saveTodos();
                    renderTodos();
                };
                li.appendChild(editForm);
            };
            li.appendChild(editBtn);
            // Tombol Hapus
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = 'Hapus';
            delBtn.onclick = (e) => {
                e.stopPropagation();
                todos.splice(idx, 1);
                saveTodos();
                renderTodos();
            };
            li.appendChild(delBtn);
            li.onclick = (e) => {
                if (e.target !== delBtn && e.target !== editBtn) {
                    todo.done = !todo.done;
                    saveTodos();
                    renderTodos();
                }
            };
            todoList.appendChild(li);
        });
    }

    todoForm.onsubmit = function(e) {
        e.preventDefault();
        const text = todoInput.value.trim();
        const date = dateInput.value;
        if (!text || !date) return;
        todos.push({ text, date, done: false });
        saveTodos();
        renderTodos();
        todoForm.reset();
    };

    filter.onchange = renderTodos;

    renderTodos();
});

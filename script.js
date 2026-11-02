
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filterButtons = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");

let todos = [
    { id: 1, text: "See Lecture", completed: false },
    { id: 2, text: "Solve assignment", completed: false }
];

let currentFilter = "all";
let nextId = 3;

// Add a new task
todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = todoInput.value.trim();

    if (text === "") {
        todoInput.focus();
        return;
    }

    todos.push({
        id: nextId++,
        text: text,
        completed: false
    });

    todoInput.value = "";
    renderTodos();
    todoInput.focus();
});

// Display tasks according to the selected filter
function renderTodos() {
    todoList.innerHTML = "";

    const filteredTodos = todos.filter(function (todo) {
        if (currentFilter === "active") {
            return !todo.completed;
        }

        if (currentFilter === "completed") {
            return todo.completed;
        }

        return true;
    });

    filteredTodos.forEach(function (todo) {
        const li = document.createElement("li");
        li.className = "todo-item";

        if (todo.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todo-checkbox";
        checkbox.checked = todo.completed;
        checkbox.setAttribute("aria-label", "Mark task completed");

        checkbox.addEventListener("change", function () {
            todo.completed = checkbox.checked;
            renderTodos();
        });

        // Task text
        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = todo.text;
        span.title = "Double-click to edit";

        // Double-click to edit
        span.addEventListener("dblclick", function () {
            startEditing(todo, li);
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "▤";
        deleteBtn.setAttribute("aria-label", "Delete task");
        deleteBtn.title = "Delete task";

        deleteBtn.addEventListener("click", function () {
            todos = todos.filter(function (item) {
                return item.id !== todo.id;
            });

            renderTodos();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });

    // Count incomplete tasks
    const remaining = todos.filter(function (todo) {
        return !todo.completed;
    }).length;

    itemsLeft.textContent =
        remaining + (remaining === 1 ? " item left" : " items left");
}

// Edit a task
function startEditing(todo, li) {
    const span = li.querySelector(".todo-text");

    if (!span) return;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = todo.text;

    span.replaceWith(input);
    input.focus();
    input.select();

    let finished = false;

    function saveEdit() {
        if (finished) return;
        finished = true;

        const newText = input.value.trim();

        if (newText !== "") {
            todo.text = newText;
        }

        renderTodos();
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            saveEdit();
        }

        if (event.key === "Escape") {
            finished = true;
            renderTodos();
        }
    });

    input.addEventListener("blur", saveEdit);
}

// Switch between All, Active, and Completed
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        renderTodos();
    });
});

// Remove completed tasks
clearCompletedBtn.addEventListener("click", function () {
    todos = todos.filter(function (todo) {
        return !todo.completed;
    });

    renderTodos();
});

// Remove all tasks
clearAllBtn.addEventListener("click", function () {
    todos = [];
    renderTodos();
});

// Initial display
renderTodos();

const todoform = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateTodoList();
console.log(allTodos);

todoform.addEventListener('submit', function(e){
    e.preventDefault();
    addTodo();
})

function addTodo(){
    const todoText = todoInput.value.trim();
    if(todoText.length > 0){
        const todoObject = {
            text: todoText,
            completed: false
        }
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        alert(todoText);
    }else{
        alert("Your have to input a text before submission")
    }

}
function updateTodoList(){
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex)=> {
        todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    })

    attachDragEvents();
}
function createTodoItem(todo, todoIndex){
    const todoId = "todo-" + todoIndex;
    const todoLI  = document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}">
                <label class="custom-checkbox" for="${todoId}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="transparent"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                </label>
                <label for="${todoId}" class="todo_text" draggable = "true">
                    ${todoText}
                </label>
                <button class="delete-button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--secondary-color)"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
    `;
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click",()=>{
        deleteTodoItem(todoIndex);
    })
    // todoLI.innerText = todo;
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change",()=>{
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
        // deleteTodoItem(todoIndex); //
    })
    checkbox.checked = todo.completed;
    return todoLI;
}

function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
}

function saveTodos(){
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

function attachDragEvents() {
    const draggables = document.querySelectorAll('.todo_text');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
            console.log('dragstart');
          
        });
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            // Reorder the allTodos array based on the new order in the DOM
            const newOrder = Array.from(todoListUL.querySelectorAll('.todo_text')).map(item => item.textContent.trim());
            allTodos = newOrder.map(text => allTodos.find(todo => todo.text === text));
            saveTodos();
        });
        if(draggable.classList.add('dragging')){
            console.log('dragging');
        }else if (draggable.classList.remove('dragging')){
            console.log('dragend');
            
        } else {
            draggable.style.cursor = 'pointer';
        }
    });

    todoListUL.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(todoListUL, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            todoListUL.appendChild(draggable.closest('.todo'));
        } else {
            todoListUL.insertBefore(draggable.closest('.todo'), afterElement);
        }
    });
    console.log('dragover');
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
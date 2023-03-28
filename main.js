"use strict";

const todoForm = document.querySelector("[data-form]"),
todoInput = document.querySelector("[data-input]"),
todoContainer = document.querySelector("[data-todo-container]"),
addButton = document.querySelector("[data-add]"),
deleteAll = document.querySelector("[data-del-all]"),
filters = document.querySelectorAll("[data-filter]");

// getting value from localstorage if value not in localstorage then setting to emplty array and parsing into array from json string
const allTodos = JSON.parse(localStorage.getItem("todos")) ||  [];
let isEdited = false;
let editId;

// mapping all localstorage todos
const displayTodos = (allTasks) => {
    if(allTasks.length < 1){
        todoContainer.innerHTML = "<div style='text-align: center'>Currently no Task added</div>";
        return;
    } else {
        todoContainer.innerHTML = allTasks.map((task) => {
            return `
            <li class="todo">
                <div class="details" data-details>
                    <label onClick="changeTaskStatus(this)" for="${task.id}" class="${task.status === "completed" ? "done" : "pending"}" >${task.taskName}</label>
                </div>
                <div class="actions">
                    <button onClick="editTodod(${task.id}, this)"><i class='bx bx-edit'></i></button>
                    <button onClick="deleteTodod(${task.id})"><i class='bx bx-trash'></i></button>
                </div>
            </li>
            `
        }).join("");
    }

}

// upding todos on loading 
window.addEventListener("DOMContentLoaded", () => {
    displayTodos(allTodos);
});

// saving in localstorage
const saveInLocalStorage = (task) => {
    localStorage.setItem("todos", JSON.stringify(task));
}

// onsubmission on todo form
todoForm.addEventListener("submit", (e) => {
    // preventing default behaviour of submit
    e.preventDefault();
    // getting types input
    const todoInputValue = todoInput.value;
    if(!todoInputValue){
        return;
    }

    // creating object of typed value with id and status
    const task = {
        id: Date.now(),
        taskName: todoInputValue,
        status: "pending"
    };

    if(isEdited){
        allTodos.forEach((todo) => {
            if(todo.id === editId){
                todo.taskName = todoInputValue;
                
            }
        });
        addButton.textContent = "Add";
        isEdited = false;
    } else {
        // pushing task in array
        allTodos.push(task);
    }

    // saving in localstorage
    saveInLocalStorage(allTodos);
    displayTodos(allTodos);

    // clearing input value
    todoInput.value = "";
});

// changing task status to completed or pending on clcik on task
function changeTaskStatus(selected) {
    const id = +selected.getAttribute("for");

    allTodos.forEach((task) => {
        if(task.id === id){
            task.status = task.status === "pending" ? "completed" : "pending";
        }    
    });

    saveInLocalStorage(allTodos);
    displayTodos(allTodos);
}

// deleting task on click of delete button
const deleteTodod = (selectedId) => {
    allTodos.forEach((task, index) => {
        if(task.id === selectedId){
            allTodos.splice(index, 1);
        }
    });

    saveInLocalStorage(allTodos);
    displayTodos(allTodos);
}

// editing task 
const editTodod = (selectedId, selected) => {
    const parent = selected.parentElement.parentElement;
    const label = parent.querySelector("label");
    editId = selectedId;

    if(label.classList.contains("done")){
        alert("completed task don't get edited");
        return;
    }

    todoInput.value = label.textContent;
    addButton.textContent = "Update";
    isEdited = true;
}

// deleting all the existing todos and same saving in localstorage also
deleteAll.addEventListener("click", () => {
    allTodos.splice(0, allTodos.length);

    saveInLocalStorage(allTodos);
    displayTodos(allTodos);
});

// simple utility function
const resetClass = () => {
    filters.forEach((filter) => {
        filter.classList.remove("active");
    });
}

// filtering todo based on selection
filters.forEach((filter) => {
    filter.addEventListener("click", () => {
        resetClass();
        filter.classList.add("active");

        if(filter.textContent === "All"){
            displayTodos(allTodos);
        } else {
            displayTodos(
                allTodos.filter((todo) => todo.status.toUpperCase() === filter.textContent.toUpperCase())
            )
        }
    });
});
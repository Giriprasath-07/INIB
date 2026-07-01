let taskInput =
    document.getElementById("taskInput");

let taskList =
    document.getElementById("taskList");

let totalTasks =
    document.getElementById("totalTasks");

let completedTasks =
    document.getElementById("completedTasks");

/* ================= LOAD TASKS ================= */

window.onload = function(){

    loadTasks();

    updateStats();
};

/* ================= ADD TASK ================= */

function addTask(){

    let taskText =
        taskInput.value.trim();

    if(taskText === ""){

        alert("Please enter a task!");

        return;
    }

    createTask(taskText);

    updateLocalStorage();

    updateStats();

    taskInput.value = "";
}

/* ================= CREATE TASK ================= */

function createTask(taskText, completed = false){

    let li =
        document.createElement("li");

    li.classList.add("task-item");

    // TASK TEXT

    let span =
        document.createElement("span");

    span.classList.add("task-text");

    span.innerText = taskText;

    if(completed){

        span.classList.add("completed");
    }

    // ACTIONS

    let actions =
        document.createElement("div");

    actions.classList.add("actions");

    // COMPLETE BUTTON

    let completeBtn =
        document.createElement("button");

    completeBtn.innerText = "Done";

    completeBtn.classList.add("complete-btn");

    completeBtn.onclick = function(){

        span.classList.toggle("completed");

        updateLocalStorage();

        updateStats();
    };

    // DELETE BUTTON

    let deleteBtn =
        document.createElement("button");

    deleteBtn.innerText = "Delete";

    deleteBtn.classList.add("delete-btn");

    deleteBtn.onclick = function(){

        li.remove();

        updateLocalStorage();

        updateStats();
    };

    // APPEND

    actions.appendChild(completeBtn);

    actions.appendChild(deleteBtn);

    li.appendChild(span);

    li.appendChild(actions);

    taskList.appendChild(li);
}

/* ================= UPDATE STORAGE ================= */

function updateLocalStorage(){

    let tasks = [];

    document.querySelectorAll(".task-item")
    .forEach(task => {

        tasks.push({

            text:
                task.querySelector(".task-text")
                .innerText,

            completed:
                task.querySelector(".task-text")
                .classList.contains("completed")
        });
    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* ================= LOAD TASKS ================= */

function loadTasks(){

    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    tasks.forEach(task => {

        createTask(
            task.text,
            task.completed
        );
    });
}

/* ================= UPDATE STATS ================= */

function updateStats(){

    let tasks =
        document.querySelectorAll(".task-item");

    let completed =
        document.querySelectorAll(".completed");

    totalTasks.innerText =
        tasks.length;

    completedTasks.innerText =
        completed.length;
}

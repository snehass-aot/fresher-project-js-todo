document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const editTaskForm = document.getElementById("editTaskForm");
    const taskList = document.getElementById("taskList");
    const completedTaskList = document.getElementById("completedTaskList");
    const clearCompletedBtn = document.getElementById("clearCompleted");
    const sortTasks = document.getElementById("sortTasks");
    const searchTask = document.getElementById("searchTask");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentEditTaskId = null;

    function addTask(title, description, dueDate) {
        const newTask = {
            id: Date.now(),
            title: title,
            description: description,
            dueDate: dueDate,
            completed: false,
        };
        tasks.push(newTask);
        saveTasks();
        displayTasks();
    }

    function updateTask(taskId, title, description, dueDate) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;
            saveTasks();
            displayTasks();
        }
    }

    function removeTask(taskId) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        displayTasks();
    }

    function clearCompletedTasks() {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        displayTasks();
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function displayTasks() {
        taskList.innerHTML = "";
        completedTaskList.innerHTML = "";

        const sortedTasks = sortTasks.value === "newest"
            ? [...tasks].sort((a, b) => b.id - a.id)
            : [...tasks].sort((a, b) => a.id - b.id);

        sortedTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.className = 'list-group-item border-top ';
            taskItem.innerHTML = `
     <div class="checkbox-container">
    <div>
      <input class="checkbox" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete(${task.id})">
    </div>
    <div>
            <span class="task-head">${task.title}</span> ${task.completed ? '<i style="color: #26AD13;" class="bi bi-circle-fill"></i>' : '<i style="color: #EBB705;" class="bi bi-circle-fill"></i>'}<br>
    <span class="list-description">${task.description}</span> <br>
    <small class=" ${task.completed ? 'text-muted' : 'text-pending'}"><i class="bi bi-calendar4-week" style="${task.completed ? '' : 'color: red;'}"></i> by ${task.dueDate}</small>
    </div>
    
</div>

                <div class="list-btn-icons">
                    <i class="bi bi-pencil-fill" style="cursor: pointer;" onclick="showEditModal(${task.id})"></i>
                    <i class="bi bi-trash" style="cursor: pointer;" onclick="showDeleteModal(${task.id})"></i>
                </div>
            `;

            if (task.completed) {
                completedTaskList.appendChild(taskItem);
            } else {
                taskList.appendChild(taskItem);
            }
        });
    }

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = taskForm.elements.taskTitle.value.trim();
        const description = taskForm.elements.taskDescription.value.trim();
        const dueDate = taskForm.elements.taskDueDate.value.trim();

        if (title === "") {
            alert("Please enter a title for the task.");
            return;
        }

        addTask(title, description, dueDate);
        $('#addTaskModal').modal('hide');
        taskForm.reset();
    });

    editTaskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = editTaskForm.elements.editTaskTitle.value.trim();
        const description = editTaskForm.elements.editTaskDescription.value.trim();
        const dueDate = editTaskForm.elements.editTaskDueDate.value.trim();

        updateTask(currentEditTaskId, title, description, dueDate);
        $('#editTaskModal').modal('hide');
        editTaskForm.reset();
    });

    clearCompletedBtn.addEventListener("click", function () {
        clearCompletedTasks();
    });

    sortTasks.addEventListener("change", function () {
        displayTasks();
    });

    searchTask.addEventListener("input", function (e) {
        const searchValue = e.target.value.trim().toLowerCase();
        if (searchValue === "") {
            displayTasks();
            return;
        }

        const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchValue));
        displayFilteredTasks(filteredTasks);
    });

    function displayFilteredTasks(filteredTasks) {
        taskList.innerHTML = "";
        completedTaskList.innerHTML = "";

        filteredTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.className = 'list-group-item';
            taskItem.innerHTML = `
                <div>
                    <input class="checkbox" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete(${task.id})">
                    <span>${task.title}</span> <span><img src="Ellipse2.svg"></span> <br>
                    <span class="list-description">${task.description}</span> <br>
                    <small class="text-muted"><i class="bi bi-calendar4-week"></i> by ${task.dueDate}</small>
                </div>
                <div class="list-btn-icons">
                    <i class="bi bi-pencil-fill" style="cursor: pointer;" onclick="showEditModal(${task.id})"></i>
                    <i class="bi bi-trash" style="cursor: pointer;" onclick="showDeleteModal(${task.id})"></i>
                </div>
            `;

            if (task.completed) {
                completedTaskList.appendChild(taskItem);
            } else {
                taskList.appendChild(taskItem);
            }
        });
    }

    window.showEditModal = function (taskId) {
        currentEditTaskId = taskId;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            document.getElementById("editTaskTitle").value = task.title;
            document.getElementById("editTaskDescription").value = task.description;
            document.getElementById("editTaskDueDate").value = task.dueDate;
            $('#editTaskModal').modal('show');
        }
    }

    window.showDeleteModal = function (taskId) {
        currentEditTaskId = taskId;
        $('#deleteTaskModal').modal('show');
    }

    document.getElementById("confirmDelete").addEventListener("click", function () {
        removeTask(currentEditTaskId);
        $('#deleteTaskModal').modal('hide');
    });

    window.toggleTaskComplete = function (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            displayTasks();
        }
    }

    displayTasks();
});
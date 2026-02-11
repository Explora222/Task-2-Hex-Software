const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTasks() {
    
    taskList.innerHTML = '';
    
   
    if (tasks.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        
        
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.setAttribute('data-id', task.id);
            
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
            
            
            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;
            
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.setAttribute('aria-label', 'Delete task');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteBtn);
            
            taskList.appendChild(taskItem);
        });
    }
}

/**
 * Add a new task
 * @param {string} text - Task description
 */
function addTask(text) {
    // Create new task object
    const newTask = {
        id: Date.now(), // Unique ID using timestamp
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Add to tasks array
    tasks.unshift(newTask); // Add to beginning of array
    
    // Save and re-render
    saveTasks();
    renderTasks();
    
    // Clear input and focus back
    taskInput.value = '';
    taskInput.focus();
}

/**
 * Toggle task completed status
 * @param {number} id - Task ID
 */
function toggleTaskStatus(id) {
    // Find task and toggle completed status
    tasks = tasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
    );
    
    // Save and re-render
    saveTasks();
    renderTasks();
}

/**
 * Delete a task
 * @param {number} id - Task ID
 */
function deleteTask(id) {
    // Find the task element to animate
    const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
    
    if (taskElement) {
        // Add delete animation class
        taskElement.classList.add('delete');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            // Filter out the task to delete
            tasks = tasks.filter(task => task.id !== id);
            
            // Save and re-render
            saveTasks();
            renderTasks();
        }, 500); // Match CSS animation duration
    }
}

/**
 * Initialize the application
 */
function init() {
    // Render initial tasks
    renderTasks();
    
    // Form submission event
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        
        if (taskText) {
            addTask(taskText);
        }
    });
    
    // Focus on input field on page load
    taskInput.focus();
    
    // Add keyboard shortcut for adding tasks (Ctrl + Enter)
    taskInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            taskForm.requestSubmit();
        }
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
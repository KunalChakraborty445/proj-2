 document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.getElementById('taskInput');
            const addBtn = document.getElementById('addBtn');
            const taskList = document.getElementById('taskList');
            const emptyState = document.getElementById('emptyState');
            const filterBtns = document.querySelectorAll('.filter-btn');
            const totalTasksSpan = document.getElementById('totalTasks');
            const completedTasksSpan = document.getElementById('completedTasks');
            
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let currentFilter = 'all';
            
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            
            function updateStats() {
                const totalTasks = tasks.length;
                const completedTasks = tasks.filter(task => task.completed).length;
                
                totalTasksSpan.textContent = `Total: ${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
                completedTasksSpan.textContent = `Completed: ${completedTasks} task${completedTasks !== 1 ? 's' : ''}`;
            }
            
            function renderTasks() {
                taskList.innerHTML = '';
                
                const filteredTasks = tasks.filter(task => {
                    if (currentFilter === 'active') return !task.completed;
                    if (currentFilter === 'completed') return task.completed;
                    return true;
                });
                
                if (filteredTasks.length === 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                    
                    filteredTasks.forEach((task, index) => {
                        const taskItem = document.createElement('li');
                        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                        
                        taskItem.innerHTML = `
                            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                            <span class="task-text">${task.text}</span>
                            <button class="delete-btn">Delete</button>
                        `;
                        
                        const checkbox = taskItem.querySelector('.task-checkbox');
                        const deleteBtn = taskItem.querySelector('.delete-btn');
                        
                        checkbox.addEventListener('change', function() {
                            task.completed = this.checked;
                            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                            saveTasks();
                            updateStats();
                        });
                        
                        deleteBtn.addEventListener('click', function() {
                            tasks.splice(tasks.indexOf(task), 1);
                            saveTasks();
                            renderTasks();
                            updateStats();
                        });
                        
                        taskList.appendChild(taskItem);
                    });
                }
                
                updateStats();
            }
            
            function addTask() {
                const text = taskInput.value.trim();
                
                if (text === '') {
                    alert('Please enter a task!');
                    return;
                }
                
                const newTask = {
                    id: Date.now(),
                    text: text,
                    completed: false
                };
                
                tasks.push(newTask);
                saveTasks();
                taskInput.value = '';
                renderTasks();
            }
            
            addBtn.addEventListener('click', addTask);
            
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTask();
                }
            });
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.getAttribute('data-filter');
                    renderTasks();
                });
            });
            
            renderTasks();
        });
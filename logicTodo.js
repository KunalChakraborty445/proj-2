 document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.getElementById('taskInput');
            const addBtn = document.getElementById('addBtn');
            const taskList = document.getElementById('taskList');
            const emptyState = document.getElementById('emptyState');
            const filterBtns = document.querySelectorAll('.filter-btn');
            const totalTasksSpan = document.getElementById('totalTasks');
            const completedTasksSpan = document.getElementById('completedTasks');
            const pointsDisplay = document.getElementById('pointsDisplay');
            
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let points = parseInt(localStorage.getItem('points')) || 0;
            let currentFilter = 'all';
            
            // Save tasks to localStorage
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            // Save points to localStorage
            function savePoints() {
                localStorage.setItem('points', points);
            }

            // Update points display
            function updatePointsDisplay() {
                pointsDisplay.textContent = `🏆 ${points} Points`;
            }

            // Show points earned animation
            function showPointsAnimation(pointsEarned) {
                const popup = document.createElement('div');
                popup.className = 'points-popup';
                popup.textContent = `+${pointsEarned} Points! 🎉`;
                document.body.appendChild(popup);

                setTimeout(() => {
                    popup.remove();
                }, 1000);
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
                    
                    filteredTasks.forEach((task) => {
                        const taskItem = document.createElement('li');
                        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                        
                        taskItem.innerHTML = `
                            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                            <span class="task-text">${task.text}</span>
                            <button class="edit-btn">✏️</button>
                            <button class="delete-btn">X</button>
                        `;
                        
                        const checkbox = taskItem.querySelector('.task-checkbox');
                        const deleteBtn = taskItem.querySelector('.delete-btn');
                        const editBtn = taskItem.querySelector('.edit-btn');
                        
                        // Handle checkbox change - Award points!
                        checkbox.addEventListener('change', function() {
                            const wasCompleted = task.completed;
                            task.completed = this.checked;
                            
                            // Award 10 points when task is completed
                            if (task.completed && !wasCompleted) {
                                points += 10;
                                savePoints();
                                updatePointsDisplay();
                                showPointsAnimation(10);
                            }
                            // Remove 10 points if unchecked
                            else if (!task.completed && wasCompleted) {
                                points -= 10;
                                if (points < 0) points = 0; // Don't go negative
                                savePoints();
                                updatePointsDisplay();
                            }
                            
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

                        editBtn.addEventListener('click', () => {
                            const newEditInput = prompt("Edit the task:", task.text);
                            if (newEditInput === null) return; // User cancelled
                            
                            const addNewEdit = newEditInput.trim();
                            if (addNewEdit === "") {
                                alert("Please enter a task!");
                                return;
                            }
                            task.text = addNewEdit; 
                            saveTasks();
                            renderTasks();
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
            
            // Initialize on page load
            updatePointsDisplay();
            renderTasks();
        });
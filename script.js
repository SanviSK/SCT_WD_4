const taskList = document.getElementById('taskList');
const emojis = ["🏆","🚀","🍕","☕","🎉","🐱","💡","🎮"];

function formatTime12h(timeStr) {
  if (!timeStr) return "";
  let [h, m] = timeStr.split(":");
  h = parseInt(h, 10);
  let ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

document.getElementById("addBtn").addEventListener("click", addTask);

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate').value;
  const taskTime = document.getElementById('taskTime').value;

  if(!taskInput.value.trim()) return;

  const task = document.createElement('div');
  task.className = "task";

  let dateBadge = taskDate ? `<span class="badge">📅 ${taskDate}</span>` : "";
  let timeBadge = taskTime ? `<span class="badge">⏰ ${formatTime12h(taskTime)}</span>` : "";

  task.innerHTML = `
    <div class="task-info">
      <p>${taskInput.value}</p>
      <small>${dateBadge} ${timeBadge}</small>
      <div class="status pending">⏳ Pending</div>
    </div>
    <div class="task-actions">
      <button class="done-btn">🎯</button>
      <button class="edit-btn">📝</button>
      <button class="delete-btn">🗑️</button>
    </div>
  `;
  taskList.appendChild(task);

  // Hook actions
  task.querySelector(".done-btn").addEventListener("click", () => markDone(task));
  task.querySelector(".edit-btn").addEventListener("click", () => editTask(task));
  task.querySelector(".delete-btn").addEventListener("click", () => task.remove());

  // Reminder
  if(taskDate && taskTime) {
    scheduleReminder(taskInput.value, taskDate, taskTime);
  }

  taskInput.value = "";
  document.getElementById('taskDate').value = "";
  document.getElementById('taskTime').value = "";
}

function markDone(task) {
  const status = task.querySelector('.status');
  let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  status.textContent = `✅ Task completed successfully ${randomEmoji}`;
  status.classList.remove("pending");
  status.classList.add("done");
}

function editTask(task) {
  const textElem = task.querySelector('p');
  const oldText = textElem.innerText;

  const input = document.createElement("input");
  input.type = "text";
  input.value = oldText;
  input.className = "edit-input";

  textElem.replaceWith(input);
  input.focus();

  function saveEdit() {
    if(input.value.trim() !== "") {
      const newP = document.createElement("p");
      newP.textContent = input.value.trim();
      input.replaceWith(newP);
    } else {
      input.replaceWith(textElem);
    }
  }

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keyup", (e) => {
    if(e.key === "Enter") saveEdit();
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// 🔔 Reminder feature
function scheduleReminder(taskName, date, time) {
  const taskDateTime = new Date(`${date}T${time}`);
  const now = new Date();

  const msUntil = taskDateTime - now;
  if(msUntil > 0) {
    setTimeout(() => {
      alert(`🔔 Reminder: "${taskName}" is due now!`);
    }, msUntil);
  }
}

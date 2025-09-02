// ====== DOM elements ======
const titleInput = document.getElementById('taskTitle');
const dateInput  = document.getElementById('taskDate');
const timeInput  = document.getElementById('taskTime');
const meridiem   = document.getElementById('taskMeridiem');
const addBtn     = document.getElementById('addBtn');
const list       = document.getElementById('list');
const output     = document.getElementById('output');
const darkToggle = document.getElementById('darkToggle');

// Edit modal
const editModal       = document.getElementById('editModal');
const editTitleInput  = document.getElementById('editTitleInput');
const editDateInput   = document.getElementById('editDateInput');
const editTimeInput   = document.getElementById('editTimeInput');
const saveEditBtn     = document.getElementById('saveEditBtn');
const cancelEditBtn   = document.getElementById('cancelEditBtn');

let editingLI = null; // currently editing <li>

// ====== Helpers ======

// always show 12h format from a 24h "HH:MM" string
function format12h(hhmm) {
  if (!hhmm) return '';
  const [hStr, mStr] = hhmm.split(':');
  let h = Number(hStr);
  const m = mStr.padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12; // 0->12, 13->1 ...
  return `${h}:${m} ${ampm}`;
}

// sync AM/PM select to the time field so user sees the right meridiem
timeInput.addEventListener('input', () => {
  const [h] = timeInput.value.split(':').map(Number);
  if (Number.isFinite(h)) meridiem.value = h >= 12 ? 'PM' : 'AM';
});

// Show output/status message
function showMessage(text, kind = 'info') {
  output.className = `output ${kind}`;
  output.textContent = text;
  // auto-clear after 3s (but never set a default "completed" message)
  setTimeout(() => {
    output.textContent = '';
    output.className = 'output';
  }, 3000);
}

// Build one task <li>
function buildItem({ title, date, time }) {
  const li = document.createElement('li');
  li.className = 'item';
  // keep raw values as dataset for easy edit
  li.dataset.title = title;
  li.dataset.date  = date;
  li.dataset.time  = time; // raw 24h

  li.innerHTML = `
    <div class="item-left">
      <div class="item-title">${escapeHtml(title)}</div>
      <div class="item-meta">
        <span class="meta-chip">📅 ${date || '—'}</span>
        <span class="meta-chip">⏰ ${time ? format12h(time) : '—'}</span>
      </div>
    </div>
    <div class="item-actions">
      <button class="btn btn-success act-complete" title="Mark Complete">✅</button>
      <button class="btn btn-warn act-edit" title="Edit">✏️</button>
      <button class="btn btn-danger act-delete" title="Delete">🗑️</button>
    </div>
  `;
  return li;
}

// small XSS-safe escape
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[c]);
}

// ====== Actions ======

// Add task
addBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const date  = dateInput.value;
  const time  = timeInput.value; // browser gives 24h "HH:MM"

  if (!title || !date || !time) {
    showMessage('⚠️ Please fill Title, Date and Time.', 'warn');
    return;
  }

  const li = buildItem({ title, date, time });
  list.prepend(li); // newest first

  // clear inputs
  titleInput.value = '';
  dateInput.value  = '';
  timeInput.value  = '';
  showMessage('✅ Task added successfully!', 'ok');
});

// Clicks inside the list (event delegation)
list.addEventListener('click', (e) => {
  const li = e.target.closest('li.item');
  if (!li) return;

  // complete
  if (e.target.classList.contains('act-complete')) {
    li.classList.add('completed');
    e.target.disabled = true;
    showMessage('🎉 Task completed successfully!', 'ok');
    return;
  }

  // delete
  if (e.target.classList.contains('act-delete')) {
    li.remove();
    showMessage('🗑️ Task deleted!', 'danger');
    return;
  }

  // edit (open modal)
  if (e.target.classList.contains('act-edit')) {
    editingLI = li;
    editTitleInput.value = li.dataset.title || '';
    editDateInput.value  = li.dataset.date  || '';
    editTimeInput.value  = li.dataset.time  || '';
    editModal.classList.add('show');
  }
});

// Save Edit
saveEditBtn.addEventListener('click', () => {
  if (!editingLI) return;
  const nt = editTitleInput.value.trim();
  const nd = editDateInput.value;
  const ntm = editTimeInput.value;

  if (!nt || !nd || !ntm) {
    showMessage('⚠️ Please fill Title, Date and Time to save.', 'warn');
    return;
  }

  // update dataset + visible text
  editingLI.dataset.title = nt;
  editingLI.dataset.date  = nd;
  editingLI.dataset.time  = ntm;

  editingLI.querySelector('.item-title').textContent = nt;
  const meta = editingLI.querySelectorAll('.meta-chip');
  meta[0].textContent = `📅 ${nd}`;
  meta[1].textContent = `⏰ ${format12h(ntm)}`;

  editModal.classList.remove('show');
  editingLI = null;
  showMessage('✏️ Edited successfully!', 'info');
});

// Cancel Edit
cancelEditBtn.addEventListener('click', () => {
  editModal.classList.remove('show');
  editingLI = null;
});

// Close modal on overlay click
editModal.addEventListener('click', (e)=>{
  if (e.target === editModal) {
    editModal.classList.remove('show');
    editingLI = null;
  }
});

// Dark mode toggle
darkToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

// Start with no message shown
output.textContent = '';
output.className = 'output';

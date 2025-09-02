const titleInput = document.getElementById('taskTitle');
const dateInput  = document.getElementById('taskDate');
const timeInput  = document.getElementById('taskTime');
const meridiem   = document.getElementById('taskMeridiem');
const addBtn     = document.getElementById('addBtn');
const list       = document.getElementById('list');
const output     = document.getElementById('output');
const darkToggle = document.getElementById('darkToggle');

const editModal       = document.getElementById('editModal');
const editTitleInput  = document.getElementById('editTitleInput');
const editDateInput   = document.getElementById('editDateInput');
const editTimeInput   = document.getElementById('editTimeInput');
const saveEditBtn     = document.getElementById('saveEditBtn');
const cancelEditBtn   = document.getElementById('cancelEditBtn');

let editingLI = null; 

function format12h(hhmm) {
  if (!hhmm) return '';
  const [hStr, mStr] = hhmm.split(':');
  let h = Number(hStr);
  const m = mStr.padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12; 
  return `${h}:${m} ${ampm}`;
}
timeInput.addEventListener('input', () => {
  const [h] = timeInput.value.split(':').map(Number);
  if (Number.isFinite(h)) meridiem.value = h >= 12 ? 'PM' : 'AM';
});

function showMessage(text, kind = 'info') {
  output.className = `output ${kind}`;
  output.textContent = text;
  setTimeout(() => {
    output.textContent = '';
    output.className = 'output';
  }, 3000);
}

function buildItem({ title, date, time }) {
  const li = document.createElement('li');
  li.className = 'item';
 
  li.dataset.title = title;
  li.dataset.date  = date;
  li.dataset.time  = time; 

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

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[c]);
}

addBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const date  = dateInput.value;
  const time  = timeInput.value; 

  if (!title || !date || !time) {
    showMessage('⚠️ Please fill Title, Date and Time.', 'warn');
    return;
  }

  const li = buildItem({ title, date, time });
  list.prepend(li); 

  titleInput.value = '';
  dateInput.value  = '';
  timeInput.value  = '';
  showMessage('✅ Task added successfully!', 'ok');
});

list.addEventListener('click', (e) => {
  const li = e.target.closest('li.item');
  if (!li) return;

  
  if (e.target.classList.contains('act-complete')) {
    li.classList.add('completed');
    e.target.disabled = true;
    showMessage('🎉 Task completed successfully!', 'ok');
    return;
  }


  if (e.target.classList.contains('act-delete')) {
    li.remove();
    showMessage('🗑️ Task deleted!', 'danger');
    return;
  }

  if (e.target.classList.contains('act-edit')) {
    editingLI = li;
    editTitleInput.value = li.dataset.title || '';
    editDateInput.value  = li.dataset.date  || '';
    editTimeInput.value  = li.dataset.time  || '';
    editModal.classList.add('show');
  }
});

saveEditBtn.addEventListener('click', () => {
  if (!editingLI) return;
  const nt = editTitleInput.value.trim();
  const nd = editDateInput.value;
  const ntm = editTimeInput.value;

  if (!nt || !nd || !ntm) {
    showMessage('⚠️ Please fill Title, Date and Time to save.', 'warn');
    return;
  }

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

cancelEditBtn.addEventListener('click', () => {
  editModal.classList.remove('show');
  editingLI = null;
});

editModal.addEventListener('click', (e)=>{
  if (e.target === editModal) {
    editModal.classList.remove('show');
    editingLI = null;
  }
});

darkToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

output.textContent = '';
output.className = 'output';

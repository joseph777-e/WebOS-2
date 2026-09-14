const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const saveBtn = document.getElementById('save-btn');
const notesList = document.getElementById('notes-list');

const STORAGE_KEY = 'pixelos-notes';

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function renderNotes() {
  const notes = loadNotes();

  if (!notes.length) {
    notesList.innerHTML = '<div class="note-item"><span class="note-title">No notes yet</span><span class="note-preview">Create your first pixel note.</span></div>';
    return;
  }

  notesList.innerHTML = notes.map((note) => `
    <div class="note-item" data-id="${note.id}">
      <div class="note-heading">
        <span class="note-title">${note.title || 'Untitled note'}</span>
        <button class="delete-note" type="button" aria-label="Delete ${note.title || 'untitled note'}">🗑️</button>
      </div>
      <span class="note-preview">${note.content.slice(0, 80) || 'Empty note'}</span>
    </div>
  `).join('');

  notesList.querySelectorAll('.note-item').forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const note = loadNotes().find((entry) => entry.id === id);
      if (!note) return;
      noteTitle.value = note.title;
      noteContent.value = note.content;
    });
  });

  notesList.querySelectorAll('.delete-note').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const noteItem = button.closest('.note-item');
      const notes = loadNotes().filter((note) => note.id !== noteItem.dataset.id);
      saveNotes(notes);
      renderNotes();
    });
  });
}

saveBtn.addEventListener('click', () => {
  const title = noteTitle.value.trim() || 'Untitled note';
  const content = noteContent.value.trim();
  const notes = loadNotes();
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;

  const trimmedNotes = notes.filter((entry) => entry.id !== id);
  trimmedNotes.unshift({ id, title, content });
  saveNotes(trimmedNotes.slice(0, 6));
  renderNotes();
});

renderNotes();

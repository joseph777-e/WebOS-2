const folders = {
  home: [
    { name: 'Project ideas.txt', type: 'text' },
    { name: 'selfie.png', type: 'image' },
    { name: 'music_mix.mp3', type: 'music' },
    { name: 'notes.md', type: 'text' }
  ],
  documents: [
    { name: 'journal.txt', type: 'text' },
    { name: 'todo.md', type: 'text' },
    { name: 'about_me.txt', type: 'text' }
  ],
  pictures: [
    { name: 'wallpaper.jpg', type: 'image' },
    { name: 'pixel_cat.png', type: 'image' },
    { name: 'sky_view.png', type: 'image' }
  ],
  music: [
    { name: 'midnight_drive.mp3', type: 'music' },
    { name: 'sunset_loop.mp3', type: 'music' },
    { name: 'favourite_mix.mp3', type: 'music' }
  ],
  projects: [
    { name: 'pixelos.html', type: 'text' },
    { name: 'game_plan.txt', type: 'text' },
    { name: 'layout_mockup.png', type: 'image' }
  ]
};

const folderNames = {
  home: 'Home',
  documents: 'Documents',
  pictures: 'Pictures',
  music: 'Music',
  projects: 'Projects'
};

const folderEls = document.querySelectorAll('.folder');
const grid = document.getElementById('file-grid');
const breadcrumbs = document.getElementById('breadcrumbs');
const closeBtn = document.querySelector('.close-btn');

closeBtn.addEventListener('click', () => {
  window.parent.postMessage({ appName: 'files', action: 'close' }, window.location.origin);
  window.close();
});

function getIcon(type) {
  if (type === 'image') return '🖼';
  if (type === 'music') return '♫';
  return '📝';
}

function renderFolder(folderName) {
  const items = folders[folderName] || folders.home;
  breadcrumbs.textContent = folderNames[folderName] || 'Home';

  folderEls.forEach((el) => {
    el.classList.toggle('active', el.dataset.folder === folderName);
  });

  grid.innerHTML = items.map((item) => `
    <div class="file-card">
      <div class="file-icon">${getIcon(item.type)}</div>
      <div class="file-name">${item.name}</div>
    </div>
  `).join('');
}

folderEls.forEach((button) => {
  button.addEventListener('click', () => renderFolder(button.dataset.folder));
});

renderFolder('home');

const progressTrack = document.getElementById('progress-track');
const progressFill = document.getElementById('progress-fill');
const progressThumb = document.getElementById('progress-thumb');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const closeBtn = document.querySelector('.close-btn');

const trackDuration = 222; // 3:42
let currentPosition = 12;
let isPlaying = false;

closeBtn.addEventListener('click', () => {
  window.parent.postMessage({ appName: 'music', action: 'close' }, window.location.origin);
  window.close();
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function updateProgress() {
  const ratio = Math.min(Math.max(currentPosition / trackDuration, 0), 1);
  progressFill.style.width = `${ratio * 100}%`;
  progressThumb.style.left = `${ratio * 100}%`;
  currentTimeEl.textContent = formatTime(currentPosition);
}

function togglePlay() {
  isPlaying = !isPlaying;
  playBtn.textContent = isPlaying ? '❚❚' : '▶';
  playBtn.setAttribute('aria-label', isPlaying ? 'Pause track' : 'Play track');
}

function changeTrack(direction) {
  const step = 10;
  currentPosition = Math.min(Math.max(currentPosition + direction * step, 0), trackDuration);
  updateProgress();
}

function setFromPointer(clientX) {
  const rect = progressTrack.getBoundingClientRect();
  const ratio = (clientX - rect.left) / rect.width;
  currentPosition = Math.min(Math.max(Math.round(ratio * trackDuration), 0), trackDuration);
  updateProgress();
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeTrack(-1));
nextBtn.addEventListener('click', () => changeTrack(1));

totalTimeEl.textContent = formatTime(trackDuration);
updateProgress();

progressTrack.addEventListener('pointerdown', (event) => {
  setFromPointer(event.clientX);
  const moveHandler = (moveEvent) => setFromPointer(moveEvent.clientX);
  const upHandler = () => {
    window.removeEventListener('pointermove', moveHandler);
    window.removeEventListener('pointerup', upHandler);
  };

  window.addEventListener('pointermove', moveHandler);
  window.addEventListener('pointerup', upHandler);
});

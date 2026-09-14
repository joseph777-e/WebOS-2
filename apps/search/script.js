const input = document.getElementById('search-input');
const resultsBox = document.getElementById('results');
const closeBtn = document.querySelector('.close-btn');

closeBtn.addEventListener('click', () => {
  window.parent.postMessage({ appName: 'search', action: 'close' }, window.location.origin);
  window.close();
});

const results = [
  {
    title: 'PixelOS docs',
    snippet: 'A guide to the retro desktop UI, pixel styling, and app structure.'
  },
  {
    title: 'Music app ideas',
    snippet: 'Explore ways to style media controls and music windows in a desktop OS.'
  },
  {
    title: 'Notes templates',
    snippet: 'Small note layouts and ideas for building a personal sketchbook app.'
  },
  {
    title: 'File explorer mockups',
    snippet: 'Create a desktop UI with folders, previews, and an organized file system.'
  }
];

function renderResults(query) {
  const clean = query.trim().toLowerCase();
  if (!clean) {
    resultsBox.innerHTML = '<div class="result empty">Try searching for something cool.</div>';
    return;
  }

  const filtered = results.filter((item) => {
    const haystack = `${item.title} ${item.snippet}`.toLowerCase();
    return haystack.includes(clean);
  });

  if (!filtered.length) {
    resultsBox.innerHTML = '<div class="result empty">No results found. Try another term.</div>';
    return;
  }

  resultsBox.innerHTML = filtered.map((item) => `
    <div class="result">
      <span class="title">${item.title}</span>
      <div class="snippet">${item.snippet}</div>
    </div>
  `).join('');
}

input.addEventListener('input', (event) => renderResults(event.target.value));
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    renderResults(input.value);
  }
});

renderResults('');

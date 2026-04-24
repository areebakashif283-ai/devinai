/**
 * Gallery rendering and filtering logic.
 */
const Gallery = (function () {
  let allItems = [];
  let currentFilter = 'all';

  const gridEl = document.getElementById('gallery-grid');
  const emptyEl = document.getElementById('gallery-empty');
  const statPhotos = document.getElementById('stat-photos');
  const statVideos = document.getElementById('stat-videos');
  const statCollections = document.getElementById('stat-collections');

  function createGalleryCard(item, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.style.animationDelay = `${index * 0.08}s`;
    div.dataset.id = item.id;
    div.dataset.type = item.type;

    let mediaHTML;
    if (item.type === 'video') {
      mediaHTML = `
        <video src="${item.data}" preload="metadata" muted></video>
        <div class="video-badge">
          <span class="material-icons-round">play_arrow</span>
          Video
        </div>`;
    } else {
      mediaHTML = `<img src="${item.data}" alt="${item.name}" loading="lazy" />`;
    }

    const date = new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    div.innerHTML = `
      ${mediaHTML}
      <div class="gallery-item-overlay">
        <div class="gallery-item-info">
          <h4>${item.collection}</h4>
          <p>${date}</p>
        </div>
        <div class="gallery-item-actions">
          <button class="delete-btn" data-id="${item.id}" title="Delete">
            <span class="material-icons-round">delete_outline</span>
          </button>
        </div>
      </div>`;

    div.addEventListener('click', (e) => {
      if (e.target.closest('.delete-btn')) return;
      const filteredItems = getFilteredItems();
      const idx = filteredItems.findIndex((i) => i.id === item.id);
      Lightbox.open(filteredItems, idx);
    });

    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await MediaStorage.deleteMedia(item.id);
      Toast.show('Media deleted', 'success');
      await load();
    });

    return div;
  }

  function getFilteredItems() {
    if (currentFilter === 'all') return allItems;
    return allItems.filter((item) => item.type === currentFilter);
  }

  function render() {
    const items = getFilteredItems();
    gridEl.innerHTML = '';

    if (items.length === 0) {
      gridEl.style.display = 'none';
      emptyEl.style.display = 'block';
    } else {
      gridEl.style.display = '';
      emptyEl.style.display = 'none';
      items.forEach((item, index) => {
        gridEl.appendChild(createGalleryCard(item, index));
      });
    }
  }

  function updateStats() {
    const photos = allItems.filter((i) => i.type === 'photo').length;
    const videos = allItems.filter((i) => i.type === 'video').length;
    const collections = new Set(allItems.map((i) => i.collection)).size;

    animateNumber(statPhotos, photos);
    animateNumber(statVideos, videos);
    animateNumber(statCollections, collections);
  }

  function animateNumber(el, target) {
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;
    const diff = target - current;
    const steps = Math.min(Math.abs(diff), 30);
    const increment = diff / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      el.textContent = Math.round(current + increment * step);
      if (step >= steps) {
        el.textContent = target;
        clearInterval(timer);
      }
    }, 30);
  }

  async function load() {
    allItems = await MediaStorage.getAllMedia();
    updateStats();
    render();
  }

  function setFilter(filter) {
    currentFilter = filter;
    render();
  }

  return { load, setFilter, getFilteredItems };
})();

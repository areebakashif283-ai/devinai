/**
 * Lightbox viewer for photos and videos.
 */
const Lightbox = (function () {
  const lightboxEl = document.getElementById('lightbox');
  const contentEl = document.getElementById('lightbox-content');
  const infoEl = document.getElementById('lightbox-info');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let items = [];
  let currentIndex = 0;

  function init() {
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl) close();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightboxEl.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  function open(mediaItems, index) {
    items = mediaItems;
    currentIndex = index;
    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    show();
  }

  function close() {
    lightboxEl.classList.remove('active');
    document.body.style.overflow = '';
    const video = contentEl.querySelector('video');
    if (video) video.pause();
    contentEl.innerHTML = '';
  }

  function navigate(direction) {
    const video = contentEl.querySelector('video');
    if (video) video.pause();

    currentIndex =
      (currentIndex + direction + items.length) % items.length;
    show();
  }

  function show() {
    const item = items[currentIndex];
    if (!item) return;

    if (item.type === 'video') {
      contentEl.innerHTML = `<video src="${item.data}" controls autoplay style="max-width:90vw;max-height:80vh;border-radius:8px;"></video>`;
    } else {
      contentEl.innerHTML = `<img src="${item.data}" alt="${item.name}" />`;
    }

    const date = new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    infoEl.textContent = `${item.collection} — ${date}`;

    prevBtn.style.display = items.length > 1 ? '' : 'none';
    nextBtn.style.display = items.length > 1 ? '' : 'none';
  }

  return { init, open, close };
})();

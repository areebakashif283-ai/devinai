/**
 * Upload handling: drag & drop and file input.
 */
const Upload = (function () {
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('file-input');
  const formEl = document.getElementById('upload-form');
  const previewGrid = document.getElementById('upload-preview-grid');
  const collectionInput = document.getElementById('upload-collection');
  const cancelBtn = document.getElementById('upload-cancel');
  const confirmBtn = document.getElementById('upload-confirm');

  let pendingFiles = [];

  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ];

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

  function init() {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      handleFiles(Array.from(e.dataTransfer.files));
    });

    fileInput.addEventListener('change', () => {
      handleFiles(Array.from(fileInput.files));
      fileInput.value = '';
    });

    cancelBtn.addEventListener('click', resetForm);

    confirmBtn.addEventListener('click', async () => {
      if (pendingFiles.length === 0) return;
      const collection = collectionInput.value.trim();

      confirmBtn.disabled = true;
      confirmBtn.innerHTML =
        '<span class="material-icons-round">hourglass_top</span> Uploading...';

      let successCount = 0;
      for (const file of pendingFiles) {
        try {
          await MediaStorage.addMedia(file, collection);
          successCount++;
        } catch (err) {
          console.error('Upload failed for', file.name, err);
        }
      }

      Toast.show(`${successCount} file(s) added to gallery!`, 'success');
      resetForm();
      await Gallery.load();

      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function handleFiles(files) {
    const validFiles = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        Toast.show(`"${file.name}" is not a supported format.`, 'error');
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        Toast.show(`"${file.name}" exceeds 100 MB limit.`, 'error');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    pendingFiles = pendingFiles.concat(validFiles);
    renderPreviews();
    formEl.style.display = 'block';
    dropzone.style.display = 'none';
  }

  function renderPreviews() {
    previewGrid.innerHTML = '';
    pendingFiles.forEach((file, idx) => {
      const div = document.createElement('div');
      div.className = 'upload-preview-item';

      const url = URL.createObjectURL(file);

      if (file.type.startsWith('video/')) {
        div.innerHTML = `<video src="${url}" muted></video>`;
      } else {
        div.innerHTML = `<img src="${url}" alt="${file.name}" />`;
      }

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-preview';
      removeBtn.innerHTML = '&times;';
      removeBtn.addEventListener('click', () => {
        URL.revokeObjectURL(url);
        pendingFiles.splice(idx, 1);
        if (pendingFiles.length === 0) {
          resetForm();
        } else {
          renderPreviews();
        }
      });

      div.appendChild(removeBtn);
      previewGrid.appendChild(div);
    });
  }

  function resetForm() {
    pendingFiles = [];
    previewGrid.innerHTML = '';
    collectionInput.value = '';
    formEl.style.display = 'none';
    dropzone.style.display = '';
    confirmBtn.disabled = false;
    confirmBtn.innerHTML =
      '<span class="material-icons-round">check</span> Add to Gallery';
  }

  return { init };
})();

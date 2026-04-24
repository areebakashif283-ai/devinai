/**
 * IndexedDB-based storage for portfolio media.
 * Stores file blobs and metadata for photos and videos.
 */
const MediaStorage = (function () {
  const DB_NAME = 'portfolio_db';
  const DB_VERSION = 1;
  const STORE_NAME = 'media';
  let db = null;

  function open() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const database = e.target.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('collection', 'collection', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        db = e.target.result;
        resolve(db);
      };

      request.onerror = (e) => reject(e.target.error);
    });
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  async function addMedia(file, collection) {
    const database = await open();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const item = {
          id: generateId(),
          name: file.name,
          type: file.type.startsWith('video/') ? 'video' : 'photo',
          mimeType: file.type,
          size: file.size,
          data: reader.result,
          collection: collection || 'Uncategorized',
          createdAt: new Date().toISOString(),
        };

        const tx = database.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.add(item);
        request.onsuccess = () => resolve(item);
        request.onerror = (e) => reject(e.target.error);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function getAllMedia() {
    const database = await open();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const items = request.result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        resolve(items);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function deleteMedia(id) {
    const database = await open();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getCollections() {
    const items = await getAllMedia();
    const collections = new Set();
    items.forEach((item) => collections.add(item.collection));
    return Array.from(collections);
  }

  return { open, addMedia, getAllMedia, deleteMedia, getCollections };
})();

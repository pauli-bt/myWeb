/**
 * PAULI_B Storage Engine — IndexedDB
 * Replaces localStorage (5MB limit) with IndexedDB (500MB+)
 * Transparent async API used by both admin and gallery-loader
 */
const DB_NAME = 'paulib_portfolio';
const DB_VER  = 1;
const STORE   = 'files';

let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: 'id' });
        os.createIndex('cat',  'cat',  { unique: false });
        os.createIndex('date', 'date', { unique: false });
      }
    };
    req.onsuccess = e => { _db = e.target.result; res(_db); };
    req.onerror   = e => rej(e.target.error);
  });
}

window.PB = {
  // Save one file record
  async put(record) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(record);
      tx.oncomplete = () => res(true);
      tx.onerror    = e  => rej(e.target.error);
    });
  },

  // Get all files (optionally filtered by category)
  async getAll(cat) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx   = db.transaction(STORE, 'readonly');
      const req  = cat
        ? tx.objectStore(STORE).index('cat').getAll(cat)
        : tx.objectStore(STORE).getAll();
      req.onsuccess = e => res(e.target.result || []);
      req.onerror   = e => rej(e.target.error);
    });
  },

  // Delete one file
  async delete(id) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => res(true);
      tx.onerror    = e  => rej(e.target.error);
    });
  },

  // Get one file by id
  async get(id) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = e => res(e.target.result);
      req.onerror   = e => rej(e.target.error);
    });
  },

  // Count by category
  async count(cat) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = cat
        ? tx.objectStore(STORE).index('cat').count(cat)
        : tx.objectStore(STORE).count();
      req.onsuccess = e => res(e.target.result || 0);
      req.onerror   = e => rej(e.target.error);
    });
  }
};

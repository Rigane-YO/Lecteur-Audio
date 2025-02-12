import { openDB, DBSchema } from 'idb';
import { Track } from '../types';

interface MusicPlayerDB extends DBSchema {
  tracks: {
    key: string;
    value: Track & { blob?: Blob };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'music-player-db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB<MusicPlayerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('tracks')) {
        db.createObjectStore('tracks', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    },
  });
}

export async function getAllTracks() {
  const db = await initDB();
  return db.getAll('tracks');
}

export async function addTrack(track: Track, blob?: Blob) {
  const db = await initDB();
  await db.put('tracks', { ...track, blob });
}

export async function removeTrack(id: string) {
  const db = await initDB();
  await db.delete('tracks', id);
}

export async function getSettings(key: string) {
  const db = await initDB();
  return db.get('settings', key);
}

export async function saveSettings(key: string, value: any) {
  const db = await initDB();
  await db.put('settings', value, key);
}
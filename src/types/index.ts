export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: number;
  coverUrl?: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  playlist: Track[];
  queue: Track[];
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isDarkMode: boolean;
}

export type PlayerAction =
  | { type: 'SET_TRACK'; payload: Track }
  | { type: 'SET_PLAYLIST'; payload: Track[] }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'ADD_TRACK'; payload: Track }
  | { type: 'REMOVE_TRACK'; payload: string }
  | { type: 'REORDER_PLAYLIST'; payload: Track[] }
  | { type: 'ADD_TO_QUEUE'; payload: Track }
  | { type: 'REMOVE_FROM_QUEUE'; payload: string }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_REPEAT_MODE'; payload: 'none' | 'one' | 'all' }
  | { type: 'TOGGLE_DARK_MODE' };
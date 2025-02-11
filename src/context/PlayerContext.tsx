import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import { PlayerState, PlayerAction, Track } from '../types';

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  playlist: [],
  queue: [],
  isShuffled: false,
  repeatMode: 'none',
  isDarkMode: false,
};

const PlayerContext = createContext<{
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
  audioRef: React.RefObject<HTMLAudioElement>;
} | null>(null);

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'ADD_TRACK':
      return { ...state, playlist: [...state.playlist, action.payload] };
    case 'REMOVE_TRACK':
      return {
        ...state,
        playlist: state.playlist.filter((track) => track.id !== action.payload),
      };
    case 'REORDER_PLAYLIST':
      return { ...state, playlist: action.payload };
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] };
    case 'REMOVE_FROM_QUEUE':
      return {
        ...state,
        queue: state.queue.filter((track) => track.id !== action.payload),
      };
    case 'TOGGLE_SHUFFLE':
      return { ...state, isShuffled: !state.isShuffled };
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    default:
      return state;
  }
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('playerState');
    if (savedState) {
      const { playlist, isDarkMode } = JSON.parse(savedState);
      dispatch({ type: 'SET_PLAYLIST', payload: playlist });
      if (isDarkMode) {
        dispatch({ type: 'TOGGLE_DARK_MODE' });
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(
      'playerState',
      JSON.stringify({
        playlist: state.playlist,
        isDarkMode: state.isDarkMode,
      })
    );
  }, [state.playlist, state.isDarkMode]);

  // Handle dark mode
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
      if (state.isPlaying) {
        audioRef.current.play().catch(() => {
          dispatch({ type: 'TOGGLE_PLAY' });
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying, state.volume, state.currentTrack]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          dispatch({ type: 'TOGGLE_PLAY' });
          break;
        case 'ArrowLeft':
          if (audioRef.current) {
            audioRef.current.currentTime -= 5;
          }
          break;
        case 'ArrowRight':
          if (audioRef.current) {
            audioRef.current.currentTime += 5;
          }
          break;
        case 'ArrowUp':
          dispatch({ type: 'SET_VOLUME', payload: Math.min(1, state.volume + 0.1) });
          break;
        case 'ArrowDown':
          dispatch({ type: 'SET_VOLUME', payload: Math.max(0, state.volume - 0.1) });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.volume]);

  const getNextTrack = () => {
    if (state.queue.length > 0) {
      return state.queue[0];
    }

    if (state.repeatMode === 'one') {
      return state.currentTrack;
    }

    const currentIndex = state.playlist.findIndex(
      (track) => track.id === state.currentTrack?.id
    );

    if (currentIndex === -1) return null;

    if (currentIndex === state.playlist.length - 1) {
      return state.repeatMode === 'all' ? state.playlist[0] : null;
    }

    return state.playlist[currentIndex + 1];
  };

  return (
    <PlayerContext.Provider value={{ state, dispatch, audioRef }}>
      {children}
      <audio
        ref={audioRef}
        src={state.currentTrack?.url}
        onTimeUpdate={() => {
          if (audioRef.current) {
            dispatch({
              type: 'SET_PROGRESS',
              payload: (audioRef.current.currentTime / audioRef.current.duration) * 100,
            });
          }
        }}
        onEnded={() => {
          const nextTrack = getNextTrack();
          if (nextTrack) {
            dispatch({ type: 'SET_TRACK', payload: nextTrack });
            if (state.queue.length > 0) {
              dispatch({ type: 'REMOVE_FROM_QUEUE', payload: nextTrack.id });
            }
          } else {
            dispatch({ type: 'TOGGLE_PLAY' });
          }
        }}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
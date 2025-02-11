import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  Moon,
  Sun,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function AudioPlayer() {
  const { state, dispatch, audioRef } = usePlayer();

  const handlePlayPause = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (progress / 100) * audioRef.current.duration;
      dispatch({ type: 'SET_PROGRESS', payload: progress });
    }
  };

  const handlePrevious = () => {
    const currentIndex = state.playlist.findIndex(
      (track) => track.id === state.currentTrack?.id
    );
    if (currentIndex > 0) {
      dispatch({ type: 'SET_TRACK', payload: state.playlist[currentIndex - 1] });
    }
  };

  const handleNext = () => {
    const currentIndex = state.playlist.findIndex(
      (track) => track.id === state.currentTrack?.id
    );
    if (currentIndex < state.playlist.length - 1) {
      dispatch({ type: 'SET_TRACK', payload: state.playlist[currentIndex + 1] });
    }
  };

  const handleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch({ type: 'SET_REPEAT_MODE', payload: nextMode });
  };

  const currentTime = audioRef.current?.currentTime || 0;
  const duration = audioRef.current?.duration || 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={state.progress}
              onChange={handleProgressChange}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center gap-4">
              {state.currentTrack?.coverUrl && (
                <img
                  src={state.currentTrack.coverUrl}
                  alt={`${state.currentTrack.title} cover`}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-medium dark:text-white">
                  {state.currentTrack?.title || 'No track selected'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {state.currentTrack?.artist}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_SHUFFLE' })}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  state.isShuffled
                    ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={handlePrevious}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
                disabled={!state.currentTrack}
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors duration-300"
                disabled={!state.currentTrack}
              >
                {state.isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
                disabled={!state.currentTrack}
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={handleRepeat}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  state.repeatMode !== 'none'
                    ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={state.volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
              >
                {state.isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
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
  const [showVolume, setShowVolume] = useState(false);

  const handlePlayPause = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const toggleVolume = () => {
    setShowVolume(!showVolume);
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
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 transition-all duration-300 ease-in-out animate-slide-up">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="transition-opacity duration-200 min-w-[45px] text-right">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg group">
              <input
                type="range"
                min="0"
                max="100"
                value={state.progress}
                onChange={handleProgressChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="h-full bg-blue-500 rounded-lg transition-all duration-100 ease-out group-hover:bg-blue-600"
                style={{ width: `${state.progress}%` }}
              />
              <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div
                  className="absolute top-[-8px] h-[16px] w-[16px] bg-blue-600 rounded-full shadow-lg transform -translate-x-1/2 transition-transform duration-200 hover:scale-110"
                  style={{ left: `${state.progress}%` }}
                />
              </div>
            </div>
            <span className="transition-opacity duration-200 min-w-[45px]">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center gap-4 group">
              {state.currentTrack?.coverUrl && (
                <div className="relative overflow-hidden rounded-lg group">
                  <img
                    src={state.currentTrack.coverUrl}
                    alt={`${state.currentTrack.title} cover`}
                    className="w-12 h-12 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
              )}
              <div className="transition-all duration-200 group-hover:translate-x-1">
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
                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  state.isShuffled
                    ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Shuffle className="w-5 h-5 transition-transform duration-200" />
              </button>

              <button
                onClick={handlePrevious}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
                disabled={!state.currentTrack}
              >
                <SkipBack className="w-6 h-6 transition-transform duration-200" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                disabled={!state.currentTrack}
              >
                {state.isPlaying ? (
                  <Pause className="w-6 h-6 transition-transform duration-200" />
                ) : (
                  <Play className="w-6 h-6 transition-transform duration-200" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
                disabled={!state.currentTrack}
              >
                <SkipForward className="w-6 h-6 transition-transform duration-200" />
              </button>

              <button
                onClick={handleRepeat}
                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  state.repeatMode !== 'none'
                    ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Repeat className="w-5 h-5 transition-transform duration-200" />
              </button>

              {/* Volume Control */}
              <div className="relative group">
                <button
                  onClick={toggleVolume}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
                >
                  {state.volume === 0 ? (
                    <VolumeX className="w-5 h-5 transition-transform duration-200" />
                  ) : (
                    <Volume2 className="w-5 h-5 transition-transform duration-200" />
                  )}
                </button>
                
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 transform origin-bottom ${
                    showVolume
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={state.volume}
                      onChange={handleVolumeChange}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="h-full bg-blue-500 rounded-lg transition-all duration-100 ease-out group-hover:bg-blue-600"
                      style={{ width: `${state.volume * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                {state.isDarkMode ? (
                  <Sun className="w-5 h-5 transition-all duration-300 rotate-0 hover:rotate-180" />
                ) : (
                  <Moon className="w-5 h-5 transition-all duration-300 rotate-0 hover:-rotate-180" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
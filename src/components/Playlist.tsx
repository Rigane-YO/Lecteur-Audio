import { useEffect } from 'react';
import { Music, Trash2, Plus, Maximize2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { Track } from '../types';
import { FileDropzone } from './FileDropzone';
import { getAllTracks, removeTrack } from '../db';

export function Playlist() {
  const { state, dispatch } = usePlayer();

  // Load tracks from IndexedDB on mount
  useEffect(() => {
    const loadTracks = async () => {
      const tracks = await getAllTracks();
      dispatch({ type: 'SET_PLAYLIST', payload: tracks });
    };
    loadTracks();
  }, [dispatch]);

  const handleTrackSelect = (track: Track) => {
    dispatch({ type: 'SET_TRACK', payload: track });
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleRemoveTrack = async (trackId: string) => {
    await removeTrack(trackId);
    dispatch({ type: 'REMOVE_TRACK', payload: trackId });
  };

  const handleAddToQueue = (track: Track) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: track });
  };

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Your Playlist</h2>
        <button
          onClick={handleFullscreen}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
          title="Toggle fullscreen"
        >
          <Maximize2 className="w-5 h-5 dark:text-white" />
        </button>
      </div>

      {/* File Dropzone */}
      <div className="mb-8">
        <FileDropzone />
      </div>

      {/* Queue */}
      {state.queue.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Queue</h3>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow transition-colors duration-300">
            <ul className="divide-y dark:divide-gray-700">
              {state.queue.map((track) => (
                <li
                  key={track.id}
                  className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  {track.coverUrl && (
                    <img
                      src={track.coverUrl}
                      alt={`${track.title} cover`}
                      className="w-12 h-12 rounded object-cover mr-4"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium dark:text-white">{track.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{track.artist}</p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_FROM_QUEUE', payload: track.id })}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Playlist */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-300">
        {state.playlist.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Music className="w-12 h-12 mx-auto mb-2" />
            <p>Your playlist is empty. Drop some audio files to get started!</p>
          </div>
        ) : (
          <ul className="divide-y dark:divide-gray-700">
            {state.playlist.map((track) => (
              <li
                key={track.id}
                className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 ${
                  state.currentTrack?.id === track.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                {track.coverUrl && (
                  <img
                    src={track.coverUrl}
                    alt={`${track.title} cover`}
                    className="w-12 h-12 rounded object-cover mr-4"
                  />
                )}
                <button
                  onClick={() => handleTrackSelect(track)}
                  className="flex-1 text-left"
                >
                  <p className="font-medium dark:text-white">{track.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{track.artist}</p>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToQueue(track)}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-300"
                    title="Add to queue"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRemoveTrack(track.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                    title="Remove from playlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
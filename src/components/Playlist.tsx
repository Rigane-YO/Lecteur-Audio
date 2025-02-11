import React from 'react';
import { Music, Trash2, Plus } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { Track } from '../types';

export function Playlist() {
  const { state, dispatch } = usePlayer();

  const handleTrackSelect = (track: Track) => {
    dispatch({ type: 'SET_TRACK', payload: track });
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleRemoveTrack = (trackId: string) => {
    dispatch({ type: 'REMOVE_TRACK', payload: trackId });
  };

  const handleAddTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const url = formData.get('url') as string;
    const coverUrl = formData.get('coverUrl') as string;

    if (title && artist && url) {
      const newTrack: Track = {
        id: Date.now().toString(),
        title,
        artist,
        url,
        coverUrl: coverUrl || undefined,
      };
      dispatch({ type: 'ADD_TRACK', payload: newTrack });
      e.currentTarget.reset();
    }
  };

  const handleAddToQueue = (track: Track) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: track });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mb-24">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Your Playlist</h2>

      {/* Add Track Form */}
      <form onSubmit={handleAddTrack} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Add New Track</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-300"
              placeholder="Track title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Artist</label>
            <input
              type="text"
              name="artist"
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-300"
              placeholder="Artist name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Audio URL</label>
            <input
              type="url"
              name="url"
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-300"
              placeholder="https://example.com/audio.mp3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Cover URL</label>
            <input
              type="url"
              name="coverUrl"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-300"
              placeholder="https://example.com/cover.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Add Track
            </button>
          </div>
        </div>
      </form>

      {/* Queue */}
      {state.queue.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Queue</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-300">
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
            <p>Your playlist is empty. Add some tracks to get started!</p>
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
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRemoveTrack(track.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
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
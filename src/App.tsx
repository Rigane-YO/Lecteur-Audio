import React from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { AudioPlayer } from './components/AudioPlayer';
import { Playlist } from './components/Playlist';

function App() {
  return (
    <PlayerProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-800 shadow transition-colors duration-300">
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Music Player</h1>
          </div>
        </header>
        <main>
          <Playlist />
          <AudioPlayer />
        </main>
      </div>
    </PlayerProvider>
  );
}

export default App;
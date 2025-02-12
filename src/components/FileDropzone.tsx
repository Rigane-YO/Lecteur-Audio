import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Music, Upload } from 'lucide-react';
import * as mmb from 'music-metadata-browser';
import { usePlayer } from '../context/PlayerContext';
import { Track } from '../types';
import { addTrack } from '../db';

export function FileDropzone() {
  const { dispatch } = usePlayer();

  const processFile = async (file: File) => {
    try {
      // Read metadata
      const metadata = await mmb.parseBlob(file);
      const { title, artist } = metadata.common;

      // Create object URL for the audio file
      const blob = new Blob([file], { type: file.type });
      const url = URL.createObjectURL(blob);

      // Create track object
      const track: Track = {
        id: Date.now().toString(),
        title: title || file.name,
        artist: artist || 'Unknown Artist',
        url,
        coverUrl: metadata.common.picture?.[0] ? 
          URL.createObjectURL(new Blob([metadata.common.picture[0].data], { type: metadata.common.picture[0].format })) :
          undefined
      };

      // Save to IndexedDB and add to playlist
      await addTrack(track, blob);
      dispatch({ type: 'ADD_TRACK', payload: track });

      return track;
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const audioFiles = acceptedFiles.filter(file => file.type.startsWith('audio/'));
    
    try {
      await Promise.all(audioFiles.map(processFile));
    } catch (error) {
      console.error('Error processing files:', error);
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <>
            <Upload className="w-12 h-12 text-blue-500" />
            <p className="text-blue-500">Drop the files here...</p>
          </>
        ) : (
          <>
            <Music className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Drag and drop audio files here, or click to select files
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Supports MP3, WAV, OGG, and M4A
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
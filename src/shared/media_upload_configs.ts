import type { MediaUploadConfig } from '../types.js';

export const videoUploadConfig: MediaUploadConfig = {
  description: 'MP4 and MOV files up to 4GB',
  extensions: ['.mp4', '.mov'],
  maxSize: 4_000_000_000,
};

export const imageUploadConfig: MediaUploadConfig = {
  description: 'SVG, PNG, JPG, GIF up to 5MB',
  extensions: ['.jpeg', '.jpg', '.png', '.svg'],
  maxSize: 5_000_000,
};

export const audioUploadConfig: MediaUploadConfig = {
  description: 'MP3, M4A, WAV up to 200 MB',
  extensions: ['.mp3', '.m4a', '.wav'],
  maxSize: 209_715_200,
};

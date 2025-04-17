import * as tus from 'tus-js-client';
import { useWidgetsStore } from '../../store';
import type { HostService, AttachmentModel } from './types';

const authority = 'https://video.bunnycdn.com';

export default class BunnyService implements HostService {
  private accessKey: string;
  private libraryId: string;
  private host: string;
  private collectionId?: string;
  private onError: (error: Error | tus.DetailedError) => void;
  private onSuccess: (url: string) => void;
  private onProgress: (bytesUploaded: number, bytesTotal: number) => void;
  private guid?: string;

  constructor(
    onError: (error: Error | tus.DetailedError) => void,
    onSuccess: (url: string) => void,
    onProgress: (bytesUploaded: number, bytesTotal: number) => void,
    collectionId?: string,
  ) {
    const provider = useWidgetsStore().providers.bunny;
    if (!provider) throw new Error('bunny provider not found');

    if (!provider.accessKey)
      throw new Error('bunny accessKey not found, check your .env file');

    if (!provider.libraryId) {
      throw new Error('bunny libraryId not found, check your .env file');
    }

    if (!provider.host) {
      throw new Error('bunny host not found, check your .env file');
    }

    this.accessKey = provider.accessKey;
    this.libraryId = provider.libraryId;
    this.host = provider.host;
    this.collectionId = collectionId;
    this.onProgress = onProgress;
    this.onError = onError;
    this.onSuccess = onSuccess;
  }

  public upload = async (
    file: File,
    _onProgress: (progress: number | undefined) => void,
  ): Promise<AttachmentModel> => {
    try {
      // throw new Error('Nope!!');
      // prepare the upload
      this.guid = await this.createUpload(file.name);

      // unix timestamp 10 hours from now
      const uploadExpiry = `${Math.floor(Date.now() / 1000) + 36000}`;
      const signature = await this.generateSignature(uploadExpiry);

      const resumableUpload = new tus.Upload(file, {
        endpoint: `${authority}/tusupload`,
        retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
        headers: {
          AuthorizationSignature: signature,
          AuthorizationExpire: uploadExpiry,
          VideoId: this.guid,
          LibraryId: this.libraryId,
        },
        metadata: {
          filetype: file.type,
          title: file.name.split('.')[0],
          collection: this.collectionId,
        },
        onError: this.onError,
        onProgress: this.onProgress,
        onSuccess: () => {
          this.onSuccess(this.url);
        },
      });

      // Check if there are any previous uploads to continue.
      const previousUploads = await resumableUpload.findPreviousUploads();
      if (previousUploads.length) {
        resumableUpload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      resumableUpload.start();
    } catch (error) {
      this.onError(error);
      return { url: null };
    }

    // this url is not ready yet, we need to wait for the onSuccess callback
    return { url: this.url };
  };

  public get url(): string | null {
    return this.guid ? `https://${this.host}/${this.guid}/playlist.m3u8` : null;
  }

  public get library(): string {
    return this.libraryId;
  }

  private createUpload = async (fileName: string): Promise<string> => {
    const { default: axios } = await import('axios');

    const response = await axios.post(
      `${authority}/library/${this.libraryId}/videos`,
      {
        title: fileName.split('.')[0],
        collectionId: this.collectionId,
        thumbnailTime: null,
      },
      {
        headers: {
          AccessKey: this.accessKey,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.guid;
  };

  private async generateSignature(uploadExpiry: string): Promise<string> {
    const message = this.libraryId + this.accessKey + uploadExpiry + this.guid;
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}

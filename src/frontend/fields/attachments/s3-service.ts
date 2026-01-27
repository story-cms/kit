import { useWidgetsStore } from '../../store';
import type { HostService, AttachmentModel } from './types';
import { S3Client } from '@aws-sdk/client-s3';
import type {
  CompleteMultipartUploadCommandOutput,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export default class S3Service implements HostService {
  private path: string;
  private folder?: string;
  private customDomain?: string;
  /**
   * @param path - The path to the file in the S3 bucket without an extension. If not provided, a unique filename will be generated.
   * @param folder - The optional base folder to store the file in
   */
  constructor(path: string, folder?: string) {
    this.path = path;
    this.folder = folder;
    const provider = useWidgetsStore().providers.s3;
    if (provider) {
      this.customDomain = provider.customDomain;
    }
  }

  getFilePath = (file: File): string => {
    const extension = file.name.split('.').pop();
    if (this.path !== '') {
      return `${this.path}.${extension}`;
    }

    // Generate a unique filename so a draft upload can't overwrite a published upload
    const timestamp = Date.now();
    const slugifiedName = file.name.replace(/\s+/g, '_').toLowerCase();
    const uniqueFilename = `${timestamp}_${slugifiedName}`;
    if (this.folder) {
      return `${this.folder}/${uniqueFilename}`;
    }

    return uniqueFilename;
  };

  getPublicUrl = (key: string): string => {
    return `https://${this.customDomain}/${key}`;
  };

  upload = async (
    file: File,
    onProgress: (progress: number | undefined) => void,
  ): Promise<AttachmentModel> => {
    const provider = useWidgetsStore().providers.s3;
    if (!provider) throw new Error('S3 provider not found');

    if (
      !useWidgetsStore().providers.s3 ||
      !provider.bucket ||
      !provider.region ||
      !provider.endpoint
    ) {
      return { url: '' };
    }

    const client = new S3Client({
      region: provider.region,
      endpoint: provider.endpoint,
      credentials: {
        accessKeyId: provider.accessKeyId,
        secretAccessKey: provider.accessKey,
      },
    });

    const params = {
      Bucket: provider.bucket,
      Key: this.getFilePath(file),
      Body: file,
      ContentType: file.type,
      ACL: 'public-read' as ObjectCannedACL,
    };

    try {
      const upload = new Upload({
        client,
        params,
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
      });

      upload.on('httpUploadProgress', ({ loaded, total }) => {
        onProgress((loaded ?? 0) / (total ?? 1));
      });

      const response = (await upload.done()) as CompleteMultipartUploadCommandOutput;
      // NOTE: Incompatible with BNAP Audio that uses response.Location
      // response.Key audio/recaps/1742280691067_episode-1-luke-1-5.mp3
      // response.Location "https://807541099482344e1b0f4471d98b6705.r2.cloudflarestorage.com/ntj/audio/recaps/1742280691067_episode-1-luke-1-5.mp3"
      const key = response?.Key as string;
      return { url: this.getPublicUrl(key) };
    } catch (error) {
      console.error(error);
    } finally {
      if (client) {
        client.destroy();
      }
    }

    return { url: '' };
  };
}

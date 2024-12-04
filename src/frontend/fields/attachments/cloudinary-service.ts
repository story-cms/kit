import type { AxiosRequestConfig } from 'axios';
import { useWidgetsStore } from '../../store';
import type { HostService, AttachmentModel } from './types';
import type { FieldSpec } from '../../../types';

const timestamp = Math.round(new Date().getTime() / 1000);

export default class CloudinaryService implements HostService {
  private field: FieldSpec;
  private endpoint: string;

  constructor(field: FieldSpec, endpoint: string) {
    this.field = field;
    this.endpoint = endpoint;
  }

  upload = async (
    file: File,
    // eslint-disable-next-line no-unused-vars
    onProgress: (progress: number | undefined) => void,
  ): Promise<AttachmentModel> => {
    const provider = useWidgetsStore().providers.cloudinary;
    if (!provider) throw new Error('Cloudinary provider not found');

    if (!provider.cloudName || !provider.defaultPreset) {
      return { url: '' };
    }

    const { default: axios } = await import('axios');

    const uploadPreset = this.field.uploadPreset ?? provider.defaultPreset ?? '';
    const secretToSign = `tags=browser-upload&timestamp=${timestamp}&upload_preset=${uploadPreset}${provider.secret}`;
    const buffer = new TextEncoder().encode(secretToSign);
    const sha = await crypto.subtle.digest('SHA-1', buffer);
    const encryptedSecret = Array.from(new Uint8Array(sha))
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('tags', 'browser-upload');
    formData.append('api_key', provider.apiKey as string);
    formData.append('api_secret', provider.secret);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', encryptedSecret);
    if (this.endpoint.includes('raw')) {
      formData.append('resource_type', 'raw');
    }

    const requestObj: AxiosRequestConfig = {
      url: `https://api.cloudinary.com/v1_1/${provider.cloudName}${this.endpoint}`,
      method: 'POST',
      onUploadProgress: (progress) => onProgress(progress.progress),
      data: formData,
    };

    try {
      const response = await axios(requestObj);
      return { url: response.data.secure_url };
    } catch (error) {
      console.log(error);
    }

    return { url: '' };
  };
}

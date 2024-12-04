export interface AttachmentModel {
  url: string;
}

export type UploadFile = (
  file: File, // eslint-disable-line
  onProgress: (percentage: number | undefined) => void, // eslint-disable-line
) => Promise<AttachmentModel>;

export interface HostService {
  upload: UploadFile;
}

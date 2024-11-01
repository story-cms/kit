import { useWidgetsStore } from "../../store";
import type { HostService, AttachmentModel } from "./types";
import { S3Client } from "@aws-sdk/client-s3";
import type {
	CompleteMultipartUploadCommandOutput,
	ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export default class S3Service implements HostService {
	private path: string;

	constructor(path: string) {
		this.path = path;
	}
	upload = async (
		file: File,
		// eslint-disable-next-line no-unused-vars
		onProgress: (progress: number | undefined) => void,
	): Promise<AttachmentModel> => {
		const provider = useWidgetsStore().providers.s3;
		if (!provider) throw new Error("S3 provider not found");

		if (
			!useWidgetsStore().providers.s3 ||
			!provider.bucket ||
			!provider.region ||
			!provider.endpoint
		) {
			console.log("Check your env for S3_BUCKET, S3_REGION, and S3_ENDPOINT");
			return { url: "" };
		}

		const filePath = (path: string, file: File) => {
			return `${path}.${file.name.split(".").pop()}`;
		};

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
			Key: this.path === "" ? file.name : filePath(this.path, file),
			Body: file,
			ContentType: file.type,
			ACL: "public-read" as ObjectCannedACL,
		};

		try {
			const upload = new Upload({
				client,
				params,
				queueSize: 4,
				partSize: 1024 * 1024 * 5,
			});

			upload.on("httpUploadProgress", ({ loaded, total }) => {
				onProgress((loaded ?? 0) / (total ?? 1));
			});

			const response =
				(await upload.done()) as CompleteMultipartUploadCommandOutput;

			const url = response?.Location as string;
			if (!url.startsWith("http://") && !url.startsWith("https://")) {
				return { url: `https://${url}` };
			}
			return { url };
		} catch (error) {
			console.error(error);
		} finally {
			if (client) {
				client.destroy();
			}
		}
		return { url: "" };
	};
}

/// <reference types="@histoire/plugin-vue/components" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_S3_ACCESS_KEY_ID: string;
	readonly VITE_S3_SECRET_ACCESS_KEY: string;
	readonly VITE_S3_BUCKET: string;
	readonly VITE_S3_REGION: string;
	readonly VITE_S3_ENDPOINT: string;
	readonly VITE_CLOUDINARY_API_KEY: string;
	readonly VITE_CLOUDINARY_SECRET: string;
	readonly VITE_CLOUDINARY_CLOUD_NAME: string;
	readonly VITE_CLOUDINARY_PRESET: string;
	readonly VITE_BIBLE_API_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

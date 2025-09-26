<template>
  <div
    dir="ltr"
    class="relative h-48 w-full p-9"
    :class="dropStyle"
    @dragover.prevent="onDragOver"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div v-if="feedback" class="absolute inset-0">
      <p class="rounded-t-md bg-error py-1 text-center text-sm text-white">
        {{ feedback }}
      </p>
    </div>
    <div class="flex flex-col items-center justify-center">
      <svg
        class="mb-2"
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 5H5C3.93913 5 2.92172 5.42143 2.17157 6.17157C1.42143 6.92172 1 7.93913 1 9V29M1 29V33C1 34.0609 1.42143 35.0783 2.17157 35.8284C2.92172 36.5786 3.93913 37 5 37H29C30.0609 37 31.0783 36.5786 31.8284 35.8284C32.5786 35.0783 33 34.0609 33 33V25M1 29L10.172 19.828C10.9221 19.0781 11.9393 18.6569 13 18.6569C14.0607 18.6569 15.0779 19.0781 15.828 19.828L21 25M33 17V25M33 25L29.828 21.828C29.0779 21.0781 28.0607 20.6569 27 20.6569C25.9393 20.6569 24.9221 21.0781 24.172 21.828L21 25M21 25L25 29M29 5H37M33 1V9M21 13H21.02"
          stroke="#9CA3AF"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <div class="flex text-sm font-medium leading-5 text-gray-600">
        <label
          class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
        >
          <span>Upload a file</span>
          <input
            type="file"
            :accept="accept"
            name="upload"
            class="sr-only"
            @change="onSelect"
          />
        </label>
        <p class="pl-1">or drag and drop</p>
      </div>
      <p class="text-xs font-normal leading-4 text-gray-500">
        {{ props.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  description: {
    type: String,
    required: false,
    default: 'SVG, PNG, JPG, GIF up to 5MB',
  },
  extensions: {
    type: Array,
    required: false,
    default() {
      return ['.jpeg', '.jpg', '.png', '.svg'];
    },
  },
  maxSize: {
    type: Number,
    required: false,
    default: 5662310,
  },
});

const emit = defineEmits(['file']);

const accept = computed(() => {
  return props.extensions.join(',');
});

const isHovering = ref(false);
const feedback = ref('');

const dropStyle = computed(() => {
  return { 'bg-gray-200': isHovering.value, 'bg-white': !isHovering.value };
});

const onDragEnter = () => {
  isHovering.value = true;
};
const onDragLeave = () => {
  isHovering.value = false;
};
const onDragOver = () => {
  isHovering.value = true;
};

const onDrop = (e: DragEvent) => {
  feedback.value = '';
  isHovering.value = false;
  e.stopPropagation();
  e.preventDefault();
  const files = e.dataTransfer?.files;
  if (!files) return;
  const file = files[0];
  processFile(file);
};

const onSelect = (e: Event) => {
  feedback.value = '';
  isHovering.value = false;
  const target = e.target as HTMLInputElement;
  if (!target.files) return;
  const file = target.files[0];
  processFile(file);
};

const processFile = (file: File) => {
  try {
    validateFile(file);
    emit('file', file);
  } catch (error: unknown) {
    if (error instanceof Error) {
      feedback.value = error.message;
    } else {
      feedback.value = 'An unknown error occurred';
    }
  }
};

const validateFile = (file: File) => {
  const allowedExtensions = props.extensions as string[];

  if (!allowedExtensions.some((extension) => file.name.endsWith(extension))) {
    throw new ValidationError(
      `Only media files with extensions ${props.extensions} accepted.`,
    );
  }

  if (file.size > props.maxSize) {
    throw new ValidationError(
      `File size is too large. Maximum allowed size is ${(
        Math.round((props.maxSize / 1048576) * 100) / 100
      ).toFixed(0)}MB.`,
    );
  }
};

class ValidationError extends Error {
  message: string;
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
</script>

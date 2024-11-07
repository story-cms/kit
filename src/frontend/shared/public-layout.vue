<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <span class="flex items-center justify-center">
        <slot name="logo"></slot>
      </span>
      <slot></slot>
    </div>
  </div>
</template>

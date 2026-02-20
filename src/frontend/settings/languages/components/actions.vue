<template>
  <button
    class="rounded-[38px] border bg-green-500 px-[15px] py-[9px] text-sm/5 font-medium text-white shadow hover:bg-green-400 focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
    @click="requestAppUpdate"
  >
    Request App Update
  </button>
</template>
<script setup lang="ts">
const requestAppUpdate = () => {
  console.log('requestAppUpdate');
};
</script>

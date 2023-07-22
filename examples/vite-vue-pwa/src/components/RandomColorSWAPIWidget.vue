<script setup lang="ts">
import { ref } from "vue";

const color = ref<string>();

async function fetchRandomColor() {
  const response = await fetch("/sw-api/random-color");
  color.value = (await response.json()) as string;
}
fetchRandomColor();
</script>

<template>
  <p>
    This is using a fake service worker API endpoint.
    <a href="/sw-api/random-color">Try it yourself</a>!
  </p>
  <template v-if="color">
    <p>
      <code>{{ color }}</code> was the random color!
    </p>
    <div class="color-preview"></div>
  </template>
  <button @click="fetchRandomColor">Fetch another random color</button>
</template>

<style scoped>
.color-preview {
  width: 50px;
  height: 50px;
  background-color: v-bind(color);
}
</style>

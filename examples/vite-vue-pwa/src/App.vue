<script setup lang="ts">
import LoadingSpinner from "./components/LoadingSpinner.vue";
import SharedArrayBufferWidget from "./components/SharedArrayBufferWidget.vue";

// https://vite-pwa-org.netlify.app/guide/service-worker-without-pwa-capabilities.html#registering-of-the-service-worker-in-your-app
let swURL: URL;
let type: "module" | "classic";
if (import.meta.env.MODE === "production") {
  swURL = new URL(import.meta.env.BASE_URL + "sw.js", location.href);
  type = "classic";
} else {
  swURL = new URL("/dev-sw.js?dev-sw", location.href);
  type = "module";
}

const pageHadSW = navigator.serviceWorker.controller?.scriptURL === swURL.href;
(async () => {
  await navigator.serviceWorker.register(swURL, { type });
  await navigator.serviceWorker.ready;
  if (!pageHadSW) {
    location.reload();
  }
})();
</script>

<template>
  <template v-if="pageHadSW">
    <SharedArrayBufferWidget />
  </template>
  <LoadingSpinner v-else />
</template>

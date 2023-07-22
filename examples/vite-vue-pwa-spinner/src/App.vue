<script setup lang="ts">
import Spinner from "./components/Spinner.vue";
import SharedArrayBufferWidget from "./components/SharedArrayBufferWidget.vue";
import CachedImageWidget from "./components/CachedImageWidget.vue";
import ServiceWorkerWidget from "./components/ServiceWorkerWidget.vue";
import RandomColorSWAPIWidget from "./components/RandomColorSWAPIWidget.vue";

// https://vite-pwa-org.netlify.app/guide/service-worker-without-pwa-capabilities.html#registering-of-the-service-worker-in-your-app
let swURL: URL;
let extraOptions: { type: "module" } | undefined;
if (import.meta.env.MODE === "production") {
  swURL = new URL(import.meta.env.BASE_URL + "sw.js", location.href);
} else {
  swURL = new URL("/dev-sw.js?dev-sw", location.href);
  extraOptions = { type: "module" };
}

const pageURL = new URL(location.href);
pageURL.search = "";
pageURL.hash = "";
const pageHadSW = navigator.serviceWorker.controller?.scriptURL === swURL.href;
(async () => {
  await navigator.serviceWorker.register(swURL, {
    scope: pageURL.href,
    ...extraOptions,
  });
  await navigator.serviceWorker.ready;
  if (!pageHadSW) {
    location.reload();
  }
})();

const crossOriginIsolated = globalThis.crossOriginIsolated;
</script>

<template>
  <template v-if="pageHadSW">
    <p>
      Cross-origin isolated? <code>{{ crossOriginIsolated }}</code>
    </p>
    <SharedArrayBufferWidget />
    <CachedImageWidget />
    <ServiceWorkerWidget />
    <RandomColorSWAPIWidget />
  </template>
  <Spinner v-else />
</template>

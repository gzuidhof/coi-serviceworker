<script setup lang="ts">
import { ref } from "vue";
import imageURL from "../assets/image.jpg?url";

const repr = ref<string>();

(async () => {
  const cache = await caches.open("my-cache");
  const response = await cache.match(imageURL);
  if (response) {
    let httpResponseText = "";
    httpResponseText += `HTTP/1.1 ${response.status} ${response.statusText}\n`;
    for (const [name, value] of response.headers) {
      httpResponseText += `${name}: ${value}\n`;
    }
    httpResponseText += "\n";
    const blob = await response.blob();
    httpResponseText += `<${blob.size} bytes>`;
    repr.value = httpResponseText;
  } else {
    repr.value = "<no response>";
  }
})();
</script>

<template>
  <p>This large image should be cached by the service worker</p>
  <img src="../assets/image.jpg" width="200" />

  <p>
    Here's the cache match for <code>{{ imageURL }}</code> which should exist.
  </p>
  <pre><code>{{ repr }}</code></pre>
</template>

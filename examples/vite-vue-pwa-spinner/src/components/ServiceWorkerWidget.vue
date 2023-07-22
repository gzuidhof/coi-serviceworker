<script setup lang="ts">
import { ref } from "vue";

const disabled = ref(false);
const controllerURL = ref<string>();

const f = () => {
  controllerURL.value =
    navigator.serviceWorker.controller?.scriptURL ?? "<no controller>";
};
f();
navigator.serviceWorker.addEventListener("controllerchange", f);

async function handleClick(event: MouseEvent) {
  disabled.value = true;
  const registration = await navigator.serviceWorker.getRegistration();
  await registration?.unregister();
  disabled.value = false;
}
</script>

<template>
  <p>
    Current service worker controller: <code>{{ controllerURL }}</code>
  </p>

  <button @click="handleClick" :disabled="disabled">Unregister</button>
  <p>⚠️ When you refresh the page the service worker will be re-registered.</p>
</template>

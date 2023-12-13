<script setup lang="ts">
import { ref } from "vue";

const buffer = ref<SharedArrayBuffer>();
const length = ref(10);
const repr = ref<string>();

const workerCode = `
let currentBuffer;
globalThis.onmessage = async ({ data }) => {
  const [buffer] = data;
  currentBuffer = buffer;
  const view = new Uint8Array(buffer);
  for (let i = 0; i < view.length; i++) {
    await new Promise((r) => setTimeout(r, 100));
    if (currentBuffer !== buffer) {
      return;
    }
    view[i] = i;
  }
};
`;

const workerURL = URL.createObjectURL(
  new Blob([workerCode], { type: "text/javascript" })
);
const worker = new Worker(workerURL, { type: "module" });

let id: ReturnType<typeof setInterval> | undefined;
function handleClick() {
  buffer.value = new SharedArrayBuffer(length.value);
  worker.postMessage([buffer.value!]);

  clearInterval(id);
  id = undefined;
  const f = () => {
    const bytes = new Uint8Array(buffer.value!);
    repr.value = JSON.stringify([...bytes]);
  };
  id = setInterval(f, 100);
  f();
}
handleClick();
</script>

<template>
  <button @click="handleClick">Create <code>SharedArrayBuffer</code></button>
  <input type="number" v-model.number="length" />

  <p>The bytes are updated from a <code>Worker</code>!</p>
  <pre v-if="repr"><code>{{ repr }}</code></pre>
</template>

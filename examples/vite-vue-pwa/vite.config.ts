import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   headers: {
  //     "Cross-Origin-Embedder-Policy": "require-corp",
  //     "Cross-Origin-Opener-Policy": "same-origin",
  //   },
  // },
  plugins: [
    vue(),
    // https://vite-pwa-org.netlify.app/guide/service-worker-without-pwa-capabilities.html
    VitePWA({
      srcDir: "src",
      filename: "sw.ts",
      strategies: "injectManifest",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        // @ts-ignore
        injectionPoint: null,
      },
      // https://vite-pwa-org.netlify.app/guide/development.html#plugin-configuration
      devOptions: {
        enabled: true,
      },
    }),
  ],
});

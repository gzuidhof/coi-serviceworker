[⬅️ Back to main README](../../README.md)

# Vite & Vue.js PWA

<div align="center">

![](https://user-images.githubusercontent.com/61068799/255349329-ef9f4d43-2882-4095-9dbb-0c106a1ef96f.png)

<!-- prettier-ignore -->
[Live demo](https://octocat.github.io/ezcoipage/vite-vue-pwa/)
| [`src/sw.ts`](src/sw.ts)
| [`src/App.vue`](src/App.vue)

</div>

🔄 Includes `LoadingSpinner` while the SW is registering on first load \
⚡ Uses [Vite] as the build tool \
🔰 Uses popular [Vue.js] JavaScript framework \
🔀 Demos cross-thread `SharedArrayBuffer` mutation \
🅿️ Uses [Vite PWA] to manage the service worker

To get started, peruse the code 👩‍💻 and copy-paste 📋 any bits you find
interesting into your own project! 😊

## Vite PWA gotchas

When you use the [Vite PWA] plugin, there's a few gotchas to be aware of.

1. The dev SW is **not** enabled by default. You need to set
   `devOptions.enabled: true` in your plugin config. This can be useful if you
   want to just set-and-forget the service worker in production, but want to use
   _real headers_ (via Vite middleware) in development.

2. The dev service worker endpoint `/dev-sw.js?dev-sw` is **independent of your
   `sw.ts` file name**. That means you need some kind of
   `if (import.meta.env.MODE === "production")` switch to swap between dev SW
   and prod SW.

3. The dev SW uses ESM, but the prod SW doesn't. That means you need _another
   switch_ to `if (import.meta.env.MODE === "production")` to swap between
   `type: "module"` and `type: "classic"` when
   `navigator.serviceWorker.register()`-ing the service worker.

Here's the config that this example uses:

```js
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
```

And here's the relevant code to properly get the SW URL and type:

```ts
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
```

[vite]: https://vitejs.dev/
[vue.js]: https://vuejs.org/
[vite pwa]: https://vite-pwa-org.netlify.app/

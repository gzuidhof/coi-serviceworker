import imageURL from "./assets/image.jpg?url";
// @ts-ignore
import randomColor from "randomcolor";
declare var randomColor: () => `#${string}`;

globalThis.addEventListener("install", (event) => {
  globalThis.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open("my-cache");
      await cache.addAll([imageURL]);
    })()
  );
});

globalThis.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

globalThis.addEventListener("fetch", (event) => {
  if (
    new URL(event.request.url).origin === origin &&
    event.request.method === "GET" &&
    new URL(event.request.url).pathname === "/sw-api/random-color"
  ) {
    return event.respondWith(new Response(JSON.stringify(randomColor())));
  }

  if (
    new URL(event.request.url).origin === origin &&
    event.request.url.startsWith(registration.scope)
  ) {
    return event.respondWith(
      (async () => {
        const response = await fetch(event.request);
        if (
          !response.status ||
          new URL(response.url).origin !== origin ||
          !response.url.startsWith(registration.scope)
        ) {
          return response;
        }
        const headers = new Headers(response.headers);
        headers.set("Cross-Origin-Embedder-Policy", "require-corp");
        headers.set("Cross-Origin-Opener-Policy", "same-origin");
        headers.set("Cross-Origin-Resource-Policy", "cross-origin");
        const { status, statusText } = response;
        return new Response(response.body, { status, statusText, headers });
      })()
    );
  }
});

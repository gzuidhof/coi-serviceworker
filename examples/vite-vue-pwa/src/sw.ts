globalThis.addEventListener("install", (event) => {
  globalThis.skipWaiting();
});

globalThis.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

globalThis.addEventListener("fetch", (event) => {
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

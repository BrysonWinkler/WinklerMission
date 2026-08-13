const CACHE_NAME = "winkler-mission-archive-v3";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./config.js",
    "./manifest.json",
    "./icon.png"
];


// INSTALL
self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
    );

});


// ACTIVATE
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            );

        }).then(() => {

            return self.clients.claim();

        })

    );

});


// FETCH
self.addEventListener("fetch", event => {

    const request = event.request;
    const url = new URL(request.url);


    // NEVER CACHE GOOGLE APPS SCRIPT API
    if (
        url.hostname === "script.google.com" ||
        url.hostname === "script.googleusercontent.com"
    ) {

        event.respondWith(
            fetch(request, {
                cache: "no-store"
            })
        );

        return;

    }


    // Only handle GET requests
    if (request.method !== "GET") {
        return;
    }


    // App files: network first
    event.respondWith(

        fetch(request, {
            cache: "no-store"
        })

        .then(response => {

            if (response &&
                response.status === 200) {

                const copy = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(request, copy);
                    });

            }

            return response;

        })

        .catch(() => {

            return caches.match(request);

        })

    );

});

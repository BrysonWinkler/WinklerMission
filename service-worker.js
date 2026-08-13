const CACHE_NAME =
    "winkler-mission-archive-v3.1.1";


const APP_FILES = [

    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./config.js",

    "./manifest.json",

    "./icon.png"

];



// =====================================
// INSTALL
// =====================================

self.addEventListener(
    "install",
    function(event) {

        self.skipWaiting();


        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(function(cache) {

                    return cache.addAll(
                        APP_FILES
                    );

                })

        );

    }
);



// =====================================
// ACTIVATE
// =====================================

self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(

            caches
                .keys()
                .then(function(keys) {

                    return Promise.all(

                        keys
                            .filter(function(key) {

                                return (
                                    key !==
                                    CACHE_NAME
                                );

                            })

                            .map(function(key) {

                                return caches.delete(
                                    key
                                );

                            })

                    );

                })

                .then(function() {

                    return self.clients.claim();

                })

        );

    }
);



// =====================================
// FETCH
// =====================================

self.addEventListener(
    "fetch",
    function(event) {

        const request =
            event.request;


        const url =
            new URL(
                request.url
            );


        /*
         * NEVER CACHE GOOGLE APPS SCRIPT.
         *
         * This is critical because the
         * emails and photos are live data.
         */

        if (

            url.hostname ===
                "script.google.com"

            ||

            url.hostname ===
                "script.googleusercontent.com"

        ) {

            event.respondWith(

                fetch(

                    request,

                    {
                        cache: "no-store"
                    }

                )

            );


            return;

        }



        /*
         * Only handle GET requests.
         */

        if (
            request.method !== "GET"
        ) {

            return;

        }



        /*
         * Website files use
         * NETWORK FIRST.
         *
         * This means GitHub gets
         * the newest version first.
         *
         * Cache is only fallback.
         */

        event.respondWith(

            fetch(

                request,

                {
                    cache: "no-store"
                }

            )

            .then(function(response) {


                if (

                    response &&

                    response.status === 200

                ) {


                    const copy =
                        response.clone();


                    caches
                        .open(
                            CACHE_NAME
                        )
                        .then(
                            function(cache) {

                                cache.put(
                                    request,
                                    copy
                                );

                            }
                        );

                }


                return response;

            })


            .catch(function() {


                return caches.match(
                    request
                );

            })

        );

    }

);

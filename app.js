// =====================================
// WINKLER MISSION ARCHIVE
// APP.JS
// =====================================

const APP_VERSION = "3.1.0";

console.log("=================================");
console.log("WINKLER MISSION ARCHIVE");
console.log("APP VERSION:", APP_VERSION);
console.log("=================================");

let letters = [];
let photos = [];


// =====================================
// API / JSONP
// =====================================

function loadJSONP(action, params = {}) {

    return new Promise(function(resolve, reject) {

        const callbackName =
            "missionCallback_" +
            Date.now() +
            "_" +
            Math.floor(Math.random() * 100000);


        const script =
            document.createElement("script");


        let url =
            API_URL +
            "?action=" +
            encodeURIComponent(action);


        // Add additional parameters
        Object.keys(params).forEach(function(key) {

            url +=
                "&" +
                encodeURIComponent(key) +
                "=" +
                encodeURIComponent(params[key]);

        });


        // JSONP callback
        url +=
            "&callback=" +
            encodeURIComponent(callbackName);


        // Cache breaker
        url +=
            "&t=" +
            Date.now();


        let completed = false;


        window[callbackName] = function(data) {

            if (completed) {
                return;
            }


            completed = true;


            console.log(
                "API SUCCESS:",
                action,
                data
            );


            delete window[callbackName];


            if (script.parentNode) {

                script.parentNode.removeChild(script);

            }


            resolve(data);

        };


        script.onerror = function() {

            if (completed) {
                return;
            }


            completed = true;


            console.error(
                "API ERROR:",
                action
            );


            delete window[callbackName];


            if (script.parentNode) {

                script.parentNode.removeChild(script);

            }


            reject(
                new Error(
                    "API request failed: " +
                    action
                )
            );

        };


        script.src = url;


        console.log(
            "API REQUEST:",
            url
        );


        document.body.appendChild(script);


        // Timeout after 20 seconds
        setTimeout(function() {

            if (completed) {
                return;
            }


            completed = true;


            delete window[callbackName];


            if (script.parentNode) {

                script.parentNode.removeChild(script);

            }


            reject(
                new Error(
                    "API timeout: " +
                    action
                )
            );

        }, 20000);

    });

}


// =====================================
// MANUAL SYNC
// =====================================

async function refreshArchive() {

    const button =
        document.getElementById(
            "refreshButton"
        );


    if (button) {

        button.disabled = true;

        button.innerText =
            "🔄 Syncing...";

    }


    console.log(
        "================================="
    );

    console.log(
        "MANUAL ARCHIVE SYNC"
    );

    console.log(
        "================================="
    );


    try {

        await Promise.all([

            loadLetters(),

            loadPhotos(),

            loadMission()

        ]);


        console.log(
            "ARCHIVE SYNC COMPLETE"
        );


        if (button) {

            button.innerText =
                "✓ Synced";

        }


        setTimeout(function() {

            if (button) {

                button.innerText =
                    "🔄 Sync Archive";

                button.disabled = false;

            }

        }, 2000);

    }

    catch (error) {

        console.error(
            "ARCHIVE SYNC FAILED:",
            error
        );


        if (button) {

            button.innerText =
                "❌ Sync Failed";

            button.disabled = false;

        }

    }

}


// =====================================
// PAGE NAVIGATION
// =====================================

function showPage(page) {

    document.getElementById(
        "homePage"
    ).style.display = "none";


    document.getElementById(
        "lettersPage"
    ).style.display = "none";


    document.getElementById(
        "photosPage"
    ).style.display = "none";


    document.getElementById(
        "mapPage"
    ).style.display = "none";


    document.getElementById(
        page + "Page"
    ).style.display = "block";


    if (page === "letters") {

        loadLetters();

    }


    if (page === "photos") {

        loadPhotos();

    }


    if (page === "map") {

        loadMap();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =====================================
// DATE HELPERS
// =====================================

function daysBetween(a, b) {

    return Math.ceil(
        (b - a) /
        (1000 * 60 * 60 * 24)
    );

}


// =====================================
// MISSION
// =====================================

async function loadMission() {

    try {

        const data =
            await loadJSONP(
                "mission"
            );


        const today =
            new Date();


        const mtc =
            new Date(
                data.mtcDate
            );


        const mexico =
            new Date(
                data.mexicoDate
            );


        const mission =
            new Date(
                data.missionStart
            );


        let title;
        let subtitle;
        let days;


        if (today < mtc) {

            title =
                "🏠 Home MTC";

            subtitle =
                "Preparing to serve";

            days =
                daysBetween(
                    today,
                    mtc
                );

        }

        else if (today < mexico) {

            title =
                "🇲🇽 CCM México City";

            subtitle =
                "Mission training";

            days =
                daysBetween(
                    today,
                    mexico
                );

        }

        else if (today < mission) {

            title =
                "🌵 Monterrey Mission";

            subtitle =
                "Almost there";

            days =
                daysBetween(
                    today,
                    mission
                );

        }

        else {

            title =
                "🌵 Monterrey Mission";

            subtitle =
                "Serving in Monterrey West, México";

            days =
                daysBetween(
                    mission,
                    today
                );

        }


        document.getElementById(
            "missionCard"
        ).innerHTML = `

            <div class="status">

                <div class="mission-title">
                    ${title}
                </div>

                <p>
                    ${subtitle}
                </p>

                <div class="counter">
                    ${days} Days
                </div>

            </div>

        `;


        return data;

    }

    catch (error) {

        console.error(
            "MISSION ERROR:",
            error
        );

    }

}


// =====================================
// TIMELINE
// =====================================

function displayTimeline() {

    const today =
        new Date();


    const events = [

        {
            name: "🏠 Home MTC",
            date: new Date(
                "2026-09-09"
            )
        },

        {
            name: "🇲🇽 Mexico City MTC",
            date: new Date(
                "2026-09-24"
            )
        },

        {
            name: "🌵 Monterrey Mission",
            date: new Date(
                "2026-10-21"
            )
        }

    ];


    let html = "";


    events.forEach(function(event) {

        const days =
            daysBetween(
                today,
                event.date
            );


        html += `

            <div class="countdown-item">

                ${event.name}

                <strong>

                    ${
                        days > 0
                            ? days + " Days"
                            : "Started ✓"
                    }

                </strong>

            </div>

        `;

    });


    document.getElementById(
        "timeline"
    ).innerHTML = html;

}


// =====================================
// EMAILS
// =====================================

async function loadLetters() {

    console.log(
        "Loading fresh emails..."
    );


    try {

        const data =
            await loadJSONP(
                "letters"
            );


        if (!Array.isArray(data)) {

            throw new Error(
                "Letters API did not return an array."
            );

        }


        letters = data;


        console.log(
            "EMAILS RECEIVED:",
            letters.length
        );


        displayLetters();


        return data;

    }

    catch (error) {

        console.error(
            "EMAIL ERROR:",
            error
        );


        document.getElementById(
            "latest"
        ).innerHTML =
            "Unable to load emails.";


        document.getElementById(
            "journal"
        ).innerHTML =
            "Unable to load emails.";

    }

}


// =====================================
// DISPLAY EMAILS
// =====================================

function displayLetters() {

    const latest =
        document.getElementById(
            "latest"
        );


    const journal =
        document.getElementById(
            "journal"
        );


    if (
        !letters ||
        letters.length === 0
    ) {

        latest.innerHTML =
            "No emails found.";


        journal.innerHTML =
            "No emails found.";


        return;

    }


    const newest =
        letters[0];


    latest.innerHTML = `

        <h3>
            ${escapeHTML(
                newest.name
            )}
        </h3>

        <a
            class="button"
            href="${newest.url}"
            target="_blank"
        >
            Open Latest Email
        </a>

    `;


    let html = "";


    letters.forEach(function(letter) {

        html += `

            <div class="entry">

                <h3>
                    📖
                    ${escapeHTML(
                        letter.name
                    )}
                </h3>

                <div class="date">

                    ${formatDate(
                        letter.date
                    )}

                </div>

                <a
                    class="button"
                    href="${letter.url}"
                    target="_blank"
                >
                    Read Letter
                </a>

            </div>

        `;

    });


    journal.innerHTML =
        html;

}


// =====================================
// PHOTOS
// =====================================

async function loadPhotos() {

    console.log(
        "Loading fresh photos..."
    );


    try {

        const data =
            await loadJSONP(
                "photos"
            );


        if (!Array.isArray(data)) {

            throw new Error(
                "Photos API did not return an array."
            );

        }


        photos = data;


        console.log(
            "PHOTOS RECEIVED:",
            photos.length
        );


        displayPhotos();


        return data;

    }

    catch (error) {

        console.error(
            "PHOTO ERROR:",
            error
        );


        document.getElementById(
            "photoGallery"
        ).innerHTML =
            "Unable to load photos.";

    }

}


// =====================================
// DISPLAY PHOTOS
// =====================================

function displayPhotos() {

    const gallery =
        document.getElementById(
            "photoGallery"
        );


    if (
        !photos ||
        photos.length === 0
    ) {

        gallery.innerHTML =
            "<p>No photos found.</p>";

        return;

    }


    let html = "";


    photos.forEach(function(photo) {

        html += `

            <a
                href="${photo.link}"
                target="_blank"
            >

                <img
                    src="${photo.url}&v=${Date.now()}"
                    alt="${escapeHTML(
                        photo.name
                    )}"
                    loading="lazy"
                >

            </a>

        `;

    });


    gallery.innerHTML =
        html;

}


// =====================================
// MAPS
// =====================================

const MAPS = {

    utah:
        "1-KUPC_9u7V9t-96XTCz3Sj_H8caD0IRr",

    mexico:
        "1syyre3laiwnkMWDKYnorvfA9OLOOyCRQ"

};


const LOCATIONS = {

    tremonton: {

        map: "utah",

        name:
            "Tremonton, Utah",

        description:
            "Home MTC",

        x: 40,

        y: 16.5

    },


    mexicoCity: {

        map: "mexico",

        name:
            "México City, México",

        description:
            "CCM México City",

        x: 58.5,

        y: 69.5

    },


    monterrey: {

        map: "mexico",

        name:
            "Monterrey, México",

        description:
            "Monterrey West México Mission",

        x: 56,

        y: 40.5

    }

};


// =====================================
// MAP BUTTONS
// =====================================

async function setTestLocation(location) {

    try {

        await loadJSONP(

            "setLocation",

            {
                location: location
            }

        );


        await loadMap();

    }

    catch (error) {

        console.error(
            "LOCATION ERROR:",
            error
        );

    }

}


// =====================================
// SHOW MAP
// =====================================

async function showMapLocation(location) {

    try {

        const imageData =
            await loadJSONP(

                "map",

                {
                    id:
                        MAPS[
                            location.map
                        ]
                }

            );


        document.getElementById(
            "mapImage"
        ).src =
            imageData;

    }

    catch (error) {

        console.error(
            "MAP IMAGE ERROR:",
            error
        );

    }


    const pin =
        document.getElementById(
            "pin"
        );


    const pulse =
        document.getElementById(
            "pulse"
        );


    pin.style.left =
        location.x + "%";


    pin.style.top =
        location.y + "%";


    pulse.style.left =
        location.x + "%";


    pulse.style.top =
        location.y + "%";


    document.getElementById(
        "mapInfo"
    ).innerHTML = `

        <b>
            ${location.name}
        </b>

        <br>

        ${location.description}

    `;

}


// =====================================
// LOAD MAP
// =====================================

async function loadMap() {

    try {

        const currentLocation =
            await loadJSONP(
                "location"
            );


        if (
            currentLocation ===
            "home"
        ) {

            await showMapLocation(
                LOCATIONS.tremonton
            );

            return;

        }


        if (
            currentLocation ===
            "ccm"
        ) {

            await showMapLocation(
                LOCATIONS.mexicoCity
            );

            return;

        }


        if (
            currentLocation ===
            "mission"
        ) {

            await showMapLocation(
                LOCATIONS.monterrey
            );

            return;

        }


        const today =
            new Date();


        if (
            today <
            new Date(
                "2026-09-24"
            )
        ) {

            await showMapLocation(
                LOCATIONS.tremonton
            );

        }

        else if (
            today <
            new Date(
                "2026-10-21"
            )
        ) {

            await showMapLocation(
                LOCATIONS.mexicoCity
            );

        }

        else {

            await showMapLocation(
                LOCATIONS.monterrey
            );

        }

    }

    catch (error) {

        console.error(
            "MAP ERROR:",
            error
        );

    }

}


// =====================================
// HELPERS
// =====================================

function escapeHTML(value) {

    return String(
        value || ""
    )

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

}


function formatDate(value) {

    const date =
        new Date(value);


    return date.toLocaleDateString();

}


// =====================================
// START APP
// =====================================

window.addEventListener(
    "load",
    function() {

        console.log(
            "APP LOADED"
        );


        loadMission();

        displayTimeline();

        loadLetters();

        loadPhotos();

    }
);


// =====================================
// REFRESH WHEN RETURNING TO APP
// =====================================

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.visibilityState ===
            "visible"
        ) {

            console.log(
                "APP VISIBLE - REFRESHING DATA"
            );


            loadLetters();

            loadPhotos();

        }

    }
);

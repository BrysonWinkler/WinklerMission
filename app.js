// =====================================
// WINKLER MISSION ARCHIVE
// APP.JS
// =====================================

const APP_VERSION = "2.0.0";

console.log("Winkler Mission Archive:", APP_VERSION);

let letters = [];
let photos = [];


// =====================================
// API CONNECTION
// =====================================

function loadJSONP(action, callback) {

    const callbackName =
        "winklerCallback_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 10);

    const script =
        document.createElement("script");

    let finished = false;

    function cleanup() {

        if (finished) return;

        finished = true;

        delete window[callbackName];

        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }

    }

    window[callbackName] = function(data) {

        try {

            callback(data);

        } catch (error) {

            console.error(
                "API callback error:",
                error
            );

        }

        cleanup();

    };


    script.onerror = function() {

        console.error(
            "Unable to contact Mission Archive API."
        );

        cleanup();

    };


    const separator =
        API_URL.includes("?")
            ? "&"
            : "?";


    script.src =
        API_URL +
        separator +
        action +
        "&callback=" +
        callbackName +
        "&cacheBust=" +
        Date.now();


    document.head.appendChild(script);

}


// =====================================
// PAGE NAVIGATION
// =====================================

function showPage(page) {

    document.getElementById("homePage").style.display = "none";

    document.getElementById("lettersPage").style.display = "none";

    document.getElementById("photosPage").style.display = "none";

    document.getElementById("mapPage").style.display = "none";


    const target =
        document.getElementById(page + "Page");


    if (!target) return;


    target.style.display = "block";


    // ALWAYS GET FRESH DATA

    if (page === "home") {

        loadMission();

        loadLetters();

    }


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

function loadMission() {

    loadJSONP(
        "action=mission",
        function(data) {

            if (!data) return;


            const today =
                new Date();

            const mtc =
                new Date(data.mtcDate);

            const mexico =
                new Date(data.mexicoDate);

            const mission =
                new Date(data.missionStart);


            let title;
            let subtitle;
            let days;


            if (today < mtc) {

                title = "🏠 Home MTC";

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

        }
    );

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
            date: new Date("2026-09-09")
        },

        {
            name: "🇲🇽 Mexico City MTC",
            date: new Date("2026-09-24")
        },

        {
            name: "🌵 Monterrey Mission",
            date: new Date("2026-10-21")
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

function loadLetters() {

    console.log(
        "Loading fresh emails..."
    );


    loadJSONP(
        "action=letters",
        function(data) {

            if (!Array.isArray(data)) {

                console.error(
                    "Invalid email data:",
                    data
                );

                return;

            }


            letters = data;


            displayLetters();

        }
    );

}


// =====================================
// DISPLAY EMAILS
// =====================================

function displayLetters() {

    const latestElement =
        document.getElementById("latest");

    const journalElement =
        document.getElementById("journal");


    if (!latestElement ||
        !journalElement) {

        return;

    }


    let html = "";


    if (letters.length === 0) {

        latestElement.innerHTML =
            "No emails found.";

        journalElement.innerHTML =
            "No emails found.";

        return;

    }


    // Latest email

    const latest =
        letters[0];


    latestElement.innerHTML = `

        <h3>
            ${escapeHTML(latest.name)}
        </h3>

        <a
            class="button"
            href="${latest.url}"
            target="_blank"
            rel="noopener"
        >
            Open Latest Email
        </a>

    `;


    // Archive

    letters.forEach(function(letter) {

        html += `

            <div class="entry">

                <h3>
                    📖 ${escapeHTML(letter.name)}
                </h3>

                <div class="date">

                    ${formatDate(letter.date)}

                </div>

                <a
                    class="button"
                    href="${letter.url}"
                    target="_blank"
                    rel="noopener"
                >
                    Read Letter
                </a>

            </div>

        `;

    });


    journalElement.innerHTML =
        html;

}


// =====================================
// PHOTOS
// =====================================

function loadPhotos() {

    console.log(
        "Loading fresh photos..."
    );


    loadJSONP(
        "action=photos",
        function(data) {

            if (!Array.isArray(data)) {

                console.error(
                    "Invalid photo data:",
                    data
                );

                return;

            }


            photos = data;


            displayPhotos();

        }
    );

}


// =====================================
// DISPLAY PHOTOS
// =====================================

function displayPhotos() {

    const gallery =
        document.getElementById(
            "photoGallery"
        );


    if (!gallery) return;


    if (photos.length === 0) {

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
                rel="noopener"
            >

                <img
                    src="${photo.url}&cacheBust=${Date.now()}"
                    alt="${escapeHTML(photo.name)}"
                    loading="lazy"
                >

            </a>

        `;

    });


    gallery.innerHTML =
        html;

}


// =====================================
// MAP SYSTEM
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

        name: "Tremonton, Utah",

        description: "Home MTC",

        x: 40,

        y: 16.5

    },


    mexicoCity: {

        map: "mexico",

        name: "México City, México",

        description: "CCM México City",

        x: 58.5,

        y: 69.5

    },


    monterrey: {

        map: "mexico",

        name: "Monterrey, México",

        description:
            "Monterrey West México Mission",

        x: 56,

        y: 40.5

    }

};


// =====================================
// MAP CONTROLS
// =====================================

function setTestLocation(location) {

    loadJSONP(

        "action=setLocation&location=" +
        encodeURIComponent(location),

        function() {

            loadMap();

        }

    );

}


// =====================================
// SHOW MAP
// =====================================

function showMapLocation(location) {

    loadJSONP(

        "action=map&id=" +
        encodeURIComponent(
            MAPS[location.map]
        ),

        function(imageData) {

            const image =
                document.getElementById(
                    "mapImage"
                );


            if (image) {

                image.src =
                    imageData;

            }

        }

    );


    const pin =
        document.getElementById("pin");

    const pulse =
        document.getElementById("pulse");


    if (pin) {

        pin.style.left =
            location.x + "%";

        pin.style.top =
            location.y + "%";

    }


    if (pulse) {

        pulse.style.left =
            location.x + "%";

        pulse.style.top =
            location.y + "%";

    }


    const info =
        document.getElementById(
            "mapInfo"
        );


    if (info) {

        info.innerHTML = `

            <b>
                ${location.name}
            </b>

            <br>

            ${location.description}

        `;

    }

}


// =====================================
// LOAD MAP
// =====================================

function loadMap() {

    loadJSONP(
        "action=location",
        function(testLocation) {

            if (testLocation === "home") {

                showMapLocation(
                    LOCATIONS.tremonton
                );

            }

            else if (
                testLocation === "ccm"
            ) {

                showMapLocation(
                    LOCATIONS.mexicoCity
                );

            }

            else if (
                testLocation === "mission"
            ) {

                showMapLocation(
                    LOCATIONS.monterrey
                );

            }

            else {

                const today =
                    new Date();


                if (
                    today <
                    new Date("2026-09-24")
                ) {

                    showMapLocation(
                        LOCATIONS.tremonton
                    );

                }

                else if (
                    today <
                    new Date("2026-10-21")
                ) {

                    showMapLocation(
                        LOCATIONS.mexicoCity
                    );

                }

                else {

                    showMapLocation(
                        LOCATIONS.monterrey
                    );

                }

            }

        }
    );

}


// =====================================
// HELPERS
// =====================================

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


function formatDate(value) {

    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleDateString();

}


// =====================================
// INITIAL LOAD
// =====================================

function refreshEverything() {

    loadMission();

    displayTimeline();

    loadLetters();

    loadPhotos();

}


// =====================================
// START
// =====================================

window.addEventListener(
    "load",
    function() {

        console.log(
            "Starting Mission Archive",
            APP_VERSION
        );


        refreshEverything();

    }
);


// =====================================
// REFRESH WHEN APP RETURNS
// =====================================

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.visibilityState ===
            "visible"
        ) {

            refreshEverything();

        }

    }
);


// =====================================
// AUTOMATIC REFRESH
// =====================================

setInterval(
    function() {

        if (
            document.visibilityState ===
            "visible"
        ) {

            loadLetters();

            loadPhotos();

        }

    },
    60000
);

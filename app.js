// =====================================
// WINKLER MISSION ARCHIVE
// APP.JS
// =====================================

const APP_VERSION = "1.0.3";

console.log(
    "Winkler Mission Archive Version:",
    APP_VERSION
);

let letters = [];
let photos = [];


// =====================================
// JSONP CONNECTION
// =====================================

function loadJSONP(action, callback) {

    const callbackName =
        "callback_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2);


    window[callbackName] = function(data) {

        callback(data);

        delete window[callbackName];

        if (script.parentNode) {
            script.remove();
        }

    };


    const script =
        document.createElement("script");


    script.src =
        API_URL +
        "?action=" +
        action +
        "&callback=" +
        callbackName +
        "&t=" +
        Date.now();


    script.onerror = function() {

        console.error(
            "Mission Archive API failed:",
            script.src
        );

    };


    document.body.appendChild(script);

}


// =====================================
// PAGE NAVIGATION
// =====================================

function showPage(page) {

    document.getElementById("homePage").style.display = "none";

    document.getElementById("lettersPage").style.display = "none";

    document.getElementById("photosPage").style.display = "none";

    document.getElementById("mapPage").style.display = "none";


    document.getElementById(
        page + "Page"
    ).style.display = "block";


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
// MISSION CARD
// =====================================

function loadMission() {

    loadJSONP(

        "mission",

        function(data) {

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
// EMAIL ARCHIVE
// =====================================

function loadLetters() {

    console.log(
        "Loading emails..."
    );


    loadJSONP(

        "letters",

        function(data) {

            console.log(
                "Emails loaded:",
                data
            );


            letters = data;


            displayLetters();

        }

    );

}


// =====================================
// DISPLAY EMAILS
// =====================================

function displayLetters() {

    let html = "";


    if (
        letters &&
        letters.length > 0
    ) {

        const latest =
            letters[0];


        document.getElementById(
            "latest"
        ).innerHTML = `

            <h3>
                ${latest.name}
            </h3>

            <a
                class="button"
                href="${latest.url}"
                target="_blank"
            >
                Open Latest Email
            </a>

        `;

    }

    else {

        document.getElementById(
            "latest"
        ).innerHTML =
            "No emails found";

    }


    letters.forEach(function(letter) {

        html += `

            <div class="entry">

                <h3>
                    📖 ${letter.name}
                </h3>

                <div class="date">
                    ${new Date(
                        letter.date
                    ).toLocaleDateString()}
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


    document.getElementById(
        "journal"
    ).innerHTML = html;

}


// =====================================
// PHOTOS
// =====================================

function loadPhotos() {

    console.log(
        "Loading photos..."
    );


    loadJSONP(

        "photos",

        function(data) {

            console.log(
                "Photos loaded:",
                data
            );


            photos = data;


            displayPhotos();

        }

    );

}


function displayPhotos() {

    let html = "";


    photos.forEach(function(photo) {

        html += `

            <img
                src="${photo.url}"
                loading="lazy"
            >

        `;

    });


    if (photos.length === 0) {

        html =
            "<p>No photos found.</p>";

    }


    document.getElementById(
        "photoGallery"
    ).innerHTML = html;

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
// MAP BUTTON CONTROLS
// =====================================

function setTestLocation(location) {

    loadJSONP(

        "setLocation&location=" +
        encodeURIComponent(location),

        function() {

            loadMap();

        }

    );

}


function showMapLocation(location) {

    loadJSONP(

        "map&id=" +
        encodeURIComponent(
            MAPS[location.map]
        ),

        function(imageData) {

            document.getElementById(
                "mapImage"
            ).src = imageData;

        }

    );


    const pin =
        document.getElementById("pin");

    const pulse =
        document.getElementById("pulse");


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


function loadMap() {

    loadJSONP(

        "location",

        function(testLocation) {

            if (
                testLocation === "home"
            ) {

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
// START APP
// =====================================

window.onload = function() {

    console.log(
        "Starting Winkler Mission Archive..."
    );


    loadMission();

    displayTimeline();

    loadLetters();

    loadPhotos();

};


// =====================================
// REFRESH DATA WHEN APP RETURNS
// =====================================

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.visibilityState ===
            "visible"
        ) {

            loadLetters();

            loadPhotos();

        }

    }
);


// Refresh email/photo data every minute
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

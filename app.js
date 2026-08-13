// =====================================
// WINKLER MISSION ARCHIVE
// APP.JS
// =====================================

const APP_VERSION = "3.1.1";

console.log("=================================");
console.log("WINKLER MISSION ARCHIVE");
console.log("APP VERSION:", APP_VERSION);
console.log("=================================");

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


    let script;


    window[callbackName] = function(data) {

        try {

            callback(data);

        }

        finally {

            delete window[callbackName];

            if (
                script &&
                script.parentNode
            ) {

                script.parentNode.removeChild(script);

            }

        }

    };


    script =
        document.createElement("script");


    /*
     * Build the request.
     *
     * The timestamp and random number
     * prevent cached API responses.
     */

    let url =
        API_URL +
        "?action=" +
        action +
        "&callback=" +
        callbackName +
        "&_=" +
        Date.now() +
        "_" +
        Math.random();


    script.src = url;


    script.onerror = function() {

        console.error(
            "API request failed:",
            url
        );

    };


    document.body.appendChild(script);

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

            if (!data) {

                console.error(
                    "Mission data missing."
                );

                return;

            }


            let today =
                new Date();


            let mtc =
                new Date(
                    data.mtcDate
                );


            let mexico =
                new Date(
                    data.mexicoDate
                );


            let mission =
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


            else if (
                today < mexico
            ) {

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


            else if (
                today < mission
            ) {

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

    let today =
        new Date();


    let events = [

        {

            name:
                "🏠 Home MTC",

            date:
                new Date(
                    "2026-09-09"
                )

        },


        {

            name:
                "🇲🇽 Mexico City MTC",

            date:
                new Date(
                    "2026-09-24"
                )

        },


        {

            name:
                "🌵 Monterrey Mission",

            date:
                new Date(
                    "2026-10-21"
                )

        }

    ];


    let html = "";


    events.forEach(
        function(event) {


            let days =
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

        }
    );


    document.getElementById(
        "timeline"
    ).innerHTML = html;

}



// =====================================
// EMAIL ARCHIVE
// =====================================

function loadLetters() {

    const journal =
        document.getElementById(
            "journal"
        );


    if (journal) {

        journal.innerHTML =
            "Loading Emails...";

    }


    loadJSONP(

        "letters",

        function(data) {

            console.log(
                "LIVE EMAIL DATA:",
                data
            );


            if (
                !Array.isArray(data)
            ) {

                console.error(
                    "Invalid email data:",
                    data
                );


                if (journal) {

                    journal.innerHTML =
                        "Unable to load emails.";

                }


                return;

            }


            letters =
                data;


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


        let latest =
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



    letters.forEach(
        function(letter) {


            html += `

                <div class="entry">

                    <h3>

                        📖 ${letter.name}

                    </h3>


                    <div class="date">

                        ${
                            new Date(
                                letter.date
                            ).toLocaleDateString()
                        }

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

        }
    );



    document.getElementById(
        "journal"
    ).innerHTML = html;

}



// =====================================
// PHOTOS
// =====================================

function loadPhotos() {

    const gallery =
        document.getElementById(
            "photoGallery"
        );


    if (gallery) {

        gallery.innerHTML =
            "Loading photos...";

    }


    loadJSONP(

        "photos",

        function(data) {

            console.log(
                "LIVE PHOTO DATA:",
                data
            );


            if (
                !Array.isArray(data)
            ) {

                console.error(
                    "Invalid photo data:",
                    data
                );


                if (gallery) {

                    gallery.innerHTML =
                        "Unable to load photos.";

                }


                return;

            }


            photos =
                data;


            displayPhotos();

        }

    );

}



// =====================================
// DISPLAY PHOTOS
// =====================================

function displayPhotos() {

    let html = "";


    photos.forEach(
        function(photo) {


            html += `

                <a

                    href="${photo.link}"

                    target="_blank"

                >

                    <img

                        src="${photo.url}"

                        loading="lazy"

                        alt="${photo.name}"

                    >

                </a>

            `;

        }
    );


    if (html === "") {

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

        map:
            "utah",

        name:
            "Tremonton, Utah",

        description:
            "Home MTC",

        x:
            40,

        y:
            16.5

    },


    mexicoCity: {

        map:
            "mexico",

        name:
            "México City, México",

        description:
            "CCM México City",

        x:
            58.5,

        y:
            69.5

    },


    monterrey: {

        map:
            "mexico",

        name:
            "Monterrey, México",

        description:
            "Monterrey West México Mission",

        x:
            56,

        y:
            40.5

    }

};



// =====================================
// MAP BUTTON CONTROLS
// =====================================

function setTestLocation(location) {

    loadJSONP(

        "setLocation&location=" +
        encodeURIComponent(
            location
        ),

        function() {

            loadMap();

        }

    );

}



// =====================================
// DISPLAY MAP LOCATION
// =====================================

function showMapLocation(location) {


    loadJSONP(

        "map&id=" +
        encodeURIComponent(
            MAPS[
                location.map
            ]
        ),

        function(imageData) {


            document.getElementById(
                "mapImage"
            ).src =
                imageData;

        }

    );


    let pin =
        document.getElementById(
            "pin"
        );


    let pulse =
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


                let today =
                    new Date();


                if (
                    today <
                    new Date(
                        "2026-09-24"
                    )
                ) {


                    showMapLocation(

                        LOCATIONS.tremonton

                    );

                }


                else if (
                    today <
                    new Date(
                        "2026-10-21"
                    )
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
// MANUAL ARCHIVE SYNC
// =====================================

function refreshArchive() {


    const button =
        document.getElementById(
            "refreshButton"
        );


    if (button) {

        button.disabled =
            true;


        button.textContent =
            "🔄 Syncing...";

    }


    console.log(
        "Refreshing Mission Archive..."
    );


    /*
     * These make completely new
     * requests to the Apps Script API.
     */

    loadMission();

    displayTimeline();

    loadLetters();

    loadPhotos();


    /*
     * Give the API requests time to
     * complete before restoring button.
     */

    setTimeout(

        function() {


            if (button) {

                button.disabled =
                    false;


                button.textContent =
                    "🔄 Sync Archive";

            }


        },

        2000

    );

}



// =====================================
// START APP
// =====================================

window.addEventListener(

    "load",

    function() {


        console.log(
            "Starting application..."
        );


        loadMission();


        displayTimeline();


        loadLetters();


        loadPhotos();

    }

);

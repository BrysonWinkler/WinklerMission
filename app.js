// =====================================
// WINKLER MISSION JOURNAL APP
// =====================================

console.log("Winkler Mission App Loaded");


// LOAD MISSION DATA

async function loadMission(){

    try {

        const response = await fetch(
            API_URL + "?action=mission"
        );

        const data = await response.json();


        document.getElementById("status").innerHTML = `

            🏠 Home MTC:
            ${data.mtcDate}

            <br><br>

            🇲🇽 Mexico City CCM:
            ${data.mexicoDate}

            <br><br>

            🌵 Monterrey Mission:
            ${data.missionStart}

        `;


    } catch(error){

        console.error("Mission loading failed:", error);

        document.getElementById("status").innerHTML =
        "Unable to load mission data.";

    }

}





// LOAD LETTERS

async function loadLetters(){

    try {

        const response = await fetch(
            API_URL + "?action=letters"
        );

        const data = await response.json();

        console.log("Letters:", data);


    } catch(error){

        console.error("Letters loading failed:", error);

    }

}





// LOAD PHOTOS

async function loadPhotos(){

    try {

        const response = await fetch(
            API_URL + "?action=photos"
        );

        const data = await response.json();

        console.log("Photos:", data);


    } catch(error){

        console.error("Photos loading failed:", error);

    }

}





// START APP

window.onload = function(){

    loadMission();

    loadLetters();

    loadPhotos();

};

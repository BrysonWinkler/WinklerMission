// =====================================
// WINKLER MISSION JOURNAL APP
// =====================================


console.log("Winkler Mission App Loaded");



// LOAD MISSION DATA

async function loadMission(){

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

}





// LOAD LETTERS

async function loadLetters(){

    const response = await fetch(
        API_URL + "?action=letters"
    );


    const data = await response.json();


    console.log("Letters:", data);

}





// LOAD PHOTOS

async function loadPhotos(){

    const response = await fetch(
        API_URL + "?action=photos"
    );


    const data = await response.json();


    console.log("Photos:", data);

}





// START APP

window.onload = function(){

    loadMission();

    loadLetters();

    loadPhotos();

};

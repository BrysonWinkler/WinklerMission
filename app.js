// =====================================
// WINKLER MISSION JOURNAL APP
// =====================================


// Test connection

console.log("Winkler Mission App Loaded");



// Load mission information

async function loadMission(){

    const response = await fetch(
        API_URL + "?action=mission"
    );

    const data = await response.json();

    console.log(data);

}


// Load letters

async function loadLetters(){

    const response = await fetch(
        API_URL + "?action=letters"
    );

    const data = await response.json();

    console.log(data);

}


// Load photos

async function loadPhotos(){

    const response = await fetch(
        API_URL + "?action=photos"
    );

    const data = await response.json();

    console.log(data);

}



// Start app

window.onload = function(){

    loadMission();

    loadLetters();

    loadPhotos();

};

// =====================================
// WINKLER MISSION JOURNAL APP
// =====================================

console.log("Winkler Mission App Loaded");


// JSONP LOADER

function loadJSONP(action, callbackName, callback){

    window[callbackName] = callback;


    const script = document.createElement("script");

    script.src =
        API_URL +
        "?action=" +
        action +
        "&callback=" +
        callbackName;


    document.body.appendChild(script);

}



// LOAD MISSION

function loadMission(){

    loadJSONP(
        "mission",
        "missionCallback",
        function(data){

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
    );

}



// LOAD LETTERS

function loadLetters(){

    loadJSONP(
        "letters",
        "lettersCallback",
        function(data){

            console.log("Letters:", data);

        }
    );

}



// LOAD PHOTOS

function loadPhotos(){

    loadJSONP(
        "photos",
        "photosCallback",
        function(data){

            console.log("Photos:", data);

        }
    );

}



// START APP

window.onload=function(){

    loadMission();

    loadLetters();

    loadPhotos();

};

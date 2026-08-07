// =====================================
// WINKLER MISSION JOURNAL APP
// =====================================

console.log("Winkler Mission App Loaded");


// =====================================
// JSONP LOADER
// =====================================

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




// =====================================
// MISSION DATA
// =====================================

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






// =====================================
// EMAIL ARCHIVE
// =====================================

function loadLetters(){


    loadJSONP(

        "letters",

        "lettersCallback",

        function(data){


            let html = "";


            if(data.length === 0){

                html = "No emails yet.";

            }



            data.forEach(function(letter){


                html += `


                <div class="card">


                    <h3>
                    📖 ${letter.name}
                    </h3>


                    <a class="button"
                    href="${letter.url}"
                    target="_blank">

                    Read Letter

                    </a>


                </div>


                `;


            });



            document.getElementById("letters")
            .innerHTML = html;


        }

    );


}







// =====================================
// PHOTOS
// =====================================

function loadPhotos(){


    loadJSONP(

        "photos",

        "photosCallback",

        function(data){


            let html = "";


            if(data.length === 0){

                html = "No photos yet.";

            }



            data.forEach(function(photo){


                html += `


                <img

                src="${photo.url}"

                alt="${photo.name}"

                >


                `;


            });



            document.getElementById("photos")
            .innerHTML = html;


        }

    );


}






// =====================================
// START APP
// =====================================

window.onload=function(){


    loadMission();


    loadLetters();


    loadPhotos();


};

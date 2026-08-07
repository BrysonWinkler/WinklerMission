// =====================================
// WINKLER MISSION ARCHIVE APP
// =====================================


console.log("Winkler Mission App Loaded");



let letters = [];

let photos = [];




// =====================================
// PAGE NAVIGATION
// =====================================


function showPage(page){


document.getElementById("homePage").style.display="none";

document.getElementById("lettersPage").style.display="none";

document.getElementById("photosPage").style.display="none";

document.getElementById("mapPage").style.display="none";



document.getElementById(page+"Page").style.display="block";



if(page=="map"){

loadMap();

}



window.scrollTo({

top:0,

behavior:"smooth"

});


}







// =====================================
// JSONP CONNECTION TO APPS SCRIPT
// =====================================


function loadJSONP(action, callback){


let callbackName =
"callback_" + Date.now();



window[callbackName] = function(data){


callback(data);


delete window[callbackName];


script.remove();


};



let script =
document.createElement("script");


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

function(data){


let today = new Date();


let mtc =
new Date(data.mtcDate);


let mexico =
new Date(data.mexicoDate);


let mission =
new Date(data.missionStart);



let title="";

let subtitle="";

let days=0;




if(today < mtc){


title="🏠 Home MTC";

subtitle="Preparing to serve";

days =
daysBetween(today,mtc);


}


else if(today < mexico){


title="🇲🇽 CCM México City";

subtitle="Mission training";

days =
daysBetween(today,mexico);


}


else if(today < mission){


title="🌵 Monterrey Mission";

subtitle="Almost there";

days =
daysBetween(today,mission);


}


else{


title="🌵 Monterrey Mission";

subtitle="Serving in Monterrey West, México";

days =
daysBetween(mission,today);


}





document.getElementById("missionCard").innerHTML =


`

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
// DATE HELPERS
// =====================================


function daysBetween(a,b){


return Math.ceil(

(b-a)/(1000*60*60*24)

);


}









// =====================================
// TIMELINE
// =====================================


function displayTimeline(){


let today=new Date();



let events=[


{

name:"🏠 Home MTC",

date:new Date("2026-09-09")

},


{

name:"🇲🇽 Mexico City MTC",

date:new Date("2026-09-24")

},


{

name:"🌵 Monterrey Mission",

date:new Date("2026-10-21")

}


];



let html="";



events.forEach(function(event){


let days =
daysBetween(today,event.date);



html +=


`

<div class="countdown-item">


${event.name}


<strong>

${days > 0 ? days+" Days":"Started ✓"}

</strong>


</div>

`;



});



document.getElementById("timeline").innerHTML=html;


}









// =====================================
// LETTERS
// =====================================


function loadLetters(){


loadJSONP(

"letters",

function(data){


letters=data;


displayLetters();


}


);


}







function displayLetters(){



let html="";



if(letters.length>0){



let latest=letters[0];



document.getElementById("latest").innerHTML=


`

<h3>

${latest.name}

</h3>


<a class="button"

href="${latest.url}"

target="_blank">

Open Letter

</a>


`;



}




letters.forEach(function(letter){



html +=


`

<div class="entry">


<h2>

📖 ${letter.name}

</h2>



<a class="button"

href="${letter.url}"

target="_blank">

Read Letter

</a>


</div>


`;



});



document.getElementById("journal").innerHTML=html;


}









// =====================================
// PHOTOS
// =====================================


function loadPhotos(){


loadJSONP(

"photos",

function(data){


photos=data;


displayPhotos();


}


);


}






function displayPhotos(){


let html="";



photos.forEach(function(photo){


html +=


`

<img src="${photo.url}">


`;


});



document.getElementById("photoGallery").innerHTML=html;


}









// =====================================
// MAP
// =====================================


const MAPS={


utah:
"1-KUPC_9u7V9t-96XTCz3Sj_H8caD0IRr",



mexico:
"1syyre3laiwnkMWDKYnorvfA9OLOOyCRQ"


};






const LOCATIONS={


tremonton:{


map:"utah",

name:"Tremonton, Utah",

description:"Home MTC",

x:40,

y:16.5


},




mexicoCity:{


map:"mexico",

name:"México City, México",

description:"CCM México City",

x:58.5,

y:69.5


},




monterrey:{


map:"mexico",

name:"Monterrey, México",

description:"Monterrey West México Mission",

x:56,

y:40.5


}


};







function setTestLocation(location){


loadJSONP(

"setLocation&location="+location,

function(){


loadMap();


}


);


}







function loadMap(){


console.log("Map ready");


}









// =====================================
// START
// =====================================


window.onload=function(){


loadMission();


displayTimeline();


loadLetters();


loadPhotos();


};

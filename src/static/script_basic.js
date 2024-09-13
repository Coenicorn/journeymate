const settingsButton = document.getElementById('settings-button');
const dropupMenu = document.getElementById('dropup-menu');
settingsButton.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default anchor behavior
  dropupMenu.style.display = dropupMenu.style.display === 'block' ? 'none' : 'block';
});
// Optionally, you can close the drop-up menu if clicked outside
window.addEventListener('click', function (e) {
  if (!settingsButton.contains(e.target) && !dropupMenu.contains(e.target)) {
    dropupMenu.style.display = 'none';
  }
});

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Lax;";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function getCookies(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
async function checkLogin() {
  let usernameResponse = await fetch("/api/user", {
    headers: {
      "Content-Type": "application/json",
      "Accepts": "application/json"
    },
    method: "GET"
  }).catch(e => {
    // check if the error is anythng other than unauthorized
    console.log(e);
  });

  /* let password = getCookie("password");*/
  if (usernameResponse.status === 200) {
    console.log("logged in");

    // parse username
    const responseJson = await usernameResponse.json();
    const username = responseJson.username;

    setCookie("username", username, 50);

    // hide login page
    document.getElementById('id01').style.display = 'none'
  } else {
    // show login page
    document.getElementById('id01').style.display = 'block'
  }
}
function Login() {
  let username = document.getElementById("lUsername").value;
  let checked = document.getElementById("lRemember").value;
  if (checked == "on") {
    setCookie("username", username, 1);
  }
}

function ShowInput() {
  let input = document.getElementById("SearchPlace").value;
  alert(input);
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

document.getElementById('signupform').addEventListener('submit', async function (event) {
  // Prevent the form from submitting in the default way
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email")
  };

  // session token
  // Send the data using fetch
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Accepst": "application/json"
    }
  });

  if (response.status === 200) {
    // hide signup, show login
    document.getElementById('id02').style.display = 'none';
    document.getElementById('id01').style.display = 'b1k';
  }
});

document.getElementById('signinform').addEventListener('submit', async function (event) {
  // Prevent the form from submitting in the default way
  event.preventDefault();
  setCookie('test', "test", 100);
  const form = event.target;
  const formData = new FormData(form);

  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  // session token
  // Send the data using fetch
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Accepts": "application/json"
    }
  });

  if (response.status === 200) {
    const data = await response.json();

    setCookie("token", data.token, 1);

    document.getElementById('id01').style.display = 'none';
  } else {
    alert("could not sign in :( are you registered?");
  }
});


// const words = ["test1", "test2", "test3", "test4", "test5"];

// // Get the parent element where the new elements will be appended
// const element = document.getElementById("myDropdown");

// // Loop through the array of words
// for (let i = 0; i < words.length; i++) {
//     // Create a new <a> element for each word
//     const para = document.createElement("a");

//     // Create a text node with the current word
//     const node = document.createTextNode(words[i]);

//     // Append the text node to the <a> element
//     para.appendChild(node);

//     // Optionally append a <br> element after each <a> element
//     if (i < words.length - 1) { // Avoid appending <br> after the last word
//         para.appendChild(document.createElement("br"));
//     }

//     // Append the <a> element to the parent element
//     element.appendChild(para);
// }
// Array of button objects
// const labels = [
//     { id: "btn1", text: "Button1" },
//     { id: "btn2", text: "Button2" },
//     { id: "btn3", text: "Button3" },
//     { id: "btn4", text: "Button4" }
// ];

// // Get the parent element where the buttons will be appended
// const container = document.getElementById("myDropdown");

// // Loop through the array of button objects
// for (let i = 0; i < labels.length; i++) {
//     // Create a new <button> element
//     const button = document.createElement("button");

//     // Set the text content of the button
//     button.textContent = labels[i].text;

//     // Optionally, set an ID for each button
//     button.id = labels[i].id;

//     // Add an event listener to each button
//     button.addEventListener("click", function() {
//         alert(`You clicked ${labels[i].text}`);
//     });

//     // Append the button to the parent element
//     container.appendChild(button);
// }


// Vragen ophalen
function getQuestion() {
  const random = Math.floor(Math.random() * vragen.length);
  document.getElementById("question-subject").innerHTML = vragen[random][0];
  const random2 = Math.floor(Math.random() * vragen[random].length) + 1;
  document.getElementById("question-text").innerHTML = vragen[random][random2];
}

const vragen = [
  [
    "Opleiding",
    "Waarom heb je voor je huidige opleiding gekozen?",
    "Wat is je laatste studie voor deze studie?",
    "Wat wil je leren op deze studie?",
    "Heb je een andere opleiding die je ook zou willen volgen, zo ja, welke?",
    "Hoe laat sta je op om op tijd op school te zijn?",
    "Hoeveel jaar studeer je al?"
  ],
  [
    "Persoonlijk",
    "Werk je, zo ja, wat doe je?",
    "Doe je aan een sport?",
    "Waar kom je vandaan (woonplaats)?",
    "Speel je games, zo ja, welke?",
    "Zou je willen emigreren?",
    "Woon je op jezelf?",
    "Hoelang moet je reizen?",
    "Welk land dat je hebt bezocht vond je het leukst?",
    "Heb je huisdieren?",
    "Wat was jouw laatste film / serie marathon?",
    "Waar maak jij de meeste zorgen over?",
    "Waar ben je trots op?",
    "Geloof je in een god? ",
    "Waar erger jij aan?",
    "Als je een wens zou mogen doen wat zou dat zijn?",
    "Wat is je doel voor komend jaar?",
    "Wat was vroeger je droombaan?",
    "Wat is één ding dat je nooit meer zult doen?",
    "Wat is je droom bestemming?",
    "Zou je blijven doorwerken als je de loterij wint?",
    "Welke drie dingen zou je meenemen naar een onbewoond eiland?",
    "Wat is het vreemdste dat je ooit hebt gegeten?",
    "Heb je een geheim talent? Kun je die nu doen?",
    "Geloof je in geesten?",
    "Hoe ziet jouw ultieme vakantie eruit?",
    "Je hebt een bloedtransfusie nodig om te overleven: zou je het bloed van Hitler weigeren of accepteren?",
    "Wat is jouw favoriete seizoen?",
    "Als je een superkracht mag kiezen, welke zou dat zijn? ",
    "Vertel een vreemd feitje dat je toevallig weet zonder reden. ",
    "Wat is het beste advies wat je ooit hebt gekregen?",
    "Zou je kinderen willen, waarom wel of niet?"
  ],
  [
    "Zou je liever",
    "Zou je liever IOS of Android gebruiken?",
    "Zou je liever MAC-OS of Windows gebruiken?",
    "Zou je liever altijd 2 uur te vroeg zijn of 2 minuten te laat?",
    "Zou je liever traag internet hebben of steeds je wachtwoord vergeten?",
    "Zou je liever voor altijd alle programmeertalen alleen de basis weten of een programmeertaal alles?",
    "Zou je liever een walvis of een leeuw zijn?",
    "Zou je liever de tijd kunnen beheersen of kunnen vliegen?",
    "Zou je liever naar het strand gaan of naar besneeuwde gebergte?",
    "Zou je liever gratis kunnen vliegen of gratis accommodatie krijgen voor de rest van je leven?",
    "Zou je liever de wereld rondzeilen of met een camper reizen?",
    "Zou je liever 5 talen spreken of 5 instrumenten bespelen?",
    "Zou je liever dokter of advocaat worden?",
    "Zou je liever tegen 1 grote eend vechten ter grootte van een paard of 100 paarden ter grootte van een eend?",
    "Zou je liever een kat of een hond willen?",
    "Zou je parttime willen werken?",
    "Zou je liever een oranje peper eten of een glas grapefruitsap drinken?",
    "Zou je liever een frietje mayo of een frietje speciaal eten?"
  ],
  [
    "Eten",
    "Koffie of thee?",
    "Zoet, zout of zuur?",
    "Wat is je favoriete toetje?",
    "Wat is je favoriete restaurant?",
    "Wat vind je van all you can eat restaurants?",
    "Als je een groente was, welke groentje zou je zijn, en waarom?",
    "Wat is je favoriete gerecht om te koken?",
    "Als je iets van eten mocht laten verdwijnen zodat niemand het meer zou kunnen eten wat zou het zijn?",
    "Wat is je favoriete etenstijd? Ontbijt, lunch of avondeten?",
    "Wat is iets wat je niet kan koken?",
    "Hoe eet je je eieren het liefst?",
    "Wat is je favoriete snack / tussendoortje?",
    "Als je nog maar een maaltijd voor de rest van je leven mag eten wat zou het zijn? ",
    "Wat is het gekste eten wat je ooit op hebt?"
  ],
  [
    "Ben je ooit",
    "Ben je ooit uit Nederland geweest?",
    "Heb je ooit op een motor gereden?",
    "Ben je ooit verhuist?",
    "Heb je ooit een BN'er ontmoet?",
    "Ben je ooit in Disneyland geweest?",
    "Heb je ooit een natuurramp meegemaakt?",
    "Heb je ooit een extreme sport gedaan zoals bungeejumping of skydiving?",
    "Ben je ooit in Scandinavië geweest?"
  ]
]

function redirectToRandomUrl() {
  // Predefined list of URLs with their corresponding weights
  const urls = [
    { url: 'https://example.com/egg1', weight: 0.5 },  // 50% chance
    { url: 'https://example.com/egg2', weight: 0.3 },  // 30% chance
    { url: 'https://example.com/egg3', weight: 0.15 }, // 15% chance
    { url: 'https://example.com/egg4', weight: 0.05 }  // 5% chance
  ];

  // Create an array with cumulative weights
  let cumulativeWeights = [];
  let sum = 0;
  urls.forEach(item => {
    sum += item.weight;
    cumulativeWeights.push(sum);
  });

  // Generate a random number between 0 and 1
  const randomNum = Math.random();

  // Find the first URL that has a cumulative weight greater than the random number
  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (randomNum <= cumulativeWeights[i]) {
      window.location.href = urls[i].url;
      break;
    }
  }
}

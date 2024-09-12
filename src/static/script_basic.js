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

// // Vragen ophalen
// getResponse();
// let vragen = null;
// async function getResponse(){
// fetch("qu.json")
//     .then(response => response.json())
//     .then(values => getData(values))
//     .catch(error => console.error(error))
// }

// function getData(data)
// {
//     vragen = data;   
//     getQuestion(data)
// }

// function getQuestion(){
//     const random = Math.floor(Math.random() * vragen.length);
//     document.getElementById("question-subject").innerHTML = vragen[random][0];
//     const random2 = Math.floor(Math.random() * vragen[random].length) + 1;
//     document.getElementById("question-text").innerHTML = vragen[random][random2];
// }


function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
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
  let usernameResponse = await fetchWithToken("/api/user", {
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
    document.getElementById('id01').style.display='none'
  } else {
    // show login page
    document.getElementById('id01').style.display='block'
  }
}
function Login(){
    let username = document.getElementById("lUsername").value;
    let checked = document.getElementById("lRemember").value;
    if (checked == "on"){
        setCookie("username", username, 1);
    }
}

function ShowInput(){
  let input = document.getElementById("SearchPlace").value;
  alert(input);
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
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

document.getElementById('signupform').addEventListener('submit', async function(event) {
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
    document.getElementById('id02').style.display='none';
    document.getElementById('id01').style.display='b1k';
  }
});

document.getElementById('signinform').addEventListener('submit', async function(event) {
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

    document.getElementById('id01').style.display='none';
  } else {
    alert("could not sign in :( are you registered?");
  }
});

async function fetchWithToken(url, config) {
  // inject stored token
  const token = getCookie("token");

  config.headers["Authorization"] = token;

  return fetch(url, config);
}


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
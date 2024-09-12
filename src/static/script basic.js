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
function checkLogin() {
  const sessionToken = getCookies('sessionToken');
  if (sessionToken) {
    console.log('Session Token:', sessionToken);
  } else {
    console.log('Session Token not found.');
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
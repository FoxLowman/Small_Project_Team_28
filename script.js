const urlBase = "http://lowmanse.online/LAMPAPI";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
let login = document.getElementById("login").value;
let password = document.getElementById("password").value;

let tmp = { login: login, password: password};
let jsonPayload = JSON.stringify(tmp);

let url = urlBase + "/userlogin.php";

fetch(url, {
    method: "POST", 
    body: jsonPayload,
    headers: {
        "Content-Type": "application/json"
    }
})

.then(response => response.text())

.then(text => {
    let jsonObject = JSON.parse(text);

    if (jsonObject.id <1)
    {
        document.getElementById("loginResult").innerHTML = jsonObject.error;
        return;
    }

    userId = jsonObject.id;
    firstName = jsonObject.firstName;
    lastName = jsonObject.lastName;

    localStorage.setItem("userId", userID);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);

    window.location.href = "contacts.html";
})

.catch(error => console.error(error));
}
const urlBase = 'http://lowmanse.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// ---- Cookies ----
function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

// ---- Login ----
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	if (!login || !password)
	{
		document.getElementById("loginResult").innerHTML = "Please enter username and password";
		return;
	}

	let tmp = {login: login, password: password};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/userlogin.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1)
				{
					document.getElementById("loginResult").innerHTML = jsonObject.error;
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

// ---- Register ----
function doRegister()
{
	let fn = document.getElementById("regFirstName").value;
	let ln = document.getElementById("regLastName").value;
	let login = document.getElementById("regLogin").value;
	let password = document.getElementById("regPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	if (!fn || !ln || !login || !password)
	{
		document.getElementById("registerResult").innerHTML = "All fields are required";
		return;
	}

	let tmp = {firstName: fn, lastName: ln, login: login, password: password};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/registeruser.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.id < 1)
				{
					document.getElementById("registerResult").innerHTML = jsonObject.error;
					return;
				}

				document.getElementById("registerResult").innerHTML = "Account created! You can now log in.";
				document.getElementById("registerResult").className = "msg-ok";
				setTimeout(function() { showLogin(); }, 1500);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

// ---- Toggle Login / Register ----
function showRegister()
{
	document.getElementById("loginDiv").style.display = "none";
	document.getElementById("registerDiv").style.display = "block";
	document.getElementById("loginResult").innerHTML = "";
}

function showLogin()
{
	document.getElementById("registerDiv").style.display = "none";
	document.getElementById("loginDiv").style.display = "block";
	document.getElementById("registerResult").innerHTML = "";
}

// ---- Logout ----
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// ---- Add Contact ----
function addContact()
{
	let fn = document.getElementById("addFirstName").value;
	let ln = document.getElementById("addLastName").value;
	let phone = document.getElementById("addPhone").value;
	let email = document.getElementById("addEmail").value;

	document.getElementById("contactAddResult").innerHTML = "";

	if (!fn && !ln)
	{
		document.getElementById("contactAddResult").innerHTML = "Enter at least a first or last name";
		return;
	}

	let tmp = {firstName: fn, lastName: ln, phone: phone, email: email, userId: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/add.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error && jsonObject.error.length > 0)
				{
					document.getElementById("contactAddResult").innerHTML = jsonObject.error;
					return;
				}

				document.getElementById("contactAddResult").innerHTML = "Contact added!";
				document.getElementById("contactAddResult").className = "msg-ok";
				document.getElementById("addFirstName").value = "";
				document.getElementById("addLastName").value = "";
				document.getElementById("addPhone").value = "";
				document.getElementById("addEmail").value = "";

				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

// ---- Search Contacts ----
function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	let tmp = {search: srch, userId: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/searchcontacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				let results = jsonObject.results;
				let tbody = document.getElementById("contactTableBody");
				tbody.innerHTML = "";

				if (!results || results.length === 0)
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error || "No contacts found";
					return;
				}

				document.getElementById("contactSearchResult").innerHTML = results.length + " contact(s) found";
				document.getElementById("contactSearchResult").className = "msg-ok";

				for (let i = 0; i < results.length; i++)
				{
					let c = results[i];
					let row = document.createElement("tr");
					row.innerHTML =
						'<td>' + esc(c.firstName) + '</td>' +
						'<td>' + esc(c.lastName) + '</td>' +
						'<td>' + esc(c.phone) + '</td>' +
						'<td>' + esc(c.email) + '</td>' +
						'<td>' +
							'<button onclick="openEdit(' + c.id + ',\'' + escQ(c.firstName) + '\',\'' + escQ(c.lastName) + '\',\'' + escQ(c.phone) + '\',\'' + escQ(c.email) + '\')" aria-label="Edit ' + esc(c.firstName) + '">Edit</button> ' +
							'<button class="del" onclick="deleteContact(' + c.id + ')" aria-label="Delete ' + esc(c.firstName) + '">Delete</button>' +
						'</td>';
					tbody.appendChild(row);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

// ---- Delete Contact ----
function deleteContact(contactId)
{
	if (!confirm("Delete this contact?")) return;

	let tmp = {id: contactId, userId: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/delete.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

// ---- Edit Contact ----
function openEdit(id, fn, ln, phone, email)
{
	document.getElementById("editId").value = id;
	document.getElementById("editFirstName").value = fn;
	document.getElementById("editLastName").value = ln;
	document.getElementById("editPhone").value = phone;
	document.getElementById("editEmail").value = email;
	document.getElementById("editResult").innerHTML = "";
	document.getElementById("editModal").style.display = "flex";
}

function closeEdit()
{
	document.getElementById("editModal").style.display = "none";
}

function saveEdit()
{
	let id = parseInt(document.getElementById("editId").value);
	let fn = document.getElementById("editFirstName").value;
	let ln = document.getElementById("editLastName").value;
	let phone = document.getElementById("editPhone").value;
	let email = document.getElementById("editEmail").value;

	document.getElementById("editResult").innerHTML = "";

	let tmp = {id: id, firstName: fn, lastName: ln, phone: phone, email: email, userId: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/editcontact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error && jsonObject.error.length > 0)
				{
					document.getElementById("editResult").innerHTML = jsonObject.error;
					return;
				}

				closeEdit();
				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}

// ---- Helpers ----
function esc(s) { return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''; }
function escQ(s) { return s ? s.replace(/\\/g,'\\\\').replace(/'/g,"\\'") : ''; }
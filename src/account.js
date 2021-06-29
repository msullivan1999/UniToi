function fillInfo() {
    // Fills in the information displayed on the account page.

    let res = findAccount(sessionStorage.getItem("currentloggedin"));

    // From accounts list, access current account (see findAccount function in
    // login.js for details)
    var curr = res[0][res[1]]; 

    document.getElementById("info_name").innerHTML = `Name: ${curr.name}`;
    document.getElementById("info_email").innerHTML = `Email: ${curr.email}`;
    document.getElementById("info_status").innerHTML = `Account Status: ${curr.privilege}`;
}

function logoutProcedure() {
    // Logs user out and redirects to home page.

    // Can only remove sessionstorage from where it was made; switch to login
    // page and then back
    window.location.replace("signin.html"); 
    sessionStorage.removeItem("currentloggedin");
    window.location.replace("index.html");
}
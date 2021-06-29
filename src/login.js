// Constants definitions
const Privilege = {
    User: "User",
    Administrator: "Administrator", 
    CleaningStaff: "Cleaning Staff"
}

// Classes
class account {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.privilege = Privilege.User;
    }

    get stringify() {
        return `{"name": "${this.name}", "email": "${this.email}", "password": "${this.password}", "privilege": "${this.privilege}"}`;
    }

    changePermission(permission) {
        this.permission = permission;
    }
}

// Password Functions
function chkPassword(email, pwd) {
    // Performs password check; if successful, logs user in.
    // email: Email provided by user
    // pwd: Password provided by email
    // If successful, user is logged in and redirected to the homepage; else, an
    // error message is displayed to the user.

    // Get accounts list
    let accounts = JSON.parse(localStorage.getItem("accounts"));

    if (accounts != null) {
        // Search for an account with matching details; if one is found,
        // log them in.
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].email == email.value && accounts[i].password == pwd.value) {
                sessionStorage.setItem("currentloggedin", accounts[i].name);
                window.location.replace("index.html");
                
                // Clear fields
                pwd.value = "";
                email.value = "";

                return;
            }
        }
    }

    // Failure case
    document.getElementById("myLoc").innerHTML = "Incorrect email/password.";
    document.getElementById("myLoc").style.color = "red";
    document.getElementById("myLoc").style.fontStyle = "italic";

    // Clear fields
    pwd.value = "";
    email.value = "";
}

function storePassword(username, email, pwd, pwd2) {
    // Registers a user, adding a new account object to localstorage.
    // username: Username provided by user
    // email: Email provided by user
    // pwd: First input of password
    // pwd2: Second input of password
    // Displays to user whether successful or not. If successful, the new user
    // is added to the accounts list in localStorage.

    // Clear message to user
    document.getElementById("myLoc").innerHTML = "";

    // Set up variables
    username = username.value;
    email = email.value;
    pwd = pwd.value;
    pwd2 = pwd2.value;

    // Error Checks
    if (username == "" || email == "" || pwd == "") {
        document.getElementById("myLoc").innerHTML = "All fields are required.";
        document.getElementById("myLoc").style.color = "red";
        document.getElementById("myLoc").style.fontStyle = "italic";

        return;
    } else if (pwd != pwd2) {
        document.getElementById("myLoc").innerHTML = "Passwords entered must match.";
        document.getElementById("myLoc").style.color = "red";
        document.getElementById("myLoc").style.fontStyle = "italic";
        pwd.value = "";
        email.value = "";
        username.value = "";
        pwd2.value = "";

        return;
    }

    // Get Accounts list
    let accounts = JSON.parse(localStorage.getItem("accounts"));

    if (accounts == null) {
        accounts = []; // Create if it doesn't exist yet
    }

    // Error Checks
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].name == username) {
            document.getElementById("myLoc").innerHTML = "Username exists, please pick another username.";
            document.getElementById("myLoc").style.color = "red";
            document.getElementById("myLoc").style.fontStyle = "italic";

            return;
        }
        if (accounts[i].email == email) {
            document.getElementById("myLoc").innerHTML = "Email exists.";
            document.getElementById("myLoc").style.color = "red";
            document.getElementById("myLoc").style.fontStyle = "italic";

            return;
        }
    }

    // Create new account
    let new_account = new account(username, email, pwd);

    // Add permissions if needed
    if (email.includes("@admin.sydney.edu.au")) {
        new_account.privilege = Privilege.Administrator;
    } else if (email.includes("@cleaning.sydney.edu.au")) {
        new_account.privilege = Privilege.CleaningStaff;
    }

    // Add the account
    accounts[accounts.length] = new_account;
    localStorage.setItem("accounts", JSON.stringify(accounts));

    // Confirm Success
    document.getElementById("myLoc").innerHTML = "Thank you for registering, " + username;
    document.getElementById("myLoc").style.color = "red";
    document.getElementById("myLoc").style.fontStyle = "italic";

    // Clear fields
    pwd.value = "";
    email.value = "";
    username.value = "";
    pwd2.value = "";
}

function updatePassword(oldPwd, newPwd1, newPwd2) {
    // Updates the password of the current account.
    // oldPwd: Old password
    // newPwd1: First input of new password
    // newPwd2: Second input of new password
    // If any error case is encountered, an error is displayed and the password
    // remains unchanged. Else, the password is updated and a success message
    // is displayed.

    // Get current account info
    let res = findAccount(sessionStorage.getItem("currentloggedin"));

    // Error Checking
    if (res == null) {
        console.log("Account not found, password update failed.");

        return;
    }

    let accounts = res[0]
    let curr_usr = accounts[res[1]]; // i.e. from accounts list, we access index 
                                     // where required user resides

    // Check passwords equality
    if (oldPwd.value != curr_usr.password) {
        document.getElementById("password_update_status").innerHTML = "Old password does not match.";
        document.getElementById("password_update_status").style.color = "red";
        document.getElementById("password_update_status").style.fontStyle = "italic";

        return;
    } else if (newPwd1.value != newPwd2.value) {
        document.getElementById("password_update_status").innerHTML = "New passwords do not match";
        document.getElementById("password_update_status").style.color = "red";
        document.getElementById("password_update_status").style.fontStyle = "italic";

        return;
    }

    // Set new password
    curr_usr.password = newPwd1.value;
    
    // Commit it to localstorage
    commitAccountChanges(accounts);

    // Clear input fields
    oldPwd.value = "";
    newPwd1.value = "";
    newPwd2.value = "";

    // Confirm success
    document.getElementById("password_update_status").innerHTML = "Password successfully updated.";
    document.getElementById("password_update_status").style.color = "green";
    document.getElementById("password_update_status").style.fontStyle = "italic";
}

// Page-specific Functions
function forgotPassword(email) {
    // Logic for the mockup forgot password page.
    // email: Email to "send" to

    // Display message
    document.getElementById("myLoc").innerHTML = "Email has been sent to " + email.value + " to reset password.";
    document.getElementById("myLoc").style.color = "red";
    document.getElementById("myLoc").style.fontStyle = "italic";

    // Clear fields
    email.value = "";
}

// Account Status Functions
function checkLogin() {
    // Login check done every page, for updating the nav bar to show both login
    // status (whether logged in or not, if logged in linking to accounts page)
    // and management tools, if the account privilege permits.

    // Set Management tools to hidden by default
    document.getElementById("management-nav").style.display = "none";

    logout();

    // Update nav bar according to user login status, and account privilege
    let username = sessionStorage.getItem("currentloggedin");

    if (username != null) {
        // Update button
        document.getElementById("login-button").innerHTML = "Hello, " + username;
        document.getElementById("login-button").href="../html/account.html";

        let accounts = JSON.parse(localStorage.getItem("accounts"));

        if (accounts == null) {
            accounts = [];
        }

        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].name == username) {
                // If correct privilege, show management tools
                if (accounts[i].privilege == "Administrator" || accounts[i].privilege == "Cleaning Staff") {
                    document.getElementById("management-nav").style.display = "block";
                }
                break;
            }
        }
    }
}

function logout() {
    // Logout functionality, updating sessionStorage depending on the situation.

    if (sessionStorage.getItem("currentloggedin") == null) {
        return;
    }
    if (document.URL.includes("/signin.html")) {
        sessionStorage.removeItem("currentloggedin");
    }
}

// Supplementary Functions
function findAccount(usrname) {
    // Finds an account with a username the same as name.
    // usrname: Username of account to find
    // If successful, returns the accounts list and the associated index for the
    // account in the list (returned as array {accounts list, index}), else 
    // prints the error to console and returns null.

    // Get Accounts
    let accounts = JSON.parse(localStorage.getItem("accounts"));

    // Error Checking
    if (usrname == null) {
        console.log("NULL name provided in findAccount!");

        return null;
    } else if (accounts == null) {
        console.log("Accounts list could not be found!");

        return null;
    } else if (accounts.length == 0) {
        console.log("Accounts list is of length 0!");

        return null;
    }

    // Find account
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].name == usrname) {
            return [accounts, i];
        }
    }

    // If here, means account not found
    console.log(`Username ${usrname} is not associated to any account!`);

    return null;
}

function commitAccountChanges(accounts) {
    // Commits data for all accounts to localstorage.
    // accounts: Accounts list (list of account objects)
    // Prints to console if an error occurs, else silently returns.

    if (accounts == null) {
        console.log("NULL accounts list provided!");

        return;
    }

    // Commit by converting to JSON-readable string
    localStorage.setItem("accounts", JSON.stringify(accounts));
}

function checkSitemapLogin() {
    // Does login check for site map, displaying links as needed

    // If not logged in, do not display management things or account page
    if (sessionStorage.getItem("currentloggedin") == null) {
        document.getElementById("account_button").style.display = "none";
    } else {
        // Display account button
        document.getElementById("account_button").style.display = "inline-block";

        // Find account, check privilege
        let res = findAccount(sessionStorage.getItem("currentloggedin"));

        let curr_usr = res[0][res[1]]; // See findAccount() for details

        if (curr_usr.privilege == Privilege.Administrator ||
                curr_usr.privilege == Privilege.CleaningStaff) {
            // Display management pages
            document.getElementById("management_ls").style.display = "inline-block";
        }
    }
}

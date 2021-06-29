function dummyUpload() {
    // "Upload" an image when the button is pressed
    document.getElementById("dummyImg").style.display = "block";
}

function save(msg) {
    // "Save" any changes, in format
    // Saved <msg>!
    alert("Saved " + msg + "!");
}
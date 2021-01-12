
self.onmessage = function(e) {
    var request = new XMLHttpRequest();
    request.open("POST", "https://ialake.netlify.app/bdd/test.php");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(e.data);
}
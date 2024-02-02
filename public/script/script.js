document.addEventListener("DOMContentLoaded", function () {
  var currentDomain = window.location.hostname;
  console.log(currentDomain);

  var lab3Link = document.getElementById("lab3Link");
  lab3Link.href = `http://${currentDomain}:3000`;
});

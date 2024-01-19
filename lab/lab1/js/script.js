import messages from "../lang/messages/en/user.js";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lab-title").innerHTML = messages.labTitle;
  document.getElementById("writer-button").textContent = messages.writerButton;
  document.getElementById("reader-button").textContent = messages.readerButton;
});

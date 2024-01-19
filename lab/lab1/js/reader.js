import messages from "../lang/messages/en/user.js";

const noteSection = document.getElementById("note-section");

function updateTime() {
  let updatedTime = new Date().toLocaleString().substring(10, 22);
  document.getElementById("updated-at").innerHTML =
    messages.updatedAt + " " + updatedTime;
}

class Reader {
  constructor() {
    this.initScreen();
    this.renderNotes();
    updateTime();
  }

  storeNote(note) {
    localStorage.setItem(note.id, note.content);
  }

  removeNote(id) {
    localStorage.removeItem(id);
    this.renderNotes();
    updateTime();
  }

  initScreen() {
    noteSection.innerHTML = "";
  }

  initLocalStorage() {
    localStorage.clear();
  }

  fetchLocalStorage() {
    let localStorageItems = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      localStorageItems[key] = value;
    }
    return localStorageItems;
  }

  renderNotes() {
    let notes = this.fetchLocalStorage();
    this.initScreen();
    
    
    Object.keys(notes).forEach((key) => {
      let noteContent = notes[key];
      const noteContainer = document.createElement("div");
      noteContainer.classList.add("note-container");

      const leftTextArea = document.createElement("textarea");
      leftTextArea.classList.add("left-textarea");
      leftTextArea.id= key;

      leftTextArea.value = noteContent;

      //update immediately
      leftTextArea.addEventListener("input", function (event) {
        localStorage.setItem(key, event.target.value);
        updateTime();
      });

      //update when blur (focus out)
      leftTextArea.addEventListener("blur", function (event) {
        localStorage.setItem(key, event.target.value);
        updateTime();
      });

      noteContainer.appendChild(leftTextArea);

      noteSection.appendChild(noteContainer);
    });
  }

  run() {
    document.addEventListener("DOMContentLoaded", () => {
          let backButton = document.getElementById("back-button");
          backButton.textContent = messages.goBack;
      setInterval(() => {
        this.renderNotes();
        updateTime();
      }, 2000);
    });
  }
}

const readerMode = new Reader();
readerMode.run();

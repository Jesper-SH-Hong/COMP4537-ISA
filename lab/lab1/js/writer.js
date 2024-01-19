import messages from "../lang/messages/en/user.js";

const noteSection = document.getElementById("note-section");
const body = document.querySelector("body");
const noteWidth = 10;
const noteHeight = 5;
const margin = 1;
let noteId = localStorage.length;

function updateTime() {
  let updatedTime = new Date().toLocaleString().substring(10, 22);
  document.getElementById("updated-at").innerHTML =
    messages.storedAt + " " + updatedTime;
}

class Note {
  constructor(id, content) {
    this.id = id;
    this.content = content;
  }
}

class Writer {
  constructor() {
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

      const rightDiv = document.createElement("div");
      rightDiv.classList.add("right-div");
      const removeButton = document.createElement("button");
      removeButton.classList.add("remove-button");
      removeButton.innerText = "Remove";
      removeButton.addEventListener("click", () => {
        this.removeNote(key);
      });
      rightDiv.appendChild(removeButton);
      noteContainer.appendChild(rightDiv);

      noteSection.appendChild(noteContainer);
    });
  }

  createBlankNote() {
    const note = new Note(noteId, "");
    noteId++;

    this.storeNote(note);
    this.renderNotes();
  }

  run() {
    document.addEventListener("DOMContentLoaded", () => {
      let addButton = document.getElementById("add-button");
      addButton.textContent = messages.add;

      addButton.addEventListener("click", () => {
        this.createBlankNote();
      });

      let backButton = document.getElementById("back-button");
      backButton.textContent = messages.goBack;
    });
  }
}

const writerMode = new Writer();
writerMode.run();

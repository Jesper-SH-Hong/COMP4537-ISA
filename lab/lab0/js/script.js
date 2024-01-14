import messages from "../lang/messages/en/user.js";

const buttonContainer = document.getElementById("button-container");
const body = document.querySelector("body");
const buttonWidth = 10;
const buttonHeight = 5;
const margin = 1;

//Get parent element font size(a.k.a em) - https://stackoverflow.com/questions/10463518/converting-em-to-px-in-javascript-and-getting-default-font-size
const em = parseFloat(getComputedStyle(body).fontSize);

class Button {
  constructor(number, color, position, x, y) {
    this.number = number;
    this.color = color;
    this.position = position;
  }
}

class MemoryButtonGame {
  constructor() {
    this.buttons = [];
    this.solution = [];
    this.answer = [];
  }

  generateButtons(numButtons) {
    for (let index = 0; index < numButtons; index++) {
      this.buttons.push(
        new Button(index + 1, this.getRandomColor(), { x: 0, y: 0 })
      );
    }
  }

  getRandomColor() {
    let rgb = [];
    let max = 256;
    for (let i = 0; i < 3; i++) {
      rgb.push(Math.floor(Math.random() * max));
    }
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  initScreen(buttonContainer) {
    buttonContainer.innerHTML = "";
  }

  convertToEM(int) {
    return int + "em";
  }

  // Update the buttons positions
  displayButtons() {
    // Clear existing buttons whenever generate buttons.
    this.initScreen(buttonContainer);

    this.buttons.forEach((button) => {
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("button-object");
      buttonElement.style.backgroundColor = button.color;
      buttonElement.disabled = true;

      buttonContainer.appendChild(buttonElement);

      const spanElement = document.createElement("span");
      spanElement.classList.add("button-number-span");
      spanElement.innerText = button.number;
      buttonElement.appendChild(spanElement);
    });
  }

  checkWindowBoundary(button) {
    let height = window.innerHeight;
    let width = window.innerWidth;

    if (button.position.x + buttonWidth * em > width) {
      button.position.x = width - buttonWidth * em;
    } else if (button.position.x < 0) {
      button.position.x = 0;
    }

    if (button.position.y + buttonHeight * em > height) {
      button.position.y = height - buttonHeight * em;
    } else if (button.position.y < 0) {
      button.position.y = 0;
    }

    return { x: button.position.x, y: button.position.y };
  }

  reRenderButtons() {
    this.initScreen(buttonContainer);

    this.buttons.forEach((button) => {
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("button-object");
      buttonElement.style.backgroundColor = button.color;
      buttonElement.style.width = this.convertToEM(buttonWidth);
      buttonElement.style.height = this.convertToEM(buttonHeight);
      buttonElement.style.marginRight = this.convertToEM(margin);

      buttonElement.style.position = "absolute";

      let newPos = this.checkWindowBoundary(button);
      buttonElement.style.left = newPos.x + "px";
      buttonElement.style.top = newPos.y + "px";

      buttonContainer.appendChild(buttonElement);

      const spanElement = document.createElement("span");
      spanElement.classList.add("button-number-span");
      spanElement.innerText = button.number;

      buttonElement.disabled = true;
      buttonElement.addEventListener("click", () => {
        this.answer.push(button.number);

        if (this.answer.length === this.solution.length) {
          for (let i = 0; i < this.answer.length; i++) {
            if (this.answer[i] !== this.solution[i]) {
              this.displayMessage(messages.wrongOrder);
              this.showNumbers();
              break;
            } else {
              if (i === this.answer.length - 1) {
                this.displayMessage(messages.excellentMemory);
              } else {
                continue;
              }
            }
          }
        }
      });

      buttonElement.appendChild(spanElement);
    });
  }

  getRandomPosition() {
    //get responsive window size
    let height = window.innerHeight;
    let width = window.innerWidth;
    return {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
  }

  async mixButtons() {
    for (let index = 0; index < 3; index++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          this.buttons.forEach((button) => {
            button.position = this.getRandomPosition();
          });
          this.reRenderButtons();
          resolve();
        }, 2000);
      });
    }
  }

  enableButtons() {
    const buttons = document.querySelectorAll(".button-object");
    buttons.forEach((button) => {
      button.disabled = false;
    });
  }

  async playGame() {
    await this.mixButtons();
    this.hideNumbers();
    this.enableButtons();
  }

  hideNumbers() {
    const buttonTextSpan = document.querySelectorAll(".button-number-span");
    buttonTextSpan.forEach((button) => {
      button.style.display = "none";
    });
  }

  showNumbers() {
    const buttonTextSpan = document.querySelectorAll(".button-number-span");
    buttonTextSpan.forEach((button) => {
      button.style.display = "inline";
    });
  }

  hideInputContainer() {
    const inputContainer = document.getElementById("input-container");
    inputContainer.style.display = "none";
  }

  displayMessage(message) {
    alert(message);
  }

  run() {
    // Reset game state
    this.buttons = [];
    this.solution = [];
    this.answer = [];

    document.getElementById("input-container-title").innerHTML =
      messages.inputTitleText;
    document.getElementById("go-button").addEventListener("click", () => {
      const numOfButtonsInput = document.getElementById("num-of-button-field");
      const numButtons = parseInt(numOfButtonsInput.value);

      if (numButtons < 3 || numButtons > 7) {
        this.displayMessage(messages.invalidInput);
      } else if (!isNaN(numButtons)) {
        this.solution = [...Array(numButtons)].map((_, index) => index + 1);
        this.hideInputContainer();
        this.generateButtons(numButtons);
        this.displayButtons();

        setTimeout(() => {
          this.playGame();
        }, numButtons * 1000 - 2000); // adjust 2 sec for 1st re-rendering in mixButtons().
      }
    });
  }
}

const memoryButtonGame = new MemoryButtonGame();
memoryButtonGame.run();

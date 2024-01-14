import messages from "../lang/messages/en/user.js";

const buttonContainer = document.getElementById("button-container");
const body = document.querySelector("body");
const buttonWidth = 10;
const buttonHeight = 5;
const margin = "1";

//get parent element font size(a.k.a em) - https://stackoverflow.com/questions/10463518/converting-em-to-px-in-javascript-and-getting-default-font-size
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
      console.log("button", button);
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("button-object");
      buttonElement.style.backgroundColor = button.color;
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

    //check if the button is out of boundary
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
    console.log("button.position.x, button.position.y", button.position.x, button.position.y)
    return {x:button.position.x, y:button.position.y};
  }

  reRenderButtons() {
    this.initScreen(buttonContainer);

    this.buttons.forEach((button) => {
      const buttonElement = document.createElement("button");
      buttonElement.style.backgroundColor = button.color;
      buttonElement.style.width = this.convertToEM(buttonWidth);
      buttonElement.style.height = this.convertToEM(buttonHeight);
      buttonElement.style.marginRight = this.convertToEM(margin);

      buttonElement.style.position = "absolute";

      // buttonElement.style.left = button.position.x - buttonWidth * em + "px";
      // buttonElement.style.top = button.position.y - buttonHeight * em + "px";
      let newPos = this.checkWindowBoundary(button);
      console.log("left, top", newPos.x, newPos.y);
      buttonElement.style.left = newPos.x + "px";
      buttonElement.style.top = newPos.y + "px";


      buttonContainer.appendChild(buttonElement);

      const spanElement = document.createElement("span");
      spanElement.classList.add("button-number-span");
      spanElement.innerText = button.number;

      buttonElement.addEventListener("click", () => {
        console.log(`Button ${button.number} clicked`);

        this.answer.push(button.number);
        console.log(this.solution)
        console.log(this.answer);

        if (this.answer.length === this.solution.length) {
         for (let i = 0; i < this.answer.length; i++) {
            if (this.answer[i] !== this.solution[i]) {
              this.displayMessage(messages.wrongOrder);
              this.startNewGame();
              return;
            } else {
            this.displayMessage(messages.correctAnswer);
            this.startNewGame();
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

  mixButtons(callback) {
    this.buttons.forEach((button) => {
      button.position = this.getRandomPosition();
    });
    this.reRenderButtons();
    callback();
  }

  playGame(numButtons) {
    setTimeout(() => {
      this.mixButtons(() => {
        this.hideNumbers();
      });
    }, numButtons * 100); //TODO: change to 1000
  }

  hideNumbers() {
    const buttonTextSpan = document.querySelectorAll(".button-number-span");
    buttonTextSpan.forEach((span) => {
      span.innerText = "";
    });
  }

  handleButtonClick(event) {
    const clickedButton = event.target;
    const buttonNumber = parseInt(clickedButton.innerText);

    // Check if the clicked button is in the correct order
    if (buttonNumber === this.answer.length + 1) {
      // Correct order
      this.answer.push(buttonNumber);
      clickedButton.innerText = buttonNumber; // Reveal the number

      // Check if all buttons are clicked in order
      if (this.answer.length === this.buttons.length) {
        this.displayMessage(messages.correctAnswer);
        this.startNewGame();
      }
    } else {
      // Wrong order
      this.displayMessage(messages.wrongOrder);
      this.displayCorrectOrder();
      this.startNewGame();
    }
  }

  hideInputContainer() {
    const inputContainer = document.getElementById("input-container");
    inputContainer.style.display = "none";
  }

  displayMessage(message) {
    alert(message);
  }

  run() {
    // Clear existing buttons and reset game state
    this.buttons = [];
    this.solution = [];
    this.answer = [];

    document.getElementById("input-container-title").innerHTML =
      messages.inputTitleText;
    document.getElementById("go-button").addEventListener("click", () => {
      const numOfButtonsInput = document.getElementById("num-of-button-field");
      const numButtons = parseInt(numOfButtonsInput.value);

      this.solution = [...Array(numButtons)].map((_, index) => index + 1);
      console.log("Number of buttons:", numButtons);
      console.log("Solution:", this.solution);

      if (numButtons < 3 || numButtons > 7) {
        this.displayMessage(messages.invalidInput);
      } else if (!isNaN(numButtons)) {
        this.hideInputContainer();
        this.generateButtons(numButtons);
        this.displayButtons();
        this.playGame(numButtons);
        //   }
        //   setTimeout(() => {
        //     this.hideNumbersAndMakeClickable();
        //   }, numButtons * 2); //TODO: change to 2000
      }
    });
  }
}

const memoryButtonGame = new MemoryButtonGame();
memoryButtonGame.run();

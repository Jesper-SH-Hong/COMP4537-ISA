import messages from "../lang/messages/en/user.js";

//#TODO: Check boundary, put x,y in button class?

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
    this.originalOrder = [];
    this.currentOrder = [];
    this.timeoutIDs = [];
  }

  generateButtons(numButtons) {
    this.buttons = Array.from(
      { length: numButtons },
      (_, index) =>
        (Button = {
          number: index + 1,
          color: this.getRandomColor(),
          position: { x: 0, y: 0 }, // Initial position (will be updated later)
        })
    );

    // deep copy of the buttons array
    this.originalOrder = [...this.buttons];

    console.log("created buttons");
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

  sizeInEm(int) {
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
  }

  reRenderButtons() {
    this.initScreen(buttonContainer);

    this.buttons.forEach((button) => {
      const buttonElement = document.createElement("button");
      buttonElement.style.backgroundColor = button.color;
      buttonElement.style.width = this.sizeInEm(buttonWidth);
      buttonElement.style.height = this.sizeInEm(buttonHeight);
      buttonElement.style.marginRight = this.sizeInEm(margin);

      buttonElement.style.position = "absolute";
      
      buttonElement.style.left = button.position.x - buttonWidth * em + "px";
      buttonElement.style.top = button.position.y - buttonHeight * em + "px";
      this.checkWindowBoundary(button);
      buttonContainer.appendChild(buttonElement);

      const spanElement = document.createElement("span");
      spanElement.classList.add("button-number-span");
      spanElement.innerText = button.number;
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
    callback()
  }

  playGame(numButtons) {
    setTimeout(() => {
      this.mixButtons(() => {
        this.hideNumbersAndMakeClickable();
      });
    }, numButtons * 100); //TODO: change to 1000
  }

  hideNumbersAndMakeClickable() {
    const buttonTextSpan = document.querySelectorAll(".button-number-span");
    buttonTextSpan.forEach((span) => {
      span.innerText = "";
    });

    // Make buttons clickable
    // buttonContainer.addEventListener(
    //   "click",
    //   this.handleButtonClick.bind(this)
    // );
  }

  // handleButtonClick(event) {
  //   const clickedButton = event.target;
  //   const buttonNumber = parseInt(clickedButton.innerText);

  //   // Check if the clicked button is in the correct order
  //   if (buttonNumber === this.currentOrder.length + 1) {
  //     // Correct order
  //     this.currentOrder.push(buttonNumber);
  //     clickedButton.innerText = buttonNumber; // Reveal the number

  //     // Check if all buttons are clicked in order
  //     if (this.currentOrder.length === this.buttons.length) {
  //       this.displayMessage(messages.correctAnswer);
  //       this.startNewGame();
  //     }
  //   } else {
  //     // Wrong order
  //     this.displayMessage(messages.wrongOrder);
  //     this.displayCorrectOrder();
  //     this.startNewGame();
  //   }
  // }

  // displayCorrectOrder() {
  //   // Code to reveal the correct order on the buttons
  //   this.buttons.forEach((button, index) => {
  //     const buttonElement = document.querySelector(
  //       `button:nth-child(${index + 1})`
  //     );
  //     buttonElement.innerText = button.number;
  //   });
  // }

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
    this.originalOrder = [];
    this.currentOrder = [];

    document.getElementById("input-container-title").innerHTML =
      messages.inputTitleText;
    document.getElementById("go-button").addEventListener("click", () => {
      const numOfButtonsInput = document.getElementById("num-of-button-field");
      const numButtons = parseInt(numOfButtonsInput.value);
      console.log("Number of buttons:", numButtons);

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

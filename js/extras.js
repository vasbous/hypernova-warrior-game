class backgroundPlanets {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;

    this.possibleImages = [
      "./images/airlessPlanet.gif",
      "./images/blueGiant.gif",
      "./images/glacialPlanet.gif",
      "./images/greenGiant.gif",
      "./images/redSun.gif",
      "./images/tropicalPlanet.gif",
    ];

    this.randomImageIndex = Math.floor(
      Math.random() * this.possibleImages.length
    );

    // Random size between 50 and 100 pixels
    this.size = Math.floor(Math.random() * (100 - 50 + 1)) + 50;

    // Random horizontal position within the game screen
    this.left = Math.floor(Math.random() * (500 - this.size));

    // Start above the screen
    this.top = -this.size;

    this.element = document.createElement("img");
    this.element.src = this.possibleImages[this.randomImageIndex];

    this.element.style.position = "absolute";
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.style.zIndex = "-1"; // Move to the background

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.top += 2;
    this.updatePosition();

    if (this.top > this.gameScreen.clientHeight) {
      this.element.remove();
    }
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
  }
}

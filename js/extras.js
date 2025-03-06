class BackgroundPlanets {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;

    this.possibleImages = [
      "./images/planets/airlessPlanet.gif",
      "./images/planets/blueGiant.gif",
      "./images/planets/blueSun.gif",
      "./images/planets/cloudyPlanet.gif",
      "./images/planets/crateredPlanet.gif",
      "./images/planets/glacialPlanet.gif",
      "./images/planets/greenGiant.gif",
      "./images/planets/lunarPlanet.gif",
      "./images/planets/lushPlanet.gif",
      "./images/planets/oceanPlanet.gif",
      "./images/planets/orangeGiant.gif",
      "./images/planets/redGiant.gif",
      "./images/planets/redSun.gif",
      "./images/planets/terrestrialPlanet.gif",
      "./images/planets/tropicalPlanet.gif",
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

class ShieldPowerUp {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.width = 40;
    this.height = 40;
    this.left = Math.random() * (500 - this.width);
    this.top = -50; // Start above the screen
    this.speedY = 3; // Vertical speed (renamed from speed)
    this.speedX = 3; // New horizontal speed
    this.directionX = Math.random() > 0.5 ? 1 : -1; // Random initial direction (left or right)

    this.element = document.createElement("img");
    this.element.src = "./images/powerUp1.gif";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    this.gameScreen.appendChild(this.element);
  }

  move() {
    // Move vertically
    this.top += this.speedY;

    // Move horizontally
    this.left += this.speedX * this.directionX;

    // Bounce off screen edges
    const rightBoundary = this.gameScreen.offsetWidth - this.width;
    if (this.left <= 0 || this.left >= rightBoundary) {
      this.directionX *= -1; // Reverse direction
    }

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`; // Add this line to update horizontal position
  }
}

class WeaponPowerUp {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.width = 40;
    this.height = 40;
    this.left = Math.random() * (500 - this.width);
    this.top = -50; // Start above the screen
    this.speedY = 3; // Vertical speed (renamed from speed)
    this.speedX = 3; // New horizontal speed
    this.directionX = Math.random() > 0.5 ? 1 : -1; // Random initial direction (left or right)

    this.element = document.createElement("img");
    this.element.src = "./images/powerUp2.gif";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    this.gameScreen.appendChild(this.element);
  }

  move() {
    // Move vertically
    this.top += this.speedY;

    // Move horizontally
    this.left += this.speedX * this.directionX;

    // Bounce off screen edges
    const rightBoundary = this.gameScreen.offsetWidth - this.width;
    if (this.left <= 0 || this.left >= rightBoundary) {
      this.directionX *= -1; // Reverse direction
    }

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`; // Add this line to update horizontal position
  }
}

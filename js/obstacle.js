class enemySmall {
  constructor(gameScreen, game) {
    this.gameScreen = gameScreen;
    this.game = game;
    this.centerX = 120 + Math.floor(Math.random() * 272);
    this.centerY = 0;
    this.radius = 100;
    this.angle = 0;
    this.speed = 0.05;
    this.downwardSpeed = 1;

    this.width = 30;
    this.height = 45;
    this.element = document.createElement("img");

    this.sprite1 = "./images/enemy-small1.png";
    this.sprite2 = "./images/enemy-small2.png";

    this.switchImageInterval = 60;
    this.switchImageTimer = setInterval(
      () => this.switchImage(),
      this.switchImageInterval
    );

    this.element.setAttribute("src", this.sprite1);
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;

    this.gameScreen.appendChild(this.element);

    // Initialize the position properly before rendering
    this.left = this.centerX + this.radius * Math.cos(this.angle);
    this.top = this.centerY + this.radius * Math.sin(this.angle);
    this.updatePosition();

    // Fire a laser at a random time between 0.5 and 1.5 seconds
    this.fireLaserTimeout = setTimeout(
      () => this.fireLaser(),
      500 + Math.random() * 1000
    );

    // Fire a laser at a random time between 0.5 and 1.5 seconds
    this.fireLaserTimeout = setTimeout(
      () => this.fireLaser(),
      2000 + Math.random() * 3000
    );

    // Fire a laser at a random time between 0.5 and 1.5 seconds
    this.fireLaserTimeout = setTimeout(
      () => this.fireLaser(),
      2000 + Math.random() * 3000
    );
  }

  fireLaser() {
    if (this.gameScreen && this.game) {
      const newLaser = new enemyLaser(
        this.gameScreen,
        this.left + this.width / 2 - 15,
        this.top + this.height
      );
      this.game.enemyLasers.push(newLaser);
      console.log("Enemy laser fired at:", newLaser.top);
    }
  }

  switchImage() {
    if (this.element.getAttribute("src") === this.sprite1) {
      this.element.setAttribute("src", this.sprite2);
    } else {
      this.element.setAttribute("src", this.sprite1);
    }
  }

  move() {
    // Calculate the new position using sine and cosine to create a circular pattern
    this.left = this.centerX + this.radius * Math.cos(this.angle);
    this.top = this.centerY + this.radius * Math.sin(this.angle);

    this.centerY += this.downwardSpeed;

    // Increment the angle to make the obstacle continue in a circle
    this.angle += this.speed;

    // Reset the angle after a full loop (2 * Math.PI radians = 360 degrees)
    // Keep angle within 0 to 2*PI range for smooth looping
    if (this.angle >= 2 * Math.PI) {
      this.angle -= 2 * Math.PI;
    }

    this.updatePosition();
  }
  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }
}

class enemyLarge {
  constructor(gameScreen, game) {
    this.gameScreen = gameScreen;
    this.game = game;
    this.centerX = 120 + Math.floor(Math.random() * 272);
    this.centerY = 0;
    this.radius = 100;
    this.angle = 0;
    this.speed = 0.025;
    this.downwardSpeed = 0.5;
    this.lives = 2;

    this.width = 72;
    this.height = 48;
    this.element = document.createElement("img");

    this.sprite3 = "./images/enemy-large1.png";
    this.sprite4 = "./images/enemy-large2.png";

    this.switchImageInterval = 60;
    this.switchImageTimer = setInterval(
      () => this.switchImage(),
      this.switchImageInterval
    );

    this.element.setAttribute("src", this.sprite1);
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;

    this.gameScreen.appendChild(this.element);

    // Initialize the position properly before rendering
    this.left = this.centerX + this.radius * Math.cos(this.angle);
    this.top = this.centerY + this.radius * Math.sin(this.angle);
    this.updatePosition();

    // Fire a laser at a random time between 0.5 and 1.5 seconds
    this.fireLaserTimeout = setTimeout(
      () => this.fireLaser(),
      500 + Math.random() * 1000
    );

    // Fire a laser at a random time between 0.5 and 1.5 seconds
    this.fireLaserTimeout = setTimeout(
      () => this.fireLaser(),
      3000 + Math.random() * 3000
    );

    // Fire a laser at a random time between 0.5 and 1.5 seconds
    this.fireLaserTimeout = setTimeout(
      () => this.fireLaser(),
      3000 + Math.random() * 3000
    );
  }

  fireLaser() {
    if (this.gameScreen && this.game) {
      const newLaser = new enemyLaser(
        this.gameScreen,
        this.left + this.width / 2 - 15,
        this.top + this.height
      );
      this.game.enemyLasers.push(newLaser);
      console.log("Enemy laser fired at:", newLaser.top);
    }
  }

  switchImage() {
    if (this.element.getAttribute("src") === this.sprite3) {
      this.element.setAttribute("src", this.sprite4);
    } else {
      this.element.setAttribute("src", this.sprite3);
    }
  }

  move() {
    // Calculate the new position using sine and cosine to create a circular pattern
    this.left = this.centerX + this.radius * Math.cos(this.angle);
    this.top = this.centerY + this.radius * Math.sin(this.angle);

    this.centerY += this.downwardSpeed;

    // Increment the angle to make the obstacle continue in a circle
    this.angle += this.speed;

    // Reset the angle after a full loop (2 * Math.PI radians = 360 degrees)
    // Keep angle within 0 to 2*PI range for smooth looping
    if (this.angle >= 2 * Math.PI) {
      this.angle -= 2 * Math.PI;
    }

    this.updatePosition();
  }
  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }
}

class enemySmall {
  constructor(gameScreen, game) {
    this.gameScreen = gameScreen;
    this.game = game;
    this.centerX = 120 + Math.floor(Math.random() * 252);
    this.centerY = 0;
    this.radius = 100;
    this.angle = 0;
    this.speed = 0.05;
    this.downwardSpeed = 1;

    this.width = 30;
    this.height = 45;
    this.element = document.createElement("img");
    this.element.src = `./images/enemySmall.gif`;
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

    // After the first shot, continue firing every 2 second
    this.fireInterval = setInterval(() => this.fireLaser(), 2000);
  }

  fireLaser() {
    // Prevent firing if the game is over or the enemy has been removed
    if (
      this.game.gameIsOver ||
      !this.element ||
      !document.body.contains(this.element)
    ) {
      clearInterval(this.fireInterval); // Stop interval if enemy is removed
      return;
    }

    // Limit max enemy lasers to 5 on screen at once
    // if (this.game.enemyLasers.length >= 5) {
    //   return;
    // }

    // Create new laser
    const newLaser = new enemyLaser(
      this.gameScreen,
      this.left + this.width / 2 - 15,
      this.top + this.height
    );
    this.game.enemyLasers.push(newLaser);
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
    this.centerX = 140 + Math.floor(Math.random() * 222);
    this.centerY = 0;
    this.radius = 100;
    this.angle = 0;
    this.speed = 0.025;
    this.downwardSpeed = 0.5;
    this.lives = 2;

    this.width = 72;
    this.height = 48;
    this.element = document.createElement("img");
    this.element.src = `./images/enemyLarge.gif`;

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

    // After the first shot, continue firing every 3 seconds
    this.fireInterval = setInterval(() => this.fireLaser(), 4000);
  }

  fireLaser() {
    // Prevent firing if the game is over or the enemy has been removed
    if (
      this.game.gameIsOver ||
      !this.element ||
      !document.body.contains(this.element)
    ) {
      clearInterval(this.fireInterval); // Stop interval if enemy is removed
      return;
    }

    // Limit max enemy lasers to 5 on screen at once
    // if (this.game.enemyLasers.length >= 5) {
    //   return;
    // }

    // Create new laser
    const newLaser = new enemyLaser(
      this.gameScreen,
      this.left + this.width / 2 - 15,
      this.top + this.height
    );
    this.game.enemyLasers.push(newLaser);
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

class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameEndScreen = document.getElementById("game-end");
    this.player = new Player(
      this.gameScreen,
      200,
      500,
      40,
      60,
      "./images/ship8.png"
    );
    this.height = 768;
    this.width = 512;
    this.obstacles = [];
    this.myLasers = [];
    this.score = 0;
    this.lives = 10;
    this.gameIsOver = false;
    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60); // 60fps

    // Background scrolling properties
    this.backgroundY = 0;
    this.backgroundSpeed = 2; // This controls the scrolling speed
  }

  start() {
    // Set the height and width of the game screen
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    // Hide the start screen
    this.startScreen.style.display = "none";
    // Show the game screen
    this.gameScreen.style.display = "block";

    // Executes the gameLoop on a fequency of 60 times per second. Also stores the ID of the interval.
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  gameLoop() {
    console.log("in the game loop");

    this.update();

    if (this.gameIsOver) {
      clearInterval(this.gameIntervalId);
    }
  }

  update() {
    this.player.move();

    // Move the background downward
    this.backgroundY += this.backgroundSpeed;

    // Reset background position without any jump
    if (this.backgroundY >= this.height) {
      this.backgroundY = 0;
    }

    // Apply background position update
    this.gameScreen.style.backgroundPositionY = `${this.backgroundY}px`;

    // Check for collision and if an obstacle is still on the screen
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      obstacle.move();

      // If the player's ship collides with an enemy
      if (this.player.didCollide(obstacle)) {
        obstacle.element.remove();
        this.obstacles.splice(i, 1);
        this.lives--;
        i--; // Adjust the index after removing an obstacle
      } else if (obstacle.top > this.height) {
        this.score++;
        obstacle.element.remove();
        this.obstacles.splice(i, 1);
        i--; // Adjust the index after removing an obstacle
      }
    }

    if (this.lives === 0) {
      this.endGame();
    }

    // Create a new obstacle based on a random probability
    // when there are less than the specified number of other obstacles on the screen
    if (Math.random() > 0.98 && this.obstacles.length < 3) {
      this.obstacles.push(new Obstacle(this.gameScreen));
    }

    // Check lasers collision with enemies
    for (let j = 0; j < this.myLasers.length; j++) {
      const currentMyLaser = this.myLasers[j];

      for (let i = 0; i < this.obstacles.length; i++) {
        const obstacle = this.obstacles[i];

        if (currentMyLaser.didCollide(obstacle)) {
          obstacle.element.remove();
          this.obstacles.splice(i, 1);
          i--;
          currentMyLaser.element.remove();
          this.myLasers.splice(j, 1);
          j--;
          break;
        }
      }
    }

    //this is a loop just to move the projectiles
    for (let k = 0; k < this.myLasers.length; k++) {
      const currentMyLaser = this.myLasers[k];
      currentMyLaser.move();
    }
  }

  // Create a new method responsible for ending the game
  endGame() {
    this.player.element.remove();
    this.obstacles.forEach(function (obstacle) {
      obstacle.element.remove();
    });

    this.gameIsOver = true;
    // Hide game screen
    this.gameScreen.style.display = "none";
    // Show end game screen
    this.gameEndScreen.style.display = "block";
  }
}

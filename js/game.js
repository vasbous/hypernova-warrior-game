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
    this.enemiesSmall = [];
    this.enemiesLarge = [];
    this.myLasers = [];
    this.enemyLasers = [];
    this.score = 0;
    this.gameIsOver = false;
    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60); // 60fps

    // Background scrolling properties
    this.backgroundY = 0;
    this.backgroundSpeed = 2;
  }

  start() {
    // Set the height and width of the game screen
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    this.startScreen.style.display = "none";

    this.gameScreen.style.display = "block";

    // Executes the gameLoop on a fequency of 60 times per second and stores the ID of the interval.
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  gameLoop() {
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

    // Small enemy movement and collision
    for (let i = this.enemiesSmall.length - 1; i >= 0; i--) {
      const enemy = this.enemiesSmall[i];
      enemy.move();

      // Collision with player
      if (this.player.didCollide(enemy)) {
        enemy.element.remove();
        this.enemiesSmall.splice(i, 1);
        this.player.lives--;

        // Show explosion at player's location
        new Explosion(
          this.player.left,
          this.player.top,
          this.gameScreen,
          () => {}
        );
      }
      // Remove if enemy moves off-screen
      else if (enemy.top > this.height) {
        enemy.element.remove();
        this.enemiesSmall.splice(i, 1);
      }
    }

    // Large enemy movement and collision
    for (let i = this.enemiesLarge.length - 1; i >= 0; i--) {
      const enemy = this.enemiesLarge[i];
      enemy.move();

      // Collision with player
      if (this.player.didCollide(enemy)) {
        enemy.element.remove();
        this.enemiesLarge.splice(i, 1);
        this.player.lives--;

        // Show explosion at player's location
        new Explosion(
          this.player.left,
          this.player.top,
          this.gameScreen,
          () => {}
        );
      }
      // Remove if enemy moves off-screen
      else if (enemy.top > this.height) {
        enemy.element.remove();
        this.enemiesLarge.splice(i, 1);
      }
    }

    if (this.lives === 0) {
      this.endGame();
    }

    // Create new enemies
    if (Math.random() > 0.98 && this.enemiesSmall.length < 3) {
      this.enemiesSmall.push(new enemySmall(this.gameScreen, this));
    }
    if (Math.random() > 0.98 && this.enemiesLarge.length < 1) {
      this.enemiesLarge.push(new enemyLarge(this.gameScreen, this));
    }

    // Player lasers
    for (let j = this.myLasers.length - 1; j >= 0; j--) {
      const currentMyLaser = this.myLasers[j];

      // Check collision with small enemy
      for (let i = this.enemiesSmall.length - 1; i >= 0; i--) {
        if (currentMyLaser.didCollide(this.enemiesSmall[i])) {
          currentMyLaser.element.remove();
          this.myLasers.splice(j, 1);

          new Explosion(
            this.enemiesSmall[i].left,
            this.enemiesSmall[i].top,
            this.gameScreen,
            () => {}
          );
          this.enemiesSmall[i].element.remove();
          this.enemiesSmall.splice(i, 1);
          break;
        }
      }

      // Check collision with large enemy
      for (let i = this.enemiesLarge.length - 1; i >= 0; i--) {
        if (currentMyLaser.didCollide(this.enemiesLarge[i])) {
          currentMyLaser.element.remove();
          this.myLasers.splice(j, 1);

          // Reduce large enemy's health
          this.enemiesLarge[i].lives--;

          new Explosion(
            this.enemiesLarge[i].left,
            this.enemiesLarge[i].top,
            this.gameScreen,
            () => {}
          );

          if (this.enemiesLarge[i].lives <= 0) {
            this.enemiesLarge[i].element.remove();
            this.enemiesLarge.splice(i, 1);
          }
          break;
        }
      }
    }

    // Move all player lasers
    for (let k = 0; k < this.myLasers.length; k++) {
      this.myLasers[k].move();
    }

    // Move and check enemy lasers
    for (let l = this.enemyLasers.length - 1; l >= 0; l--) {
      const currentEnemyLaser = this.enemyLasers[l];

      currentEnemyLaser.move();

      if (this.player.didCollide(currentEnemyLaser)) {
        currentEnemyLaser.element.remove();
        this.enemyLasers.splice(l, 1);
        this.player.lives--;

        new Explosion(
          this.player.left,
          this.player.top,
          this.gameScreen,
          () => {}
        );

        if (this.player.lives === 0) {
          this.endGame();
        }
      } else if (currentEnemyLaser.top > this.height) {
        currentEnemyLaser.element.remove();
        this.enemyLasers.splice(l, 1);
      }
    }
  }

  // Create a new method responsible for ending the game
  endGame() {
    this.gameIsOver = true;

    // Stop game loop
    if (this.gameIntervalId) {
      clearInterval(this.gameIntervalId);
    }

    // Remove player
    if (this.player && this.player.element) {
      this.player.element.remove();
    }

    // Stop and remove all enemies
    this.enemiesSmall.forEach((enemy) => {
      clearTimeout(enemy.fireLaserTimeout1);
      clearTimeout(enemy.fireLaserTimeout2);
      enemy.element.remove();
    });
    this.enemiesLarge.forEach((enemy) => {
      clearTimeout(enemy.fireLaserTimeout1);
      clearTimeout(enemy.fireLaserTimeout2);
      enemy.element.remove();
    });

    // Stop all active lasers
    this.myLasers.forEach((laser) => laser.element.remove());
    this.enemyLasers.forEach((laser) => laser.element.remove());

    // Clear arrays
    this.enemiesSmall = [];
    this.enemiesLarge = [];
    this.myLasers = [];
    this.enemyLasers = [];

    // Hide game screen and show end screen
    this.gameScreen.style.display = "none";
    this.gameEndScreen.style.display = "block";
  }
}

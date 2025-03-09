class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameEndScreen = document.getElementById("game-end");
    this.scoreElement = document.getElementById("score");
    this.highScoresListElement = document.getElementById("high-scores");
    this.livesContainer = document.getElementById("lives-container");
    this.livesTitle = document.getElementById("lives-title");

    // Define all soundtracks
    this.titleScreenMusic = new Audio("./assets/titleScreenMusic.mp3");
    this.titleScreenMusic.loop = true;
    this.titleScreenMusic.volume = 0.1;

    this.introMusic = new Audio("./assets/introMusic.mp3");
    this.introMusic.loop = true;
    this.introMusic.volume = 0.1;

    this.gameSoundtrack = new Audio("./assets/gameSoundtrack.mp3");
    this.gameSoundtrack.loop = true;
    this.gameSoundtrack.volume = 0.1;

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
    this.shieldPowerUps = [];
    this.weaponPowerUps = [];
    this.backgroundPlanets = [];
    this.score = 0;
    this.gameIsOver = false;
    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60); // 60fps
    // Background scrolling properties
    this.backgroundY = 0;
    this.backgroundSpeed = 2;
    this.scoreElement.style.display = "none";
    this.isPaused = false;
    this.pauseMenu = document.getElementById("pause-menu");
    this.powerUpTimeout = null;
    this.planetTimeout = null;
  }

  startIntroSequence() {
    // First ensure title music is stopped properly regardless of whether it's currently playing
    this.titleScreenMusic.pause();
    this.titleScreenMusic.currentTime = 0;

    // Start intro music
    this.introMusic.currentTime = 0;
    this.introMusic
      .play()
      .catch((error) => console.warn("Intro music autoplay blocked:", error));

    // Create intro sequence container
    const introContainer = document.createElement("div");
    introContainer.id = "intro-sequence";
    document.body.appendChild(introContainer);

    // Image paths for the intro sequence
    const introImages = [
      "./images/intro1.png",
      "./images/intro2.png",
      "./images/intro3.png",
      "./images/intro4.png",
      "./images/intro5.png",
      "./images/intro6.png",
    ];

    let currentIndex = 0;
    let isVideoPlaying = false;

    // Create image element
    const imageElement = document.createElement("img");
    imageElement.id = "intro-image";
    imageElement.src = introImages[currentIndex];
    introContainer.appendChild(imageElement);

    // Create video element
    const videoElement = document.createElement("video");
    videoElement.id = "intro-video";
    videoElement.src = "./assets/intro-video.mp4";
    videoElement.style.display = "none";
    introContainer.appendChild(videoElement);

    // Create next button
    const nextButton = document.createElement("button");
    nextButton.id = "intro-next-button";
    nextButton.textContent = "Next";
    introContainer.appendChild(nextButton);

    // Create skip button
    const skipButton = document.createElement("button");
    skipButton.id = "intro-skip-button";
    skipButton.textContent = "Skip To Game";
    introContainer.appendChild(skipButton);

    // Function to show next image or video
    const showNext = () => {
      if (!isVideoPlaying) {
        currentIndex++;
        if (currentIndex < introImages.length) {
          // Show next image
          imageElement.src = introImages[currentIndex];
        } else {
          // All images shown, start video
          isVideoPlaying = true;
          imageElement.style.display = "none";
          videoElement.style.display = "block";
          nextButton.textContent = "Kick Alien Butt!";
          videoElement.play();
        }
      } else {
        // Video is playing and user clicked next, start game
        endIntroSequence();
      }
    };

    // End intro sequence and start game
    const endIntroSequence = () => {
      // Ensure intro music is stopped
      this.introMusic.pause();
      this.introMusic.currentTime = 0;

      // Remove the intro container before starting the game
      document.body.removeChild(introContainer);

      // Start the game soundtrack
      this.gameSoundtrack.currentTime = 0;
      this.gameSoundtrack
        .play()
        .catch((error) => console.warn("Game soundtrack error:", error));

      // Start the game
      this.start();
    };

    // Event listeners for next and skip buttons
    nextButton.addEventListener("click", showNext);
    skipButton.addEventListener("click", endIntroSequence);

    // Listen for video end to update button
    videoElement.addEventListener("ended", () => {
      nextButton.textContent = "Kick Alien Butt!";
    });
  }

  fadeOutAudio(audio, callback = null) {
    if (!audio || audio.paused) {
      if (callback) callback();
      return;
    }

    // Store original volume to restore it later if needed
    const originalVolume = audio.volume;

    // Gradually reduce volume
    const fadeInterval = setInterval(() => {
      // Reduce volume by small increment
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        // Stop and reset when volume is very low
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = originalVolume; // Reset volume for future use

        if (callback) callback();
      }
    }, 100);
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      // Pause the game
      clearInterval(this.gameIntervalId);

      // Clear all enemy firing intervals and timeouts
      this.enemiesSmall.forEach((enemy) => {
        if (enemy.fireLaserTimeout) clearTimeout(enemy.fireLaserTimeout);
        if (enemy.fireInterval) clearInterval(enemy.fireInterval);
      });

      this.enemiesLarge.forEach((enemy) => {
        if (enemy.fireLaserTimeout) clearTimeout(enemy.fireLaserTimeout);
        if (enemy.fireInterval) clearInterval(enemy.fireInterval);
      });

      // Store the current powerUp and planet timeouts if they exist
      if (this.powerUpTimeout) {
        clearTimeout(this.powerUpTimeout);
      }

      if (this.planetTimeout) {
        clearTimeout(this.planetTimeout);
      }

      // Show pause menu
      this.pauseMenu.style.display = "block";

      // Pause game soundtrack
      if (this.gameSoundtrack && !this.gameSoundtrack.paused) {
        this.gameSoundtrack.pause();
      }
    } else {
      // Resume the game
      this.gameIntervalId = setInterval(() => {
        this.gameLoop();
      }, this.gameLoopFrequency);

      // Restart enemy firing
      this.enemiesSmall.forEach((enemy) => {
        if (enemy.startFiring) {
          enemy.startFiring();
        }
      });

      this.enemiesLarge.forEach((enemy) => {
        if (enemy.startFiring) {
          enemy.startFiring();
        }
      });

      // Restart power-up spawning
      if (!this.powerUpTimeout) {
        this.powerUpTimeout = setTimeout(() => this.spawnPowerUps(), 5000);
      }

      // Restart planet spawning
      if (!this.planetTimeout) {
        const nextSpawnTime = Math.random() * (5000 - 2000) + 2000;
        this.planetTimeout = setTimeout(
          () => this.spawnBackgroundPlanet(),
          nextSpawnTime
        );
      }

      // Hide pause menu
      this.pauseMenu.style.display = "none";

      // Resume game soundtrack
      if (this.gameSoundtrack && this.gameSoundtrack.paused) {
        this.gameSoundtrack
          .play()
          .catch((error) => console.warn("Resume soundtrack error:", error));
      }
    }
  }

  spawnBackgroundPlanet() {
    if (this.gameIsOver || this.isPaused) return;

    this.backgroundPlanets.push(new BackgroundPlanets(this.gameScreen));

    // Generate next planet in 2-5 seconds
    const nextSpawnTime = Math.random() * (5000 - 2000) + 2000;
    this.planetTimeout = setTimeout(
      () => this.spawnBackgroundPlanet(),
      nextSpawnTime
    );
  }

  start() {
    this.scoreElement.style.display = "block";

    // Set the height and width of the game screen
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.livesContainer.style.display = "flex";

    this.spawnPowerUps();
    this.spawnBackgroundPlanet();

    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  gameLoop() {
    this.update();
    this.updateStats();

    if (this.gameIsOver) {
      clearInterval(this.gameIntervalId);
    }
  }

  updateStats() {
    // Update score in the HTML
    this.scoreElement.innerText = `Score: ${this.score}`;

    // Clear the current lives container
    this.livesContainer.innerHTML = "Lives: ";

    // Show the remaining lives as ship images
    for (let i = 0; i < this.player.lives; i++) {
      const shipIcon = document.createElement("img");
      shipIcon.src = "./images/shipLife.gif"; // Your ship icon path
      shipIcon.alt = "Ship icon";
      shipIcon.className = "life-gif";
      this.livesContainer.appendChild(shipIcon);
    }
  }

  update() {
    this.player.move();

    // Move power-ups and check for collisions
    this.shieldPowerUps.forEach((powerUp, index) => {
      powerUp.move();
      if (this.player.didCollide(powerUp)) {
        powerUp.element.remove();
        this.shieldPowerUps.splice(index, 1);
        this.player.addShield();
      } else if (powerUp.top > this.height) {
        powerUp.element.remove();
        this.shieldPowerUps.splice(index, 1);
      }
    });

    this.weaponPowerUps.forEach((powerUp, index) => {
      powerUp.move();
      if (this.player.didCollide(powerUp)) {
        powerUp.element.remove();
        this.weaponPowerUps.splice(index, 1);
        this.upgradeWeapon();
      } else if (powerUp.top > this.height) {
        powerUp.element.remove();
        this.weaponPowerUps.splice(index, 1);
      }
    });

    // Move the background downward
    this.backgroundY += this.backgroundSpeed;

    // Reset background position without any jump
    if (this.backgroundY >= this.height) {
      this.backgroundY = 0;
    }

    // Apply background position update
    this.gameScreen.style.backgroundPositionY = `${this.backgroundY}px`;

    this.backgroundPlanets.forEach((planet, index) => {
      planet.move();

      if (planet.top > this.gameScreen.clientHeight) {
        planet.element.remove();
        this.backgroundPlanets.splice(index, 1);
      }
    });

    // Small enemy movement and collision
    for (let i = this.enemiesSmall.length - 1; i >= 0; i--) {
      const enemy = this.enemiesSmall[i];
      enemy.move();

      // Collision with player
      if (this.player.didCollide(enemy)) {
        enemy.element.remove();
        this.enemiesSmall.splice(i, 1);

        if (this.player.hasShield) {
          this.player.removeShield();
        } else {
          this.player.lives--;

          // Show explosion at player's location
          new Explosion(
            this.player.left,
            this.player.top,
            this.gameScreen,
            () => {}
          );
        }
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

        if (this.player.hasShield) {
          this.player.removeShield();
        } else {
          this.player.lives--;

          // Show explosion at player's location
          new Explosion(
            this.player.left,
            this.player.top,
            this.gameScreen,
            () => {}
          );
        }
      }
      // Remove if enemy moves off-screen
      else if (enemy.top > this.height) {
        enemy.element.remove();
        this.enemiesLarge.splice(i, 1);
      }
    }

    if (this.player.lives === 0) {
      this.endGame();
    }

    // Create new enemies
    if (this.gameIsOver === false) {
      if (Math.random() > 0.98 && this.enemiesSmall.length < 3) {
        this.enemiesSmall.push(new enemySmall(this.gameScreen, this));
      }
      if (Math.random() > 0.98 && this.enemiesLarge.length < 1) {
        this.enemiesLarge.push(new enemyLarge(this.gameScreen, this));
      }
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
          this.score++;
          break;
        }
      }

      // Check collision with large enemy
      for (let i = this.enemiesLarge.length - 1; i >= 0; i--) {
        if (currentMyLaser.didCollide(this.enemiesLarge[i])) {
          currentMyLaser.element.remove();
          this.myLasers.splice(j, 1);

          // Reduce large enemy's health
          if (this.player.weaponUpgraded === true) {
            this.enemiesLarge[i].lives -= 2;
          } else {
            this.enemiesLarge[i].lives--;
          }

          new Explosion(
            this.enemiesLarge[i].left,
            this.enemiesLarge[i].top,
            this.gameScreen,
            () => {}
          );

          if (this.enemiesLarge[i].lives <= 0) {
            this.enemiesLarge[i].element.remove();
            this.enemiesLarge.splice(i, 1);
            this.score += 2;
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

      // If laser doesn't exist or has been removed, skip it
      if (!currentEnemyLaser) {
        continue;
      }

      // Call move if laser exists
      currentEnemyLaser.move();

      if (this.player.didCollide(currentEnemyLaser)) {
        currentEnemyLaser.element.remove();
        this.enemyLasers.splice(l, 1);

        if (this.player.hasShield) {
          this.player.removeShield();
        } else {
          this.player.lives--;
          console.log(this.player.lives);

          new Explosion(
            this.player.left - 25,
            this.player.top - 25,
            this.gameScreen,
            () => {}
          );

          if (this.player.lives <= 0) {
            this.endGame();
          }
        }
      } else if (currentEnemyLaser.top > this.height) {
        currentEnemyLaser.element.remove();
        this.enemyLasers.splice(l, 1);
      }
    }
  }

  upgradeWeapon() {
    this.player.weaponUpgraded = true;
    this.player.laserImage = "./images/bolt2.gif";
    this.player.laserSpeed = 1.25;
    this.player.laserSize = 2;

    setTimeout(() => {
      if (this.gameIsOver) return; // Prevents changes after game ends
      this.player.weaponUpgraded = false;
      this.player.laserImage = "./images/bolt.gif";
      this.player.laserSpeed = 1;
      this.player.laserSize = 1;
    }, 3000);
  }

  spawnPowerUps() {
    if (this.gameIsOver || this.isPaused) return;

    if (!this.player.hasShield && Math.random() > 0.5) {
      this.shieldPowerUps.push(new ShieldPowerUp(this.gameScreen));
    }

    if (!this.player.weaponUpgraded && Math.random() > 0.5) {
      this.weaponPowerUps.push(new WeaponPowerUp(this.gameScreen));
    }

    this.powerUpTimeout = setTimeout(() => this.spawnPowerUps(), 5000);
  }

  addShield() {
    if (this.hasShield) return; // Prevent multiple shields
    this.hasShield = true;
    this.shield = new Shield(this); // Activate shield when acquired
  }

  // Create a new method responsible for ending the game
  endGame() {
    this.gameIsOver = true;

    // Stop game loop
    if (this.gameIntervalId) {
      clearInterval(this.gameIntervalId);
    }

    // Safely fade out and stop game soundtrack
    if (this.gameSoundtrack) {
      try {
        this.fadeOutAudio(this.gameSoundtrack);
      } catch (error) {
        console.warn("Error fading game soundtrack:", error);
        // Fallback: just pause the audio
        if (this.gameSoundtrack) {
          this.gameSoundtrack.pause();
          this.gameSoundtrack.currentTime = 0;
        }
      }
    }

    // Remove player safely
    if (this.player && this.player.element) {
      this.player.element.remove();
    }

    if (this.powerUpTimeout) {
      clearTimeout(this.powerUpTimeout);
      this.powerUpTimeout = null;
    }

    if (this.planetTimeout) {
      clearTimeout(this.planetTimeout);
      this.planetTimeout = null;
    }

    // Stop and remove all enemies safely
    this.enemiesSmall.forEach((enemy) => {
      if (enemy.fireLaserTimeout) clearTimeout(enemy.fireLaserTimeout);
      if (enemy.fireInterval) clearInterval(enemy.fireInterval);
      if (enemy.element) enemy.element.remove();
    });

    this.enemiesLarge.forEach((enemy) => {
      if (enemy.fireLaserTimeout) clearTimeout(enemy.fireLaserTimeout);
      if (enemy.fireInterval) clearInterval(enemy.fireInterval);
      if (enemy.element) enemy.element.remove();
    });

    // Clean up all other game objects
    this.myLasers.forEach((laser) => {
      if (laser.element) laser.element.remove();
    });

    this.enemyLasers.forEach((laser) => {
      if (laser.element) laser.element.remove();
      if (laser.sound) {
        laser.sound.pause();
        laser.sound.currentTime = 0;
      }
    });

    // Clean up power-ups
    this.shieldPowerUps.forEach((powerUp) => {
      if (powerUp.element) powerUp.element.remove();
    });

    this.weaponPowerUps.forEach((powerUp) => {
      if (powerUp.element) powerUp.element.remove();
    });

    this.backgroundPlanets.forEach((planet) => {
      if (planet.element) planet.element.remove();
    });

    // Clear arrays
    this.enemiesSmall = [];
    this.enemiesLarge = [];
    this.myLasers = [];
    this.enemyLasers = [];
    this.shieldPowerUps = [];
    this.weaponPowerUps = [];
    this.backgroundPlanets = [];

    // Hide lives container on game over
    if (this.livesContainer) {
      this.livesContainer.style.display = "none";
    }

    // Hide score element
    if (this.scoreElement) {
      this.scoreElement.style.display = "none";
    }

    // Hide game screen and show end screen
    if (this.gameScreen) {
      this.gameScreen.style.display = "none";
    }

    if (this.gameEndScreen) {
      this.gameEndScreen.style.display = "block";
    }

    const gameOverVideo = document.getElementById("game-over-video");
    if (gameOverVideo) {
      // Play the video only when the screen is displayed
      gameOverVideo.currentTime = 0; // Reset to the start
      gameOverVideo
        .play()
        .catch((error) =>
          console.warn("Game over video autoplay blocked:", error)
        );
    }

    // Update the final score display
    document.getElementById("final-score").textContent = this.score;

    // Handle high scores
    try {
      // Get existing scores or create new array
      const scoresInStorage =
        JSON.parse(localStorage.getItem("high-scores")) || [];

      // Check if current score qualifies for top 10
      const isHighScore = this.checkIfHighScore(scoresInStorage, this.score);

      // Get the high score form element
      const highScoreForm = document.getElementById("high-score-form");
      const highScoreInput = document.getElementById("high-score-input");
      const submitScoreButton = document.getElementById("submit-score-button");

      if (isHighScore) {
        // Show the high score form
        highScoreForm.style.display = "block";

        // Focus on the input
        setTimeout(() => {
          highScoreInput.focus();
        }, 500);

        // Handle form submission via button click
        submitScoreButton.onclick = () => {
          this.submitHighScore(scoresInStorage);
        };
      } else {
        // No high score, just display the top 10
        highScoreForm.style.display = "none";

        // Add current score with "Unknown" name
        scoresInStorage.push({
          name: "Unknown",
          score: this.score,
        });

        // Sort and keep top 10
        const topTenScores = scoresInStorage
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);

        // Save back to storage
        localStorage.setItem("high-scores", JSON.stringify(topTenScores));

        // Update the high scores table
        this.updateHighScoresTable(topTenScores);
      }
    } catch (error) {
      console.warn("Error handling high scores:", error);
    }
  }

  // Check if score is in top 10
  checkIfHighScore(scores, currentScore) {
    if (scores.length < 10) {
      return true;
    }

    // Sort scores by score value
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    return currentScore > sortedScores[9].score;
  }

  // Submit high score
  submitHighScore(scores) {
    const highScoreInput = document.getElementById("high-score-input");
    const highScoreForm = document.getElementById("high-score-form");

    // Get the player's name or set to Unknown, convert to uppercase
    const playerName = (highScoreInput.value.trim() || "Unknown").toUpperCase();

    // Add the new score
    scores.push({
      name: playerName,
      score: this.score,
    });

    // Sort and keep top 10
    const topTenScores = scores.sort((a, b) => b.score - a.score).slice(0, 10);

    // Save back to storage
    localStorage.setItem("high-scores", JSON.stringify(topTenScores));

    // Hide the form
    highScoreForm.style.display = "none";

    // Update the high scores table
    this.updateHighScoresTable(topTenScores);
  }

  // Update high scores table to display names in uppercase
  updateHighScoresTable(topTenScores) {
    // Clear existing scores display
    if (this.highScoresListElement) {
      this.highScoresListElement.innerHTML = "";

      // Display scores in table format
      topTenScores.forEach((scoreObject, index) => {
        const row = document.createElement("tr");

        // Rank cell
        const rankCell = document.createElement("td");
        rankCell.textContent = index + 1;

        // Name cell - ensure uppercase
        const nameCell = document.createElement("td");
        nameCell.textContent = scoreObject.name.toUpperCase();

        // Score cell
        const scoreCell = document.createElement("td");
        scoreCell.textContent = scoreObject.score;

        // Add cells to row
        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);

        // Add row to table
        this.highScoresListElement.appendChild(row);
      });
    }
  }
}

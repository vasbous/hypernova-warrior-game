window.onload = function () {
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  let game;
  let gameActive = false; // To keep track if game is in active state
  let introPlaying = false; // Track if intro is running

  // Initialize the game to have access to the audio files
  game = new Game();

  // Override the original endGame method to handle high score form
  const originalEndGame = game.endGame;
  game.endGame = function () {
    gameActive = false;
    originalEndGame.call(game);

    // Update the high score form layout
    const highScoreForm = document.getElementById("high-score-form");
    if (highScoreForm) {
      // Clear existing content
      highScoreForm.innerHTML = "";

      // Add header
      const header = document.createElement("h3");
      header.textContent = "Congratulations! You got a high score!";
      highScoreForm.appendChild(header);

      // Add label
      const label = document.createElement("label");
      label.textContent = "Enter your initials:";
      highScoreForm.appendChild(label);

      // Add input
      const input = document.createElement("input");
      input.id = "high-score-input";
      input.type = "text";
      input.maxLength = "3";
      input.placeholder = "3 letters";
      input.style.textTransform = "uppercase";
      highScoreForm.appendChild(input);

      // Add button
      const button = document.createElement("button");
      button.id = "submit-score-button";
      button.textContent = "Submit";
      highScoreForm.appendChild(button);

      // Reattach event handler
      button.onclick = () => {
        game.submitHighScore(
          JSON.parse(localStorage.getItem("high-scores")) || []
        );
      };
    }
  };

  // Flag to track if we've attempted to play music
  let musicInitialized = false;

  // Function to start title music after user interaction
  function initializeMusic() {
    if (!musicInitialized) {
      game.titleScreenMusic
        .play()
        .catch((error) => console.warn("Title music playback issue:", error));
      musicInitialized = true;
      document.removeEventListener("click", initializeMusic);
      document.removeEventListener("keydown", initializeMusic);
      document.removeEventListener("mousemove", initializeMusic);
    }
  }

  // Listen for any user interaction to start music
  document.addEventListener("click", initializeMusic, { once: true });
  document.addEventListener("keydown", initializeMusic, { once: true });
  document.addEventListener("mousemove", initializeMusic, { once: true });

  startButton.addEventListener("click", function () {
    // Prevent starting multiple intros
    if (introPlaying) return;
    introPlaying = true; // Set flag to true when intro starts

    // First make sure music is properly initialized if it hasn't been yet
    if (!musicInitialized) {
      // Try to play title music just to initialize audio context
      game.titleScreenMusic
        .play()
        .catch((error) => console.warn("Title music init error:", error))
        .finally(() => {
          // Mark as initialized even if it failed
          musicInitialized = true;
          // Then immediately start intro sequence which will handle the audio properly
          game.startIntroSequence();
        });
    } else {
      // Music was already initialized, just start intro sequence
      game.startIntroSequence();
    }
  });

  // Set gameActive to true when the actual game starts
  const originalStart = game.start;
  game.start = function () {
    introPlaying = false; // Make sure intro flag is reset
    gameActive = true;
    originalStart.call(game);
  };

  restartButton.addEventListener("click", function () {
    restartGame();
  });

  function restartGame() {
    location.reload();
  }

  function handleKeydown(event) {
    // Only handle game controls when the game is active
    if (!gameActive) {
      if (
        ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", " "].includes(
          event.key
        )
      ) {
        event.preventDefault();
      }
      return;
    }

    const key = event.key;

    // Handle Escape key for pause
    if (key === "Escape") {
      event.preventDefault();
      game.togglePause();
      return;
    }

    // Skip other controls if game is paused
    if (game.isPaused) {
      return;
    }

    if (
      ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", " "].includes(key)
    ) {
      event.preventDefault();
    }

    switch (key) {
      case "ArrowLeft":
        game.player.directionX = -4;
        break;
      case "ArrowUp":
        game.player.directionY = -4;
        break;
      case "ArrowRight":
        game.player.directionX = 4;
        break;
      case "ArrowDown":
        game.player.directionY = 4;
        break;
      case " ":
        if (!game.player.isShooting) {
          const myShipLeft = game.player.left + 5;
          const myShipTop = game.player.top - 40;
          game.myLasers.push(
            new myLaser(game.gameScreen, myShipLeft, myShipTop, game.player)
          );
          game.player.isShooting = true;
          setTimeout(
            () => {
              game.player.isShooting = false;
            },
            game.player.weaponUpgraded ? 200 : 400
          );
        }
        break;
    }
  }

  function handleKeyup(event) {
    // Only handle game controls when game is active and intro is not playing
    if (!gameActive || introPlaying || game.isPaused) {
      return;
    }

    const key = event.key;
    switch (key) {
      case "ArrowLeft":
        if (game.player.directionX < 0) game.player.directionX = 0;
        break;
      case "ArrowRight":
        if (game.player.directionX > 0) game.player.directionX = 0;
        break;
      case "ArrowUp":
        if (game.player.directionY < 0) game.player.directionY = 0;
        break;
      case "ArrowDown":
        if (game.player.directionY > 0) game.player.directionY = 0;
        break;
    }
  }

  // Attach event listeners
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);
};

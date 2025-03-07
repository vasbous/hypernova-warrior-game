window.onload = function () {
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  let game;

  // Initialize the game to have access to the audio files
  game = new Game();

  // Flag to track if we've attempted to play music
  let musicInitialized = false;

  // Function to start title music after user interaction
  function initializeMusic() {
    if (!musicInitialized) {
      game.titleScreenMusic
        .play()
        .catch((error) => console.warn("Title music playback issue:", error));
      musicInitialized = true;
    }
  }

  // Listen for any user interaction to start music
  document.addEventListener("click", initializeMusic, { once: true });
  document.addEventListener("keydown", initializeMusic, { once: true });

  startButton.addEventListener("click", function () {
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

  restartButton.addEventListener("click", function () {
    restartGame();
  });

  function restartGame() {
    location.reload();
  }

  function handleKeydown(event) {
    if (!game || !game.player) return;

    const key = event.key;

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
    if (!game || !game.player) return;

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

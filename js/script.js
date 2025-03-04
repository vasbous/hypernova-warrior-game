window.onload = function () {
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  let game;

  const gameSoundTrack = document.getElementById("game-soundtrack");

  startButton.addEventListener("click", function () {
    startGame();
  });

  restartButton.addEventListener("click", function () {
    restartGame();
  });

  function startGame() {
    console.log("start game");

    game = new Game();
    game.start();
  }

  function restartGame() {
    location.reload();
  }

  // To handle movement with Arrow keys
  function handleKeydown(event) {
    if (!game || !game.player) return;

    const key = event.key;
    const possibleKeystrokes = [
      "ArrowLeft",
      "ArrowUp",
      "ArrowRight",
      "ArrowDown",
      " ",
    ];

    if (possibleKeystrokes.includes(key)) {
      event.preventDefault();
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
              new myLaser(game.gameScreen, myShipLeft, myShipTop)
            );
            game.player.isShooting = true;

            setTimeout(() => {
              game.player.isShooting = false;
            }, 400);
          }
          break;
      }
    }
  }

  // To stop moving
  function handleKeyup(event) {
    if (!game || !game.player) return;

    const key = event.key;
    const possibleKeystrokes = [
      "ArrowLeft",
      "ArrowUp",
      "ArrowRight",
      "ArrowDown",
    ];

    if (possibleKeystrokes.includes(key)) {
      event.preventDefault();
      switch (key) {
        case "ArrowLeft":
        case "ArrowRight":
          game.player.directionX = 0; // Stop horizontal movement
          break;
        case "ArrowUp":
        case "ArrowDown":
          game.player.directionY = 0; // Stop vertical movement
          break;
      }
    }
  }

  // Attach event listeners
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);
};

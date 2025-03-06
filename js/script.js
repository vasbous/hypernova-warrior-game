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

  // To stop moving
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

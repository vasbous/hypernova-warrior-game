class myLaser {
  constructor(gameScreen, myShipLeft, myShipTop, player) {
    this.left = myShipLeft;
    this.top = myShipTop;
    this.width = player.weaponUpgraded ? 60 : 30; // Double size if upgraded
    this.height = player.weaponUpgraded ? 100 : 50;
    this.sound = new Audio("./assets/myLaser.wav");
    this.sound.preload = "auto";
    this.sound.volume = 0.1;
    this.sound.play();
    this.element = document.createElement("img");
    //added Date Stamp so browser caches every image and gif repeats properly
    this.element.src = player.weaponUpgraded
      ? `./images/bolt2.gif?t=${Date.now()}`
      : `./images/bolt.gif?t=${Date.now()}`;

    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    gameScreen.appendChild(this.element);
    this.updatePosition();
  }

  move() {
    this.top -= 6;
    this.updatePosition();
  }
  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
  }

  explode(callback) {
    new Explosion(this.left, this.top, this.gameScreen, callback);
    this.element.remove();
  }

  didCollide(enemies) {
    const projectileRect = this.element.getBoundingClientRect();
    const obstacleRect = enemies.element.getBoundingClientRect();

    if (
      projectileRect.left < obstacleRect.right &&
      projectileRect.right > obstacleRect.left &&
      projectileRect.top < obstacleRect.bottom &&
      projectileRect.bottom > obstacleRect.top
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class enemyLaser {
  constructor(gameScreen, enemyShipLeft, enemyShipTop) {
    this.left = enemyShipLeft;
    this.top = enemyShipTop;
    this.width = 25;
    this.height = 45;
    this.sound = new Audio("./assets/enemyLaser.mp3");
    this.sound.preload = "auto";
    this.sound.volume = 0.1;
    this.sound.play();
    this.element = document.createElement("img");
    //added Date Stamp so browser caches every image and gif repeats properly
    this.element.src = `./images/enemyBolt.gif?t=${Date.now()}`;

    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    gameScreen.appendChild(this.element);
    this.updatePosition();
  }

  move() {
    this.top += 6;
    this.updatePosition();
  }
  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
  }

  explode(callback) {
    new Explosion(this.left, this.top, this.gameScreen, callback);
    this.element.remove();
  }

  didCollide(enemies) {
    const projectileRect = this.element.getBoundingClientRect();
    const obstacleRect = enemies.element.getBoundingClientRect();

    if (
      projectileRect.left < obstacleRect.right &&
      projectileRect.right > obstacleRect.left &&
      projectileRect.top < obstacleRect.bottom &&
      projectileRect.bottom > obstacleRect.top
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Shield {
  constructor(player) {
    this.player = player;
    this.width = 100;
    this.height = 100;
    this.active = true;

    this.element = document.createElement("img");
    this.element.src = "./images/shield5.gif";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.pointerEvents = "none"; // Prevent interference with game controls

    player.gameScreen.appendChild(this.element);
    this.updatePosition();
  }

  updatePosition() {
    // Center horizontally: player left + (ship width/2) - (shield width/2)
    const leftPosition =
      this.player.left + this.player.width / 2 - this.width / 2;

    // Center vertically: player top + (ship height/2) - (shield height/2)
    const topPosition =
      this.player.top + this.player.height / 2 - this.height / 2;

    this.element.style.left = `${leftPosition}px`;
    this.element.style.top = `${topPosition}px`;
  }

  deactivate() {
    this.active = false;
    this.element.remove();
  }
}

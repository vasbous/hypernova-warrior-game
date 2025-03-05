class myLaser {
  constructor(gameScreen, myShipLeft, myShipTop) {
    this.left = myShipLeft;
    this.top = myShipTop;
    this.width = 30;
    this.height = 50;
    this.sound = new Audio("./assets/myLaser.wav");
    this.sound.preload = "auto";
    this.sound.volume = 0.1;
    this.sound.play();
    this.element = document.createElement("img");
    //added Date Stamp so browser caches every image and gif repeats properly
    this.element.src = `./images/bolt.gif?t=${Date.now()}`;

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

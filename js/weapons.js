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
    this.sprite1 = "./images/myLaser1.png";
    this.sprite2 = "./images/myLaser2.png";

    this.switchImageInterval = 60;
    this.switchImageTimer = setInterval(
      () => this.switchImage(),
      this.switchImageInterval
    );

    this.element.setAttribute("src", this.sprite1);
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    gameScreen.appendChild(this.element);
    this.updatePosition();
  }

  switchImage() {
    if (this.element.getAttribute("src") === this.sprite1) {
      this.element.setAttribute("src", this.sprite2);
    } else {
      this.element.setAttribute("src", this.sprite1);
    }
  }

  move() {
    this.top -= 6;
    this.updatePosition();
  }
  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
  }
  didCollide(obstacle) {
    const projectileRect = this.element.getBoundingClientRect();
    const obstacleRect = obstacle.element.getBoundingClientRect();

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

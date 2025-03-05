class Player {
  constructor(gameScreen, left, top, width, height) {
    this.gameScreen = gameScreen;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.directionX = 0;
    this.directionY = 0;
    this.frame = 1; // Tracks thruster animation
    this.element = document.createElement("img");
    this.lives = 20;

    // Preload image groups for ship animation
    this.imageSet1 = [
      "images/ship1.png",
      "images/ship2.png",
      "images/ship3.png",
    ];
    this.imageSet2 = [
      "images/ship4.png",
      "images/ship5.png",
      "images/ship6.png",
    ];

    this.images = [this.imageSet1, this.imageSet2];
    this.currentSet = 0;

    this.element.src = this.imageSet1[1]; // Default to center image
    this.element.style.position = "absolute";
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;

    this.gameScreen.appendChild(this.element);

    this.animateThruster();
  }

  animateThruster() {
    setInterval(() => {
      this.currentSet = this.currentSet === 0 ? 1 : 0; // Alternate between sets
      this.updateImage(); // Apply the new frame
    }, 60); // Adjust timing to control thruster flicker speed
  }

  move() {
    this.left += this.directionX;
    this.top += this.directionY;

    // Keep within game boundaries
    this.left = Math.max(
      10,
      Math.min(this.gameScreen.offsetWidth - this.width - 10, this.left)
    );
    this.top = Math.max(
      10,
      Math.min(this.gameScreen.offsetHeight - this.height - 10, this.top)
    );

    // Update ship's appearance on screen based on movement
    this.updateImage();
    this.updatePosition();
  }

  updateImage() {
    let index = 1; // 1 is the position of the centered image

    if (this.directionX < 0) index = 0; // Left tilt
    if (this.directionX > 0) index = 2; // Right tilt

    this.element.src = this.images[this.currentSet][index];
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  didCollide(enemies) {
    const playerRect = this.element.getBoundingClientRect();
    const obstacleRect = enemies.element.getBoundingClientRect();

    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      return true;
    } else {
      return false;
    }
  }
}

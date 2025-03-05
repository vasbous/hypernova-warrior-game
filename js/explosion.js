class Explosion {
  constructor(left, top, gameScreen, callback) {
    this.left = left;
    this.top = top;
    this.gameScreen = gameScreen;
    this.element = document.createElement("img");
    this.element.src = `./images/explosion-1150ms.gif?t=${Date.now()}`;

    this.element.style.position = "absolute";
    this.element.style.width = "120px";
    this.element.style.height = "120px";
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    this.gameScreen.appendChild(this.element);

    // Play explosion sound
    this.sound = new Audio("./assets/explosion.mp3");
    this.sound.preload = "auto";
    this.sound.volume = 0.1; // Adjust volume as needed
    this.sound
      .play()
      .catch((error) => console.warn("Explosion sound error:", error));

    this.element.onload = () => {
      setTimeout(() => {
        this.element.remove(); // Remove the explosion after it finishes playing
        if (callback) callback(); // Execute the callback function, if provided
      }, 1150); // Adjust the timeout to match the duration of your GIF
    };
  }
}

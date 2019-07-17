class Meteor function (x, y) {
  constructor(x, y) {
    this.alive = true;// Meteor dies when it goes offscreen.
    this.animation = { }
    this.grounded = false;
    this.height = Math.floor(Math.random() * 16 + 24); this.width = this.height;
    this.x = x; this.y = y - this.height * 0.5;
    let direction = Math.PI * 1.75 + Math.random() * Math.PI * 0.1;// The trajectory.
    this.x_velocity = Math.cos(direction) * 3; this.y_velocity = -Math.sin(direction) * 3;
  }

  update() {

    if (!this.grounded) {

      this.animation.update();
      this.y += this.y_velocity;

    } else {

      this.x_velocity = -game.speed;

    }
    this.x += this.x_velocity;

    this.smoke_count++;
    if (this.smoke_count == this.smoke_delay) {

      this.smoke_count = 0;
      this.smoke = true;

    }

  }
};

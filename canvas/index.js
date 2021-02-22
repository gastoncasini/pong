let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width;
let height;

class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Player extends Rect {
  constructor(x, y, width, height, controls) {
    super(x, y, width, height);
    this.controls = controls;
    console.log(this.y);
  }

  update(progress) {
    if (this.controls.up) {
      this.y -= progress;
    }
    if (this.controls.down) {
      this.y += progress;
    }
    if (this.y > height) {
      this.y = height;
    } else if (this.y < 0) {
      this.y = 0;
    }
  }

  draw() {
    ctx.fillStyle = "#fff";

    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
}

class Ball extends Rect {
  constructor(x, y, width, height, velocity, direction) {
    super(x, y, width, height);
    this.velocity = velocity;
    this.direction = direction;
  }

  update(collisionRight, collisionLeft) {
    if (collisionLeft) {
      this.direction += Math.PI;
    }
    if (collisionRight) {
      this.direction += Math.PI;
    }

    const velX = this.velocity * Math.cos(this.direction);
    const velY = this.velocity * Math.sin(this.direction);

    this.x += velX;
    this.y += velY;

    // this  is where I add colision detection
  }
  draw() {
    ctx.fillStyle = "#fff";

    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
}

let resize = function () {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
};
window.onresize = resize;
resize();

const playerOne = new Player(30, height / 2, 20, 150, {
  up: false,
  down: false,
});
const playerTwo = new Player(width - 30, height / 2, 20, 150, {
  up: false,
  down: false,
});

const ball = new Ball(width / 2, height / 2, 20, 20, 20, Math.PI / 15);

function detectColisions(rect1, rect2) {
  if (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
  ) {
    return true;
  }
  return false;
}

function loop(timestamp) {
  let progress = timestamp - lastRender;

  ctx.clearRect(0, 0, width, height);
  playerOne.update(progress);
  playerOne.draw();
  playerTwo.update(progress);
  playerTwo.draw();

  const collisionRight = detectColisions(ball, playerOne);
  const collisionLeft = detectColisions(ball, playerTwo);

  ball.update(collisionRight, collisionLeft);
  ball.draw();

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}
let lastRender = 0;
window.requestAnimationFrame(loop);

let keyMap = {
  68: { action: "right", player: playerOne },
  65: { action: "left", player: playerOne },
  87: { action: "up", player: playerOne },
  83: { action: "down", player: playerOne },

  37: { action: "left", player: playerTwo },
  38: { action: "up", player: playerTwo },
  39: { action: "right", player: playerTwo },
  40: { action: "down", player: playerTwo },
};
function keydown(event) {
  let { action, player } = keyMap[event.keyCode];

  player.controls[action] = true;
}
function keyup(event) {
  let { action, player } = keyMap[event.keyCode];
  player.controls[action] = false;
}

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);

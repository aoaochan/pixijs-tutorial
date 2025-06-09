import { Application, Assets, Container, DisplacementFilter, Sprite, Texture, Ticker, TilingSprite } from "pixi.js";

type Fish = {
  sprite: Sprite,
  direction: number,
  speed: number,
  turnSpeed: number
}

const app = new Application();

let fishes: Fish[] = [];
let overlay: TilingSprite;

async function setup() {
  await app.init({ background: "#1099bb", resizeTo: window });
  app.canvas.style.position = 'absolute';
  document.body.appendChild(app.canvas);
}

async function preload() {
  const assets = [
      { alias: 'background', src: 'https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg' },
      { alias: 'fish1', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish1.png' },
      { alias: 'fish2', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish2.png' },
      { alias: 'fish3', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish3.png' },
      { alias: 'fish4', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish4.png' },
      { alias: 'fish5', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish5.png' },
      { alias: 'overlay', src: 'https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png' },
      { alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
  ];
  await Assets.load(assets);
}

function addBackground() {
  const bg = Sprite.from("background");

  bg.anchor.set(0.5);

  if (app.screen.width > app.screen.height) {
    bg.width = app.screen.width * 1.2;
    bg.scale.y = bg.scale.x;
  } else {
    bg.height = app.screen.height * 1.2;
    bg.scale.x = bg.scale.y;
  }

  bg.x = app.screen.width / 2;
  bg.y = app.screen.height / 2;

  app.stage.addChild(bg);
}

function addFish(sprite: Sprite, direction: number, speed: number, turnSpeed: number, container: Container): Fish {
  sprite.x = Math.random() * app.screen.width;
  sprite.y = Math.random() * app.screen.height;
  
  sprite.scale.set(0.5 + Math.random() * 0.2);

  container.addChild(sprite);

  return { sprite, direction, speed, turnSpeed }
}

function addFishes() {
  const fishContainer = new Container();

  app.stage.addChild(fishContainer);

  const fishCount = 20;
  const fishAssets = ['fish1', 'fish2', 'fish3', 'fish4', 'fish5'];

  fishes = Array.from({ length: fishCount }, (_: unknown, i: number) => i).map((i: number) => addFish(
    Sprite.from(fishAssets[i % fishAssets.length]), 
    Math.random() * Math.PI * 2,
    Math.random() * 2,
    Math.random() - 0.8,
    fishContainer
  ));
}

function addWaterOverlay() {
  const texture = Texture.from("overlay");

  overlay = new TilingSprite({
    texture,
    width: app.screen.width,
    height: app.screen.height
  });

  app.stage.addChild(overlay);
}

function animateFishes() {
  const stagePadding = 100;
  const boundWidth = app.screen.width + stagePadding * 2;
  const boundHeight = app.screen.height + stagePadding * 2;

  fishes.forEach((v: Fish) => {
    const { sprite: fish, direction, speed, turnSpeed } = v;

    const deg = direction + turnSpeed * 0.01;
    
    fish.x += Math.sin(deg) * speed;
    fish.y += Math.cos(deg) * speed;
    fish.rotation = -direction - Math.PI / 2;

    if (fish.x < -stagePadding) fish.x += boundWidth;
    if (fish.x > app.screen.width + stagePadding) fish.x -= boundWidth;
    if (fish.y < -stagePadding) fish.y += boundHeight;
    if (fish.y > app.screen.height + stagePadding) fish.y -= boundHeight;
  });
}

function animateWaterOverlay(time: Ticker) {
  const delta = time.deltaTime;

  overlay.tilePosition.x -= delta;
  overlay.tilePosition.y -= delta;
}

function addDisplacementEffect() {
  const sprite = Sprite.from("displacement");

  sprite.texture.baseTexture.wrapMode = "repeat";

  const filter = new DisplacementFilter({ sprite, scale: 50 });

  app.stage.filters = [filter];
}

(async () => {
  await setup();
  await preload();

  addBackground();
  addFishes();
  addWaterOverlay();

  app.ticker.add(animateFishes);
  app.ticker.add(animateWaterOverlay);

  addDisplacementEffect();
})();
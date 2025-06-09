import { Application, Assets, Sprite } from "pixi.js";

const app = new Application();

const textureBunny = await Assets.load("https://pixijs.com/assets/bunny.png");

(async () => {
  await app.init({ background: "#1099bb", resizeTo: window });
  app.canvas.style.position = 'absolute';
  document.body.appendChild(app.canvas);

  const spriteBunny = new Sprite(textureBunny);
  spriteBunny.anchor.set(0.5);

  app.stage.addChild(spriteBunny);

  spriteBunny.x = app.screen.width / 2;
  spriteBunny.y = app.screen.height / 2;

  app.ticker.add((time) => spriteBunny.rotation += 0.1 * time.deltaTime);
})();
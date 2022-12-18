"use strict";

const WIDTH = 1024;
const HEIGHT = 768;

const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const lightMap = new LightMap();
//const tileManager = new TileManager();



//Downloads here
ASSET_MANAGER.queueDownload("../sprites/blondie_spritesheet.png")
ASSET_MANAGER.queueDownload("../sprites/grass.png")

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});

gameEngine.addEntity(lightMap);

let player = new Player(gameEngine, WIDTH/2-52/2, HEIGHT/2-72/2,
	ASSET_MANAGER.getAsset("../sprites/blondie_spritesheet.png"));

gameEngine.addEntity(player);

lightMap.addLightSource(new LightSource(.7, 100, 100, null, new RGBColor(255, 199, 57)));
lightMap.addLightSource(new LightSource(.5, 400, 100, null));
lightMap.addLightSource(new LightSource(.4, 600, 100, null, new RGBColor(0, 97, 255), 50));
lightMap.addLightSource(new LightSource(.2, 800, 100, null));
lightMap.addLightSource(new LightSource(.7, 100, 400, null));

lightMap.addLightSource(new LightSource(.8, 0, 0, player, new RGBColor(252, 204, 67)));

for(let i = 0; i < 9; i++) {
	for(let j = 0; j < 7; j++) {
		gameEngine.addEntity(new Tile(gameEngine, i, j, ASSET_MANAGER.getAsset("../sprites/grass.png")));
	}
}

const sliderChange = () => {
	const rangeInput = document.getElementById("light-slider");
	lightMap.alpha = 1 - rangeInput.value / 100;
}


document.getElementById("light-slider").value = `${100 - lightMap.alpha * 100}`;





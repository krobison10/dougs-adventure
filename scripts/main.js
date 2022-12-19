"use strict";

const WIDTH = 1024;
const HEIGHT = 768;

const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const lightMap = new LightMap();


//Downloads here
ASSET_MANAGER.queueDownload("../sprites/blondie_spritesheet.png");
ASSET_MANAGER.queueDownload("../sprites/grass.png");
ASSET_MANAGER.queueDownload("../sprites/sand.jpg");

ASSET_MANAGER.downloadAll(() => {
	new BackgroundManager().addBackgroundTiles();

	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});

let player = new Player(gameEngine, 0, 0, ASSET_MANAGER.getAsset("../sprites/blondie_spritesheet.png"));

lightMap.addLightSource(new LightSource(.7, 100, 100, null, new RGBColor(255, 199, 57)));
lightMap.addLightSource(new LightSource(.5, 400, 100, null));
lightMap.addLightSource(new LightSource(.4, 600, 100, null, new RGBColor(0, 97, 255), 50));
lightMap.addLightSource(new LightSource(.2, 800, 100, null));
lightMap.addLightSource(new LightSource(.7, 100, 400, null));

lightMap.addLightSource(new LightSource(.7, 0, 0, player, new RGBColor(252, 204, 67)));


gameEngine.addEntity(lightMap, Layers.LIGHTMAP);
gameEngine.addEntity(player);


const sliderChange = () => {
	const rangeInput = document.getElementById("light-slider");
	lightMap.alpha = 1 - rangeInput.value / 100;
}

document.getElementById("light-slider").value = `${100 - lightMap.alpha * 100}`;





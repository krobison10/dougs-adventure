"use strict";
const TILE_SIZE = 120;
const WIDTH = 1024;
const HEIGHT = 768;

const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const lightMap = new LightMap();


//Downloads here
ASSET_MANAGER.queueDownload("../sprites/blondie_spritesheet.png");
ASSET_MANAGER.queueDownload("../sprites/grass.png");
ASSET_MANAGER.queueDownload("../sprites/sand.jpg");
ASSET_MANAGER.queueDownload("../sprites/crystal.png");

ASSET_MANAGER.downloadAll(() => {
	new BackgroundManager().addBackgroundTiles();

	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});

let player = new Player({x: 0, y: 0}, ASSET_MANAGER.getAsset("../sprites/blondie_spritesheet.png"), {w:52, h:72});

lightMap.addLightSource(new LightSource(.7, {x:100, y:100}, null, new RGBColor(255, 199, 57)));
lightMap.addLightSource(new LightSource(.5, {x:400, y:100}));
lightMap.addLightSource(new LightSource(.4, {x:600, y:100}, null, new RGBColor(0, 97, 255), 50));
lightMap.addLightSource(new LightSource(.2, {x:800, y:100}));
lightMap.addLightSource(new LightSource(.7, {x:100, y:400}));

lightMap.addLightSource(new LightSource(.7, {x:0, y:0}, player, new RGBColor(252, 204, 67)));


gameEngine.addEntity(lightMap, Layers.LIGHTMAP);

gameEngine.addEntity(player);


let lightSource = new LightSource(.8, {x:200, y:-200}, null, new RGBColor(141, 43, 227));
let crystal = new Item({x:200, y:-200},
	ASSET_MANAGER.getAsset("../sprites/crystal.png"), {w: 81, h: 73}, lightSource);
gameEngine.addEntity(crystal);


const sliderChange = () => {
	const rangeInput = document.getElementById("light-slider");
	lightMap.alpha = 1 - rangeInput.value / 100;
}

document.getElementById("light-slider").value = `${100 - lightMap.alpha * 100}`;


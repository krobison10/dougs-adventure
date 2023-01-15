"use strict";
const TILE_SIZE = 32;
const WIDTH = 1024;
const HEIGHT = 768;

const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const lightMap = new LightMap();


//Downloads here
ASSET_MANAGER.queueDownload("../sprites/blondie_spritesheet.png");
ASSET_MANAGER.queueDownload("../sprites/crystal.png");
ASSET_MANAGER.queueDownload("../sprites/tilemaps_forest01.png");
ASSET_MANAGER.queueDownload("../sprites/tree_01.png");

ASSET_MANAGER.queueDownload("../sprites/tiles.png");

ASSET_MANAGER.downloadAll(() => {
	new BackgroundManager().addBackgroundTiles();

	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});

let player = new Player(new Vec2(0, 0), ASSET_MANAGER.getAsset("../sprites/blondie_spritesheet.png"),
	new Dimension(52, 72));
lightMap.addLightSource(new LightSource(.7, {x:0, y:0},
	player, new RGBColor(252, 204, 67)));

let testLight = new LightSource(.6, {x:300, y:300},
	null, new RGBColor(252, 204, 67));

gameEngine.addEntity(new Obstacle(new Vec2(100, 100), new Dimension(120 / 2, 168 / 2),
	ASSET_MANAGER.getAsset("../sprites/tree_01.png"), true, new Vec2(0, 0), new Dimension(120, 168)));


//Light sources must be added to the lightmap
lightMap.addLightSource(testLight);

//lightmap is its own entity that gets added to the entities
gameEngine.addEntity(lightMap, Layers.LIGHTMAP);

//Entities exist in layers in the engine, the layers are enumerated in a Layers object that can be found in util.js
gameEngine.addEntity(player);




// For the slider that controls the amount of daylight
const sliderChange = () => {
	const rangeInput = document.getElementById("light-slider");
	lightMap.alpha = 1 - rangeInput.value / 100;
}
document.getElementById("light-slider").value = `${100 - lightMap.alpha * 100}`;


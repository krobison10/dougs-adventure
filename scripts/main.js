"use strict";

const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

const lightMap = new LightMap();

//Downloads here
ASSET_MANAGER.queueDownload("../sprites/blondie_spritesheet.png")
ASSET_MANAGER.queueDownload("../sprites/grass.png")
ASSET_MANAGER.queueDownload('http://i.imgur.com/fWThnZy.png');

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});

gameEngine.addEntity(lightMap);

let player = new Player(gameEngine, 1024/2-52/2, 768/2-72/2,
	ASSET_MANAGER.getAsset("../sprites/blondie_spritesheet.png"));

gameEngine.addEntity(player);

lightMap.addLightSource(new LightSource(200, 100, 100, null));
lightMap.addLightSource(new LightSource(100, 0, 0, player));

for(let i = 0; i < 9; i++) {
	for(let j = 0; j < 7; j++) {
		gameEngine.addEntity(new Tile(gameEngine, i, j, ASSET_MANAGER.getAsset("../sprites/grass.png")));
	}
}






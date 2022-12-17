"use strict";

const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

//Downloads here
ASSET_MANAGER.queueDownload("../sprites/blondie_spritesheet.png")
ASSET_MANAGER.queueDownload("../sprites/grass.png")

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});

gameEngine.addEntity(new Player(gameEngine, 1024/2-52/2, 768/2-72/2,
	ASSET_MANAGER.getAsset("../sprites/blondie_spritesheet.png")));

for(let i = 0; i < 9; i++) {
	for(let j = 0; j < 7; j++) {
		gameEngine.addEntity(new Tile(gameEngine, i, j, ASSET_MANAGER.getAsset("../sprites/grass.png")));
	}
}






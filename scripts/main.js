"use strict";

const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

//Downloads here
ASSET_MANAGER.queueDownload("../sprites/blondie_spritesheet.png")

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});

gameEngine.addEntity(new Player(gameEngine, 0, 768/2-72/2,
	ASSET_MANAGER.getAsset("../sprites/blondie_spritesheet.png")));


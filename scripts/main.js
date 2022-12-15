"use strict";

const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

//Downloads here
ASSET_MANAGER.queueDownload("../sprites/wall.png")

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	gameEngine.start();
});

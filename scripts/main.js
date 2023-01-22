"use strict";
const TILE_SIZE = 32;
const WIDTH = 1024;
const HEIGHT = 768;
let boundingBoxes = false;

const dontDrawDistance = 1000;
const dontUpdateDistance = 2000;

const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const lightMap = new LightMap();


//Downloads here
ASSET_MANAGER.queueDownload("../sprites/blondie_spritesheet.png");
ASSET_MANAGER.queueDownload("../sprites/tree_00.png");
ASSET_MANAGER.queueDownload("../sprites/grass_1.png");
ASSET_MANAGER.queueDownload("../sprites/firepit.png");
ASSET_MANAGER.queueDownload("../sprites/tiles.png");
ASSET_MANAGER.queueDownload("../sprites/heart.png");
ASSET_MANAGER.queueDownload("../sprites/star.png");
ASSET_MANAGER.queueDownload("../sprites/items.png");
ASSET_MANAGER.queueDownload("../sprites/fires/torch_stem.png")
ASSET_MANAGER.queueDownload("../sprites/fires/orange/loops/burning_loop_1.png");
ASSET_MANAGER.queueDownload("../sprites/fires/orange/loops/burning_loop_3.png");

ASSET_MANAGER.downloadAll(() => {
	new BackgroundManager().addBackgroundTiles();

	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});

let doug = new Doug(new Vec2(0, 0), ASSET_MANAGER.getAsset("../sprites/blondie_spritesheet.png"),
 	new Dimension(52, 72), new Padding(36, 12, 8, 12));
lightMap.addLightSource(new FlickeringLightSource(.6, new Vec2(0, 0),
	doug, new RGBColor(252, 204, 67)));

makeTree(new Vec2(3, 8));
makeTree(new Vec2(21, -3));
makeTree(new Vec2(20, -12));
makeTree(new Vec2(-13, -16));
makeTree(new Vec2(-19, -1));
makeTree(new Vec2(11, -7));
makeTree(new Vec2(-12, 11));
makeTree(new Vec2(5, -11));
makeTree(new Vec2(-13, -5));
makeTree(new Vec2(18, 3));
makeTree(new Vec2(13, 11));
makeTree(new Vec2(6, 10));
makeTree(new Vec2(4, 1));
makeTree(new Vec2(5, 15));
makeTree(new Vec2(10, 6));
makeTree(new Vec2(-1, -6));
makeTree(new Vec2(-10, 2));


const fire = new CampFire(new Vec2(13 * TILE_SIZE, TILE_SIZE));


placeTorches();

gameEngine.addEntity(fire);

const hotbar = new Hotbar();
gameEngine.addEntity(hotbar, Layers.UI);
gameEngine.addEntity(new Health(), Layers.UI);
gameEngine.addEntity(new Mana(), Layers.UI);
const clock = new UIText(new Vec2(WIDTH - 300, 90), "Time: ", 20);
clock.updateFn = () => {
	const gameTime = Math.round(lightMap.gameTime);
	let hour = Math.floor((gameTime + 60) / 60);
	let ext = 'AM';
	if (hour > 12) {
		hour -= 12
	}
	if(gameTime >= 660 && gameTime < 23*60) {
		ext = 'PM';
	}
	let minute = gameTime % 60;
	if(minute < 10) {
		minute = `0${minute}`;
	}
	clock.content = `${hour}:${minute} ${ext}`;
}
gameEngine.addEntity(clock, Layers.UI);




//Light sources must be added to the lightmap
//ex. lightMap.addLightSource(new LightSource());

//lightmap is its own entity that gets added to the entities
gameEngine.addEntity(lightMap, Layers.LIGHTMAP);

//Entities exist in layers in the engine, the layers are enumerated in a Layers object that can be found in util.js
gameEngine.addEntity(doug);




function placeTorches() {
	for(let y = 45; y >= -45; y -= 6) {
		gameEngine.addEntity(new Torch(new Vec2(-6.5 * TILE_SIZE, y * TILE_SIZE)));
		gameEngine.addEntity(new Torch(new Vec2(-1.5 * TILE_SIZE, (y - 3) * TILE_SIZE)));
	}
}

function makeTree(pos) {
	let tree1 = new Obstacle(
		new Vec2(pos.x * TILE_SIZE, pos.y * TILE_SIZE),
		new Dimension(467/5, 627/5),
		ASSET_MANAGER.getAsset("../sprites/tree_00.png"),
		true,
		null,
		new Vec2(0, 0),
		new Dimension(467, 627)
	);
	tree1.boundingBox = Character.createBB(tree1.pos, tree1.size, new Padding(50, 20, 0 ,20));

	gameEngine.addEntity(tree1);
}

//Handles a click on the collision boxes checkbox
const toggleBoxes = () => {
	const box = document.getElementById("toggle-boxes");
	boundingBoxes = box.checked;
}

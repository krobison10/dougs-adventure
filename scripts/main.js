'use strict'

const TILE_SIZE = 32;
const WIDTH = 1024;
const HEIGHT = 768;
let boundingBoxes = false;

const dontDrawDistance = 1000;
const dontUpdateDistance = 3000;
const dontCheckCollideDistance = 800;

let debug = false;
let showFPS = false;

let gameTime = 11 * 60; //12:00 pm

const music = new MusicManager();
const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const lightingSystem = new Lighting();
const log = new MessageLog();

setDebug();

//Add paths of assets to be downloaded here
declareAssets([
	"sprites/blondie_spritesheet.png",
	"sprites/dragon2.png",
	"sprites/demon.png",
	"sprites/bat_spritesheet.png",
	"sprites/wolf_spritesheet.png",
	"sprites/slime01.png",
	"sprites/tree_00.png",
	"sprites/grass_1.png",
	"sprites/tall_grass.png",
	"sprites/flower_1.png",
	"sprites/flower_2.png",
	"sprites/firepit.png",
	"sprites/tiles.png",
	"sprites/heart.png",
	"sprites/star.png",
	"sprites/items.png",
	"sprites/bear.png",
	"sprites/fires/torch_stem.png",
	"sprites/sword.png",
	"sprites/bow.png",
	"sprites/arrow.png",
	"sprites/Water_Sphere.png",
	"sprites/FireSphere.png",
	"sprites/tome_1.png",
	"sprites/arrow_flaming.png",
	"sprites/fires/orange/loops/burning_loop_1.png",
	"sprites/fires/orange/loops/burning_loop_3.png",
	"sprites/potion_delay.png",
	"sprites/rock_small.png",
	"sprites/rock_large_1.png",
	"sprites/rock_large_2.png",
	"sprites/bunny.png",

	"sounds/grab.wav",
	"sounds/swing_2.wav",
	"sounds/bow.wav",
	"sounds/Player_Hit_0.wav",
	"sounds/Player_Hit_1.wav",
	"sounds/Player_Hit_2.wav",
	"sounds/Player_Killed.wav",
	"sounds/Hit_1.wav",
	"sounds/std_kill.wav",
	"sounds/bat_kill.wav",
	"sounds/slime_kill.wav",
	"sounds/MaxMana.wav",
	"sounds/mana_bolt.wav",
	"sounds/projectile_impact.wav",
	"sounds/arrow_impact.wav",
	"sounds/drink.wav",
	"sounds/dragon_attack.wav",
	"sounds/dragon_kill.wav",
	"sounds/bear_kill.wav",
	"sounds/wolf_hit.wav",
	"sounds/wolf_kill.wav",
	"sounds/upgrade.wav",


	"sounds/Menu_Tick.wav",
	"sounds/day_music.mp3",
	"sounds/night_music.mp3",


]);

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
	ASSET_MANAGER.setVolume(0.5);
	music.setTracks();
});



//------ Build Game ------//

const spawnPoint = new Vec2(300, 0)
const doug = new Doug(new Vec2(spawnPoint.x, spawnPoint.y), ASSET_MANAGER.getAsset("sprites/blondie_spritesheet.png"),
 	new Dimension(52, 72));
lightingSystem.addLightSource(new FlickeringLightSource(.6, new Vec2(0, 0),
	doug, new RGBColor(252, 204, 67)));


//Dragon arena is at x=7000 y = -8000, and is 1000 x 1000, move doug's spawn there for easy testing
const dragon = new Dragon(new Vec2(7100, -7900), ASSET_MANAGER.getAsset("sprites/dragon2.png"),
	new Dimension(96, 96), new Padding(20,0,20,0), 10, 2000);

//Demon arena is at x=-8000 y = 7000, and is 1000 x 1000, move doug's spawn there for easy testing
const demon = new Demon(new Vec2(-8000 , 7000), ASSET_MANAGER.getAsset("sprites/demon.png"),
	new Dimension(97, 72), new Padding(20,60,30,60), 10, 5000);


let hotbar;
buildWorld();
buildUI();

gameEngine.addEntity(lightingSystem, Layers.LIGHTMAP);
gameEngine.addEntity(doug);
gameEngine.addEntity(dragon);
gameEngine.addEntity(demon);

const spawner = new SpawnManager();
gameEngine.addToUpdateList(spawner);



//------ Functions ------//

function buildWorld() {
	//Background tiles, border walls and border trees
	new MapBuilder().build();

	//Torch line along path
	placeTorches();

	//Cute campfire
	removeNatureFromArea(new BoundingBox(new Vec2( 550, -50), new Dimension(150, 150)));
	const fire = new CampFire(new Vec2(600, 0));
	gameEngine.addEntity(fire);
}

function buildUI() {
	hotbar = new Hotbar();
	gameEngine.addEntity(hotbar, Layers.UI);
	gameEngine.addEntity(new Health(), Layers.UI);
	gameEngine.addEntity(new Mana(), Layers.UI);

	const clock = new UIText(new Vec2(WIDTH - 300, 90), "Time: ", 20);
	clock.updateFn = () => {
		const time = Math.round(gameTime);
		let hour = Math.floor((time + 60) / 60);
		let ext = 'AM';
		if (hour > 12) {
			hour -= 12
		}
		if(time >= 660 && time < 23*60) {
			ext = 'PM';
		}
		let minute = time % 60;
		if(minute < 10) {
			minute = `0${minute}`;
		}
		clock.content = `${hour}:${minute} ${ext}`;
	}
	gameEngine.addEntity(clock, Layers.UI);

	const fpsCounter = new UIText(new Vec2(WIDTH - 300, 120), "", 20);
	fpsCounter.updateFn = () => {
		if(showFPS || debug) {
			fpsCounter.content = `FPS: ${gameEngine.fps}`
		} else {
			fpsCounter.content = "";
		}
	};
	gameEngine.addEntity(fpsCounter, Layers.UI);
}

function placeTorches() {
	for(let y = 300; y >= -300; y -= 6) {
		gameEngine.addEntity(new Torch(new Vec2(-6.5 * TILE_SIZE, y * TILE_SIZE)));
		gameEngine.addEntity(new Torch(new Vec2(-1.5 * TILE_SIZE, (y - 3) * TILE_SIZE)));
	}
}

function declareAssets(paths) {
	for(let path of paths) {
		ASSET_MANAGER.queueDownload(path);
	}
}

const toggleBoxes = () => {
	const box = document.getElementById("toggle-boxes");
	boundingBoxes = box.checked;
}

const toggleMute = () => {
	const box = document.getElementById("mute")
	if(box.checked) {
		ASSET_MANAGER.setVolume(0)
	} else {
		ASSET_MANAGER.setVolume(1)
	}
}

window.onbeforeunload = function() {
	return "Data will be lost if you leave the page, are you sure?";
};

window.addEventListener("keypress", e => {
	if(e.key === "d" && e.ctrlKey) {
		debug = !debug;
		setDebug();
	}
})

window.addEventListener("keypress", e => {
	if(e.key === "f" && e.ctrlKey) {
		showFPS = !showFPS;
		setDebug();
	}
})

function setDebug() {
	if(!debug) {
		for (let e of document.querySelectorAll(".debug")) {
			e.style = "display: none";
		}

		boundingBoxes = false;
		const box = document.getElementById("toggle-boxes");
		box.checked = false;
	}
	else {
		for (let e of document.querySelectorAll(".debug")) {
			e.style = "display: inline-block";
		}
	}
}
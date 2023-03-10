"use strict";

/**
 * Builds the map
 *
 * @author Kyler Robison
 */
class MapBuilder {

    static width = 150;
    static height = 150;
    static removeOnClear = new Set();

    constructor() {
        this.tilemap = ASSET_MANAGER.getAsset("sprites/tiles.png");
    }

    /**
     * Adds all the background tiles as entities to the background layer of the game engine.
     */
    build() {
        
        placeRandomVegetation();
        this.placePath();
        this.placeGrassTiles();
        placeBorderWalls();

        //Clear area for bosses
        //Dragon
        removeNatureFromArea(new BoundingBox(new Vec2(7000, -8000), new Dimension(1000, 1000)), false);

        //Demon
        removeNatureFromArea(new BoundingBox(new Vec2(-8000, 7000), new Dimension(1000, 1000)), false);


        //remove nature from spawn area
        let bb = new BoundingBox(
            new Vec2(-10 * TILE_SIZE, -10 * TILE_SIZE),
            new Dimension(30 * TILE_SIZE, 20 * TILE_SIZE));
        removeNatureFromArea(bb, false);
    }

    placePath() {
        //Entities for the path
        removeNatureFromArea(new BoundingBox(
            new Vec2(-7 * TILE_SIZE, -300 * TILE_SIZE),
            new Dimension(7 * TILE_SIZE, 600 * TILE_SIZE)));

        for(let i = -300; i < 300; i++) {
            gameEngine.addEntity(new BackgroundTile(new Vec2(-5, i),
                new Dimension(16, 16),
                this.tilemap, new Vec2(0, 1)),  Layers.BACKGROUND);
            gameEngine.addEntity(new BackgroundTile(new Vec2(-4, i),
                new Dimension(16, 16),
                this.tilemap, new Vec2(1, 1)),  Layers.BACKGROUND);
            gameEngine.addEntity(new BackgroundTile(new Vec2(-3, i),
                new Dimension(16, 16),
                this.tilemap, new Vec2(2, 1)),  Layers.BACKGROUND);
        }
    }

    placeGrassTiles() {
        //Entities for the grass tiles
        for(let row = 0; row < MapBuilder.height; row++) {
            for(let col = 0; col < MapBuilder.width; col++) {
                gameEngine.addEntity(new GrassTile({x: col-MapBuilder.height/2, y: row-MapBuilder.height/2},
                    new Dimension(128, 128)), Layers.BACKGROUND);
            }
        }
    }
}

class GrassTile extends Entity {
    constructor(pos, size) {
        super(pos, size);
        this.sprite = ASSET_MANAGER.getAsset("sprites/grass_1.png")
        this.pos.x *= 127;
        this.pos.y *= 127;
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, 0, 0, 128, 128, this.getScreenPos().x, this.getScreenPos().y, 128, 128);
    }
}

function placeRandomVegetation() {
    const numTrees = 3500;
    const numGrass = 14000;
    const numFlower1 = 2000;
    const numFlower2 = 2000;
    const numSmallRock = 4000;
    const numLargeRock1 = 200;
    const numLargeRock2 = 100;

    const obstacles = [];

    const grassTileSize = 4;
    let rightBound = (MapBuilder.width * grassTileSize / 2) * TILE_SIZE;
    const leftBound = -rightBound;
    rightBound -= 50;
    let bottomBound = (MapBuilder.height * grassTileSize / 2) * TILE_SIZE;
    const topBound = -bottomBound;
    bottomBound -= 100;

    for(let i = 0; i < numTrees; i++) {
        let newTree;
        let valid = false;
        do {
            //Create potential tree
            let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
            let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
            newTree = {
                type: "tree",
                box: new BoundingBox(new Vec2(x, y), new Dimension(467 / 5, 627 / 5)),
                remove: false
            }

            valid = true;
            //check among others
            for(let obstacle of obstacles) {
                if(newTree.box.collide(obstacle.box)) {
                    valid = false;
                }
            }
        } while(!valid)
        obstacles.push(newTree);
    }


    for(let i = 0; i < numGrass; i++) {
        let newGrass;
        let valid = false;
        do {
            //Create potential grass
            let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
            let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
            newGrass = {
                type: "grass",
                box: new BoundingBox(new Vec2(x, y), new Dimension(31, 32)),
                remove: false
            }

            valid = true;
            for(let obstacle of obstacles) {
                if(newGrass.box.collide(obstacle.box)) {
                    valid = false;
                }
            }

        } while(!valid)
        obstacles.push(newGrass);
    }

    for(let i = 0; i < numFlower1; i++) {
        let newFlower;
        let valid = false;
        do {
            //Create potential flower
            let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
            let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
            newFlower = {
                type: "flower1",
                box: new BoundingBox(new Vec2(x, y), new Dimension(12, 32)),
                remove: false
            }

            valid = true;
            for(let obstacle of obstacles) {
                if(newFlower.box.collide(obstacle.box)) {
                    valid = false;
                }
            }

        } while(!valid)
        obstacles.push(newFlower);
    }

    for(let i = 0; i < numFlower2; i++) {
        let newFlower;
        let valid = false;
        do {
            //Create potential grass
            let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
            let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
            newFlower = {
                type: "flower2",
                box: new BoundingBox(new Vec2(x, y), new Dimension(16, 30)),
                remove: false
            }

            valid = true;
            for(let obstacle of obstacles) {
                if(newFlower.box.collide(obstacle.box)) {
                    valid = false;
                }
            }

        } while(!valid)
        obstacles.push(newFlower);
    }

    for(let i = 0; i < numSmallRock; i++) {
        let newRock;
        let valid = false;
        do {
            //Create potential rock
            let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
            let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
            newRock = {
                type: "small_rock",
                box: new BoundingBox(new Vec2(x, y), new Dimension(22, 12)),
                remove: false
            }

            valid = true;
            for(let obstacle of obstacles) {
                if(newRock.box.collide(obstacle.box)) {
                    valid = false;
                }
            }

        } while(!valid)
        obstacles.push(newRock);
    }

    for(let i = 0; i < numLargeRock1; i++) {
        let newRock;
        let valid = false;
        do {
            //Create potential tree
            let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
            let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
            newRock = {
                type: "large_rock_1",
                box: new BoundingBox(new Vec2(x, y), new Dimension(177, 111)),
                remove: false
            }

            valid = true;
            //check among others
            for(let obstacle of obstacles) {
                if(newRock.box.collide(obstacle.box)) {
                    valid = false;
                }
            }
        } while(!valid)
        obstacles.push(newRock);
    }
    for(let i = 0; i < numLargeRock2; i++) {
        let newRock;
        let valid = false;
        do {
            //Create potential tree
            let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
            let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
            newRock = {
                type: "large_rock_2",
                box: new BoundingBox(new Vec2(x, y), new Dimension(189, 120)),
                remove: false
            }

            valid = true;
            //check among others
            for(let obstacle of obstacles) {
                if(newRock.box.collide(obstacle.box)) {
                    valid = false;
                }
            }
        } while(!valid)
        obstacles.push(newRock);
    }

    for(let obstacle of obstacles) {
        if(obstacle.type === "tree") {
            const realTree = new Obstacle(
                obstacle.box.pos,
                new Dimension(467/5, 627/5),
                ASSET_MANAGER.getAsset("sprites/tree_00.png"),
                true,
                null,
                new Vec2(0, 0),
                new Dimension(467, 627)
            );
            realTree.boundingBox =
                Character.createBB(realTree.pos, realTree.size, new Padding(36, 20, 0 ,20));
            realTree.footPrint = realTree.boundingBox;
            gameEngine.addEntity(realTree);
        }
        else if(obstacle.type === "grass") {
            const realGrass = new Obstacle(
                obstacle.box.pos,
                new Dimension(31, 32),
                ASSET_MANAGER.getAsset("sprites/tall_grass.png"),
                false,
                null,
                new Vec2(0, 0),
                new Dimension(31, 32)
            )
            realGrass.footPrint = new BoundingBox(realGrass.pos, realGrass.size);

            gameEngine.addEntity(realGrass, Layers.BACKGROUND);
        }
        else if(obstacle.type === "flower1") {
            const realFlower = new Obstacle(
                obstacle.box.pos,
                new Dimension(12, 32),
                ASSET_MANAGER.getAsset("sprites/flower_1.png"),
                false,
                null,
                new Vec2(0, 0),
                new Dimension(12, 32)
            )
            realFlower.footPrint = new BoundingBox(realFlower.pos, realFlower.size);

            gameEngine.addEntity(realFlower, Layers.BACKGROUND);
        }
        else if(obstacle.type === "flower2") {
            const realFlower = new Obstacle(
                obstacle.box.pos,
                new Dimension(16, 30),
                ASSET_MANAGER.getAsset("sprites/flower_2.png"),
                false,
                null,
                new Vec2(0, 0),
                new Dimension(16, 30)
            )
            realFlower.footPrint = new BoundingBox(realFlower.pos, realFlower.size);

            gameEngine.addEntity(realFlower, Layers.BACKGROUND);
        }
        else if(obstacle.type === "small_rock") {
            const realRock = new Obstacle(
                obstacle.box.pos,
                new Dimension(22, 12),
                ASSET_MANAGER.getAsset("sprites/rock_small.png"),
                false,
                null,
                new Vec2(0, 0),
                new Dimension(22, 12)
            )
            realRock.footPrint = new BoundingBox(realRock.pos, realRock.size);

            gameEngine.addEntity(realRock, Layers.BACKGROUND);
        }
        if(obstacle.type === "large_rock_1") {
            const realRock = new Obstacle(
                obstacle.box.pos,
                new Dimension(177, 111),
                ASSET_MANAGER.getAsset("sprites/rock_large_1.png"),
                true,
                null,
                new Vec2(0, 0),
                new Dimension(177, 111)
            );
            realRock.boundingBox =
                Character.createBB(realRock.pos, realRock.size, new Padding(36, 30, 0, 20));
            realRock.footPrint = realRock.boundingBox;
            gameEngine.addEntity(realRock);
        }
        if(obstacle.type === "large_rock_2") {
            const realRock = new Obstacle(
                obstacle.box.pos,
                new Dimension(189, 120),
                ASSET_MANAGER.getAsset("sprites/rock_large_2.png"),
                true,
                null,
                new Vec2(0, 0),
                new Dimension(189, 120)
            );
            realRock.boundingBox =
                Character.createBB(realRock.pos, realRock.size, new Padding(36, 10, 0, 20));
            realRock.footPrint = realRock.boundingBox;
            gameEngine.addEntity(realRock);
        }
    }

    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/tree_00.png"));
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/tall_grass.png"));
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/flower_1.png"));
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/flower_2.png"));
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/flower_2.png"));
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/rock_small.png"));
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/rock_large_1.png"));
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/rock_large_2.png"));
}

/**
 * Removes obstacles from an area.
 * @param boundingBox the bounding box that defines the area.
 * @param hard if true removes all, even non collidable. If false, removes collidable only.
 */
function removeNatureFromArea(boundingBox, hard = true) {

    for(let entity of gameEngine.entities[Layers.FOREGROUND]) {
        if(MapBuilder.removeOnClear.has(entity.spritesheet)) {
            if(boundingBox.collide(entity.footPrint) && (hard || entity.boundingBox)) {
                entity.removeFromWorld = true;
            }
        }
    }
    if(hard) {
        for(let entity of gameEngine.entities[Layers.BACKGROUND]) {
            if(MapBuilder.removeOnClear.has(entity.spritesheet)) {
                if(boundingBox.collide(entity.footPrint)) {
                    entity.removeFromWorld = true;
                }
            }
        }
    }
}

function placeBorderWalls() {
    //Distance to place border wall from edge in terms of tiles
    const edgeBuffer = 20;
    const segmentSize = 12;
    const grassTileSize = 4;
    const rightEdgeCoord = MapBuilder.width * grassTileSize / 2;
    const leftEdgeCoord = -rightEdgeCoord;
    const bottomEdgeCoord = MapBuilder.height * grassTileSize / 2;
    const topEdgeCoord = -bottomEdgeCoord;

    //left and right walls
    for(let i = topEdgeCoord + edgeBuffer; i < bottomEdgeCoord - edgeBuffer; i += segmentSize) {
        gameEngine.addEntity(new InvisibleBorder(
            new Vec2(leftEdgeCoord + edgeBuffer, i), new Dimension(1, segmentSize)));
        gameEngine.addEntity(new InvisibleBorder(
            new Vec2(rightEdgeCoord - edgeBuffer, i), new Dimension(1, segmentSize)));
    }

    //top and bottom walls
    for(let i = leftEdgeCoord + edgeBuffer; i < rightEdgeCoord - edgeBuffer; i += segmentSize) {
        gameEngine.addEntity(new InvisibleBorder(
            new Vec2(i, topEdgeCoord + edgeBuffer), new Dimension(segmentSize, 1)));
        gameEngine.addEntity(new InvisibleBorder(
            new Vec2(i, bottomEdgeCoord - edgeBuffer), new Dimension(segmentSize, 1)));
    }
}

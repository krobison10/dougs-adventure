"use strict";

/**
 * Needs serious updating, like seriously
 */
class MapBuilder {
    /*Could be 150, will start will 100 * 128 makes for 12800 px wide map,
        also need to be square now because I think I wrote junk code that relies on a
        square map.
     */
    static width = 100;
    static height = 100;
    static removeOnClear = new Set();
    constructor() {
        this.tilemap = ASSET_MANAGER.getAsset("sprites/tiles.png");
    }

    /**
     * Adds all the background tiles as entities to the background layer of the game engine.
     */
    build() {
        placeRandomTrees();
        this.placePath();
        this.placeGrassTiles();
        placeBorderWalls();
    }

    placePath() {
        //Entities for the path
        removeNatureFromArea(new BoundingBox(
            new Vec2(-7 * TILE_SIZE, -200 * TILE_SIZE),
            new Dimension(7 * TILE_SIZE, 400 * TILE_SIZE)));

        for(let i = -200; i < 200; i++) {
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
                    new Dimension(128, 128)),  Layers.BACKGROUND);
            }
        }
    }
}


class GrassTile extends Entity {
    constructor(pos, size) {
        super(pos, size);
        this.sprite = ASSET_MANAGER.getAsset("sprites/grass_1.png")
        this.pos.x *= 128;
        this.pos.y *= 128;
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, 0, 0, 128, 128, this.getScreenPos().x, this.getScreenPos().y, 128, 128);
    }
}

function placeRandomTrees() {
    const numTrees = 3000;
    const numGrass = 8000;
    const numFlower1 = 1500;
    const numFlower2 = 1500;

    const trees = [];
    const grasses = [];
    const flowers1 = [];
    const flowers2 = [];


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
                box: new BoundingBox(new Vec2(x, y), new Dimension(467 / 5, 627 / 5)),
                remove: false
            }

            valid = true;
            //check among others
            for(let tree of trees) {
                if(newTree.box.collide(tree.box)) {
                    valid = false;
                }
            }
        } while(!valid)
        trees.push(newTree);
    }


    for(let i = 0; i < numGrass; i++) {
        let newGrass;
        let valid = false;
        do {
            //Create potential grass
            let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
            let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
            newGrass = {
                box: new BoundingBox(new Vec2(x, y), new Dimension(31, 32)),
                remove: false
            }

            valid = true;
            //check among trees
            for(let tree of trees) {
                if(newGrass.box.collide(tree.box)) {
                    valid = false;
                }
            }

            //check among grass
            for(let grass of grasses) {
                if(newGrass.box.collide(grass.box)) {
                    valid = false;
                }
            }
        } while(!valid)
        grasses.push(newGrass);
    }

    for(let i = 0; i < numFlower1; i++) {
        let newFlower;
        let valid = false;
        do {
            //Create potential grass
            let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
            let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
            newFlower = {
                box: new BoundingBox(new Vec2(x, y), new Dimension(12, 32)),
                remove: false
            }

            valid = true;
            //check among trees
            for(let tree of trees) {
                if(newFlower.box.collide(tree.box)) {
                    valid = false;
                }
            }

            //check among grass
            for(let grass of grasses) {
                if(newFlower.box.collide(grass.box)) {
                    valid = false;
                }
            }

            //check among flowers
            for(let flower of flowers1) {
                if(newFlower.box.collide(flower.box)) {
                    valid = false;
                }
            }

        } while(!valid)
        flowers1.push(newFlower);
    }

    for(let i = 0; i < numFlower2; i++) {
        let newFlower;
        let valid = false;
        do {
            //Create potential grass
            let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
            let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
            newFlower = {
                box: new BoundingBox(new Vec2(x, y), new Dimension(16, 30)),
                remove: false
            }

            valid = true;
            //check among trees
            for(let tree of trees) {
                if(newFlower.box.collide(tree.box)) {
                    valid = false;
                }
            }

            //check among grass
            for(let grass of grasses) {
                if(newFlower.box.collide(grass.box)) {
                    valid = false;
                }
            }

            //check among flowers
            for(let flower of flowers1) {
                if(newFlower.box.collide(flower.box)) {
                    valid = false;
                }
            }

            //check among flowers
            for(let flower of flowers2) {
                if(newFlower.box.collide(flower.box)) {
                    valid = false;
                }
            }

        } while(!valid)
        flowers2.push(newFlower);
    }


    //Add these trees to the actual engine with correct bounding boxes
    trees.forEach(tree => {
        const realTree = new Obstacle(
            tree.box.pos,
            new Dimension(467/5, 627/5),
            ASSET_MANAGER.getAsset("sprites/tree_00.png"),
            true,
            null,
            new Vec2(0, 0),
            new Dimension(467, 627)
        );
        realTree.boundingBox =
            Character.createBB(realTree.pos, realTree.size, new Padding(50, 20, 0 ,20));
        realTree.footPrint = realTree.boundingBox;
        gameEngine.addEntity(realTree);
    })
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/tree_00.png"));

    grasses.forEach(grass => {
        const realGrass = new Obstacle(
            grass.box.pos,
            new Dimension(31, 32),
            ASSET_MANAGER.getAsset("sprites/tall_grass.png"),
            false,
            null,
            new Vec2(0, 0),
            new Dimension(31, 32)
        )
        realGrass.footPrint = new BoundingBox(realGrass.pos, realGrass.size);

        gameEngine.addEntity(realGrass, Layers.BACKGROUND);
    })
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/tall_grass.png"));

    flowers1.forEach(flower => {
        const realFlower = new Obstacle(
            flower.box.pos,
            new Dimension(12, 32),
            ASSET_MANAGER.getAsset("sprites/flower_1.png"),
            false,
            null,
            new Vec2(0, 0),
            new Dimension(12, 32)
        )
        realFlower.footPrint = new BoundingBox(realFlower.pos, realFlower.size);

        gameEngine.addEntity(realFlower, Layers.BACKGROUND);
    })
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/flower_1.png"));

    flowers2.forEach(flower => {
        const realFlower = new Obstacle(
            flower.box.pos,
            new Dimension(16, 30),
            ASSET_MANAGER.getAsset("sprites/flower_2.png"),
            false,
            null,
            new Vec2(0, 0),
            new Dimension(16, 30)
        )
        realFlower.footPrint = new BoundingBox(realFlower.pos, realFlower.size);

        gameEngine.addEntity(realFlower, Layers.BACKGROUND);
    })
    MapBuilder.removeOnClear.add(ASSET_MANAGER.getAsset("sprites/flower_2.png"));


    //remove nature from certain areas using new function
    let bb = new BoundingBox(
        new Vec2(-10 * TILE_SIZE, -10 * TILE_SIZE),
        new Dimension(30 * TILE_SIZE, 20 * TILE_SIZE));
    removeNatureFromArea(bb);
}


function removeNatureFromArea(boundingBox) {
    for(let entity of gameEngine.entities[Layers.FOREGROUND]) {
        if(MapBuilder.removeOnClear.has(entity.spritesheet)) {
            if(boundingBox.collide(entity.footPrint)) {
                entity.removeFromWorld = true;
            }
        }
    }
    for(let entity of gameEngine.entities[Layers.BACKGROUND]) {
        if(MapBuilder.removeOnClear.has(entity.spritesheet)) {
            if(boundingBox.collide(entity.footPrint)) {
                entity.removeFromWorld = true;
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

"use strict";

/**
 * Needs serious updating, like seriously
 */
class MapBuilder {
    /*Could be 150, will start will 100 * 128 makes for 12800 px wide map,
        also need to be the same now because I wrote junk code that relies on a
        square map.
     */
    static width = 100;
    static height = 100;
    constructor() {
        this.tilemap = ASSET_MANAGER.getAsset("sprites/tiles.png");
    }

    /**
     * Adds all the background tiles as entities to the background layer of the game engine.
     */
    build() {
        placeRandomTrees();
        this.placePath();
        this.placeGrass();
        placeBorderWallsAndTrees();
    }

    placePath() {
        //Entities for that path
        removeTreesFromArea(new BoundingBox(
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

    placeGrass() {
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
    const numTrees = 2500;
    const numGrass = 1000;
    const trees = [];
    const grass = [];

    const edgeBuffer = 20;
    const grassTileSize = 4;
    let rightBound = (MapBuilder.width * grassTileSize / 2 - edgeBuffer) * TILE_SIZE;
    const leftBound = -rightBound;
    rightBound -= 50;
    let bottomBound = (MapBuilder.height * grassTileSize / 2 - edgeBuffer) * TILE_SIZE;
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
        let x = leftBound + Math.round(Math.random() * (rightBound - leftBound));
        let y = topBound + Math.round(Math.random() * (bottomBound - topBound));
        //Grass size
        //grass.push(Character.createBB(new Vec2(x, y), new Dimension(467/5, 627/5), new Padding()));
    }

    //Place grass, remove grass that overlaps with other trees or grass

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

        gameEngine.addEntity(realTree);
        console.log("add");
    })

    //remove trees from certain areas using new function
    let bb = new BoundingBox(
        new Vec2(-6 * TILE_SIZE, -6 * TILE_SIZE),
        new Dimension(26 * TILE_SIZE, 12 * TILE_SIZE));
    removeTreesFromArea(bb);
}

function removeTreesFromArea(boundingBox) {
    for(let entity of gameEngine.entities[Layers.FOREGROUND]) {
        if(entity.spritesheet === ASSET_MANAGER.getAsset("sprites/tree_00.png")
            && boundingBox.collide(entity.boundingBox)) {

            entity.removeFromWorld = true;
        }
    }
}


function placeBorderWallsAndTrees() {
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

    //Draw trees
    for(let i = leftEdgeCoord; i < rightEdgeCoord; i += 10) {
        drawTreePatch(new Vec2(i, topEdgeCoord + 10));
        drawTreePatch(new Vec2(i, bottomEdgeCoord - 20));
        drawTreePatch(new Vec2(i, bottomEdgeCoord - 10));

    }
    for(let i = topEdgeCoord + 20; i < bottomEdgeCoord - 20; i += 10) {
        drawTreePatch(new Vec2(leftEdgeCoord, i));
        drawTreePatch(new Vec2(leftEdgeCoord + 10, i));
        drawTreePatch(new Vec2(rightEdgeCoord - 10, i));
        drawTreePatch(new Vec2(rightEdgeCoord - 20, i));
    }
}

function drawTreePatch(tilePos) {
    makeTree(new Vec2(tilePos.x + 0.5, tilePos.y + 0.5));
    makeTree(new Vec2(tilePos.x + 1, tilePos.y + 5));

    makeTree(new Vec2(tilePos.x + 3.5, tilePos.y -1));
    makeTree(new Vec2(tilePos.x + 4, tilePos.y + 4));

    makeTree(new Vec2(tilePos.x + 7, tilePos.y));
    makeTree(new Vec2(tilePos.x + 7, tilePos.y + 5));

    function makeTree(tilePos) {
        let tree1 = new Obstacle(
            new Vec2(tilePos.x * TILE_SIZE, tilePos.y * TILE_SIZE),
            new Dimension(467/5, 627/5),
            ASSET_MANAGER.getAsset("sprites/tree_00.png"),
            false,
            null,
            new Vec2(0, 0),
            new Dimension(467, 627)
        );
        tree1.boundingBox = undefined;
        gameEngine.addEntity(tree1);
    }
}
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
        this.tilemap = ASSET_MANAGER.getAsset("../sprites/tiles.png");
    }

    /**
     * Adds all the background tiles as entities to the background layer of the game engine.
     */
    build() {
        //Entities for that path
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

        //Entities for the grass tiles
        for(let row = 0; row < MapBuilder.height; row++) {
            for(let col = 0; col < MapBuilder.width; col++) {
                gameEngine.addEntity(new GrassTile({x: col-MapBuilder.height/2, y: row-MapBuilder.height/2},
                    new Dimension(128, 128)),  Layers.BACKGROUND);
            }
        }

        addBorderWalls();
    }
}

class GrassTile extends Entity {
    constructor(pos, size) {
        super(pos, size);
        this.sprite = ASSET_MANAGER.getAsset("../sprites/grass_1.png")
        this.pos.x *= 128;
        this.pos.y *= 128;
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, 0, 0, 128, 128, this.getScreenPos().x, this.getScreenPos().y, 128, 128);
    }
}

function addBorderWalls() {
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
            ASSET_MANAGER.getAsset("../sprites/tree_00.png"),
            false,
            null,
            new Vec2(0, 0),
            new Dimension(467, 627)
        );
        tree1.boundingBox = undefined;
        gameEngine.addEntity(tree1);
    }
}
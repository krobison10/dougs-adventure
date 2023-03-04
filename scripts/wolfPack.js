/**
 * Represents a pack of 'n' wolf enemies.
 *
 * @author Ryan MacLeod
 *
 */

class WolfPack extends Entity {
    constructor(pos, n) {
        //Make sure there is a enough reserved space for the "wolf den"
        super(pos, new Dimension(64 * n, 64 * n));
    
        this.enraged = false; //Initially set enraged characteristic to false
        this.size = n;
        this.wolfList = [this.size]; //Initialize list to size n

        for(let i = 0; i < n; i++) {
            gameEngine.addEntity(new Wolf(new Vec2(400, 200), ASSET_MANAGER.getAsset("sprites/wolf_spritesheet.png"),
	            new Dimension(32, 64), new Padding(0, 0, 0, 0), 30, 150));
        }
    }
}
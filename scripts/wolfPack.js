/**
 * Represents a pack of 4 wolf enemies.
 *
 * @author Ryan MacLeod
 *
 */

class WolfPack extends Entity {
    constructor(pos) {
        //Make sure there is a enough reserved space for the "wolf den"
        super(pos, new Dimension(64 * 3, 64 * 3));
    
        this.protectMode = false; //Initially set enraged characteristic to false
        this.size = 4;
        this.wolfList = [];
        this.maxHitPointList = [];
        this.wolfPosList = [];
        this.wolfPosList[0] = new Vec2(this.pos.x, this.pos.y);
        this.wolfPosList[1] = new Vec2(this.pos.x + 128, this.pos.y);
        this.wolfPosList[2] = new Vec2(this.pos.x, this.pos.y + 128),
        this.wolfPosList[3] = new Vec2(this.pos.x + 128, this.pos.y + 128);

        for(let i = 0; i < 4; i++) {
            this.wolfList[i] = new Wolf(this.wolfPosList[i], ASSET_MANAGER.getAsset("sprites/wolf_spritesheet.png"),
                new Dimension(32, 64), new Padding(0, 0, 0, 0), 30, 150);
            this.maxHitPointList[i] = 150;
            gameEngine.addEntity(this.wolfList[i]);
        }
    }

    update() {
        if(!this.protectMode) {
            for(let i = 0; i < 4; i++) {
                if(this.wolfList[i].hitPoints < this.maxHitPointList[i]) {
                    this.protectMode = true;
                    break;
                }
            }
        }

        if(doug.dead) {
            this.protectMode = false;
            for(let i = 0; i < 4; i++) {
                this.wolfList[i].enraged = false;
                this.maxHitPointList[i] = this.wolfList[i].hitPoints;
            }
        } else if(this.protectMode) {
            this.wolfList.forEach(wolf => {
                wolf.enraged = true;
            });
        }
    }



    draw() {
        //Empty draw method to satisfy game engine
    }
}
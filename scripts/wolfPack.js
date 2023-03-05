/**
 * Represents a pack of 4 wolf enemies. Adds extra behaviors to the wolf enemies like
 * protecting their pack mates.
 *
 * @author Ryan MacLeod
 *
 */
class WolfPack extends Entity {
    /**
     * A constructor that creates and adds 4 wolves to the game world.
     * 
     * @param {Vec2} pos The position of the top left corner of the WolfPack.
     */
    constructor(pos) {
        //Make sure there is a enough reserved space for the "wolf den" and space inbetween each wolf
        super(pos, new Dimension(64 * 3, 64 * 3));
    
        this.protectMode = false; //Initially set enraged characteristic to false
        this.wolfList = [];
        this.maxHitPointList = [];
        this.wolfPosList = [];
        this.wolfPosList[0] = new Vec2(this.pos.x, this.pos.y);
        this.wolfPosList[1] = new Vec2(this.pos.x + 128, this.pos.y);
        this.wolfPosList[2] = new Vec2(this.pos.x, this.pos.y + 128);
        this.wolfPosList[3] = new Vec2(this.pos.x + 128, this.pos.y + 128);

        for(let i = 0; i < 4; i++) {
            this.wolfList[i] = new Wolf(this.wolfPosList[i], this);
            this.maxHitPointList[i] = this.wolfList[i].maxHitPoints;
            gameEngine.addEntity(this.wolfList[i]);
        }
    }

    update() {
        if(!this.protectMode) { //Checks if any wolf has been damaged
            for(let i = 0; i < 4; i++) {
                if(this.wolfList[i].hitPoints < this.maxHitPointList[i]) {
                    this.protectMode = true;
                    break;
                }
            }
        }

        if(doug.dead) { //Updates all hitPoints and stops protection mode when doug is dead
            this.protectMode = false;
            for(let i = 0; i < 4; i++) {
                this.wolfList[i].enraged = false;
                this.maxHitPointList[i] = this.wolfList[i].hitPoints;
            }
        } else if(this.protectMode) { //Enrages each wolf while in protection mode
            this.wolfList.forEach(wolf => {
                wolf.enraged = true;
            });
        }
    }
}
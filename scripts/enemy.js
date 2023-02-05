class Enemy extends Character {
    static immunityDuration = 0.3;
    /**
     * @param {Vec2} pos initial position.
     * @param {Dimension} size size of the sprite.
     * @param {HTMLImageElement} spritesheet spritesheet of the enemy.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     * @param {number} damage how much damage the entity deals to the player
     * @param {number} maxHitPoints maximum health of the enemy.
     */
    constructor(pos, spritesheet, size, spritePadding = new Padding(), damage, maxHitPoints) {
        super(pos, spritesheet, size, spritePadding);
        if(this.constructor === Enemy) {
            throw new Error("Enemy is an abstract class, cannot be instantiated");
        }
        Object.assign(this, {damage, maxHitPoints});
        this.velocity = new Vec2(0,0);
        this.hitPoints = this.maxHitPoints;

        this.lastDamage = Date.now();
        gameEngine.addEntity(new HealthBar(this))

    }

    takeDamage(amount) {
        if(timeInSecondsBetween(this.lastDamage, Date.now()) > Enemy.immunityDuration) {
            this.lastDamage = Date.now();
            this.hitPoints -= amount;
            if(this.hitPoints <= 0) {
                this.hitPoints = 0;
                this.die();
            }
        }
    }

    die() {
        this.removeFromWorld = true;
    }

    update() {

    }
    update() {
        
    }
    takeDamage(amount) {
        this.hitPoints -= amount;
        if(this.hitPoints <= 0) {
            this.hitPoints = 0;
            this.die();
        }
    }   

    die() {
        if (this.hitPoints <= 0) {
            this.removeFromWorld = true;
        }
    }

    /**
     * Draws the current frame of the animation at the current position of the Enemy.
     * @param {CanvasRenderingContext2D} ctx the rendering context.
     */
    draw(ctx) {
        this.animation.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}
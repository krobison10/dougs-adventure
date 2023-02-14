"use strict";

/**
 * Represents the dragon enemy.
 *
 * @author Cameron Lempitsky
 *
 */
class Dragon extends Enemy {
    /**
     * @param {Vec2} pos initial position of the dragon.
     * @param {HTMLImageElement} spritesheet spritesheet of the dragon.
     * @param {Dimension} size size of the dragon.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     * @param {number} damage how much damage the entity deals to the player
     * @param {number} hitPoints maximum health of the enemy.
     */
    constructor(pos, spritesheet, size, spritePadding, damage, hitPoints) {

        let scale1 = 3;
        super(pos, spritesheet, new Dimension(size.w*scale1, size.h*scale1), spritePadding, damage, hitPoints);
        this.animations = [];
        this.scale = scale1
        this.maxHitPoints = 1000;

        this.hitPoints = 1000;
        this.damage = 10;

        this.speed = 200;
        this.velocity = new Vec2(0,0);
        this.directionMem = 0;
        this.time = 0;

        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, 0, (i * this.size.h) /this.scale,
                this.size.w/this.scale, this.size.h/this.scale,
                4, .2, 0, false, true);
        }
        
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

    }

    /**d
     * Updates the dragon for the frame.
     */
    update() {
        this.route();
        this.fireballAttack();
        
        this.pos.x += this.velocity.x * gameEngine.clockTick;
        this.pos.y += this.velocity.y * gameEngine.clockTick;

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

    }

    fireballAttack() {
        if (getDistance(doug.getCenter(), dragon.getCenter()) < 500 && !doug.dead) {
            if (timeInSecondsBetween(Date.now(), this.time) >= 0.75) {
                this.time = Date.now();
                gameEngine.addEntity(new FireSphere(new Vec2(doug.getCenter().x, doug.getCenter().y)))
            }
            
        }
    }

    route() {
        let x = 200;
        if (this.pos.x >= x && this.pos.y >= x) {
            this.velocity.x = 0;
            this.velocity.y = -this.speed;
        }

        if (this.pos.x >= x && this.pos.y <=0) {
            this.velocity.y = 0;
            this.velocity.x = -this.speed;
        }

        if (this.pos.x <= 0 && this.pos.y <= 0) {
            this.velocity.x = 0;
            this.velocity.y = this.speed;
        }

        if(this.pos.x <= 0 && this.pos.y >= x) {
            this.velocity.x = this.speed;
            this.velocity.y = 0;
        }
    }

    draw(ctx) {

        //this.drawAnim(ctx, this.animations[1]);

        if(this.velocity.x < 0) {//left
            this.drawAnim(ctx, this.animations[1]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0) {//right
            this.drawAnim(ctx, this.animations[2]);
            this.directionMem = 2;
        }
        if(this.velocity.y > 0 && this.velocity.x === 0) {//down
            this.drawAnim(ctx, this.animations[0]);
            this.directionMem = 0;
        }
        if(this.velocity.y < 0 && this.velocity.x === 0) {//up
            this.drawAnim(ctx, this.animations[3]);
            this.directionMem = 3;
        }
        if(this.velocity.y === 0 && this.velocity.x === 0) {
            this.drawAnim(ctx, this.animations[0]);
        }

        this.boundingBox.draw(ctx);
    }

     drawAnim(ctx, animator) {
         animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y, this.scale);
     }
}



class FireSphere extends Entity {
    static damage = 45;
    constructor(clickPos) {
        super(new Vec2(dragon.getCenter().x, dragon.getCenter().y), new Dimension(48, 48));

        this.velocity = new Vec2(clickPos.x - dragon.getCenter().x, clickPos.y - dragon.getCenter().y);

        // normalize
        const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        this.velocity.x /= magnitude;
        this.velocity.y /= magnitude;

        this.speed = 250;

        this.moveToStartingPoint();
        this.setBox();
        lightMap.addLightSource(
            new LightSource(1, new Vec2(0, 0), this, new RGBColor(255, 128, 0), 50));
    }

    setBox() {
        this.attackBox = new BoundingBox(this.pos, this.size);
    }

    // gives a jump in its direction, so it doesn't start inside the player
    moveToStartingPoint() {
        this.pos.x += this.velocity.x * 120;
        this.pos.y += this.velocity.y * 120;
    }

    update() {
        this.pos.x += this.velocity.x * this.speed * gameEngine.clockTick;
        this.pos.y += this.velocity.y * this.speed * gameEngine.clockTick;
        this.setBox();
        this.checkCollide();
    }

    checkCollide() {
        for(let entity of gameEngine.entities[Layers.FOREGROUND]) {
            if(entity.boundingBox && this.attackBox.collide(entity.boundingBox)) {
                if(entity instanceof Obstacle) {
                    if(getDistance(this.pos, dragon.pos) < dontUpdateDistance) {
                        ASSET_MANAGER.playAsset("sounds/projectile_impact.wav");
                    }
                    return this.removeFromWorld = true;
                }
                if(entity instanceof Doug) {
                    ASSET_MANAGER.playAsset("sounds/projectile_impact.wav");
                    entity.takeDamage(FireSphere.damage);
                    return this.removeFromWorld = true;
                }
            }
        }
    }

    draw(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset("sprites/FireSphere.png"), 0, 0, 16, 16,
            this.getScreenPos().x, this.getScreenPos().y, this.size.w, this.size.h);
        this.attackBox.draw(ctx);
    }
}
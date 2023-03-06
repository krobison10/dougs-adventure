'use strict'

/**
 * Literally is a bunny.
 *
 * @author Kyler Robison
 */
class Bunny extends Character {
    /**
     * Creates a bunny at the position.
     * @param {Vec2} pos
     */
    constructor(pos) {
        super(
            pos,
            ASSET_MANAGER.getAsset("sprites/bunny.png"),
            new Dimension(26, 22));

        this.animations = [];
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
        this.maxHitPoints = 30;
        this.hitPoints = this.maxHitPoints;
        this.speed = 100;

        this.directionMem = 1;
        this.switchInterval = 2;
        this.lastSwitch = Date.now();

        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(
                this.spritesheet,
                0,
                22 * i,
                26,
                22,
                3,
                0.15,
                0,
                false,
                true);
        }
        for(let i = 0; i < 4; i++) {
            this.animations[i + 4] = new Animator(
                this.spritesheet,
                26,
                22 * i,
                26,
                22,
                1,
                0.5,
                0,
                false,
                true);
        }
    }

    update() {
        if(this.knockback) {
            this.velocity = new Vec2(this.knockbackDir.x, this.knockbackDir.y);

            let scalingFactor = this.knockbackSpeed / this.knockbackDir.magnitude();

            this.velocity.x *= scalingFactor;
            this.velocity.y *= scalingFactor;
        }
        else {
            this.move()
        }

        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical")
        if(!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }
        if(!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
    }
    move() {

        if (timeInSecondsBetween(Date.now(), this.lastSwitch) > this.switchInterval) {
            this.lastSwitch = Date.now();

            const dir = randomInt(8);
            switch (dir) {
                case 0:
                    this.velocity.x = -this.speed;
                    this.velocity.y = 0;
                    break;
                case 1:
                    this.velocity.x = this.speed;
                    this.velocity.y = 0;
                    break;
                case 2:
                    this.velocity.x = 0;
                    this.velocity.y = -this.speed;
                    break;
                case 3:
                    this.velocity.x = 0;
                    this.velocity.y = this.speed;
                    break;
                default:
                    this.velocity.x = 0;
                    this.velocity.y = 0;
            }
        }
    }

    draw(ctx) {

        if(this.velocity.x < 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//left
            this.drawAnim(ctx, this.animations[1]);
            this.directionMem = 1;
        }
        else if(this.velocity.x > 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//right
            this.drawAnim(ctx, this.animations[2]);
            this.directionMem = 2;
        }
        else if(this.velocity.y > 0 && Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {//down
            this.drawAnim(ctx, this.animations[0]);
            this.directionMem = 0;
        }
        else if(this.velocity.y < 0 && Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {//up
            this.drawAnim(ctx, this.animations[3]);
            this.directionMem = 3;
        }
        else if(this.velocity.y === 0 && this.velocity.x === 0) {
            this.drawAnim(ctx, this.animations[4 + this.directionMem]);
        }

        this.boundingBox.draw(ctx);
    }

    drawAnim(ctx, animator) {
        animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}

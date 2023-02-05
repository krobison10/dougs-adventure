'use strict'


class Sword extends Entity {
    static damage = 10;

    constructor(swingDir) {
        super(new Vec2(doug.pos.x, doug.pos.y), new Dimension(32, 32));

        doug.attacking = true;
        doug.attackDir = swingDir;

        this.speed = 12;
        this.dir = swingDir;
        if(swingDir === SwingDirections.RIGHT) {
            this.angle = 0;
            this.change = this.speed;
        }
        else {
            this.angle = Math.PI / 2;
            this.change = -this.speed;
        }

        this.sprite = ASSET_MANAGER.getAsset("sprites/sword.png");
        this.bbSize = new Dimension(72, 76);
        this.updateBB();
        ASSET_MANAGER.playAsset("sounds/swing_2.wav")
    }

    update() {
        this.angle += this.change * gameEngine.clockTick;

        this.pos.y = doug.pos.y - 100;
        this.pos.x = doug.pos.x;
        this.updateBB();
        this.checkDamage();

        if(this.dir === SwingDirections.RIGHT && this.angle >= Math.PI) {
            this.resetDoug();
        }
        if(this.dir === SwingDirections.LEFT && (this.angle <= -Math.PI / 2 )) {
            this.resetDoug();
        }
    }

    updateBB() {
        if(this.dir === SwingDirections.RIGHT) {
            this.attackBox = new BoundingBox(new Vec2(doug.pos.x + 10, doug.pos.y - 12), this.bbSize);
        } else {
            this.attackBox = new BoundingBox(new Vec2(doug.pos.x - 30, doug.pos.y - 12), this.bbSize);
        }
    }

    checkDamage() {
        for(let ent of gameEngine.entities[Layers.FOREGROUND]) {
            if(ent instanceof Enemy && this.attackBox.collide(ent.boundingBox)) {
                ent.takeDamage(Sword.damage);
            }
        }
    }

    resetDoug() {
        doug.attacking = false;
        doug.attackDir = undefined;
        this.removeFromWorld = true;
    }

    draw(ctx) {
        const square = 108;

        let offScreenCanvas = document.createElement('canvas');
        offScreenCanvas.width = square;
        offScreenCanvas.height = square;
        let offCtx = offScreenCanvas.getContext('2d');
        offCtx.save();
        offCtx.translate(square/2, square/2);
        offCtx.rotate(this.angle);
        offCtx.translate(-square/2, -square/2);
        offCtx.drawImage(this.sprite, 16, 16, 32, 32);
        offCtx.restore();


        let xOffset = (doug.size.w - square) / 2;
        let yOffset = (doug.size.h - square) / 2;
        ctx.drawImage(offScreenCanvas, doug.getScreenPos().x + xOffset, doug.getScreenPos().y + yOffset);
        this.attackBox.draw(ctx)
    }

}

const SwingDirections = {
    LEFT: 0,
    RIGHT: 1
}
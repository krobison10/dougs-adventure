'use strict'


class Sword extends Entity {
    static damage = 10;

    constructor(swingDir) {
        super(new Vec2(doug.pos.x, doug.pos.y), new Dimension(32, 32));

        doug.attacking = true;
        doug.attackDir = swingDir;

        this.speed = 12;
        this.dir = swingDir;
        if(swingDir === Directions.RIGHT) {
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

        if(this.dir === Directions.RIGHT && this.angle >= Math.PI) {
            this.resetDoug();
        }
        if(this.dir === Directions.LEFT && (this.angle <= -Math.PI / 2 )) {
            this.resetDoug();
        }
    }

    updateBB() {
        if(this.dir === Directions.RIGHT) {
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

const Directions = {
    LEFT: 0,
    RIGHT: 1
}

class Bow extends Entity {
    static useTime = 0.4;

    constructor(dir) {
        super(new Vec2(doug.pos.x, doug.pos.y), new Dimension(44, 44));

        doug.attacking = true;
        doug.attackDir = dir;

        this.dir = dir;
        this.startTime = Date.now();
        this.image = this.getImage();
    }

    update() {
        if(timeInSecondsBetween(Date.now(), this.startTime) > Bow.useTime) {
            doug.attacking = false;
            doug.attackDir = undefined;
            this.removeFromWorld = true;
        }

        this.pos.y = doug.pos.y - 50;
    }

    getImage() {
        let offScreenCanvas = document.createElement('canvas');
        let w = this.size.w ;
        let h = this.size.h;
        offScreenCanvas.width = w;
        offScreenCanvas.height = h;
        let offCtx = offScreenCanvas.getContext('2d');
        offCtx.save();
        offCtx.translate(w/2, h/2);
        let angle = 5 * Math.PI / 4;
        if(this.dir === Directions.LEFT) angle -= Math.PI;
        offCtx.rotate(angle);
        offCtx.translate(-w/2, -h/2);
        offCtx.drawImage(ASSET_MANAGER.getAsset("sprites/bow.png"), 6, 6, 32, 32);
        offCtx.restore();

        return offScreenCanvas;
    }


    draw(ctx) {
        let xPos = this.dir === Directions.LEFT ? doug.getScreenPos().x - 10 : doug.getScreenPos().x + 18;
        ctx.drawImage(this.image, xPos, doug.getScreenPos().y + 14);
    }
}

class Arrow extends Entity {
    static damage = 14;
    constructor(clickPos) {
        const width = 42;
        const height = 42;
        super(new Vec2(doug.getCenter().x - width/2, doug.getCenter().y - height/2), new Dimension(width, height));
        this.velocity = new Vec2(clickPos.x - WIDTH / 2, clickPos.y - HEIGHT / 2);

        // normalize
        const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        this.velocity.x /= magnitude;
        this.velocity.y /= magnitude;

        this.speed = 600;

        ASSET_MANAGER.playAsset("sounds/bow.wav");
        this.angle = Arrow.calcAngleFromOrigin(this.velocity);


        this.image = this.getImage();

        this.padding = new Padding(15, 15, 15, 15);
        //this.padding = new Padding();
        this.moveToStartingPoint();
        this.setBox();
    }

    setBox() {
        this.attackBox = Character.createBB(this.pos, this.size, this.padding);
    }

    // gives the arrow a jump in its direction, so it doesn't start inside the player
    moveToStartingPoint() {
        this.pos.x += this.velocity.x * 20;
        this.pos.y += this.velocity.y * 20;
    }

    update() {
        this.pos.x += this.velocity.x * this.speed * gameEngine.clockTick;
        this.pos.y += this.velocity.y * this.speed * gameEngine.clockTick;
        this.setBox();
        this.checkCollide();
    }

    checkCollide() {
        for(let entity of gameEngine.entities[Layers.FOREGROUND]) {
            if(entity.boundingBox && this.attackBox.collide(entity.boundingBox) && entity !== doug) {
                if(entity instanceof Obstacle) {
                    ASSET_MANAGER.playAsset("sounds/arrow_impact.wav");
                    return this.removeFromWorld = true;
                }
                if(entity instanceof Enemy) {
                    entity.takeDamage(Arrow.damage);
                    return this.removeFromWorld = true;
                }
            }
        }
    }

    static calcAngleFromOrigin(vector) {
        const angle = Math.atan2(vector.x, vector.y);
        return angle >= 0 ? angle : angle + 2 * Math.PI;
    }

    getImage() {
        let offScreenCanvas = document.createElement('canvas');
        let w = this.size.w;
        let h = this.size.h;
        offScreenCanvas.width = w;
        offScreenCanvas.height = h;
        let offCtx = offScreenCanvas.getContext('2d');
        offCtx.save();
        offCtx.translate(w/2, h/2);
        offCtx.rotate(-this.angle);
        offCtx.translate(-w/2, -h/2);
        offCtx.drawImage(ASSET_MANAGER.getAsset("sprites/arrow.png"), 14, 5, 14, 32);
        offCtx.restore();

        return offScreenCanvas;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.getScreenPos().x, this.getScreenPos().y);
        this.attackBox.draw(ctx);
    }
}
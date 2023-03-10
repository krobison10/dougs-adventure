'use strict'


//----------------------------------------------------------------------------------------------------------------------
// SWORD
//----------------------------------------------------------------------------------------------------------------------

/**
 * Represents a swinging sword in the game.
 *
 * @author Kyler Robison
 */
class Sword extends Entity {
    static damage = 29;

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
        ASSET_MANAGER.playAsset("sounds/swing_2.wav");
        this.enemiesHit = new Set();
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
            if(
                ent instanceof Enemy
                && this.attackBox.collide(ent.boundingBox)
                && !this.enemiesHit.has(ent)
                && this.enemiesHit.size < 4) {
                ent.takeDamage(Sword.damage);
                ent.applyKnockback(350, .45);
                this.enemiesHit.add(ent);
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



//----------------------------------------------------------------------------------------------------------------------
// BOW
//----------------------------------------------------------------------------------------------------------------------

/**
 * Represents the bow in the game.
 *
 * @author Kyler Robison
 */
class Bow extends Entity {
    static useTime = 0.4;

    constructor(dir) {
        super(new Vec2(doug.pos.x, doug.pos.y), new Dimension(44, 44));

        doug.attacking = true;
        doug.attackDir = dir;

        this.dir = dir;
        this.startTime = Date.now();
        this.image = this.getImage();
        this.tryArrow();
    }

    tryArrow() {
        if(doug.inventory.arrow >= 1) {
            gameEngine.addEntity(new Arrow(gameEngine.click));
            doug.inventory.arrow--;
        }
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



//----------------------------------------------------------------------------------------------------------------------
// ARROW
//----------------------------------------------------------------------------------------------------------------------

/**
 * Represents an arrow in the game.
 *
 * @author Kyler Robison
 */
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
        const source = new LightSource(.5, new Vec2(0, 0), this, new RGBColor(250, 97, 2), 60);
        FireSphere.setFlicker(source);
        lightingSystem.addLightSource(source);
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
        this.generateParticles();
        this.setBox();
        this.checkCollide();
    }

    generateParticles() {
        for(let i = 0; i < 4; i++) {
            if(probability(4 * gameEngine.clockTick)) {
                const duration = 1 + Math.random();

                const xVel = Math.random() / 2 * (probability(0.5) ? 1 : -1);
                const speed = 150 + Math.random() * 50;

                const magnitude = 0.1 + Math.random() / 10;
                const g = 60 + Math.random() * 40;
                const decay = .3 + Math.random() / 5;

                const particle = new Particle(this.getCenter().clone(), 3, new RGBColor(255, g, 2),
                    1, speed, decay, new Vec2(xVel, 1), duration)
                gameEngine.addEntity(particle, Layers.GLOWING_ENTITIES);

                const source = new FlickeringLightSource(magnitude, this.getCenter().clone(),
                        particle, new RGBColor(255, 100, 0), 60);
                Arrow.setFlicker(source);
                lightingSystem.addLightSource(source);
            }
        }
    }

    static setFlicker(source) {
        source.growSpeed = 0.3;
        source.shrinkSpeed = .1;
        source.maxMagnitude = source.magnitude * 1.2;
        source.minMagnitude = source.magnitude * 0.72;
    }

    checkCollide() {
        for(let entity of gameEngine.entities[Layers.FOREGROUND]) {
            if(entity.boundingBox && this.attackBox.collide(entity.boundingBox) && entity !== doug) {
                if(entity instanceof Obstacle) {
                    if(getDistance(this.pos, doug.pos) < dontUpdateDistance) {
                        ASSET_MANAGER.playAsset("sounds/arrow_impact.wav");
                    }
                    return this.removeFromWorld = true;
                }
                if(entity instanceof Enemy) {
                    entity.takeDamage(Arrow.damage);
                    entity.applyKnockback(150, .25);
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
        offCtx.drawImage(ASSET_MANAGER.getAsset("sprites/arrow_flaming.png"), 14, 5, 14, 32);
        offCtx.restore();

        return offScreenCanvas;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.getScreenPos().x, this.getScreenPos().y);
        this.attackBox.draw(ctx);
    }
}



//----------------------------------------------------------------------------------------------------------------------
// MANA BOLT
//----------------------------------------------------------------------------------------------------------------------

/**
 * Represents the Mana Bolt in game.
 *
 * @author Kyler Robison
 */
class ManaBolt extends Entity {
    static useTime = 0.3;
    static ManaCost = 15;

    constructor(dir) {
        super(new Vec2(doug.pos.x, doug.pos.y), new Dimension(32, 32));

        doug.attacking = true;
        doug.attackDir = dir;
        this.dir = dir;
        this.startTime = Date.now();
        this.image = this.getImage();
    }

    getImage() {
        let offScreenCanvas = document.createElement('canvas');
        let w = this.size.w;
        let h = this.size.h;
        offScreenCanvas.width = w;
        offScreenCanvas.height = h;

        let offCtx = offScreenCanvas.getContext('2d');
        offCtx.save();
        offCtx.imageSmoothingEnabled = false;
        if(this.dir === Directions.LEFT) {
            offCtx.scale(-1, 1);
            offCtx.drawImage(ASSET_MANAGER.getAsset("sprites/tome_1.png"), -32, 0, 32, 32);

        } else {
            offCtx.drawImage(ASSET_MANAGER.getAsset("sprites/tome_1.png"), 0, 0, 32, 32);

        }
        offCtx.restore();
        return offScreenCanvas;
    }

    update() {
        if(timeInSecondsBetween(Date.now(), this.startTime) > ManaBolt.useTime) {
            doug.attacking = false;
            doug.attackDir = undefined;
            this.removeFromWorld = true;
        }

        this.pos.y = doug.pos.y + 50;
    }

    draw(ctx) {
        const xLoc = this.dir === Directions.LEFT ? doug.getScreenPos().x - 10 : doug.getScreenPos().x + 30;
        ctx.drawImage(this.image, xLoc, doug.getScreenPos().y + 28);
    }
}



//----------------------------------------------------------------------------------------------------------------------
// WATER SPHERE
//----------------------------------------------------------------------------------------------------------------------

/**
 * Represents a water sphere in the game.
 *
 * @author Kyler Robison
 */
class WaterSphere extends Entity {
    static damage = 45;
    constructor(clickPos) {
        super(new Vec2(doug.getCenter().x - 12, doug.getCenter().y - 12), new Dimension(24, 24));
        this.velocity = new Vec2(clickPos.x - WIDTH / 2, clickPos.y - HEIGHT / 2);

        // normalize
        const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        this.velocity.x /= magnitude;
        this.velocity.y /= magnitude;

        this.speed = 250;

        ASSET_MANAGER.playAsset("sounds/mana_bolt.wav");


        this.moveToStartingPoint();
        this.setBox();
        lightingSystem.addLightSource(
            new LightSource(0.8, new Vec2(0, 0), this, new RGBColor(11, 46, 255), 50));
    }

    setBox() {
        this.attackBox = new BoundingBox(this.pos, this.size);
    }

    // gives a jump in its direction, so it doesn't start inside the player
    moveToStartingPoint() {
        this.pos.x += this.velocity.x * 20;
        this.pos.y += this.velocity.y * 20;
    }

    update() {
        this.pos.x += this.velocity.x * this.speed * gameEngine.clockTick;
        this.pos.y += this.velocity.y * this.speed * gameEngine.clockTick;
        this.generateParticles();
        this.setBox();
        this.checkCollide();
    }

    generateParticles() {
        for(let i = 0; i < 8; i++) {
            if(probability(10 * gameEngine.clockTick)) {

                const duration = 0.5 + Math.random();
                const speed = 10 + Math.random() * 20;

                const x = this.getCenter().x - 8 + Math.random() * 16;
                const y = this.getCenter().y - 8 + Math.random() * 16;

                //const magnitude = 0.075 + Math.random() / 10;

                const particle = new Particle(new Vec2(x, y), 4, new RGBColor(11, 46, 255),
                    1, speed, .3, null, duration)
                gameEngine.addEntity(particle, Layers.GLOWING_ENTITIES);

                //lightMap.addLightSource(
                //    new LightSource(magnitude, this.getCenter().clone(), particle, particle.color, 60));
            }
        }
    }

    checkCollide() {
        for(let entity of gameEngine.entities[Layers.FOREGROUND]) {
            if(entity.boundingBox && this.attackBox.collide(entity.boundingBox) && entity !== doug) {
                if(entity instanceof Obstacle) {
                    if(getDistance(this.pos, doug.pos) < dontUpdateDistance) {
                        ASSET_MANAGER.playAsset("sounds/projectile_impact.wav");
                    }
                    return this.removeFromWorld = true;
                }
                if(entity instanceof Enemy) {
                    ASSET_MANAGER.playAsset("sounds/projectile_impact.wav");
                    entity.takeDamage(WaterSphere.damage);
                    entity.applyKnockback(300, .35, this);
                    return this.removeFromWorld = true;
                }
            }
        }
    }

    draw(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset("sprites/Water_Sphere.png"), 0, 0, 16, 16,
            this.getScreenPos().x, this.getScreenPos().y, this.size.w, this.size.h);
        this.attackBox.draw(ctx);
    }
}



//----------------------------------------------------------------------------------------------------------------------
// DIRECTIONS
//----------------------------------------------------------------------------------------------------------------------

const Directions = {
    LEFT: 0,
    RIGHT: 1
}
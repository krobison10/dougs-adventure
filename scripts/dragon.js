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
        this.dragonRange = 400;
        this.hitPoints = 1000;
        this.damage = 10;
        this.aggroRange = 200;
        this.dead = false;
        this.type = "dragon";

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


        this.targetID = 0;
        this.path = [{x: this.pos.x, y: this.pos.y}, {x: this.pos.x+ 200, y: this.pos.y}, {x: this.pos.x+200, y: this.pos.y+200}, {x: this.pos.x, y: this.pos.y+200}];
        this.target = this.path[this.targetID % 4];

        let dist = getDistance(this.pos, this.target)
        this.velocity = new Vec2((this.target.x - this.pos.x)/dist * this.speed,(this.target.y - this.pos.y)/dist * this.speed);

    }

    /**
     * Updates the dragon for the frame.
     */
    update() {
        let dist = getDistance(this.pos, this.target);
        let dougDist = getDistance(this.pos, doug.pos);

        if(dougDist < this.aggroRange && !doug.dead) {
            this.target = doug.pos;
        } else {
            if (dist < 5) {
                this.targetID++;
            }
            this.target = this.path[this.targetID % 4];
            dist = getDistance(this.pos, this.target)
        }

        this.velocity = new Vec2((this.target.x - this.pos.x)/dist * this.speed,(this.target.y - this.pos.y)/dist * this.speed);

        this.fireballAttack();
        
        this.pos.x += this.velocity.x * gameEngine.clockTick;
        this.pos.y += this.velocity.y * gameEngine.clockTick;

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

    }

    die() {
        log.addMessage("Dragon has been defeated", MessageLog.colors.purple);
        super.die();
    }

    deathSound() {
        ASSET_MANAGER.playAsset("sounds/dragon_kill.wav");
    }

    fireballAttack() {
        if (getDistance(doug.getCenter(), dragon.getCenter()) < this.dragonRange && !doug.dead) {
            if (timeInSecondsBetween(Date.now(), this.time) >= 0.75) {
                this.time = Date.now();
                gameEngine.addEntity(new FireSphere(new Vec2(doug.getCenter().x, doug.getCenter().y)));
                ASSET_MANAGER.playAsset("sounds/dragon_attack.wav")

            }
            
        }
    }

    draw(ctx) {

        //this.drawAnim(ctx, this.animations[1]); 0 3 1 2 1

        if(this.velocity.x < 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//left
            this.drawAnim(ctx, this.animations[1]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//right
            this.drawAnim(ctx, this.animations[2]);
            this.directionMem = 2;
        }
        if(this.velocity.y > 0 && Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {//down
            this.drawAnim(ctx, this.animations[0]);
            this.directionMem = 0;
        }
        if(this.velocity.y < 0 && Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {//up
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

        const source = new FlickeringLightSource(0.85, new Vec2(0, 0), this, new RGBColor(255, 100, 0), 50);
        FireSphere.setFlicker(source);
        lightMap.addLightSource(source);
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
        this.generateParticles();
        this.setBox();
        this.checkCollide();
    }

    generateParticles() {
        for(let i = 0; i < 6; i++) {
            if(probability(5 * gameEngine.clockTick)) {
                const duration = 0.5 + Math.random();
                const speed = 20 + Math.random() * 40;

                const x = this.getCenter().x - 20 + Math.random() * 32;
                const y = this.getCenter().y - 20 + Math.random() * 32;

                const g = 60 + Math.random() * 40;
                const magnitude = 0.01 + Math.random() * 0.1;

                const particle = new Particle(new Vec2(x, y), 5, new RGBColor(255, g, 2),
                    2, speed, .3, null, duration)
                gameEngine.addEntity(particle, Layers.GLOWING_ENTITIES);

                const source = new LightSource(magnitude, this.getCenter().clone(),
                    particle, new RGBColor(255, 100, 0), 60);
                lightMap.addLightSource(source);
            }
        }
    }

    static setFlicker(source) {
        source.growSpeed = 0.5;
        source.shrinkSpeed = .2;
        source.maxMagnitude = source.magnitude * 1.1;
        source.minMagnitude = source.magnitude * 0.86;
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
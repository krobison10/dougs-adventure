'use strict'

/**
 *
 *
 * @author Cameron Lempitsky
 */
class Demon extends Enemy {
    /**
     * @param {Vec2} pos initial position of the demon.
     * @param {HTMLImageElement} spritesheet spritesheet of the demon.
     * @param {Dimension} size size of the demon.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     * @param {number} damage how much damage the entity deals to the player
     * @param {number} hitPoints maximum health of the enemy.
     */
    constructor(pos, spritesheet, size, spritePadding, damage, hitPoints) {

        let scale1 = 3;
        super(pos, spritesheet, new Dimension(size.w*scale1, size.h*scale1), spritePadding, damage, hitPoints);
        this.animations = [];
        this.scale = scale1
        this.maxHitPoints = hitPoints;
        this.aggroRange = 300;
        this.dead = false;
        this.type = "demon";
        this.center = this.getCenter()
        this.speed = 200;
        this.velocity = new Vec2(0,0);
        this.directionMem = 0;
        this.time = 0;
        this.changeDirectionDelay = 1;
        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, 0, (i * 70),
                100, 70,
                3, .4, 0, false, true);
        }
        gameEngine.addEntity(new FireCircle(this.getCenter()))
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
        
        const source = new FlickeringLightSource(0.85, new Vec2(0, 0), this, new RGBColor(255, 100, 0), 50);
        FireSphere.setFlicker(source);
        lightingSystem.addLightSource(source);
    }

    /**
     * Updates the demon for the frame.
     */
    update() {
        this.move();
        this.pos.x += this.velocity.x * gameEngine.clockTick;
        this.pos.y += this.velocity.y * gameEngine.clockTick;
       
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

    }
    move() {
        let center = this.getCenter();
        let dougDist = getDistance(center, doug.getCenter());
        let dougCenter = doug.getCenter();

        //Decrement the direction delay by 1
        this.changeDirectionDelay-= gameEngine.clockTick;
        //console.log(this.changeDirectionDelay);
        //Check if the direction delay has elapsed
        if(dougDist < this.aggroRange && !doug.dead && dougDist > 2) {
            //this.target = doug.pos;
            this.velocity= new Vec2((dougCenter.x - center.x)/dougDist * this.speed,(dougCenter.y - center.y)/dougDist * this.speed);
        } else {
            if(dougDist <= 2) {
                this.velocity.x=0;
                this.velocity.y=0;
            }

            if (this.changeDirectionDelay <= 0) {
                            // Reset the direction delay to a new value
                this.changeDirectionDelay = 1;
                    // Change direction and velocity randomly with probability

                const randomDirection = Math.floor(Math.random() * 5);
                switch (randomDirection) {
                    case 0:
                        this.velocity.x = -this.speed;
                        this.velocity.y = 0;
                        this.directionMem = 1;
                        break;
                    case 1:
                        this.velocity.x = this.speed;
                        this.velocity.y = 0;
                        this.directionMem = 2;
                        break;
                    case 2:
                        this.velocity.x = 0;
                        this.velocity.y = -this.speed;
                        this.directionMem = 3;
                        break;
                    case 3:
                        this.velocity.x = 0; 
                        this.velocity.y = this.speed;
                        this.directionMem = 4;
                        break;
                    case 4:
                        this.velocity.x = 0;
                        this.velocity.y = 0;
                }
            }
        } 
    }

    die() {
        log.addMessage("Demon has been defeated", MessageLog.colors.purple);
        super.die();
    }

    // deathSound() {
    //     ASSET_MANAGER.playAsset("sounds/dragon_kill.wav");
    // }

    draw(ctx) {

       //this.drawAnim(ctx, this.animations[3]); //1 2 0 3

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


class FireCircle extends Entity {
    static damage = 45;
    constructor(position) {
        super(position, new Dimension(48, 48));
        
        this.size = new Dimension(48,48);
        this.pos = position;
      

        this.radius = 200;
        this.center = position;
        this.angle = 0;
        this.attackBox = new BoundingBox(this.pos, this.size);

    }

    update() {
        if(demon.removeFromWorld) return this.removeFromWorld = true;

        this.center.x = demon.getCenter().x - 24;
        this.center.y = demon.getCenter().y - 24;
        this.angle += 0.075;
        let x = this.center.x + this.radius * Math.cos(this.angle);
        let y = this.center.y + this.radius * Math.sin(this.angle);

        this.pos.x = x;
        this.pos.y = y;
        this.attackBox = new BoundingBox(this.pos, this.size);
        this.generateParticles();
        this.checkCollide();
    }
    generateParticles() {
        for(let i = 0; i < 20; i++) {
            if(probability(5 * gameEngine.clockTick)) {
                const duration = Math.random();
                const speed = 20 + Math.random() * 40;

                const x = this.getCenter().x - 20 + Math.random() * 32;
                const y = this.getCenter().y - 20 + Math.random() * 32;

                const g = 60 + Math.random() * 40;
                const magnitude = 0.01 + Math.random() * 0.1;

                const particle = new Particle(new Vec2(x, y), 10, new RGBColor(255, g, 2),
                    2, speed, 0.3, null, duration)
                gameEngine.addEntity(particle, Layers.GLOWING_ENTITIES);

                const source = new LightSource(magnitude, this.getCenter().clone(),
                    particle, new RGBColor(255, 100, 0), 60);
                lightingSystem.addLightSource(source);
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
                if(entity instanceof Doug) {
                    entity.takeDamage(FireCircle.damage);
                }
            }
        }
    }
    draw(ctx) {
        this.attackBox.draw(ctx);
        return;
        ctx.drawImage(ASSET_MANAGER.getAsset("sprites/FireSphere.png"), 0, 0, 16, 16,
            this.getScreenPos().x, this.getScreenPos().y, this.size.w, this.size.h);
        
    }
}
"use strict";

/**
 * Represents the player character.
 *
 * @author Kyler Robison
 */
class Doug extends Character {
    /**
     * Delay in seconds before health regen will begin
     * @type {number}
     */
    static regenDelay = 10;
    /**
     * Time in seconds for how long doug must wait to drink another health potion.
     * @type {number}
     */
    static healthPotionCooldown = 15;
    /**
     * Amount of HP that the health potion regenerates.
     * @type {number}
     */
    static healthPotionAmount = 50;
    /**
     * Amount of time in seconds before doug can take damage again.
     * @type {number}
     */
    static immunityDuration = 0.4;
    /**
     * The base regeneration rate in terms of hit points per second.
     * @type {number}
     */
    static healthRegen = 2;
    /**
     * The base regeneration rate in terms of hit points per second.
     * @type {number}
     */
    static baseManaRegen = 8;
    /**
     * Multiplier for the exponential growth of mana regeneration.
     * @type {number}
     */
    static manaRegenMultiplier = 1.015;
    /**
     * Time before respawning in seconds.
     * @type {number}
     */
    static respawnTime = 10;

    /**
     * @param {Vec2} pos initial position of the player.
     * @param {HTMLImageElement} spritesheet spritesheet of the player.
     * @param {Dimension} size size of the sprite.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     */
    constructor(pos, spritesheet, size) {
        super(pos, spritesheet, size, null);
        this.walkingPadding = new Padding(36, 12, 8, 12);
        this.spritePadding = new Padding(8, 12, 8, 12);
        this.animations = [];

        this.inventory = {
            arrow: 50,
            healthPotion: 2
        }
        /**
         * The maximum hit points of doug
         * @type {number}
         */
        this.maxHitPoints = 200;
        /**
         * The current health of doug. Should not exceed 400 because the health bar will break.
         * @type {number}
         */
        this.hitPoints = this.maxHitPoints;
        /**
         * The time of the last health regeneration frame.
         * @type {number}
         */
        this.lastHealthRegen = Date.now();
        /**
         * Time that doug last drank a health potion.
         * @type {number}
         */
        this.lastHealthPotion = 0;
        /**
         * Time that the last damage frame occurred.
         * @type {number}
         */
        this.lastDamage = Date.now();
        /**
         * Pretty self-explanatory
         * @type {boolean}
         */
        this.dead = false;
        /**
         * Time of last death.
         * @type {undefined}
         */
        this.deathTime = undefined;
        /**
         * The maximum mana level of doug.
         * @type {number}
         */
        this.maxMana = 100;
        /**
         * The current mana level of doug.
         * @type {number}
         */
        this.manaLevel = this.maxMana;
        /**
         * The time of the last mana regeneration frame.
         * @type {number}
         */
        this.lastManaRegen = Date.now();
        /**
         * Represents the current rate of mana regen that is increased the longer mana isn't used.
         * @type {number}
         */
        this.curManaRegen = Doug.baseManaRegen;
        /**
         * Speed of the player.
         * @type {number}
         */
        this.speed = 250;
        /**
         * Current velocity of the player.
         * @type {Vec2}
         */
        this.velocity = new Vec2(0, 0);
        /**
         * Memory for the direction of the player.
         * @type {number}
         */
        this.directionMem = 0;
        /**
         * Current bounding box of the player.
         * @type {BoundingBox}
         */
        this.walkingBox = Character.createBB(this.pos, this.size, this.walkingPadding);
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
        this.attacking = false;
        this.attackDir = undefined;

        //Create still animations
        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, 0, i * this.size.h,
                this.size.w, this.size.h,
                1, 1, 0, false, true);
        }
        //Create walking animations
        for(let i = 0; i < 4; i++) {
            this.animations[i + 4] = new Animator(this.spritesheet, this.size.w, i * this.size.h,
                this.size.w, this.size.h,
                2, .1, 0, false, true);
        }
    }

    /**
     * Updates the player for the frame.
     */
    update() {
        this.velocity.x = this.velocity.y = 0;
        if(this.dead) {
            if(timeInSecondsBetween(this.deathTime, Date.now()) >= Doug.respawnTime) this.respawn();
            else return;
        }

        if(gameEngine.click) {
            this.handleClick();
        }

        if(gameEngine.keys["h"] || gameEngine.keys["H"]) this.useHealthPotion();

        if(gameEngine.keys["a"] || gameEngine.keys["A"]) this.velocity.x -= this.speed;
        if(gameEngine.keys["d"] || gameEngine.keys["D"]) this.velocity.x += this.speed;
        if(gameEngine.keys["w"] || gameEngine.keys["W"])  this.velocity.y -= this.speed;
        if(gameEngine.keys["s"] || gameEngine.keys["S"]) this.velocity.y += this.speed;

        //If the resulting vector's magnitude exceeds the speed
        if(Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y) > this.speed) {
            //Modify components so that vector's magnitude (total speed) matches desired speed
            this.velocity.x = this.speed/Math.sqrt(2) * this.velocity.x/this.speed;//Might be redundant
            this.velocity.y = this.speed/Math.sqrt(2) * this.velocity.y/this.speed;
        }

        /*
         * Check for collision with an obstacle, we do two separate checks so that if a player is colliding in one axis
         * they can still possibly be able to move on the other axis.
         */
        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical");
        if(!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }
        if(!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }


        const entities = gameEngine.entities[Layers.FOREGROUND];
        for(const entity of entities) {
            if (entity instanceof Enemy && this.boundingBox.collide(entity.boundingBox)) {
                 this.takeDamage(entity.damage);
            }
        }

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
        this.walkingBox = Character.createBB(this.pos, this.size, this.walkingPadding);

        this.regen();
        this.updateDebug();
    }

    handleClick() {
        if(!this.attacking) {
            if(hotbar.slots[hotbar.selectedIndex].itemID === 336) {
                if(gameEngine.click.x <= WIDTH / 2) {
                    gameEngine.addEntity(new Sword(Directions.LEFT));
                }
                else {
                    gameEngine.addEntity(new Sword(Directions.RIGHT));
                }
            }
            else if (hotbar.slots[hotbar.selectedIndex].itemID === 76) {
                if(gameEngine.click.x <= WIDTH / 2) {
                    gameEngine.addEntity(new Bow(Directions.LEFT));
                }
                else {
                    gameEngine.addEntity(new Bow(Directions.RIGHT));
                }
            }
            else if (hotbar.slots[hotbar.selectedIndex].itemID === 351 && this.useMana(ManaBolt.ManaCost)) {
                if(gameEngine.click.x <= WIDTH / 2) {
                    gameEngine.addEntity(new ManaBolt(Directions.LEFT));
                }
                else {
                    gameEngine.addEntity(new ManaBolt(Directions.RIGHT));
                }
                gameEngine.addEntity(new WaterSphere(gameEngine.click));
            }
        }
        if (hotbar.slots[hotbar.selectedIndex].itemID === 246) {
            this.useHealthPotion();
        }
    }

    useHealthPotion() {
        if(this.inventory.healthPotion >= 1 &&
            timeInSecondsBetween(Date.now(), this.lastHealthPotion) >= Doug.healthPotionCooldown) {
            this.inventory.healthPotion--;
            this.lastHealthPotion = Date.now();
            this.hitPoints += Doug.healthPotionAmount;
            if(this.hitPoints >= this.maxHitPoints) this.hitPoints = this.maxHitPoints;
            ASSET_MANAGER.playAsset("sounds/drink.wav");
            createDamageMarker(this, -Doug.healthPotionAmount);
        }
    }

    checkCollide(dir) {
        let futurePos = {};
        futurePos.x = this.pos.x + (dir === 'lateral' ? this.velocity.x * gameEngine.clockTick : 0);
        futurePos.y = this.pos.y + (dir === 'vertical' ? this.velocity.y * gameEngine.clockTick : 0);
        let box = Character.createBB(new Vec2(futurePos.x, futurePos.y), this.size, this.walkingPadding);

        const entities = gameEngine.entities[Layers.FOREGROUND];
        for(const entity of entities) {
            if(entity.boundingBox && entity instanceof Obstacle) {
                if(entity !== this && box.collide(entity.boundingBox)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Attempts to regenerate the player's health and mana
     */
    regen() {
        if(this.hitPoints < this.maxHitPoints && timeInSecondsBetween(this.lastDamage, Date.now()) >= Doug.regenDelay) {
            if(timeInSecondsBetween(this.lastHealthRegen, Date.now()) >= 1 / Doug.healthRegen) {
                if(this.velocity.netVelocity() !== 0) {
                    this.hitPoints += 1;
                }
                else {
                    this.hitPoints += 2;
                }

                if(this.hitPoints > this.maxHitPoints) this.hitPoints = this.maxHitPoints;

                this.lastHealthRegen = Date.now();
            }
        }
        if(this.manaLevel < this.maxMana) {
            if(timeInSecondsBetween(this.lastManaRegen, Date.now()) >= 1 / this.curManaRegen) {
                this.manaLevel += 1;
                this.lastManaRegen = Date.now();
                this.curManaRegen *= Doug.manaRegenMultiplier;
                if(this.manaLevel >= this.maxMana) {
                    ASSET_MANAGER.playAsset("sounds/MaxMana.wav");
                }
            }
        }
    }

    /**
     * Takes mana away from doug and makes necessary updates. If doug does not have enough mana, none will be taken.
     * @param amount the amount to take away.
     * @returns {boolean} True if there was enough mana, false if there was not.
     */
    useMana(amount) {
        if(amount > this.manaLevel) return false;

        this.manaLevel -= amount;
        this.curManaRegen = Doug.baseManaRegen;
        return true;
    }

    takeDamage(amount) {
        if(timeInSecondsBetween(this.lastDamage, Date.now()) >= Doug.immunityDuration) {
            this.lastDamage = Date.now();
            this.hitPoints -= amount;
            if(this.hitPoints > 0) {
                let variant = randomInt(3);
                ASSET_MANAGER.playAsset(`sounds/Player_Hit_${variant}.wav`);

            } else {
                this.hitPoints = 0;
                ASSET_MANAGER.playAsset("sounds/Player_Killed.wav");
                this.die();
            }
        }
    }

    /**
     * Takes steps to kill doug
     */
    die() {
        this.dead = true;
        this.deathTime = Date.now();

        log.addMessage("Doug was slain", MessageLog.colors.red)

        const bigText = new UIText(
            new Vec2(this.getScreenPos().x - 48, this.getScreenPos().y + 20),
            "Doug Ded",
            40,
            new RGBColor(255, 45, 45));
        bigText.updateFn = function () {
            if(!doug.dead) this.removeFromWorld = true;
        }

        const counterText = new UIText(new Vec2(this.getScreenPos().x - 42, this.getScreenPos().y + 70),
            "Respawning in...",
            20,
            new RGBColor(255, 45, 45));
        counterText.updateFn = () => {
            if(!doug.dead) {
                counterText.removeFromWorld = true;
            } else {
                let timeToRespawn = Doug.respawnTime - Math.round(timeInSecondsBetween(doug.deathTime, Date.now()));
                counterText.content = "Respawning in... " + timeToRespawn;
            }
        }
        gameEngine.addEntity(bigText, Layers.UI);
        gameEngine.addEntity(counterText, Layers.UI);

    }

    respawn() {
        this.pos = new Vec2(spawnPoint.x, spawnPoint.y);
        this.lastDamage = Date.now();
        this.dead = false;
        this.hitPoints = this.maxHitPoints;
        this.manaLevel = this.maxMana;
        this.directionMem = 0;

    }

    upgrade(boss) {
        log.addMessage("You feel stronger than ever...", MessageLog.colors.green);
        ASSET_MANAGER.playAsset("sounds/upgrade.wav");
        if(boss === 'bear') {
            this.maxHitPoints += 100;
            this.hitPoints += 100;
            if(this.hitPoints > this.maxHitPoints) this.hitPoints = this.maxHitPoints;
            this.maxMana += 40;
            this.manaLevel += 40;
            if(this.manaLevel > this.maxMana) this.manaLevel = this.maxMana;
            Sword.damage *= 1.2;
            Arrow.damage *= 1.5;
            WaterSphere.damage *= 1.2;
            Doug.healthPotionAmount += 30;
        }
        if(boss === 'dragon') {
            this.maxHitPoints += 100;
            this.hitPoints += 100;
            if(this.hitPoints > this.maxHitPoints) this.hitPoints = this.maxHitPoints;
            this.maxMana += 60;
            this.manaLevel += 60;
            if(this.manaLevel > this.maxMana) this.manaLevel = this.maxMana;
            Sword.damage *= 1.5;
            Arrow.damage *= 1.3;
            WaterSphere.damage *= 1.6;
            Doug.healthPotionAmount += 70;
        }
    }

    getDrop(name, count, quality) {

    }

    /**
     * Updates the position label below the canvas
     */
    updateDebug() {
        const label = document.getElementById("position");
        label.innerText = `X: ${Math.round(this.pos.x / TILE_SIZE)}, Y: ${Math.round(this.pos.y / TILE_SIZE)}`;
    }

    draw(ctx) {
        if(this.dead) return;

        if(!this.attacking) {
            if(this.velocity.x < 0) {
                this.drawAnim(ctx, this.animations[5]);
                this.directionMem = 1;
            }
            if(this.velocity.x > 0) {
                this.drawAnim(ctx, this.animations[6]);
                this.directionMem = 2;
            }
            if(this.velocity.y === this.speed) {
                this.drawAnim(ctx, this.animations[4]);
                this.directionMem = 0;
            }
            if(this.velocity.y === -this.speed) {
                this.drawAnim(ctx, this.animations[7]);
                this.directionMem = 3;
            }
            if(this.velocity.y === 0 && this.velocity.x === 0) {
                this.drawAnim(ctx, this.animations[this.directionMem]);
            }
        }
        else {
            if(this.attackDir === Directions.LEFT) {
                this.directionMem = 1;
            }
            if(this.attackDir === Directions.RIGHT) {
                this.directionMem = 2;
            }

            if(Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2)) > 0) {
                this.drawAnim(ctx, this.animations[this.directionMem + 4]);
            }
            else {
                this.drawAnim(ctx, this.animations[this.directionMem]);
            }
        }

        this.boundingBox.draw(ctx);
        this.walkingBox.draw(ctx);
    }

    drawAnim(ctx, animator) {
        animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}
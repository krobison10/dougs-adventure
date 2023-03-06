class Enemy extends Character {
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

        gameEngine.addEntity(new HealthBar(this), Layers.FOREGROUND);
        this.type = undefined;

        this.knockback = false;
        this.knockbackDir = undefined;
        this.knockbackDuration = .35;
        this.knockbackSpeed = 250;
        this.lastKnockBack = 0;
        this.knockbackScale = 1;
    }

    takeDamage(amount) {
        this.hitPoints -= amount;
        createDamageMarker(this, amount);
        if(this.hitPoints <= 0) {
            this.hitPoints = 0;
            this.die();
        } else {
            this.hitSound();
        }
    }

    update() {
        if(timeInSecondsBetween(Date.now(), this.lastKnockBack) > this.knockbackDuration) {
            if(this.knockback && this.velocity) {
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
            this.knockback = false;
        }
        if(this.knockback) {
            this.knockbackSpeed *= 0.965 * (1 - gameEngine.clockTick);
        }
    }

    /**
     * Applies knockback to the enemy.
     * @param {number} amount the amount (speed) of the knockback.
     * @param {number} duration amount of time in seconds it will last.
     * @param {*} source the source of the knockback (to calculate direction).
     */
    applyKnockback(amount, duration, source = doug) {
        if(!(this instanceof Dragon || this instanceof BearBoss || this instanceof Demon)) {
            this.knockback = true;
            this.knockbackSpeed = amount * this.knockbackScale;
            this.knockbackDuration = duration * this.knockbackScale;
            this.lastKnockBack = Date.now();
            let enemy = this.getCenter();

            source = source.getCenter();
            this.knockbackDir = new Vec2(enemy.x - source.x, enemy.y - source.y);
        }
    }

    /**
     * Plays the death sound of the enemy.
     */
    deathSound() {
        ASSET_MANAGER.playAsset("sounds/std_kill.wav");
    }

    /**
     * Plays the hit sound of the enemy.
     */
    hitSound() {
        ASSET_MANAGER.playAsset("sounds/Hit_1.wav")
    }

    /**
     * Takes steps to remove the enemy from the game.
     */
    die() {
        super.deathParticles();
        this.removeFromWorld = true;
        this.deathSound();
        this.drops();
    }

    /**
     * Calculates and executes drops of the killed enemy.
     */
    drops() {
        const table = Enemy.dropTable[this.type];
        if(table) {
            for(let drop in table) {
                if(Enemy.dropTypes[drop] === "newitem") {
                    if (drop === "manaBolt") {
                        doug.getManaBolt();
                    } else if(drop === "bow") {
                        doug.getBow();
                    }
                }
                else if (Enemy.dropTypes[drop] === "boost") {
                    doug.getBoost(drop, dropQuantity(table[drop]));
                }
                else if (Enemy.dropTypes[drop] === "item") {
                    doug.getDrop(drop, dropQuantity(table[drop]));
                }
            }
        }
    }

    /**
     * Draws the current frame of the animation at the current position of the Enemy.
     * @param {CanvasRenderingContext2D} ctx the rendering context.
     */
    draw(ctx) {
        this.animation.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }

    /**
     * Represents the types and probabilities of drops for various enemies.
     * For each drop, each item has a chance of being given specified by probability.
     * Rolls represent how many times the drop will be attempted, to facilitate multiple drops at a time.
     */
    static dropTable = {
        slime: {
            arrow: {
                chance: 1/4,
                rolls: 4,
            },
            heart: {
                chance: 1/20,
                rolls: 1
            },
            'healing potion': {
                chance: 1/20,
                rolls: 1
            }
        },
        bat: {
            arrow: {
                chance: 0.5,
                rolls: 5
            },
            heart: {
                chance: 1/20,
                rolls: 1
            },
            mana: {
                chance: 1/10,
                rolls: 1
            },
            'healing potion': {
                chance: 1/10,
                rolls: 1
            }
        },
        wolf: {
            arrow: {
                chance: 0.5,
                rolls: 20
            },
            heart: {
                chance: 1/10,
                rolls: 1
            },
            mana: {
                chance: 1/10,
                rolls: 1
            },
            'healing potion': {
                chance: 1/20,
                rolls: 4
            }
        },
        bear: {
            arrow: {
                chance: 4/5,
                rolls: 30
            },
            heart: {
                chance: 2,
                rolls: 1
            },
            mana: {
                chance: 1/2,
                rolls: 2
            },
            'healing potion': {
                chance: 1/2,
                rolls: 4
            },
            bow: {
                chance: 1,
                rolls: 1
            }
        },
        dragon: {
            arrow: {
                chance: 4/5,
                rolls: 200
            },
            heart: {
                chance: 1,
                rolls: 4
            },
            mana: {
                chance: 1,
                rolls: 2
            },
            'healing potion': {
                chance: 1/2,
                rolls: 10
            },
            manaBolt: {
                chance: 1,
                rolls: 1
            }
        },
        demon: {
            arrow: {
                chance: 4/5,
                rolls: 100
            },
            heart: {
                chance: 1,
                rolls: 2
            },
            mana: {
                chance: 1,
                rolls: 2
            },
            'healing potion': {
                chance: 1/2,
                rolls: 8
            }
        }
    }

    /**
     * Specifies the type of drop for each item.
     */
    static dropTypes = {
        arrow: "item",
        'healing potion': "item",
        heart: "boost",
        mana: "boost",
        bow: "newitem",
        manaBolt: "newitem"
    }
}

/**
 * Calculates the drop quantity.
 * @param {Object} drop the drop object from the table.
 * @returns {number} the amount to give.
 */
function dropQuantity(drop) {
    let count = 0;
    for(let i = 0; i < drop.rolls; i++) {
        if(probability(drop.chance)) count++;
    }
    return count;
}


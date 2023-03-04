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

        gameEngine.addEntity(new HealthBar(this), Layers.GLOWING_ENTITIES);
        this.type = undefined;

        this.knockback = false;
        this.knockbackDir = undefined;
        this.knockbackDuration = .35;
        this.knockbackSpeed = 250;
        this.lastKnockBack = 0;
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
            this.knockback = false;
        }
    }

    applyKnockback(player, amount, duration) {
        if(this instanceof Bat || this instanceof Slime) {
            this.knockback = true;
            this.knockbackSpeed = amount;
            this.knockbackDuration = duration;
            this.lastKnockBack = Date.now();
            let doug = player.getCenter();
            let enemy = this.getCenter();
            this.knockbackDir = new Vec2(enemy.x - doug.x, enemy.y - doug.y);
        }
    }

    deathSound() {
        ASSET_MANAGER.playAsset("sounds/std_kill.wav");
    }

    hitSound() {
        ASSET_MANAGER.playAsset("sounds/Hit_1.wav")
    }

    die() {
        super.deathParticles();
        this.removeFromWorld = true;
        this.deathSound();
        this.drops();
    }



    drops() {
        const table = Enemy.dropTable[this.type];
        if(table) {
            for(let drop in table) {
                if(Enemy.dropTypes[drop] === "item") {
                    doug.getDrop(drop, dropQuantity(table[drop]));
                }
                else if(Enemy.dropTypes[drop] === "boost") {
                    doug.getBoost(drop, dropQuantity(table[drop]));
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

    static dropTable = {
        slime: {
            arrow: {
                chance: 1/4,
                rolls: 6,
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
                rolls: 50
            },
            heart: {
                chance: 1,
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
    static dropTypes = {
        arrow: "item",
        'healing potion': "item",
        heart: "boost",
        mana: "boost",
        bow: "newitem",
        manaBolt: "newitem"
    }
}

function dropQuantity(drop) {
    let count = 0;
    for(let i = 0; i < drop.rolls; i++) {
        if(probability(drop.chance)) count++;
    }
    return count;
}


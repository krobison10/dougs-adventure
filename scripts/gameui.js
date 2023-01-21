'use strict'

/**
 * Represents the hotbar that contains the player's items
 *
 * @author Alay Kidane & Kyler Robison
 */
class Hotbar extends Entity {
    constructor() {
        super(new Vec2(20, 20), new Dimension(0, 0));
        /**
         * Slots of the hotbar
         * @type {HotbarSlot[]}
         */
        this.slots = [];

        for(let i = 0; i < 5; i++) {
            this.slots.push(new HotbarSlot(this, i));
        }

        /**
         * Index of the selected slot
         * @type {number}
         */
        this.selectedIndex = 0;
        this.slots[this.selectedIndex].selected = true;

    }
                
    update() {
        this.checkSlotSelect();
    }

    checkSlotSelect() {
        for(let i = 1; i <= this.slots.length; i++) {
            if(gameEngine.keys[i]) {
                this.slots[this.selectedIndex].selected = false;
                this.slots[i - 1].selected = true;
                this.selectedIndex = i - 1;
            }
        }
    }
                
    draw(ctx) {
        this.slots.forEach((slot) => slot.draw(ctx));
    }
}

/**
 * Represents a slot in the hotbar
 *
 * @author Kyler Robison
 */
class HotbarSlot {
    /**
     * Total size of the slot
     * @type {number}
     */
    static slotSize = 40;
    /**
     * Horizontal gap between slots
     * @type {number}
     */
    static slotGap = 12;
    /**
     * Border size of the slots
     * @type {number}
     */
    static borderSize = 4;
    /**
     * How much bigger the selected slot will be on all sides
     * @type {number}
     */
    static swell = 2;


    constructor(hotbar, index) {
        this.size = new Dimension(HotbarSlot.slotSize, HotbarSlot.slotSize);
        this.pos = new Vec2(hotbar.pos.x + HotbarSlot.slotSize * index + HotbarSlot.slotGap * index, hotbar.pos.y);
        /**
         * Item contained by the hotbar
         * @type {Item}
         */
        this.item = null;
        /**
         * Whether the current slot is selected or not
         * @type {boolean}
         */
        this.selected = false;
    }

    draw(ctx) {
        ctx.fillStyle = rgba(50, 50, 50, 0.7);
        ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

        if(this.selected) {
            ctx.strokeStyle = rgba(255, 255, 255, .8);
            ctx.lineWidth = HotbarSlot.borderSize + HotbarSlot.swell;
            ctx.strokeRect(this.pos.x - HotbarSlot.swell, this.pos.y - HotbarSlot.swell,
                this.size.w + 2 * HotbarSlot.swell, this.size.h + 2 * HotbarSlot.swell)
        }
        else {
            ctx.strokeStyle = rgba(40, 40, 40, .8);
            ctx.lineWidth = HotbarSlot.borderSize;
            ctx.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        }

        if(this.item) this.drawItem(ctx);
    }


    drawItem(ctx) {
        // draw in the item image
        // ctx.drawImage(
        //     this.pos.x + HotbarSlot.borderSize,
        //     this.pos.y + HotbarSlot.borderSize,
        //
        //     )
    }
}


/**
 * Represents the player's health in the UI
 *
 * @author Kyler Robison
 */
class Health extends Entity {
    constructor() {
        super(new Vec2(WIDTH - 300, 20), new Dimension(0, 0));
        /**
         * Slots of the hotbar
         * @type {Heart[]}
         */
        this.hearts = [];

        for(let i = 0; i < 20; i++) {
            this.hearts.push(new Heart(this, i));
        }

    }

    update() {
        this.hearts.forEach((heart) => heart.update());
    }


    draw(ctx) {
        this.hearts.forEach((heart) => heart.draw(ctx));
    }

}

/**
 * Represents a heart in the health bar
 *
 * @author Kyler Robison
 */
class Heart {
    /**
     * Total size of the slot
     * @type {number}
     */
    static size = 22;
    /**
     * Horizontal gap between slots
     * @type {number}
     */
    static gap = 2;


    constructor(health, index) {
        /**
         * Index of the heart in the health bar
         * @type {Number}
         */
        this.index = index;
        this.size = new Dimension(Heart.size, Heart.size);
        this.pos = Heart.getPos(health, index);
    }

    static getPos(health, index) {
        if(index < 10) {
            return new Vec2(health.pos.x + Heart.size * index + Heart.gap * index, health.pos.y);
        }
        else {
            return new Vec2(health.pos.x + Heart.size * (index - 10) + Heart.gap * (index - 10),
                health.pos.y + Heart.size + Heart.gap);
        }
    }

    update() {

    }

    draw(ctx) {
        ctx.globalAlpha = this.getAlpha();
        ctx.drawImage(ASSET_MANAGER.getAsset("../sprites/heart.png"),
            0, 0, 22, 22, this.pos.x, this.pos.y, 22, 22);

        ctx.globalAlpha = 1;
    }

    getAlpha() {
        let alpha;
        if(Math.floor(doug.hitPoints / 20) > this.index) {
            alpha = 1;
        }
        else if(Math.floor(doug.hitPoints / 20) === this.index) {
            alpha = (doug.hitPoints % 20) / 20;
        }
        else {
            alpha = 0;
        }
        return alpha;
    }
}

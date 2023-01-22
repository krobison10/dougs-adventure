'use strict'

/**
 * Represents the hotbar that contains the player's items
 *
 * @author Alay Kidane & Kyler Robison
 */
class Hotbar extends Entity {
    constructor() {
        super(new Vec2(15, 30), new Dimension(0, 0));
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

        this.label = new UIText(new Vec2(this.pos.x - 3, 5), "Selected Item",
            22, /*new RGBColor(129, 53, 184)*/);
        this.label.updateFn = () => {
            let id = this.slots[this.selectedIndex].itemID;
            let text = Item.itemNames[id];
            this.label.content = id ? `${text}: ${id}` : "";
        }
        gameEngine.addEntity(this.label, Layers.UI);

        this.slots[0].itemID = 336;
        this.slots[1].itemID = 76;
        this.slots[2].itemID = 246;
        this.slots[3].itemID = 85;

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
    static swell = 1;


    constructor(hotbar, index) {
        this.size = new Dimension(HotbarSlot.slotSize, HotbarSlot.slotSize);
        this.pos = new Vec2(hotbar.pos.x + HotbarSlot.slotSize * index + HotbarSlot.slotGap * index, hotbar.pos.y);
        /**
         * ID of the item contained by the slot
         * @type {number}
         */
        this.itemID = 0;
        /**
         * Whether the current slot is selected or not
         * @type {boolean}
         */
        this.selected = false;
    }

    draw(ctx) {
        ctx.fillStyle = rgba(60, 60, 60, 0.6);
        ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

        if(this.selected) {
            ctx.strokeStyle = rgba(255, 255, 255, .8);
            ctx.lineWidth = HotbarSlot.borderSize + HotbarSlot.swell;
            ctx.strokeRect(this.pos.x - HotbarSlot.swell, this.pos.y - HotbarSlot.swell,
                this.size.w + 2 * HotbarSlot.swell, this.size.h + 2 * HotbarSlot.swell)
        }
        else {
            ctx.strokeStyle = rgba(50, 50, 50, .65);
            ctx.lineWidth = HotbarSlot.borderSize;
            ctx.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        }

        if(this.itemID) this.drawItem(ctx);
    }


    drawItem(ctx) {
        let sheetPos = Item.getItemSpriteLocById(this.itemID);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            ASSET_MANAGER.getAsset("../sprites/items.png"),
            sheetPos.x,
            sheetPos.y,
            sheetPos.size,
            sheetPos.size,
            this.pos.x + HotbarSlot.borderSize,
            this.pos.y + HotbarSlot.borderSize,
            32,
            32
            );
        ctx.imageSmoothingEnabled = true;
    }
}


/**
 * Represents the player's health in the UI
 *
 * @author Kyler Robison
 */
class Health extends Entity {
    constructor() {
        super(new Vec2(WIDTH - 300, 30), new Dimension(0, 0));
        /**
         * Slots of the hotbar
         * @type {Heart[]}
         */
        this.hearts = [];

        for(let i = 0; i < 20; i++) {
            this.hearts.push(new Heart(this, i));
        }

        this.label = new UIText(new Vec2(this.pos.x, 7), "Life", 20, new RGBColor(255, 255, 255));
        this.label.updateFn = function() {
            this.content = `Life: ${Math.round(doug.hitPoints)}/${doug.maxHitPoints}`;
        }
        gameEngine.addEntity(this.label, Layers.UI);

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

    /**
     * Calculates the alpha of the heart.
     * @returns {number}
     */
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



/**
 * Represents the player's health in the UI
 *
 * @author Kyler Robison
 */
class Mana extends Entity {
    constructor() {
        super(new Vec2(WIDTH - 38, 30), new Dimension(0, 0));
        /**
         * Slots of the hotbar
         * @type {ManaStar[]}
         */
        this.manaStars = [];

        for(let i = 0; i < 10; i++) {
            this.manaStars.push(new ManaStar(this, i));
        }

        this.label = new UIText(new Vec2(this.pos.x - 10, 7), "Mana", 20,
            new RGBColor(255, 255, 255));
        gameEngine.addEntity(this.label, Layers.UI);

    }

    update() {
        this.manaStars.forEach((manaStar) => manaStar.update());
    }


    draw(ctx) {
        this.manaStars.forEach((manaStar) => manaStar.draw(ctx));
    }

}

/**
 * Represents a heart in the health bar
 *
 * @author Kyler Robison
 */
class ManaStar {
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


    constructor(mana, index) {
        /**
         * Index of the heart in the health bar
         * @type {Number}
         */
        this.index = index;
        this.size = new Dimension(ManaStar.size, ManaStar.size);
        this.pos = ManaStar.getPos(mana, index);
    }

    static getPos(mana, index) {
        return new Vec2(mana.pos.x, mana.pos.y + ManaStar.size * index + ManaStar.gap * index);
    }

    update() {

    }

    draw(ctx) {
        ctx.globalAlpha = this.getAlpha();
        ctx.drawImage(ASSET_MANAGER.getAsset("../sprites/star.png"),
            0, 0, 22, 22, this.pos.x, this.pos.y, 22, 22);

        ctx.globalAlpha = 1;
    }

    /**
     * Caclulates the alpha of the mana star.
     * @returns {number}
     */
    getAlpha() {
        let alpha;
        if(Math.floor(doug.manaLevel / 20) > this.index) {
            alpha = 1;
        }
        else if(Math.floor(doug.manaLevel / 20) === this.index) {
            alpha = (doug.manaLevel % 20) / 20;
        }
        else {
            alpha = 0;
        }
        return alpha;
    }
}

/**
 * Represents a piece of text to be part of the in canvas UI
 *
 * @author Kyler Robison
 */
class UIText extends Entity{
    /**
     * Default font
     * @type {string}
     */
    static font = 'Andy-Bold';

    /**
     * Creates UI Text
     * @param pos {Vec2} position of the text on the screen.
     * @param text {string} content of the text.
     * @param size {Number} font size of the text in pixels.
     * @param color {RGBColor} color of the text, defaults to white.
     */
    constructor(pos, text = 'text', size = 12,
                color = new RGBColor(255, 255, 255)) {
        super(pos, null);
        this.content = text;
        this.font = `${size}px ${UIText.font}`;
        this.fillStyle = rgba(color.r, color.g, color.b, 1);
        this.textBaseline = 'top';
        this.updateFn = () => {};
    }

    /**
     * Draws the text.
     * @param ctx
     */
    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle;
        ctx.textBaseline = this.textBaseline;
        ctx.fillText(this.content, this.pos.x, this.pos.y);
    }

    update() {
        this.updateFn();
    }
}

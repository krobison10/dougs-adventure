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

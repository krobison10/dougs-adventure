"use strict";

class Item extends Entity {
    /**
     * Creates a new item.
     * @param {Vec2 | Object} pos any object with an x and y field to represent the position of the item in game.
     * @param {HTMLImageElement} sprite of the item.
     * @param {Dimension | Object} size any object with a W and H field to represent the width and height.
     * @param lightSource a light source object to attach to this item, light source will be removed with this item.
     */
    constructor(pos, sprite, size, lightSource = null) {
        super(pos);
        Object.assign(this, {sprite, size, lightSource});

        if(lightSource) {
            lightSource.attachTo = this;
            lightMap.addLightSource(lightSource);
        }
    }

    //Could refactor entity to put this method there
    getCenter() {
        return {x: this.pos.x + this.size.w/2, y: this.pos.y + this.size.h/2}
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.getScreenPos().x, this.getScreenPos().y,
            this.size.w, this.size.h);
    }

    update() {
        if(this.removeFromWorld) {
            if(this.lightSource) {
                lightMap.removeLightSource(this.lightSource);
            }

        }
    }
}
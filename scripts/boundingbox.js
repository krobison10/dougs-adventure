'use strict'

class BoundingBox {
    /**
     * Creates a bounding box that can detect a collision.
     * @param {Vec2 | Object} pos the top left corner of the box.
     * @param {Dimension | Object} size the size of the box.
     */
    constructor(pos, size) {
        this.left = pos.x;
        this.top = pos.y;
        this.right = this.left + size.w;
        this.bottom = this.top + size.h;
    }

    /**
     * @param {BoundingBox} oth the other bounding box to check for a collision with.
     * @returns {boolean} true if there is a collision with the other bounding box.
     */
    collide(oth) {
        return this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top;
    }
}
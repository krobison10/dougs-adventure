'use strict'

/**
 * A rectangular bounding box that calculates collisions between entities.
 *
 * @author Kyler Robison
 */
class BoundingBox extends Entity {
    /**
     * Creates a bounding box that can detect a collision.
     * @param {Vec2} pos the top left corner of the box.
     * @param {Dimension} size the size of the box.
     */
    constructor(pos, size) {
        super(pos, size);
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

    /**
     * Draws the bounding box in game as a white rectangle
     * @param ctx
     */
    draw(ctx) {
        if(boundingBoxes) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = '2';
            const pos = this.getScreenPos();
            ctx.strokeRect(pos.x, pos.y, this.size.w, this.size.h);
        }
    }
}
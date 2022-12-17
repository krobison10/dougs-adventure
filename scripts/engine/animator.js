"use strict";

/**
 * Creates an animation that can step through keyframes and draw the appropriate
 * frame when asked.
 */
class Animator {

    /**
     *
     * @param {HTMLImageElement} spritesheet the spritesheet of the entity.
     * @param {number} xStart x position of the top left corner of first frame.
     * @param {number} yStart y position of the top left corner of first frame.
     * @param {number} width of the keyframe.
     * @param {number} height of the keyframe.
     * @param {number} frameCount amount of frames in the animations.
     * @param {number} frameDuration how long each frame is to be displayed on the screen.
     * @param {number} framePadding the amount of whitespace around the character.
     * @param {boolean} reverse whether the animation should run in reverse.
     * @param {boolean} loop whether the animation should loop.
     */
    constructor(spritesheet, xStart, yStart, width, height,
                frameCount, frameDuration, framePadding, reverse, loop)
    {
        Object.assign(this, {spritesheet, xStart, yStart, width, height,
            frameCount, frameDuration, framePadding, reverse, loop});

        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;

    }

    /**
     *
     * @param {number} tick the elapsed time since the last tick
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x the x position to draw at.
     * @param {number} y the y position to draw at.
     * @param {number} scale the scaling factor of the image, defaults to 1
     */
    drawFrame(tick, ctx, x, y, scale = 1) {
        this.elapsedTime  += tick;

        if(this.isDone()) {
            if(this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                console.error("Attempted to draw a complete animation");
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;

        ctx.drawImage(this.spritesheet,
            this.xStart + frame * (this.width + this.framePadding), this.yStart,
            this.width, this.height,
            x, y,
            this.width * scale,
            this.height * scale);
    }

    /**
     * @returns {number} the number of the current frame in the animation.
     */
    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    }

    /**
     * @returns {boolean} true if the animation is complete.
     */
    isDone() {
        return this.elapsedTime >= this.totalTime;
    }
}
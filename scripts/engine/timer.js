"use strict";

/**
 * Keeps track of time elapsed between frames.
 */
class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
    }

    /**
     * @returns {number} the amount of time in seconds since the last tick.
     */
    tick() {
        const current = Date.now();
        const delta = (current - this.lastTimestamp) / 1000;
        this.lastTimestamp = current;

        const gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;
        return gameDelta;
    }
}

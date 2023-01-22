'use strict';

/**
 * Manages the scene, moves the camera to follow the player.
 *
 * @author
 */
class SceneManager {
    constructor(game) {
        /**
         * Reference to the game engine
         */
        this.game = game;
        this.game.camera = this;
        this.pos = new Vec2(0 ,0);
    }

    /**
     * Sets the position of the camera to center the player in the screen
     */
    update() {
        let midpointX = WIDTH/2;
        let midpointY = HEIGHT/2;
        this.pos.x = doug.getCenter().x - midpointX;
        this.pos.y = doug.getCenter().y - midpointY;
    }

    //Don't delete
    draw() {

    }
}
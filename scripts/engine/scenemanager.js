'use strict';

class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

    }

    update() {
        let midpointX = WIDTH/2;
        let midpointY = HEIGHT/2;
        this.x = player.getCenter().x - midpointX;
        this.y = player.getCenter().y - midpointY;
    }

    draw() {

    }
}
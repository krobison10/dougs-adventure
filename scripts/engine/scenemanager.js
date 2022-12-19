'use strict';

class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.pos = new Vec2(0 ,0);
    }

    update() {
        let midpointX = WIDTH/2;
        let midpointY = HEIGHT/2;
        this.pos.x = player.getCenter().x - midpointX;
        this.pos.y = player.getCenter().y - midpointY;
    }

    //Don't delete
    draw() {

    }
}
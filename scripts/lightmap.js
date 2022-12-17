"use strict";

let ambientValue = 70;
let lightValue = rgba(ambientValue, ambientValue, ambientValue, 1);

class LightMap {

    constructor() {
        this.lightmask = document.createElement('canvas');
        this.lightmask.width = 1024;
        this.lightmask.height = 768;

        this.renderingCtx = this.lightmask.getContext("2d");
        this.lightSources = [];
    }

    addLightSource(src) {
        this.lightSources.push(src);
    }

    update() {
        this.renderingCtx.clearRect(0, 0, 1024, 768);

        //Apply ambient light value to mask again
        this.renderingCtx.fillStyle = lightValue;
        this.renderingCtx.fillRect(0 ,0, 1024, 768);

        for(let source of this.lightSources) {
            source.update();
            source.draw(this.renderingCtx);
        }
    }

    draw(ctx) {

        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(this.lightmask, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
    }
}
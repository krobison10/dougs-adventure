"use strict";

/**
 * Handles drawing of the lightmap which can apply darkness as well as
 * artificial light to the world. Works as an entity that must be added
 * to the entities of the game engine to function.
 *
 * @author Kyler Robison
 */
class LightMap {

    constructor() {
        /**
         * The alpha value of the mask, 1 is complete darkness and 0 is complete light.
         * @type {number}
         */
        this.alpha = 0;

        this.lightmask = document.createElement('canvas');
        this.lightmask.width = WIDTH;
        this.lightmask.height = HEIGHT;

        this.renderingCtx = this.lightmask.getContext("2d");
        this.renderingCtx.globalCompositeOperation = 'lighten';

        this.lightSources = [];

        //this.setColor(new RGBColor(20, 20, 100));
        this.setColor(new RGBColor(20, 20, 40));
        this.setLightValue();

        this.gameTime = 4.5 * 60;
        this.dayTime = true;
        this.lastTime = Date.now();
    }

    /**
     * Adds a light source to the map, light will be included on the next draw.
     * @param {LightSource} source the light source to be added.
     */
    addLightSource(source) {
        this.lightSources.push(source);
    }

    /**
     * Removes a light source from the map, will be removed from the next and all future draws.
     * @param {LightSource} lightSource the lightsource to remove.
     */
    removeLightSource(lightSource) {
        this.lightSources.splice(this.lightSources.indexOf(lightSource), 1);
    }


    /**
     * Updates the mask to be ready for the next draw, if a light source is marked for
     * removal, it will be excluded from the next draw.
     */
    update() {
        this.updateTime();

        //comment this out and set the alpha in the constructor if you want to cancel day/night cycle
        //this.updateAlpha();

        this.renderingCtx.clearRect(0, 0, WIDTH, HEIGHT);

        this.setLightValue();

        //Apply ambient light value to mask again
        this.renderingCtx.fillStyle = this.lightValue;
        this.renderingCtx.fillRect(0 ,0, WIDTH, HEIGHT);

        for (let i = this.lightSources.length - 1; i >= 0; --i) {
            if (this.lightSources[i].removeFromWorld) {
                this.lightSources.splice(i, 1); // Delete element at i
            } else {
                this.lightSources[i].update();
                this.lightSources[i].drawLight(this.renderingCtx);
            }
        }
    }

    updateTime() {
        this.gameTime = this.gameTime + (Date.now() - this.lastTime) / 500;
        this.lastTime = Date.now();
        if(this.gameTime > (24 * 60)) {
            this.gameTime = 0;
        }
    }

    updateAlpha() {
        const sunrise = 4 * 60;
        const sunset = 20 * 60;
        const fade = 30;

        this.dayTime = (this.gameTime >= sunrise && this.gameTime <= sunset);
        console.log("Day: " + this.dayTime);

        if(this.gameTime >= sunrise + fade && this.gameTime <= sunset - fade) {
            //complete day
            this.alpha = 0;
        }
        else if (this.gameTime > sunset + fade || this.gameTime < sunrise - fade) {
            //complete night
            this.alpha = 1;
        }
        else {
            //transition
            if(this.gameTime >= sunrise - fade && this.gameTime <= sunrise + fade) {
                //sunrise
                this.alpha = (sunrise + fade - this.gameTime) / (2 * fade);
            }
            else {
                //sunset
                this.alpha = 1 - (sunset + fade - this.gameTime) / (2 * fade);
            }

        }
    }

    draw(ctx) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(this.lightmask, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
    }

    /**
     * Sets the color of the mask, essentially, the color of the darkness.
     * @param {RGBColor | Object } color an RGBColor or any object that contains r, g, and b values.
     */
    setColor(color) {
        this.color = new RGBColor(color.r, color.g, color.b);
    }

    /**
     * Sets the RGBA color of the mask using the current RGB color.
     */
    setLightValue() {
        this.lightValue = rgba(this.color.r, this.color.g, this.color.b, this.alpha);
    }
}
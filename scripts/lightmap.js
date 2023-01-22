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
        this.alpha = 1;
        /**
         * The light mask entity that applies darkness to the world
         * @type {HTMLCanvasElement}
         */
        this.lightmask = document.createElement('canvas');
        this.lightmask.width = WIDTH;
        this.lightmask.height = HEIGHT;

        /**
         * Rendering context for adding light sources to the light mask
         * @type {CanvasRenderingContext2D}
         */
        this.renderingCtx = this.lightmask.getContext("2d");
        this.renderingCtx.globalCompositeOperation = 'lighten';

        /**
         * The light sources of the game
         * @type {LightSource[]}
         */
        this.lightSources = [];

        //this.setColor(new RGBColor(20, 20, 100));
        this.setColor(new RGBColor(20, 20, 40));
        this.setLightValue();

        /**
         * Indicates whether it is day or night.
         * @type {boolean}
         */
        this.dayTime = true;
        /**
         * Represents the time at which the last update of lightmap occurred.
         * @type {number}
         */
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
        this.updateAlpha();

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

    /**
     * Updates the game time, 1 real life second equals 2 in game minutes.
     */
    updateTime() {
        gameTime = gameTime + (Date.now() - this.lastTime) / 250;
        this.lastTime = Date.now();
        if(gameTime > (24 * 60)) {
            gameTime = 0;
        }
    }

    /**
     * Updates the alpha of the lightmap based on the game time.
     */
    updateAlpha() {
        //Sunrise time (5am)
        const sunrise = 4 * 60;
        //Sunset time (9pm)
        const sunset = 20 * 60;
        //Amount of minutes around sunrise and sunset that the lighting will transition during.
        const fade = 30;

        //Update the flag that indicates day/night
        this.dayTime = (gameTime >= sunrise && gameTime <= sunset);

        if(gameTime >= sunrise + fade && gameTime <= sunset - fade) {
            //complete day
            this.alpha = 0;
        }
        else if (gameTime > sunset + fade || gameTime < sunrise - fade) {
            //complete night
            this.alpha = 1;
        }
        else {
            //transition
            if(gameTime >= sunrise - fade && gameTime <= sunrise + fade) {
                //sunrise
                this.alpha = (sunrise + fade - gameTime) / (2 * fade);
            }
            else {
                //sunset
                this.alpha = 1 - (sunset + fade - gameTime) / (2 * fade);
            }
        }
    }

    /**
     * Draws the lightmap on to the actual game canvas
     * @param ctx
     */
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
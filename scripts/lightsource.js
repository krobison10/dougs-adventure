"use strict";

class LightSource {
    /**
     * Creates a light source object.
     * @param {number} magnitude the intensity of the light, influences the radius. Note that colors
     * other than white will appear to be dimmer, because rgb is additive.
     * @param {number} x the x position for stationary lights.
     * @param {number} y the y position for stationary lights.
     * @param {any} attachTo the object to attach the light to, light will follow it dynamically.
     * The object must implement a getCenter() method.
     * @param {RGBColor | Object} color color of the light source.
     */
    constructor(magnitude, x, y, attachTo,
                color = new RGBColor(255, 255, 255)) {
        Object.assign(this, {magnitude, x, y, attachTo, color});
        this.removeFromWorld = false;
    }

    update() {
        if (this.attachTo) {
            this.x = this.attachTo.getCenter().x;
            this.y = this.attachTo.getCenter().y;
        }
    }

    draw(ctx) {
        let innerRadius = 0;
        let outerRadius = 255 * this.magnitude;

        let gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);

        this.smoothGradient(gradient, 20);

        ctx.beginPath(); //Very, very important line, do not remove
        ctx.arc(this.x, this.y, outerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    //Definitely should update
    smoothGradient(gradient, steps) {
        for(let i = 1; i <= steps; i++) {
            let intensity =  -Math.log10(i/steps) * this.magnitude * lightMap.alpha;
            gradient.addColorStop(i/steps, rgba(this.color.r, this.color.g, this.color.b, intensity));
        }
    }
}
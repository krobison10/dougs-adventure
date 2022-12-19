"use strict";

/**
 *
 * @author Kyler Robison
 */
class LightSource extends Entity{
    /**
     * Creates a light source.
     * @param {number} magnitude the intensity of the light, influences the radius. Note that colors
     * other than white will appear to be dimmer, because rgb is additive.
     * @param {number} x the x position for stationary lights.
     * @param {number} y the y position for stationary lights.
     * @param {Object} attachTo the object to attach the light to, light will follow it dynamically.
     * The object must implement a getCenter() method.
     * @param {RGBColor | Object} color color of the light source, object must have an r, g, and b field.
     * @param {number} scale influences the radius of the light. Higher values than the default will cause
     * the light to be more spread out and softer while smaller values will make the light smaller
     * and harder. It's best to leave this default unless there is a good reason not to.
     */
    constructor(magnitude, x, y, attachTo,
                color = new RGBColor(255, 255, 255), scale = 80) {
        super(x, y);
        Object.assign(this, {magnitude, attachTo, color, scale});
    }

    update() {
        if (this.attachTo) {
            this.x = this.attachTo.getCenter().x;
            this.y = this.attachTo.getCenter().y;
        }
    }

    draw(ctx) {
        let outerRadius = this.scale * Math.pow(this.magnitude + 1, 2);

        let gradient = ctx.createRadialGradient(this.getScreenPos().x, this.getScreenPos().y, 0,
            this.getScreenPos().x, this.getScreenPos().y, outerRadius);

        this.smoothGradient(gradient, 20);

        ctx.beginPath(); //Very, very important line, do not remove
        ctx.arc(this.getScreenPos().x, this.getScreenPos().y, outerRadius, 0, 2 * Math.PI);
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
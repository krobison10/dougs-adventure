"use strict";

/**
 *
 * @author Kyler Robison
 */
class LightSource extends Entity {
    /**
     * Creates a light source.
     * @param {number} magnitude the intensity of the light, influences the radius.
     * @param {Vec2} pos the position of the light.
     * @param {Entity} attachTo the object to attach the light to, light will follow it dynamically.
     * The object must implement a getCenter() method.
     * @param {RGBColor} color color of the light source. Note that using colors
     * other than white will appear to be dimmer, because rgb is additive. Update magnitude accordingly.
     * @param {number} scale influences the radius of the light. Higher values than the default will cause
     * the light to be more spread out and softer while smaller values will make the light smaller
     * and harder. It's best to leave this default unless there is a good reason not to.
     */
    constructor(magnitude, pos = new Vec2(0, 0), attachTo = null,
                color = new RGBColor(255, 255, 255), scale = 80) {

        super(pos, new Dimension(0, 0)); //0 size because position and center are the same in this case
        Object.assign(this, {magnitude, attachTo, color, scale});
    }

    update() {
        if(this.attachTo) {
            if(this.attachTo.removeFromWorld) return this.removeFromWorld = true;
            this.pos.x = this.attachTo.getCenter().x;
            this.pos.y = this.attachTo.getCenter().y;
        }
    }

    draw(ctx) {
        console.error("Light sources must be added to the lightmap, not the entity list");
    }

    drawLight(ctx) {
        let outerRadius = this.scale * Math.pow(this.magnitude + 1, 2);

        let gradient = ctx.createRadialGradient(this.getScreenPos().x, this.getScreenPos().y, 0,
            this.getScreenPos().x, this.getScreenPos().y, outerRadius);

        this.smoothGradient(gradient, 20);

        ctx.beginPath(); //Very, very important line, do not remove
        ctx.arc(this.getScreenPos().x, this.getScreenPos().y, outerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    smoothGradient(gradient, steps) {
        for(let i = 1; i <= steps; i++) {
            let intensity =  -Math.log10(i/steps) * this.magnitude * lightingSystem.alpha;
            gradient.addColorStop(i/steps, rgba(this.color.r, this.color.g, this.color.b, intensity));
        }
    }
}

/**
 * A light source that pulses, to be used for anything that burns.
 *
 * @author Kyler Robison
 */
class FlickeringLightSource extends LightSource {
    /**
     * Creates a flickering light source.
     * @param {number} magnitude the intensity of the light, influences the radius.
     * @param {Vec2} pos the position of the light.
     * @param {Entity} attachTo the object to attach the light to, light will follow it dynamically.
     * The object must implement a getCenter() method.
     * @param {RGBColor} color color of the light source. Note that using colors
     * other than white will appear to be dimmer, because rgb is additive. Update magnitude accordingly.
     * @param {number} scale influences the radius of the light. Higher values than the default will cause
     * the light to be more spread out and softer while smaller values will make the light smaller
     * and harder. It's best to leave this default unless there is a good reason not to.
     */
    constructor(magnitude, pos = new Vec2(0, 0), attachTo = null,
                color = new RGBColor(255, 255, 255), scale = 80) {
        super(magnitude, pos, attachTo, color, scale);

        //Constants that control behavior
        this.growSpeed = 0.12;
        this.shrinkSpeed = .03;
        this.maxMagnitude = this.magnitude * 1.05;
        this.minMagnitude = this.magnitude * 0.93;

        this.targetMagnitude = this.magnitude;
        this.grow = randomInt(2) === 1;

    }

    update() {
        super.update();
        if(this.grow) {
            if(this.magnitude >= this.targetMagnitude) {
                //stop growing, start shrinking
                this.targetMagnitude = this.pickShrinkTarget();
                this.grow = false;
            } else {
                //keep growing
                this.magnitude += this.growSpeed * gameEngine.clockTick;
            }
        } else {
            if(this.magnitude <= this.targetMagnitude) {
                //stop shrinking, start growing
                this.targetMagnitude = this.pickGrowTarget();
                this.grow = true;
            }
            else {
                //keep shrinking
                this.magnitude -= this.shrinkSpeed * gameEngine.clockTick;
            }
        }
    }

    /**
     * Picks a magnitude to shrink to in the lower half of the range allowed by the parameters of the light.
     * @returns {number}
     */
    pickShrinkTarget() {
        let range = (this.maxMagnitude - this.minMagnitude) / 2;
        return this.minMagnitude + Math.random() * range;
    }

    /**
     * Picks a magnitude to grow to in the upper half of the range allowed by the parameters of the light.
     * @returns {number}
     */
    pickGrowTarget() {
        let range = (this.maxMagnitude - this.minMagnitude) / 2;
        return this.maxMagnitude - Math.random() * range;
    }
}
"use strict";

class LightSource {
    constructor(magnitude, x, y, attachTo) {
        Object.assign(this, {magnitude, x, y, attachTo});
    }

    update() {
        if (this.attachTo) {
            this.x = this.attachTo.getCenter().x;
            this.y = this.attachTo.getCenter().y;
        }
    }

    draw(ctx) {

        let innerRadius = 5;
        let outerRadius = this.magnitude;

        let gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);
        gradient.addColorStop(0, rgba(252, 243, 200, 1));
        gradient.addColorStop(1, lightValue);

        ctx.beginPath(); //Very, very important line, do not remove
        ctx.arc(this.x, this.y, this.magnitude, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}
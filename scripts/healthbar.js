/**
 * A health bar to be placed under entities.
 *
 * @author Kyler Robison
 */
class HealthBar extends Entity {
    /**
     * Creates a new health bar.
     * @param {Character} agent the entity to attach it to.
     */
    constructor(agent) {
        super(agent.pos, new Dimension(50, 10));
        this.agent = agent;
        this.bottomGap = 5;
        this.offset = this.agent.size.w - this.size.w;
        this.innerPadding = 1;
    }

    draw(ctx) {
        let healthLevel = this.agent.hitPoints / this.agent.maxHitPoints;
        if(healthLevel >= 1) {
            return;
        }

        let screenPos = this.agent.getScreenPos();

        let c = getHealthColor(healthLevel);

        ctx.fillStyle = rgba(50, 50, 50, 0.7);

        ctx.fillRect(
            screenPos.x + this.offset / 2 + this.innerPadding,
            screenPos.y + this.agent.size.h + this.innerPadding + this.bottomGap,
            this.size.w - 2 * this.innerPadding, this.size.h - 2 * this.innerPadding);


        ctx.fillStyle = rgba(c.r, c.g, c.b, 1);

        ctx.fillRect(screenPos.x + this.offset / 2, screenPos.y + this.agent.size.h + this.bottomGap,
            this.size.w * healthLevel, this.size.h);


        ctx.strokeStyle = rgba(40, 40, 40, 1);
        ctx.lineWidth = '2.5';

        ctx.strokeRect(screenPos.x + this.offset / 2, screenPos.y + this.agent.size.h + this.bottomGap,
            this.size.w * healthLevel, this.size.h);
    }

    update() {
        if(this.agent.removeFromWorld) {
            this.removeFromWorld = true;
        }
    }
}

/**
 * @param {number} ratio of health to max health.
 * @returns {RGBColor} color of the health bar.
 */
function getHealthColor(ratio) {
    if(ratio > 1) ratio = 1;
    if(ratio < 0) ratio = 0;

    let color = new RGBColor(0, 0,0);
    color.r = (ratio >= 0.5 ? (1 - ratio) * 2 * 255 : 255);
    color.g = (ratio <= 0.5 ? 255 * ratio * 2 : 255);
    return color;
}
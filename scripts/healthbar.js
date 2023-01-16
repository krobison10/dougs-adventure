class HealthBar extends Entity {
    constructor(agent) {
        super(new Vec2(0, 0), new Dimension(0, 0));
        this.agent = agent;
        this.width = 50;
        this.height = 10;
        this.offset = this.agent.size.w - this.width;
        this.innerPadding = 1;
    }

    update() {

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
            screenPos.y + this.agent.size.h + this.innerPadding,
            this.width - 2 * this.innerPadding, this.height - 2 * this.innerPadding);


        ctx.fillStyle = rgba(c.r, c.g, c.b, 1);

        ctx.fillRect(screenPos.x + this.offset / 2, screenPos.y + this.agent.size.h,
            this.width * healthLevel, this.height);


        ctx.strokeStyle = rgba(40, 40, 40, 1);
        ctx.lineWidth = '2.5';

        ctx.strokeRect(screenPos.x + this.offset / 2, screenPos.y + this.agent.size.h,
            this.width * healthLevel, this.height);
    }

}

function getHealthColor(ratio) {
    if(ratio > 1) ratio = 1;
    if(ratio < 0) ratio = 0;

    let color = new RGBColor(0, 0,0);
    color.r = (ratio >= 0.5 ? (1 - ratio) * 2 * 255 : 255);
    color.g = (ratio <= 0.5 ? 255 * ratio * 2 : 255);
    return color;
}
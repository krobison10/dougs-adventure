'use strict'


class Torch extends Entity {
    constructor(pos) {
        super(pos, new Dimension(30, 48));
        this.animation = new Animator(ASSET_MANAGER.getAsset(
                "../sprites/fires/orange/loops/burning_loop_3.png"),
            0,
            0,
            30,
            48,
            6,
            0.1,
            0,
            false,
            true);

        this.lightSource = new FlickeringLightSource(
            0.7,
            new Vec2(this.pos.x + 16, this.pos.y + 40),
            null,
            new RGBColor(252, 146, 83), 60);

        lightMap.addLightSource(this.lightSource);
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset("../sprites/fires/torch_stem.png"),
            0, 0, 4, 16,
            this.getScreenPos().x + 12, this.getScreenPos().y + 42, 8, 32);
        this.animation.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}


class CampFire extends Entity{
    constructor(pos) {
        super(pos, new Dimension(48, 64));
        this.animation = new Animator(ASSET_MANAGER.getAsset(
                "../sprites/fires/orange/loops/burning_loop_1.png"),
            0,
            0,
            48,
            64,
            6,
            0.1,
            0,
            false,
            true);

        this.lightSource = new FlickeringLightSource(
            0.9,
            new Vec2(this.pos.x + 25, this.pos.y + 54),
            null,
            new RGBColor(252, 146, 83), 60);

        lightMap.addLightSource(this.lightSource);
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset("../sprites/firepit.png"),
            0, 0, 64, 44,
            this.getScreenPos().x + 4, this.getScreenPos().y + 50, 40, 28);
        this.animation.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}
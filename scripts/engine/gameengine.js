"use strict";


/**
 * @author Chris Marriott
 */
class GameEngine {
    
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [[], [], [], [], [], []];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        this.camera = new SceneManager(this);
        this.addEntity(this.camera, Layers.UI);

        // Options and the Details
        this.options = options || {
            debugging: false,
        }

        this.fps = 0;
        this.frameCount = 0;
        this.startCount = Date.now();
    }

    init(ctx) {
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = false;
        this.startInput();
        this.timer = new Timer();
    }

    /**
     * Begins the update-render loop
     */
    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop(); //Updates for the frame
            requestAnimFrame(gameLoop, this.ctx.canvas); //Recurses when the browser is finished drawing
        }
        gameLoop();
    }

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keydown", event => {
            this.keys[event.key] = true;
            if(event.key === " ") {
                event.preventDefault();
            }
        });
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    }

    /**
     * Adds a new entity to the engine.
     * @param {Entity | LightMap | SceneManager} entity the entity to add.
     * @param {number} layer
     */
    addEntity(entity, layer = Layers.FOREGROUND) {
        if(layer < 0 || layer >= 6) {
            throw new Error("GameEngine: invalid entity layer specified");
        }
        this.entities[layer].push(entity);
    }

    /**
     * Draws all the entities.
     */
    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        //----Code to draw each layer individually for performance control----//

        let i = Layers.BACKGROUND;
        for (let j = this.entities[i].length - 1; j >= 0; j--) {
            if(shouldDraw(this.entities[i][j])) this.entities[i][j].draw(this.ctx);
        }

        i = Layers.GROUND;
        for (let j = this.entities[i].length - 1; j >= 0; j--) {
            if(shouldDraw(this.entities[i][j])) this.entities[i][j].draw(this.ctx);
        }

        i = Layers.FOREGROUND;
        for (let j = this.entities[i].length - 1; j >= 0; j--) {
            if(shouldDraw(this.entities[i][j]) && !(this.entities[i][j] instanceof Dragon)) {
                this.entities[i][j].draw(this.ctx);
            }
        }
        for(let ent of this.entities[i]) {
            if(ent instanceof Dragon || ent instanceof Demon) {
                if(shouldDraw(ent)) ent.draw(this.ctx);
            }
        }

        i = Layers.LIGHTMAP;
        for (let j = this.entities[i].length - 1; j >= 0; j--) {
            this.entities[i][j].draw(this.ctx);
        }

        i = Layers.GLOWING_ENTITIES;
        for (let j = this.entities[i].length - 1; j >= 0; j--) {
            if(shouldDraw(this.entities[i][j])) this.entities[i][j].draw(this.ctx);
        }

        i = Layers.UI;
        for (let j = this.entities[i].length - 1; j >= 0; j--) {
            this.entities[i][j].draw(this.ctx);
        }
    }

    /**
     * Updates all the entities then removes them if necessary.
     */
    update() {
        //----Code to draw each layer individually for performance control----//

        let layer = this.entities[Layers.BACKGROUND];
        let entitiesCount = layer.length;

        layer = this.entities[Layers.GROUND];
        entitiesCount = layer.length;
        //Sort entities by Y coord, backwards because of drawing oder in draw()
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];
            if (!entity.removeFromWorld && shouldUpdate(entity)) {
                entity.update();
            }
        }

        layer = this.entities[Layers.FOREGROUND];
        entitiesCount = layer.length;
        //Sort entities by Y coord, backwards because of drawing oder in draw()
        layer.sort((entA, entB) => entB.pos.y - entA.pos.y);
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];
            if (!entity.removeFromWorld && shouldUpdate(entity)) {
                entity.update();
            }
        }

        layer = this.entities[Layers.LIGHTMAP];
        entitiesCount = layer.length;
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];
            //Always update, lightmap will never be removed
            entity.update();
        }

        layer = this.entities[Layers.GLOWING_ENTITIES];
        entitiesCount = layer.length;
        //Sort commented out until need to sort arises
        //layer.sort((entA, entB) => entB.pos.y - entA.pos.y);
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];
            if (shouldUpdate(entity)) {
                entity.update();
            }
        }

        layer = this.entities[Layers.UI];
        entitiesCount = layer.length;
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }


        //Delete eligible entities
        for(let layer of this.entities) {
            for (let i = layer.length - 1; i >= 0; --i) {
                if (layer[i].removeFromWorld) {
                    layer.splice(i, 1); // Delete element at i
                }
            }
        }
    }

    /**
     * Basic functions to be executed for each frame.
     */
    loop() {
        //Sets the focus of the canvas so that clicking it won't be required
        this.ctx.canvas.focus();
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
        this.countFPS();
        this.click = null;
        log.update();
    }

    countFPS() {
        this.frameCount++;
        if(timeInSecondsBetween(Date.now(), this.startCount) >= 1) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.startCount = Date.now();
        }
    }
}
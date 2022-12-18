"use strict";

class GameEngine {
    
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        this.camera = new SceneManager(this);
        this.addEntity(this.camera);

        // Options and the Details
        this.options = options || {
            debugging: false,
        }
    }

    init(ctx) {
        this.ctx = ctx;
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
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    }

    /**
     * Adds a new entity to the engine.
     * @param entity the entity to add.
     */
    addEntity(entity) {
        this.entities.push(entity);
    }

    /**
     * Draws all the entities.
     */
    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw the latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }
    }


    /**
     * Updates all the entities then removes them if necessary.
     */
    update() {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1); // Delete element at i
            }
        }

        //Definitely do not use this on the entire entity list
        //this.entities.sort((entA, entB) => entA.positionY - entB.positionY);
    }

    /**
     * Basic functions to be executed for each frame.
     */
    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    }

}
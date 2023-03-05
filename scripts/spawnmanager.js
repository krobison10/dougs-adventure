class SpawnManager {
    static minRadius = 700;
    static maxRadius = 2000;
    static despawnDist = 2200;
    static baseEntityTarget = 30;
    static table = {
        1: {
            class: Bat,
            size: new Dimension(32, 32),
            density: 20,
            night: true,
            day: false
        },
        2: {
            class: Slime,
            size: new Dimension(55, 37),
            density: 40,
            night: true,
            day: true,
        },
        3: {
            class: Wolf,
            size: new Dimension(32, 64),
            density: 0,
            night: true,
            day: true
        },
        4: {
            class: Bunny,
            size: new Dimension(26, 22),
            density: 25,
            night: false,
            day: true
        },
        5: {
            class: WolfPack,
            size: new Dimension(64*3, 64*3),
            density: 4,
            night: true,
            day: true
        },
        6: {
            class: BearBoss,
            size: new Dimension(84, 84),
            density: 4,
            night: true,
            day: true
        }

    }
    static totalDensity = Object.values(SpawnManager.table).reduce((sum, type) => sum + type.density, 0);

    constructor() {
        this.entityList = [];
        this.entityTarget = SpawnManager.baseEntityTarget;
        this.pickEntityCode();
        for(let type in SpawnManager.table) {
            SpawnManager.table[type].densityRatio = SpawnManager.table[type].density / SpawnManager.totalDensity;
        }
    }
    update() {
        this.updateEntities();
    }

    reset() {
        this.entityList.forEach(entity => entity.removeFromWorld = true);
        this.entityList.length = 0;
        this.updateEntities();
    }

    updateEntities() {
        // Search and despawn
        for (let i = this.entityList.length - 1; i >= 0; --i) {
            if(getDistance(doug.getCenter(), this.entityList[i].getCenter()) > SpawnManager.despawnDist) {
                this.entityList[i].removeFromWorld = true;
                this.entityList.splice(i, 1);
            }
        }

        //Spawn more if needed
        while (this.entityList.length < this.entityTarget) {
            let timeValid = false;
            while(!timeValid) {
                //Create instance of entity type with null position for now
                const key = this.pickEntityCode();
                let pos = null;

                //Try different points until successful
                let valid = false;
                while(!valid) {
                    pos = radiusPickPoint(doug.getCenter(), SpawnManager.minRadius, SpawnManager.maxRadius);

                    const testBox = new BoundingBox(pos, SpawnManager.table[key].size);
                    valid = !this.checkObstacles(testBox);
                }
                if((lightingSystem.dayTime && SpawnManager.table[key].day)
                    || (!lightingSystem.dayTime && SpawnManager.table[key].night)) {

                    const entityClass = SpawnManager.table[key].class;
                    const entity = new entityClass(pos);

                    gameEngine.addEntity(entity, (entity instanceof Bunny ? Layers.GROUND : Layers.FOREGROUND));
                    this.entityList.push(entity);
                    timeValid = true;
                }
            }
        }
    }

    checkObstacles(bb) {
        const list = gameEngine.entities[Layers.FOREGROUND];
        for(let entity of list) {
            if(entity.boundingBox && bb.collide(entity.boundingBox)) return true;
        }
    }

    pickEntityCode() {
        const randomValue = Math.random();
        let accumulatedRatio = 0;

        for (const key in SpawnManager.table) {
            const type = SpawnManager.table[key];
            accumulatedRatio += type.densityRatio;

            if (randomValue <= accumulatedRatio) {
                return key;
            }
        }
    }
}
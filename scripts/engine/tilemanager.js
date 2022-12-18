"use strict";

class TileManager {
    constructor(game) {
        this.game = game;
        this.data = new Array(100);
        this.data.map(data => data = new Array(100));

        this.loadMapData("mapdata.txt");
    }

    loadMapData(filename) {
        const fs = require("fs");
        fs.readFile("mapdata.txt", (err, data) => {
            if (err) throw err;
            console.log(data.toString());
        })
    }

    fillArray(text) {
        let row = 0, col = 0, ctr = 0;
        while(row < 100) {
            while(col < 100) {
                if(text[ctr] === '\n') {
                    ctr++;
                    continue;
                }
                this.data[row][col] = text[ctr++];
            }
        }
        console.log(this.data);
    }

    getData() {
        return this.data;
    }
}
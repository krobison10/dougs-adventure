"use strict";

class AssetManager {

    constructor() {
        /**
         * Number of successful downloads by the manager.
         * @type {number}
         */
        this.successCount = 0;
        /**
         * Number of failed downloads by the manager.
         * @type {number}
         */
        this.errorCount = 0;
        /**
         * Stores the asset images, accessible by path.
         * @type {HTMLImageElement[]}
         */
        this.cache = [];
        /**
         * Stores the paths of the assets to be downloaded.
         * @type {string[]}
         */
        this.downloadQueue = [];
    }

    /**
     * Adds the asset to the download queue.
     * @param {string} path the location of the image.
     */
    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    }

    /**
     * @returns {boolean} true if all the downloads are complete.
     */
    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    }

    /**
     * Starts downloads of all the assets added to the download queue.
     * @param {function} callback function to be executed after the downloads are all complete (or failed).
     */
    downloadAll(callback) {
        for (let i = 0; i < this.downloadQueue.length; i++) {
            const img = new Image();

            const path = this.downloadQueue[i];
            console.log(path);

            img.addEventListener("load", () => {
                console.log("Loaded " + img.src);
                this.successCount++;
                if (this.isDone()) callback();
            });

            img.addEventListener("error", () => {
                console.log("Error loading " + img.src);
                this.errorCount++;
                if (this.isDone()) callback();
            });

            img.src = path;
            this.cache[path] = img;
        }
    }

    /**
     * @param {string} path the path of the asset.
     * @returns {HTMLImageElement} the image.
     */
    getAsset(path) {
        return this.cache[path];
    }
}


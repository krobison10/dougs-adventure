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
         * Stores the assets, accessible by path.
         * @type {HTMLImageElement[] | Audio[]}
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


            const path = this.downloadQueue[i];
            console.log(path);
            const ext = path.substring(path.length - 3);

            switch(ext) {
                case 'jpg':
                case 'png':
                    const img = new Image();
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
                    break;

                case 'mp3':
                case 'mp4':
                case 'wav':
                    const aud = new Audio();
                    aud.addEventListener("loadeddata", () => {
                        console.log("Loaded " + aud.src);
                        this.successCount++;
                        if (this.isDone()) callback();
                    });

                    aud.addEventListener("error", () => {
                        console.log("Error loading " + aud.src);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });

                    aud.addEventListener("ended", () =>{
                        aud.pause();
                        aud.currentTime = 0;
                    })

                    aud.src = path;
                    aud.load();

                    this.cache[path] = aud;
                    break;

            }


        }
    }

    /**
     * @param {string} path the path of the asset.
     * @returns {HTMLImageElement} the image.
     */
    getAsset(path) {
        return this.cache[path];
    }

    /**
     * Plays the specified audio asset.
     * @param {string} path the path of the audio asset.
     */
    playAsset(path) {
        let audio = this.cache[path];
        audio.currentTime = 0;
        audio.play();
    }

    /**
     * Sets the volume of all the audio assets.
     * @param {number} volume FINISH DOC
     */
    setVolume(volume) {
        for (let key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.volume = volume;
            }
        }
    }

    /**
     * Pauses and resets all audio assets.
     */
    pauseBackgroundMusic() {
        for (let key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.pause();
                asset.currentTime = 0;
            }
        }
    }

    /**
     * Makes an audio asset repeat upon completion.
     * @param {string} path the path to the audio asset.
     */
    autoRepeat(path) {
        const aud = this.cache[path];
        aud.addEventListener("ended", () => {
            aud.play();
        })
    }
}


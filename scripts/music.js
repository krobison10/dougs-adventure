'use strict'


class MusicManager {
    constructor() {
        this.musicStarted = false;
        /**
         *
         * @type {HTMLAudioElement[]}
         */
        this.songs = [];
    }

    setTracks() {
        this.songs.push(ASSET_MANAGER.getAsset("sounds/day_music.mp3"));
        this.songs.push(ASSET_MANAGER.getAsset("sounds/night_music.mp3"));
        this.songs.push(ASSET_MANAGER.getAsset("sounds/eerie_music.mp3"));
    }

    startMusic() {
        if(!this.musicStarted) {
            this.musicStarted = true;
            this.update();
        }
    }

    update() {
        if(lightingSystem.bloodMoon) {
            this.startTrack(ASSET_MANAGER.getAsset("sounds/eerie_music.mp3"));
        }
        else if(!lightingSystem.dayTime) {
            this.startTrack(ASSET_MANAGER.getAsset("sounds/night_music.mp3"));
        }
        else {
            this.startTrack(ASSET_MANAGER.getAsset("sounds/day_music.mp3"));
        }
    }

    /**
     *
     * @param {HTMLAudioElement} newSong
     */
    startTrack(newSong) {
        for(let song of this.songs) {
            if(song !== newSong) {
                song.pause();
                song.currentTime = 0;
            } else {
                newSong.play();
                newSong.addEventListener("ended", () => {
                    newSong.play();
                });
            }
        }
    }
}
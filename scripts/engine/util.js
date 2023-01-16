"use strict";

/** Global Parameters Object */
const params = { };

/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
const randomInt = n => Math.floor(Math.random() * n);

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

/**
 * Returns distance from two points
 * @param {Vec2} p1 first point.
 * @param {Vec2} p2 second point.
 * @returns Distance between the two points
 */
const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

class RGBColor {
    constructor(r, g, b) {
        Object.assign(this, {r, g, b});
    }
}

/**
 * Represents the layers of the game engine entities.
 */
const Layers = {
    BACKGROUND: 0,
    FOREGROUND: 1,
    LIGHTMAP: 2,
    GLOWING_ENTITIES: 3,
    UI: 4
}

/**
 * Represents a vector with an x and y component.
 */
class Vec2 {
    constructor(x, y) {
        Object.assign(this, {x, y});
    }
}

/**
 * Represents a dimension containing a width and height field.
 */
class Dimension {
    constructor(w, h) {
        Object.assign(this, {w, h});
    }
}

/**
 * Represents padding
 */
class Padding {
    constructor(top = 0, right = 0, bottom = 0, left = 0) {
        Object.assign(this, {top, right, bottom, left});
    }
}
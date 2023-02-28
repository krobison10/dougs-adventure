'use strict'

/**
 * Represents a particle for effects.
 *
 * @author Kyler Robison
 */
class Particle extends Entity {
     /**
      *
      * @param {Vec2} pos
      * @param {number} size
      * @param {RGBColor} color
      * @param {number} sizeVariance
      * @param {number} speed
      * @param {number} speedDecay
      * @param {Vec2} direction
      * @param {number} duration
      */
     constructor(pos, size, color, sizeVariance, speed, speedDecay, direction, duration) {
          super(pos, new Dimension(size, size));
          Object.assign(this, {color, sizeVariance, speed, speedDecay, direction, duration});
          this.createdTime = Date.now();
          this.velocity = this.direction;

          if(this.sizeVariance > 0) {
               let dim = (this.size.w - this.sizeVariance) + randomInt(2 * this.sizeVariance);
               this.size = new Dimension(dim, dim);
          }

          //Create random direction if none specified
          if(!direction) {
               this.direction = new Vec2(
                   Math.random() * (probability(0.5) ? 1 : -1),
                   Math.random() * (probability(0.5) ? 1 : -1)
               );
          }

          //convert direction to unit vector
          this.direction.x /= this.direction.magnitude();
          this.direction.y /= this.direction.magnitude();

          this.velocity = this.direction.clone();
          this.createdTime = Date.now();
     }

     static generateDeathParticles(centerPoint, count, radius, size, sizeVar) {
          for(let i = 0; i < count; i++) {
               const pos = getRandomPointWithinRadius(centerPoint, radius);

               let dir = null;
               if(probability(0.5)) {
                    dir = new Vec2(pos.x - centerPoint.x, pos.y - centerPoint.y);
               }

               const speed = Math.random() * 150;
               const duration = 5 + Math.random() * 4;

               const particle = new Particle(pos, size, new RGBColor(255, 0, 0),
                   sizeVar, speed, .05, dir, duration);

               gameEngine.addEntity(particle, Layers.GROUND);
          }
     }

     update() {
          //remove if duration is up
          if(timeInSecondsBetween(Date.now(), this.createdTime) > this.duration) return this.removeFromWorld = true;

          //this.speed *= 1 - (this.speedDecay * gameEngine.clockTick);
          this.speed *= Math.pow(this.speedDecay, gameEngine.clockTick);

          this.velocity.x = this.direction.x * this.speed;
          this.velocity.y = this.direction.y * this.speed;

          this.velocity.x = this.speed/Math.sqrt(2) * this.velocity.x/this.speed;
          this.velocity.y = this.speed/Math.sqrt(2) * this.velocity.y/this.speed;

          this.pos.x += this.velocity.x * gameEngine.clockTick;
          this.pos.y += this.velocity.y * gameEngine.clockTick;
     }

     draw(ctx) {
          ctx.fillStyle = this.color.toRGBstring();
          ctx.fillRect(this.getScreenPos().x, this.getScreenPos().y, this.size.w, this.size.h);
     }
}

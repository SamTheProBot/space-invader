import { GameObject } from './object';
import { distanceBetween } from '../util/distance';
import { LaserClass } from './laser';
import { PlayerCoordinates } from '../store/globalStore';
import { generateAnimation } from '../gen/animation';
import { ctx } from '../store/canvasProperty';
import { playSound } from '../util/playSound';

const noiseFactor = 50;

export class EnemyClass extends GameObject {
  constructor(positionX, positionY, MetaData) {
    super(positionX, positionY);
    this.velocity = { dx: 3, dy: 4 };
    this.verticalOffset = this.canvasHeight;
    this.positionY = positionY - this.verticalOffset;
    this.type = 'enemy';
    this.originalPositionY = positionY + 100;
    this.originalPositionX = positionX;
    this.kind = this.fireRate = 200;
    this.condition = false;
    this.targetPositionX = positionX;
    this.targetPositionY = positionY;
    this.MetaData = MetaData;
    this.width = MetaData.width;
    this.height = MetaData.height;
  }

  drawEnemy() {
    ctx.drawImage(
      this.MetaData.Image,
      this.positionX - this.width / 2,
      this.positionY,
      this.width * this.scalingFactor,
      this.height * this.scalingFactor
    );
  }

  movement() {
    if (this.verticalOffset >= 0) {
      this.verticalOffset -= this.velocity.dy;
      this.positionY += this.velocity.dy;
    } else if (this.verticalOffset < 0 && !this.condition) {
      this.velocity.dy = 0;
      this.condition = true;
    } else {
      this.positionY += this.velocity.dy;
      this.positionX += this.velocity.dx;
      if (this.positionX + this.width / 2 >= this.canvasWidth || this.positionX <= this.width / 2) {
        this.velocity.dx = -this.velocity.dx;
      } else if (this.positionY + this.height >= this.canvasHeight || this.positionY <= 0) {
        this.velocity.dy = -this.velocity.dy;
      }
    }
  }

  fire(ObjectArray) {
    if (Math.floor(Math.random() * this.fireRate) === 0 && this.condition && this.MetaData.weapon.Kind !== 'empty') {
      ObjectArray.push(
        new LaserClass(
          this.positionX - this.width / 2.2,
          this.positionY + this.height / 2,
          this.type,
          this.MetaData.weapon,
          this.locatePlayer()
        )
      );
    }
  }

  deadEffect() {
    playSound(this.MetaData.hitSound);
    generateAnimation(this.positionX, this.positionY, this.MetaData.blastAnimation);
  }

  locatePlayer() {
    let Player = PlayerCoordinates();
    const addNoise = (value) => value + (Math.random() - 0.5) * (noiseFactor / 100);
    let component = { x: 0, y: 0 };

    let diffY = Player.Y - this.positionY;
    let diffX = Player.X - this.positionX;

    let distance = distanceBetween(diffX, diffY);

    component.x = addNoise(diffX / distance);
    component.y = addNoise(diffY / distance);

    return component;
  }
}

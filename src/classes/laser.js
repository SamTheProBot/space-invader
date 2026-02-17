import { GameObject } from "./object";
import { ctx } from "../store/canvasProperty";
import { PlayerCoordinates } from "../store/globalStore";

export class LaserClass extends GameObject {
  constructor(positionX, positionY, parent, weaponData, component) {
    super(positionX, positionY);
    this.velocity = { homing: 5.5, bomb: 7.5, nuke: 0.1, bullet: 11 };
    this.type = "laser";
    this.component = component;
    this.owner = parent;
    this.height = weaponData.height;
    this.width = weaponData.width;
    this.weaponKind = weaponData.Kind;
    this.img = weaponData.Image;
    this.motion = weaponData.motion;
    this.AnimationFrame = weaponData.AnimationFrame;
    this.scalingFactor = weaponData.scalingFactor;
  }

  drawAmmo() {
    const glowColor = (() => {
      if (this.owner === "player") return "rgba(120, 200, 255, 0.35)";
      switch (this.weaponKind) {
        case "homing":
          return "rgba(120, 255, 170, 0.35)";
        case "dropbomb":
          return "rgba(255, 210, 120, 0.35)";
        case "invbullet":
          return "rgba(255, 120, 120, 0.35)";
        case "nuke":
          return "rgba(255, 160, 90, 0.35)";
        default:
          return "rgba(255, 160, 120, 0.35)";
      }
    })();

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = this.owner === "player" ? 2 : 1;
    ctx.shadowColor = glowColor;

    if (this.motion) {
      ctx.drawImage(
        this.img,
        this.width * this.frame,
        0,
        this.width,
        this.height,
        this.positionX - this.width / 2,
        this.positionY,
        this.width * this.scalingFactor,
        this.height * this.scalingFactor,
      );
    } else {
      ctx.drawImage(
        this.img,
        this.positionX - this.width / 2,
        this.positionY,
        this.width * this.scalingFactor,
        this.height * this.scalingFactor,
      );
    }
    ctx.restore();
  }

  movement() {
    switch (this.owner) {
      case "player":
        this.positionY -= this.velocity.bullet + 1;
        break;
      case "enemy":
        switch (this.weaponKind) {
          case "homing":
            this.positionX += this.velocity.homing * this.component.x;
            this.positionY += this.velocity.homing * this.component.y;
            break;
          case "dropbomb":
            this.positionY += this.velocity.bomb;
            break;
          case "invbullet":
            this.positionY += this.velocity.bullet;
            break;
          case "nuke":
            this.positionY += this.velocity.nuke * (this.positionY / 5);
            this.positionX +=
              (this.velocity.nuke * (PlayerCoordinates().X - this.positionX)) /
              10;
            break;
          default:
            break;
        }
        break;
    }
    if (this.gameframe % this.AnimationDuration === 0) {
      if (this.frame < this.AnimationFrame) this.frame++;
      else this.frame = 0;
    }
    this.gameframe++;
    if (
      this.positionX - 10 < 0 ||
      this.positionX + 10 > this.canvasWidth ||
      this.positionY < 0 ||
      this.positionY + 10 > this.canvasHeight
    )
      this.dead = true;
  }
}

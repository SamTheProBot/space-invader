import { GameObject } from "./object";
import { ctx } from "../store/canvasProperty";

export class Particle extends GameObject {
  constructor(positionX, positionY, config) {
    super(positionX, positionY);
    this.type = "particle";
    this.dead = false;
    this.velocity = { dx: config.dx || 0, dy: config.dy || 0 };
    this.life = config.life || 30;
    this.maxLife = this.life;
    this.size = config.size || 2;
    this.color = config.color || "rgba(255,255,255,1)";
    this.drag = config.drag ?? 0.96;
    this.gravity = config.gravity ?? 0;
    this.shape = config.shape || "dot";
    this.glow = config.glow || 0;
    this.composite = config.composite || "lighter";
  }

  drawParticle() {
    const alpha = Math.max(0, this.life / this.maxLife);
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = this.composite;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    if (this.glow > 0) {
      ctx.shadowBlur = this.glow;
      ctx.shadowColor = this.color;
    }
    if (this.shape === "spark") {
      const len = Math.max(4, this.size * 3);
      const angle = Math.atan2(this.velocity.dy, this.velocity.dx);
      const x2 = this.positionX - Math.cos(angle) * len;
      const y2 = this.positionY - Math.sin(angle) * len;
      ctx.lineWidth = Math.max(1, this.size * 0.6);
      ctx.beginPath();
      ctx.moveTo(this.positionX, this.positionY);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(this.positionX, this.positionY, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  movement() {
    this.positionX += this.velocity.dx;
    this.positionY += this.velocity.dy;
    this.velocity.dx *= this.drag;
    this.velocity.dy = this.velocity.dy * this.drag + this.gravity;
    this.size *= 0.985;
    this.life -= 1;
    if (this.life <= 0 || this.size <= 0.2) {
      this.dead = true;
    }
  }
}

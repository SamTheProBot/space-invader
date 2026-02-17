import { Particle } from "../classes/particle";
import { PushArray } from "../store/globalStore";

const rand = (min, max) => Math.random() * (max - min) + min;

const spawn = (x, y, config, count) => {
  for (let i = 0; i < count; i++) {
    const angle = rand(config.angle[0], config.angle[1]);
    const speed = rand(config.speed[0], config.speed[1]);
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    PushArray(
      new Particle(x, y, {
        dx,
        dy,
        life: rand(config.life[0], config.life[1]),
        size: rand(config.size[0], config.size[1]),
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        drag: config.drag,
        gravity: config.gravity,
        shape: config.shape,
        glow: config.glow,
        composite: config.composite,
      }),
    );
  }
};

export const spawnThruster = (x, y, intensity = 1) => {
  spawn(
    x,
    y,
    {
      angle: [Math.PI * 0.5 + 0.35, Math.PI * 0.5 - 0.35],
      speed: [1.6 * intensity, 3.4 * intensity],
      life: [18, 32],
      size: [1.2, 2.4],
      colors: ["rgba(240,150,0,0.9)", "rgba(240,150,0,0.7)"],
      drag: 0.9,
      gravity: 0.05,
      shape: "dot",
      glow: 8,
      composite: "lighter",
    },
    4,
  );
};

export const spawnExplosion = (x, y, palette = "orange", scale = 1) => {
  const colors =
    palette === "green"
      ? ["rgba(120,255,170,0.9)", "rgba(80,220,150,0.8)", "rgba(50,120,90,0.7)"]
      : [
          "rgba(255,210,120,0.9)",
          "rgba(255,160,90,0.8)",
          "rgba(255,120,80,0.7)",
        ];
  spawn(
    x,
    y,
    {
      angle: [0, Math.PI * 2],
      speed: [1.6 * scale, 4.8 * scale],
      life: [24, 46],
      size: [1.8 * scale, 3.8 * scale],
      colors,
      drag: 0.92,
      gravity: 0.02,
      shape: "dot",
      glow: 10,
      composite: "lighter",
    },
    Math.round(18 * scale),
  );

  spawn(
    x,
    y,
    {
      angle: [0, Math.PI * 2],
      speed: [2.4 * scale, 6.5 * scale],
      life: [16, 26],
      size: [1.2 * scale, 2.6 * scale],
      colors: ["rgba(255,255,255,0.8)", "rgba(255,220,200,0.6)"],
      drag: 0.9,
      gravity: 0.03,
      shape: "spark",
      glow: 6,
      composite: "lighter",
    },
    Math.round(10 * scale),
  );
};

export const spawnSparks = (x, y, palette = "blue", count = 8) => {
  const colors =
    palette === "red"
      ? ["rgba(255,120,120,0.9)", "rgba(255,180,180,0.8)"]
      : ["rgba(120,200,255,0.9)", "rgba(180,220,255,0.8)"];
  spawn(
    x,
    y,
    {
      angle: [0, Math.PI * 2],
      speed: [2.2, 5.2],
      life: [10, 18],
      size: [2, 3],
      colors,
      drag: 0.86,
      gravity: 0.04,
      shape: "spark",
      glow: 6,
      composite: "lighter",
    },
    count,
  );
};

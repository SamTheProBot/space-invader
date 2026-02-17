const rand = (min, max) => Math.random() * (max - min) + min;

const createStarLayer = (
  count,
  width,
  height,
  speed,
  sizeRange,
  alphaRange,
) => {
  const stars = new Array(count);
  for (let i = 0; i < count; i++) {
    stars[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: rand(sizeRange[0], sizeRange[1]),
      alpha: rand(alphaRange[0], alphaRange[1]),
      speed: speed * rand(0.6, 1.4),
      drift: rand(-0.15, 0.15),
    };
  }
  return stars;
};

const updateStars = (stars, width, height, step) => {
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    star.y += star.speed * step;
    star.x += star.drift * step;
    if (star.y > height + 10) {
      star.y = -10;
      star.x = Math.random() * width;
    }
    if (star.x > width + 10) star.x = -10;
    if (star.x < -10) star.x = width + 10;
  }
};

const drawStars = (ctx, stars) => {
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    ctx.globalAlpha = star.alpha;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius + 0.5, 0, Math.PI * 3);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
};

const createScanlinePattern = (ctx) => {
  const scan = document.createElement("canvas");
  scan.width = 4;
  scan.height = 4;
  const sctx = scan.getContext("2d");
  sctx.fillStyle = "rgba(0, 0, 0, 0)";
  sctx.fillRect(0, 0, 4, 4);
  sctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  sctx.fillRect(0, 0, 4, 1);
  sctx.fillRect(0, 2, 4, 1);
  return ctx.createPattern(scan, "repeat");
};

const createVignette = (ctx, width, height) => {
  const radius = Math.max(width, height) * 0.75;
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    radius * 0.2,
    width / 2,
    height / 2,
    radius,
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.6, "rgba(0, 0, 0, 0.12)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.55)");
  return gradient;
};

export const createFx = () => {
  const state = {
    width: 0,
    height: 0,
    stars: [],
    scanlinePattern: null,
    vignette: null,
    lastTime: 0,
    shake: {
      intensity: 0,
      duration: 0,
      start: 0,
      until: 0,
    },
  };

  const ensureInit = (ctx, width, height) => {
    if (state.width === width && state.height === height && state.stars.length)
      return;
    state.width = width;
    state.height = height;
    state.stars = [
      createStarLayer(60, width, height, 0.35, [0.6, 1.2], [0.12, 0.35]),
      createStarLayer(90, width, height, 0.7, [0.4, 1], [0.08, 0.25]),
      createStarLayer(120, width, height, 1.1, [0.3, 0.8], [0.05, 0.2]),
    ];
    state.scanlinePattern = createScanlinePattern(ctx);
    state.vignette = createVignette(ctx, width, height);
  };

  const update = (time, width, height) => {
    const last = state.lastTime || time;
    const delta = Math.min(48, time - last);
    const step = delta / 16.67;
    state.lastTime = time;
    for (let i = 0; i < state.stars.length; i++) {
      updateStars(state.stars[i], width, height, step);
    }
  };

  const getShakeOffset = (time) => {
    if (time >= state.shake.until) return { x: 0, y: 0 };
    const elapsed = time - state.shake.start;
    const t = state.shake.duration ? elapsed / state.shake.duration : 1;
    const falloff = 1 - Math.min(1, t);
    const amp = state.shake.intensity * falloff;
    return {
      x: (Math.random() - 0.5) * 2 * amp,
      y: (Math.random() - 0.5) * 2 * amp,
    };
  };

  const drawOverlay = (ctx, width, height) => {
    if (state.vignette) {
      ctx.save();
      ctx.fillStyle = state.vignette;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
    if (state.scanlinePattern) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = state.scanlinePattern;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  };

  return {
    beginFrame: (ctx, time, width, height) => {
      ensureInit(ctx, width, height);
      update(time, width, height);
      const offset = getShakeOffset(time);
      ctx.save();
      ctx.translate(offset.x, offset.y);
    },
    drawBackground: (ctx, width, height) => {
      ctx.save();
      for (let i = 0; i < state.stars.length; i++) {
        drawStars(ctx, state.stars[i]);
      }
      ctx.restore();
    },
    endFrame: (ctx, time, width, height) => {
      ctx.restore();
      drawOverlay(ctx, width, height);
    },
    triggerShake: (intensity = 6, duration = 140) => {
      const now = performance.now();
      state.shake.intensity = Math.max(state.shake.intensity, intensity);
      state.shake.duration = duration;
      state.shake.start = now;
      state.shake.until = now + duration;
    },
  };
};

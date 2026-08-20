export type Season = "spring" | "summer" | "autumn" | "winter";

export type Palette = {
  accent: string;
  ink: string;
  paper: string;
  muted: string;
};

export type Hud = {
  score: number;
  lives: number;
  maxLives: number;
  unit: "score" | "distance";
};

export type GameEngine = {
  resize: (w: number, h: number) => void;
  start: () => void;
  tick: (
    dt: number,
    ctx: CanvasRenderingContext2D,
    palette: Palette,
  ) => "idle" | "play" | "over";
  pointerDown: (x: number, y: number) => void;
  pointerMove: (x: number, y: number) => void;
  pointerUp: () => void;
  keyDown: (key: string) => boolean;
  keyUp: (key: string) => void;
  hud: () => Hud;
};

type Rect = { x: number; y: number; w: number; h: number };

function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.fill();
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  rot: number,
  accent: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r, 0, 0, r);
  ctx.quadraticCurveTo(-r, 0, 0, -r);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.75);
  ctx.lineTo(0, r * 0.7);
  ctx.stroke();
  ctx.restore();
}

function drawBloom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  rot: number,
  accent: string,
  ink: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = accent;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.58, r * 0.34, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.rotate((Math.PI * 2) / 5);
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.35;
  ctx.fill();
  ctx.restore();
}

function drawPerson(
  ctx: CanvasRenderingContext2D,
  x: number,
  footY: number,
  duck: boolean,
  phase: number,
  accent: string,
  ink: string,
) {
  const h = duck ? 22 : 38;
  const top = footY - h;
  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.arc(x, top + 6, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent;
  fillRoundRect(ctx, x - 6, top + 12, 12, duck ? 10 : 16, 4);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  const swing = duck ? 0 : Math.sin(phase) * 8;
  ctx.beginPath();
  ctx.moveTo(x, top + 16);
  ctx.lineTo(x - 10, top + 16 + (duck ? 4 : 8) - swing * 0.3);
  ctx.moveTo(x, top + 16);
  ctx.lineTo(x + 10, top + 16 + (duck ? 4 : 8) + swing * 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 1, footY - (duck ? 4 : 10));
  ctx.lineTo(x - 7, footY + (duck ? 0 : swing * 0.45));
  ctx.moveTo(x + 1, footY - (duck ? 4 : 10));
  ctx.lineTo(x + 7, footY - (duck ? 0 : swing * 0.45));
  ctx.stroke();
}

function createAutumn(): GameEngine {
  const state = {
    w: 0,
    h: 0,
    running: false,
    died: false,
    basketX: 0,
    basketW: 86,
    keys: 0,
    drops: [] as { x: number; y: number; vy: number; r: number; rot: number; vr: number }[],
    spawn: 0,
    score: 0,
    lives: 3,
    clock: 0,
  };

  const spawn = () => {
    state.drops.push({
      x: 24 + Math.random() * Math.max(40, state.w - 48),
      y: -18,
      vy: 1.55 + Math.random() * 1.4 + state.score * 0.035,
      r: 10 + Math.random() * 7,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.08,
    });
  };

  return {
    resize(w, h) {
      state.w = w;
      state.h = h;
      state.basketX = w / 2;
    },
    start() {
      state.running = true;
      state.died = false;
      state.drops = [];
      state.spawn = 0;
      state.score = 0;
      state.lives = 3;
      spawn();
    },
    tick(dt, ctx, palette) {
      state.clock += dt;
      if (state.running) {
        state.spawn += dt;
        if (state.spawn > Math.max(420, 820 - state.score * 18)) {
          state.spawn = 0;
          spawn();
        }
        if (state.keys !== 0) state.basketX += state.keys * 0.62 * dt;
        const half = state.basketW / 2;
        state.basketX = Math.max(half + 8, Math.min(state.w - half - 8, state.basketX));
        const basketY = state.h - 34;
        const next = [];
        for (const drop of state.drops) {
          drop.y += drop.vy * dt * 0.085;
          drop.rot += drop.vr * dt;
          const caught =
            drop.y > basketY - 12 &&
            drop.y < basketY + 16 &&
            Math.abs(drop.x - state.basketX) < half + drop.r * 0.4;
          if (caught) {
            state.score += 1;
            continue;
          }
          if (drop.y > state.h + 20) {
            state.lives -= 1;
            continue;
          }
          next.push(drop);
        }
        state.drops = next;
        if (state.lives <= 0) {
          state.running = false;
          state.died = true;
        }
      }

      ctx.fillStyle = palette.paper;
      ctx.globalAlpha = 0.38;
      ctx.fillRect(0, 0, state.w, state.h);
      ctx.globalAlpha = 1;
      for (const drop of state.drops) {
        drawLeaf(ctx, drop.x, drop.y, drop.r, drop.rot, palette.accent);
      }
      ctx.fillStyle = palette.ink;
      const bx = state.basketX - state.basketW / 2;
      fillRoundRect(ctx, bx, state.h - 42, state.basketW, 16, 8);
      ctx.fillStyle = palette.accent;
      fillRoundRect(ctx, bx + 8, state.h - 48, state.basketW - 16, 6, 3);

      if (state.died) {
        state.died = false;
        return "over";
      }
      return state.running ? "play" : "idle";
    },
    pointerDown(x) {
      if (!state.running) return;
      state.keys = 0;
      state.basketX = x;
    },
    pointerMove(x) {
      if (!state.running) return;
      state.keys = 0;
      state.basketX = x;
    },
    pointerUp() {},
    keyDown(key) {
      if (!state.running) return false;
      if (key === "ArrowLeft" || key === "a" || key === "A") {
        state.keys = -1;
        return true;
      }
      if (key === "ArrowRight" || key === "d" || key === "D") {
        state.keys = 1;
        return true;
      }
      return false;
    },
    keyUp(key) {
      if (
        key === "ArrowLeft" ||
        key === "a" ||
        key === "A" ||
        key === "ArrowRight" ||
        key === "d" ||
        key === "D"
      ) {
        state.keys = 0;
      }
    },
    hud: () => ({ score: state.score, lives: state.lives, maxLives: 3, unit: "score" }),
  };
}

function createSpring(): GameEngine {
  type Petal = { t: number; max: number; smash: number; rot: number };
  type Hole = { x: number; y: number; petal: Petal | null };
  const state = {
    w: 0,
    h: 0,
    running: false,
    died: false,
    holes: [] as Hole[],
    spawn: 0,
    score: 0,
    lives: 3,
    clock: 0,
  };

  const layout = () => {
    const cols = state.w > 640 ? 4 : 3;
    const rows = 2;
    const holes: Hole[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        holes.push({
          x: (state.w / (cols + 1)) * (col + 1),
          y: 86 + row * Math.max(110, (state.h - 120) / 2),
          petal: null,
        });
      }
    }
    state.holes = holes;
  };

  const spawn = () => {
    const empty = state.holes.filter((hole) => !hole.petal);
    const hole = empty[Math.floor(Math.random() * empty.length)];
    if (!hole) return;
    const max = Math.max(620, 1400 - state.score * 28);
    hole.petal = { t: 0, max, smash: 0, rot: Math.random() * Math.PI };
  };

  return {
    resize(w, h) {
      state.w = w;
      state.h = h;
      layout();
    },
    start() {
      state.running = true;
      state.died = false;
      state.score = 0;
      state.lives = 3;
      state.spawn = 180;
      layout();
    },
    tick(dt, ctx, palette) {
      state.clock += dt;
      if (state.running) {
        state.spawn += dt;
        const gap = Math.max(380, 920 - state.score * 16);
        if (state.spawn > gap) {
          state.spawn = 0;
          spawn();
        }
        for (const hole of state.holes) {
          const petal = hole.petal;
          if (!petal) continue;
          if (petal.smash > 0) {
            petal.smash -= dt;
            if (petal.smash <= 0) hole.petal = null;
            continue;
          }
          petal.t += dt;
          petal.rot += dt * 0.0015;
          if (petal.t >= petal.max) {
            hole.petal = null;
            state.lives -= 1;
          }
        }
        if (state.lives <= 0) {
          state.running = false;
          state.died = true;
        }
      }

      ctx.fillStyle = palette.paper;
      ctx.globalAlpha = 0.38;
      ctx.fillRect(0, 0, state.w, state.h);
      ctx.globalAlpha = 1;
      for (const hole of state.holes) {
        ctx.fillStyle = palette.ink;
        ctx.globalAlpha = 0.16;
        ctx.beginPath();
        ctx.ellipse(hole.x, hole.y + 18, 28, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = palette.muted;
        fillRoundRect(ctx, hole.x - 4, hole.y - 6, 8, 28, 4);
        if (!hole.petal) continue;
        const rise = hole.petal.smash > 0 ? 1.15 : Math.min(1, hole.petal.t / 180);
        const radius = 18 * rise * (hole.petal.smash > 0 ? 1.25 : 1);
        drawBloom(
          ctx,
          hole.x,
          hole.y - 8 - 22 * rise,
          radius,
          hole.petal.rot,
          palette.accent,
          palette.ink,
        );
      }

      if (state.died) {
        state.died = false;
        return "over";
      }
      return state.running ? "play" : "idle";
    },
    pointerDown(x, y) {
      if (!state.running) return;
      for (const hole of state.holes) {
        const petal = hole.petal;
        if (!petal || petal.smash > 0) continue;
        const px = hole.x;
        const py = hole.y - 30;
        if ((x - px) ** 2 + (y - py) ** 2 < 38 * 38) {
          petal.smash = 160;
          state.score += 1;
          return;
        }
      }
    },
    pointerMove() {},
    pointerUp() {},
    keyDown() {
      return false;
    },
    keyUp() {},
    hud: () => ({ score: state.score, lives: state.lives, maxLives: 3, unit: "score" }),
  };
}

function createSummer(): GameEngine {
  type Kind = "rock" | "bird" | "coin";
  type Item = { x: number; kind: Kind; w: number; h: number };
  const state = {
    w: 0,
    h: 0,
    running: false,
    died: false,
    duck: false,
    grounded: true,
    y: 0,
    vy: 0,
    items: [] as Item[],
    spawn: 0,
    score: 0,
    speed: 0.32,
    clock: 0,
    water: 0,
  };

  const playerX = 118;

  const spawn = () => {
    const roll = Math.random();
    if (roll < 0.22) {
      state.items.push({ x: state.w + 40, kind: "coin", w: 16, h: 16 });
    } else if (roll < 0.62) {
      state.items.push({ x: state.w + 40, kind: "rock", w: 36, h: 28 });
    } else {
      state.items.push({ x: state.w + 40, kind: "bird", w: 34, h: 18 });
    }
  };

  const jump = () => {
    if (!state.running || !state.grounded || state.duck) return;
    state.vy = -0.64;
    state.grounded = false;
  };

  return {
    resize(w, h) {
      state.w = w;
      state.h = h;
      state.water = h * 0.66;
      if (!state.running) state.y = state.water;
    },
    start() {
      state.running = true;
      state.died = false;
      state.duck = false;
      state.grounded = true;
      state.y = state.water;
      state.vy = 0;
      state.items = [];
      state.spawn = 500;
      state.score = 0;
      state.speed = 0.32;
    },
    tick(dt, ctx, palette) {
      state.clock += dt;
      state.water = state.h * 0.66;
      if (state.running) {
        state.speed = 0.32 + state.score * 0.0009;
        state.score += state.speed * dt * 0.045;
        state.spawn += dt;
        if (state.spawn > Math.max(620, 1280 - state.score * 1.6)) {
          state.spawn = 0;
          spawn();
        }
        state.vy += 0.0028 * dt;
        state.y += state.vy * dt;
        if (state.y >= state.water) {
          state.y = state.water;
          state.vy = 0;
          state.grounded = true;
        }
        const next: Item[] = [];
        const bodyH = state.duck ? 16 : 34;
        const player: Rect = {
          x: playerX - 14,
          y: state.y - bodyH - 6,
          w: 28,
          h: bodyH,
        };
        for (const item of state.items) {
          item.x -= state.speed * dt;
          if (item.x < -60) continue;
          const box: Rect =
            item.kind === "bird"
              ? { x: item.x, y: state.water - 50, w: item.w, h: 22 }
              : item.kind === "coin"
                ? { x: item.x, y: state.water - 78, w: item.w, h: item.h }
                : { x: item.x, y: state.water - item.h, w: item.w, h: item.h };
          if (item.kind === "coin") {
            if (overlaps(player, box)) {
              state.score += 12;
              continue;
            }
          } else if (overlaps(player, box)) {
            state.running = false;
            state.died = true;
          }
          next.push(item);
        }
        state.items = next;
      }

      ctx.fillStyle = palette.paper;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0, 0, state.w, state.h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = palette.accent;
      ctx.globalAlpha = 0.18;
      ctx.fillRect(0, state.water - 8, state.w, state.h);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= state.w; x += 8) {
        const y =
          state.water +
          Math.sin((x + state.clock * 0.18) * 0.03) * 5 +
          Math.sin((x + state.clock * 0.08) * 0.01) * 3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      for (const item of state.items) {
        if (item.kind === "rock") {
          ctx.fillStyle = palette.ink;
          ctx.beginPath();
          ctx.moveTo(item.x, state.water);
          ctx.lineTo(item.x + item.w * 0.5, state.water - item.h);
          ctx.lineTo(item.x + item.w, state.water);
          ctx.closePath();
          ctx.fill();
        } else if (item.kind === "bird") {
          const by = state.water - 38;
          ctx.strokeStyle = palette.ink;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(item.x, by);
          ctx.quadraticCurveTo(item.x + 10, by - 10, item.x + 18, by);
          ctx.quadraticCurveTo(item.x + 26, by - 10, item.x + 34, by);
          ctx.stroke();
        } else {
          ctx.fillStyle = palette.accent;
          ctx.beginPath();
          ctx.arc(item.x + 8, state.water - 70, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = palette.accent;
      fillRoundRect(ctx, playerX - 26, state.y + 2, 54, 8, 4);
      drawPerson(
        ctx,
        playerX,
        state.y,
        state.duck,
        state.clock * 0.012,
        palette.accent,
        palette.ink,
      );

      if (state.died) {
        state.died = false;
        return "over";
      }
      return state.running ? "play" : "idle";
    },
    pointerDown(_x, y) {
      if (!state.running) return;
      if (y > state.h * 0.72) state.duck = true;
      else jump();
    },
    pointerMove() {},
    pointerUp() {
      state.duck = false;
    },
    keyDown(key) {
      if (!state.running) return false;
      if (key === "ArrowDown" || key === "s" || key === "S") {
        state.duck = true;
        return true;
      }
      if (key === " " || key === "ArrowUp" || key === "w" || key === "W") {
        jump();
        return true;
      }
      return false;
    },
    keyUp(key) {
      if (key === "ArrowDown" || key === "s" || key === "S") state.duck = false;
    },
    hud: () => ({
      score: Math.floor(state.score),
      lives: state.running ? 1 : 0,
      maxLives: 1,
      unit: "distance",
    }),
  };
}

function createWinter(): GameEngine {
  type Obstacle = { x: number; w: number; h: number };
  const state = {
    w: 0,
    h: 0,
    running: false,
    died: false,
    grounded: true,
    jumps: 2,
    y: 0,
    vy: 0,
    ground: 0,
    items: [] as Obstacle[],
    flakes: [] as { x: number; y: number; r: number; s: number }[],
    spawn: 0,
    score: 0,
    speed: 0.34,
    clock: 0,
  };

  const playerX = 96;

  const spawn = () => {
    const tall = Math.random() > 0.55;
    state.items.push({
      x: state.w + 36,
      w: tall ? 24 + Math.random() * 10 : 36 + Math.random() * 18,
      h: tall ? 46 + Math.random() * 16 : 22 + Math.random() * 10,
    });
  };

  const jump = () => {
    if (!state.running || state.jumps <= 0) return;
    state.vy = state.jumps === 2 ? -0.76 : -0.62;
    state.jumps -= 1;
    state.grounded = false;
  };

  return {
    resize(w, h) {
      state.w = w;
      state.h = h;
      state.ground = h - 54;
      if (!state.running) state.y = state.ground;
      if (state.flakes.length === 0) {
        state.flakes = Array.from({ length: 28 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.2 + Math.random() * 2,
          s: 0.04 + Math.random() * 0.08,
        }));
      }
    },
    start() {
      state.running = true;
      state.died = false;
      state.grounded = true;
      state.jumps = 2;
      state.y = state.ground;
      state.vy = 0;
      state.items = [];
      state.spawn = 420;
      state.score = 0;
      state.speed = 0.34;
    },
    tick(dt, ctx, palette) {
      state.clock += dt;
      state.ground = state.h - 54;
      for (const flake of state.flakes) {
        flake.y += flake.s * dt;
        flake.x += Math.sin((flake.y + state.clock) * 0.01) * 0.04 * dt;
        if (flake.y > state.h) {
          flake.y = -6;
          flake.x = Math.random() * state.w;
        }
      }
      if (state.running) {
        state.speed = 0.34 + state.score * 0.001;
        state.score += state.speed * dt * 0.045;
        state.spawn += dt;
        if (state.spawn > Math.max(640, 1320 - state.score * 1.8)) {
          state.spawn = 0;
          spawn();
        }
        state.vy += 0.0025 * dt;
        state.y += state.vy * dt;
        if (state.y >= state.ground) {
          state.y = state.ground;
          state.vy = 0;
          state.grounded = true;
          state.jumps = 2;
        }
        const player: Rect = { x: playerX - 12, y: state.y - 38, w: 24, h: 38 };
        const next: Obstacle[] = [];
        for (const item of state.items) {
          item.x -= state.speed * dt;
          if (item.x < -80) continue;
          if (overlaps(player, { x: item.x, y: state.ground - item.h, w: item.w, h: item.h })) {
            state.running = false;
            state.died = true;
          }
          next.push(item);
        }
        state.items = next;
      }

      ctx.fillStyle = palette.paper;
      ctx.globalAlpha = 0.32;
      ctx.fillRect(0, 0, state.w, state.h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = palette.ink;
      ctx.globalAlpha = 0.18;
      for (const flake of state.flakes) {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = palette.muted;
      ctx.fillRect(0, state.ground + 8, state.w, state.h);
      ctx.fillStyle = palette.ink;
      ctx.globalAlpha = 0.28;
      ctx.fillRect(0, state.ground + 6, state.w, 3);
      ctx.globalAlpha = 1;

      const scroll = (state.clock * state.speed) % 140;
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 2;
      for (let x = -scroll; x < state.w + 40; x += 140) {
        ctx.beginPath();
        ctx.moveTo(x + 40, state.ground + 6);
        ctx.lineTo(x + 18, 18);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      for (const item of state.items) {
        ctx.fillStyle = palette.accent;
        fillRoundRect(ctx, item.x, state.ground - item.h + 8, item.w, item.h, 6);
        ctx.fillStyle = palette.ink;
        ctx.globalAlpha = 0.2;
        fillRoundRect(ctx, item.x + 4, state.ground - item.h + 12, item.w - 8, 6, 3);
        ctx.globalAlpha = 1;
      }

      drawPerson(
        ctx,
        playerX,
        state.y,
        false,
        state.running ? state.clock * 0.018 : 0,
        palette.accent,
        palette.ink,
      );

      if (state.died) {
        state.died = false;
        return "over";
      }
      return state.running ? "play" : "idle";
    },
    pointerDown() {
      jump();
    },
    pointerMove() {},
    pointerUp() {},
    keyDown(key) {
      if (!state.running) return false;
      if (key === " " || key === "ArrowUp" || key === "w" || key === "W") {
        jump();
        return true;
      }
      return false;
    },
    keyUp() {},
    hud: () => ({
      score: Math.floor(state.score),
      lives: state.running ? 1 : 0,
      maxLives: 1,
      unit: "distance",
    }),
  };
}

export function createSeasonGame(season: Season): GameEngine {
  if (season === "spring") return createSpring();
  if (season === "summer") return createSummer();
  if (season === "winter") return createWinter();
  return createAutumn();
}

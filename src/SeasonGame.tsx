import { useEffect, useRef, useState } from "react";
import { createSeasonGame, type Season } from "./seasonGames";

const COPY: Record<Season, { title: string; hint: string; result: (score: number) => string }> = {
  spring: {
    title: "打花瓣",
    hint: "花瓣从土里冒出来时点它，漏掉三次就结束。",
    result: (score) => `拍到了 ${score} 片花瓣`,
  },
  summer: {
    title: "夏日冲浪",
    hint: "空格 / 点击跳跃躲礁石，↓ 或按住画面下方低头躲飞鸟。",
    result: (score) => `冲了 ${score} 米`,
  },
  autumn: {
    title: "接落叶",
    hint: "左右移动托盘接住落叶。鼠标、手指或 A / D、方向键都可以。",
    result: (score) => `接住了 ${score} 片落叶`,
  },
  winter: {
    title: "雪地跑酷",
    hint: "自动向前跑，空格、↑ 或点击起跳，可以二段跳。",
    result: (score) => `跑了 ${score} 米`,
  },
};

function colorOf(element: HTMLElement, name: string, fallback: string) {
  const value = getComputedStyle(element).getPropertyValue(name).trim();
  return value || fallback;
}

function bestKey(season: Season) {
  return `blog-game-best-${season}`;
}

function readBest(season: Season) {
  const stored = Number(localStorage.getItem(bestKey(season)) || 0);
  if (season === "autumn" && !localStorage.getItem(bestKey(season))) {
    const legacy = Number(localStorage.getItem("blog-game-best") || 0);
    return Number.isFinite(legacy) ? legacy : 0;
  }
  return Number.isFinite(stored) ? stored : 0;
}

export function SeasonGame({ season }: { season: Season }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef<() => void>(() => undefined);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [maxLives, setMaxLives] = useState(3);
  const [unit, setUnit] = useState<"score" | "distance">("score");
  const [best, setBest] = useState(() => readBest(season));
  const copy = COPY[season];

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const game = createSeasonGame(season);
    let last = 0;
    let playing = false;
    let width = 0;
    let height = 0;
    let lastScore = -1;
    let lastLives = -1;

    const palette = () => ({
      accent: colorOf(wrap, "--accent", "#d45324"),
      ink: colorOf(wrap, "--ink", "#1a312b"),
      paper: colorOf(wrap, "--paper-raised", "#ead9b8"),
      muted: colorOf(wrap, "--ink-soft", "#5c6f68"),
    });

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = wrap.clientWidth;
      height = Math.max(360, Math.min(460, Math.round(width * 0.48)));
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      game.resize(width, height);
    };

    const syncHud = () => {
      const hud = game.hud();
      setScore(hud.score);
      setLives(hud.lives);
      setMaxLives(hud.maxLives);
      setUnit(hud.unit);
    };

    const finish = () => {
      playing = false;
      const hud = game.hud();
      setRunning(false);
      setOver(true);
      setScore(hud.score);
      setLives(hud.lives);
      const nextBest = Math.max(readBest(season), hud.score);
      localStorage.setItem(bestKey(season), String(nextBest));
      setBest(nextBest);
    };

    const tick = (time: number) => {
      const dt = Math.min(32, time - (last || time));
      last = time;
      const result = game.tick(dt, ctx, palette());
      if (playing) {
        const hud = game.hud();
        if (hud.score !== lastScore || hud.lives !== lastLives) {
          lastScore = hud.score;
          lastLives = hud.lives;
          setScore(hud.score);
          setLives(hud.lives);
        }
      }
      if (playing && result === "over") finish();
      frame = requestAnimationFrame(tick);
    };

    const point = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * width,
        y: ((event.clientY - rect.top) / rect.height) * height,
      };
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!playing) return;
      canvas.setPointerCapture(event.pointerId);
      const { x, y } = point(event);
      game.pointerDown(x, y);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!playing) return;
      game.pointerMove(point(event).x, point(event).y);
    };
    const onPointerUp = () => {
      game.pointerUp();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!playing) return;
      if (game.keyDown(event.key)) event.preventDefault();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      game.keyUp(event.key);
    };

    const start = () => {
      playing = true;
      last = 0;
      lastScore = -1;
      lastLives = -1;
      game.start();
      syncHud();
      setOver(false);
      setRunning(true);
    };

    resize();
    let frame = requestAnimationFrame(tick);
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    startRef.current = start;
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      startRef.current = () => undefined;
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [season]);

  return (
    <section className="game-section shell" id="game" aria-labelledby="game-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LITTLE GAME</p>
          <h2 id="game-title">{copy.title}</h2>
        </div>
        <p className="path-intro">{copy.hint} 右上角换季节，游戏也会一起换。</p>
      </div>
      <div className="game-card">
        <div className="game-hud">
          <span>{unit === "distance" ? "距离" : "得分"} {score}</span>
          {maxLives > 1 ? (
            <span>
              生命 {"♥".repeat(Math.max(0, lives))}
              {"♡".repeat(Math.max(0, maxLives - lives))}
            </span>
          ) : (
            <span>{running ? "进行中" : "一命通关"}</span>
          )}
          <span>最高 {best}</span>
        </div>
        <div
          className="game-board"
          data-cursor={season === "autumn" ? "hidden" : "pointer"}
          ref={wrapRef}
        >
          <canvas ref={canvasRef} aria-label={`${copy.title}游戏区域`} />
          {!running && (
            <div className="game-overlay">
              <p>{over ? copy.result(score) : "准备好了吗？"}</p>
              <button className="button button-primary" type="button" onClick={() => startRef.current()}>
                {over ? "再来一局" : "开始游戏"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

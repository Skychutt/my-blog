import { useEffect, useRef, useState } from "react";
import type { Post } from "./data/posts";
import { siteConfig } from "./site.config";

type ShareCardProps = {
  post: Post;
};

function articleUrl(slug: string) {
  const base = `${window.location.origin}${window.location.pathname}`.replace(/\/$/, "");
  return `${base}/#/post/${slug}`;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const chars = [...text];
  const lines: string[] = [];
  let line = "";
  for (const ch of chars) {
    const next = line + ch;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = ch;
      if (lines.length >= maxLines) break;
    } else {
      line = next;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && chars.join("").length > lines.join("").length) {
    const last = lines[maxLines - 1];
    let trimmed = last;
    while (trimmed.length > 1 && ctx.measureText(`${trimmed}…`).width > maxWidth) {
      trimmed = trimmed.slice(0, -1);
    }
    lines[maxLines - 1] = `${trimmed}…`;
  }
  return lines;
}

async function loadQr(url: string, size: number) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&color=1a1a1a&bgcolor=f7f4ef&data=${encodeURIComponent(url)}`;
  });
}

function roundedRect(
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
}

async function renderShareCard(post: Post, url: string) {
  const width = 840;
  const height = 1120;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建画布");

  ctx.fillStyle = "#f7f4ef";
  ctx.fillRect(0, 0, width, height);

  const blob1 = ctx.createRadialGradient(710, 90, 10, 710, 90, 180);
  blob1.addColorStop(0, "rgba(120, 168, 196, 0.28)");
  blob1.addColorStop(1, "rgba(120, 168, 196, 0)");
  ctx.fillStyle = blob1;
  ctx.beginPath();
  ctx.arc(710, 90, 180, 0, Math.PI * 2);
  ctx.fill();

  const blob2 = ctx.createRadialGradient(780, 180, 8, 780, 180, 140);
  blob2.addColorStop(0, "rgba(214, 176, 120, 0.22)");
  blob2.addColorStop(1, "rgba(214, 176, 120, 0)");
  ctx.fillStyle = blob2;
  ctx.beginPath();
  ctx.arc(780, 180, 140, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1a1a1a";
  ctx.font = "700 34px 'Noto Serif SC', 'Songti SC', serif";
  ctx.fillText(siteConfig.siteName, 72, 108);
  ctx.fillStyle = "#8a8680";
  ctx.font = "500 20px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("skychutt", 72, 142);

  ctx.fillStyle = "#141414";
  ctx.font = "700 54px 'Noto Serif SC', 'Songti SC', serif";
  const titleLines = wrapText(ctx, post.title, width - 144, 3);
  let y = 280;
  for (const line of titleLines) {
    ctx.fillText(line, 72, y);
    y += 72;
  }

  ctx.fillStyle = "#5c5852";
  ctx.font = "400 28px 'Noto Serif SC', 'Songti SC', serif";
  const excerptLines = wrapText(ctx, post.excerpt, width - 144, 4);
  y += 28;
  for (const line of excerptLines) {
    ctx.fillText(line, 72, y);
    y += 46;
  }

  ctx.fillStyle = "#9a958c";
  ctx.font = "500 22px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText(`${post.date}  ·  ${post.category}`, 72, y + 36);

  ctx.strokeStyle = "rgba(26, 26, 26, 0.08)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(72, height - 220);
  ctx.lineTo(width - 72, height - 220);
  ctx.stroke();

  const qr = await loadQr(url, 148);
  if (qr) {
    ctx.fillStyle = "#fff";
    roundedRect(ctx, 72, height - 178, 132, 132, 16);
    ctx.fill();
    ctx.drawImage(qr, 80, height - 170, 116, 116);
  } else {
    ctx.fillStyle = "#1a1a1a";
    roundedRect(ctx, 72, height - 178, 132, 132, 16);
    ctx.fill();
    ctx.fillStyle = "#f7f4ef";
    ctx.font = "700 48px 'Noto Serif SC', serif";
    ctx.fillText("夏", 108, height - 92);
  }

  ctx.fillStyle = "#1a1a1a";
  ctx.font = "700 26px 'Noto Serif SC', 'Songti SC', serif";
  ctx.fillText("扫码阅读原文", 232, height - 118);
  ctx.fillStyle = "#8a8680";
  ctx.font = "500 18px 'Space Grotesk', system-ui, sans-serif";
  const shortUrl = url.replace(/^https?:\/\//, "");
  const urlLines = wrapText(ctx, shortUrl, width - 320, 2);
  let uy = height - 78;
  for (const line of urlLines) {
    ctx.fillText(line, 232, uy);
    uy += 28;
  }

  return canvas;
}

export function ShareCard({ post }: ShareCardProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tip, setTip] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const url = articleUrl(post.slug);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function generate() {
    setBusy(true);
    setTip("");
    try {
      const canvas = await renderShareCard(post, url);
      canvasRef.current = canvas;
      setPreview(canvas.toDataURL("image/png"));
      setOpen(true);
    } catch {
      setTip("生成失败，请稍后重试");
    } finally {
      setBusy(false);
    }
  }

  async function copyImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("empty");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setTip("已复制图片，可直接粘贴到聊天窗口");
    } catch {
      const link = document.createElement("a");
      link.download = `${post.slug}-share.png`;
      link.href = preview ?? canvas.toDataURL("image/png");
      link.click();
      setTip("当前浏览器不支持复制图片，已改为下载");
    }
  }

  async function shareDirect() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("empty");
      const file = new File([blob], `${post.slug}-share.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: post.title, text: post.excerpt, files: [file], url });
        setTip("已打开系统分享");
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.excerpt, url });
        setTip("已打开系统分享");
        return;
      }
      setTip("当前设备不支持直接分享，可复制图片或链接");
    } catch {
      setTip("分享已取消");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setTip("链接已复制");
    } catch {
      setTip("复制失败，请手动复制地址栏链接");
    }
  }

  return (
    <section className="share-card-panel" aria-label="生成分享卡片">
      <div className="share-card-copy">
        <h3>生成分享卡片</h3>
        <p>桌面可复制图片粘贴分享，手机可直接分享或长按卡片保存。</p>
      </div>
      <button type="button" className="share-card-trigger" onClick={() => void generate()} disabled={busy}>
        {busy ? "生成中…" : "生成卡片"}
      </button>
      {tip && !open ? <p className="share-card-inline-tip">{tip}</p> : null}

      {open && preview ? (
        <div className="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
          <button type="button" className="share-modal-backdrop" aria-label="关闭" onClick={() => setOpen(false)} />
          <div className="share-modal-panel">
            <header className="share-modal-head">
              <h3 id="share-modal-title">分享卡片预览</h3>
              <button type="button" className="share-modal-close" onClick={() => setOpen(false)} aria-label="关闭">
                ×
              </button>
            </header>
            <div className="share-modal-preview">
              <img src={preview} alt={`${post.title} 分享卡片`} />
            </div>
            <p className="share-modal-hint">复制图片后可直接粘贴到聊天窗口</p>
            {tip ? <p className="share-modal-tip">{tip}</p> : null}
            <div className="share-modal-actions">
              <button type="button" className="button button-primary" onClick={() => void copyImage()}>
                复制图片
              </button>
              <button type="button" className="button" onClick={() => void shareDirect()}>
                直接分享
              </button>
              <button type="button" className="button" onClick={() => void copyLink()}>
                复制链接
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

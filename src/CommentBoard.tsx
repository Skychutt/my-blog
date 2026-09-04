import { useEffect, useMemo, useState } from "react";

type Comment = {
  id: string;
  nick: string;
  email: string;
  site: string;
  content: string;
  createdAt: string;
};

type CommentBoardProps = {
  slug: string;
};

const MAX_LEN = 500;

function storageKey(slug: string) {
  return `summer-notes-comments:${slug}`;
}

function loadComments(slug: string): Comment[] {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Comment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveComments(slug: string, comments: Comment[]) {
  localStorage.setItem(storageKey(slug), JSON.stringify(comments));
}

function initials(name: string) {
  const text = name.trim();
  return text ? text.slice(0, 1).toUpperCase() : "访";
}

function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

export function CommentBoard({ slug }: CommentBoardProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [sentTip, setSentTip] = useState("");

  useEffect(() => {
    setComments(loadComments(slug));
    setError("");
    setSentTip("");
    setPreview(false);
  }, [slug]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("summer-notes-commenter");
      if (!saved) return;
      const data = JSON.parse(saved) as { nick?: string; email?: string; site?: string };
      if (data.nick) setNick(data.nick);
      if (data.email) setEmail(data.email);
      if (data.site) setSite(data.site);
    } catch {
      /* ignore */
    }
  }, []);

  const remaining = MAX_LEN - content.length;
  const sorted = useMemo(
    () => [...comments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [comments],
  );

  function refresh() {
    setComments(loadComments(slug));
    setSentTip("已刷新留言");
  }

  function submit() {
    setError("");
    setSentTip("");
    const cleanNick = nick.trim();
    const cleanEmail = email.trim();
    const cleanSite = site.trim();
    const cleanContent = content.trim();

    if (!cleanNick) {
      setError("请填写昵称");
      return;
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("请填写有效邮箱");
      return;
    }
    if (!cleanContent) {
      setError("请写一点留言内容");
      return;
    }
    if (cleanContent.length > MAX_LEN) {
      setError(`留言不能超过 ${MAX_LEN} 字`);
      return;
    }

    const next: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nick: cleanNick,
      email: cleanEmail,
      site: cleanSite,
      content: cleanContent,
      createdAt: new Date().toISOString(),
    };
    const list = [next, ...comments];
    setComments(list);
    saveComments(slug, list);
    localStorage.setItem(
      "summer-notes-commenter",
      JSON.stringify({ nick: cleanNick, email: cleanEmail, site: cleanSite }),
    );
    setContent("");
    setPreview(false);
    setSentTip("留言已发送，保存在本机浏览器中");
  }

  return (
    <section className="comment-board" aria-label="留言板">
      <header className="comment-board-head">
        <span className="comment-board-mark" aria-hidden="true" />
        <div>
          <h3>留言板</h3>
          <p>看完有想法可以留一句。留言保存在你的浏览器里，换设备不会同步。</p>
        </div>
      </header>

      <div className="comment-composer">
        <div className="comment-avatar" aria-hidden="true">{initials(nick || "访")}</div>
        <div className="comment-composer-main">
          <div className="comment-fields">
            <label>
              <span>昵称 <em>必填</em></span>
              <input value={nick} onChange={(e) => setNick(e.target.value)} placeholder="怎么称呼你" maxLength={24} />
            </label>
            <label>
              <span>邮箱 <em>必填</em></span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="不会公开展示" type="email" maxLength={80} />
            </label>
            <label>
              <span>网址 <em>选填</em></span>
              <input value={site} onChange={(e) => setSite(e.target.value)} placeholder="https://" maxLength={120} />
            </label>
          </div>

          {preview ? (
            <div className="comment-preview">
              {content.trim() ? content : "还没有内容可预览"}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_LEN))}
              placeholder="说点什么吧，最多 500 字"
              rows={5}
            />
          )}

          <div className="comment-toolbar">
            <span className="comment-count">{content.length}/{MAX_LEN}</span>
            <div className="comment-toolbar-actions">
              <button type="button" className="comment-ghost" onClick={() => setPreview((v) => !v)}>
                {preview ? "编辑" : "预览"}
              </button>
              <button type="button" className="button button-primary" onClick={submit}>
                发送
              </button>
            </div>
          </div>
          {error ? <p className="comment-error">{error}</p> : null}
          {sentTip ? <p className="comment-tip">{sentTip}</p> : null}
        </div>
      </div>

      <div className="comment-list-head">
        <p>{sorted.length ? `${sorted.length} 条留言` : "还没有留言"}</p>
        <button type="button" className="comment-ghost" onClick={refresh} aria-label="刷新留言">
          刷新
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="comment-empty">没有评论</p>
      ) : (
        <ul className="comment-list">
          {sorted.map((item) => (
            <li key={item.id}>
              <div className="comment-avatar" aria-hidden="true">{initials(item.nick)}</div>
              <div className="comment-item-body">
                <div className="comment-item-meta">
                  {item.site ? (
                    <a href={item.site.startsWith("http") ? item.site : `https://${item.site}`} target="_blank" rel="noreferrer">
                      {item.nick}
                    </a>
                  ) : (
                    <strong>{item.nick}</strong>
                  )}
                  <time>{formatTime(item.createdAt)}</time>
                </div>
                <p>{item.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

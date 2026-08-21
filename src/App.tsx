import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { categories, posts, type Post } from "./data/posts";
import { SeasonGame } from "./SeasonGame";
import { siteConfig } from "./site.config";

type Category = (typeof categories)[number];

const SEASONS = [
  { id: "spring", label: "春" },
  { id: "summer", label: "夏" },
  { id: "autumn", label: "秋" },
  { id: "winter", label: "冬" },
] as const;

const MODES = [
  { id: "day", label: "日", name: "日间" },
  { id: "night", label: "夜", name: "夜间" },
] as const;

type SeasonId = (typeof SEASONS)[number]["id"];
type ModeId = (typeof MODES)[number]["id"];
type ThemeId = `${SeasonId}-${ModeId}`;
type ParticleKind = "petal" | "leaf" | "snow" | "star" | "spark" | "firefly";

const THEME_COLORS: Record<ThemeId, string> = {
  "spring-day": "#f0c5d4",
  "spring-night": "#2a1522",
  "summer-day": "#5eadd8",
  "summer-night": "#102436",
  "autumn-day": "#d7c39a",
  "autumn-night": "#241e16",
  "winter-day": "#8aa6c2",
  "winter-night": "#0d1828",
};

const SKY_BITS: Record<ThemeId, { kind: ParticleKind; count: number }[]> = {
  "spring-day": [{ kind: "petal", count: 72 }],
  "spring-night": [
    { kind: "petal", count: 52 },
    { kind: "firefly", count: 26 },
    { kind: "star", count: 20 },
  ],
  "summer-day": [{ kind: "spark", count: 36 }],
  "summer-night": [
    { kind: "star", count: 42 },
    { kind: "firefly", count: 34 },
  ],
  "autumn-day": [{ kind: "leaf", count: 70 }],
  "autumn-night": [
    { kind: "leaf", count: 56 },
    { kind: "star", count: 18 },
  ],
  "winter-day": [{ kind: "snow", count: 88 }],
  "winter-night": [
    { kind: "snow", count: 96 },
    { kind: "star", count: 22 },
  ],
};

const LEGACY_THEMES: Record<string, ThemeId> = {
  light: "summer-day",
  dark: "summer-night",
  spring: "spring-day",
  summer: "summer-day",
  autumn: "autumn-day",
  winter: "winter-day",
};

function isThemeId(value: string | null): value is ThemeId {
  return Boolean(value && value in THEME_COLORS);
}

function readSavedTheme(): ThemeId {
  const saved = localStorage.getItem("blog-theme");
  if (isThemeId(saved)) return saved;
  if (saved && saved in LEGACY_THEMES) return LEGACY_THEMES[saved];
  return "summer-day";
}

function parseTheme(theme: ThemeId): { season: SeasonId; mode: ModeId } {
  const [season, mode] = theme.split("-") as [SeasonId, ModeId];
  return { season, mode };
}

function themeName(theme: ThemeId) {
  const { season, mode } = parseTheme(theme);
  const seasonLabel = SEASONS.find((item) => item.id === season)?.label ?? "夏";
  return `${seasonLabel}${mode === "day" ? "日" : "夜"}`;
}

type ThemeContextValue = {
  theme: ThemeId;
  season: SeasonId;
  mode: ModeId;
  setSeason: (season: SeasonId) => void;
  setMode: (mode: ModeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

function applyTheme(theme: ThemeId) {
  const { season, mode } = parseTheme(theme);
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.season = season;
  document.documentElement.dataset.mode = mode;
  localStorage.setItem("blog-theme", theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const initial = readSavedTheme();
    applyTheme(initial);
    return initial;
  });
  const { season, mode } = parseTheme(theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      season,
      mode,
      setSeason: (nextSeason) => setTheme(`${nextSeason}-${mode}`),
      setMode: (nextMode) => setTheme(`${season}-${nextMode}`),
    }),
    [theme, season, mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeSky theme={theme} />
      {children}
    </ThemeContext.Provider>
  );
}

function particleStyle(kind: ParticleKind, index: number): CSSProperties {
  const drift = (index % 2 === 0 ? 1 : -1) * (36 + (index % 55));
  const placed = kind === "star" || kind === "spark" || kind === "firefly";
  const sizeMap: Record<ParticleKind, number> = {
    petal: 28 + (index % 7) * 6,
    leaf: 30 + (index % 7) * 6,
    snow: 8 + (index % 8) * 4,
    star: 4 + (index % 6),
    spark: 12 + (index % 6) * 3,
    firefly: 10 + (index % 5) * 3,
  };
  const durationMap: Record<ParticleKind, string> = {
    petal: `${6.5 + (index % 6)}s`,
    leaf: `${5.5 + (index % 6)}s`,
    snow: `${4.8 + (index % 7)}s`,
    star: `${2.2 + (index % 4) * 0.6}s`,
    spark: `${1.6 + (index % 4) * 0.4}s`,
    firefly: `${3.2 + (index % 5) * 0.7}s`,
  };

  return {
    left: `${(index * 37 + 8) % 100}%`,
    top: placed ? `${(index * 17 + 5) % 86}%` : `${-18 - (index % 18)}%`,
    width: `${sizeMap[kind]}px`,
    height: `${sizeMap[kind]}px`,
    animationDelay: `${(index * 0.19) % 6}s`,
    animationDuration: durationMap[kind],
    ["--drift" as string]: `${drift}px`,
  };
}

function ThemeSky({ theme }: { theme: ThemeId }) {
  const bits = SKY_BITS[theme].flatMap((group, groupIndex) =>
    Array.from({ length: group.count }, (_, index) => {
      const order = groupIndex * 80 + index;
      return (
        <span
          className={`sky-bit sky-bit-${group.kind}`}
          key={`${theme}-${group.kind}-${index}`}
          style={particleStyle(group.kind, order)}
        />
      );
    }),
  );

  return (
    <>
      <div className="theme-sky" aria-hidden="true">
        <div className="sky-rays" />
        <div className="sky-aurora" />
        <div className="sky-glow sky-glow-a" />
        <div className="sky-glow sky-glow-b" />
        <div className="sky-orb" />
        <div className="sky-cloud sky-cloud-a" />
        <div className="sky-cloud sky-cloud-b" />
        <div className="sky-cloud sky-cloud-c" />
        <div className="sky-ground sky-ground-a" />
        <div className="sky-ground sky-ground-b" />
        <div className="sky-tree sky-tree-a" />
        <div className="sky-tree sky-tree-b" />
      </div>
      <div className="theme-weather" aria-hidden="true">
        {bits}
      </div>
    </>
  );
}

function isPageRoute(hash: string) {
  return (
    hash === "#/" ||
    hash === "#" ||
    hash === "" ||
    hash === "#about" ||
    hash === "#/about" ||
    hash === "#site" ||
    hash === "#/site" ||
    hash === "#path" ||
    hash === "#/path" ||
    hash.startsWith("#/post/")
  );
}

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");

  useEffect(() => {
    const update = () => {
      const next = window.location.hash || "#/";
      setHash(next);
      if (isPageRoute(next)) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return hash;
}

function ThemePicker() {
  const { theme, season, mode, setSeason, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const currentName = themeName(theme);
  const currentSeason = SEASONS.find((item) => item.id === season) ?? SEASONS[1];

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="theme-picker" ref={rootRef}>
      <button
        className="icon-button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`主题：${currentName}，打开主题选择`}
        title={currentName}
      >
        {currentSeason.label}
      </button>
      {open && (
        <div className="theme-menu" role="dialog" aria-label="选择季节与日夜">
          <p className="theme-legend">日夜</p>
          <div className="theme-row">
            {MODES.map((item) => (
              <button
                className={`theme-chip${mode === item.id ? " active" : ""}`}
                type="button"
                key={item.id}
                onClick={() => setMode(item.id)}
              >
                {item.label} · {item.name}
              </button>
            ))}
          </div>
          <p className="theme-legend">季节</p>
          <div className="theme-row theme-row-season">
            {SEASONS.map((item) => (
              <button
                className={`theme-chip${season === item.id ? " active" : ""}`}
                type="button"
                key={item.id}
                onClick={() => setSeason(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className={`theme-live theme-swatch-${theme}`} />
          <p className="theme-current">当前：{currentName}</p>
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#/" aria-label={`${siteConfig.siteName}首页`}>
          <span className="brand-mark">夏</span>
          <span>{siteConfig.siteName}</span>
        </a>
        <nav aria-label="主要导航">
          <a href="#game">游戏</a>
          <a href="#articles">文章</a>
          <a href="#/path">方向</a>
          <a href="#/about">关于</a>
          <a href="#/site">本站</a>
          <a href={siteConfig.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
        <ThemePicker />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div className="footer-meta">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · 保持好奇，持续记录。
          </p>
          <a
            className="icp-link"
            href={siteConfig.icpFiling.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {siteConfig.icpFiling.number}
          </a>
        </div>
        <a href="#/">回到首页 ↑</a>
      </div>
    </footer>
  );
}

function postHref(post: Post) {
  return post.externalUrl ?? `#/post/${post.slug}`;
}

function postLinkProps(post: Post) {
  if (!post.externalUrl) return {};
  return { target: "_blank", rel: "noreferrer" } as const;
}

function PostMeta({ post }: { post: Post }) {
  return (
    <div className="post-meta">
      <span>{post.category}</span>
      <time dateTime={post.date}>{post.displayDate}</time>
      <span>{post.readingTime}</span>
    </div>
  );
}

function HomePage() {
  const { season } = useTheme();
  const [category, setCategory] = useState<Category>("全部");
  const [query, setQuery] = useState("");
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const keyword = query.trim().toLowerCase();
  const visiblePosts = posts.filter((post) => {
    const inCategory = category === "全部" || post.category === category;
    const matches =
      !keyword ||
      `${post.title}${post.excerpt}${post.category}`
        .toLowerCase()
        .includes(keyword);
    return inCategory && matches;
  });

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id === "game" || id === "articles") {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow">SUMMER NOTES · SINCE 2026</p>
            <h1>
              从软件工程出发，
              <em>把想法做成作品。</em>
            </h1>
            <p className="hero-intro">{siteConfig.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#articles">
                开始阅读 <span aria-hidden="true">→</span>
              </a>
              <a className="button button-quiet" href="#/about">
                认识我
              </a>
              <a className="button button-quiet" href="#game">
                玩一把
              </a>
              <a className="button button-quiet" href="#/site">
                关于本站
              </a>
            </div>
          </div>
          <aside className="hero-note" aria-label="博主信息">
            <div className="note-tape" aria-hidden="true" />
            <span className="note-index">NO. 001</span>
            <p className="note-script">Hello, world!</p>
            <div className="note-rule" />
            <p>
              这里是我的数字花园。
              <br />
              记录代码、项目与思考，也记录从“会写”走向“能交付”的过程。
            </p>
            <div className="note-signature">
              <span>{siteConfig.name}</span>
              <small>{siteConfig.location}</small>
            </div>
          </aside>
        </section>

        <SeasonGame key={season} season={season} />

        <section className="featured-section shell" aria-labelledby="featured-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EDITOR’S PICK</p>
              <h2 id="featured-title">本期推荐</h2>
            </div>
            <span className="section-number">{featured.number}</span>
          </div>
          <a className="featured-card" href={postHref(featured)} {...postLinkProps(featured)}>
            <div className="featured-art" aria-hidden="true">
              <div className="sun" />
              <div className="horizon line-one" />
              <div className="horizon line-two" />
              <span>工程 / 成长 / 记录</span>
            </div>
            <div className="featured-copy">
              <PostMeta post={featured} />
              <h3>{featured.title}</h3>
              <p>{featured.excerpt}</p>
              <span className="text-link">{featured.externalUrl ? "打开教程 ↗" : "阅读全文 ↗"}</span>
            </div>
          </a>
        </section>

        <section className="articles-section shell" id="articles" aria-labelledby="articles-title">
          <div className="section-heading article-heading">
            <div>
              <p className="eyebrow">LATEST WRITING</p>
              <h2 id="articles-title">最近文章</h2>
            </div>
            <label className="search-box">
              <span className="sr-only">搜索文章</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索标题或内容"
                type="search"
              />
              <span aria-hidden="true">⌕</span>
            </label>
          </div>
          <div className="filter-row" aria-label="文章分类">
            {categories.map((item) => (
              <button
                className={category === item ? "active" : ""}
                type="button"
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="post-list">
            {visiblePosts.map((post) => (
              <article className="post-row" key={post.slug}>
                <span className="post-number">{post.number}</span>
                <div className="post-summary">
                  <PostMeta post={post} />
                  <h3>
                    <a href={postHref(post)} {...postLinkProps(post)}>{post.title}</a>
                  </h3>
                  <p>{post.excerpt}</p>
                </div>
                <a className="round-link" href={postHref(post)} {...postLinkProps(post)} aria-label={`阅读：${post.title}`}>
                  ↗
                </a>
              </article>
            ))}
            {visiblePosts.length === 0 && (
              <div className="empty-state">
                <p>没有找到相关文章。</p>
                <button type="button" onClick={() => { setCategory("全部"); setQuery(""); }}>
                  清除筛选
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function AboutPage() {
  useEffect(() => {
    document.title = `关于 · ${siteConfig.siteName}`;
    return () => { document.title = `${siteConfig.siteName} · 个人博客`; };
  }, []);

  return (
    <>
      <Header />
      <main className="about-page">
        <header className="about-hero shell">
          <a className="back-link" href="#/">← 返回首页</a>
          <p className="eyebrow">ABOUT</p>
          <h1>你好，我是{siteConfig.name}。</h1>
          <p className="about-lead">{siteConfig.aboutLead}</p>
        </header>

        <section className="about-facts shell" aria-label="个人资料">
          {siteConfig.facts.map((item) => (
            <div className="about-fact" key={item.label}>
              <span>{item.label}</span>
              {item.label === "GitHub" ? (
                <a href={siteConfig.github} target="_blank" rel="noreferrer">
                  {item.value}
                </a>
              ) : (
                <strong>{item.value}</strong>
              )}
            </div>
          ))}
        </section>

        {siteConfig.aboutSections.map((section) => (
          <section className="about-story shell" key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <section className="about-panel shell" aria-labelledby="about-strengths-title">
          <p className="eyebrow">WHAT I PRACTICE</p>
          <h2 id="about-strengths-title">我正在练的能力</h2>
          <div className="strength-grid about-strength-grid">
            {siteConfig.strengths.map((item) => (
              <div className="strength-item" key={item.title}>
                <span>{item.title}</span>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-panel shell" aria-labelledby="about-path-title">
          <p className="eyebrow">NEXT</p>
          <h2 id="about-path-title">接下来怎么走</h2>
          <ol className="path-grid">
            {siteConfig.learningPath.map((item, index) => (
              <li className="path-card" key={item.stage}>
                <span className="path-index">0{index + 1}</span>
                <p>{item.stage}</p>
                <h3>{item.title}</h3>
                <div>{item.detail}</div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-panel about-contact shell">
          <p className="eyebrow">CONTACT</p>
          <h2>可以在这里找到我</h2>
          <div className="contact-links">
            <a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href="#articles">阅读文章 ↗</a>
            <a href="#/path">学习方向 ↗</a>
            <a href="#/site">关于此网站 ↗</a>
            <a href="#/">回到首页 ↗</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ArticlePage({ post }: { post: Post }) {
  useEffect(() => {
    document.title = `${post.title} · ${siteConfig.siteName}`;
    return () => { document.title = `${siteConfig.siteName} · 个人博客`; };
  }, [post]);

  return (
    <>
      <Header />
      <main className="article-page">
        <header className="article-hero shell">
          <a className="back-link" href="#/">← 返回文章列表</a>
          <PostMeta post={post} />
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          {post.externalUrl && (
            <a className="button button-primary article-cta" href={post.externalUrl} target="_blank" rel="noreferrer">
              打开在线教程 ↗
            </a>
          )}
        </header>
        <article className="article-body">
          {post.sections.map((section, index) => {
            if (section.type === "heading") return <h2 key={index}>{section.text}</h2>;
            if (section.type === "quote") return <blockquote key={index}>{section.text}</blockquote>;
            if (section.type === "list") return (
              <ul key={index}>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
            );
            return <p key={index}>{section.text}</p>;
          })}
          <div className="article-end">完 · 感谢阅读</div>
        </article>
        <nav className="article-next shell" aria-label="文章结尾导航">
          <a href="#/">← 查看全部文章</a>
          <a href={post.externalUrl ?? siteConfig.github} target="_blank" rel="noreferrer">
            {post.externalUrl ? "打开在线教程 ↗" : "访问 GitHub ↗"}
          </a>
        </nav>
      </main>
      <Footer />
    </>
  );
}

function PathPage() {
  useEffect(() => {
    document.title = `方向 · ${siteConfig.siteName}`;
    return () => { document.title = `${siteConfig.siteName} · 个人博客`; };
  }, []);

  return (
    <>
      <Header />
      <main className="about-page">
        <header className="about-hero shell">
          <a className="back-link" href="#/">← 返回首页</a>
          <p className="eyebrow">LEARNING PATH</p>
          <h1>正在走的路</h1>
          <p className="about-lead">不追求一步到位，用可以检查的作品记录长期成长。</p>
        </header>

        <section className="about-panel shell" aria-labelledby="path-title">
          <p className="eyebrow">NEXT</p>
          <h2 id="path-title">三个阶段</h2>
          <ol className="path-grid">
            {siteConfig.learningPath.map((item, index) => (
              <li className="path-card" key={item.stage}>
                <span className="path-index">0{index + 1}</span>
                <p>{item.stage}</p>
                <h3>{item.title}</h3>
                <div>{item.detail}</div>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SitePage() {
  const { title, eyebrow, lead, sections } = siteConfig.siteAbout;

  useEffect(() => {
    document.title = `关于此网站 · ${siteConfig.siteName}`;
    return () => { document.title = `${siteConfig.siteName} · 个人博客`; };
  }, []);

  return (
    <>
      <Header />
      <main className="about-page">
        <header className="about-hero shell">
          <a className="back-link" href="#/">← 返回首页</a>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {lead ? <p className="about-lead">{lead}</p> : null}
        </header>

        {sections.map((section) => (
          <section className="about-story shell" key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        {sections.length === 0 && (
          <section className="about-story shell" aria-label="待补充的网站介绍">
            <h2>正文稍后写在这里</h2>
            <p>这一页用来介绍网站本身。结构已经就绪，内容等你定下来再填。</p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function App() {
  const hash = useHashRoute();
  const isAbout = hash === "#about" || hash === "#/about";
  const isSite = hash === "#site" || hash === "#/site";
  const isPath = hash === "#path" || hash === "#/path";
  const match = hash.match(/^#\/post\/([^/?]+)/);
  const post = match ? posts.find((item) => item.slug === match[1]) : undefined;

  let page: ReactNode;
  if (isAbout) {
    page = <AboutPage />;
  } else if (isSite) {
    page = <SitePage />;
  } else if (isPath) {
    page = <PathPage />;
  } else if (match && !post) {
    page = (
      <>
        <Header />
        <main className="not-found shell">
          <span>404</span>
          <h1>这篇文章还不存在。</h1>
          <a className="button button-primary" href="#/">返回首页</a>
        </main>
        <Footer />
      </>
    );
  } else {
    page = post ? <ArticlePage post={post} /> : <HomePage />;
  }

  return <ThemeProvider>{page}</ThemeProvider>;
}

export default App;

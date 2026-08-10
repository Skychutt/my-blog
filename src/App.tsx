import { useEffect, useMemo, useState } from "react";
import { categories, posts, type Post } from "./data/posts";
import { siteConfig } from "./site.config";

type Category = (typeof categories)[number];

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");

  useEffect(() => {
    const update = () => {
      setHash(window.location.hash || "#/");
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return hash;
}

function ThemeButton() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("blog-theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("blog-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      className="icon-button"
      type="button"
      onClick={() => setDark((value) => !value)}
      aria-label={dark ? "切换为浅色主题" : "切换为深色主题"}
      title={dark ? "浅色主题" : "深色主题"}
    >
      {dark ? "日" : "夜"}
    </button>
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
          <a href="#articles">文章</a>
          <a href="#about">关于</a>
          <a href={siteConfig.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
        <ThemeButton />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <p>
          © {new Date().getFullYear()} {siteConfig.name} · 保持好奇，持续记录。
        </p>
        <a href="#/">回到首页 ↑</a>
      </div>
    </footer>
  );
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
  const [category, setCategory] = useState<Category>("全部");
  const [query, setQuery] = useState("");
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const visiblePosts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return posts.filter((post) => {
      const inCategory = category === "全部" || post.category === category;
      const matches =
        !keyword ||
        `${post.title}${post.excerpt}${post.category}`
          .toLowerCase()
          .includes(keyword);
      return inCategory && matches;
    });
  }, [category, query]);

  return (
    <>
      <Header />
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow">SUMMER NOTES · SINCE 2026</p>
            <h1>
              把正在学的，
              <em>认真写下来。</em>
            </h1>
            <p className="hero-intro">{siteConfig.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#articles">
                开始阅读 <span aria-hidden="true">→</span>
              </a>
              <a className="button button-quiet" href="#about">
                认识我
              </a>
            </div>
          </div>
          <aside className="hero-note" aria-label="博主信息">
            <div className="note-tape" aria-hidden="true" />
            <span className="note-index">NO. 001</span>
            <p className="note-script">Hello, world!</p>
            <div className="note-rule" />
            <p>
              这是我的数字花园。
              <br />
              不追热点，只写下真正理解和感受到的事。
            </p>
            <div className="note-signature">
              <span>{siteConfig.name}</span>
              <small>{siteConfig.location}</small>
            </div>
          </aside>
        </section>

        <section className="featured-section shell" aria-labelledby="featured-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EDITOR’S PICK</p>
              <h2 id="featured-title">本期推荐</h2>
            </div>
            <span className="section-number">{featured.number}</span>
          </div>
          <a className="featured-card" href={`#/post/${featured.slug}`}>
            <div className="featured-art" aria-hidden="true">
              <div className="sun" />
              <div className="horizon line-one" />
              <div className="horizon line-two" />
              <span>夏日 / 记录</span>
            </div>
            <div className="featured-copy">
              <PostMeta post={featured} />
              <h3>{featured.title}</h3>
              <p>{featured.excerpt}</p>
              <span className="text-link">阅读全文 ↗</span>
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
                    <a href={`#/post/${post.slug}`}>{post.title}</a>
                  </h3>
                  <p>{post.excerpt}</p>
                </div>
                <a className="round-link" href={`#/post/${post.slug}`} aria-label={`阅读：${post.title}`}>
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

        <section className="about-section" id="about">
          <div className="shell about-grid">
            <div>
              <p className="eyebrow">ABOUT THE AUTHOR</p>
              <h2>你好，我是{siteConfig.name}。</h2>
            </div>
            <div className="about-copy">
              <p>{siteConfig.role}</p>
              <p>
                我相信公开记录是最好的学习方式之一。这里不会只有已经完成的答案，也会保留探索中的问题、走过的弯路，以及每一次重新出发。
              </p>
              <div className="contact-links">
                <a href={`mailto:${siteConfig.email}`}>写邮件 ↗</a>
                <a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              </div>
            </div>
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
          <a href={`mailto:${siteConfig.email}`}>和我聊聊 ↗</a>
        </nav>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const hash = useHashRoute();
  const match = hash.match(/^#\/post\/([^/?]+)/);
  const post = match ? posts.find((item) => item.slug === match[1]) : undefined;

  if (match && !post) {
    return (
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
  }

  return post ? <ArticlePage post={post} /> : <HomePage />;
}

export default App;

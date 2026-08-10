export type PostSection =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "技术" | "成长" | "生活";
  date: string;
  displayDate: string;
  readingTime: string;
  featured?: boolean;
  number: string;
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "why-i-built-this-blog",
    title: "为什么我要在这个夏天，认真搭一个博客",
    excerpt:
      "不是为了拥有一个更漂亮的主页，而是想为持续学习建立一块真正属于自己的地方。",
    category: "成长",
    date: "2026-08-08",
    displayDate: "2026.08.08",
    readingTime: "5 分钟",
    featured: true,
    number: "01",
    sections: [
      {
        type: "paragraph",
        text: "我收藏过很多文章，也在不同平台写过零散的笔记。但时间一久，它们总会被新的信息淹没。这个夏天，我决定搭一个自己的博客，把真正理解过的事情留下来。",
      },
      { type: "heading", text: "网站不是终点" },
      {
        type: "paragraph",
        text: "写代码只是第一步。更重要的是建立一个可以长期运转的系统：学习、实践、整理、发布，再回头修正。博客只是让这条链路变得可见。",
      },
      {
        type: "quote",
        text: "不要等待一切准备好。先把第一块砖放下，秩序会在持续行动中出现。",
      },
      { type: "heading", text: "我准备在这里写什么" },
      {
        type: "list",
        items: [
          "能够复现的技术实践，而不是只记录结论",
          "读完一本书之后，真正改变了我的部分",
          "个人项目的进展、失败和复盘",
          "一些缓慢但值得记住的日常",
        ],
      },
      {
        type: "paragraph",
        text: "如果一年之后回来看，这里留下的不只是一批文章，而是一条清晰的成长轨迹，那么这个夏天的投入就已经值得。",
      },
    ],
  },
  {
    slug: "git-notes-for-beginners",
    title: "给初学者的 Git 笔记：先理解，再记命令",
    excerpt:
      "用一次真实的代码修改，理解工作区、暂存区、提交和远程仓库之间到底发生了什么。",
    category: "技术",
    date: "2026-08-03",
    displayDate: "2026.08.03",
    readingTime: "8 分钟",
    number: "02",
    sections: [
      {
        type: "paragraph",
        text: "刚开始接触 Git 时，最容易做的事就是背命令。可一旦遇到冲突或误操作，背下来的顺序马上失效。更有效的方法，是先理解文件在几个状态之间如何移动。",
      },
      { type: "heading", text: "一次修改的完整旅程" },
      {
        type: "list",
        items: [
          "在工作区修改文件",
          "用 git add 选择这次准备提交的内容",
          "用 git commit 保存一个清晰的版本节点",
          "用 git push 把本地提交同步到 GitHub",
        ],
      },
      {
        type: "paragraph",
        text: "把每次提交当成一条写给未来自己的说明。一个好的提交应该只解决一件事，并且能从标题看出为什么要改。",
      },
      {
        type: "quote",
        text: "Git 的价值不是让代码永远不出错，而是让每一次变化都有迹可循。",
      },
    ],
  },
  {
    slug: "a-slow-summer-day",
    title: "一个没有安排满的夏日下午",
    excerpt:
      "关掉提醒，读几页书，沿着河边走一段路。空白有时并不是浪费，而是在恢复感受力。",
    category: "生活",
    date: "2026-07-28",
    displayDate: "2026.07.28",
    readingTime: "4 分钟",
    number: "03",
    sections: [
      {
        type: "paragraph",
        text: "暑假很容易变成另一张密密麻麻的课表。想学的技术、想看的书、想完成的项目，都在争夺时间。可真正让我重新有精力的，常常是一个没有被安排满的下午。",
      },
      { type: "heading", text: "给注意力留一点空白" },
      {
        type: "paragraph",
        text: "我把手机留在房间里，带一本书出门。没有必须完成的页数，也没有一定要走到的目的地。放慢之后，风、树影和纸张翻动的声音才重新变得清楚。",
      },
      {
        type: "quote",
        text: "休息不是对努力的背叛，它让努力重新拥有方向。",
      },
    ],
  },
  {
    slug: "first-week-of-learning-react",
    title: "学习 React 的第一周，我真正弄懂了什么",
    excerpt:
      "从组件、状态到数据流：暂时放下复杂生态，只抓住几个能够解释页面变化的核心概念。",
    category: "技术",
    date: "2026-07-21",
    displayDate: "2026.07.21",
    readingTime: "7 分钟",
    number: "04",
    sections: [
      {
        type: "paragraph",
        text: "第一周我看了不少教程，也复制过很多组件。真正的转折发生在我不再追求记住所有 API，而是开始追问：页面为什么会在数据变化后重新呈现？",
      },
      { type: "heading", text: "三个足够重要的概念" },
      {
        type: "list",
        items: [
          "组件是把界面与行为组织在一起的方式",
          "属性让父组件把信息交给子组件",
          "状态描述会随交互变化、并需要反映到界面的数据",
        ],
      },
      {
        type: "paragraph",
        text: "当这三个概念连起来之后，许多看似独立的写法都有了共同的解释。接下来需要做的不是继续堆教程，而是完成一个规模足够小的真实项目。",
      },
    ],
  },
];

export const categories = ["全部", "技术", "成长", "生活"] as const;

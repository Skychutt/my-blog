export type PostSection =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "gallery"; images: { src: string; alt: string }[]; caption?: string };

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
  externalUrl?: string;
  coverImage?: { src: string; alt: string };
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "kotlin-syntax-course",
    title: "Kotlin 全语法教程：从零基础到 Android 独立开发",
    excerpt:
      "大三开学要学 Android，我用 Codex 做了一套 Kotlin 学习页。先看这篇简介，再点开始学习。",
    category: "技术",
    date: "2026-08-20",
    displayDate: "2026.08.20",
    readingTime: "约 12 分钟",
    number: "05",
    externalUrl: "https://skychutt.github.io/Kotlin_study/",
    coverImage: {
      src: "/images/kotlin/hero.png",
      alt: "Kotlin 标志",
    },
    sections: [
      {
        type: "paragraph",
        text: "大三开学要学移动端开发，也就是 Android App。Android 现在主流语言是 Kotlin，所以我想在开学前先把这门语言学起来，上课时不至于从头摸索。暑假里我用 Codex 做了一个 Kotlin 学习项目，把语法和 Android 相关内容整理成网页。这篇文章先讲我为什么做它，以及 Kotlin 是一门什么样的语言。看完以后，再用文末的「开始学习」打开教程。",
      },
      {
        type: "gallery",
        caption: "大三开学要做的就是这个：用 Kotlin 写 Android App。",
        images: [
          { src: "/images/kotlin/android.png", alt: "Android 标志" },
          { src: "/images/kotlin/phone.png", alt: "手机上的 Android" },
        ],
      },
      { type: "heading", text: "这套学习页是怎么来的" },
      {
        type: "paragraph",
        text: "我没有打算自己从零手写一整套课程平台。时间有限，目标也很具体：给自己准备一份能打开、能搜、能测验、进度还能留在浏览器里的中文材料。Codex 负责把页面和交互搭起来，内容按 Kotlin 语法到现代 Android 开发来组织。源码在 GitHub，仓库是 https://github.com/Skychutt/Kotlin_study 。网页也可以直接在线用，不一定非要先把仓库克隆下来。",
      },
      {
        type: "paragraph",
        text: "网页里有目录、搜索、代码复制、深色模式和测验。学习进度存在浏览器本地，换一台设备不会自动跟着走；如果要离线看，也可以把页面保存下来。它不是官方教材，是我给自己准备的学习材料，公开出来方便需要的人用。",
      },
      {
        type: "list",
        items: [
          "Kotlin 语法：变量、空安全、函数、类、集合、协程和 Flow",
          "Android 基础：生命周期、Intent、权限和项目结构",
          "Jetpack Compose、Navigation、ViewModel 和数据层",
          "网络、Room、离线同步，以及可以验收的小项目",
        ],
      },
      { type: "heading", text: "Kotlin 是怎么出现的" },
      {
        type: "paragraph",
        text: "Kotlin 是 JetBrains 做的编程语言。JetBrains 就是开发 IntelliJ IDEA 的那家公司，Android Studio 也是基于 IntelliJ 改的，所以后来 Kotlin 和 Android 走得很近，并不奇怪。项目大约在 2010 年开始做，2011 年对外公布。早期的语言设计由 Andrey Breslav 负责。语言名字来自圣彼得堡附近波罗的海的科特林岛（Kotlin Island）。Java 的名字来自爪哇岛，Kotlin 也用岛来命名，多少有一点对应的意思。",
      },
      {
        type: "image",
        src: "/images/kotlin/intellij.png",
        alt: "IntelliJ IDEA 标志",
        caption: "IntelliJ IDEA 是 JetBrains 的开发工具，Android Studio 也是在它的基础上做的。",
      },
      {
        type: "paragraph",
        text: "JetBrains 自己写了大量 Java。他们觉得 Java 能用、生态也大，但写起来啰嗦，空指针又容易出问题。当时已经有 Scala 这类跑在 JVM 上的语言，可 Scala 编译慢、概念也更重，不太适合他们这种要在 IDE 里大规模使用的场景。Kotlin 的目标比较务实：语法更短，类型更安全，同时必须能和现有 Java 代码互相调用。Kotlin 可以调 Java，Java 也可以调 Kotlin。老项目不用推倒重来，新代码可以慢慢用 Kotlin 写。",
      },
      {
        type: "paragraph",
        text: "2012 年 Kotlin 以 Apache 2.0 协议开源。2016 年 2 月 15 日发布 1.0，表示语言本身稳定了，可以在正式项目里用。对一门新语言来说，1.0 很关键：语法不会动不动大改，公司才敢往生产环境放。",
      },
      {
        type: "paragraph",
        text: "和 Android 的关系是后面几年才真正拉开的。2017 年 Google I/O，Google 宣布官方支持用 Kotlin 开发 Android。2019 年 Google I/O 又进一步说，Kotlin 是 Android 开发的优先语言。再往后，Jetpack Compose、很多官方示例和文档，都是 Kotlin 优先。现在新建一个 Android 项目，Android Studio 默认也是 Kotlin。所以大三学移动端，把 Kotlin 当作主语言，是顺着这条路走，不是赶时髦。",
      },
      {
        type: "image",
        src: "/images/kotlin/kotlin-android.png",
        alt: "Kotlin for Android App Development",
        caption: "现在 Android 官方把 Kotlin 当作优先语言。",
      },
      {
        type: "paragraph",
        text: "中间还有几件比较关键的事。2018 年前后，协程成为稳定功能，异步写法有了官方方案。2021 年 Jetpack Compose 1.0 发布，Google 把声明式 UI 和 Kotlin 绑在一起推。2024 年 Kotlin 2.0 把新的 K2 编译器作为默认，编译速度和提示都会受影响。版本号不必入门时全记住，但能看出这门语言不是停在 2016 年的 1.0 就不管了，JetBrains 和 Google 都还在往前推。",
      },
      {
        type: "paragraph",
        text: "Kotlin 不只能写 App。它可以跑在 JVM 上做后端，也能编译到 JavaScript、Native，这几年还在推 Kotlin Multiplatform，想让一套逻辑用在不同平台。这些方向我不一定马上都用到。对我现在最要紧的，还是 Android。",
      },
      { type: "heading", text: "这门语言主要解决什么问题" },
      {
        type: "paragraph",
        text: "如果只用一句话概括：Kotlin 想在 JVM 和 Android 上，提供一门比 Java 更短、更安全、又能复用现有生态的语言。它不是为了另起一套完全不相干的世界，而是让人在已有的 Java 库、工具和项目上，写得轻松一点、少踩一点空指针。",
      },
      {
        type: "paragraph",
        text: "空安全是最常被提到的一点。Java 里很多崩溃来自 NullPointerException。Kotlin 把「这个值能不能为空」写进类型：String 和 String? 不是同一种东西。编译器会要求你处理空值，而不是等到 App 跑起来才崩。学 Android 时，这是最先要习惯的变化之一。比如从界面上取一段文字、从接口里读一个字段，都可能是空的。Kotlin 会逼你写 if、?: 或者 ?. 这类处理，漏写往往直接编不过。一开始会觉得烦，后面会发现它是在帮你少排一类很常见的错。",
      },
      {
        type: "paragraph",
        text: "第二是少写重复代码。同样一件事，Kotlin 通常比 Java 短。data class 可以生成 equals、hashCode、toString 和 copy。函数可以有默认参数和命名参数。类型常常能推断出来，不必每个地方都把类型写全。对写界面和业务代码来说，少一层样板，阅读和修改都会轻松一些。",
      },
      {
        type: "paragraph",
        text: "第三是扩展函数。可以给已经存在的类增加新函数，不必改它的源码，也不必先做一堆工具类。Android 官方库里很多 Kotlin 写法，就是扩展。后面读示例代码时会经常碰到。",
      },
      {
        type: "paragraph",
        text: "第四是协程。App 里网络请求、读数据库、更新界面，经常是异步的。Java 里常见回调套回调，自己管线程也容易出错。Kotlin 用协程把异步写成比较接近同步的样子。Android 里 ViewModel、网络库、数据库现在都和协程绑得很紧，这是后面做项目几乎躲不开的一块。常见写法是在 ViewModel 里起一个协程发请求，结果再回到主线程更新界面。细节在学习页里会练，这里只要先有这个印象：Kotlin 把「别堵主线程」这件事，做得比早期 Android 的 AsyncTask、一堆回调更清楚。",
      },
      {
        type: "paragraph",
        text: "另外还有 when 表达式、密封类、智能类型转换、集合上的 map 和 filter、委托属性这些。教程网页会按章节讲，这里不展开成语法课。先知道 Kotlin 不是「换了皮的 Java」，它在空安全、异步和减少样板代码上，确实做了自己的设计。",
      },
      {
        type: "paragraph",
        text: "和 Java 互操作不只是能编译到一起。Kotlin 调用 Java 时，一般可以直接用原来的类和方法。Java 调用 Kotlin 时，有时会看到默认参数变成一串重载，或者需要 @JvmStatic、@JvmOverloads 这类注解。入门阶段先会写 Kotlin 就行，等真的接到老库，再查对应写法。IntelliJ 和 Android Studio 也提供 Java 转 Kotlin 的功能，适合看同一段逻辑在两种语言里差在哪，不适合依赖它交作业。",
      },
      { type: "heading", text: "和 Java 是什么关系" },
      {
        type: "paragraph",
        text: "学 Android 还是会碰到 Java。很多老项目、依赖库、报错栈还是 Java。Kotlin 的好处是你不用先把 Java 全部扔掉。能看懂一点 Java 有帮助，新代码可以主要用 Kotlin。Google 现在的模板项目也是 Kotlin。我自己的安排也是这样：先把 Kotlin 语法和常用写法练熟，再进入 Activity、Compose 和项目结构，而不是两边同时硬啃。",
      },
      {
        type: "paragraph",
        text: "为什么 Google 会把 Kotlin 定为优先，而不是继续只推 Java，大致有几条比较实际的原因。第一，空安全能在编译期拦住一类很常见的崩溃。第二，语法短，写 RecyclerView、网络回调、数据类这类样板很多的代码时，差别很明显。第三，Android Studio 本来就来自 JetBrains，工具链配合成本低。第四，Kotlin 可以渐进迁移，一个模块一个文件地改，不必停工重写。这些加在一起，比再发明一门完全不能碰 Java 库的语言更适合 Android 这种已经有十几年存量代码的平台。",
      },
      {
        type: "paragraph",
        text: "Kotlin 也还在更新。协程在 1.3 成为稳定功能。后面的版本一直在改编译器、多平台和 IDE 支持。2024 年的 Kotlin 2.0 把新的 K2 编译器作为默认，编译和提示都会受影响。这些版本细节入门时不必记全，知道它是一门还在维护、Google 也在用的语言就够了。",
      },
      { type: "heading", text: "怎么开始学" },
      {
        type: "paragraph",
        text: "这篇是简介，不是教程正文。下面「开始学习」会打开我做的在线学习页。仓库在 GitHub，可以看源码，也可以自己下载页面离线用。进度保存在当前浏览器里。如果后面我改了内容，把代码推上去，学习页也会一起更新。",
      },
      {
        type: "paragraph",
        text: "我自己的用法很简单：先把这篇当背景看完，知道 Kotlin 从哪来、为什么 Android 要用它；然后再进学习页，从语法开始往下做。大三课上如果讲到 Activity、权限、网络这些，也能回到这份材料里对照。它解决的是「开学前缺一份能一直打开的中文入口」，不是替代官方文档，也不是替代老师讲课。",
      },
    ],
  },
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

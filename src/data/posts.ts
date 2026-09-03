export type PostSection =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string; tall?: boolean }
  | { type: "gallery"; images: { src: string; alt: string }[]; caption?: string }
  | {
      type: "schedule";
      caption?: string;
      days: {
        day: string;
        date: string;
        weekday: string;
        title: string;
        image: string;
        items: { time: string; title: string; detail?: string; place?: string; tag?: string }[];
      }[];
    };

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
  ctaLabel?: string;
  ctaHint?: string;
  coverImage?: { src: string; alt: string };
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "traditional-machine-learning",
    title: "传统机器学习：先把经典算法认清楚",
    excerpt:
      "线性回归、决策树、SVM 这些算法从哪来，代码里怎么写，生活里又在哪儿用。讲义页可以打开学。",
    category: "技术",
    date: "2026-09-03",
    displayDate: "2026.09.03",
    readingTime: "约 12 分钟",
    number: "08",
    externalUrl: "https://skychutt.github.io/traditional-machine-learning-course/",
    sections: [
      {
        type: "paragraph",
        text: "最近大模型很热闹，聊天、识图、写代码都能上手试。可学校里、实验室里、很多公司线上还在跑的，往往不是一张很大的神经网络，而是线性回归、逻辑回归、决策树、SVM、聚类这些更老的方法。它们被叫做传统机器学习。名字听着旧，用起来并不过时。",
      },
      {
        type: "paragraph",
        text: "我把这些内容整理成一份中文讲义库，一共 120 节，从数学底子讲到回归、分类、树模型、聚类、降维和工程评估。每节都是能点进去的完整页，有直觉、公式、步骤，也有 Python 代码。在线地址是 https://skychutt.github.io/traditional-machine-learning-course/ 。这篇文章先把地图画清楚：这些算法从哪来，代码里长什么样，生活里又在哪儿用。看完再用文末的「开始学习」打开讲义。",
      },
      {
        type: "image",
        src: "/images/ml/ai-ml-dl.png",
        alt: "人工智能包含机器学习，机器学习包含深度学习",
        caption: "外圈是人工智能，中间是机器学习，最里面才是深度学习。传统机器学习主要在中间这一层。",
      },
      { type: "heading", text: "传统机器学习在哪一层" },
      {
        type: "paragraph",
        text: "人工智能范围最大，目标是让机器做一些以前只有人会做的事。机器学习是其中一条路：不把规则一条条写死，而是从数据里学规律。深度学习又是机器学习里的一支，靠多层神经网络自己找特征，图像、语音、文本现在多走这条路。",
      },
      {
        type: "paragraph",
        text: "传统机器学习站在中间这一层，但不走很深的网络。它通常要你先把特征想明白：房价看面积和地段，垃圾邮件看关键词和发信频率，风控看收入和还款记录。模型负责在这些特征上拟合一条线、一棵树，或者一块决策边界。数据、训练、表示、预测，这条链路和深度学习是通的，只是中间那个「表示」更多是人先定好的。",
      },
      {
        type: "paragraph",
        text: "所以它不是深度学习的对立面。很多线上系统仍然先用树模型和线性模型，因为快、稳、好解释。表格数据尤其如此。照片识别可以交给深度网络，一张业务表上的分数，随机森林往往就够用。",
      },
      {
        type: "image",
        src: "/images/ml/algorithms.png",
        alt: "线性回归、逻辑回归、决策树等十种经典算法示意",
        caption: "常见的一批经典算法。有的管预测数字，有的管分类，有的管分群，图上也能看见深度学习和强化学习。",
      },
      { type: "heading", text: "这些算法是怎么来的" },
      {
        type: "paragraph",
        text: "它们不是同一年发明的，也不是先有「机器学习」这个词，再长出一套算法。很多方法更早出现在测量、统计和运筹里，后来数据多了、计算机便宜了，才被收进同一门课。",
      },
      {
        type: "image",
        src: "/images/ml/timeline.png",
        alt: "从最小二乘到 scikit-learn 的传统机器学习时间线",
        caption: "从最小二乘、感知机、K-means，到决策树、SVM、随机森林，再到 scikit-learn 把它们收进一套接口。",
      },
      {
        type: "paragraph",
        text: "线性回归的根子很老。十九世纪初，勒让德和高斯用最小二乘处理天文观测误差：找一条线，让预测和真实值差的平方尽量小。今天预测房价、销量、广告点击，用的还是这件事。逻辑回归把这条线弯成 0 到 1 的概率，用来判断会不会、是不是。垃圾邮件、疾病阴阳性、用户会不会下单，都常从它起步。",
      },
      {
        type: "paragraph",
        text: "决策树更好懂：按问题往下分。收入高不高、有没有房、过去有没有逾期，每问一次，样本就被切开。1984 年的 CART 把这件事写成能算的算法，分类和回归都能做。一棵树容易过拟合，于是有人种很多棵，再投票或平均，这就是随机森林，2001 年前后由 Breiman 系统写出来。现在银行看一笔贷款要不要过，工业上看零件正不正常，树模型和森林仍然很常见。",
      },
      {
        type: "paragraph",
        text: "支持向量机出在 1990 年代。Vapnik 他们想的是：两类点之间，不只是分开就行，还要让中间那条缝尽量宽。核技巧能把不好切开的数据抬到更高维再切。小样本、特征多的时候，它一度非常好用。K 近邻更朴素，新点看邻居投票。贝叶斯那一支从条件概率来，朴素贝叶斯在文本分类里很能打。K-means 则是 1960 年代就有的分群方法：先随便放几个中心，再把点归过去、把中心挪过来，来回几次，超市用户、照片主色、基站覆盖，都能先这样切开看。",
      },
      {
        type: "paragraph",
        text: "后面还有提升树。AdaBoost、GBDT，再到 XGBoost、LightGBM，把一棵不够强的树接成一串，比赛和工业界都吃过很久的红利。2010 年前后，scikit-learn 把这些算法收成同一套 fit / predict 接口。你换模型，往往只换一行类名。传统机器学习能走进课堂和公司，和这件事关系很大。",
      },
      { type: "heading", text: "放到代码里是什么样" },
      {
        type: "paragraph",
        text: "原理可以写很长，真正上手往往就四步：把表格读进来，切成训练集和测试集，调用 fit 训练，再 predict 看结果。线性回归预测房价，大概就是这个样子。",
      },
      {
        type: "image",
        src: "/images/ml/sklearn.png",
        alt: "用 scikit-learn 做训练和预测的四步",
        caption: "准备数据、fit、predict、看指标。换逻辑回归或随机森林，结构几乎不变。",
      },
      {
        type: "paragraph",
        text: "逻辑回归把 LinearRegression 换成 LogisticRegression，输出就变成类别或概率。随机森林是 RandomForestClassifier 或 RandomForestRegressor，树的数量、深度可以调。K-means 没有标签，fit 的是一堆点，predict 给出每条样本属于哪一群。评估也不神秘：回归看 MAE、RMSE、R²，分类看准确率、精确率、召回和 AUC。这些指标讲义后面单独有课。",
      },
      {
        type: "paragraph",
        text: "课上如果只抄一段能跑的代码，收获有限。更有用的是改它。把面积单位换掉，看系数怎么变；把树的深度加大，看训练集分数升高、测试集有没有掉下来。传统机器学习的好处就在这里：模型小，错了也容易查。深度网络也能查，只是变量更多，第一次练手更容易迷路。",
      },
      {
        type: "list",
        items: [
          "回归：LinearRegression、Ridge、Lasso，用来预测连续数字",
          "分类：LogisticRegression、SVM、随机森林，用来判断类别",
          "聚类：KMeans、DBSCAN，用来在没有标签时把样本分开",
          "评估：train_test_split、cross_val_score、classification_report",
        ],
      },
      { type: "heading", text: "生活里其实一直在用" },
      {
        type: "paragraph",
        text: "这些算法不需要先长成聊天机器人，才会有用。很多已经在你每天碰到的服务后面转。",
      },
      {
        type: "image",
        src: "/images/ml/reallife.png",
        alt: "风控、垃圾邮件、医院化验、用户分群、工厂质检和房价估算",
        caption: "风控打分、垃圾邮件、化验辅助、超市分群、工厂质检、房价估算，都还在用传统模型。",
      },
      {
        type: "paragraph",
        text: "银行看一笔消费或贷款，常用的是评分卡：把收入、负债、历史逾期变成可加的分数，底层多是逻辑回归。邮箱把推销和诈骗信丢进垃圾箱，早期就是朴素贝叶斯和线性分类器，现在前面可能会加更复杂的模型，但这层判断没有消失。医院里一些化验指标的辅助判断，也仍然是逻辑回归或树模型，因为医生要问「凭什么判成这样」，深度网络有时答不利落。",
      },
      {
        type: "paragraph",
        text: "超市和 App 会把用户分成几群，再决定推什么券，这是聚类。工厂看零件尺寸飘不飘、表面有没有异常，常用的是树模型或异常检测。中介和平台估房价，面积、楼层、地铁距离一列列排好，线性回归就能给出一个能解释的价。推荐和广告里，深度模型很强，可冷启动、小样本、要出报告的时候，传统方法还是第一选择。",
      },
      { type: "heading", text: "为什么现在还要学" },
      {
        type: "paragraph",
        text: "大模型会写代码、会解释概念，可它替不了两件事。第一件是你自己能判断：这是回归还是分类，有没有标签，错了代价有多大。第二件是你能把一个小模型跑通，并说清楚它为什么给出这个结果。表格数据上，先做传统机器学习，往往比一上来堆网络更合适。",
      },
      {
        type: "paragraph",
        text: "对软件工程来说，这也是一条很实在的线。数据怎么清洗，特征怎么做，训练和测试怎么切开，指标怎么看，模型怎么接到一个接口后面。这些能力和写网站、写后端是通的。先在小模型上把这条链路走熟，以后再碰深度学习或大模型应用，不会每一步都是黑盒。",
      },
      {
        type: "paragraph",
        text: "讲义按四条主线排：数学与数据基础、监督学习、无监督学习、评估与工程实践。一共 8 个模块、120 节。第一课是全景图和学习路线，从那里点进去就行。公式和代码都在页面里，不必先把这篇文章当教材背下来。",
      },
    ],
  },
  {
    slug: "alibaba-global-dreamers-2026",
    title: "全球梦想家：五天杭州，重新认识阿里",
    excerpt:
      "今年八月去杭州参加了阿里巴巴全球梦想家夏令营。听完电商、云和千问，跟组员做了私人 AI 营养师，最后还去了西湖。",
    category: "成长",
    date: "2026-08-30",
    displayDate: "2026.08.30",
    readingTime: "约 11 分钟",
    number: "07",
    externalUrl: "https://skychutt.github.io/ai-nutritionist-presentation/",
    ctaLabel: "查看营养师展示",
    ctaHint: "智能体后来做成了一页演示，可以从这里打开。",
    coverImage: {
      src: "/images/alibaba-camp/03-lecture-hall.png",
      alt: "全球梦想家夏令营讲座现场",
    },
    sections: [
      {
        type: "paragraph",
        text: "今年夏天，8 月 3 日到 7 日，我在杭州待了五天，参加阿里巴巴的「全球梦想家」夏令营。从北京过去的时候还挺热，西溪园区比想象中安静，路两边都是树，楼名也一个比一个好听。走进去才有实感：平时在新闻里看到的公司，原来是可以走进去坐一坐的。",
      },
      {
        type: "paragraph",
        text: "营里大概七十多人，本科生研究生都有，有人从国外回来，也有人就在附近读书。五天排得很满：看园区，听电商、云和通义千问，去浙大转一圈，再走进公益助残项目。所有人被分成八组，每组都要在百炼上做出一个智能体，周五下午答辩。下面是每天的日程，先扫一眼就知道这五天有多满。",
      },
      {
        type: "schedule",
        caption: "五天日程。图是每天原海报，下面是同一份场次，字可以看清。",
        days: [
          {
            day: "01",
            date: "8.3",
            weekday: "周一",
            title: "阿里文化之旅 / AI时代的商业",
            image: "/images/alibaba-camp/01-schedule-day1.png",
            items: [
              { time: "09:30–10:10", title: "参观 9 号馆", detail: "赫本 / 原霞 · 阿里巴巴集团对外联络部副总监", place: "9号馆" },
              { time: "10:10–11:30", title: "感受阿里文化：合伙人面对面", detail: "闻佳 · 阿里巴巴合伙人 / 集团公共事务总裁", place: "9号馆" },
              { time: "13:30–14:30", title: "学员组队成团 + 团队展示", place: "A区访客中心-202N仙剑山庄" },
              { time: "14:40–15:40", tag: "AI技能", title: "从搜索框到对话框：淘天探索 AI 电商新体验", detail: "陈畅言 · 淘天集团业务发展中心总监", place: "A区访客中心-202N仙剑山庄" },
              { time: "16:00–17:30", title: "淘宝直播 — 品质直播方法论", detail: "吕俐颖 · 交个朋友淘宝事业线选品中心副总监", place: "A区访客中心-202N仙剑山庄" },
            ],
          },
          {
            day: "02",
            date: "8.4",
            weekday: "周二",
            title: "AI 科技探寻",
            image: "/images/alibaba-camp/01-schedule-day2.png",
            items: [
              { time: "09:30–10:30", title: "云谷之旅 — 参观阿里云展厅", detail: "金桦 · 阿里云智能集团客户工作部主任", place: "云谷展厅" },
              { time: "10:45–12:00", tag: "AI技能", title: "千问 — AI to C 大模型发展与应用", detail: "危晓桐 · 阿里千问事业部公共事务总监", place: "云谷园区访客中心 352 会议室" },
              { time: "13:30–14:30", tag: "AI实训", title: "千问办公 — AI 时代的办公搭子", detail: "姜和 · 千问办公产品经理", place: "云谷园区访客中心 352 会议室" },
              { time: "14:40–16:00", tag: "AI实训", title: "AI 时代的模型评测和数据标注", detail: "苗林林 · 阿里数据晓天衡宇产品负责人", place: "云谷园区访客中心 352 会议室" },
              { time: "16:00–17:30", tag: "AI实训", title: "百炼 — 个性化 Agent 搭建实操，为周五结业智能体创作大赛预演", detail: "王文捷 · 阿里云智能集团战略发展总监", place: "云谷园区访客中心 352 会议室" },
            ],
          },
          {
            day: "03",
            date: "8.5",
            weekday: "周三",
            title: "智能经济和数字生活",
            image: "/images/alibaba-camp/01-schedule-day3.png",
            items: [
              { time: "09:30–11:00", title: "闪购与新就业形态 — 骑手和商家代表面对面", detail: "圣美莉 · 淘宝闪购党办主任 / 黄晓琴 · 淘宝闪购城市骑手代言人", place: "C区访客中心-青玉案阶梯教室" },
              { time: "11:00–12:00", title: "电商与消费者权益保护", detail: "王维 · 阿里集团政府事务部总监", place: "C区访客中心-青玉案阶梯教室" },
              { time: "14:00–15:00", tag: "AI技能", title: "AI 原生的科研范式", detail: "胡锐 · 阿里云高校合作专家", place: "浙江大学艺术与考古博物馆报告厅" },
              { time: "15:00–16:00", title: "高校 AI 社区与 AI 时代的创业和职业发展", detail: "石弘毅 · 浙江大学AI生态资源对接部", place: "浙江大学艺术与考古博物馆报告厅" },
              { time: "16:00–17:00", title: "浙大自由参观", detail: "自由活动", place: "浙江大学-紫金港校区" },
            ],
          },
          {
            day: "04",
            date: "8.6",
            weekday: "周四",
            title: "公益 · 智能向善",
            image: "/images/alibaba-camp/01-schedule-day4.png",
            items: [
              { time: "09:30–10:30", title: "阿里乡村振兴案例分享", detail: "陆昕 · 阿里巴巴集团助力乡村振兴办公室主任", place: "C区访客中心-青玉案阶梯教室" },
              { time: "10:40–12:00", title: "阿里星学长面对面 — AI 时代的学业和职业", detail: "邱中炜 · 达摩院 AI 医疗技术团队", place: "C区访客中心-青玉案阶梯教室" },
              { time: "14:00–17:00", title: "余杭融爱助残中心参观及科技助残分享交流", detail: "申志民 · 阿里公益扶老助残负责人", place: "余杭融爱中心" },
            ],
          },
          {
            day: "05",
            date: "8.7",
            weekday: "周五",
            title: "分组答辩 + 结业",
            image: "/images/alibaba-camp/01-schedule-day5.png",
            items: [
              { time: "09:30–12:00", tag: "AI实训", title: "分组共创，完成智能体搭建，准备下午答辩", detail: "自由活动", place: "C区访客中心-青玉案阶梯教室" },
              { time: "13:30–17:30", tag: "AI实训", title: "结业答辩：Agent Creator 智能体创作大赛", detail: "分组展示成果，评委评分并颁奖。阿里高级评委 4 位。", place: "C区访客中心-青玉案阶梯教室" },
            ],
          },
        ],
      },
      { type: "heading", text: "这五天听了什么" },
      {
        type: "paragraph",
        text: "第一天先参观 9 号馆，再听合伙人讲阿里文化。下午组队，然后听淘天怎么把搜索做成对话，晚上还有淘宝直播怎么做内容。第二天去云谷，先看阿里云展厅，再连着听千问、千问办公、模型评测，最后用百炼上手搭 Agent，给周五答辩打底。",
      },
      {
        type: "paragraph",
        text: "星期三更生活一点。上午听闪购，骑手和商家代表就坐在对面讲；也听电商和消费者权益。下午去浙江大学，听 AI 科研和高校社区，结束还能在紫金港随便走走。星期四上午是乡村振兴和阿里星学长面对面，下午去余杭融爱助残中心，看科技怎么帮上忙。星期五上午各组赶工，下午上场讲自己的智能体。",
      },
      {
        type: "paragraph",
        text: "对我来说，这些场次最有用的不是记下一串产品名，而是看见一家公司怎样把生意、技术和组织放在同一条线上讲。以前上课接触的多是工具本身，很少听到工具背后那套活着的业务。听完才知道，云、模型和本地生活不是三份独立的 PPT，它们本来就在同一件事里转。",
      },
      {
        type: "gallery",
        caption: "讲座现场。一边听阿里的发展，一边听云和模型怎么落到具体业务里。",
        images: [
          { src: "/images/alibaba-camp/03-lecture-hall.png", alt: "报告厅听讲" },
          { src: "/images/alibaba-camp/04-lecture-talk.png", alt: "发展大事记讲座" },
        ],
      },
      { type: "heading", text: "第一组，私人 AI 营养师" },
      {
        type: "paragraph",
        text: "我被分到第一组。组员来自全国各地，有人在美国读书，有人在英国，也有人在国内。专业也不一样：我是软件工程，还有电气工程、数据处理、艺术和传媒。第一天下午组队的时候，大家还不太熟，自我介绍都带着点小心。题目一定下来，话就密了。谁能把需求说清楚，谁能把流程画出来，谁能在百炼上把节点接上，各干各的，反而比同专业扎堆更顺。",
      },
      {
        type: "image",
        src: "/images/alibaba-camp/05-group.png",
        alt: "第一组同学在一起",
        caption: "第一组。来自不同城市、不同专业，五天里围着同一个智能体转。",
      },
      {
        type: "paragraph",
        text: "题目最后定成「私人 AI 营养师」。你跟它说减脂还是增肌，它按目标给下一餐建议；拍一张饭菜，它估热量和蛋白质；再说一下自己在哪儿，它能从地图里找附近能吃的餐厅。以后还想接到外卖。想法不复杂，但这几天刚听完识图、千问和本地生活，正好能串成一条能演示的链。后来我把这套智能体做成了网页展示，背景、能力和百炼工作流都在上面，地址是 https://skychutt.github.io/ai-nutritionist-presentation/ 。文末也可以直接打开。",
      },
      {
        type: "gallery",
        caption: "答辩现场。我们把营养师智能体的流程讲了一遍。",
        images: [
          { src: "/images/alibaba-camp/07-defense-team.png", alt: "小组答辩合影" },
          { src: "/images/alibaba-camp/08-defense-talk.png", alt: "讲解营养师智能体流程" },
        ],
      },
      {
        type: "paragraph",
        text: "周五下午在青玉案阶梯教室讲。轮到我们时，把识别、档案和建议这条路径走了一遍。最终成绩并不理想。评委觉得想法创新性不够，这个判断我认。市场上类似的饮食建议已经不少，我们更多是把现成能力接到一个场景里，没有拿出更硬的差异。不过从定题目、拆模块，到在百炼上跑通、再站上去讲，这是我第一次把一条链路完整走完。成绩不漂亮，这五天没有白过。",
      },
      { type: "heading", text: "我对阿里的看法变了" },
      {
        type: "paragraph",
        text: "以前一提阿里，我脑子里就是淘宝、闲鱼。在园区里走几天，这个印象就散了。云谷展厅里能看见云计算撑着多大一块业务，课堂上能听见千问怎么走到用户面前，闪购那场则把骑手和商家请到同一间教室。这些加在一起，才是现在的阿里，不是一个购物 App 的别名。",
      },
      {
        type: "paragraph",
        text: "最触动我的还是公益助残。星期四下午去了余杭融爱助残中心，听他们怎么用无障碍导航、智能眼镜、轮椅这些东西，把生活里的门槛降下来。阿里每年在这件事上投的不只是口号。对骑手，也不是只把他们当运力，而是当成要被看见的人。以前我觉得大公司讲社会责任，多半是宣传；站在展厅里看完，才会知道这些项目是有人、有物、有持续投入的。",
      },
      {
        type: "gallery",
        caption: "公益助残。听讲解，也上手体验他们做出来的辅具。",
        images: [
          { src: "/images/alibaba-camp/02-assistive-hall.png", alt: "高科技辅具展示体验中心" },
          { src: "/images/alibaba-camp/06-assistive-tech.png", alt: "体验无障碍科技" },
        ],
      },
      {
        type: "paragraph",
        text: "伟大两个字有点重，但敬佩是真的。它也成了我后面想靠近、想追的一家企业。不是听完就立下一个空目标，而是知道自己学软件工程，以后如果有机会做云、做大模型应用、做真正能落到人身上的产品，这家公司是一个值得对照的方向。先把眼前的课和项目做好，这条线以后有机会再接上。",
      },
      { type: "heading", text: "后来去了西湖" },
      {
        type: "paragraph",
        text: "结营之后我没有马上回去，专门留了一点时间去西湖。那天不是大晴天，云压得比较低，湖面是灰绿的，风一过就起细纹。远处的山蒙着一层薄雾，柳条垂到水边，荷叶铺开，偶尔能看见雷峰塔的轮廓。岸边有人坐着看湖，游船慢慢开过去。杭州把公司和湖放在同一座城市里，上午还在听云和模型，下午站到湖边，节奏一下就换了。",
      },
      {
        type: "paragraph",
        text: "苏轼写过《饮湖上初晴后雨》：「水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。」晴天的西湖当然好看，水会亮。我碰到的是后半句那种天气：山色空蒙，水也不吵。诗里把西湖比作西子，淡妆浓抹都合适。阴天并不亏，它只是换了一种样子。",
      },
      {
        type: "gallery",
        caption: "西湖。阴天，山色空蒙，水光也不闹。",
        images: [
          { src: "/images/alibaba-camp/09-westlake-1.png", alt: "西湖远山" },
          { src: "/images/alibaba-camp/10-westlake-2.png", alt: "柳枝与湖水" },
          { src: "/images/alibaba-camp/11-westlake-3.png", alt: "湖心山与塔" },
          { src: "/images/alibaba-camp/12-westlake-4.png", alt: "柳岸与亭廊" },
          { src: "/images/alibaba-camp/13-westlake-5.png", alt: "荷花" },
          { src: "/images/alibaba-camp/14-westlake-6.png", alt: "湖上画舫" },
          { src: "/images/alibaba-camp/15-westlake-7.png", alt: "对岸山色" },
          { src: "/images/alibaba-camp/16-westlake-8.png", alt: "湖面与荷叶" },
          { src: "/images/alibaba-camp/17-westlake-9.png", alt: "木栈道看湖" },
        ],
      },
      {
        type: "quote",
        text: "水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。",
      },
      {
        type: "paragraph",
        text: "五天听的是云、模型和公益，站在湖边时这些都暂时远了一点。我没有非要在湖边总结出什么道理，只是把水、山和塔拍下来。回去以后再看这些照片，夏令营和西湖是连在一起的：一边是一家我想追的公司，一边是这座城市自己的样子。今年夏天就这样过完了，挺值。",
      },
    ],
  },
  {
    slug: "flask-jquery-fullstack-guide",
    title: "Flask 与 jQuery 全栈手册：给大三上网站开发课的预习",
    excerpt:
      "下学期大三上要学网站开发。我把 Flask 和 jQuery 整理成一份能打开、能对照的学习页。先看简介，再点开始学习。",
    category: "技术",
    date: "2026-08-23",
    displayDate: "2026.08.23",
    readingTime: "约 14 分钟",
    number: "06",
    externalUrl: "https://skychutt.github.io/flask-jquery-fullstack-guide/",
    coverImage: {
      src: "/images/flask/flask.png",
      alt: "Flask 标志",
    },
    sections: [
      {
        type: "paragraph",
        text: "下学期是大三上，课程里有网站开发。按现在了解到的内容，会用到 Python 做后端，用 Flask 写服务，页面这边会碰到 jQuery 和 AJAX。Kotlin 那一套是给移动端预习的；这一套是给网站开发预习的。这篇文章先讲我为什么要提前学，以及学这些东西到底有什么用。看完再用文末的「开始学习」打开手册。",
      },
      {
        type: "image",
        src: "/images/flask/python.png",
        alt: "Python 标志",
        caption: "这门课的底子是 Python。Flask 和 Django 都是用它写的 Web 框架。",
      },
      { type: "heading", text: "这套学习页是怎么来的" },
      {
        type: "paragraph",
        text: "课还没开，材料先备着。我把 Python 面向对象、Flask 后端、数据库、安全、测试、部署，再加上 jQuery 和 AJAX，收成一份中文手册，名字叫 Flask Forge。网页可以搜、可以按章节往下读，学习进度存在浏览器里，也能离线看。在线地址是 https://skychutt.github.io/flask-jquery-fullstack-guide/ ，源码在 GitHub：https://github.com/Skychutt/flask-jquery-fullstack-guide 。",
      },
      {
        type: "paragraph",
        text: "手册按四条线来排：Python 地基、Flask 后端、jQuery 前端、工程实战。一共 24 个章节，一百多个小节，后面还有一个完整项目用来验收。它不是学校发的课本，是我给自己准备的对照本。上课讲到路由、表单、接口这些词的时候，我希望能翻回这里，而不是临时去搜一篇互相对不上的教程。",
      },
      {
        type: "list",
        items: [
          "Python 地基：语法、函数、异常、模块和面向对象",
          "Flask 后端：HTTP、路由、蓝图、数据库和安全",
          "jQuery 前端：DOM、事件、表单、AJAX 和前后端联调",
          "工程实战：测试、性能、部署，以及一个能跑起来的项目",
        ],
      },
      { type: "heading", text: "为什么要提前学，而不只是等上课" },
      {
        type: "paragraph",
        text: "网站开发这门课，容易给人一种错觉：把页面做出来、点几下能跳转，就算学会了。真正学的时候会发现，难的不是某句代码，而是整条链路。浏览器发出一个请求，服务器怎么接到、怎么查数据、怎么把结果送回去、页面又怎么把结果显示出来。中间任何一环不清楚，后面都会卡。提前学，不是为了在课上炫耀，是为了上课时已经知道这条链路长什么样，老师讲的例子能对得上自己脑子里的图。",
      },
      {
        type: "paragraph",
        text: "大一、大二很多作业是单点的：写一段程序、过几个测试、交一份报告。网站不是这样。一个能用的站点至少要同时处理三件事：人在页面上怎么操作，服务器怎么处理这些操作，数据放在哪里、下次打开还能不能看见。这三件事连在一起，才叫全栈。课上时间有限，如果语法和工具还要从头认，项目就会被挤掉。我把预习放在暑假，就是想把「认路」提前做完，把学期里的时间留给改需求和把功能做完整。",
      },
      {
        type: "paragraph",
        text: "学这些还有一层更实际的意义。软件工程后面会越来越靠近「做出来给人用」的东西。移动端是一条线，网站是另一条。两条线看起来工具不一样，底层能力是通的：怎么拆需求、怎么设计接口、怎么验证对不对、坏了怎么查。Flask 比较小，适合把 HTTP、路由、模板、数据库这些概念看清楚，不会一上来就被特别大的框架挡住。看清楚以后，再换别的后端，不会从零开始。",
      },
      {
        type: "paragraph",
        text: "有人会问：现在前端都在讲 React、Vue，为什么课里还要 jQuery？对我来说，这学期的目标不是追最新栈，而是先搞懂浏览器里的页面是怎么动的。jQuery 把选择元素、绑事件、提交表单、发 AJAX 这些事写得很直。你能看见：点击发生后，谁在发请求，请求打到哪个地址，回来的 JSON 又怎么填进页面。这个过程搞明白了，以后用别的前端库，无非是同样的事先用另一套写法。课上如果用的就是 jQuery，预习对得上；就算以后项目不用它，AJAX 和 DOM 这两件事也不会白学。",
      },
      {
        type: "paragraph",
        text: "还有一件事，是我自己搭这个博客时才更有体会的。页面能打开，只是第一步。域名、解析、备案、发布、更新，都会逼你把「网站」当成一个要长期活着的东西，而不是交完就丢的作业。Flask 手册后面专门有测试、安全和部署。这些看起来不像在写功能，但缺了它们，程序只能在自己电脑上跑。课程如果只练到能演示，学期结束很快会忘。如果练到能部署、能改、能回头查，这份能力会留下来。",
      },
      {
        type: "paragraph",
        text: "所以我把「学习的意义」想成三层。第一层是应付这门课：术语不陌生，作业不至于从零摸。第二层是补上全栈这一块：自己能做一页会说话的网站，而不是只会改静态 HTML。第三层是给后面的项目打底：后端怎么接、前端怎么调、数据怎么存，这三件事心里有数，做别的系统时才不会每一层都慌。预习的价值主要在第三层。课会结束，这三件事不会过期。",
      },
      {
        type: "paragraph",
        text: "还有一层是学习方法。网站开发最怕只看不写。看懂一段 Flask 路由，不等于自己能设计一个接口；看懂一次 AJAX，不等于表单校验失败时知道该提示什么。手册里每一章如果只勾完成，收获会很虚。比较靠谱的用法是：看完一节就在本地改一改，让它按自己的想法动起来。错了再对照正文。预习如果只是把 24 章浏览一遍，开学照样会生。提前学的意义，是把「第一次犯错」放到暑假，而不是放到截止日期前。",
      },
      { type: "heading", text: "Flask 是什么" },
      {
        type: "paragraph",
        text: "Flask 是一个用 Python 写的 Web 框架，2010 年由 Armin Ronacher 发布。它和 Django 不一样，Django 自带的东西很多，Flask 默认很瘦：先给你路由、请求、响应这些核心能力，数据库、登录、表单要自己选扩展。课上用它，一个好处是路径短。一个 app.py 就能跑起来，你能直接看到：这个地址对应哪个函数，这个函数返回什么，浏览器收到的是页面还是 JSON。",
      },
      {
        type: "paragraph",
        text: "Flask 常被放在「微框架」这一类里。微不是说只能做小项目，而是说它不替你决定所有架构。蓝图可以把大项目拆开，SQLAlchemy 可以接数据库，后面再补鉴权、测试和部署。这个顺序和课程比较合：先把请求走通，再往上加层。对我预习来说，这也合适——先搞懂一个接口是怎么从浏览器走到 Python 函数的，再谈工程上的完整做法。",
      },
      { type: "heading", text: "Flask 和 Django 有什么不一样" },
      {
        type: "image",
        src: "/images/flask/flask-vs-django.png",
        alt: "Flask 和 Django 对比",
        caption: "两个都是 Python 里很常见的网站框架，路子不一样。",
      },
      {
        type: "paragraph",
        text: "学 Python 做网站，最先碰到的两个名字通常就是 Flask 和 Django。它们解决的是同一类问题：用 Python 接收浏览器请求，再把页面或数据送回去。差别在于，框架替你做了多少决定。",
      },
      {
        type: "paragraph",
        text: "Django 出来得更早，2005 年发布，口号接近「电池已装好」。ORM、后台管理、用户系统、表单、模板，默认就有一套。适合尽快搭出一个结构完整的站点，比如内容管理系统、后台、带账号的业务网站。代价是刚上手时概念多，很多文件和约定要先接受，才能看清一次请求到底走了哪几层。",
      },
      {
        type: "paragraph",
        text: "Flask 是 2010 年出来的，定位是微框架。默认几乎只有路由、请求和响应。数据库用 SQLAlchemy 还是别的、登录怎么做、表单怎么验，要自己选。图上那句 web development, one drop at a time，说的就是这个：一次加一点，而不是一上来整套给你。课上用 Flask，我理解主要是为了让 HTTP、视图函数、模板、接口这些东西露出来，不被框架本身挡住。",
      },
      {
        type: "paragraph",
        text: "如果只记几条对比，可以这样看。Django 适合「先有完整骨架，再往里填业务」；Flask 适合「先把一条请求走通，再按需要加层」。Django 开发速度快在约定已经选好；Flask 灵活，但也更容易在项目变大时自己把结构弄乱。性能、能不能做大项目，两者都能做，真正分开的是起步方式和你愿不愿意自己拼零件。",
      },
      {
        type: "paragraph",
        text: "这学期我按课走，主线是 Flask。不是说 Django 不重要。先把 Flask 练熟，以后看到 Django 的 admin、自带 ORM，会比较清楚它们在替你做哪一层。反过来，如果一上来就只会点 Django 的现成功能，换一个瘦框架时容易不知道请求是在哪被处理的。预习里我会把两者的差别放在心里，动手还是跟课走 Flask。",
      },
      { type: "heading", text: "jQuery 在这门课里干什么" },
      {
        type: "image",
        src: "/images/flask/jquery.png",
        alt: "jQuery 标志",
        caption: "课上的前端协作，会用到 jQuery。",
      },
      {
        type: "paragraph",
        text: "jQuery 出现在 2006 年，作者是 John Resig。那时候不同浏览器写 DOM 和事件的方式差很多，jQuery 用一套比较短的写法把常见操作统一了。后来浏览器自己变强了，新项目不一定还把它当默认选择。但它在教学和不少存量系统里仍常见，原因很简单：选择器、事件、表单、AJAX，四件事都能很快演示出来。",
      },
      {
        type: "image",
        src: "/images/flask/ajax.png",
        alt: "AJAX 标志",
        caption: "AJAX 就是页面不用整页刷新，也能和服务器交换数据。",
      },
      {
        type: "paragraph",
        text: "和 Flask 配在一起时，jQuery 最关键的是 AJAX。页面不用整页刷新，也能把数据交给后端，再把结果填回来。这就是前后端协作的最小模型：Flask 提供 /api/ 这类地址，jQuery 负责发请求、处理成功和失败、更新某一块 DOM。课上如果要做登录、提交、列表刷新，多半会走这条路。预习时我会把这条路当成主线，而不是把 jQuery 的每个工具函数都背下来。",
      },
      { type: "heading", text: "手册打算怎么用" },
      {
        type: "paragraph",
        text: "建议按阶段读，不要一上来就跳到部署。Python 地基不熟，后面的视图函数会写得很吃力；HTTP 没建立，AJAX 出错时也不知道该查前端还是后端。搜索适合当开发时的速查，不适合当第一次学习的方式。进度存在本机浏览器里，换电脑不会自动带走，这点和 Kotlin 那套学习页一样。",
      },
      {
        type: "paragraph",
        text: "读到后面如果有示例项目，先让它跑起来，再改一个小需求，最后试着脱离教程重写一遍。课程真正要的不是把 24 章勾完，而是你能不能独立做出「页面操作 → 接口处理 → 数据留下 → 再显示出来」这件事。勾章节只是提醒自己走到哪了。",
      },
      { type: "heading", text: "怎么开始学" },
      {
        type: "paragraph",
        text: "这篇是简介，不是手册正文。下面「开始学习」会打开 Flask Forge。仓库在 GitHub，可以看源码，也可以把页面留着离线用。我自己会先把这篇的背景看完，再从 Python 地基往下走。大三上课讲到网站开发时，再把课堂例子和这里的章节对一下。它补的是开学前缺一份能一直打开的中文入口，不能替代老师讲课，也不能替代自己把项目做出来。",
      },
    ],
  },
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

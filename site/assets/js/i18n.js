(() => {
  const STORAGE_KEY = "site_lang";

  const ZH = {
    "Greatest Debate": "最伟大之争",
    "Goals": "进球",
    "Assists": "助攻",
    "Titles Won": "冠军数量",
    "Knockout G+A": "淘汰赛进球+助攻",
    "Appearances": "出场次数",
    "UEFA Best XI": "欧足联最佳阵容",
    "Peak": "巅峰赛季",
    "Share": "分享",
    "Back to Top": "返回顶部",
    "Made for debate nights, watch parties, and anyone who loves UEFA nights.": "为辩论之夜、观赛派对和热爱欧战之夜的人而做。",
    "Player Profile": "球员档案",
    "Ronaldo": "C罗",
    "Messi": "梅西",
    "CR7 UCL Season Chart (2003-2025)": "C罗欧冠赛季图表（2003-2025）",
    "CR7 Star Profile": "C罗星形图",
    "Metric": "指标",
    "per season. Bar color = club color.": "每赛季数据，柱状图颜色对应球队颜色。",
    "Pass Accuracy %": "传球成功率",
    "Shot-Creating Passes": "形成射门传球",
    "Big Chances Created": "创造重大机会",
    "Normalized per season across six UCL metrics.": "基于6项欧冠指标的赛季归一化结果。",
    "Normalized across six UCL metrics. Blue profile is compared against other seasons.": "基于6项欧冠指标归一化。蓝色轮廓用于和其他赛季对比。",
    "UEFA Champions League Records (UEFA, updated 14 Oct 2025)": "欧冠纪录（欧足联，更新于2025年10月14日）",
    "UEFA Champions League Records (UEFA, updated 30 Oct 2023)": "欧冠纪录（欧足联，更新于2023年10月30日）",
    "UEFA Champions League Dataset Snapshot (2004/05-2022/23)": "欧冠数据概览（2004/05-2022/23）",
    "Champions League titles: 3 (2009, 2011, 2015)": "欧冠冠军：3次（2009、2011、2015）",
    "Most Champions League group stage goals: 80 (71 for Barcelona)": "欧冠小组赛进球最多：80球（其中71球来自巴萨）",
    "Most Champions League round of 16 goals: 29": "欧冠16强进球最多：29球",
    "Most Champions League goals for one club: 120 (Barcelona)": "单一俱乐部欧冠进球最多：120球（巴萨）",
    "Most successive seasons scoring in Champions League: 18": "连续欧冠赛季进球最多：18个赛季",
    "Second-most UEFA Champions League/European Cup goals: 129": "欧冠/冠军杯历史第二高进球：129球",
    "Seasons in dataset: 19": "数据覆盖赛季：19个",
    "Clubs in dataset: Barcelona, Paris Saint-Germain": "数据覆盖俱乐部：巴塞罗那、巴黎圣日耳曼",
    "Total goals (all listed stages): 129": "总进球（各阶段合计）：129",
    "Total assists (all listed stages): 40": "总助攻（各阶段合计）：40",
    "Peak goals in one season: 14 (2011/12)": "单赛季最高进球：14（2011/12）",
    "Peak assists in one season: 5 (2008/09, 2011/12, 2014/15, 2022/23)": "单赛季最高助攻：5（2008/09、2011/12、2014/15、2022/23）",
    "Average pass accuracy across seasons: 86.0%": "跨赛季平均传球成功率：86.0%",
    "Total shot-creating passes: 350": "形成射门传球总数：350",
    "Total big chances created: 76": "创造重大机会总数：76",
    "Messi UCL Season Chart (2003-2025)": "梅西欧冠赛季图表（2003-2025）",
    "Messi Star Profile": "梅西星形图",
    "Most UEFA Champions League goals: 140": "欧冠进球最多：140球",
    "Most goals in a single UEFA Champions League season: 17 (2013/14)": "单赛季欧冠进球最多：17球（2013/14）",
    "Most UEFA Champions League knockout goals: 67": "欧冠淘汰赛进球最多：67球",
    "Most UEFA Champions League top-scorer seasons: 7": "欧冠最佳射手赛季最多：7次",
    "Most UEFA Champions League appearances: 183": "欧冠出场次数最多：183场",
    "Most UEFA Champions League title wins: 5": "欧冠冠军次数最多：5次",
    "Only player to score in three different UEFA Champions League finals (2008, 2014, 2017)": "唯一在三场不同欧冠决赛进球的球员（2008、2014、2017）",
    "One of only two players to score in all six group-stage games (2017/18)": "仅有两位在小组赛六场全部进球的球员之一（2017/18）",
    "Only player to score in 11 straight UEFA Champions League matches (2017/18)": "唯一连续11场欧冠进球的球员（2017/18）",
    "Stage Distribution by Season": "各赛季阶段分布",
    "Stage Metric": "阶段指标",
    "per season in each UEFA Champions League stage.": "每个欧冠阶段的赛季数据分布。",
    "Round of 16": "16强",
    "Quarter-finals": "8强",
    "Semi-finals": "4强",
    "Club": "俱乐部",
    "Season": "赛季",
    "Comparing selected profile with other seasons in the current scope.": "当前所选画像正在与同范围内的其他赛季对比。",
    "Selected profile": "当前画像",
    "Other seasons baseline": "其他赛季基线",
    "All Clubs": "全部俱乐部",
    "All Seasons": "全部赛季",
    "Barcelona": "巴塞罗那",
    "Paris Saint-Germain": "巴黎圣日耳曼",
    "Manchester United": "曼联",
    "Real Madrid": "皇家马德里",
    "Juventus FC": "尤文图斯",

    "Editorial Feature · Updated for the modern era": "专题特辑 · 面向现代足球更新",
    "Who Is The Best UEFA Player of All Time?": "谁是欧足联历史最佳球员？",
    "Goals, trophies, big-match impact, longevity, and peak brilliance all matter. To keep the debate fair, we combine seven Champions League indicators into one weighted UEFA GOAT Score.": "进球、冠军、大场面表现、持续性与巅峰高度都很重要。为了让讨论更公平，我们将七项欧冠指标加权合成为一个 UEFA GOAT Score。",
    "Start the Debate": "开始讨论",
    "View Metrics": "查看指标",
    "Defining Criteria": "核心标准",
    "Legendary Seasons": "传奇赛季",
    "Debates Started": "讨论次数",
    "The Case File": "核心依据",
    "Champions League dominance": "欧冠统治力",
    "UEFA awards & accolades": "欧足联奖项与荣誉",
    "Peak performance longevity": "巅峰持续时间",
    "Clutch moments in finals": "决赛关键时刻",
    "Impact on the game": "对比赛的影响",
    "Scroll to explore": "继续滚动查看",

    "How to Measure Greatness": "如何衡量伟大",
    "We rate the greatest Champions League player with a ranking-based UEFA GOAT Score. In every metric, rank #1 gets 100 points, rank #2 gets 95, and every next place loses five points before the weighted total is added.": "我们用基于排名的 UEFA GOAT Score 来评选欧冠历史最佳球员。每个指标里，第1名得100分，第2名得95分，之后每降一名少5分，最后再按权重加总。",
    "UEFA GOAT Score": "UEFA GOAT Score",
    "S = max(105 - 5r, 0)": "S = max(105 - 5r, 0)",
    "U = 0.25G + 0.15A + 0.20K + 0.15T + 0.10P + 0.10B + 0.05H": "U = 0.25G + 0.15A + 0.20K + 0.15T + 0.10P + 0.10B + 0.05H",
    "G = Goals, A = Assists, K = Knockout G+A, T = Titles, P = Appearances, B = Best XI, H = Peak. Here r is the metric rank, so each lower place loses 5 points.": "G=进球，A=助攻，K=淘汰赛进球+助攻，T=冠军，P=出场，B=最佳阵容，H=巅峰。这里 r 表示该指标排名，所以每下降一名就少5分。",
    "Goals · 25%": "进球 · 25%",
    "Total Champions League scoring output carries the heaviest weight in the model.": "欧冠总进球产出在模型中占最高权重。",
    "Assists · 15%": "助攻 · 15%",
    "Playmaking and direct creation matter because great attackers also raise teammates.": "组织与直接创造机会同样重要，因为伟大的进攻者也会提升队友表现。",
    "Knockout G+A · 20%": "淘汰赛进球+助攻 · 20%",
    "Goals plus assists in the knockout rounds capture performance when pressure is highest.": "淘汰赛中的进球与助攻体现球员在最高压力下的表现。",
    "Titles · 15%": "冠军 · 15%",
    "Winning the competition matters, especially when a player turns elite seasons into trophies.": "拿下赛事冠军很重要，尤其当球员能把巅峰赛季真正转化为奖杯时。",
    "Appearances · 10%": "出场 · 10%",
    "Long runs in Europe reward durability, consistency, and relevance across many seasons.": "长期征战欧洲赛场体现耐久性、稳定性和跨多个赛季的持续影响。",
    "UEFA Best XI · 10%": "欧足联最佳阵容 · 10%",
    "Selection counts add a recognition signal for how often a player ranked among Europe’s best.": "入选次数提供了一个认可度信号，反映球员有多频繁地跻身欧洲最佳。",
    "Peak · 5%": "巅峰 · 5%",
    "Peak reflects the highest single-season level a player reached in the Champions League.": "巅峰反映球员在欧冠中达到过的最高单赛季水平。",
    "Debate Route": "辩论路径",
    "Build your verdict step by step: open every metric page, compare Ronaldo and Messi, then come back here to decide.": "按步骤建立你的结论：打开每个指标页面，对比C罗与梅西，再回到这里给出判断。",
    "Step 1 · Goals": "第1步 · 进球",
    "Start with total output and scoring distribution.": "先看总产出与进球分布。",
    "Open Goals": "打开进球页",
    "Step 2 · Assists": "第2步 · 助攻",
    "Measure creativity and direct chance contribution.": "衡量创造力与直接机会贡献。",
    "Open Assists": "打开助攻页",
    "Step 3 · Titles": "第3步 · 冠军",
    "Check who converted peak years into silverware.": "比较谁把巅峰年份转化为冠军。",
    "Open Titles": "打开冠军页",
    "Step 4 · Knockout G+A": "第4步 · 淘汰赛进球+助攻",
    "Compare the highest-pressure rounds directly.": "直接比较最高压轮次表现。",
    "Open Knockout": "打开淘汰赛页",
    "Step 5 · Appearances": "第5步 · 出场",
    "Long-term durability and sustained elite relevance.": "长期耐久与持续顶级相关性。",
    "Open Appearances": "打开出场页",
    "Step 6 · UEFA Best XI": "第6步 · 欧足联最佳阵容",
    "Peer-level recognition across multiple eras.": "跨多个时代的同行级认可。",
    "Open Best XI": "打开最佳阵容页",
    "Top 10 UEFA GOAT Profiles": "UEFA GOAT 前十画像",
    "Weighted leaderboard built from the current ranking pages on this site. Players outside a page's published cutoff get 0 points for that metric.": "基于本站当前各指标榜单构建的加权前十。若球员未进入某页面已发布榜单，则该指标记 0 分。",
    "Loading...": "加载中...",
    "Select any player from the top 10 to inspect his seven-metric shape against the top-10 baseline.": "从前十中选择任意球员，查看他在七项指标上相对前十平均值的星图画像。",
    "Top 10 Weighted Ranking": "前十加权排名",
    "Scores follow the 5-point rank decay rule before weights are added. Click a row to refresh the star chart.": "先按每降一名减 5 分的规则计算单项得分，再按权重加总。点击任意一行可刷新星图。",
    "Selected player": "当前球员",
    "Top-10 average": "前十平均值",

    "The Shortlist": "候选名单",
    "Four iconic profiles that dominate every UEFA greatest-of-all-time discussion.": "四位在欧足联历史最佳讨论中最常出现的代表人物。",
    "Modern Era": "现代时代",
    "Cristiano Ronaldo": "克里斯蒂亚诺·罗纳尔多",
    "Relentless goal-scoring in the Champions League, decisive knockout performances, and an unparalleled drive for European silverware.": "欧冠持续高效进球，淘汰赛关键输出，对欧洲荣誉有无与伦比的追求。",
    "Champions League Goals": "欧冠进球",
    "Record Holder": "纪录保持者",
    "Maestro": "大师",
    "Lionel Messi": "莱昂内尔·梅西",
    "Vision, creativity, and decisive UEFA nights that blended artistry with ruthless precision.": "视野、创造力与关键欧战表现，将艺术性与致命效率结合。",
    "Playmaking": "组织能力",
    "Timeless": "历久弥新",
    "Captain": "队长",
    "Paolo Maldini": "保罗·马尔蒂尼",
    "Defensive excellence over decades, leading AC Milan through European dynasties and redefining elite defending.": "数十年的防守巅峰，带领米兰经历欧洲王朝，重塑顶级防守标准。",
    "UEFA Finals": "欧足联决赛",
    "8 Appearances": "8次出场",
    "Legend": "传奇",
    "Zinedine Zidane": "齐内丁·齐达内",
    "Big-game brilliance with a singular Champions League final goal that still echoes across UEFA history.": "大场面能力卓越，那记欧冠决赛进球至今仍是经典。",
    "Signature Moment": "代表时刻",
    "Glasgow 2002": "2002格拉斯哥",

    "Moments That Defined UEFA Greatness": "定义欧战伟大的时刻",
    "A quick timeline of how the debate evolved with every unforgettable night.": "用时间线快速回顾这场讨论如何在每个经典夜晚中发展。",
    "AC Milan dominate Europe with a defensive masterclass.": "AC米兰以防守大师级表现统治欧洲。",
    "Zidane’s left-footed volley becomes UEFA folklore.": "齐达内左脚天外飞仙成为欧战传说。",
    "Messi announces a new era of Champions League artistry.": "梅西开启欧冠技术美学的新阶段。",
    "Ronaldo delivers a knockout-stage masterclass in consecutive runs.": "C罗连续多个赛季在淘汰赛交出大师级表现。",

    "Your Verdict": "你的结论",
    "There is no single answer, but there is always a favorite. Cast your vote and see where the community stands.": "没有唯一答案，但每个人都有心中最佳。投票看看大家的选择。",
    "Vote Ronaldo": "投票给C罗",
    "Vote Messi": "投票给梅西",
    "Vote Maldini": "投票给马尔蒂尼",
    "Vote Zidane": "投票给齐达内",
    "Live Pulse": "实时热度",
    "Illustrative only — data updates when the poll is live.": "仅示例数据，投票上线后将实时更新。",
    "Local vote mode: one editable vote per browser.": "本地投票模式：每个浏览器可投一票并可修改。",
    "Realtime vote mode: one vote per browser ID across connected users.": "实时投票模式：每个浏览器ID在所有已连接用户间仅保留一票。",

    "Goals are more than a total. They reflect timing, variety, and impact in the biggest UEFA nights.": "进球不只是总数，还体现时机、方式和关键比赛影响力。",
    "Champions League Top Goalscorers": "欧冠历史射手榜",
    "Official UEFA all-time ranking snapshot for top scorers in the UEFA Champions League.": "基于欧足联官方欧冠历史射手排名的快照。",
    "Top Scorers Ranking": "历史射手排名",
    "Switch between Top 10 and Top 20 all-time goalscorers.": "可在历史前10与前20射手之间切换。",
    "Top 10": "前10",
    "Top 20": "前20",
    "Showing top 10 players (all-time goals).": "当前显示前10名（欧冠历史进球）。",
    "Showing top 20 players (all-time goals).": "当前显示前20名（欧冠历史进球）。",
    "Rank": "排名",
    "Player": "球员",
    "Titles": "冠军数",
    "Champions League All-Time Assists": "欧冠历史助攻榜",
    "UEFA ranking snapshot for the leading assist providers in Champions League history.": "欧足联欧冠历史助攻榜官方数据快照。",
    "42 assists": "42 次助攻",
    "41 assists": "41 次助攻",
    "40 assists": "40 次助攻",
    "Top 10 Assists Ranking": "助攻前十排名",
    "All-time UEFA Champions League assists ranking.": "欧足联欧冠历史助攻排名。",
    "Angel Di Maria": "安赫尔·迪马利亚",
    "Champions League Most Final Wins": "欧冠决赛夺冠次数最多球员",
    "UEFA all-time player list based on European Cup/Champions League final wins.": "基于欧洲冠军杯/欧冠决赛夺冠次数的欧足联历史球员榜。",
    "6 titles": "6 次冠军",
    "5 titles": "5 次冠军",
    "Top Winners Ranking": "冠军获得数排名",
    "European Cup and UEFA Champions League final wins (players).": "欧洲冠军杯与欧冠决赛夺冠次数（球员）。",
    "Distribution": "分布条",
    "Finishing Power": "终结能力",
    "Core Goal Metrics": "进球核心指标",
    "Break down scoring into repeatable dimensions to compare legends across eras.": "将进球拆解为可复用维度，公平比较不同时代传奇。",
    "High-Pressure Finishing": "高压终结",
    "Scoring when the match is balanced, late, or on the line.": "在胶着、末段和胜负手时刻完成进球。",
    "Range of Finishes": "终结手段",
    "Right foot, left foot, aerial threats, and set-piece precision.": "右脚、左脚、头球与定位球的全面终结。",
    "Season-to-Season Consistency": "赛季稳定性",
    "Multiple elite campaigns separate all-time greats from short peaks.": "多个顶级赛季是历史级球员与短暂巅峰的分界线。",
    "Stage Distribution": "阶段分布",
    "Group stage, knockout rounds, and finals all reveal different pressures.": "小组赛、淘汰赛和决赛体现不同压力下的能力。",
    "Match Impact": "比赛影响力",
    "Goals that change momentum, unlock defenses, or complete comebacks.": "能改变比赛走势、打破僵局或完成逆转的进球。",
    "Where Goals Matter Most": "进球最有价值的场景",
    "Not every goal carries the same weight. Context defines value.": "并非所有进球价值相同，场景决定含金量。",
    "Group Stage": "小组赛",
    "Consistency and momentum that secure qualification.": "稳定输出与积分势头，确保出线。",
    "Knockout Round": "淘汰赛",
    "Goals that swing two-leg ties and punish small mistakes.": "改变两回合走势、惩罚细小失误的进球。",
    "Semifinal": "半决赛",
    "Elite opponents, narrow margins, and decisive moments.": "对手更强、容错更低、关键时刻更多。",
    "Final": "决赛",
    "History-making finishes that define eras.": "定义时代的历史级终结。",

    "Creation & Vision": "创造与视野",
    "Assists capture timing, intelligence, and the ability to create goals for others at UEFA level.": "助攻体现时机判断、比赛智商以及为队友创造得分机会的能力。",
    "Playmaking Signals": "组织信号",
    "Judge assists by quality, difficulty, and impact on the match.": "从质量、难度和比赛影响评估助攻。",
    "Chance Quality": "机会质量",
    "Defense-splitting passes carry more value than routine lay-offs.": "穿透防线的传球比常规横敲更有价值。",
    "Big-Match Output": "大场面产出",
    "Creating goals when the opponent and pressure are at their peak.": "在顶级对手和高压环境下持续制造进球。",
    "Spatial Awareness": "空间感知",
    "Movement and body positioning that open passing lanes.": "通过跑位和站位打开传球通道。",
    "Variety of Delivery": "传球方式多样性",
    "Through balls, crosses, cutbacks, and set-piece service.": "直塞、传中、倒三角与定位球传递。",
    "Tempo Control": "节奏控制",
    "Knowing when to slow the game or accelerate into a decisive pass.": "知道何时降速组织，何时提速致命一传。",
    "Consistency": "稳定性",
    "Elite creation over multiple seasons, not just a single run.": "跨多个赛季保持顶级创造，而非短期爆发。",
    "Assist Profiles": "助攻角色画像",
    "Different roles can dominate the assist conversation.": "不同角色都可能在助攻维度占据主导。",
    "Playmaker": "组织核心",
    "Central Orchestrator": "中路指挥官",
    "Controls tempo and supplies decisive passes from the middle.": "在中路掌控节奏并输送决定性传球。",
    "Chance Creation": "创造机会",
    "High Volume": "高产出",
    "Winger": "边路球员",
    "Direct Creator": "直接创造者",
    "Beats defenders and delivers final balls from wide areas.": "在边路突破防守并送出最后一传。",
    "Progression": "推进能力",
    "High Threat": "高威胁",
    "Set-Piece": "定位球",
    "Dead-Ball Specialist": "定位球专家",
    "Turns corners and free kicks into repeatable scoring chances.": "将角球和任意球转化为持续可复现的得分机会。",
    "Service Quality": "传球质量",
    "Reliable": "稳定可靠",
    "Connector": "连接者",
    "Second-Assist Hub": "二次助攻枢纽",
    "Links moves and creates the final pass with smart positioning.": "通过聪明站位串联进攻并制造最后一传。",
    "Link Play": "衔接能力",
    "Efficient": "高效率",

    "The Weight of Silverware": "冠军的重量",
    "Trophies and awards quantify success, but context and role define the real value.": "冠军和奖项能量化成功，但背景与角色决定真实价值。",
    "Honors Breakdown": "荣誉拆解",
    "Look beyond totals to understand how and when titles were earned.": "超越总数，从获得方式与时期理解荣誉含金量。",
    "Champions League Titles": "欧冠冠军",
    "Europe’s highest club honor and the clearest marker of dominance.": "欧洲俱乐部最高荣誉，也是统治力最直接指标。",
    "League Titles": "联赛冠军",
    "Consistency across a long season, week after week.": "漫长赛季中的周周稳定输出。",
    "Domestic Cups": "国内杯赛",
    "Knockout resilience and big-game composure.": "淘汰赛韧性与大场面沉着。",
    "Individual Awards": "个人奖项",
    "Ballon d’Or, UEFA awards, and recognition from peers.": "金球奖、欧足联奖项与业内认可。",
    "Multi-Club Success": "多俱乐部成功",
    "Winning across different systems and leagues.": "在不同体系和联赛都能赢得荣誉。",
    "Role in Titles": "冠军角色权重",
    "Primary catalyst versus supporting contributor.": "核心驱动者与配角贡献者的区别。",
    "Title Context": "冠军背景",
    "Numbers rise and fall with eras, teams, and competition levels.": "数字会随时代、球队与竞争强度变化。",

    "High-Pressure Dominance": "高压统治力",
    "Knockout rounds decide titles. Goal-plus-assist output here is the clearest evidence of a true big-game player.": "淘汰赛决定冠军归属，这里的进球+助攻是大场面球员最直接证据。",
    "Knockout Indicators": "淘汰赛指标",
    "Data in this phase carries more weight than any group-stage stretch.": "这一阶段的数据权重高于任何小组赛阶段。",
    "G+A Concentration": "进球+助攻集中度",
    "What share of total output comes in the most decisive rounds.": "总产出中有多少来自最关键回合。",
    "Score-Swing Moments": "改写比分时刻",
    "Involvement that changes a tie’s direction immediately.": "能立即改变两回合走向的参与度。",
    "Output vs. Elite Defenses": "对顶级防线产出",
    "Creating and scoring against top-tier opposition.": "面对顶级对手时仍能创造并得分。",
    "Two-Leg Consistency": "两回合稳定性",
    "Impact over both legs, not just a single hot night.": "两回合持续影响，而非一场爆发。",
    "Game-State Adaptation": "比赛状态适应",
    "Adjusting when chasing, leading, or facing tactical shifts.": "在落后、领先或战术变化时都能调整表现。",
    "Leadership Under Pressure": "高压领导力",
    "Raising teammates and delivering with the season on the line.": "在赛季生死线时带动队友并交付结果。",
    "Knockout Rounds by Weight": "淘汰赛阶段权重",
    "The later the round, the higher the legacy value.": "轮次越靠后，历史价值越高。",
    "Round of 16": "16强",
    "Early elimination still looms, so impact must arrive fast.": "出局风险依然很高，必须尽快产生影响。",
    "Quarterfinal": "8强",
    "Quality rises and margins tighten. G+A becomes decisive.": "对手质量提升、容错降低，进球+助攻更关键。",
    "One tie from the final, where icons separate from stars.": "距离决赛一步之遥，传奇与球星在此分野。",
    "A single goal or assist can become historic forever.": "一个进球或助攻都可能成为永恒历史。",

    "Durability & Trust": "耐久与信任",
    "Elite players stay on the pitch year after year. Appearances reveal reliability and sustained quality.": "顶级球员年复一年保持出场，出场数体现可靠性与持续质量。",
    "Appearance Metrics": "出场指标",
    "Numbers matter, but the quality and context of appearances matter more.": "数字重要，但出场质量与背景更重要。",
    "Season Coverage": "赛季覆盖率",
    "Regular selection across long campaigns and multiple competitions.": "在漫长赛季和多线赛事中持续被选用。",
    "High-Intensity Load": "高强度负荷",
    "Heavy minutes in UEFA matches and decisive domestic fixtures.": "在欧战和关键国内赛事承担大量时间。",
    "Injury Resilience": "伤病韧性",
    "Availability over time, not just peak performance in short bursts.": "长期可用，而不仅是短期巅峰表现。",
    "Age Range": "年龄跨度",
    "Staying elite across youth, prime, and veteran seasons.": "从年轻到巅峰再到老将阶段都保持高水平。",
    "Positional Adaptability": "位置适应性",
    "Maintaining minutes even as roles and systems shift.": "在角色与体系变化中仍保持出场。",
    "UEFA-Level Longevity": "欧战级长期性",
    "Long-term relevance on the Champions League stage.": "长期保持欧冠舞台竞争力。",
    "Longevity Profiles": "长期性画像",
    "Different paths still lead to unmatched availability.": "不同路径都可能通向顶级出勤率。",
    "Ironman": "铁人",
    "Continuous Starter": "持续首发",
    "Rarely misses big matches and anchors team selection.": "几乎不缺席关键战，是阵容基石。",
    "Reliability": "可靠性",
    "Ever-Present": "几乎全勤",
    "Managed Load": "负荷管理",
    "Smart Rotation": "科学轮换",
    "Peak longevity through strategic minutes and pacing.": "通过策略性时间管理延长巅峰期。",
    "Recovery": "恢复能力",
    "Balanced": "平衡",
    "Multi-Role": "多角色",
    "Positional Range": "位置范围",
    "Stays relevant by adapting to new roles and tactical needs.": "通过适应新角色和战术需求持续保持价值。",
    "Adaptation": "适应性",
    "Versatile": "多面手",
    "Big-Game": "大场面",
    "Clutch Availability": "关键战可用性",
    "Always fit when the stakes are highest.": "在最关键时刻始终保持可出场。",
    "Pressure": "抗压",

    "Repeated Elite Recognition": "持续顶级认可",
    "Best XI selections reflect elite performance acknowledged by peers, media, and the wider game. Frequency matters.": "最佳阵容入选代表同行、媒体与足球环境对顶级表现的认可，次数同样重要。",
    "Selection Value": "入选价值",
    "Count the appearances, but also the competitive context behind each selection.": "既看入选次数，也看每次入选背后的竞争环境。",
    "Consecutive Selections": "连续入选",
    "Multiple years in a row signal sustained peak performance.": "连续多年入选代表持续巅峰。",
    "Positional Competition": "位置竞争",
    "High density of elite players makes each selection harder.": "顶级球员密度越高，每次入选越难。",
    "Signature Seasons": "标志赛季",
    "Selections tied to iconic UEFA campaigns elevate status.": "与经典欧战赛季绑定的入选更具地位价值。",
    "Team Success + Individual Output": "团队成绩 + 个人输出",
    "Dominant teams can help, but individual brilliance must still stand out.": "强队加成存在，但个人表现仍需突出。",
    "Style Influence": "风格影响",
    "Players who redefine their position often rack up selections.": "重新定义位置标准的球员更容易长期入选。",
    "Era Span": "时代跨度",
    "Being chosen across different football eras signals adaptability.": "跨时代入选意味着极强适应能力。",
    "What Best XI Really Signals": "最佳阵容真正说明什么",
    "It is not just a list. It is the story of the era’s football identity.": "这不只是名单，而是一个时代足球风格的缩影。",
    "Peak Density": "巅峰密度",
    "Compressed Greatness": "高密度伟大",
    "Seasons where multiple stars compete make each selection elite.": "群星竞争的赛季里，每次入选都更具含金量。",
    "Recognition": "认可度",
    "Intense": "高强度",
    "Yearly Presence": "年度常驻",
    "Reappearing in the XI becomes proof of sustained superiority.": "反复入选本身就是持续领先的证明。",
    "Stability": "稳定性",
    "Benchmark": "标杆",
    "Positional Standard": "位置标准",
    "Some players redefine the role, making selection almost expected.": "有些球员重塑角色定义，入选几乎成为常态。",
    "Legacy": "历史地位",
    "Defining": "定义级",
    "Era Signal": "时代信号",
    "Style Marker": "风格标记",
    "Best XI trends reveal how football evolved and what was valued.": "最佳阵容趋势揭示足球如何演进以及时代偏好。",
    "Trends": "趋势",
    "Directional": "方向性",

    "Knockout Stage Head-to-Head": "淘汰赛正面对比",
    "Dataset-based comparison (2003-2025): Ronaldo vs Messi in Round of 16, Quarter-finals, Semi-finals and Finals.": "基于数据集（2003-2025）：对比C罗与梅西在16强、8强、4强与决赛的表现。",
    "Total Knockout G+A": "淘汰赛总进球+助攻",
    "Knockout Difference": "淘汰赛差值",
    "Gap": "差值",
    "Stage Breakdown (Goals + Assists)": "分阶段拆解（进球+助攻）",
    "Totals from local season-stage datasets used in this project.": "数据来自本项目本地赛季阶段数据集。",
    "Stage": "阶段",
    "Edge": "优势方",
    "Knockout Split by Metric": "按指标拆解淘汰赛表现",
    "Separate totals to support your own argument, not a fixed verdict.": "拆分数据用于支持你的观点，而不是预设结论。",
    "Metric": "指标",
    "Knockout goals": "淘汰赛进球",
    "Knockout assists": "淘汰赛助攻",
    "Knockout G+A": "淘汰赛进球+助攻",
    "Champions League All-Time Appearances": "欧冠历史出场榜",
    "UEFA ranking snapshot for durability and long-term impact at elite European level.": "欧足联榜单快照：衡量耐久性与长期顶级影响力。",
    "183 appearances": "183次出场",
    "177 appearances": "177次出场",
    "163 appearances": "163次出场",
    "Top 10 Appearances Ranking": "出场前十排名",
    "All-time UEFA Champions League appearances leaders.": "欧冠历史出场榜领先球员。",
    "Appearances": "出场",
    "UEFA Team of the Year Selections": "欧足联年度最佳阵容入选次数",
    "Repeated Best XI selection is a long-horizon signal of elite status, influence, and sustained season-level output.": "持续入选最佳阵容是顶级地位、影响力与赛季级稳定输出的长期信号。",
    "15 selections": "15次入选",
    "12 selections": "12次入选",
    "11 selections": "11次入选",
    "Best XI Frequency Snapshot": "最佳阵容入选频次快照",
    "Selection count is used here as a consistency signal for the GOAT debate.": "这里将入选次数作为GOAT讨论中的稳定性指标。",
    "Selections": "入选次数",

    "A profile page placeholder for the greatest debate. Add trophies, UEFA records, and highlight moments here.": "这是最伟大之争项目中的球员页占位内容。可在此添加奖杯、欧战纪录和高光时刻。"
  };

  const TITLE_ZH = {
    "Who Is The Best UEFA Player of All Time?": "谁是欧足联历史最佳球员？",
    "Goals | Best UEFA Player": "进球 | 欧足联最佳球员",
    "Assists | Best UEFA Player": "助攻 | 欧足联最佳球员",
    "Titles Won | Best UEFA Player": "冠军数量 | 欧足联最佳球员",
    "Knockout G+A | Best UEFA Player": "淘汰赛进球+助攻 | 欧足联最佳球员",
    "Appearances | Best UEFA Player": "出场次数 | 欧足联最佳球员",
    "UEFA Best XI | Best UEFA Player": "欧足联最佳阵容 | 欧足联最佳球员",
    "Peak Seasons | Best UEFA Player": "巅峰赛季 | 欧足联最佳球员",
    "Cristiano Ronaldo | UEFA Profile": "C罗 | 欧足联档案",
    "Lionel Messi | UEFA Profile": "梅西 | 欧足联档案"
  };

  const ARIA_ZH = {
    "Key metrics": "关键指标",
    "Star cards": "球星卡片",
    "Goals ranking size": "射手榜显示范围",
    "Peak ranking size": "巅峰赛季排行显示范围",
    "Peak ranking filter": "巅峰赛季排行筛选",
    "Peak player selector": "巅峰球员切换",
    "Peak controls": "巅峰赛季控制项",
    "Ronaldo Messi star comparison": "C罗与梅西星图对比",
    "Cristiano Ronaldo": "克里斯蒂亚诺·罗纳尔多",
    "Lionel Messi": "莱昂内尔·梅西",
    "Ronaldo seasonal chart": "C罗赛季图表",
    "CR7 star chart": "C罗星形图",
    "Messi seasonal chart": "梅西赛季图表",
    "Messi star chart": "梅西星形图"
  };

  const normalize = (text) => text.replace(/\s+/g, " ").trim();

  const textEntries = [];
  const ariaEntries = [];
  let originalTitle = "";
  let langToggle = null;
  let headerResizeObserver = null;
  let headerSyncFrame = null;

  function collectTextNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        const parent = node.parentElement;
        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }
        if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const original = node.nodeValue;
      const leading = (original.match(/^\s*/) || [""])[0];
      const trailing = (original.match(/\s*$/) || [""])[0];
      const key = normalize(original);

      textEntries.push({
        node,
        original,
        leading,
        trailing,
        key
      });
    }
  }

  function collectAria() {
    document.querySelectorAll("[aria-label]").forEach((el) => {
      const original = el.getAttribute("aria-label") || "";
      ariaEntries.push({ el, original });
    });
  }

  function syncHeaderHeight() {
    const header = document.querySelector(".site-header");
    if (!header) {
      return;
    }
    const headerHeight = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
  }

  function queueHeaderSync() {
    if (headerSyncFrame !== null) {
      window.cancelAnimationFrame(headerSyncFrame);
    }
    headerSyncFrame = window.requestAnimationFrame(() => {
      headerSyncFrame = null;
      syncHeaderHeight();
    });
  }

  function applyLanguage(lang) {
    const useZh = lang === "zh";

    textEntries.forEach((entry) => {
      if (!useZh) {
        entry.node.nodeValue = entry.original;
        return;
      }

      const translated = ZH[entry.key];
      if (!translated) {
        entry.node.nodeValue = entry.original;
        return;
      }

      entry.node.nodeValue = `${entry.leading}${translated}${entry.trailing}`;
    });

    ariaEntries.forEach((entry) => {
      if (!useZh) {
        entry.el.setAttribute("aria-label", entry.original);
        return;
      }
      entry.el.setAttribute("aria-label", ARIA_ZH[entry.original] || entry.original);
    });

    document.title = useZh ? (TITLE_ZH[originalTitle] || originalTitle) : originalTitle;
    document.documentElement.lang = useZh ? "zh-CN" : "en";

    if (langToggle) {
      langToggle.textContent = "EN/中文";
      langToggle.setAttribute(
        "aria-label",
        useZh ? "Switch to English" : "切换到中文"
      );
    }

    localStorage.setItem(STORAGE_KEY, useZh ? "zh" : "en");
    queueHeaderSync();
  }

  function init() {
    originalTitle = document.title;
    langToggle = document.querySelector("[data-lang-toggle]");

    collectTextNodes();
    collectAria();

    const saved = localStorage.getItem(STORAGE_KEY);
    const initialLang = saved === "zh" ? "zh" : "en";

    applyLanguage(initialLang);
    queueHeaderSync();

    if (langToggle) {
      langToggle.addEventListener("click", () => {
        const current = localStorage.getItem(STORAGE_KEY) === "zh" ? "zh" : "en";
        applyLanguage(current === "zh" ? "en" : "zh");
      });
    }

    window.addEventListener("resize", queueHeaderSync);
    window.addEventListener("load", queueHeaderSync);

    if ("ResizeObserver" in window) {
      const header = document.querySelector(".site-header");
      if (header) {
        headerResizeObserver = new ResizeObserver(() => {
          syncHeaderHeight();
        });
        headerResizeObserver.observe(header);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

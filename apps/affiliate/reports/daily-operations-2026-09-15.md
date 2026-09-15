# Affiliate daily operations — 2026-09-15

## 今日结论

- GSC 最近 24 小时为 **1 点击、191 展现、CTR 0.5%、平均排名 24.5**，前一 24 小时为 **0 点击、200 展现、CTR 0%、平均排名 16.1**。展现只下降 4.5%，昨天的短窗断崖已经消失；唯一点击来自 ErGear/FlexiSpot 页。
- 完整 9 月 8–14 日相对前七日为 **4 vs 6 点击、1,517 vs 1,481 展现、0.3% vs 0.4% CTR、17.5 vs 24.0 平均排名**。展现增加 2.4%、平均排名改善 6.5 位，但点击少 2 个，当前核心问题是点击密度与覆盖不足，不是新的技术崩塌。
- 最近 28 日仍为 **31 vs 82 点击、7,650 vs 13,100 展现、0.4% vs 0.6% CTR、30.0 vs 28.3 平均排名**。Network、Smarthome、Pets 仍承受八月更新后的长尾损失；Homeoffice 与 Baby 的展现继续扩张。
- 今日完成 9 月 8 日 27-family 合并 Day-7：**27 个保留 hub 在 Google 两个七日窗及 Bing 当前七日全部零展现，但 27/27 均为 `URL is on Google / Page is indexed`**。技术、Sitemap、分类发现和 91 个永久重定向全部通过，因此保持至 9 月 22 日，不撤销合并、不重新改写。
- ErGear/FlexiSpot 第二次 snippet 已获得首个滚动 24 小时点击，触发账本里的“获得点击立即停止改写”规则。实验关闭为保护状态；今天不改页面、不发布、不重提 IndexNow。

## Search Console

### 最近 24 小时

| 窗口 | 点击 | 展现 | CTR | 平均排名 |
| --- | ---: | ---: | ---: | ---: |
| 最近 24 小时 | 1 | 191 | 0.5% | 24.5 |
| 前 24 小时 | 0 | 200 | 0% | 16.1 |

ErGear/FlexiSpot 为 **1 vs 0 点击、6 vs 9 展现**。短窗排名变差不适合用来批量重写；点击已经给出了更重要的 snippet 正向信号。Branch Ergonomic Chair 为 36 vs 49 展现；standing desk height chart 为 24 vs 9，均继续按现有 cohort 保护。

### 完整七日

以下为页面维度按 hostname 汇总。Tools 已永久排除；页面维度合计与 property headline 不要求相加一致。

| 站点 | 点击 | 前窗点击 | 展现 | 前窗展现 | 曝光 URL | 前窗曝光 URL | 加权排名 | 前窗排名 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Network | 2 | 0 | 43 | 48 | 14 | 18 | 22.80 | 18.25 |
| Smarthome | 0 | 0 | 20 | 25 | 16 | 18 | 16.56 | 32.44 |
| Homeoffice | 1 | 4 | 957 | 904 | 95 | 106 | 19.43 | 27.53 |
| Baby | 1 | 2 | 550 | 544 | 89 | 109 | 13.04 | 15.52 |
| Pets | 0 | 0 | 24 | 21 | 10 | 14 | 6.12 | 10.00 |
| Style | 0 | 0 | 0 | 1 | 0 | 1 | — | 4.00 |
| Costumes | 0 | 0 | 0 | 0 | 0 | 0 | — | — |

点击由 Network `deco-be63-vs-be67-vs-be85-buying-guide` 贡献 2 个，Homeoffice `logitech-litra-glow-vs-elgato-key-light-neo` 贡献 1 个，Baby 德语 Ergobaby positions 页贡献 1 个。查询词仍由 `tp link be63 vs be67` 与 `deco be63 vs be67` 各产生 1 点击；comparison-first 方向继续保护。

### 28 日诊断

页面维度显示：Network 632 vs 4,093 展现、Smarthome 428 vs 2,660、Pets 209 vs 1,071，长窗仍严重受损；Homeoffice 4,123 vs 2,675、Baby 2,372 vs 1,886，正在扩张。最近七日 Smarthome 和 Pets 的加权排名分别改善到 16.56 和 6.12，因此不能因长窗损失对已获得排名的页面做无差别重置。

索引报告仍停留在 9 月 4 日：1,567 indexed、4,325 not indexed，结构与昨天相同。今日 27 个精确 live inspection 是更及时的事实：没有一个保留 hub 掉索引，也没有使用 Request indexing。

## 27-family consolidation Day-7

正式窗口为 2026-09-08 至 2026-09-14，对比 2026-09-01 至 2026-09-07。

| 检查项 | 结果 | 动作 |
| --- | ---: | --- |
| 保留 hub | 27 | 全部进入 Day-14 hold |
| Google 当前/前窗曝光 hub | 0 / 0 | 不把零展现误判为掉索引 |
| Bing 当前曝光 hub | 0 | 无 Bing hub 需要单独保护 |
| Live URL Inspection | 27 indexed / 0 not-on-Google / 0 unknown | 不请求索引 |
| 永久重定向源 | 91 | 保持 308，不恢复旧路由 |
| 公网校验 | 27 hub、91 base、91 en-gb、Network/Pets Sitemap 全通过 | 不发布 |
| 分类发现 | 19/19 category、154/154 hub、418/418 support link | 无内部链接修复 |

Day-7 决定：合并结构技术上完整，但搜索引擎尚未给 27 个 hub 任何曝光。七天样本不足以在没有查询证据的情况下撤销 91 个重定向或再次重写 27 页。全组推进到 **9 月 22 日 Day-14**；届时逐个 still-zero hub 执行需求差异、意图错配或退役判断，而不是再等一个空泛观察期。精确账本见 `apps/affiliate/reports/search-recovery-consolidation-day7-gate-2026-09-15.json`。

## Bing、行为与收入

- Bing 9 月 8–14 日 property 为 **7 点击、425 展现、CTR 1.65%**。排除 Main 与 Tools 后，活跃 Affiliate 页面为：Network 97 展现/4 点击/平均排名 4.53，Smarthome 25/1/4.60，Homeoffice 22/0/3.91，Baby 2/2/6.00，Pets 3/0/4.00。27 个 Day-7 hub 在 Bing 也为零；现有 Bing 赢家继续保护。
- Clarity Yesterday：**3 个真实会话、48 个机器人会话排除、1.67 页/会话、74.88% 平均滚动、1.2 分钟平均活跃**；0 强烈点击、0 无效点击、0 过度滚动、0 快速返回、0 JavaScript 错误。Network Deco 比较页 2 会话，ErGear/FlexiSpot 1 会话。
- Amazon 9 月 7–13 日（最后更新 9 月 14 日 00:00 PDT）：**46 点击、9 件下单、19.57% 转化、$342.25 下单额、9 件发货、1 件退货**。Summary 为 **$15.71**，由 $12.71 commissions 与 $3.00 bounties 组成；报表单列 Total Earnings 显示 $12.71。
- CJ 登录态仍过期，最新 clicks/sales/leads/commission 为 authentication-blocked，不记为零。
- 联盟链接审计 **306/306 passed**，8 个已知漂移或不可用 Amazon offer 继续被安全抑制。

## 生产与验证

- 正确七个运营主机为 Network、Smarthome、Homeoffice、Baby、Pets、Style、`costumes.madabase.com`；七个首页与七个 Sitemap 均 HTTP 200。Tools 永久排除。
- 27-family 公网审计通过 27 个 hub、118 个测量 URL 与 91 个永久重定向，无错误；19 个分类页发现审计全部通过。
- Cloudflare HTML 返回当前页面与 public cache headers；本次两个请求落到不同 POP，因此均为 MISS，不构成缓存故障。API 为 `private, no-store` + `DYNAMIC`，RSC 为 `DYNAMIC`；不清缓存。
- `check:search-recovery`、`check:seo`、`check:affiliate-links`、`check:next-product-expansion`、`check:day30-consolidation`、`check:page-coverage`、公网 category discovery 与 ESLint 全部通过。
- 当前生产仍为 release `ab2cf6d`，回滚 `3d04dcd`。今天没有运行时代码变化，因此不构建、不发布、不提交 Sitemap/IndexNow/GSC Request indexing。

## 外部分发与下一步

普通日常运营不重复外部分发。独立流程已在 9 月 14 日发布 Pinterest variant 2；两版保持至 9 月 21 日，不发 variant 3。Reddit 永久退出。

1. 2026-09-18：Comparison-first 36 Day-14；9 月 11 日两组变更 Day-7。
2. 2026-09-20：只确认 ErGear 的保护结果，不再做 snippet 测试。
3. 2026-09-21：Indexed-zero 40 Day-14，只处理仍零展现的精确 34 页；新增曝光页自动转保护。
4. 2026-09-22：27-family consolidation Day-14，逐个 still-zero hub 做需求、意图差异或退役决定，91 个 redirect 不因噪声恢复。
5. 新增可索引路由继续冻结；Tools 继续从所有运营和监控中排除。

## 今日关闭状态

- 状态：`complete_day7_hold_ergear_first_click_protected_no_runtime_release`
- 主动作：27-family Day-7 + 27/27 live inspections + ErGear experiment close/protect
- Search Console：24h / 7d / 28d checked
- Bing：checked, active winners protected
- Clarity：checked
- Amazon：7d checked
- CJ：blocked-authentication
- 联盟链接：306/306 passed
- 生产与 Cloudflare：checked healthy
- 外部分发：not repeated
- 本地与公网验证：passed

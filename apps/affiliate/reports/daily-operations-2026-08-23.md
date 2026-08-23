# Madabase 联盟站日常运营记录：2026-08-23

状态：`completed-with-external-quota-blocker`。今天所有本地可执行检查、23 号精确 cohort gate 和现有页面 SEO 恢复均已完成；剩余 URL Inspection 被 Google 当日配额阻断，CJ 后台数据被登录态阻断。

主动作分两段：先把 `report-current-search-gates.mjs` 扩展为可直接读取 GSC 官方 `Pages.csv`，据此完成 Expansion757 Day 14 全量指标账本；随后根据站点所有者的明确指令，使用最新 24 小时页面与查询信号修复现有页面和共享主题层级。新增 indexable 页面仍冻结，没有新增 cohort、sitemap URL、批量 Request indexing 或外部分发。

## Google 更新与冻结决定

- Google Search Status Dashboard 将 August 2026 spam update 标为 `Closed`：2026-08-21 01:50 PDT，持续 2 天 16 小时。
- GSC Performance 当前最新完整日期仅到 2026-08-20，早于更新结束；可用的完整更新后数据日为 `0`。
- 解冻仍要求 GSC 完整包含 8 月 22、23、24 三个数据日。自然日到了不等于数据已完整，因此七站扩张冻结保持开启。
- 8 月 22 日漏做没有造成 Performance 历史数据丢失，但失去了一天不会补发的 URL Inspection 配额。未完成队列已并入今天和明天。

## Search Console

10:30 左右重新读取的最新 24 小时滚动窗口（方向性）：0 clicks、202 impressions、CTR 0%、平均排名 34.5；早上同一窗口为 219 impressions，说明滚动 24 小时还在继续收缩，不能只看七天均值。

| 站点 | 最近 24 小时 clicks | impressions | 平均排名 |
| --- | ---: | ---: | ---: |
| Network | 0 | 8 | 44.3 |
| Smarthome | 0 | 6 | 32.7 |
| Homeoffice | 0 | 118 | 42.3 |
| Baby | 0 | 70 | 17.0 |
| Pets | 0 | 0 | 无数据 |
| Style | 0 | 0 | 无数据 |
| Costume | 0 | 0 | 无数据 |

最近完整七天（2026-08-14 至 08-20）对比前七天：24 vs 23 clicks，3,814 vs 4,584 impressions，CTR 0.6% vs 0.5%，平均排名 34.3 vs 28.0。

| 站点 | Clicks | Impressions | CTR | 平均排名 | 判断 |
| --- | ---: | ---: | ---: | ---: | --- |
| Network | 9 vs 12 | 799 vs 1,421 | 1.1% vs 0.8% | 25.6 vs 23.9 | 展现仍明显偏低，继续 recovery |
| Smarthome | 2 vs 5 | 693 vs 1,120 | 0.3% vs 0.4% | 28.1 vs 22.7 | 展现和排名仍弱，继续 recovery |
| Homeoffice | 3 vs 3 | 1,180 vs 1,040 | 0.3% vs 0.3% | 42.7 vs 37.1 | 展现增长，保护基线 |
| Baby | 5 vs 3 | 770 vs 683 | 0.6% vs 0.4% | 25.9 vs 21.6 | 点击和展现增长，保护基线 |
| Pets | 4 vs 0 | 291 vs 340 | 1.4% vs 0% | 24.4 vs 21.9 | 展现略低但获得 4 clicks，继续观察恢复 |
| Style | 0 vs 0 | 10 vs 21 | 0% | 38.1 vs 18.2 | 样本太小，maintenance |
| Costume | 0 vs 0 | 17 vs 26 | 0% | 30.5 vs 20.3 | 样本太小，observe |

页面索引报告仍停留在 2026-08-17：1,543 indexed、4,155 not indexed，其中 3,459 是已知的 noindex 市场或草稿路由。没有把这个延迟报告当成今天的新异常。

七个联盟站 sitemap 均为 GSC `Success`：Network 257、Smarthome 274、Homeoffice 287、Baby 264、Pets 258、Style 76、Costume 145 discovered pages。没有重复提交。

- Manual actions：`No issues detected`
- Security issues：`No issues detected`
- Removals：最近六个月没有请求

## Expansion757 Day 14

精确覆盖 757/757 URL，窗口为 2026-08-14 至 08-20：

- exposed 292，zero-impression 465
- 2 clicks，797 impressions，CTR 0.251%，加权平均排名 45.979
- 前一账本为 exposed 360、zero 397、1 click、1,119 impressions、加权排名 38.527
- 结论：曝光面、展现与排名均恶化，只有 clicks 从 1 增至 2；保持 `hold-no-expansion`，不开同类新 cluster，也不批量改写、合并或删除。

按站点：Baby 62/144 exposed、Homeoffice 76/165、Network 50/108、Pets 45/150、Smarthome 56/150、Costume 3/40。

## 现有页面 SEO 恢复（所有者授权）

Expansion757 的问题不是大面积掉索引：累计检查 260 个零展现 URL 中 252 个仍在 Google。更直接的问题是 757 页被分类页一次性摊平，主购买页与支持页层级不清，同时完整七天只有 2 clicks / 797 impressions、465 个零展现 URL。今天没有批量删页、noindex、改 canonical 或重写 757 个标题，而是修共享信息架构：

- 19 个分类页只把 154 个 buying guide 作为主题主枢纽，不再平铺 603 个支持页。
- 每个主枢纽明确链接同 family 的 comparison、fit、ownership、workflow 和 safety；每个支持页反向标注主枢纽并保留同组兄弟入口。
- 每个 governed guide 增加 family ItemList schema；分类 ItemList 改为与可见精选集合一致。
- 本地真实渲染审计通过：154/154 主枢纽可从分类页进入，603/603 支持页可从对应主枢纽一跳进入，757/757 无断链。

按最新 24 小时查询证据刷新四个已有页面：

1. Baby Brezza Advanced：标题、瓶型/材质兼容、八瓶最大容量与真实混合装载限制。
2. Correct standing desk height：标题与直接 elbow-height 答案，分离键盘、显示器、鞋和地垫高度。
3. Deco BE63 vs BE67 vs BE85：精确比较标题与三型号选择规则。
4. Aqara FP300：价格意图、实时价格变化说明及 hub/controller 总成本。

完整受影响 URL 账本：`apps/affiliate/reports/seo-recovery-affected-urls-2026-08-23.json`；757 页精确 URL 复用 `docs/affiliate-expansion757-search-gate-2026-08-23.csv`。

## 零展现 URL Inspection

Expansion757 与 Ranking118 当前零展现精确并集为 486 URL：

- 累计 live-inspected：260
- indexed：252
- not-on-Google：8
- 当日配额阻断：226
- 今日新批次成功检查 99：96 indexed、3 not-on-Google；第 100 次请求触发 property daily quota
- 下一闸门：2026-08-24 配额刷新后，从剩余 226 个精确 URL 继续

今日三个新例外：

1. `https://baby.madabase.com/guides/adjustable-high-chairs-buying-guide`
2. `https://baby.madabase.com/guides/adjustable-high-chairs-ownership-cost-and-maintenance`
3. `https://network.madabase.com/guides/pcie-wifi-adapters-compatibility-and-fit-guide`

GSC 显示的是 8 月 10/16 日旧抓取时的 canonical 异常；今天生产 HTML 对三页均返回 HTTP 200 和正确自指 canonical。当前动作是保留并在 Google 重新抓取后复查，不做批量 canonical 手术，也不因零展现请求索引。

## 转化与收入

### Clarity（Yesterday）

- 41 sessions，68 bot sessions excluded，41 unique users
- 1 page/session，11.46% average scroll，2 seconds average active time
- 2 outbound-click sessions，2 `affiliate_click` sessions
- rage click、dead click、excessive scroll、quick back 均为 0%；JavaScript errors 为 0

### Amazon Associates

报表最后更新：2026-08-21。

- 本月：21 clicks、21 ordered items、21 shipped items、100% conversion、$6.68 earnings
- 最近 30 天概览：35 clicks、$11.58 commissions、$0 bounty
- 报表有延迟，未把 8 月 22 日以后的缺口解释为零收入。

### CJ

访问时被重定向到登录页，当前登录态已过期。今天记录为 `blocked-auth`，不是 0 clicks / 0 sales；未触碰账号密码、税务、银行或付款设置。

## 生产、Cloudflare 与联盟链接

- 七个首页和七个 `sitemap.xml`：14/14 HTTP 200；响应约 2.19-3.59 秒。
- 浏览器形态 HTML：Network、Smarthome、Pets、Style 为 `UPDATING`，Baby 为 `HIT`；Homeoffice 和 Costume 首次为 MISS/EXPIRED，复查均回填为 `HIT`。没有 5xx 或缓存故障信号。
- `check:affiliate-links`：306/306 passed，8 个已知漂移或不可用 Amazon offer 继续被抑制。
- 本地 release archive 已生成并提交为 `6fa3935`；向 `origin/lyd-0609` 推送时被安全审批拦截，因为线性历史还包含此前未推送的运营报告和 57.9MB 发布归档，而所有者尚未明确授权把这些内容发送到该 GitHub remote。生产仍安全保持 `eba7ed0`，没有半切换、Cloudflare purge、sitemap 重提、IndexNow 提交或外部分发。

## 本地验证

- `check:search-recovery`：passed；七站 freeze active，1,026-row recovery ledger 完整
- `check:seo`：passed；964 guides、175 products、77 roundups、7 tools
- `check:affiliate-links`：306/306 passed
- `check:next-product-expansion`：passed；130 seeds 仍为 research-planning，0 pages ready for sitemap
- `lint`：passed
- `check:category-discovery`：19/19 categories passed；154/154 primary hubs、603/603 supporting links passed
- 七站基础转化：Network、Smarthome、Homeoffice、Baby、Pets、Style 共 1,363/1,363 passed；Costume 本地因无生产数据库出现 56 个无 CTA，随后生产只读复核 132/132 passed，确认不是线上故障
- 标准生产 build：passed；Linux x64 standalone release build 和归档：passed
- release artifact：60,730,343 bytes，SHA-256 `c6bc42f547b3a755772433103b0523653f82e8dd45aafd8d46fd783f53c2bac4`
- CSV 导入已生成今天的精确账本；随后用标准 JSON 输入重跑相同报告，兼容路径 passed

## 未做与下一步

- Bing：`not-due`
- Pinterest / Reddit / Quora / 论坛：`not-due`；用户未要求“外部分发”
- 剩余 226 个 URL Inspection：`blocked-daily-quota`
- CJ：`blocked-auth`
- 新增页面：`not-allowed`；完整更新后 GSC 数据尚未出现。现有页面 query-backed 修复已由所有者明确授权并单独记账。

明日第一步：配额刷新后先继续剩余 226 个精确 URL Inspection；随后完成五个 direct-URL 产品 pilot 的 HTTP、canonical、exact ASIN、tracking ID、首屏/粘性 CTA、图片、商家身份、sitemap/discovery 隔离复核。新页面继续隔离；今天修复的既有页面在生产发布后用最新 24 小时与完整 7 天分别监控，不用当天滚动数据宣称恢复。

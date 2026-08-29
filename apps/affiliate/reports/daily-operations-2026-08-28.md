# Madabase 联盟站日常运营记录 — 2026-08-28

状态：complete（8 月 26 日完整数据、到期精确 cohort、486 URL Inspection 队列、转化、生产和本地验证均已完成）

## 今日结论

8 月 26 日已进入完整 Search Console 数据。最近完整七日（8 月 20–26 日）相对前七日（8 月 13–19 日）为 6 vs 26 点击（-76.9%）、1,794 vs 4,442 展现（-59.6%）、0.3% vs 0.6% CTR、平均排名 37.5 vs 33.9。跌幅较 8 月 26 日复评时的 -66.0% 展现有所收窄，但不足以称为恢复；Network、Smarthome、Pets 仍是主要损失来源。

这也不是七站同步技术故障。Baby 的页面明细平均排名从约 26.8 改善到 20.3，Homeoffice 展现仅下降约 8.9%；Network、Smarthome、Pets 的页面明细展现仍分别下降约 92.7%、97.1%、98.9%。Page indexing、sitemap、人工处置、安全问题、生产 HTTP、canonical/robots 入口和联盟链接均无新异常，486 个精确零展现 URL 中 471 个现已确认在 Google，故障模型继续是算法曝光和排名重排，不是站点宕机或组合级掉索引。

8 月 27 日发布的 43 页 deep-rank recovery 在 8 月 26 日完整数据之后发生。今天没有一个完整发布后数据日；最近 24 小时也混有不完整与滚动数据，因此不能用今天的数据判定这批修改成功或失败。今日主动作是完成所有到期精确闸门并保护测量基线，不叠加第二轮批量重写、不部署、不重放 IndexNow。

## Search Console

### 最近 24 小时 vs 前 24 小时（方向性）

- 全域：2 vs 1 点击；226 vs 254 展现（-11.0%）；0.9% vs 0.4% CTR；平均排名 38.3 vs 34.4。
- 页面明细：Homeoffice 151 vs 127 展现并获得 1 点击；Baby 67 vs 104 展现并获得 1 点击；Network 7 vs 19；Smarthome 0 vs 6；Pets、Style、Costumes 均为 0。
- 两个点击页面是 Baby 的 Ergobaby Omni Breeze forward-facing age guide 和 Homeoffice 的 best ergonomic chairs under $500。
- 43 页恢复批次：7 vs 9 展现、0 点击、平均排名约 59.7 vs 56.1。该窗口只用于确认没有发布后断崖或技术异常，不用于评价 SEO 效果。

### 最近完整七日：2026-08-20 至 2026-08-26 vs 2026-08-13 至 2026-08-19

| 站点 | 点击 | 页面明细展现 | 页面明细平均排名 | 判断 |
| --- | ---: | ---: | ---: | --- |
| 全域卡片 | 6 vs 26 | 1,794 vs 4,442 | 37.5 vs 33.9 | 仍处于明显恢复期 |
| Network | 2 vs 9 | 75 vs 1,026 | 39.4 vs 26.6 | 展现 -92.7%，仍是 recovery |
| Smarthome | 0 vs 3 | 26 vs 909 | 57.4 vs 26.7 | 展现 -97.1%，排名同步恶化 |
| Homeoffice | 3 vs 4 | 1,103 vs 1,211 | 45.0 vs 42.6 | 展现 -8.9%，继续保护有效页 |
| Baby | 1 vs 5 | 601 vs 812 | 20.3 vs 26.8 | 展现 -26.0%，但排名质量明显改善 |
| Pets | 0 vs 4 | 4 vs 370 | 16.3 vs 24.9 | 样本几乎消失，不能把均位改善当恢复 |
| Style | 0 vs 0 | 0 vs 13 | — vs 34.2 | maintenance，样本不足 |
| Costumes | 0 vs 0 | 2 vs 27 | 41.0 vs 24.1 | observe，样本不足 |

站点行来自导出的页面明细，GSC 的页面聚合、隐私阈值和全域卡片口径并不要求逐行相加完全一致；全域结论以卡片为准，站点相对变化以同一页面明细口径比较。

### 28 日组合背景

- 最近 28 日：74 点击、12,956 展现、0.6% CTR、平均排名 30.5。
- 前 28 日：41 点击、7,508 展现、0.5% CTR、平均排名 30.3。
- 点击仍高 80.5%，展现仍高 72.6%，说明长期累计没有被抹掉；但平均排名未改善，且最近七日严重低于前窗，所以 28 日增长不能用于解冻。

### 页面与查询层

正向信号继续保护，不改标题或主意图：

- CalDigit TS4：81 vs 48 展现，平均排名 9.2 vs 12.5。
- GROWNSY sterilizer：45 vs 25 展现，平均排名 13.3 基本稳定。
- Portable monitor USB-C / DP Alt Mode / DisplayLink guide：40 vs 21 展现，平均排名 31.3 vs 52.2；`dp alt mode driver` 查询从 1 增至 13 展现，排名从 51 改善到 15.9。
- Ergobaby forward-facing age guide：44 vs 35 展现，平均排名 10.0 vs 11.1；最近 24 小时获得 1 点击。
- Deco BE63 / BE67 / BE85 guide：2 点击、28 展现、平均排名 4.5；展现低于前窗 58，但排名从 6.7 改善，继续保护。

需要继续观察但今天不再重写：

- Standing desk height guide：164 vs 144 展现，但平均排名 81.2 vs 77.7；意图匹配存在，当前瓶颈不是标题缺词，而是权威与竞争力。
- Baby Brezza Advanced：47 vs 40 展现，平均排名 15.2 vs 11.4；核心查询仍为 33 展现、排名 17.5，先保留 8 月 23 日改动。
- Aqara FP300 review：5 vs 100 展现，平均排名 60.0 vs 17.1；Tapo P125M、Aqara FP2 与多个 Network product/review 查询也整组消失。这是站级曝光收缩证据，不适合把单页继续改大。

### 到期精确 cohort

- Ranking118：118 URL 全查；47 exposed、71 zero-impression、4 点击、696 展现、加权排名 22.45。前窗为 99 exposed、19 zero-impression、18 点击、2,029 展现、排名 19.52。整体未通过恢复闸门；其中 Baby 排名 12.53 vs 19.01、Homeoffice 27.08 vs 28.03，应保护，Network / Smarthome / Pets 继续 recovery。
- Soft151 原始 Day 14 / sitemap 后 Day 7：151 URL 全查；26 exposed、125 zero-impression、0 点击、74 展现、加权排名 51.63。前窗为 16 exposed、135 zero-impression、0 点击、29 展现、排名 28.45。发现面从 16 扩到 26、展现从 29 增到 74 是早期正向信号，但排名更深且没有点击；结论是继续 sitemap/indexable 稳定观察，不重写、不重提，下一闸门 9 月 3 日。
- Expansion757：131 exposed、626 zero-impression、0 点击、286 展现、排名 51.07；前窗为 315 exposed、442 zero-impression、2 点击、934 展现、排名 47.24。继续 hold-no-expansion。
- 43 页 deep-rank recovery：完整 8 月 20–26 日是发布前基线，41 exposed、151 展现、0 点击、排名 65.43；前窗为 39 exposed、233 展现、排名 64.47。最近 24 小时仅作方向检查，首个正式方向闸门仍为 9 月 3 日。
- 8 月 23 日四个单页刷新合计：2 vs 3 点击、244 vs 342 展现；其中 Deco 与部分 Baby 页面有可保护信号，Standing desk 与 FP300 拉低加权排名，不作组合级回滚。
- 25 个 consolidation retained hubs：当前与前窗仍为 0 展现；继续保留重定向和主题层级，等下一完整闸门，不因五天内无信号恢复被合并的零展现支持页。

精确输出：`docs/affiliate-current-search-gates-2026-08-28.json`、`docs/affiliate-ranking118-search-gate-2026-08-28.csv`、`docs/affiliate-soft151-search-gate-2026-08-28.csv`、`docs/affiliate-expansion757-search-gate-2026-08-28.csv`。

### 索引、站点地图与风险项

- Page indexing 仍最后更新于 8 月 21 日：1,586 indexed、4,267 not indexed；3,514 为受控 noindex，364 个 404、103 个 redirect、40 crawled-currently-not-indexed、136 discovered-currently-not-indexed、33 duplicate without user-selected canonical、历史 5xx 两例仍为 Started。
- 七个 Affiliate sitemap 全部 Success，发现页数保持 Network 245、Smarthome 258、Homeoffice 275、Baby 264、Pets 234、Style 76、Costumes 121；未重复提交。
- Manual actions：No issues detected。Security issues：No issues detected。Removals：过去六个月无请求。

## 零展现 URL Inspection

- 之前的精确队列 486 URL 已全部完成：471 indexed、15 not-on-Google、0 remaining、0 quota blocker。
- 三个优先 Smarthome 详情复查中：`smart-blind-motors-ownership-cost-and-maintenance` 已转为 indexed；Aqara T1 / Yolink / Moen Flo 对比和 best smart water shutoff valves 均为 `Discovered - currently not indexed`，都已由正确 Smarthome sitemap 发现。
- 剩余 28 URL 今天全部返回 `URL is on Google`，没有批量 Request indexing。
- 两个 discovered-currently-not-indexed 页面生产端已知为 HTTP 200、自 canonical、无 noindex，保留并在 9 月 3 日复查，不做无证据重写。
- 结果：`apps/affiliate/reports/url-inspection-results-2026-08-28.json`、`docs/affiliate-zero-impression-inspections-2026-08-28.csv` / `.json`。

## 转化与联盟收入

### Clarity（Yesterday，2026-08-27）

- 46 人类会话，另排除 125 个机器人会话；46 个唯一用户。
- 1.07 页 / 会话；平均滚动 30.69%；平均活跃 26 秒，总时间 27 秒。
- 0 强烈点击、1 个无效点击会话（2.17%）、0 过度滚动、0 快速后退。
- 2 个 outbound-click 会话、2 个 `affiliate_click` 会话；0 JavaScript 错误。
- Google 2 个引荐会话、Bing 1 个；行为与转化路径没有出现发布后断裂信号。

### Amazon Associates（Last 30 Days，2026-07-29 至 2026-08-27）

- Last Updated：2026-08-26 00:00，仍有一天报表延迟。
- 38 clicks、21 ordered items、55.26% conversion、$264.42 ordered revenue。
- 21 shipped items、1 returned item、$257.43 total revenue、商品佣金 $6.51。
- 顶部汇总另显示 $3.00 bounty，账户汇总为 $9.51；与商品表的 $6.51 分开记录。
- 相比 8 月 26 日读取仅增加 1 click，订单与商品佣金未增加；不能把没有新订单归因于昨天 43 页发布。

### CJ

- blocked：当前标签页停留在登录页，无法取得 Yesterday 报表；记为不可用而不是 0。
- 不代表用户登录或改变账户设置；也不依据旧的 123 clicks 异常修改 CTA。

### 联盟链接

- `check:affiliate-links`：306 / 306 passed，0 failed；8 个已知漂移或不可用 Amazon offer 继续被抑制。

## 生产与技术健康

- 七个站点首页、`robots.txt`、`sitemap.xml` 均最终返回 HTTP 200；Baby robots 首次出现一次瞬时 TLS 连接失败，重试即 200，其他入口无异常。
- Cloudflare 抽查真实页面返回 HTTP/2 200、`server: cloudflare`、HTML `cf-cache-status: DYNAMIC`，符合当前规则。
- 昨日 active release `a4e8e63` 保持公开健康；今天没有运行时异常信号，因此未进入服务器执行命令、未清 CDN、未构建、未部署。

## 今日主动作与冻结决策

主动作：完成 8 月 26 日完整数据复评、Ranking118 与 Soft151 到期整批闸门，并清空 486 URL Inspection 队列。

- 新索引增长冻结继续生效。
- Network、Smarthome、Pets 维持 recovery；Homeoffice、Baby 维持 protect；Style maintenance；Costumes observe。
- 正向或排名靠前页面不动；昨天 43 页批次在 9 月 3 日前只监控异常，不提前再次改写。
- 今天没有新的 P0 技术、索引、追踪或商家故障，所以“保持不变并保护基线”比继续批量修改的预期价值更高。

## 本地验证

- `check:search-recovery`：passed；七站 freeze active，1,026 行恢复 ledger 完整，ready for sitemap = 0。
- `check:seo`：passed；964 guides、175 products、77 roundups、7 tools。
- `check:affiliate-links`：306 / 306 passed。
- `check:next-product-expansion`：passed；130 seeds 继续 sitemap/discovery excluded，submission disabled。
- `lint`：Node 20 下 passed。
- 今天仅更新分析、运营状态与报告工具的 GSC 对比 CSV 支持，无运行时代码改动，因此不跑生产 build。

## 外部分发与未做项

- 外部分发：由 8 月 28 日独立工作流记录；本次日常分析未重复发布，也未修改该工作流未跟踪文件。
- Bing：not-due。
- Sitemap / IndexNow：没有新的合格 changed canonical，未重复提交。
- CJ：blocked by expired authentication。

## 下一步

1. 每日继续读最新 24 小时，只处理 5xx、索引入口、商家或发布级异常，不用滚动数据判定 43 页效果。
2. 2026-09-03 完整检查 43 页 deep-rank 首个方向闸门、Soft151 sitemap 后 Day 14，以及两个 discovered-currently-not-indexed Smarthome URL。
3. 2026-09-10 执行 43 页 tactical gate；只对仍有展现且深排名的页面做下一轮，保护点击页和 Top 20。
4. Expansion757 Day 30 仍为 2026-09-08；在精确数据通过前不解冻新页面扩张。

# Madabase 联盟站日常运营记录 — 2026-08-26

状态：complete（正式冻结复评已完成；GSC URL Inspection 额度仍未恢复，28 个未检查 URL 与 3 个 detail recheck 延续到 8 月 27 日）

## 今日结论

8 月 24 日已经进入完整 GSC 数据，8 月 22、23、24 三日观察门槛达到 3/3，但数据明确不支持解冻。最近完整七日（8 月 18–24 日）相对前七日的点击从 36 降至 5（-86.1%），展现从 5,457 降至 1,858（-66.0%），CTR 从 0.7% 降至 0.3%，平均排名从 32.6 变差到 36.5。Network、Smarthome、Pets 的展现分别下降 95.3%、96.6%、98.6%，是本轮主要受损站点；Homeoffice 展现基本守住，Baby 平均排名改善，因此不能把七站当成同一技术故障处理。

最近 28 日仍为 77 点击 / 13,173 展现，对比前 28 日的 36 / 6,998 保持增长，Page indexing、七个 sitemap、生产响应、canonical、robots、Manual actions 和 Security issues 均无新故障。结合 442/458 个已检查零展现 URL 仍在 Google，当前故障模型仍是更新后的近期排名/曝光重排，而不是生产宕机、人工处罚或组合级大面积掉索引。

8 月 23 日的主题层级、25 个 family consolidation 和四个查询支持刷新刚部署三天。今天不叠加第二轮全站重写，以免破坏恢复发布的测量基线；七站新索引增长冻结继续生效。

## Search Console

### 最近 24 小时 vs 前 24 小时（滚动窗口，方向性）

- 全域：2 vs 2 点击；189 vs 248 展现（-23.8%）；1.1% vs 0.8% CTR；平均排名 39.9 vs 33.0。
- Network：1 vs 0 点击；6 vs 7 展现；平均排名 23.7 vs 47.0。
- Smarthome：0 vs 0 点击；1 vs 2 展现；平均排名 74.0 vs 67.0。
- Homeoffice：0 vs 2 点击；118 vs 164 展现；平均排名 50.4 vs 38.9。
- Baby：1 vs 0 点击；66 vs 84 展现；平均排名 18.8 vs 17.2。
- Pets：0 vs 0 点击；0 vs 3 展现。
- Style：0 点击、0 展现；Costumes：0 点击、1 展现。
- 两个点击页面分别是 Network 的 `deco-be63-vs-be67-vs-be85-buying-guide` 和 Baby 的 `babybjorn-harmony-newborn-fit-checklist`。
- 站点过滤合计会受 GSC 隐私阈值与省略影响；滚动窗口只用于异常方向，不能替代完整日或发布因果判断。

### 最近完整七日：2026-08-18 至 2026-08-24 vs 2026-08-11 至 2026-08-17

| 站点 | 点击 | 展现 | CTR | 平均排名 | 判断 |
| --- | ---: | ---: | ---: | ---: | --- |
| 全域 | 5 vs 36 | 1,858 vs 5,457 | 0.3% vs 0.7% | 36.5 vs 32.6 | 点击 -86.1%，展现 -66.0% |
| Network | 2 vs 15 | 71 vs 1,520 | 2.8% vs 1.0% | 40.3 vs 26.1 | 展现 -95.3%，排名同步变差 |
| Smarthome | 0 vs 5 | 44 vs 1,280 | 0% vs 0.4% | 62.9 vs 25.2 | 展现 -96.6%，本轮最弱之一 |
| Homeoffice | 3 vs 4 | 1,150 vs 1,220 | 0.3% vs 0.3% | 42.5 vs 41.9 | 展现仅 -5.7%，继续保护有效页面 |
| Baby | 0 vs 7 | 611 vs 826 | 0% vs 0.8% | 20.1 vs 26.2 | 展现下降但平均排名改善，不做站级重写 |
| Pets | 0 vs 4 | 7 vs 490 | 0% vs 0.8% | 27.6 vs 24.5 | 展现 -98.6%，继续恢复态 |
| Style | 0 vs 0 | 0 vs 18 | 0% vs 0% | 0 vs 30.9 | 样本不足，maintenance |
| Costumes | 0 vs 0 | 1 vs 32 | 0% vs 0% | 2.0 vs 29.3 | 样本不足，observe |

Network 仍有 BE63/BE67 查询进入前三至前六名，但查询覆盖明显收窄；Smarthome 的 Tapo P110M/P125M 和 Aqara FP300 查询从前窗点击/展现跌到本窗接近零；Pets 的 Furbo、smart feeder、Levoit/Shark 与 dog-ramp 查询整组消失。这种跨多条已收录 URL 的同步消失更符合算法曝光收缩，而不是单页 canonical 或 sitemap 错误。

### 28 日背景

- 最近 28 日：77 点击、13,173 展现、0.6% CTR、平均排名 30.2。
- 前 28 日：36 点击、6,998 展现、0.5% CTR、平均排名 30.7。
- 长窗口仍增长，但最近七日断崖足够严重；28 日增长不能用来解冻，七日下跌也不能抹掉仍在工作的页面。

### 索引、站点地图与风险项

- Page indexing 仍最后更新于 8 月 21 日：1,586 indexed、4,267 not indexed；其中 3,514 是受控 noindex。Crawled-currently-not-indexed 40、Discovered-currently-not-indexed 136，历史 5xx 两例仍为 Started。
- GSC 中 Network 245、Smarthome 258、Homeoffice 275、Baby 264、Pets 234、Style 76、Costumes 121 个 URL 的 sitemap 全部为 Success；未重复提交。
- Manual actions：No issues detected。
- Security issues：No issues detected。
- Removals：过去六个月没有提交请求。
- 未批量 Request indexing，未重放 48 个已接受的 IndexNow canonical。

## 零展现 URL Inspection

- 精确队列：486；累计已检查 458；indexed 442；not-on-Google 16；未检查 28。
- 按计划首先尝试 `https://smarthome.madabase.com/best/aqara-t1-vs-yolink-bulldog-vs-moen-flo` 的 detail recheck，GSC 立即返回 property quota exceeded。今天没有任何 URL 获得新的 inspection 结果，不能把额度尝试写成已检查。
- 三个 Smarthome summary detail recheck 仍未完成，之后的 28 个未检查 URL 也未启动；8 月 25 日证据继续作为当前权威状态。
- 今日尝试记录：`apps/affiliate/reports/url-inspection-results-2026-08-26.json`。
- 账本延续：`docs/affiliate-zero-impression-inspections-2026-08-26.csv` / `.json`；下一次额度闸门为 2026-08-27。

## 生产与技术健康

- 七个首页、robots.txt、sitemap 均返回 HTTP 200；robots 均声明正确 sitemap。
- 生产 sitemap 数量精确命中 245 / 258 / 275 / 264 / 234 / 76 / 121。
- 16 个已知 not-on-Google URL 全部可达：14 个当前 live target 为 HTTP 200、自 canonical、无 noindex；另外两个是已治理的永久重定向来源，分别指向 Costume mascot buying guide 与 Network USB Wi-Fi buying guide。
- 没有发现需要修改运行时代码、canonical、robots 或 sitemap 的新故障。Release `22f2985` 继续作为恢复基线；今天不构建、不部署、不清 CDN。

## 转化与联盟收入

### Clarity（Yesterday）

- 11 个人类会话，另排除 47 个机器人会话；10 个唯一用户。
- 1.09 页 / 会话；平均滚动 26.50%；平均活跃 19 秒，总时间 48 秒。
- 0 快速后退、0 强烈点击、0 过度滚动；3 个无效点击会话（27.27%）。
- 1 个 outbound-click 会话、1 个 `affiliate_click` 会话；0 JavaScript 错误。
- Google 可见 2 个引荐会话；流量仍薄，不把单日行为比例外推为站点级结论。

### Amazon Associates（Last 30 Days，2026-07-27 至 2026-08-25）

- Last Updated：2026-08-25 00:00。
- 37 clicks、21 ordered items、56.76% conversion、$264.42 ordered revenue。
- 21 shipped items、1 returned item、$257.43 total revenue、$6.51 earnings。
- 相比前次读取仅新增 1 click，订单、收入和 earnings 未变；没有证据表明 8 月 23 日 SEO 发布造成转化故障。

### CJ（Yesterday）

- 仪表板：123 clicks、0 sales、0 leads、$0 commission、$0 EPC、0% conversion。
- 8 月 25 日 Links / Clicks 明细中，单一 Abracadabra NYC 链接 `Shopify Feed via ExportFeed`（AID `17278691`）占 84 clicks。
- 代码与运营计划确认该 AID 只用于 Costumes 的 `/go/cj/{clickToken}` 路径；但 Clarity 只有 11 个人类会话并排除 47 个机器人会话，Costumes 的 GSC 24 小时仅 1 展现，因此 CJ 总点击不能解释为真人 CTA 点击。
- CJ Insights 不允许把 Clicks 与 Situation ID 组合，当前本机数据库也不是生产 AffiliateClick schema，今天无法完成 SID/生产跳转日志闭环。结论保持为机器人、预取或直接追踪 URL 抓取异常；在取得服务器跳转记录前不依据 CJ 123 改 CTA。

### 联盟链接

- `check:affiliate-links`：306 / 306 passed，0 failed；8 个已知漂移/不可用 Amazon offer 继续被抑制。

## 今日主动作与冻结决策

主动作：完成包含 8 月 24 日的正式七站冻结复评，并把 CJ 异常拆到具体 Abracadabra 链接。

冻结继续生效：

- Network、Smarthome、Pets 保持 recovery；Homeoffice、Baby 保持 protect；Style maintenance；Costumes observe。
- 禁止新增产品公开索引、扩大索引 cohort、自动扩 sitemap、重放 IndexNow、无查询证据的批量标题/正文改写。
- 允许生产故障、索引技术、商家安全、测量修复，以及基于精确页面查询证据的既有页小修。
- 三个完整观察日是“允许作出复评”的必要条件，不是自动解冻条件。当前完整数据明确给出 hold-no-expansion。

## 本地验证

- `check:search-recovery`：passed；7 站冻结 active，next product pages ready for sitemap = 0。
- `check:seo`：passed；964 guides、175 products、77 roundups、7 tools。
- `check:affiliate-links`：306 / 306 passed。
- `check:next-product-expansion`：passed；130 seeds 保持 sitemap/discovery excluded，submission disabled。
- `lint`：使用项目 Node 20 后 passed。
- `check:conversion-paths` 需要本地 3020 审计服务；今天没有运行时改动且该服务未启动，因此不把其连接失败记作站点失败。生产七站入口、16 个索引例外、306 条联盟链接和实时行为/联盟报表已完成独立复核。

## 外部分发与未做项

- 今日 Pinterest、Reddit、Quora 外部分发已由独立工作流完成并留下单独报告；本次日常运营未重复发布，也未修改或纳入该工作流的未提交文件。
- Bing：not-due。
- Soft151：下一闸门为 2026-08-27，今天不提前重提或重写。
- 五个产品 pilot：继续 direct-URL、sitemap/discovery excluded，不执行搜索推广。

## 明日第一步

1. 完整执行 Soft151 原始 Day 14 / 入 sitemap 后 Day 7 的 151-URL 精确闸门，并同时检查 Ranking118；不能只采样赢家。
2. URL Inspection 配额恢复后，先完成三个 Smarthome detail recheck，再检查剩余 28 个精确 URL；如额度仍未恢复，如实延续 blocker。
3. 重新读取最近 24 小时及最新完整七日；保持 Network/Smarthome/Pets 恢复态，除非精确 URL 与查询证据支持局部修复。
4. 如能取得生产 `/go/cj` 记录，再按时间、link/SID、UA/IP 聚合核对 CJ 84/123 异常；在此之前不改 CTA。

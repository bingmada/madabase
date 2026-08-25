# Madabase 联盟站日常运营记录 — 2026-08-25

状态：complete（今日 GSC URL Inspection 配额已用尽；剩余 28 个精确 URL 延续到 8 月 26 日）

## 今日结论

本次下跌仍不是生产宕机、人工处罚、安全问题或组合级大面积掉索引。最近完整七日（8 月 17–23 日）相对前七日的点击从 34 降至 8（-76.5%），展现从 5,486 降至 2,395（-56.3%），平均排名从 31.5 变差到 35.8；损失主要集中在 Network、Smarthome 和 Pets。与此同时，最近 28 日仍为 78 点击 / 13.3K 展现，对比前 28 日的 33 / 6.68K 明显增长，且今天累计检查的 486 个零展现 URL 中已有 442 个确认在 Google。因此，当前故障模型是更新前后发生的近期排名与曝光收缩，而不是长期站点级惩罚或技术性反索引。

8 月 23 日是第二个完整的更新后观察日；冻结解除所需的 8 月 22、23、24 三天目前满足 2/3。8 月 23 日部署的主题层级、合并和四个查询支持刷新尚未进入完整 GSC 评估窗口，今天不再叠加大范围页面改动。

## Search Console

### 最近 24 小时（滚动窗口，方向性）

- 1 点击、174 展现、0.6% CTR、平均排名 32.5；最后更新约 4.5 小时前。
- 唯一点击页面：`https://homeoffice.madabase.com/best/logitech-litra-glow-vs-elgato-key-light-neo`（1 点击 / 2 展现）。
- 主要无点击曝光仍来自 Homeoffice：CalDigit TS4 16、small-space standing desks 11、monochrome laser printers 11、standing-desk height 11、DP Alt Mode / DisplayLink 8；Baby 的 Chicco sterilizer 8。
- 昨日运营读取为 0 / 228，但两个滚动窗口的边界不同，只记录方向，不据此评价 8 月 23 日发布。

### 最近完整七日：2026-08-17 至 2026-08-23 vs 2026-08-10 至 2026-08-16

| 站点 | 点击 | 展现 | CTR | 平均排名 | 判断 |
| --- | ---: | ---: | ---: | ---: | --- |
| 全域 | 8 vs 34 | 2,395 vs 5,486 | 0.3% vs 0.6% | 35.8 vs 31.5 | 点击 -76.5%，展现 -56.3% |
| Network | 5 vs 13 | 274 vs 1,540 | 1.8% vs 0.8% | 27.2 vs 26.1 | 曝光断崖最明显之一，但 BE63/BE67 仍有点击 |
| Smarthome | 0 vs 7 | 210 vs 1,341 | 0% vs 0.5% | 31.2 vs 25.1 | 最弱，曝光与排名同步恶化 |
| Homeoffice | 1 vs 4 | 1,152 vs 1,251 | 0.1% vs 0.3% | 43.4 vs 39.8 | 展现大体守住，点击效率与排名变差 |
| Baby | 1 vs 6 | 655 vs 820 | 0.2% vs 0.7% | 22.5 vs 24.4 | 排名均值改善，但点击和展现下降 |
| Pets | 1 vs 3 | 82 vs 460 | 1.2% vs 0.7% | 22.6 vs 24.9 | 展现断崖，少量查询排名均值改善 |
| Style | 0 vs 0 | 3 vs 18 | 0% vs 0% | 8.7 vs 31.8 | 样本太小，不定性 |
| Costume | 0 vs 0 | 9 vs 25 | 0% vs 0% | 36.3 vs 25.0 | 样本太小，继续观察 |

站点 Page 过滤后的合计会因 GSC 隐私阈值与部分结果省略而略低于全域总数。

### 28 日背景

- 最近 28 日：78 点击、13.3K 展现、0.6% CTR、平均排名 30.1。
- 前 28 日：33 点击、6.68K 展现、0.5% CTR、平均排名 30.9。
- 长窗口仍增长，说明当前是近期收缩而非整个域名持续性失去搜索资格；但七日跌幅足够大，冻结必须继续。

### 索引、站点地图与处置

- Page indexing 仍最后更新于 8 月 21 日：1,586 indexed、4,267 not indexed；其中 3,514 是受控 noindex，历史 5xx 两例验证状态仍为 Started。
- GSC 中 Network 245、Smarthome 258、Homeoffice 275、Baby 264、Pets 234、Style 76、Costumes 121 个 URL 的 sitemap 均为 Success。8 月 24 日提交的四个 sitemap 均已成功读取；今天未重复提交。
- Manual actions：No issues detected。
- Security issues：No issues detected。
- Removals：过去六个月没有请求。
- 未批量 Request indexing，未重放 IndexNow。

## 零展现 URL Inspection

- 精确队列：486。
- 累计已检查：458；indexed 442；not-on-Google 16；剩余 28 因今日配额暂停。
- 今日对昨天剩余的 125 个新增完成 97 个：94 indexed、3 not-on-Google。
- 今日先完成四个既有 HTTP 200 / self-canonical 例外的详细原因：
  - Network USB Wi-Fi buying guide：Crawled - currently not indexed；最后抓取 8 月 9 日；抓取成功、允许索引、自 canonical。
  - Network TRENDnet TEG-S350：Discovered - currently not indexed；sitemap 已识别，但尚未抓取。
  - Network TRENDnet TEG-S380：URL is unknown to Google；旧检查未识别 sitemap；当前生产 sitemap 已包含该 URL 且 GSC sitemap 为 Success。
  - Pets automatic aquarium feeders：Crawled - currently not indexed；最后抓取 8 月 10 日；抓取成功、允许索引、自 canonical。
- 今日新出现的三个 not-on-Google summary：Aqara T1/Yolink/Moen Flo 对比、best smart water shutoff valves、smart blind motors ownership。三页当前生产均为 HTTP 200、自 canonical、无 noindex、在 Smarthome sitemap；详细原因排到 8 月 26 日配额刷新后优先检查。
- 结果文件：`apps/affiliate/reports/url-inspection-results-2026-08-25.json`。
- 完整账本：`docs/affiliate-zero-impression-inspections-2026-08-25.csv` / `.json`。

## 生产与技术健康

- 七个首页均为 HTTP 200。
- 七个 robots.txt 均可用并声明对应 sitemap。
- 生产 sitemap 数量精确命中：245 / 258 / 275 / 264 / 234 / 76 / 121。
- 四个详细例外和三个今日新增例外共七页全部为 HTTP 200、自 canonical、无 noindex、存在于正确 sitemap。
- 未发现需要修改运行时代码的技术故障；release `22f2985` 继续作为观察基线，未构建、未部署、未清 CDN。

## 转化与联盟收入

### Clarity（Yesterday）

- 19 会话，另排除 9 个机器人会话；18 个唯一用户。
- 1.68 页 / 会话；平均滚动 38.22%；平均活跃 18 秒，总时间 22 秒。
- 快速后退 1 个会话（5.26%）；强烈点击、无效点击、过度滚动均为 0。
- 0 JavaScript 错误；智能事件无数据。
- 热门页：Baby 首页 7 个会话；Network Deco BE63/BE67/BE85 guide 2 个会话。
- 可见引用来源包括 Google 2、ChatGPT 1、DuckDuckGo 1、Bing 1。

### Amazon Associates（Last 30 Days，2026-07-26 至 2026-08-24）

- Last Updated：2026-08-24 00:00。
- 36 clicks、21 ordered items、58.33% conversion、$264.42 ordered revenue。
- 21 shipped items、1 returned item、$257.43 total revenue、$6.51 earnings。
- 与前次读取相比，点击 +1，但滚动窗口移除旧成交并新增一件退货；因此 shipped revenue 与 earnings 下降不能简单归因于今天页面表现。

### CJ（Yesterday）

- $0 commission、0 sales、0 leads、129 clicks、$0 EPC、0% conversion。
- 129 个 CJ 点击明显高于 Clarity 的 19 个人类会话，且没有转化；先标记为口径/机器人/预取异常。若 8 月 26 日仍持续，按 PID/SID 与服务器跳转日志拆分，不依据该总点击数改 CTA。

### 联盟链接

- `check:affiliate-links`：306 / 306 passed，0 failed。

## 今日主动作与变更决策

主动作：完成四个索引例外的详细诊断，并将精确零展现 URL 检查从 361/486 推进到 458/486，直至配额耗尽。

没有页面 SEO 大改。原因是当前全部技术入口健康、442/458 已检查零展现 URL 仍被收录、四个详细例外没有 robots/fetch/canonical 故障，而且 8 月 23 日的结构修复尚未进入完整数据窗口。此时继续大改会破坏即将完成的三日观察基线。

## 本地验证

- `check:search-recovery`：passed；7 站冻结 active，next product pages ready for sitemap = 0。
- `check:seo`：passed；964 guides、175 products、77 roundups、7 tools。
- `check:affiliate-links`：306 / 306 passed。
- `check:next-product-expansion`：passed；130 seeds 保持 sitemap/discovery excluded，submission disabled。
- `lint`：passed。
- 只有运营记录与检查结果发生变化，因此按清单不运行 build、不部署。

## 未做及原因

- Bing：not-due。
- 外部分发：not-due；用户未要求“外部分发”，无到期发布任务。
- 新产品与产品 pilot 搜索推广：blocked by recovery freeze。
- Soft151：not-due，下一闸门 2026-08-27。
- 大范围页面 SEO 改写：blocked by observation control；没有已确认技术或商家故障。

## 明日第一步

1. 配额刷新后先检查今天新增的三个 Smarthome not-on-Google URL 的详细原因，再续查剩余 28 个精确 URL。
2. 读取包含 8 月 24 日的完整 GSC 数据；若 8 月 22、23、24 三天已完整，则执行七站冻结正式复评，而不是自动解冻。
3. 复核 CJ Yesterday；若点击仍远高于人类会话且零转化，按 PID/SID 和跳转日志诊断口径。
4. 保持 release `22f2985`、五个产品 pilot 隔离状态、48 个 IndexNow canonical 和已成功读取 sitemap 不变。

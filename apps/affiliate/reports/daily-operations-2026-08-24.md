# Madabase 联盟站日常运营记录：2026-08-24

状态：`completed-with-external-quota-blocker`。8 月 24 日到期的五产品直达页复核已完成；GSC 零展现队列续跑至当天额度用尽；四个确实变更且尚未被 Google 重读的 sitemap 已精确重提。新增可索引扩张仍冻结，没有批量请求索引、重复 IndexNow、外部分发或新页面发布。

## 今日主动作

完成到期的索引与产品 pilot 闸门，并处理 GSC 中可以安全关闭的技术陈旧信号：

- 新检查 101 个精确零展现 URL：96 indexed、5 not-on-Google、0 errors；累计 361/486，剩余 125 个等待 8 月 25 日额度刷新。
- 五个 direct-URL 产品 pilot 全部通过 HTTP、canonical、exact ASIN、site tracking ID、主 CTA、sticky CTA、WebP 图片和 discovery/sitemap 隔离复核。
- Network、Smarthome、Homeoffice、Pets 四个成员已改变但 GSC 仍显示旧读取结果的 sitemap 均提交成功；Costumes 今天已自动重读为正确的 121 条，因此没有重复提交。
- GSC 两个历史 5xx 示例现在分别为有意下线的 HTTP 410 和正常 HTTP 308；已于 8 月 24 日启动修复验证。

没有发现需要再次改版或部署的生产故障。今天不对 Network/Smarthome 做第二轮大面积标题、正文、canonical 或重定向修改，等待昨日恢复发布被 Google 重新抓取后的完整窗口。

## Search Console

最新 24 小时滚动窗口（最后更新约 5 小时前）：0 clicks、228 impressions、CTR 0%、平均排名 34.4。8 月 23 日同一次运营读取为 202 impressions；滚动窗口增加 26 impressions 只能作为方向信号，不能据此宣称恢复。

| 站点 | 最近 24 小时 clicks | impressions | 平均排名 |
| --- | ---: | ---: | ---: |
| Network | 0 | 8 | 46.8 |
| Smarthome | 0 | 1 | 68.0 |
| Homeoffice | 0 | 145 | 40.0 |
| Baby | 0 | 71 | 19.8 |
| Pets | 0 | 0 | 无数据 |
| Style | 0 | 0 | 无数据 |
| Costume | 0 | 0 | 无数据 |
| 主站 `madabase.com` | 0 | 3 | 66.7 |

最近完整七天为 2026-08-15 至 08-21，对比 08-08 至 08-14：19 vs 27 clicks、3,390 vs 4,908 impressions、CTR 0.6% vs 0.6%、平均排名 35.2 vs 28.9。

| 站点 | Clicks | Impressions | CTR | 平均排名 | 判断 |
| --- | ---: | ---: | ---: | ---: | --- |
| Network | 8 vs 12 | 642 vs 1,453 | 1.2% vs 0.8% | 26.0 vs 24.8 | 展现仍明显偏低；CTR 尚可，继续 recovery |
| Smarthome | 0 vs 7 | 547 vs 1,197 | 0% vs 0.6% | 28.8 vs 23.1 | 当前最弱站点，继续 recovery |
| Homeoffice | 3 vs 3 | 1,175 vs 1,132 | 0.3% vs 0.3% | 43.4 vs 37.9 | 曝光横盘，保护基线 |
| Baby | 5 vs 3 | 740 vs 736 | 0.7% vs 0.4% | 25.1 vs 22.2 | 点击和 CTR 改善，保护基线 |
| Pets | 3 vs 1 | 215 vs 390 | 1.4% vs 0.3% | 25.0 vs 22.6 | 曝光下降但点击效率改善 |
| Style | 0 vs 0 | 8 vs 18 | 0% | 37.9 vs 22.0 | 样本过小，maintenance |
| Costume | 0 vs 0 | 14 vs 23 | 0% | 35.4 vs 23.1 | 样本过小，observe |

GSC 最新完整日只到 8 月 21 日。解冻规则要求完整包含 8 月 22、23、24 三个更新后数据日，当前满足 0/3，因此七站新增可索引扩张继续冻结。

### 索引、安全和 sitemap

- Page indexing 最后更新 2026-08-21：1,586 indexed、4,267 not indexed；未收录中 3,514 为已知 noindex 路由，另有 364 个 404、103 个 redirect、40 个 crawled-currently-not-indexed、136 个 discovered-currently-not-indexed、33 个 duplicate-without-user-canonical 和 2 个历史 5xx。
- 两个 5xx 示例：`madabase.com/zh/tests/mbti/seo/alike/intp-famous-people` 当前 HTTP 410；`tools.madabase.com/tools/html-encoder` 当前 HTTP 308。GSC validation 状态已变为 `Started: 8/24/26`。
- 四个 sitemap 提交均出现 `Sitemap submitted successfully`：Network、Smarthome、Homeoffice、Pets。Costumes 已于今天自动读取且显示 Success/121；Baby 与 Style 未变，不提交。
- Manual actions：`No issues detected`。
- Security issues：`No issues detected`。
- Removals：最近六个月没有请求。

## 零展现 URL Inspection

精确队列仍为 Expansion757 与 Ranking118 的 486 URL 并集：

- 累计 live-inspected：361
- indexed：348
- not-on-Google：13
- 今日新增：101（96 indexed、5 not-on-Google）
- 剩余：125，Google 当日 property quota 已用尽
- 下一闸门：2026-08-25 配额刷新后继续

今天新出现的 5 个 not-on-Google URL：

1. `https://network.madabase.com/guides/usb-wifi-adapters-buying-guide`
2. `https://network.madabase.com/guides/usb-wifi-adapters-compatibility-and-fit-guide`
3. `https://network.madabase.com/reviews/trendnet-teg-s350-2-5g-switch`
4. `https://network.madabase.com/reviews/trendnet-teg-s380-2-5g-switch`
5. `https://pets.madabase.com/guides/automatic-aquarium-feeders-vs-alternatives`

生产复核显示第 2 条是昨日合并后预期的 HTTP 308，指向第 1 条 buying guide；其余四条均为 HTTP 200、自指 canonical、无 noindex。额度已经用尽，明天优先读取这四条的详细原因；今天不批量请求索引或臆测未收录原因。

精确 ledger：`docs/affiliate-zero-impression-inspections-2026-08-24.json`；原始结果：`apps/affiliate/reports/url-inspection-results-2026-08-24.json`。

## 五产品 pilot

五页均通过公开复核：

- Network：TRENDnet TEG-S750，B09M7KSZB2 / `madanetwork-20`
- Smarthome：Tapo S505D，B0C2B8SP3W / `madasmart-20`
- Homeoffice：Satechi ST-ADVSM，B09WY2RLQG / `madaoffice-20`
- Baby：Medela Harmony，B0C2YYKKZF / `madababy-20`
- Pets：SureFeed Microchip Pet Feeder，B00O0UIPTY / `madapets-20`

每页 HTTP 200、自 canonical、exact ASIN 与 tracking ID、主购买 CTA、sticky commerce 和原图均正常；五页继续不在 sitemap、首页或分类页中。技术闸门通过不等于搜索推广闸门通过，恢复冻结期间不加入发现面、IndexNow 或 GSC。

## 转化与收入

### Clarity（Yesterday）

- 4 sessions，38 bot sessions excluded，4 unique users
- 1.25 pages/session，17% average scroll，6 seconds average active time
- quick back：1 session；rage click、dead click、excessive scroll 均为 0
- JavaScript errors：0
- 智能事件卡为 no-data，页面中没有可读的 `affiliate_click` 或 outbound-click 计数；不把缺失事件显示写成已证明的零点击
- 主要入口：Smarthome Eufy E340 vs Ring 页面 3 sessions；Homeoffice sheetfed scanner fit guide 和 Eufy E340 review 各 1 session

### Amazon Associates

报表最后更新：2026-08-22 00:00；当前可读窗口为 2026-07-24 至 08-22（Last 30 Days）：

- 35 clicks、21 ordered items、60.00% conversion
- $264.42 ordered revenue、23 shipped items、0 returns
- $374.40 shipped revenue、$11.08 total earnings、$0 bounty

报表仍落后当前日期两天；不把 8 月 23-24 日的缺口解释为零收入。低量 tracking-ID 表可能隐藏数据，不能用单个可见 tag 的行替代总盘。

### CJ

仍被重定向到登录页，记录为 `blocked-auth`，不是 0 clicks / 0 sales。未触碰账号密码、税务、银行或付款设置。

## 生产与本地验证

- 七个首页、七个 `sitemap.xml`、七个 `robots.txt` 全部 HTTP 200；robots 均声明正确 sitemap。
- 生产 sitemap 精确 URL 数与 release 22f2985 快照一致：Network 245、Smarthome 258、Homeoffice 275、Baby 264、Pets 234、Style 76、Costumes 121。
- `check:search-recovery`：passed；freeze active，1,026-row ledger 完整。
- `check:seo`：passed；964 guides、175 products、77 roundups、7 tools。
- `check:affiliate-links`：306/306 passed；8 个已知漂移或不可用 offer 继续被抑制。
- `check:next-product-expansion`：passed；130 seeds 仍为 research-planning，0 pages ready for sitemap。
- `lint`：passed。
- `record-zero-impression-inspections.mjs` 增加 `--source-report-date`，允许第二天继续使用原始精确 cohort、同时生成当天 ledger；语法检查通过。

运行时代码、依赖和路由没有变化，因此没有重新 build、部署或 Cloudflare purge。生产仍为 release `22f2985`，rollback `eba7ed0` 保留。

## 渠道状态与下一步

- Bing：`not-due`
- Pinterest / Reddit / Quora / 论坛：`not-due`；没有“外部分发”请求
- IndexNow：`not-due`；昨天 48 个真实变更 canonical 已成功提交，今天不重放
- CJ：`blocked-auth`
- GSC URL Inspection：`blocked-daily-quota`，剩余 125

明日第一步：配额刷新后先查看今天四个仍为 HTTP 200、自 canonical 的 not-on-Google URL 的详细原因，再续跑剩余 125 个精确 URL，直到队列完成或再次遇到配额。继续观察四个 sitemap 的 GSC 读取结果；只有 GSC 完整包含 8 月 22、23、24 后才重新评估冻结。

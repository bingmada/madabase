# Affiliate Daily Operations — 2026-08-21

状态：`partial_external_quota`。今日所有可安全完成的固定检查已经完成；唯一未完成项是 GSC URL Inspection 的剩余 207 个精确 URL，原因是当日 property quota 已耗尽，下一次检查为 2026-08-22。

## 今日判断与主动作

七个站点继续保持恢复冻结，不做批量标题、正文、canonical、重定向或新页面扩张。今天的主动作是恢复 410 个到期零展现 URL 的精确检查，并修正检查脚本把下一配额日期错误地按旧 report date 计算的问题。修复后，ledger 会按实际 `quotaCheckedAt` 计算次日，避免队列再次被排到过去。

## 渠道状态

| 项目 | 状态 | 今日结果 |
| --- | --- | --- |
| Search Console | `checked` | 最新 24h：0 clicks、228 impressions、0% CTR、position 44.5；前 24h：1、290、0.3%、35.1。最近 7d 对比前 7d：30 vs 23 clicks，4,999 vs 3,691 impressions，CTR 均 0.6%，position 33.7 vs 24.3。短窗继续转弱，但完整 7 日聚合仍增长；不据单日数据做大改。 |
| 七站 7d | `checked` | Network 10/1,253 vs 15/1,278；Smarthome 4/1,097 vs 4/832；Homeoffice 5/约1,266 vs 1/804；Baby 7/831 vs 3/556；Pets 3/440 vs 0/247；Style 0/16 vs 0/20；Costume 0/30 vs 1/25。格式均为 clicks/impressions。 |
| 零展现 URL Inspection | `blocked` | 精确队列 410；当前累计检查 203，其中 198 indexed、5 not on Google；剩余 207 因当日 quota 阻塞。52 个有完整详情，151 个只有 summary。下一次 2026-08-22。 |
| Clarity Yesterday | `checked` | 50 sessions，56 excluded bot sessions，1 page/session，9.72% average scroll，11s active time，0 rage/dead/excessive-scroll/quick-back sessions，0 JS errors，1 outbound-click session，1 `affiliate_click` session。主要入口包括 Network 首页 3 sessions。 |
| Amazon Associates | `checked` | Dashboard last updated 2026-08-19。本月累计 19 clicks、19 ordered items、18 shipped items、100% conversion、$5.84 earnings；滚动 30 日 total commissions $16.74。保留报告延迟说明。 |
| CJ Yesterday | `checked` | 20 clicks、0 sales、0 leads、$0 commission。与 Clarity 的站内联盟点击口径明显不一致，暂记测量/来源口径异常，不由此改页面。 |
| Affiliate links | `checked` | 306/306 passed；8 个已知漂移或不可用 offer 继续被抑制。 |
| Production | `checked` | Network、Smarthome、Homeoffice、Baby、Pets、Style、Costume 的首页和 sitemap 共 14 个入口全部 HTTP 200。生产仍以 immutable release `eba7ed0` 为基线；今日未部署、未 purge、未提交 sitemap/IndexNow。 |
| Search recovery gate | `checked` | Freeze active，七站状态保持 Network/Smarthome/Pets recovery，Homeoffice/Baby protect，Style maintenance，Costume observe；1,026-row ledger 有效，next-product 仍是 research-planning，sitemap-ready 0。 |
| Bing Webmaster | `not-due` | 无新 sitemap、IndexNow 错误或专门 Bing gate，不重复检查/提交。 |
| 外部分发 | `not-due` | 普通日常运营不发布 Pinterest、Reddit、Quora 或论坛内容。 |
| Amazon Creators API | `unchanged` | 资格与正式 scheduler 状态无变化；继续使用已验证静态 offer fallback，不从页面请求或爬虫触发 API。 |

## URL Inspection 结果

当前 ledger：`docs/affiliate-zero-impression-inspections-2026-08-20.csv`。本次原始结果：`apps/affiliate/reports/url-inspection-results-2026-08-21.json`。

五个 `not on Google` URL：

- `https://costumes.madabase.com/guides/mascot-costumes-vs-alternatives`，已知状态为 Crawled - currently not indexed。
- `https://homeoffice.madabase.com/guides/desktop-audio-interfaces-ownership-cost-and-maintenance`
- `https://homeoffice.madabase.com/guides/wireless-number-pads-vs-alternatives`
- `https://homeoffice.madabase.com/guides/xlr-office-microphones-buying-guide`
- `https://network.madabase.com/guides/home-network-racks-buying-guide`

后四个在 quota 耗尽前只取得 summary，详细原因未知；不得推断为 crawled/discovered/duplicate，也不得据此请求索引。

## 本地验证

- `check:affiliate-links`: 306/306 passed。
- `check:seo`: passed；964 guides、175 products、77 roundups、7 tools、4,692 automatic market routes、32 index-qualified market URLs。
- `check:search-recovery`: passed；freeze active，7 sites，1,026 ledger rows。
- `check:next-product-expansion`: passed；130 research seeds，0 sitemap-ready，discovery/index submission disabled。
- `record-zero-impression-inspections.mjs`: next gate 修正为按实际 quota check 时间计算，重新生成后得到 2026-08-22。
- `lint`: passed。

## 未做及原因

- 未检查剩余 207 个精确 URL：GSC property 当日 quota 用尽。
- 未请求索引、重提 sitemap、发送 IndexNow、改动页面或发布新内容：没有新的技术/商家缺陷证据，且 spam update 恢复冻结生效。
- 未做新的 optimized build：今日实现只影响运营记录脚本，不影响生产运行时代码；以 lint 和脚本实跑作为比例验证。

## 下一步

2026-08-22 第一优先级是从当前 ledger 继续剩余 207 个 URL Inspection，并合并结果；如果再次触发 quota，保留精确剩余队列到下一天。2026-08-23 按完整 757-URL 清单执行 Expansion757 Day-14 gate。

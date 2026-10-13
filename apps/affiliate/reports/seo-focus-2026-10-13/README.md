# October 13 focused SEO recovery

本轮已完成并上线 **七站 14 个现有页面的逐项修改**。2026 年 10 月 13 日 13:42:38（北京时间）切换完成；主站在约 7 秒维护窗口后恢复，两个服务均正常运行、重启次数为零。

| 站点 | 本轮页面 | 分别解决的问题 |
| --- | ---: | --- |
| Homeoffice | 6 | 桌面宽度计算、夹具厚度/结构、会议灯供电亮度、便携屏视频路径、Mac 芯片支持、扩展坞/显示器 Hub 选择 |
| Network | 2 | PCIe 插槽与蓝牙接线、DAC 两端支持与光纤选择；两组重叠主题合并 |
| Baby | 1 | Omni Breeze 不同姿势的体重、身高与发育条件 |
| Smarthome | 1 | FP300 协议切换、控制器成本、电池估计条件与自动化验收 |
| Pets | 1 | 喂食器可清洗部件、电子部件禁水与重装核查 |
| Style | 1 | 包袋开口/内部尺寸、外部包络体积与真实容量的区别 |
| Costume | 2 | 动态道具的空间/供电/存放，以及按处理和运输时间倒排下单日期 |

其他主题没有被忽略：完整清单覆盖 38 个站点/分类组和合并后 1,125 个基础网址，分别标记本轮修改、近期保护观察或后续审查队列。当前没有把所有页面声明为已经重写。3 组重叠主题已减少 9 个独立网址，旧网址永久跳转。

本轮 14 页全部通过 390px 验收；修改页面、地区跳转、站点地图及上一轮 17 个入口和全部旧跳转均通过本地检查。用户回复“允许”后执行主站短暂维护，保持原有容量门槛、自动回滚与恢复定时器。源站 14 页、33 个跳转、7 份站点地图全部通过；公网 76 项检查全部通过。首次有 5 个响应仍处于旧内容缓存更新状态，正常网址复查已全部更新，无需清空全站缓存。旧发布目录保留用于回滚。

Status: deployed and publicly verified. Owner authorized the Main-only pause; Main restored at 13:42:39 +0800 after a seven-second window.

This round covers seven sites and 14 existing canonical pages individually: Homeoffice 6, Network 2, Baby 1, Smarthome 1, Pets 1, Style 1, Costume 2. No new route or subdomain. Three four-page families consolidate to their indexed comparison canonicals, with nine base permanent redirects and 24 Network locale redirects. Useful selection, fit, installation and maintenance checks are preserved in authored sections, without appending old template text.

`all-page-actions.csv` covers all 1,125 remaining base canonicals; `theme-actions.csv` records every site/category decision. Unchanged pages remain protected or queued; they have not been declared individually rewritten. The full 17-page October 6 cohort passed runtime regression without another broad rewrite.

GSC evidence ends October 10 for complete 7-/28-day windows. The rolling 24h all-domain headline is 5 versus 7 impressions and zero clicks; complete 7d is 62 versus 436 impressions, zero versus three clicks. These are all-domain context, including Main/Tools; qualified affiliate page rows are separate in the review report. Page-filtered headline and exported page rows can differ and are not added together. Query privacy suppression is not evidence of no demand. No exact-query position is inferred from page average.

The current-only normalized 28d CSV selects Last 28 days columns and excludes zero-current-impression rows. There are 312 exposed and 813 unexposed base canonicals after the nine consolidations. These measurements predate this release and do not demonstrate recovery from today's changes. Fifteen of sixteen inspected zero-exposure URLs are indexed; PCIe buying is crawled-currently-not-indexed and redirects to the indexed comparison. No indexing request has been made.

Every page has an individual source-backed decision, with thirteen authored guide/roundup tables and model-specific FP300 sections. Titles and commerce identities are preserved. One answer and an early table replace redundant guide modules. All fourteen pages passed 390px overflow checks. Local acceptance passed 28 raw-head responses, 33 base/locale redirects and seven sitemaps, plus the prior 17 canonicals, 64 locales, 55 base redirects, 220 locale redirects and seven sitemaps. No hands-on or new Review schema claim. See `quality-review.json`.

Built off-server with Node 20.20.0: archive 60,930,332 bytes, SHA-256 c64977b6e847df3b0bf810e643fef68fbc9185211d8630cecf42e4a50403b60e. `release-base.py` and `deploy.py` use dedicated rollback state and watchdog paths with unchanged capacity gates. The actual post-stop capacity passed at 760.535 MiB against the 704 MiB requirement. No parallel candidate ran on the production server.

Review the complete changed batch on October 20, October 27 and November 12. Retain the previous cohort's October 20/November 5 gates. Use 24h for anomalies with delay labels and complete 7d/28d evidence for tactical/portfolio decisions. No IndexNow or Request Indexing submission.

Immutable runtime commit 3ddb75d66d84ebf9b89b7eb026dfb1e4d8baaada is active at `/srv/madabase-affiliate/releases/focus-20261013-3ddb75d66d84ebf9b89b7eb026dfb1e4d8baaada`; 31 old static assets retained. Both Affiliate and Main were confirmed active/running with zero restarts. Public normal-URL acceptance passed 28 browser/Googlebot canonical responses, 33 permanent redirects, seven sitemaps, seven robots files and Main health. See `deployment.json` and `public-probe.json`. These checks establish successful delivery, not improved GSC rankings.

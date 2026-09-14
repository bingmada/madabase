# Affiliate daily operations — 2026-09-14

## 今日结论

- GSC 最近 24 小时为 **0 点击、121 展现、CTR 0%、平均排名 17.4**，前一 24 小时为 **0 点击、229 展现、CTR 0%、平均排名 15.8**。展现下降 47.2%，属于需要核查的短窗异常，但 GSC 最后更新时间落后约 9 小时，且最近完整七日没有同步出现断崖。
- 完整 9 月 7–13 日相对前七日为 **6 vs 4 点击、1,482 vs 1,539 展现、0.4% vs 0.3% CTR、17.6 vs 28.3 平均排名**。展现只下降约 3.7%，点击增加 50%，平均排名提升 10.7 位；当前是覆盖面仍弱但存活排名明显变强，不是新的全站技术崩塌。
- 最近 28 日相对前 28 日为 **37 vs 78 点击、8,100 vs 12,709 展现、0.5% vs 0.6% CTR、30.8 vs 27.9 平均排名**。长窗仍反映八月更新后的历史损失，尤其是 Network、Smarthome 和 Pets；不能用它否定最近七日的回升，也不能据此重置正在观察的页面。
- 今日正式完成 indexed-zero 40 Day-7：**6 页获得 12 展现，全部平均排名前十；34 页仍零展现，但 34/34 逐页 URL Inspection 均为 `URL is on Google / Page is indexed`**。40/40 公网页面与 40/40 Sitemap 条目通过，无技术、canonical 或 indexability 缺陷。
- 今日不改正文、标题、canonical、路由或重定向，也不发布、不重提 Sitemap/IndexNow。保护 6 个赢家；其余 34 页锁定至 9 月 21 日 Day-14，届时只按精确需求、意图错配或合并证据处理。

## Search Console

### 最近 24 小时

| 窗口 | 点击 | 展现 | CTR | 平均排名 |
| --- | ---: | ---: | ---: | ---: |
| 最近 24 小时 | 0 | 121 | 0% | 17.4 |
| 前 24 小时 | 0 | 229 | 0% | 15.8 |

页面维度显示短窗损失主要来自 Homeoffice 与 Baby。Branch Ergonomic Chair 为 36 vs 59 展现，ErGear/FlexiSpot 为 6 vs 10；前者属于 9 月 11 日 CTR cohort，后者的第二次 snippet 测试才于 9 月 13 日上线且 GSC 仍有约 9 小时延迟，二者均不提前重改。

### 完整七日

以下为页面维度按 hostname 汇总；同一搜索结果可出现多个站内 URL，因此页面维度加总可能高于 property 级 headline。

| 站点 | 点击 | 前窗点击 | 展现 | 前窗展现 | 曝光 URL | 前窗曝光 URL | 加权排名 | 前窗排名 | 决定 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Network | 2 | 0 | 43 | 49 | 14 | 23 | 17.40 | 26.49 | Google 仍小，但已有点击且 Bing 强，保护 |
| Smarthome | 0 | 0 | 20 | 26 | 18 | 18 | 16.01 | 35.58 | 排名改善，保护已曝光页 |
| Homeoffice | 3 | 2 | 891 | 963 | 94 | 119 | 20.53 | 32.28 | 点击与排名改善，保持精确 cohort |
| Baby | 1 | 2 | 565 | 535 | 94 | 109 | 12.78 | 17.26 | 展现与排名改善，保护 |
| Pets | 0 | 0 | 29 | 16 | 11 | 12 | 5.80 | 11.81 | 小样本正向，保护 |
| Style | 0 | 0 | 0 | 1 | 0 | 1 | — | — | maintenance |
| Costume | 0 | 0 | 0 | 3 | 0 | 1 | — | — | seasonal observe |

七日点击赢家为 Homeoffice `logitech-litra-glow-vs-elgato-key-light-neo`（3 点击）、Network `deco-be63-vs-be67-vs-be85-buying-guide`（2 点击）和 Baby 德语 Ergobaby positions 页面（1 点击）。这些页面不得改动。Branch、HON、GROWNSY 和 Ergobaby forward-facing 属于 9 月 11 日 cohort，继续保护到 9 月 18 日。

### 28 天诊断

页面维度显示 Homeoffice（4,100 vs 2,549 展现、12 vs 6 点击）和 Baby（2,397 vs 1,860、10 vs 10）承担近期恢复；Network（802 vs 3,995、12 vs 44）、Smarthome（609 vs 2,535、0 vs 16）和 Pets（263 vs 1,062、3 vs 2）仍背负八月长窗损失。最近七日 Network 已恢复到 2 点击、Smarthome 排名从 35.58 改善到 16.01、Pets 加权排名进入前十，因此今日不对这三站做无差别大改。

高意图 28 日查询仍集中在比较词：`logitech litra glow vs elgato key light neo`、`elgato key light neo vs logitech litra glow`、`deco be63 vs be67`、`tp link be63 vs be67` 和 `be63 vs be67` 均已产生点击；继续保护 comparison-first 方向。

## Indexed-zero 40 Day-7

正式窗口为 2026-09-07 至 2026-09-13，对比 2026-08-31 至 2026-09-06。

| URL | 展现 | 平均排名 | 动作 |
| --- | ---: | ---: | --- |
| Smarthome `smart-peephole-cameras-buying-guide` | 1 | 8 | 新增保护 |
| Homeoffice `conference-speakerphones-buying-guide` | 3 | 3 | 保护，早期信号增强 |
| Baby `reusable-baby-food-pouches-buying-guide` | 2 | 9.5 | 保护 |
| Baby `bathtub-spout-covers-buying-guide` | 2 | 9 | 保护，早期信号增强 |
| Baby `childproof-outlet-covers-buying-guide` | 2 | 2.5 | 保护，早期信号增强 |
| Baby `childproof-stove-knob-covers-buying-guide` | 2 | 6 | 新增保护 |

其余 34 个精确 URL 今日全部完成 live URL Inspection：34 indexed、0 not-on-Google、0 unknown、0 remaining，没有执行 Request indexing。公开审计同时通过 40/40 HTTP 200、自 canonical、index/follow、9 月 7 日版本内容和 Sitemap lastmod。

Day-7 决定：方向已经产生六个前十信号，但样本仍小；在没有技术缺陷的前提下，七天后再次整批改写会破坏实验。6 个曝光页保护至 9 月 21 日与 10 月 7 日；34 个零展现页在 9 月 21 日只做精确需求/意图/合并判断，期间如新增曝光则立即转保护。

## 索引与安全

- Page indexing 报告最后更新于 9 月 4 日：1,567 indexed、4,325 not indexed。报告中的两个历史 5xx 样例分别为一个当前返回预期 410 的 Main 旧 MBTI URL，以及一个已退出运营范围的 Tools URL；不是当前 Affiliate 5xx。
- 七个运营站 Sitemap 均为 `Success`，最近读取日期正常；今日公网也全部返回 HTTP 200。
- Manual Actions：`No issues detected`。
- Security Issues：`No issues detected`。
- Removals：过去六个月没有提交请求。

## Bing、行为与收入

- Bing 9 月 7–13 日 property headline 为 **8 点击、409 展现、CTR 1.96%**。排除 Main 与已放弃 Tools 后，运营站页面维度为 Network 97 展现/5 点击/加权排名 4.38，Smarthome 20/0/4.50，Homeoffice 14/0/3.64，Baby 2/2/6.00。Network 的 Bing 排名和点击均明确成立，今日及后续 Google 恢复动作必须保护这些 URL。
- Clarity Yesterday：3 个真实会话、85 个机器人会话被排除、1.0 页/会话、55.50% 平均滚动、19 秒平均活跃；0 强烈点击、0 无效点击、0 过度滚动、0 快速返回、0 JavaScript 错误。入口为 Baby bottle drying racks、Main About 和 Pets cat trees 各 1 会话；当日没有足够事件数据形成转化结论。
- Amazon 当前报表最后更新为 **2026-09-12 00:00 PDT**；9 月 13 日 Today 视图为 0 点击、0 订单、0 发货、$0 收入、$0 收益。月度选择器在浏览器控制超时前未返回，月度口径记为 unavailable，而不是把单日零值扩写成整月零收入。最近一次有效完整窗口仍是 9 月 4–10 的 22 点击、4 订单、18.18% conversion、$199.96 ordered revenue、$7.80 earnings。
- CJ：登录态已过期，Yesterday clicks/sales/leads/commission 为 authentication-blocked，不记为零。
- 联盟链接：Node 20 审计 **306/306 passed**，8 个已知漂移/不可用 offer 继续被安全抑制。

## 生产、Cloudflare 与本地验证

- Network、Smarthome、Homeoffice、Baby、Pets、Style、Costume 七个首页与七个 `sitemap.xml` 全部 HTTP 200；ErGear/FlexiSpot 目标页 HTTP 200。
- 浏览器形态 HTML 首次 `UPDATING`、二次 `HIT`；API 返回 `private, no-store` 与 `DYNAMIC`，RSC 返回 `DYNAMIC`。无缓存规则故障，不清缓存。
- `check:search-recovery`、`check:seo`、`check:affiliate-links`、`check:next-product-expansion`、`check:indexed-zero-recovery`、`check:page-one-ctr`、`check:page-coverage` 与 ESLint 全部通过。
- Indexed-zero 公开模式通过 40/40 runtime 与 40/40 Sitemap。今天没有运行时代码、依赖、路由或构建配置变化，因此不重复 optimized build。
- 当前生产仍为 release `ab2cf6d`，回滚 `3d04dcd`。今日没有发布、Sitemap 重提、IndexNow、GSC Request indexing 或 Cloudflare purge。

## 发现与外部分发

普通日常运营未重复外部分发。独立 external-distribution 流程今日完成 Pinterest Day-7 并发布一个不同创意的第二变体；详见 `apps/affiliate/reports/external-distribution-2026-09-14.md`。该流程没有更改站内页面、Search Console、Sitemap 或 IndexNow。Reddit 继续永久退出日常范围。

## 下一步

1. 2026-09-15：执行 9 月 8 日 27-family consolidation Day-7 精确门槛，保护获得点击、展现、查询扩展或前 20 排名的 retained hubs，不反转 91 个重定向源。
2. 2026-09-18：执行 comparison-first 36 Day-14，以及 9 月 11 日两组变更 Day-7。
3. 2026-09-20：执行 ErGear 第二次 snippet Day-7；若此前获得点击，停止继续测试。
4. 2026-09-21：执行 indexed-zero 40 Day-14，只复核今天仍零展现的 34 页；新增曝光页转保护。
5. 新增可索引路由继续冻结。Tools 继续从所有运营、监控、报告与优化中排除。

## 今日关闭状态

- 状态：`complete_hold_no_runtime_release`
- 主动作：Indexed-zero 40 formal Day-7 gate + 34/34 live inspections
- Search Console：checked
- 零展现队列：40 total / 34 current-zero inspected / 34 indexed / 0 not-on-Google / 0 remaining
- Clarity：checked
- Amazon：daily checked / monthly unavailable
- CJ：blocked-authentication
- 联盟链接：306/306 passed
- 生产与 Cloudflare：checked healthy
- Bing：checked, active non-Tools pages protected
- 外部分发：not repeated; separate workflow referenced
- 本地验证：passed

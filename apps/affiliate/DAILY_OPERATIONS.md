# Madabase 联盟站每日运营清单

最后更新：2026-09-08

这份清单是 `日常开发` 的执行入口。每次运行先读取当前运营快照和恢复控制，再按下面顺序完成检查、选择一个主动作、验证并写入当天记录。七个站点必须同时覆盖：Network、Smarthome、Homeoffice、Baby、Pets、Style、Costume。

## 0. 开始前

按顺序读取：

1. `apps/affiliate/config/current-operations-handoff.json`
2. `docs/affiliate-growth-state.json`
3. `docs/affiliate-growth-runbook.md`
4. `apps/affiliate/config/search-recovery-control.json`
5. 本文件

然后检查工作区，确认已有改动的归属。每一项必须在当天日志中写成 `checked`、`unchanged`、`no-data`、`not-due` 或 `blocked`，不能因为没有新数据而省略。

执行授权：当完整证据已达到本清单或运营快照中的明确门槛，且动作可回滚、只作用于已存在页面、没有扩大可索引路由范围时，当次直接完成诊断、实现、验证、推送、发布、公开复核、精确提交和记录更新，不等待所有者再次提醒。只有涉及新增授权、不可逆删除、计费或密钥、证据不完整或相互矛盾时才暂停确认。

## 1. 每天固定检查

### A. 生产与技术健康（P0）

- 检查七个站点首页和 `sitemap.xml`，要求 HTTP 200。
- 有新发布或模板改动时，检查所有受影响 canonical URL、图片、结构化数据、首屏购买路径和移动端表现。
- 抽查 Cloudflare：浏览器形态 HTML 应符合当前缓存规则；API/RSC 不应被错误缓存。
- 检查服务状态、重启数和错误日志只在有服务器访问权限或异常信号时执行；不要在低内存生产机跑高并发全量审计。
- 任一站点 5xx、canonical/noindex 错误、sitemap 失败、CTA 丢失或商家漂移，立即把当日主动作切换为修复。

### B. Search Console

- 最新 24 小时对比前 24 小时：只用于异常和发布影响，不据此做大范围改版。
- 最近 7 天对比前 7 天：记录全站和七个站点的点击、展现、CTR、平均排名。
- 查看页面和查询层信号；改标题、主意图、canonical、合并或下线前，必须有页面过滤后的查询证据。
- 查看页面索引、sitemap、人工处置、安全问题和移除请求是否出现新异常。
- 对当天到期 cohort 使用精确 URL 清单，不得用少量赢家代替整批检查。
- 对到期的零展现 URL 逐条做 URL Inspection。零展现不等于未收录，也不自动触发“请求编入索引”。配额用尽时保留剩余精确 URL，并将下一次检查排到配额刷新后的次日。

### C. 转化与联盟收入

- Clarity（Yesterday）：会话、机器人排除数、每会话页数、平均滚动、平均活跃时间、快速后退/无效点击/强烈点击、JavaScript 错误、`affiliate_click` 会话和主要入口页。
- Amazon Associates：记录报表更新截止日、本月及可用完整窗口的 clicks、ordered items、shipped items、conversion、earnings，以及税务/付款/政策警告。报告有延迟时明确写出，不把延迟当成零收入。
- CJ：记录 Yesterday 的 clicks、sales、leads、commission；与本地/Clarity 点击严重不一致时标记口径异常，不凭总点击数改页面。
- 运行联盟链接审计；任何 exact ASIN、tracking ID、PID/AID、商品身份、可用性或落地页漂移都优先修复。
- 不代表用户完成税务证明、银行信息、付款设置或账户级变更。

### D. 发现、分发与外部渠道

- Bing Webmaster 只在明确到期、异常或专门的 Bing 检查日运行；否则记 `not-due`。
- Pinterest、Reddit、Quora 和论坛在普通日常运营中统一记 `not-due`。只有明确的 `外部分发` 请求或计划任务才能发布。
- Sitemap、IndexNow 和 Search Console 只提交真实改变且符合发现门槛的 canonical URL；不要重复提交未变 URL。

### E. 本地验证

从仓库根目录执行：

```bash
source ~/.nvm/nvm.sh
nvm use 20
npm run check:search-recovery --workspace apps/affiliate
npm run check:seo --workspace apps/affiliate
npm run check:affiliate-links --workspace apps/affiliate
npm run check:next-product-expansion --workspace apps/affiliate
npm run lint --workspace apps/affiliate
```

只有运行时代码、依赖、路由或构建配置发生变化时才需要补跑优化构建；只更新报告或运营状态不强制重建。任何发布必须另外完成 release、生产和回滚验证。

## 2. 每天只选择一个主动作

按下面顺序选择当天预期价值最高且风险最低的动作：

1. 生产、索引、追踪或商家安全故障修复。
2. 到期 cohort 的完整测量和明确修复。
3. 有查询证据的现有页面发现、CTR 或内链修复。
4. 有合格流量证据的首屏/粘性 CTA 转化修复。
5. 严格通过所有门槛的新页面或新分发。
6. 没有安全动作时，主动作可以是“保持不变并保护基线”。

Google spam update 已于 2026-08-21 官方结束，GSC 也已在 2026-08-26 提供 8 月 22、23、24 三个完整数据日。正式复评结果为 hold-no-expansion：最近完整七日点击 5 vs 36、展现 1,858 vs 5,457，Network、Smarthome、Pets 的展现仍断崖下跌，技术与索引入口健康，因此冻结继续生效。三日完整只是允许复评的必要条件，不是自动解冻条件。禁止新增 Amazon family 页面、扩大 Costume 可索引 cohort、批量改标题/正文、批量 canonical/重定向、批量重提 sitemap 或 IndexNow；精确查询支持的既有页修复仍可按控制文件执行。

## 3. 当前日期闸门

| 日期 | 必做事项 | 未到期前禁止 |
| --- | --- | --- |
| 2026-08-22 | 未执行；已并入 8 月 23 日队列。GSC 每日 URL Inspection 配额不会补发 | 把漏做一天解释为数据丢失或强行追加请求 |
| 2026-08-23 | Expansion757 Day 14 指标已覆盖全部 757 URL；零展现精确队列 486 个，累计检查 260 个，252 indexed、8 not-on-Google，剩余 226 个因当日配额暂停 | 解冻扩张；把 226 个剩余 URL 记为未收录；批量请求索引 |
| 2026-08-24 | 已续查 101 个 URL；累计 361/486，348 indexed、13 not-on-Google，剩余 125 个因当日额度暂停。五个 direct-URL 产品 pilot 的技术、商家和隔离状态全部通过，继续隔离 | 把剩余 125 个记成未收录；提前加入 sitemap、首页/分类发现、IndexNow 或 GSC |
| 2026-08-25 | 已完成四个 HTTP 200、自 canonical 例外的详细原因，并续查 97 个精确 URL；累计 458/486，442 indexed、16 not-on-Google，剩余 28 个因当日额度暂停。最新完整 GSC 日到 8 月 23 日，更新后观察满足 2/3 | 把三个新 summary 当成技术故障；批量请求索引；在 8 月 24 日完整数据出现前解冻 |
| 2026-08-26 | 已读取 8 月 24 日完整数据并完成七站冻结正式复评：最近七日 5/1,858 vs 36/5,457，决定继续冻结。URL Inspection 第一条 detail 请求即命中 property quota，累计仍为 458/486、442 indexed、16 not-on-Google、28 未检查；CJ 异常已拆到 Abracadabra AID 17278691 的单一 feed link | 自动解冻；把额度失败写成新检查；依据 CJ 机器人/预取总点击改 CTA；重复 sitemap/IndexNow；无证据大改页面 |
| 2026-08-27 | 已在 8 月 28 日用完整到 8 月 26 日的数据补齐：Soft151 151/151 与 Ranking118 118/118 已完整复核；三个 Smarthome detail 已复查，剩余 28 URL 全部 indexed | 只抽样赢家；提前重写或重提；把额度阻塞写成未收录 |
| 2026-08-28 | 最近完整七日 6/1,794 vs 26/4,442，冻结继续。Soft151 为 26 exposed / 74 impressions / 0 clicks，Ranking118 为 47 / 696 / 4；精确 486 URL Inspection 队列完成为 471 indexed、15 not-on-Google、0 remaining。昨天 43 页发布尚无完整发布后日，今日主动作是保护测量基线 | 依据 8 月 26 日完整数据评价 8 月 27 日发布效果；再次批量重写；重放 43 URL IndexNow；把两个 discovered-currently-not-indexed 页面当技术故障 |
| 2026-08-31 | 最近 24 小时 0/246 vs 0/216，最近七日 8/1,689 vs 19/3,390；没有新的单日断崖，但点击仍弱。只对累计 96 展现、排名 8.2/8.8、0 点击的 ErGear 48×24 vs FlexiSpot E7 Mini 页面执行一个标题与摘要 CTR 实验 | 改动八个当前点击页；改 CalDigit TS4 或 GROWNSY 正向页；把单页实验扩成批量重写；9 月 7 日前再次改该页 |
| 2026-09-02 | Costume small-space pilot 下一闸门 | 无查询证据就扩充同类 URL |
| 2026-09-03 | Soft151 sitemap 后 Day 14 | 以单日数据定性 |
| 2026-09-08 | Expansion757 Day 30 已完成。29 个全检查/全收录/全零展现多路由主题中，27 个已从 118 个活跃 URL 合并为 27 个保留 hub + 91 个永久重定向；2 个与 Deep43 重叠的 Network 主题延后。生产 release `4d78d2e` 与精确 32 URL IndexNow 已验证 | 9 月 15 日前因滚动小时噪声反转这 27 个合并；改动 2 个 Deep43 重叠主题；新增可索引路由 |
| 2026-09-10 | Deep43 战术闸门、Soft151 原始 Day 28；同日自动判定 `sfp-plus-network-switches` 与 `poe-splitters` 两个延后主题 | 闸门前改动两个延后主题；删除、合并或重定向前跳过精确 cohort 和 live inspection 证据 |
| 2026-09-11 | Comparison-first 36 Day 7 | 闸门前改其标题、H1、直接答案或主意图，除非出现确认的技术/商家故障 |
| 2026-09-14 | Indexed-zero 40 Day 7 与 ErGear Day 14 | 用不完整日或滚动小时值提前重置实验 |
| 2026-09-15 / 09-22 / 10-08 | 9 月 8 日 27-family 合并的 Day 7 / Day 14 / Day 30 | 重写已获得展现、点击、查询扩展或前 20 排名的保留 hub |
| GSC 完整包含 2026-08-22 至 2026-08-24 | 已在 2026-08-26 完成复评；数据不支持解冻，继续 hold-no-expansion，等待后续精确 cohort 恢复证据 | 把三日门槛满足误读为自动恢复；做大范围 SEO 手术 |

日期闸门以 `current-operations-handoff.json` 为准；如果本表与快照冲突，先更新本表和当天日志，再行动。

## 4. 每日收尾模板

在 `apps/affiliate/reports/daily-operations-YYYY-MM-DD.md` 记录：

```text
状态：complete / partial / blocked
主动作：
Search Console：checked / unchanged / no-data / blocked
零展现队列：精确总数 / 已检查 / indexed / not-on-Google / 剩余 / 下一日期
Clarity：
Amazon：
CJ：
联盟链接：
生产与 Cloudflare：
Bing：not-due 或结果
外部分发：not-due 或专门任务链接
本地验证：
未做及原因：
明日第一步：
```

最后同步更新 `docs/affiliate-growth-state.json`、`apps/affiliate/config/current-operations-handoff.json` 和本文件中的日期闸门；历史记录不回写成最新事实。

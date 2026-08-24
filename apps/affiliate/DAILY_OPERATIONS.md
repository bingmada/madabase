# Madabase 联盟站每日运营清单

最后更新：2026-08-24

这份清单是 `日常开发` 的执行入口。每次运行先读取当前运营快照和恢复控制，再按下面顺序完成检查、选择一个主动作、验证并写入当天记录。七个站点必须同时覆盖：Network、Smarthome、Homeoffice、Baby、Pets、Style、Costume。

## 0. 开始前

按顺序读取：

1. `apps/affiliate/config/current-operations-handoff.json`
2. `docs/affiliate-growth-state.json`
3. `docs/affiliate-growth-runbook.md`
4. `apps/affiliate/config/search-recovery-control.json`
5. 本文件

然后检查工作区，确认已有改动的归属。每一项必须在当天日志中写成 `checked`、`unchanged`、`no-data`、`not-due` 或 `blocked`，不能因为没有新数据而省略。

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

当前 Google spam update 已于 2026-08-21 官方结束，但恢复冻结继续生效，直到 GSC 能提供 8 月 22、23、24 三个完整的更新后数据日并完成复核。期间只允许技术、索引、商家安全、测量和报告修复。禁止新增 Amazon family 页面、扩大 Costume 可索引 cohort、批量改标题/正文、批量 canonical/重定向、批量重提 sitemap 或 IndexNow。

## 3. 当前日期闸门

| 日期 | 必做事项 | 未到期前禁止 |
| --- | --- | --- |
| 2026-08-22 | 未执行；已并入 8 月 23 日队列。GSC 每日 URL Inspection 配额不会补发 | 把漏做一天解释为数据丢失或强行追加请求 |
| 2026-08-23 | Expansion757 Day 14 指标已覆盖全部 757 URL；零展现精确队列 486 个，累计检查 260 个，252 indexed、8 not-on-Google，剩余 226 个因当日配额暂停 | 解冻扩张；把 226 个剩余 URL 记为未收录；批量请求索引 |
| 2026-08-24 | 已续查 101 个 URL；累计 361/486，348 indexed、13 not-on-Google，剩余 125 个因当日额度暂停。五个 direct-URL 产品 pilot 的技术、商家和隔离状态全部通过，继续隔离 | 把剩余 125 个记成未收录；提前加入 sitemap、首页/分类发现、IndexNow 或 GSC |
| 2026-08-25 | 配额刷新后先读取四个当前 HTTP 200、自 canonical 的新 not-on-Google URL 详细原因，再继续剩余 125 个精确 URL Inspection | 批量请求索引；仅凭 summary 推断未收录原因 |
| 2026-08-27 | Soft151 sitemap 后 Day 7；同时完成既定 cohort gate | 先于首个完整七日窗口重写或重提 |
| 2026-09-02 | Costume small-space pilot 下一闸门 | 无查询证据就扩充同类 URL |
| 2026-09-03 | Soft151 sitemap 后 Day 14 | 以单日数据定性 |
| 2026-09-08 | Expansion757 Day 30 | 未完成整批 ledger 就开新扩张 |
| 2026-09-10 | Soft151 原始 Day 28 | 删除、合并或重定向前跳过 live inspection |
| GSC 完整包含 2026-08-22 至 2026-08-24 | 重新评估七站冻结；当前最新完整日仅到 8 月 21 日，要求的三天仍为 0/3 | 把自然日流逝当成 GSC 数据已完整；做大范围 SEO 手术 |

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

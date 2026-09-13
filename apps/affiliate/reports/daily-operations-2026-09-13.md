# Affiliate daily operations — 2026-09-13

## 今日结论

- GSC 滚动最近 24 小时为 **0 点击、215 展现、平均排名 16.5**。这不是新的技术性断崖；当前主要矛盾仍是页面已有曝光但点击不足，以及大量页面尚未建立稳定查询覆盖。
- 当前可用的完整七日窗口实际只覆盖 **9 月 4 日至 9 月 10 日**：**6 点击、1,510 展现、CTR 0.4%、平均排名 17.9**。因此 9 月 7 日发布的 indexed-zero 40 只有四个完整发布后数据日，不能把其余 36 页提前判定失败。
- ErGear/FlexiSpot 单页已达到预先记录的第二次摘要实验量化门槛：9 月 10 日止累计 **103 展现、0 点击、平均排名 8.1**。Owner 明确要求不等到 9 月 14 日，所以今天提前执行一次且仅一次查询驱动的标题与摘要测试。
- 完成了排除已放弃 Tools 站后的全量 Sitemap 覆盖盘点。九个活跃站点共有 **1,401** 个 Sitemap URL，其中 **1,264** 个内容 URL、137 个首页/分类/政策/本地化等结构 URL。既有账本覆盖 1,126 个内容 URL，剩余 138 个已全部进入精确控制台账，当前没有遗漏的活跃内容页。

## 搜索证据与处置

### Indexed-zero 40 提前观察

当前完整数据只提供四个发布后日，但已经出现四个此前零曝光、当前进入前十的正向信号，共 6 展现、加权排名 5.667：

- Homeoffice `conference-speakerphones-buying-guide`：2 展现，排名 2。
- Baby `reusable-baby-food-pouches-buying-guide`：2 展现，排名 9.5。
- Baby `bathtub-spout-covers-buying-guide`：1 展现，排名 9。
- Baby `childproof-outlet-covers-buying-guide`：1 展现，排名 2。

这四页立即转为保护。其余 36 页只有四个完整发布后日，不满足失败判定；等 GSC 完整包含 9 月 7 日至 9 月 13 日后再运行正式 Day-7 闸门。

Search Console URL Inspection 今天还精确确认了 Baby `baby-bouncers-buying-guide` 与 Pets `cat-trees-and-towers-buying-guide` 均为 `URL is on Google`。没有批量 Request indexing。

### ErGear 第二次摘要测试

目标页：`https://homeoffice.madabase.com/best/ergear-48x24-vs-flexispot-e7-mini`

完整页级窗口 2026-08-31 至 2026-09-10 为 103 展现、0 点击、排名 8.1；主要查询为 `flexispot e7 mini` 45 展现、`ergear vs flexispot` 5、`flexispot vs ergear` 5。排名已足够获得点击，但旧摘要未兑现 CTR，因此达到既定的“至少 100 展现、0 点击、仍在前 12”第二测试门槛。

今天只修改该现有页面的搜索摘要：

- 新标题：`FlexiSpot E7 Mini vs ErGear 48×24: Fixed or Rolling Desk?`
- 新元描述：`Choose FlexiSpot E7 Mini for a compact fixed workstation, or ErGear 48×24 for a larger rolling surface. Compare height, clamp fit, and room clearance.`
- 更新时间改为 2026-09-13。
- URL、canonical、正文、产品、商家链接、比较意图和内链结构保持不变。

该页不属于已知 Bing 点击/AI 来源保护页。发布后保护到 9 月 20 日 Day 7 和 9 月 27 日 Day 14；一旦获得点击，立即停止继续改摘要。

## 全量页面覆盖账本

新增 `live-page-coverage-2026-09-13.json` 与自动检查器，将既有账本之外的 138 个活跃内容 URL 精确分为：

- 18 个当前前 20 页面：保护，不改主要 SEO 字段。
- 9 个当前或前窗仍有曝光页面：recovery-watch，按精确查询变化判断。
- 32 个两个完整七日窗口均零曝光的普通 Affiliate 页面：待逐页核验索引与意图，不允许无检查批量重写。
- 79 个 Costume 季节/数据库页面：单独管理，不与普通 Affiliate 恢复批次混改。

Costume 技术抽查覆盖全部 76 个 Sitemap 产品页：76/76 HTTP 200、index/follow、自 canonical、Product schema、InStock schema。发现两个 Santa 租赁记录使用相同可见标题，但价格与 CJ 点击 token 不同；在生产产品/变体身份未确认前保留两者，不凭标题自行合并或 canonical 化。

Tools（`tools.madabase.com`）已按 Owner 决定永久退出运营、监控、GSC、Bing、Clarity、Sitemap、IndexNow 和 SEO 待办范围。本次所有统计和台账均已排除 Tools；未关停或删除现有服务。

## 验证与发现

- `check:page-coverage`：138/138 唯一 URL 通过；公开 Sitemap 对照确认九站 1,401 个 URL，全部 138 个新增分类 URL 均在线。
- `check:seo`：964 guides、175 products、77 roundups、7 个 Affiliate 内容工具页通过。
- `check:indexed-zero-recovery`、`check:page-one-ctr`、306/306 联盟链接与 ESLint 通过。
- Node 20 优化构建、类型检查、静态生成和 Linux x64 打包通过。发布归档为 **60,852,496 bytes**，SHA-256 `0adc1f5842652b82b825f0777b553e2b36f0b516cee9c85979a186347563fb57`。
- 本地不可变候选运行时已验证目标页 HTTP 200、新标题、自 canonical、2026-09-13 更新时间及首屏商业路径。
- 提交 `ab2cf6dcbfdcc3aacfa01536a2ed34992fe0e093` 已推送到 `origin/lyd-0609`。服务器现有仓库 fast-forward 后的 60,852,496-byte 归档与本地 SHA-256 `0adc1f5842652b82b825f0777b553e2b36f0b516cee9c85979a186347563fb57` 完全一致。
- 候选 3111 通过目标页、Homeoffice Sitemap 和七个 Affiliate 首页检查后，生产已切换到 `/srv/madabase-affiliate/releases/ab2cf6d`。`madabase-affiliate.service` 在 3011 active/running、零重启且无 error 日志；`current` 指针一致，候选已停止，旧 `3d04dcd` release 与 `madabase-affiliate.service.before-ab2cf6d` 均保留用于回滚。
- 公网目标页及七站首页全部 HTTP 200；公网 HTML 已返回新标题、新元描述、自 canonical 和 2026-09-13 更新时间，Cloudflare 状态为 `DYNAMIC`，无需清缓存。
- Sitemap 成员关系没有变化，因此未重提 Sitemap。IndexNow 仅提交目标页一个 changed canonical，返回 HTTP 200；历史 URL 未重放。

## 后续闸门

1. GSC 完整包含 9 月 7 日至 9 月 13 日时，运行 indexed-zero 40 正式 Day 7；保护所有新增曝光、查询扩展、点击或前 20 页面。
2. 9 月 15 日检查 9 月 8 日 27-family 合并 Day 7，不因滚动小时噪声反转重定向。
3. 9 月 18 日运行 comparison-first 36 Day 14，以及 9 月 11 日两批变更 Day 7。
4. 9 月 20 日运行 ErGear 第二次摘要测试 Day 7；9 月 27 日运行 Day 14。
5. 新增可索引路由仍冻结。32 个双窗口零曝光页必须先逐页确认索引与查询意图；Costume 79 页继续按季节/数据库规则单独判断。

## 今日关闭状态

- 状态：`complete_released_public_verified_indexnow_exact_1`
- 主要 SEO 动作：ErGear/FlexiSpot 单页第二次摘要实验
- 页面覆盖：1,264/1,264 活跃非 Tools 内容 URL 已分配到控制账本
- Bing 保护：未修改已知 Bing 点击或 AI 来源页面
- 发现动作：精确 1 个 changed canonical 已获 IndexNow HTTP 200；未重提 Sitemap
- 下一正式判断：GSC 完整覆盖 2026-09-07 至 2026-09-13 后的 indexed-zero 40 Day 7

# Affiliate daily operations — 2026-08-31

状态：`single-page-ctr-change-pending-release`

## 今日判断

最近 24 小时为 0 点击、246 展现、CTR 0%、平均排名 43.1；前一个 24 小时为 0/216、0%、40.9。展现较前窗增加 13.9%，所以今天不是新的全站断崖，但点击问题仍未缓解。最近七天为 8 点击、1,689 展现、CTR 0.5%、平均排名 35.7；前七天为 19/3,390、0.6%、35.2。与昨天读取的当前七天 1,739 展现相比，仅减少 50（约 2.9%），不足以证明出现新的算法级下跌。

站点层面，Homeoffice 最近 24 小时 173 展现、七天 1,071 展现，仍是主要曝光来源；Baby 最近 24 小时 58、七天 557，并且七天排名由 25.1 改善到 20.0。Network、Smarthome 和 Pets 继续恢复观察，Style 与 Costumes 数据量不足。八个当前有点击的页面全部保护，不改标题或正文。

## 今日唯一 SEO 修改

目标：`https://homeoffice.madabase.com/best/ergear-48x24-vs-flexispot-e7-mini`

该页最近两个七天窗口合计 96 展现、0 点击，平均排名分别为 8.2 和 8.8。页面过滤查询中，`flexispot e7 mini` 为 13/25 展现、排名 9.5/9.6；`ergear vs flexispot` 为 6/7、排名 6.5/8.6；`flexispot vs ergear` 为 1/2、排名 2.0/6.5。查询和页面意图一致，且位置足以获得点击，因此符合单页搜索摘要实验门槛。

修改内容：

- 标题从 `ErGear 48×24 vs FlexiSpot E7 Mini: Full Desk or Compact Fit?` 改为 `ErGear 48×24 vs FlexiSpot E7 Mini: Which Is Better?`。
- 元描述直接给出选择规则：ErGear 对应更大的可移动台面，FlexiSpot E7 Mini 对应紧凑固定工位。
- 首屏摘要和导语同步明确移动性、脚轮、显示器支架与空间取舍。
- 仅该页更新时间改为 2026-08-31；URL、canonical、比较意图、产品、商家链接、主体章节和内链结构不变。

精确基线和停止条件见 `apps/affiliate/config/ergear-flexispot-ctr-experiment-2026-08-31.json`。9 月 7 日前不再次改写；9 月 14 日只有在至少 100 个发布后展现仍为 0 点击且排名保持前 12 时，才允许下一次摘要实验。

## 未改页面

CalDigit TS4 和 GROWNSY 的曝光、排名方向为正，继续保护。8 月 27 日的 43 页 deep-rank cohort 继续等待 9 月 3 日正式闸门。没有新增页面、批量标题改写、sitemap 扩张、批量 Request indexing、旧 IndexNow 重放或 Purge Everything。

## 发布与验证

本地阶段已通过：`check:search-recovery`、`check:seo`、306/306 联盟链接、ESLint 和完整 Linux x64 release build。生成归档为 `apps/affiliate/.release/affiliate-runtime.tgz`，60,738,082 字节，SHA-256 `e2c50270adfae5840ce34ea36e79e7346ce77ce3ec8ceb79fda8c45fe3234fc8`。

从该同一归档启动的不可变本地运行时返回 HTTP 200；标题与 H1 均为新标题，元描述为 155 字符的选择答案，canonical 自指，Article `dateModified` 与 sitemap `lastmod` 均为 2026-08-31，首屏商业路径标记仍存在。生产候选、公开页面、缓存与精确 IndexNow 状态在部署后回填。

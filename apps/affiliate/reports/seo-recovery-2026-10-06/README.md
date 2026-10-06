# 2026-10-06 全部联盟站展现恢复批次

## 结论

这不是只处理 Baby 和 Homeoffice 的发布包。最终批次同时覆盖 Network、Smarthome、Homeoffice、Baby、Pet、Style 和 Costume 七个仍在运营的联盟站。9 月 27 日至 10 月 3 日的完整 Search Console 周期较前一周期从 1,509 次展现降至 436 次，下降 71.1%，断崖从 9 月 29 日开始。10 月 3 日的 metadata/head 修复是必要修复，但公网原始 head 已经 327/327 通过后，展现仍未恢复，因此本批次不再重复修改共享 header。

Google 9 月 Spam Update 仍在进行。恢复策略是保护已有搜索信号、合并明确重叠意图、逐页加强证据和决策价值，不新增索引页、不批量提交索引，也不对七个站机械套同一模板。

## 七站处理

- Network：保留已有点击和首页排名的 Deco BE63/BE67/BE85 决策页；补齐当前官方端口矩阵、网络拓扑边界和关联路径，不改 URL。
- Smarthome：把两个已经失去曝光的 Matter 广义解释页并入仍有曝光的设备购买清单；补齐 CSA 与 Thread Group 官方定义、控制器/边界路由器/桥接职责和失败测试。
- Homeoffice：保留八个按测量信号选择的主题主页面，36 个重复模板页永久合并；每个主页面按兼容性、连接、耗材或人体工学独立重写。
- Baby：保留四个按安全、尺寸和适配信号选择的主页面，17 个重复模板页永久合并；自动洗奶瓶机合并到历史更强的洗涤/消毒/烘干决策页。
- Pet：保留 Levoit Vital 200S-P 页面，在平均排名 3.94、18 次展现但零点击的基础上对齐宠物家庭意图；明确官方规格、第三方仪器测试和近期宠物家庭观察的证据边界。
- Style：保留 Loungefly 护理页，把泛化建议改为标签优先、按材质清洁、淋雨处理、储存和肩带安全工作表，不扩展新 URL。
- Costume：保留租赁还是购买页面，按当前 10 月商户条款补齐租期、押金、清洁、取消、配件和改衣边界，承接已经出现过的季节性查询。

## 精确变更边界

- 17 个既有 canonical 页面。
- 55 个基础永久重定向源；其中 Homeoffice/Baby 53 个，Smarthome 2 个。
- 四个地区版本同步产生 220 个永久重定向和 64 个地区版 canonical；Costume 不生成地区版。
- 七份 sitemap 都逐项验证；重定向源全部移除，保留页只出现一次。
- 新增 URL 为 0。
- 精确 URL 见 `changed-urls.json`，七站动作与选择证据见 `apps/affiliate/config/portfolio-search-recovery-2026-10-06.json`。

## 验收

- `check:portfolio-search-recovery`：7 个站、17 个基础 canonical、55 个基础 308、220 个地区版 308、64 个地区版 canonical、7 份 sitemap，错误为 0。
- `check:october-search-recovery`：Homeoffice/Baby 的 12 个主题族、64 个测量 URL、12 个保留页和 53 个重定向继续独立通过。
- 分类发现校验覆盖 757 个受治理内容 URL，确保历史主题簇入口没有被本次合并误删。
- `check:seo`、历史合并规则、联盟链接、ESLint、类型检查、Next.js 生产构建和发布包回滚模拟必须全部通过后才允许上线。

## 观察门槛

- Day 7：2026-10-13
- Day 14：2026-10-20
- Day 30：2026-11-05

按七站、页面和查询词分别观察。已经获得点击、展现扩展或 Top 20 排名的页面不做第二轮大改；Style 维持低频维护，Costume 按季节窗口判断。完整 Search Console 周期是成败依据，单日波动、sitemap 接受或 IndexNow 接受都不作为恢复证明。

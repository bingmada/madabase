# SEO 全面整改交付记录 · 2026-09-25

用户随后授权“发布吧”：三个服务已于 2026-09-25 发布，302/302 公网页面、32 个 Costume 购买页面和 76 个商品发现入口通过；90 个实质修改 URL 获 IndexNow 接收。完整发布证据、回滚过程及剩余外部项见 [正式发布记录](../seo-release-2026-09-25/README.md)。之后发现 Wellness 的一个 Cloudflare 节点 525，源站正常，等待授权登录控制台只读定位。以下保留本轮内容修改和发布前验证明细。

范围：Main、Network、Smarthome、Homeoffice、Baby、Pets、Style、Costume、Wellness。排除独立 Test / Tools 站；联盟站自己的桌高、尿布计算器仍在整改范围内。

## 重点低点击页面：53 个逐页复核

已逐页读取精确 URL 的 GSC 查询报告，复核搜索意图、正文答案、相关内链、商品路径及本地渲染。选择为 28 天至少 20 次展现、0 点击的 53 页：第一页 22 页、第二页 18 页、较后排名 13 页。结果为 6 页修复、16 页优化、31 页保留；这些数量涵盖本次连续整改的先前提交，不代表本次把 53 页全部重写。

查询窗口为 2026-08-25 至 2026-09-21，不能称为 9 月 25 日实时搜索效果。对查询隐藏严重、样本不足或现有意图已匹配的页面不反复改标题；保留正在获得点击的页面和现有 canonical。没有新增收录 URL，也没有无证据的合并或改词。

| 页面 | 处理 | 已落实的判断 / 修改 |
|---|---|---|
| [/reviews/branch-ergonomic-chair](https://homeoffice.madabase.com/reviews/branch-ergonomic-chair) | 修复 | Chair review and warranty/returns intent; keep the query target. Prior batch added policy answers, paused the missing Branch ASIN, and explicitly named the different HON alternative. |
| [/guides/standing-desk-height-chart-guide](https://homeoffice.madabase.com/guides/standing-desk-height-chart-guide) | 优化 | Height, measurements, dimensions and height-chart queries need a usable measurement method. Added seated/standing elbow measurements, keyboard-thickness worksheet and calculator link. Removed the invalid body-height multiplier from the related calculator. |
| [/best/best-standing-desks-for-small-spaces](https://homeoffice.madabase.com/best/best-standing-desks-for-small-spaces) | 优化 | Narrow, smallest and compact standing-desk queries fit the existing roundup. Corrected the E7 Mini configuration widths; retained the compact-room intent and comparison with larger desks. |
| [/reviews/hon-ignition-2-0-chair](https://homeoffice.madabase.com/reviews/hon-ignition-2-0-chair) | 修复 | HON chair review and warranty intent matches the page. Prior batch corrected the exact ASIN and added warranty/returns decision guidance. |
| [/reviews/grownsy-bottle-sterilizer-dryer](https://baby.madabase.com/reviews/grownsy-bottle-sterilizer-dryer) | 优化 | GROWNSY model/capacity queries require variant clarity. Prior batch separated five/six-bottle claims and conditional rack capacity; retain that answer. |
| [/reviews/anker-675-usb-c-docking-station](https://homeoffice.madabase.com/reviews/anker-675-usb-c-docking-station) | 优化 | Anker 675 users need dock/riser compatibility, not a powered standing desk. Prior batch corrected that distinction and kept the matching dock intent. |
| [/reviews/flexispot-e7-mini-standing-desk](https://homeoffice.madabase.com/reviews/flexispot-e7-mini-standing-desk) | 优化 | E7 Mini queries match the model review. Corrected conflicting official desktop-width tables and 32×24/42×24 configuration examples; narrowed warranty scope to the stated components. |
| [/reviews/urevo-smart-walking-pad](https://homeoffice.madabase.com/reviews/urevo-smart-walking-pad) | 修复 | UREVO review queries fit the walking-pad page, but its comparison links incorrectly pointed to monitor arms. Removed those unrelated alternatives without inventing a replacement product. |
| [/best/babybjorn-harmony-vs-ergobaby-omni-breeze](https://baby.madabase.com/best/babybjorn-harmony-vs-ergobaby-omni-breeze) | 优化 | Harmony versus Omni Breeze queries justify a concrete comparison table. Added documented weight/height gates, carry-position and caregiver-fit distinctions without applying overall weight limits to outward carry. |
| [/tools/desk-height-calculator](https://homeoffice.madabase.com/tools/desk-height-calculator) | 修复 | Desk calculator/chart queries exposed a real calculation defect. Replaced body-height multipliers with measured elbow heights minus keyboard thickness; added validation, fractional input and reset handling. |
| [/reviews/elgato-key-light-neo](https://homeoffice.madabase.com/reviews/elgato-key-light-neo) | 优化 | Key Light Neo model/review/mount queries need power-source context. Added documented 400/700/1000-lumen USB/adapter conditions and removed internal cluster-building copy. Exact black-model Amazon offer paused after final seller-drawer check found only Used - Like New. |
| [/best/dr-browns-vs-baby-brezza-sterilizer-dryer](https://baby.madabase.com/best/dr-browns-vs-baby-brezza-sterilizer-dryer) | 优化 | Exact Dr Brown versus Brezza comparison intent. Added six/eight-bottle headline capacities, rack-fit and conditional cycle comparisons; both require items to be washed first. |
| [/reviews/nanit-pro-smart-baby-monitor](https://baby.madabase.com/reviews/nanit-pro-smart-baby-monitor) | 修复 | The disclosed Nanit Essentials-versus-Pro query matches the existing bundle explanation. The exact Amazon page is now missing, so pause its purchase link; do not silently substitute another bundle. |
| [/guides/video-call-setup-guide](https://homeoffice.madabase.com/guides/video-call-setup-guide) | 优化 | Video-call setup queries need an ordered diagnostic workflow. Expanded thin text into device selection, lighting/framing, echo, connection/screen-share and fallback steps, plus a symptom table and Zoom sources. |
| [/tools/diaper-usage-calculator](https://baby.madabase.com/tools/diaper-usage-calculator) | 修复 | Diaper calculator/estimator queries match the tool, but days were missing and the purchase path promoted a sterilizer. Added days, total estimate and input validation; removed the unrelated CTA. |
| [/reviews/chicco-advanced-sterilizer-dryer](https://baby.madabase.com/reviews/chicco-advanced-sterilizer-dryer) | 优化 | Sparse Chicco review query does not justify retargeting. Prior batch removed the unsupported review-base claim; existing blocked exact offer remains paused. |
| [/reviews/dr-browns-all-in-one-sterilizer-dryer](https://baby.madabase.com/reviews/dr-browns-all-in-one-sterilizer-dryer) | 优化 | Dr Brown cycle-time and model queries need a precise qualified answer. Added the AC177/AC377 manual timing with explicit model-match requirement; do not apply it to every All-in-One model. |
| [/reviews/ergotron-hx-monitor-arm](https://homeoffice.madabase.com/reviews/ergotron-hx-monitor-arm) | 优化 | Minimum-weight and model queries need exact arm limits. Corrected the standard HX model to 20–42 lb and explicitly explained the 20 lb minimum, using the official model table. |
| [/reviews/uplift-v3-standing-desk](https://homeoffice.madabase.com/reviews/uplift-v3-standing-desk) | 优化 | No disclosed queries. Corrected the E7 Mini width comparison inside the UPLIFT review; kept the UPLIFT intent unchanged. |
| [/guides/automatic-bottle-washers-vs-alternatives](https://baby.madabase.com/guides/automatic-bottle-washers-vs-alternatives) | 优化 | The washer-versus-alternative query family matches this existing canonical. Replaced generic template prose with complete-load fit, hands-on time, detergent/maintenance and existing-dishwasher comparison; retain the three-way overview as supporting context. |
| [/guides/nursery-glider-chairs-safety-and-skip-guide](https://baby.madabase.com/guides/nursery-glider-chairs-safety-and-skip-guide) | 优化 | No disclosed queries, but the safety page omitted a central decision. Rebuilt it around adult alertness, unsafe infant sleep on soft chairs, controlled transfers, moving parts and cords, with AAP sources. |
| [/guides/infant-bath-tubs-safety-and-skip-guide](https://baby.madabase.com/guides/infant-bath-tubs-safety-and-skip-guide) | 优化 | No disclosed queries, but generic text and an unrelated feeding source did not answer bath safety. Added continuous adult reach, approved surface/insert, locks, water checks and stop conditions with CPSC guidance. |

31 个保留页面同样已核验，不是漏掉：逐页原因、查询来源、原始指标及当前内链记录见 [priority-decisions.json](priority-decisions.json)。CalDigit 可见查询仅解释 3 次展现，不能据此重写其余隐藏查询的目标；Litra Glow 等已获点击的内容保持保护。

## 购买路径与事实修正

- 桌高计算器由身高倍数改为实测肘高减键盘厚度，支持坐姿 / 站姿、小数、错误输入和重置；正文增加测量表和计算器内链，取消无关办公椅推荐。
- 尿布计算器增加天数输入、允许 0 月龄并对不足整天向上取整；移除与尿布计划无关的消毒器购买入口。
- 重写婴儿浴盆、哺乳椅安全、视频会议排障和奶瓶清洗替代方案中的泛化段落；以 CPSC / AAP / CDC / Zoom 等一手资料补充具体判断。
- 修正 FlexiSpot E7 Mini 尺寸冲突和保修范围、Elgato 亮度所需供电、Dr. Brown 操作周期及容量、Ergotron HX 20–42 lb 限制、Harmony / Omni 对比；UREVO 移除错误显示器支架关联。
- Furbo 精确 ASIN 为付费激活、至少三个月承诺，页面已区分它与另售独立机型；eero 明确三路由器套装；TRENDnet 修正为单模 LC 光纤模块，两件套不再误称 RJ45。
- 既有 Branch / HON、Anker、GROWNSY、Style 证据清理与 6 个索引修复、37 个发现入口修复保留；移除展示给读者的内部治理文案。
- 地区版补齐可验证替代商品读取及明确暂停说明；不把另一个商品伪装成原产品。

完整商品审阅覆盖原 304 个 ASIN，另包含先前单独核验的 HON 正确 ASIN，共 305 个。修复后有效商品 294 个，格式和站点 tag 检查 294/294；这不等于全部美国尺码 / 颜色有货。原始页面、具体购买区和异常判断分开保存，详见 [merchant-decisions-final.json](merchant-decisions-final.json)。

新增暂停的 11 个 Amazon 精确商品：

| 站点 / 商品 | ASIN | 原因 |
|---|---|---|
| baby / nanit-pro-smart-baby-monitor | B0FMZ3H8SB | Amazon Page Not Found |
| smarthome / govee-wifi-water-leak-detector-3-pack | B07J9HZ5VN | Currently unavailable in the checked Amazon buy box |
| baby / family-table-booster-seats | B01M8QX6OE | Teal title, Aqua/Grey selected color, and a different selected ASIN |
| baby / family-hip-seat-carriers | B0DPHQHWF7 | Currently unavailable in the checked Amazon buy box |
| smarthome / family-diy-smart-alarm-kits | B0DXKDM9TX | Currently unavailable in the checked Amazon buy box |
| pet / family-open-top-self-cleaning-litter-boxes | B0H5X15MHS | Currently unavailable in the checked Amazon buy box |
| baby / medela-harmony-manual-breast-pump | B0C2YYKKZF | Currently unavailable in the checked Amazon buy box |
| network / family-network-attached-storage | B0H6PB35VV | Amazon Page Not Found |
| network / netgear-orbi-970-wifi-7-mesh | B0CGJGXFCS | Selected RBE973S three-pack shows a Used: Very Good offer from Atomic Cellular |
| smarthome / family-smart-wall-switches | B0FXY66W99 | 2-gang wall switch lists a 10-kiloamp current rating and 100-volt operating voltage |
| homeoffice / elgato-key-light-neo | B0FDBL5MVM | No featured offer; Sellers on Amazon drawer shows only Used - Like New from Gear(4)Less |

其中 Orbi 和 Elgato 是本次看到的报价仅为二手，未宣称全球缺货；配送到中国受限的页面也未当作全球缺货。买家必须核对具体配置、卖家、目的地和最终结算条件。

Wellness 13 个商家地址均正常、名称对应；逐个检查变体库存后，Floral Embroidery Underwire Set 的 30 个变体及 Floral Sheer Lace Kimono 的 35 个变体全部缺货。两者页面卡片暂停链接，直接访问旧 CJ 路由也返回明确不可用；其他部分变体缺货的商品没有被误停。13 款旧固定价格改为按尺码 / 颜色在商家确认。

## 最终核验

| 核验项 | 结果 |
|---|---|
| 53 个重点页 + 异常商品相关页 | 82/82 状态、canonical、H1、描述、JSON-LD、屏蔽链接与关键答案通过 |
| 6 个 Amazon 站及地区版购买路径 | 5,930/5,930；明确暂停状态也纳入检查，不强行补无关商品 |
| 有效 Amazon URL / tag | 294/294，独立于商品库存判断 |
| Wellness sitemap 页面 | 12/12 |
| Wellness 本地购买路由 | 13/13：11 个正常、2 个暂停；未访问实际联盟跳转 |
| 浏览器交互 / 390×844 布局 | 两个计算器及重点指南 / 缺货卡片通过，未见横向溢出 |
| 静态与构建 | Affiliate / Wellness ESLint、类型及生产构建通过；SEO 和既有 CTR cohort 检查通过 |
| 原审计基线 | 1,401 个页面及 97/97 重定向；是此前抓取记录，不冒充当前线上健康 |

核验文件： [页面复验](priority-and-merchant-runtime-final.json)、[Amazon 路径](conversion-paths-amazon-final.json)、[Wellness](wellness-runtime-final.json)、[交互](interactive-runtime-final.json)、[发布包哈希](release-packages-final.json)。

## 明确未完成的外部项

1. **GSC**：115 个到期零展现 URL 已检查 92 个，续查记录中的 86 个均显示在 Google 上；剩余 **23 个**被 Google property URL inspection daily quota 阻塞。精确清单保存在 [remaining-live-inspections.json](remaining-live-inspections.json)。已收录不代表获得展现；先前 6 个异常页也不能因本地修复就改记为恢复。
2. **Costume**：发布后 32 个目录依赖分类／编辑页的购买入口、76 个商品发现路径全部通过。两个同名 Santa 页现在可读，分别显示 $150／$450；商家具有 Rent／Buy 选项，但具体追踪目标变体映射仍需现有目录记录证明。未合并或删除。
3. **服务器与效果**：三个服务已发布并验证，90 个精确变更 URL 获 IndexNow HTTP 200。服务、资源、发现路径和浏览器 QA 排除已核验；仍须按原 cohort 闸门观察搜索效果，不能把上线视为流量恢复。历史服务器事件根因未证实，本次没有整机重启。
4. **归因与收益**：CJ 收益不可读取，Amazon Other 尚未归因，Clarity 历史 QA 污染无法靠新版追溯清除。没有编造收益、改 tag 抢归因或声称流量已恢复。

## 发布包与代码

Affiliate / Wellness 两个最新包已经包含本轮修复，Main 沿用先前 4883d9c 的包。三个包均已正式发布；实际目录、哈希、服务状态与回滚路径见正式发布记录。

- `apps/affiliate/.release/affiliate-runtime.tgz`：SHA-256 `5452695a40221ac3fb770e49e48103ddb4f0df52b892f77e00755955adc1e0d0`。
- `apps/wellness/.release/wellness-runtime.tgz`：SHA-256 `d48213b0a00c65f4dec34e1b01ac4b555541928cd802508b44d6f42eeaa9c349`。

对应提交可通过 `git log -- apps/affiliate/reports/seo-audit-2026-09-24/completion-2026-09-25.md` 查找；本记录与源码、最终证据一起提交。

Furbo 定价在最终复核时与[官方价格说明](https://help.furbo.com/hc/en-us/articles/17462739016089-Furbo-Nanny-Plans-and-Pricing)和[美国官网](https://furbo.com/us/pages/furbo-nanny)一致；促销、预付账期及续费仍以结算条款为准。

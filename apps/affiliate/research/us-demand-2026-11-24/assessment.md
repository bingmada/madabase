# Madabase 美国需求、搜索前十与商品覆盖核查

核查日：2026-11-24。交付范围：三个已有方向的覆盖核对、五组 Google 搜索前十、奶瓶清洗机公开需求估算，以及一款商品的小批量本地实现。**未发布到线上。**

## 判断

先验证奶瓶清洗机中具体型号与装载条件的缺口，新增 Momcozy DeepClean D8 一款，以及 D8 / KleanPal Pro 比较页；不再新增一个泛泛的“最佳奶瓶清洗机”清单。Deco 和 Aqara 的已知主力商品、比较及配置指南已有覆盖，这次不为相同型号重复建页。

搜索需求存在不代表 Madabase 能取得相应流量。11 月 23 日的既有 GSC 审计显示：10 月 25 日至 11 月 21 日 340 次展示、0 次点击，上一个等长窗口 835 次展示、3 次点击；同一组 1,145 条 sitemap URL 中，已索引数量从 11 月 6 日的 900 降到 11 月 16 日的 598。索引覆盖和有效展示是目前更直接的瓶颈。该快照并非 11 月 24 日的实时索引状态，也不能证明某次改版造成下降。大批加商品不能代替索引和内容价值验证。

既有数据入口：`apps/affiliate/reports/search-impact-2026-11-23/assessment.json`。此次没有重新查询 GSC/Bing，也没有把站内展示量当成美国市场总搜索量。

## 搜索量：公开估算，保留未知

用户选择不绑卡，Google Ads 账单设置未完成；没有接受付款条款、添加卡或投放广告。没有取得登录后的 Keyword Planner 月搜索量。Ahrefs 免费页面也未返回可用结果。

下表来自 [KWS Trends 美国报告](https://www.kwstrends.com/keywords/us/bottle-washer)，页面更新于 2026-10-26，口径为美国 Google Web Search 的过去 12 个月月均估算。其[方法说明](https://www.kwstrends.com/methodology)称会综合 Keyword Planner、Trends 和另一关键词库并校正；我们未独立验证其算法。这些是第三方估算，不能标成我们直接取得的 Google 官方数据，也不能把相近品牌词相加。

| 查询词 | 估算月搜索量 |
| --- | ---: |
| bottle washer | 16,000 |
| momcozy bottle washer | 45,000 |
| baby brezza bottle washer | 22,000 |
| baby brezza bottle washer pro | 15,000 |
| baby bottle washer | 9,900 |
| momcozy kleanpal pro bottle washer | 4,900 |
| papablic bottle washer | 4,400 |
| eufy bottle washer | 1,900 |
| best bottle washer | 1,300 |
| baby brezza vs momcozy bottle washer | 1,000 |

交叉检查：[Treendly](https://treendly.com/trend/baby-bottle-washer)对同一个 `baby bottle washer` 显示 Google 7,100/月，KWS 为 9,900/月；两者已存在差异，Treendly 没明确列出该数字的统计期间。只能认为这个方向有需求，不能精确预测流量。Treendly 的 Amazon 搜索量不混入此表。

`momcozy deepclean vs kleanpal pro`、D8 单型号、ProWash360、无排水管等精确长尾的月搜索量仍未知；品牌词量级不能直接归给 D8。Deco/Aqara 的本次选定查询也未取得可核验的公开 Google 月量，未使用 Amazon 周搜索量替代。26 个种子词并未全部取得数值。

## 现有覆盖与小批量决策

以实际运行的 `siteProducts/siteGuides/siteRoundups` 加 `publishedCommerceInventory()` 检查。商品家族库存也计入，不能只搜 content.ts 的原始数组。已对照 11 月 23 日上线 URL 清单。

| 方向 | 已有覆盖 | 本次判断 |
| --- | --- | --- |
| Deco | BE25、BE63、BE67、BE85 与相关比较、Ethernet backhaul 指南 | 不补重复 SKU；前十有 RTINGS、零售比较和实际使用内容，只有商品数量难以形成优势 |
| Aqara | Hub M3、M2 相关比较、Home Assistant 配置指南 | 不额外堆 Hub 商品；搜索问题更偏配置、版本和生态兼容 |
| 奶瓶清洗机 | KleanPal Pro BS03、Bc Babycare Clarvion，以及家族库存内 Baby Brezza Bottle Washer Pro Charcoal B0DDLGJG5J | Bottle Washer Pro 已存在，不重复录入；它也不能与只消毒/烘干的产品混为一类 |
| Momcozy D8 / BW05 | 原页面只提型号边界，无独立商品页 | 补一款 B0H6Q2G76Z；比较完整装载、排水条件与 US 版本，避免伪造实测优劣 |
| Baby Brezza ProWash360 | 未见独立 SKU | 官方 US 说明书确认使用排水管，不能继承旧 Bottle Washer Pro 的双水箱无管结论；未核实确切 Amazon ASIN，暂不新增购买链接 |
| eufy S1/S1 Pro、Papablic SafeguardPlus | 此次选定库存中未见对应新型号 | 先留候选；不因品牌搜索量直接补商品，仍需确切版本、原说明书与零售去向 |

## 搜索前十对新增页面的约束

五组共 50 条排名链接见下文，完整字段也保存在evidence.json。都是 Google **Web 筛选**，`gl=us`、`hl=en`、关闭个性化，页面位置显示 Los Angeles, California / IP。不是 All 页包含广告、购物、视频块后的统一第 1–10 位，也不是全国固定排名。

- `bottle washer`：品牌、商家、社区占据多数。新增泛类目页不能仅靠“多收几个产品”竞争。
- `deco be63 vs be67`：已有测试站和零售参数对照；我们已覆盖两款，先维持精确包数、端口和使用场景。
- `aqara hub m3 home assistant`：官方集成、论坛和配置讨论明显；新增 SKU 无法解决配置问题。
- `momcozy deepclean vs kleanpal pro`：有 Babylist、FromMom2Mom 两篇文字比较及大量视频/社区内容。已阅读这两篇的核心比较，Babylist 提供实际使用与装载/柜台细节，不能称为弱竞争。我们限定为原始文档支持的型号、整批装载和排水选择，不冒充亲测或重写他人体验。
- `bottle washer without drain hose`：用户在找安装约束，品牌内新旧型号的答案相反。把该区别补进已有任务指南，不另建重复泛指南。

竞品原文：[Babylist D8 / KleanPal](https://www.babylist.com/hello-baby/momcozy-kleanpal-pro-vs-deepclean-d8-bottle-washer)、[FromMom2Mom 比较](https://www.frommom2mom.com/blog-pages/momcozy-d8-vs-kleanpal-pro-which-bottle-washer-is-right-for-you)。没有从这些页面转述个人使用经历为本站实测。

## 商品事实与版本边界

D8：品牌官网 Buy from Amazon 对应 B0H6Q2G76Z。11 月 24 日在 Amazon 将配送市场选为 US ZIP 10001 后，看到 D8 标题、120 V / 60 Hz、In Stock 购买区、Smartlin 销售/Amazon 配送；抓取的购买区没有单独证明所选成色。此为当时的页面状态，没有下单，不能保证未来库存和退货资格。

D8 美国电压由品牌产品页 US FAQ、支持参数表及所选零售页面共同支持。但 BW05 支持菜单所链接英文 PDF 是 220–240 V 欧洲版，不能当成美国说明书。其尺寸与循环时间也与其他支持表不一致。新增页面没有使用这些冲突数字决定安装间距、完整周期、连续使用或速度排名；要求购买前取得对应 US 版本说明。

原 PDF 均已本地下载并核对完整页面与装载/排水图。D8 欧洲版本页 10（物理第 11 页）确认电压；ProWash360 US 说明书打印第 5–8 页确认排水管和翻转架的不同容量。下载地址和 SHA256 见 JSON，避免以后误用相同文件名的新修订。

主要来源：

- [D8 产品与 US FAQ](https://momcozy.com/products/momcozy-deepclean-baby-bottle-washer-d8)
- [BW05/D8 参数表](https://support.momcozy.com/article/54385378995865)
- [D8 支持入口](https://support.momcozy.com/product/bw-05)
- [D8 确切 Amazon 选择](https://www.amazon.com/dp/B0H6Q2G76Z)
- [ProWash360 US 说明书](https://cdn.shopify.com/s/files/1/1465/2384/files/BRZ0261_ProWash360_IM_US_260930.pdf?v=1790788351)
- [CDC 婴儿喂养用品清洁指导](https://www.cdc.gov/hygiene/about/clean-sanitize-store-infant-feeding-items.html)

## 本地实现与验证

- 新商品：`/reviews/momcozy-deepclean-d8-bottle-washer`，一款确切 ASIN，Baby 追踪 ID 为 `madabasebaby-20`。
- 新比较：`/best/momcozy-deepclean-d8-vs-kleanpal-pro`，两款真实已有/新增商品可解析。
- 更新已有 `/guides/bottle-washer-vs-sterilizer-vs-dryer-guide`，加入排水/型号区别及两条新页面入口；旧 Bottle Washer Pro 购买路径保留。
- D8 使用明确标注的原创选择图，不以插画冒充产品照片；没有引入商家照片、价格或评分。KleanPal 原有无实测依据的评分/分项分数也已移除，保留原文档事实。
- 改动文件 ESLint、TypeScript 检查通过；运行时检查确认新增 ASIN 唯一、当前 Baby 标签、两款比较商品及指南关联可解析、没有虚构评分。
- Chrome 桌面 1920 与手机 390×844 核查通过：商品图加载、购买标签、两篇新页 canonical、指南入口和原 Bottle Washer Pro 购买路径正确；手机页面没有整页横向溢出，比较表在自己的容器内横向滚动。已验证相关商品卡的懒加载图片。新增两页的非美国市场描述仍为既有 compatibility 状态，没有新增区域 sitemap 收录条目。
- 未运行整站生产构建、未执行生产发布或重启。仅本地开发预览在 127.0.0.1:3127 运行。

## 后续验证依据

本批只有 1 个新增 SKU、2 个新页面，不扩成大量 AI 商品文章。上线后先确认真实可抓取、canonical、索引资格、内链和新联盟归属；“URL 提交成功”不计作已索引。GSC/Bing 出现完整报表后看对应 URL 的索引、查询展示、自然点击及可靠的商家点击记录。低样本期间不按单日涨跌断言成功；没有成交归因时不把访问或按钮点击当佣金。

暂不追加下一批，直到这些页面至少得到真实抓取/展示信号，或发现明确的型号/购买路径缺陷需要修正。

## 五组搜索前十原始链接

### aqara hub m3 home assistant

| Web 位次 | 页面 |
| ---: | --- |
| 1 | [Aqara M3 Hub is complete nonsense for Home Assistant ...](https://www.reddit.com/r/Aqara/comments/1f62mfg/aqara_m3_hub_is_complete_nonsense_for_home/) |
| 2 | [Aqara M3 Hub - Hardware](https://community.home-assistant.io/t/aqara-m3-hub/730085) |
| 3 | [How to add Aqara M3 into Home Assistant? - Hardware](https://community.home-assistant.io/t/how-to-add-aqara-m3-into-home-assistant/876343) |
| 4 | [How is the Aqara M3 Hub working with Home Assistant a ...](https://www.youtube.com/watch?v=-0yv5m6TCo8) |
| 5 | [Aqara](https://www.home-assistant.io/integrations/aqara/) |
| 6 | [Aqara M3 Hub - Adding device and usable entities](https://community.home-assistant.io/t/aqara-m3-hub-adding-device-and-usable-entities/805007) |
| 7 | [Aqara, Matter and Home Assistant - Share your setup and ...](https://forum.aqara.com/t/aqara-matter-and-home-assistant-share-your-setup-and-experience/299420) |
| 8 | [How does M3 hub compare to Home Assistant?](https://www.facebook.com/groups/267249817311678/posts/1924836041553039/) |
| 9 | [Home Assistant Discovering Aqara M3 Hub](https://forum.aqara.com/t/home-assistant-discovering-aqara-m3-hub/357931) |
| 10 | [Aqara M3 Hub with Matter and Thread: Real Home Assistant ...](https://chrishansen.tech/posts/Aqara-M3-Hub/) |

### bottle washer

| Web 位次 | 页面 |
| ---: | --- |
| 1 | [Baby Bottle Washer](https://www.amazon.com/baby-bottle-washer/s?k=baby+bottle+washer) |
| 2 | [Papablic SafeguardPlus™ Baby Bottle Washer System ...](https://papablic.com/products/papablic-safeguardplus-baby-bottle-washer-system?srsltid=AYCX9vI1YTs3DU6VsZ_6jTrUMikRuTLI25811Tq5vTyO5He3WEIEEKr4) |
| 3 | [Bottle washers - worth the splurge? : r/Buyingforbaby](https://www.reddit.com/r/Buyingforbaby/comments/1i4guq3/bottle_washers_worth_the_splurge/) |
| 4 | [Baby Bottle Washers – Wash, Sterilize & Dry](https://babybrezza.com/collections/baby-bottle-washers?srsltid=AYCX9vJKC6aT6CQN3aqKp7unpBYnhxIq4KoqCv2_43JD0OPvjbAY4msK) |
| 5 | [Bottle Washers & Sterilizers](https://www.babylist.com/store/bottle-washers-sterilizers) |
| 6 | [Best Baby Bottle Washer? I Tested 3 So You Don't Have To!](https://www.youtube.com/watch?v=2yT178EF0LU) |
| 7 | [Momcozy Feeding Bottle Washer, Sterilizer and Dryer](https://momcozy.com/collections/bottle-washers) |
| 8 | [What are pros and cons of hose bottle washers for baby ...](https://www.facebook.com/groups/newbornbabymothercaretipsguides/posts/2607742796373500/) |
| 9 | [You Can Pay Over $300 for a Countertop Bottle Washer. ...](https://www.nytimes.com/wirecutter/reviews/advice-baby-bottle-washers/) |
| 10 | [Baby Bottle Washer, Sterilizer & Dryer Collection](https://grownsy.com/collections/baby-bottle-washer?srsltid=AYCX9vLdibzrc9YceVsYULgIiRHwpxD8-eo-iN90XVaFHqJSSQRydhmK) |

### bottle washer without drain hose

| Web 位次 | 页面 |
| ---: | --- |
| 1 | [Bottle washers with no drain hose : r/Buyingforbaby](https://www.reddit.com/r/Buyingforbaby/comments/1uj6eb1/bottle_washers_with_no_drain_hose/) |
| 2 | [Momcozy KleanPal Pro Baby Bottle Washer and Sterilizer](https://momcozy.com/products/momcozy-kleanpal-pro-baby-bottle-washer) |
| 3 | [Bottle Washer Pro](https://babybrezza.com/products/bottle-washer-pro?srsltid=AYCX9vKizzZxItkDkKYVSCCTuTFTPm57Oud11b9wvBG--wLdZvKLYg9u) |
| 4 | [The Best Bottle Washers of 2026, Tested by a Mom of 3](https://www.babylist.com/hello-baby/best-bottle-washers) |
| 5 | [Bottle Washer Pro - All In One Washer, Sterilizer, Dryer](https://babybrezza.me/products/bottle-washer-pro%C2%AE?srsltid=AYCX9vK9iVFIyKWu_Yv9yvA6KlCDsV-xz4PQeMCfh3vd9Cif7D0GuhzC) |
| 6 | [How to Drain The Momcozy Bottle Washer without Hose](https://www.tiktok.com/discover/how-to-drain-the-momcozy-bottle-washer-without-hose) |
| 7 | [Can you guys tell me what bottle washer dryer and ...](https://www.facebook.com/groups/newbornbabymothercaretipsguides/posts/2165170837297367/) |
| 8 | [Baby Brezza Baby Bottle Washer Pro - Clinically Proven ...](https://www.amazon.com/Baby-Brezza-Bottle-Washer-Pro-Sterilizer-Dryer-White/dp/B0CKRWC8ZN) |
| 9 | [Manual Baby Bottle Washers](https://mcbradyengineering.com/feeds/blog/manual-bottle-washer) |
| 10 | [Can Glass Baby Bottles Go in a Bottle Washer? We Tested](https://ronini.com/blogs/news/glass-baby-bottles-bottle-washer?srsltid=AYCX9vIWV91_QQE2Ew870U67Zsw3nfdcVgoDKs442rwnkxlyJFHsBRtZ) |

### deco be63 vs be67

| Web 位次 | 页面 |
| ---: | --- |
| 1 | [TP-Link Deco 7 Pro BE63 vs Deco 7 Pro BE67 - Router](https://www.rtings.com/router/tools/compare/tp-link-deco-7-pro-be63-vs-tp-link-deco-7-pro-be67/51771/139699) |
| 2 | [Compare TP-Link BE63 vs TP-Link BE67](https://www.bhphotovideo.com/c/compare/TP-Link_Deco+BE63_vs_TP-Link_BE67/BHitems/1797740-REG_1922959-REG) |
| 3 | [I Tested TP-Link's BE63 vs BE67… Here's Which Wi-Fi ...](https://www.youtube.com/shorts/zRYWIC6Lnas) |
| 4 | [Which Deco Wifi7 Unit to Upgrade from Nest Wifi Pro to](https://www.reddit.com/r/TpLink/comments/1mujbh5/suggestions_which_deco_wifi7_unit_to_upgrade_from/) |
| 5 | [Compare Product: Deco BE63 (3-pack) vs Deco BE65 Pro (3 ...](https://www.tp-link.com/us/compare/?typeId=5757&productIds=73573,80105) |
| 6 | [BE63 vs BE67 — Which Wi-Fi 7 Mesh System Is Right for ...](https://www.instagram.com/reel/DfaBcK8osBC/) |
| 7 | [TP-Link Deco BE63 vs BE67 ⚡ Which Wi-Fi 7 Mesh System ...](https://www.youtube.com/shorts/EbiMdz28lYI) |
| 8 | [TP-Link Deco 7 Pro BE14000 (a.k.a Deco BE67 or ...](https://dongknows.com/tp-link-deco-7-pro-be14000-deco-be67-be68-review/) |
| 9 | [TP-Link Deco BE63 vs BE67: Wi-Fi 7 Mesh Speeds & Ports ...](https://www.facebook.com/61583927664436/videos/better-wi-fi-smoother-connections-and-seamless-streaming-stay-connected-without-/1154906390870119/) |
| 10 | [Deco BE63 vs. Deco BE67 📶 I put both Wi‑Fi 7 mesh ...](https://www.instagram.com/reel/Df7SGQcgYPY/) |

### momcozy deepclean vs kleanpal pro

| Web 位次 | 页面 |
| ---: | --- |
| 1 | [KleanPal Pro vs. Momcozy D8: Which Bottle Washer Is ...](https://www.babylist.com/hello-baby/momcozy-kleanpal-pro-vs-deepclean-d8-bottle-washer) |
| 2 | [Momcozy KleanPal Pro vs D8 DeepClean: Which One Is ...](https://www.youtube.com/watch?v=bLkZNL6_38E) |
| 3 | [MomCozy classic KleanPal bottle washer or the newer ...](https://www.reddit.com/r/Buyingforbaby/comments/1s4khgn/momcozy_classic_kleanpal_bottle_washer_or_the/) |
| 4 | [DeepClean D8 vs. KleanPal Pro  /  Which One Is Right for ...](https://www.youtube.com/watch?v=6BQaQLfvwdU) |
| 5 | [If a bottle washer is on your baby registry, here's how the ...](https://www.instagram.com/reel/Db9kFGMNM3n/?hl=en) |
| 6 | [Momcozy Bottle Washer Comparison](https://www.youtube.com/watch?v=bO5j_o39AeY) |
| 7 | [The highly requested comparison of the Momcozy ...](https://www.facebook.com/helebell511/videos/the-highly-requested-comparison-of-the-momcozy-deepclean-d8-new-washer-vs-the-cl/2142292513328398/) |
| 8 | [Momcozy KleanPal Pro vs Momcozy D8: Which Bottle ...](https://www.frommom2mom.com/blog-pages/momcozy-d8-vs-kleanpal-pro-which-bottle-washer-is-right-for-you) |
| 9 | [Which Momcozy bottle washer is best for you? (KleanPal ...](https://www.amazon.com/live/video/069f55a673774418a2bb86afc2bb1aef?ref_=dp_vse_rvc_4) |
| 10 | [Momcozy KleanPal Pro vs. DeepClean D8 bottle washer ...](https://www.tiktok.com/@hisamantharose/video/7683633838131645727) |

本文件保留上线前审计基线；后续已授权修复、上线与线上验收结果见 [商品与转化修复报告](../commerce-repair-2026-10-19/README.md)。下文的旧按钮和待实施描述属于修复前状态。

**10月19日综合审计：先修商品可买性和转化计量，保护 Bing / AI 已有入口，再有选择地更新商品与选购依据。**

这次查看了 GSC、Bing 搜索与 AI Performance、Clarity、Amazon Associates，检查了运行时商品目录、点击接口、七站公开页面和 robots，并用美国配送地区抽查13个 Amazon ASIN。线上页面、商品映射、搜索提交和服务器配置均未改动。目标是有效搜索访问、有效商家点击和可结算收益。

**最需要处理的三个问题**

1. **已有点击被导向缺货商品。** Clarity 最近7天唯一的 `affiliate_click` 会话来自 Baby 的 [学习塔选购指南](https://baby.madabase.com/guides/toddler-learning-towers-buying-guide)。线上首屏与正文两个按钮仍指向 Little Partners Original Learning Tower LP01411 Natural、ASIN `B001ECHXVC`。10月19日按纽约10001配送核验，Amazon 显示 `Currently unavailable`，不知道何时补货。这是确定的购买路径问题，不能靠改标题解决。下一次实施应先停用这个精确报价，找到同用途且型号、安全与供货证据齐全的替代品后再启用购买入口；保留指南 URL、主题与已有答案。
2. **内部点击记录存在确定的代码缺口。** 指南按钮发送 `family-品类-ASIN`，API 却只用 `findProduct()` 查普通商品。四个真实点击过的指南，其实际生成标识在本地运行时查找均失败；当前 API 分支会返回400，前端没有检查返回状态。Clarity 事件在请求前发送，Amazon 直接链接仍带站点标签，所以这两处可能有数据而内部表缺失。这里确认的是源码逻辑，未发送线上伪点击，也未获取生产错误频次；不能把内部漏记误判成用户没有点击。
3. **旧检查清单没有覆盖完整商品目录。** 运行时可用 Amazon 报价505条，按“站点+ASIN”去重504组；原检查器294条覆盖当前目录294组，**另210组未纳入**。六个老商品的ASIN只写在购买URL中，已在最终核对时解析补全，避免当作未知身份重复或漏算。294/294通过只证明那批 URL 和标签格式。公开品类目录355件，其中349件没有配置报价屏蔽；这355件的结构化核验日期都停留在8月9–13日，距今67–71天。页面更新时间和商品核验时间必须分别管理。

公开链接证据见 [public-family-audit.json](public-family-audit.json)，代码复现见 [family-validator-reproduction.json](family-validator-reproduction.json)，完整商品覆盖差异见 [checker-coverage-gaps.csv](checker-coverage-gaps.csv)。

**搜索表现：Google 还没有形成点击恢复，Bing 和 AI 已经有值得保留的入口**

GSC 完整周为10月10–16日，对比10月3–9日；28天为9月19日–10月16日，对比8月22日–9月18日。以下 Google 数字按 Pages 表汇总站点。Bing 为后台30D窗口，标签9月19日–10月18日，最新可用日为10月17日；AI 列来自明确标为抽样的页面导出，不能当总引用量或访客量。不同窗口和不同平台不做直接增减率比较。

| 站点 | Google 7天展示：前→今 | Google 28天展示：前→今 | Google 28天点击：前→今 | Bing 30D 展示 / 点击 | Bing AI 30D 页面样本引用 |
|---|---:|---:|---:|---:|---:|
| Network | 6→33 | 194→83 | 5→0 | 353 / 14 | 463 |
| Smarthome | 27→20 | 66→123 | 0→0 | 231 / 9 | 97 |
| Homeoffice | 11→22 | 3813→1155 | 13→10 | 57 / 0 | 44 |
| Baby | 11→13 | 2128→975 | 7→6 | 44 / 3 | 131 |
| Pets | 7→17 | 51→73 | 0→0 | 11 / 0 | 11 |
| Style | 1→10 | 1→12 | 0→0 | 1 / 0 | 0 |
| Costume | 0→9 | 5→10 | 0→0 | 9 / 1 | 8 |

七站 Google 本周和前周点击均为0。按页面汇总，28天2431次展示、16次点击，前28天6258次展示、25次点击。虽然近一周曝光页面变多，但不少只有一次展示，且含首页、分类和政策页，不能把这个变化当作购买流量已经恢复。

GSC 全域顶部卡片是另外一个统计口径：完整周58对64次展示、0对0点击；28天2246对6065次展示、16对25点击。顶部卡片与 Pages 表按不同粒度聚合，不能混用；七站数已排除主站、Tools、Wellness 等。平均排名变好还可能来自曝光组合变化，不能单独解释为排名恢复。

最新24小时七站 Pages 合计28次展示、0点击；10月13日保存的同口径快照为5次展示、0点击。今天 Baby22、Smarthome2、Pets2、Network1、Homeoffice1，Style和Costume为0。对应全域顶部卡片为9次展示，仍有约5.5小时延迟。只是很小的早期曝光变化。

10月13日改动的精确14页，今天24小时有3页共4次展示：Baby 背带姿势2、FP300评测1、便携显示器接口指南1，其他11页为0。完整周仅4页有展示、合计12次，点击仍为0。28天里的历史点击大多发生在本轮修改之前；不能拿来证明10月13日修改有效。逐页结果见 [cohort-2026-10-13.json](cohort-2026-10-13.json)。10月20日完整批次检查仍需执行，不能以这次早期观察替代。

Bing 七站30D共706次页面展示、27次点击，主要在 Network 和 Smarthome。全域每日数据10月11–17日5点击/321展示，前7天7/335，没有持续增长的证据，但也没有 Google 式全面失去入口的证据。这组每日数含非联盟属性，仅用于全域背景。

**Bing 保护要落实到具体页面**

已把 Bing 有展示、点击或 AI 引用的七站页面合并为181条 [保护清单](bing-protection-ledger.csv)。其中尤其保留：

- Xfinity 网关桥接/自有路由器指南：79展示、3点击；Deco BE63/BE67/BE85选型：31展示、2点击；BE63/BE67两件与三件套指南还有1点击。
- Aqara M3 与 Home Assistant：63展示、2点击；U400/U100比较：10展示、2点击；Tapo插座比较、Eufy本地存储等也已有点击。
- Omni Breeze 按年龄背法：8展示、1点击；儿童增高餐椅安全指南：4展示、2点击。
- Costume 的 Woochie Dark Lord 商品页：1展示、1点击，虽然样本小，也不能因 Google 暂时弱就删除。

下一次实施保留这些 URL、canonical、主题和目前生效的永久跳转，先做报价核验、型号说明、选型表和点击计量。合并决策必须联查 Google、Bing、AI 和商家点击；仍被 AI 引用的历史合并源应保持有效跳转，不恢复成重复页。每一小批修改前后检查链接、移动端、canonical、robots、现有跳转及全部改动 URL，分别观察两引擎7天数据。小样本单日回落只能触发复核，不能自动回滚有用内容。

**AI 已经带来有价值的信号，但引用、访问、点击、订单是四件事**

Bing AI 后台30D总引用939次，平均每天约11个页面被引用。导出的85个页面是样本，合计758次，其中七站754次。不能把引用当点击，也不能拿 ChatGPT 的会话数除以 Bing 引用数计算转化率。Microsoft 的[官方口径](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)说明它覆盖 Copilot、Bing AI 摘要和部分合作入口，引用数据本身不测排名、访客或订单。

AI grounding 查询与实际点击可互相补充：`how to choose a safe toddler tower` 有50次样本引用；另有双WAN路由、显示器USB-C Hub便利性、智能锁兼容等问题。它们是检索分组短语，不能冒充完整用户提问或月搜索量。

Clarity 最近30天174个人类会话，另排除1521个机器人会话；平均每会话1.12页、滚动29.48%、活跃30秒。这个项目包含主站，因此不是七站纯自然访客分母。记录到5个联盟点击会话，分别落在学习塔、网线钳、门把手保护罩、视频灯比较、吸音板指南；其中3个落地 URL 带 ChatGPT UTM，不能据此断言产生了3个 AI 订单。来源卡片可见 Bing20、DuckDuckGo19、Google11、ChatGPT3个会话，UTM与referrer会有不同，不能相加去重。这5个点击会话按站点分别为：Baby2、Homeoffice2、Network1，其他四站没有记录；不能把“未记录”扩展为各站所有商家都绝无点击。

Google AI 新报告28天顶部146次展示，Pages 中 Homeoffice112、Baby33次，其他七站没有记录；最近完整周七站没有 AI 页面展示。Google AI 与普通 Web 指标可能覆盖同一搜索呈现，不加总。Clarity 自己的引用面板尚未配置，界面需要不可更改的单一域名选择，本次保持现状，使用已可读的 Bing/GSC 报告。

七站当前 robots 均200，允许公共内容和 OAI-SearchBot，禁止 `/api/`。这说明规则文件没有统一封闭搜索入口，不能证明 Cloudflare 对每种爬虫都放行；本次没有拿到爬虫日志或防火墙事件。`llms.txt` 已有，但不是增长项目的核心；Google [官方指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)强调独有、可靠的内容和正常 SEO，不使用 llms.txt 来提升可见性。

AI 内容质量方面，发布清单包含866篇指南，其中721篇带品类关联；规模本身不是质量证明，也不能据此宣称被“AI处罚”。下一轮优先加入可核查的型号差异、设备/家庭条件、图表计算、安装限制和明确不适用情形，保留研究综合的证据标签；不伪造实测、评价或作者经验。给用户到站的理由应是具体决策价值，例如同等套装的端口规划、Mac芯片与双屏路径、桌板与夹具测量，而不是故意藏答案或堆更多问答页。

**商品是否过时：局部需要更新，但“全站都因旧型号没人搜”不符合证据**

13个ASIN的现场结果见 [merchant-sample.csv](merchant-sample.csv)：11个明确有货或低库存，学习塔缺货，TONOR吸音板确认了商品身份、普通价购买选项和默认Prime专享入口，但未完成普通价购买状态核验。这个抽样不能扩展成504组商品都可售。美国地区结果不能等同其他国家；现有 Creators 库存脚本在GB/CA/DE/NL均没有精确本地映射或本地标签配置，OneLink也不能被当成已逐件核验的本地商品。

| 商品/主题 | 本次证据 | 下一轮处理 |
|---|---|---|
| Little Partners 原版学习塔 LP01411 | 当前真实点击入口，精确ASIN缺货；两个线上购买按钮仍存在 | 最优先停用缺货报价，核验替代品再恢复；保留已有指南入口 |
| Omni Breeze | 仍有 Google/Bing/AI 信号；所选款只剩1件；厂商已有 Omni Deluxe | 保留 Breeze 的使用/安全问题，补充新购时的 Breeze/Deluxe取舍，复查供货、颜色与价格带 |
| CalDigit TS4 | 当前有货；Bing评测页24展示；厂商已有 TS5 / TS5 Plus，当前发布目录未覆盖 | 补当前代际与主机接口选型；TS4评测保持TS4身份，不能把旧ASIN按钮伪装成TS5 |
| Insta360 Link 2 / 2C | Link 2有货；官方已有 Pro 两款，当前发布目录没有对应产品 | 对办公比较页补预算、固定机位/云台、拾音与Pro差异；先核验新款精确报价，不因“新”直接替换 |
| Deco BE63 / BE67 | BE63三件套有货；亚马逊提示BE67新款，站内实际上已有BE67比较和评测 | 主要改购买路径：现有三型号比较指南只有BE63直接购买按钮，另外两款依赖继续跳转。按已验证的型号/套装给清晰出口，保留已有判断与排名主题 |
| Aqara U400 / FP300 | 新型号已覆盖且有货，U400比较还有Bing点击 | 优先兼容性与控制器/区域说明、转化计量，不继续堆新型号页 |
| Coway Mighty2 | 已覆盖当前代际且有货 | 优先可用房间大小、滤芯成本、异味边界和购买匹配，更新换代不是当前首因 |
| Philips SCF358、Klein VDV226-110 | 对应商品有货，仍有型号查询或真实点击 | 保留明确型号用途，复查版本与规格，不按上市年份一刀切淘汰 |
| Loungefly / Style | 抽样老款有货，厂商有持续新款，但站点只有极少搜索曝光 | 保持维护；款式新品需真实需求和精确Amazon供货证据，不能照厂商新品列表批量扩页 |
| Costume | 有Bing和AI入口，当前为授权CJ商家，不在Amazon产品池 | 本季先核对实际款式、可售与到货时间；本次没有新的CJ订单/库存导出，不把它算作Amazon零订单 |

更新依据：[CalDigit当前对比](https://www.caldigit.com/compare-thunderbolt-stations/)、[Insta360 Pro产品](https://www.insta360.com/product/insta360-link2-pro)、[Ergobaby Omni Deluxe](https://ergobaby.com/en-us/products/omni-deluxe-baby-carrier)、[TP-Link BE63当前规格](https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be63/)、[Aqara U400官方发布](https://www.aqara.com/en/news/aqara-introduces-uwb-powered-smart-lock-u400-at-ces-2026/)、[Coway Mighty2](https://cowaymega.com/products/airmega-mighty2-ap-1512n)、[Loungefly新品](https://loungefly.com/new-trending/new-arrivals/)。这些厂商链接用于事实核验，未新增为购买商家。

替代学习塔时还有一个必须区分的型号问题：CPSC [召回公告](https://www.cpsc.gov/Recalls/2026/Little-Partners-Recalls-Childrens-Grow-N-Stow-Folding-Learning-Towers-Due-to-Fall-Hazard)涉及 Grow ’N Stow **LP01711** 的特定日期批次，当前缺货商品记录为 Original **LP01411**。本次没有把两者混为一款，也没有把缺货原因解释为召回。不能为了“更新”就盲目改推同品牌折叠款。

**收益侧：需要更多合格商家点击，推荐商品本身尚未验证成交**

Amazon US 9月18日–10月17日：14次点击、10件订购、10件发货、1件退货，订购额57.45美元，发货佣金1.06美元减退货佣金0.48美元，净0.58美元。10件全部是间接购买，推荐商品直接购买为0。后台71.43%是商品件数/点击数，不是71%的访客购买了推荐商品。10月11–17日只有3点击、0订单。

Tracking ID表把低量行折叠为Other，不能强行给七站分配订单或佣金；现有样本也不足以判断某个推荐款的转化率。既要提高合格点击量，也要改善从选购答案到正确商品的匹配。每个页面应先明确“适合谁/不适合谁/这次要买的精确型号和套装”，再给对应按钮。首屏已经有按钮，不能把“再多放一个按钮”当作主要方案。

优先保护已带点击的窄问题：网线钳、门把手罩、学习塔、灯光、吸音板。对于已有商品的使用问题，要保留无需购买即可解决的答案，给有真实购买需要的人提供准确出口；不把所有故障排查流量强推到高价新路由器或扩展坞。

**建议下一轮的实施顺序与验收**

| 顺序 | 具体工作 | 主要验收 |
|---|---|---|
| P0 | 停用学习塔缺货精确报价；复核低库存Breeze、真实点击商品及已屏蔽报价 | 缺货ASIN不再出现购买按钮；替代品型号、套装、地区、供货、授权与标签逐项一致；原URL仍正常 |
| P0 | 用运行时目录统一普通/品类商品清单；修复family点击校验，保留幂等和QA排除 | 覆盖504组当前映射；全部真实商品标识可解析；无效/被屏蔽身份仍被拒绝；Clarity与内部记录可以核对；不制造线上伪点击 |
| P1 | 处理已有访客的购买匹配：Deco三型号/套装、学习塔、门把手罩、网线钳、灯光和吸音板 | 保留搜索主题与答案；购买出口对应用户条件；移动端可用；逐页记下基线与变更 |
| P1 | 更新办公扩展坞/摄像头与婴儿背带的代际选择证据 | 先核验新型号ASIN；不把旧评测改成新产品、不跳新子域名、不批量造新URL |
| P1 | 执行10月20日到期的完整批次/索引核查，针对仍未更新的旧5xx分别处理 | 每一条到期URL有索引结论、Google/Bing/AI表现和下一步；保持现有永久跳转 |
| P2 | 每周复核真实买家落地页、来源、站点、市场和商品；分开看已引用、进站、商家点击、订单 | 7天战术与28天组合决策；不把bot、QA、Other聚合或AI引用当真实商品成交 |

现阶段不建议扩页面或新起子域名。运行时1118条指南/比较/评测记录，另有7个联盟站内决策工具页，已有覆盖量很大，而有效访问和有效商品点击仍少。先解决明确的供货与计量问题，再用跨引擎的有效入口决定下一批10来个高价值页面；这比重做全部页面更可核验。以上为建议实施队列，本次没有把建议描述为已上线。

**证据与限制**

- [observations.json](observations.json)：各后台UI口径、窗口、13件商品及5个点击会话落地页；不保留访客ID、个人地址或凭据。
- [seven-site-funnel.csv](seven-site-funnel.csv)、[joined-summary.json](joined-summary.json)：七站汇总与统计边界。
- [published-amazon-offers.csv](published-amazon-offers.csv)、[catalog-audit.json](catalog-audit.json)：运行时商品与旧检查器覆盖差异。旧检查器结果单独保留在 [link-format-check.json](link-format-check.json)。
- [public-audit.json](public-audit.json) 和 [public-family-audit.json](public-family-audit.json)：七站样本页面、七份robots及四个实际点击指南均200，样本页canonical在head且指向自身，站点标签正确，Costume为CJ路径。HTTP探测不等于完整浏览器性能测试，也不能证明Google已重新收录。
- GSC消息仍为38条，最新10月15日；旧5xx的最新逐URL索引记录沿用 [10月18日调查](../seo-review-2026-10-18/README.md)，本次没有重新完成全部URL live inspection，不把旧结论冒充今天的重抓取。
- 没有本次生产点击数据库、爬虫日志、Cloudflare防火墙、CJ订单明细和所有商品实时库存。因此不下“某引擎惩罚”“所有商品缺货”“AI引用已经变现”或“Bing确定完全未受影响”这样的结论。
- 生成目录差异：先用现有 `seo-focus-2026-10-13/export-content.mjs` 导出到本目录 `raw/content-inventory.json`，然后运行 `build-report.py`。脚本保留精简发布清单并删除可重复生成的8MB源码副本，不修改站点内容。

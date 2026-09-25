# SEO 正式发布与验收 · 2026-09-25

已按用户“发布吧”的授权完成发布。Main、Affiliate、Wellness 三个生产服务均运行 `seo-20260925-8055b15`，覆盖 Main、Network、Smarthome、Homeoffice、Baby、Pets、Style、Costume、Wellness。独立 Test / Tools 未修改、未重启，也未加入检查或索引提交。

## 发布内容与结果

本次上线此前已经完成的 SEO 全面整改：53 个重点低点击页面的逐页决策（6 修复、16 优化、31 保留）、六个索引异常页面的具体内容、商品身份及购买链接修正、Style 证据清理、Costume 发现入口、两个计算器和三个应用的 QA 统计排除。没有把 53 个复核页面说成 53 次重写。

- **302/302 公网页面通过**：296 个重点、商品、Style、Costume、首页和 Wellness 页面，加六个索引修复页。核验普通 URL 的状态、canonical、H1、描述及 JSON-LD；82 个重点及商品页还与已验证的本地标题、描述逐一对照。不是把原 1,401 页基线冒充本次逐页重抓。
- **Costume 原阻塞项已部分关闭**：32 个分类／编辑页均显示有效格式的购买入口；76 个商品页均有站内发现链接。只读检查页面与链接，不访问 CJ 追踪跳转或制造测试订单。
- **9 站 sitemap 与 robots 正常**，sitemap 合计 1,401 个 canonical URL。没有新增页面或批量改 URL。
- **两个计算器的本地边界测试已保留**；发布后再次实操桌高计算器：坐姿肘高 30、站姿 45、键盘厚度 2 英寸，正确得到 28／43 英寸。
- **三个应用的浏览器 QA 排除通过**：带 `madabase-qa=1` 进入后，内部导航到无参数页面仍不加载 Clarity。这个脚本在 hydration 后注入，不能用原始 HTML 是否出现标志字符串判断失败。
- 公网页面中未发现已暂停 Amazon ASIN 的 sponsored 购买入口。Wellness 的缺货提示和过期价格移除已上线；两个准确的停用路由另有独立响应证据。
- **90 个实质修改的 canonical URL 已获 IndexNow HTTP 200 接收**：Network 3、Smarthome 2、Homeoffice 14、Baby 12、Pets 1、Style 53、Costume 5。清单经过线上验证；接收不等于收录或排名恢复。

## 发布过程与恢复保护

三个压缩包从已推送的 Git 对象取出，哈希与本地交付一致；服务器原有脏工作区未覆盖，旧静态资源保留。内容包来自 `8055b15`（Main 包原始构建在 `4883d9c`），发布控制脚本为 `343b5d5`。

最初自动审批因可用内存不足拒绝切换。补测旧进程的独占内存后，改成受保护的单进程切换：停旧后仍须实际通过 **704 MiB** 门槛，未降低预算，也未启动并行候选。启动前增加了更保守的 768 MiB 预测门槛及独立超时恢复计时器。

Affiliate 首次尝试因校验误选 AppleDouble `._` 元数据而自动回滚，旧服务已实际恢复。核对旧版同样拒绝这些元数据、真实静态资源正常后，修正筛选并成功发布。最终停旧后的可用内存分别约为 Affiliate 841、Main 867、Wellness 862 MiB。Main／Wellness 在同一受保护窗口完成，记录时间 10:58:12–10:58:16（北京时间），随后恢复已验证的 Affiliate。

最终三个服务均 `active/running`、`NRestarts=0`；四个临时恢复计时器均 inactive。最后观测可用内存约 574 MiB，内存压力 avg10 为 0；这仍不足以再启动并行候选，后续发布继续遵守现有门槛。此前服务器事故的根因仍未从日志证明，本次未重启整机。

发布脚本的正常切换、容量失败、内容失败、看门狗及协调窗口恢复共 13 个模拟场景通过；模拟与这次真实回滚分别记录，不混为一谈。

## 仍未关闭的事项

**Wellness 525 已复测恢复，根因仍未确认。** 14:44 的浏览器请求曾在 San Jose 节点失败；用户随后登录 Cloudflare 并明确授权操作。核验 DNS 指向、Full (strict)、有效源站证书及规则后，未发现可确认的配置错误。16:59–17:03 的 San Jose、新加坡和应用源站请求均返回预期响应，浏览器首页正常。停用商品路由的预期 503 表示精确商品不可购买；它不同于 TLS 525。当天五条 bad key share 日志均不属于 Cloudflare IPv4 来源，不能作为本次原因。没有修改 TLS／DNS、重启服务或创建监控任务；当前按恢复后观察处理，不宣称永久修复。详见 [授权后的完整复核](wellness-tls-followup.json)、[公网响应](wellness-tls-followup-public.json)和[原始异常证据](wellness-edge-525.json)。

1. **23 个 GSC URL Inspection** 仍受此前 Google property 日配额限制。未因 IndexNow 接收或上线就改记为已完成；六个原索引异常页仍需后续 Google 检查。
2. **两个同名 Santa 页面** 已能读取，分别显示 $150 与 $450。商家[官方产品页](https://abracadabranyc.com/products/professional-santa-suit)具有 Rent／Buy 选项，但仅凭价格和标题不能证明两条既有追踪记录对应的精确变体。保留两页，不合并或删除；后续须读取现有授权目录记录中的具体 destination variant。
3. 商品地区、所选变体和实时库存限制继续保留；305 个商品身份复核不代表全部美国变体有货。CJ 收益、Amazon Other 归因及历史 Clarity QA 污染也未因此解决。
4. 搜索效果需在原定 cohort 闸门观察，记录这次正文修改的影响。没有重置原标题实验日期，没有创建新定时任务，也没有声称流量已恢复。

## 证据与回滚

发布验收证据保存在提交 `cbd46c3`，Cloudflare 授权复核保存在 `42f0a7b`。用户随后明确回复“授权”，允许将这些发布记录（含服务器目录、服务状态及验收证据，不含凭据）归档至现有 GitHub 仓库 `bingmada/madabase` 的 `lyd-0609` 分支；此前自动审批的授权阻塞已解除。生产内容包与发布脚本此前已推送并上线，服务器发布与此次证据归档分别记录。

- [服务、包哈希与回滚路径](release-record.json)
- [296 页公网验收](public-verification.json)及[六个索引修复页](index-repair-public.json)
- [浏览器 QA、计算器与禁用链接检查](supplemental-checks.json)
- [Sitemap、robots 与停用路由](sitemaps-robots-paused.json)
- [IndexNow 精确清单](indexnow-candidates.json)及[实际接收回执](indexnow-submission.txt)
- [两条 Santa 公共页面证据](santa-public-evidence.json)
- [全部页面修改与低点击决策](../seo-audit-2026-09-24/completion-2026-09-25.md)

服务器恢复入口：`/var/tmp/madabase-seo-deploy-20260925.py rollback affiliate|main|wellness`，应按单个应用顺序运行并验证健康。原 unit 与发布状态保存在 `/var/tmp/madabase-seo-release-20260925/`，旧发布目录完整保留。不要覆盖服务器脏工作区、启动无资源保护的并行候选，或通过修改 Test／Tools 制造容量。

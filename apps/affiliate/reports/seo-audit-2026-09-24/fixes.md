# 2026-09-24 SEO 问题处理

范围：Main、七个联盟站及 Wellness。排除 Test、Tools 与主域名遗留工具路径。

## 已实现并通过本地验证

- 6 个索引异常 URL：替换泛化选购正文，加入各自的判断表、官方依据和相关 canonical 指南入口；保留原路由、标题、商品锚点与自指 canonical。五个 Google 错选 canonical 的页面需要等待重新抓取，不能把代码修复等同于已恢复收录。
- Branch 与 HON：依据今日官方保修/退货资料，补全精确组件年限、适用范围、渠道和退货费用，沿用既有标题。查询证据来自此前导出的页面过滤报告。
- Costume：分类筛选移到数据库查询的数量限制之前；分类页直接列出当前已发布、可索引、有授权图片与有效商家链接的商品，修复原审计中 36 个商品页的发现入口。
- Style：桌面和移动导航增加现有 Styling guides 分类入口，处理第 37 个发现缺口。
- Clarity / 联盟点击：三个应用统一识别 viewport-baseline、madabase-qa、utm_source=qa、utm_medium=verification；QA 标志保留在当前标签页的 sessionStorage，内部导航不再转成正常访问。API 对带 QA 来源参数的请求直接跳过持久化。
- Amazon 检查报告：明确区分 306 个 URL/ASIN/tag 格式通过与商品身份、库存的实时核验。格式通过不再输出容易误解的 PASS。

验证：三个优化构建和 Linux 运行包通过；三个应用 ESLint 通过；SEO、搜索恢复冻结、扩张隔离、原 CTR cohort 检查通过；48 个统计排除场景通过；9 个重点页面候选运行检查通过；306/306 链接结构检查通过。Next.js 自动生成的 next-env.d.ts 变动已恢复。

## 外部服务与观察项

- 到期零展现检查在本次修复阶段新增 2 个 indexed：Matter smart bulbs comparison、Baby wraps/slings comparison。此后 GSC 再次返回 “Something went wrong / try again in a few hours”。剩余精确 109 URL 在 remaining-live-inspections.json，未判为未收录，闸门未关闭。
- 本地与服务器 Amazon Creators API 均缺少现有访问凭据。改用实页核验重点商品：六个修复指南的商品身份匹配，页面显示有货；CalDigit 身份匹配，但所选中国配送地址不支持配送，不能据此推断美国缺货。
- 实页核验发现原 HON ASIN B07GNDDNMW 实际为 SIHOO M18，已替换为核实后的 HON B06Y3PGPR2，保留 madaoffice-20。Branch B0GWGK4JFK 返回 Page Not Found，已停用原购买入口，并明确标注 HON 为另一款商品。未将搜索结果中的 Branch Pro 冒充原款。详见 live-product-checks.json。
- 原始最近 3 天 Clarity 数据含 QA 访问，不能靠代码修复追溯删除；新版本生效后的数据重新测量，旧窗口保留污染说明。
- 39 条原先因网络未完成的重定向已补查，现为 97/97 全部正确永久重定向，无需修改路由。
- CalDigit 已完成精确 URL 查询核对：201 次展现、0 点击，GSC 仅展示 2 个查询共 3 次展现，分别是 MacBook 双屏兼容性和产品评测，均与现有标题内容匹配。其余 198 次展现查询不可见，证据不足以支持再次改标题；保留现有版本，记录在 caldigit-query-review.json。

## 发布状态

基础修复与三个运行包已提交并推送 4883d9c。追加商品身份修复及 Affiliate 新运行包已提交并推送 5fe0cdf，9/9 候选页面及错误链接移除检查通过，修复后 304/304 当前 URL 结构检查通过。尚未切换正式版本。

服务器在临时候选进程启动后出现内存压力和管理连接无响应；停止进程命令未能确认执行。命令助手报告客户端未运行，新 Workbench 登录超时，救援控制台需要系统密码。约 19:34 后内存曲线升至约 1.5GB，因果关系尚需系统日志确认。因整机重启会影响同机 Test/Tools，已请求用户批准恢复性重启。

运行包包含回滚所需的独立构建；服务器现有工作区有改动，部署从指定 Git 对象提取归档，不 reset 或覆盖工作区。不得把待发布修复记为线上生效。

官方依据直接保存在修复页 sources 中，包括 [Branch warranty](https://www.branchfurniture.com/pages/warranty)、[Branch returns](https://www.branchfurniture.com/pages/returns)、[HON warranty](https://www.hon.com/warranty)、[OSHA chairs](https://www.osha.gov/etools/computer-workstations/components/chairs)、[AAP choking prevention](https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx) 与对应厂家说明。

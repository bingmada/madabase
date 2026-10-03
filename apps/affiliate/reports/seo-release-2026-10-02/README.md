# 2026-10-02 元数据输出修复（10 月 3 日继续发布）

本次只修复 Affiliate 七站的原始 HTML 元数据位置。Next.js 使用 `htmlLimitedBots: /.*/`，使普通浏览器、Googlebot 和 URL Inspection 抓取时，canonical、title、description 均在 head 内，避免共享 CDN 缓存保留流式正文元数据。页面标题文案、正文、商品、URL 和索引资格保持原样。

## 验证

- SEO、lint、Next.js 15.5.23 生产构建通过，Node 20.20.0。
- 1,255 个非 Costume 站点地图页面通过原始 HTML 检查。
- 107 个代表页面 × 3 种 User-Agent，共 321 次检查通过，含四种国家版本的 noindex 兼容页。
- 原始 HTML 解析器 6 个回归用例、发布容量 9 个用例、受保护切换 9 个模拟场景通过。
- Linux x64 包 60,872,322 bytes，SHA-256 `5e4f9ff8c73d04afce05273c90ab831de5a0d72301efa866631877b82554174b`。归档无环境文件、构建缓存。
- 线上待核验：七站源站及 CDN，全部 53 个低点击重点页中的 Affiliate 页面，Costume 数据库页面、旧静态资源兼容、robots/sitemap 与缓存隔离。

## 发布方法

服务器仓库存在旧改动，禁止用 checkout/pull 覆盖；使用 `git fetch` + `git show <commit>:<file>` 提取已提交包。独立不可变目录、保存原服务配置、保留旧静态文件。使用既定 768 MiB 切换前预测与 704 MiB 停止旧进程后的实际容量门槛，PSI 小于 1%，150 秒独立回滚 watchdog。只切换 Affiliate 服务，不启动第二份应用，不改 Test/Tools。

10 月 3 日单独切换的预测容量未过门槛，控制器在停止生产服务前退出。增加 `maintenance.py`：核验 Main + Affiliate 的合计可回收匿名内存；短暂停 Main 后执行原封不动的 Affiliate 容量门槛与发布流程；finally 恢复 Main 原服务、原版本，并以独立 180 秒恢复计时器应对控制器意外退出。11 个维护恢复/失败/容量场景通过，Main 配置发生外部变化时拒绝覆盖。Wellness、Test、Tools 不参与维护。应用包与 `6dd60db` 完全相同。

## 历史故障证据

10 月 2 日通过服务器 Workbench 读取日志：Nginx 保留的 9 月 23–24 日记录确认 Affiliate `127.0.0.1:3011` 的七个域名均出现 upstream timed out。9 月 23 日数量 Baby 307、Costume 833、Homeoffice 435、Network 259、Pets 127、Smarthome 114、Style 281；9 月 24 日分别 101、130、132、156、133、151、21。该筛选未发现七站 9 月 25–29 日同类错误。journald 只保留 9 月 27 日起的日志，不能凭此确定更早的进程根因。Nginx 超时证实过去存在源站可用性问题，但不能单独证明 9 月 29 日展现下降由此造成。

## 待验证结论

技术修复通过不等于 Google 已重新抓取，也不等于展现恢复。保留原六个索引修复页面和其余 23 个待检查 URL 的队列。发布后记录新的抓取日期、canonical 与完整数据窗口，再决定页面内容调整。

## 当前发布状态（2026-10-03）

修复及包已推送 `6dd60db`，维护控制器已推送 `5fe476b`。服务器已核验包 SHA-256，解压到不可变目录并保留 21 个旧资源。首次激活被容量预测门槛拒绝，旧生产没有停止。自动审批随后拒绝 Main 额外短暂停机方案，已向用户请求明确选择；批准前不执行维护脚本。线上仍为 `seo-20260925-8055b15`，不能声称修复上线或展现恢复。

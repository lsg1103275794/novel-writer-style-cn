---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Novel Writer Style CN 项目 Git 使用规范
   
   本规范基于项目实际开发流程制定，包含 NPM 包发布和版本管理最佳实践
-------------------------------------------------------------------------------------> 
# Novel Writer Style CN - Git 使用规范
在推送之前必须更新版本号-CHANGELOG.md-和npm包发布前的包验证比对 推荐使用MCP工具推送

## 分支管理规范

### 主分支识别与同步

**⚠️ 重要提醒**：GitHub 仓库可能同时存在 `main` 和 `master` 分支，务必确认哪个是默认分支！

#### 检查默认分支
```bash
# 查看所有远程分支
git ls-remote --heads origin

# 查看本地分支状态
git branch -a

# 检查当前工作分支
git branch --show-current
```

#### 分支同步策略
```bash
# 如果 GitHub 默认分支是 main，但本地使用 master
git push origin master:main --force  # 强制同步到 main

# 如果需要切换本地默认分支
git checkout -b main origin/main     # 创建并切换到 main
git branch -D master                 # 删除本地 master（可选）
```

### 分支命名规范

- 使用小写字母，单词之间用连字符（`-`）分隔
  - 示例：`feature/login-api`、`bugfix/header-styling`
- 采用前缀标识分支类型：
  - `feature/` - 新功能开发
  - `bugfix/` - 问题修复
  - `hotfix/` - 紧急修复
  - `release/` - 发布准备
  - `chore/` - 日常维护
- 可在分支名称中包含任务编号，以便追踪
  - 示例：`feature/123-report-generator`、`bugfix/456-chat-streaming`

## 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 规范：

### 格式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### 常用类型

- `feat` - 新功能
- `fix` - 修复问题
- `docs` - 文档更新
- `style` - 代码格式（不影响功能）
- `refactor` - 重构（非修复或新增功能）
- `perf` - 性能优化
- `test` - 添加或修改测试
- `chore` - 构建过程或辅助工具的变动

### 作用域示例

针对 Novel Writer Style CN 项目的作用域：

- `cli` - CLI 工具相关
- `plugins` - 插件系统相关
- `dist` - 构建输出相关
- `utils` - 工具函数相关
- `templates` - 模板文件相关
- `docs` - 文档更新
- `config` - 配置文件相关
- `scripts` - 脚本文件相关
- `experts` - 专家系统相关
- `memory` - 记忆系统相关

### 提交示例

基于项目实际场景的提交示例：

```bash
# CLI 工具修复
fix(cli): add missing module files to resolve ERR_MODULE_NOT_FOUND

# 插件功能增强
feat(plugins): add missing listPlugins method and installedAI property

# 配置文件更新
chore: update gitignore to allow dist directory

# 文档更新
docs(readme): update installation instructions

# 模板优化
feat(templates): add new story structure templates

# 专家系统改进
refactor(experts): optimize character analysis logic
```

### 编写规则

- 使用祈使语气，首字母小写，结尾不加句号
- 首行不超过 50 个字符
- 正文每行不超过 72 个字符
- 在正文中详细说明更改动机和背景
- 可引用相关 issue（使用 `Closes #123` 或 `Related to #456`）

## 合并策略

- 所有代码合并应通过 Pull Request (PR) 进行，需经过代码审查
- 主分支（`main`）始终保持可部署状态
- 合并前建议使用 `git rebase`，保持提交历史整洁
- 使用 "Squash and merge" 合并策略，避免无效提交污染历史
- PR 标题应遵循提交信息规范

## 协作流程

### 开发新功能

```bash
# 1. 从主分支创建新分支
git checkout master
git pull origin master
git checkout -b feature/new-plugin-system

# 2. 开发并提交
git add .
git commit -m "feat(plugins): add new plugin loading system"

# 3. 推送到远程
git push origin feature/new-plugin-system

# 4. 创建 Pull Request
```

### 修复问题

```bash
# 1. 创建修复分支
git checkout -b bugfix/cli-module-not-found

# 2. 修复并提交
git add .
git commit -m "fix(cli): add missing module files to resolve ERR_MODULE_NOT_FOUND"

# 3. 推送并创建 PR
git push origin bugfix/cli-module-not-found
```

### 同步主分支

```bash
# 定期同步主分支，减少合并冲突
git checkout master
git pull origin master
git checkout feature/your-branch
git rebase master
```

## 提交前检查清单

在提交代码前，请确保：

- [ ] 本地测试全部通过
- [ ] CLI 工具功能正常（`node dist/cli.js --help`）
- [ ] 代码遵循 JavaScript/Node.js 规范
- [ ] 没有调试代码（`console.log`、`debugger` 等）
- [ ] 敏感信息（API 密钥）未提交到代码库
- [ ] 提交信息清晰明确，遵循 Conventional Commits 规范
- [ ] 相关文档已更新
- [ ] dist 目录包含必要的构建文件
- [ ] package.json 版本号正确

## 代码审查要点

### 审查者应关注

- 代码是否符合项目架构和设计模式
- 是否有潜在的性能问题
- 错误处理是否完善
- 是否有安全隐患
- 代码可读性和可维护性
- 测试覆盖是否充分

### 被审查者应做到

- 提供清晰的 PR 描述
- 说明改动的原因和影响范围
- 标注需要特别关注的部分
- 及时响应审查意见
- 保持友好和开放的态度

## 版本管理与 NPM 发布

### 语义化版本

遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)：

- `MAJOR.MINOR.PATCH` (例如：`0.21.1`)
- `MAJOR` - 不兼容的 API 修改
- `MINOR` - 向下兼容的功能性新增
- `PATCH` - 向下兼容的问题修正

### NPM 包发布流程

```bash
# 1. 确保所有更改已提交并推送
git status
git push origin master

# 2. 登录 NPM（如果未登录）
npm whoami  # 检查登录状态
npm login   # 如果需要登录

# 3. 更新版本号
npm version patch   # 修复版本 (0.21.0 -> 0.21.1)
npm version minor   # 功能版本 (0.21.0 -> 0.22.0)
npm version major   # 重大版本 (0.21.0 -> 1.0.0)

# 4. 发布到 NPM
npm publish

# 5. 推送版本标签到 Git
git push origin master
git push origin --tags
```

### 版本发布检查清单

发布前确保：

- [ ] 所有功能测试通过
- [ ] CLI 工具正常工作
- [ ] 文档已更新
- [ ] CHANGELOG.md 已更新
- [ ] 版本号符合语义化版本规范
- [ ] 已登录正确的 NPM 账户
- [ ] dist 目录包含所有必要文件

### 标签规范

```bash
# NPM version 命令会自动创建标签，也可以手动创建
git tag -a v0.21.1 -m "Release version 0.21.1 - Fix CLI module errors"
git push origin v0.21.1
```

## 特殊情况处理

### 紧急修复（Hotfix）

```bash
# 1. 从主分支创建 hotfix 分支
git checkout master
git checkout -b hotfix/critical-cli-fix

# 2. 修复并测试
git add .
git commit -m "fix(cli): resolve critical module loading issue"

# 3. 合并到主分支
git checkout master
git merge hotfix/critical-cli-fix
git push origin master

# 4. 发布紧急版本
npm version patch
npm publish
git push origin --tags

# 5. 清理分支
git branch -d hotfix/critical-cli-fix
```

### 回滚提交

```bash
# 创建一个新的提交来撤销之前的更改
git revert <commit-hash>

# 不要使用 git reset 在公共分支上
```

### NPM 包回滚

```bash
# 如果发布了有问题的版本，可以弃用
npm deprecate novel-writer-style-cn@0.21.0 "This version has critical bugs, please upgrade to 0.21.1"

# 或者撤销发布（仅限发布后24小时内）
npm unpublish novel-writer-style-cn@0.21.0
```

## 自动化工具

### 推荐工具

- **Husky** - Git hooks 管理
- **Commitlint** - 提交信息验证
- **Prettier** - 代码格式化
- **ESLint** - JavaScript/Vue 代码检查
- **Black** - Python 代码格式化

### 配置示例

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## 最佳实践

1. **小步提交** - 每个提交只做一件事，便于回滚和审查
2. **频繁推送** - 避免本地积累大量未推送的提交
3. **及时同步** - 定期从主分支拉取最新代码
4. **清晰描述** - 提交信息要让其他人能快速理解改动
5. **避免大文件** - 不要提交大型二进制文件或生成文件
6. **保护敏感信息** - 使用 `.gitignore` 排除敏感文件
7. **定期清理** - 删除已合并的本地分支
8. **分支识别** - 推送前确认目标分支是否为 GitHub 默认分支（新增）
9. **推送验证** - 每次推送后检查 GitHub 页面确认更新显示（新增）
10. **双分支同步** - 如果项目同时有 main 和 master，确保重要更新同步到默认分支（新增）
11.  **及时维护**  -及时更新仓库主页展示中关于近期项目的版本、比较重要的功能更新

## 禁止事项

- ❌ 直接在主分支上开发
- ❌ 提交未测试的代码
- ❌ 使用 `git push --force` 在公共分支（除非是分支同步需要）
- ❌ 提交包含密码或 API 密钥的代码
- ❌ 提交大型二进制文件
- ❌ 使用无意义的提交信息（如 "update"、"fix"）
- ❌ 合并未经审查的代码
- ❌ **推送后不验证 GitHub 页面显示**（新增）
- ❌ **忽略分支同步问题**（新增）

## 项目特定规范

### Novel Writer Style CN 项目约定

- CLI 工具修改需确保 `node dist/cli.js --help` 正常运行
- 新增模块文件需确保正确的导入导出
- 插件系统修改需测试插件加载功能
- 模板文件修改需验证生成的项目结构
- 配置文件修改需在 PR 中说明影响范围
- 新增依赖需在 PR 中说明必要性和影响
- dist 目录的修改需要特别注意，因为这是发布的核心文件

### 文件组织

- CLI 核心文件: `dist/cli.js`
- 工具模块: `dist/utils/`
- 插件系统: `dist/plugins/`
- 版本管理: `dist/version.js`
- 模板文件: `templates/`
- 文档更新: `docs/`
- 配置文件: 项目根目录
- 专家系统: `experts/`
- 记忆系统: `memory/`

### 分支保护规则

- **主分支识别**：确认 GitHub 默认分支（可能是 `main` 或 `master`）
- **分支同步**：确保推送到正确的默认分支，避免用户看不到更新
- 所有功能开发必须通过 PR 合并
- PR 需要通过基本的功能测试
- 发布版本前需要确保 CLI 工具完全可用

### 推送验证流程

每次推送后必须验证：

```bash
# 1. 检查推送状态
git status
git log --oneline -3

# 2. 验证远程分支同步
git ls-remote --heads origin

# 3. 确认 GitHub 页面显示
# 访问 GitHub 仓库页面，确认默认分支显示最新提交

# 4. 如果默认分支未更新，强制同步
git push origin $(git branch --show-current):main --force
```

### 发布后验证

每次发布后需要验证：

```bash
# 验证 NPM 包
npm view novel-writer-style-cn
npm install -g novel-writer-style-cn@latest

# 验证 CLI 功能
novel --version
novel --help
novel check
novel plugins:list
```

## 实际工作流程示例

### 完整的修复和发布流程

基于项目实际经验的完整流程：

```bash
# 0. 确认工作分支（新增步骤）
git branch --show-current              # 检查当前分支
git ls-remote --heads origin          # 检查远程分支
# 如果 GitHub 默认分支是 main，确保本地也使用 main

# 1. 发现问题：CLI 工具报 ERR_MODULE_NOT_FOUND 错误
# 2. 创建修复分支
git checkout -b bugfix/cli-missing-modules

# 3. 分析问题并修复
# - 创建缺失的 dist/version.js
# - 创建缺失的 dist/plugins/manager.js  
# - 创建缺失的 dist/utils/project.js
# - 创建缺失的 dist/utils/interactive.js

# 4. 测试修复
node dist/cli.js --version
node dist/cli.js --help
node dist/cli.js plugins:list

# 5. 提交修复
git add dist/
git commit -m "fix(cli): add missing module files to resolve ERR_MODULE_NOT_FOUND

- 添加 dist/version.js 模块，提供版本管理功能
- 添加 dist/plugins/manager.js 插件管理器
- 添加 dist/utils/project.js 项目工具模块  
- 添加 dist/utils/interactive.js 交互界面模块
- 修复 CLI 工具无法启动的问题"

# 6. 继续修复发现的其他问题
git add dist/plugins/manager.js dist/utils/project.js
git commit -m "fix(plugins): add missing listPlugins method and installedAI property

- 添加 PluginManager.listPlugins() 方法
- 在 getProjectInfo() 中添加 installedAI 属性
- 修复 plugins:list 命令执行错误"

# 7. 推送到远程仓库（关键步骤优化）
CURRENT_BRANCH=$(git branch --show-current)
git push origin $CURRENT_BRANCH

# 8. 确保默认分支同步（新增步骤）
# 如果 GitHub 默认分支是 main，同步更新
git push origin $CURRENT_BRANCH:main --force

# 9. 发布新版本
npm version patch  # 0.21.0 -> 0.21.1
npm publish

# 10. 推送版本标签（确保推送到所有相关分支）
git push origin $CURRENT_BRANCH
git push origin --tags
# 如果有 main 分支，也推送到 main
git push origin $CURRENT_BRANCH:main --force

# 11. 验证发布（新增验证步骤）
npm view novel-writer-style-cn@latest
# 验证 GitHub 页面显示最新提交
echo "请检查 GitHub 仓库页面确认更新已显示"
```

### 常见问题处理

**问题1：模块找不到错误**
```bash
# 错误：ERR_MODULE_NOT_FOUND
# 解决：检查 import 路径，确保文件存在
# 提交：fix(cli): add missing module files
```

**问题2：函数未定义错误**  
```bash
# 错误：TypeError: xxx is not a function
# 解决：添加缺失的方法实现
# 提交：fix(plugins): add missing listPlugins method
```

**问题3：网络连接问题**
```bash
# 错误：git push 失败
# 解决：检查网络，重试推送
# 使用：git push --verbose origin master
```

**问题4：分支同步问题** ⭐ **新增**
```bash
# 错误：推送成功但 GitHub 页面看不到更新
# 原因：推送到了非默认分支（如 master），但 GitHub 显示默认分支（如 main）
# 解决方案：
git push origin master:main --force  # 强制同步到默认分支

# 验证同步：
git ls-remote --heads origin         # 查看远程分支状态
```

**问题5：推送显示成功但内容未更新**
```bash
# 错误：git push 显示 "Everything up-to-date" 但 GitHub 内容未变
# 原因：网络延迟或 GitHub 缓存
# 解决方案：
# 1. 创建临时文件强制推送
echo "sync-$(date)" > sync-marker.txt
git add sync-marker.txt
git commit -m "chore: force sync updates"
git push origin master

# 2. 清理临时文件
git rm sync-marker.txt
git commit -m "chore: remove sync marker"
git push origin master
```
以下是本项目主次要项目结构助力AI理解本项目


## 📁 顶层目录结构

```
novel-writer-style-cn/
├── dist/                    # 构建输出 (核心运行文件)
├── docs/                    # 文档目录
├── experts/                 # 专家系统
├── plugins/                 # 插件系统
├── templates/               # 模板文件
├── test/                    # 测试文件
├── examples/                # 示例代码
├── .claude/                 # Claude Code 配置
├── .github/                 # GitHub 配置
├── .vscode/                 # VSCode 配置
├── package.json             # NPM 包配置
├── CHANGELOG.md             # 版本更新日志
├── README.md                # 项目说明
└── CLAUDE.md                # Claude 指令文件
```

---

## 🔧 dist/ - 核心运行目录

### 主要文件

```
dist/
├── cli.js                   # CLI 主入口 (约 1500 行)
├── version.js               # 版本管理模块
├── utils/                   # 工具模块
├── plugins/                 # 插件管理
├── claude/                  # Claude Code 模板
├── cursor/                  # Cursor 模板
├── gemini/                  # Gemini CLI 模板
├── codex/                   # Codex CLI 模板
├── auggie/                  # Auggie CLI 模板
└── [其他 AI 平台模板...]
```

### dist/utils/ - 工具模块

| 文件 | 说明 | 版本 |
|------|------|------|
| `cli.js` | CLI 主程序入口 | - |
| `version.js` | 版本号管理 | - |
| `project.js` | 项目工具函数 | - |
| `interactive.js` | 交互界面模块 | - |
| `model-config.js` | 模型配置读取 | v0.21.8 |
| `vocabulary-analyzer.js` | 词汇分析器 | v0.22.0 |
| `syntax-analyzer.js` | 句法分析器 | v0.22.0 |
| `sentiment-analyzer.js` | 情感分析器 | v0.22.0 |
| `nlp-analyzer.js` | NLP 综合分析器 | v0.22.0 |
| `text-preprocessor.js` | 文本预处理器 | v0.22.0 |
| `consistency-checker.js` | 一致性检测器 | v0.22.0 |
| `confidence-calculator.js` | 置信度计算器 | v0.22.0 |
| `style-learning-integration.js` | 风格学习集成 | v0.22.0 |

### dist/plugins/ - 插件管理

```
dist/plugins/
└── manager.js               # 插件管理器
```

---

## 🔌 plugins/ - 插件系统

```
plugins/
├── style-learning/          # 风格学习插件 ⭐ 核心
├── authentic-voice/         # 真实人声插件
├── book-analysis/           # 书籍分析插件
├── genre-knowledge/         # 类型知识插件
├── translate/               # 翻译插件
├── luyao-style/             # 路遥风格插件
├── wangyu-style/            # 王钰风格插件
├── shizhangyu-style/        # 十丈余风格插件
└── stardust-dreams/         # 星尘梦想插件
```

### style-learning/ - 风格学习插件 (核心)

```
plugins/style-learning/
├── README.md                # 插件说明
├── config.yaml              # 插件配置
├── commands/                # AI 斜杠命令
│   ├── style-analyze.md     # /style-analyze
│   ├── style-learn.md       # /style-learn
│   ├── write-styled.md      # /write-styled
│   ├── style-adjust.md      # /style-adjust
│   └── style-workshop.md    # /style-workshop
├── experts/
│   └── style-expert.md      # 风格专家
├── templates/
│   └── style-config-template.json
└── examples/
    └── usage-example.md     # 使用示例
```

---

## 📚 docs/ - 文档目录

```
docs/
├── README.md                # 文档索引
├── PROJECT_STRUCTURE.md     # 项目结构 (本文档)
├── usage-guide.md           # 完整使用指南 ⭐
├── nlp-analysis-flow.md     # NLP 分析流程图
├── INSTALLATION_COMPLETE.md # 安装完成指南
├── METHODOLOGY.md           # 七步方法论
├── novel-sdd.md             # 规格驱动创作法
├── STYLE_LEARNING_INTEGRATION.md
├── THIRD_PARTY_API.md       # 第三方 API 指南
├── upgrade-guide.md         # 升级指南
└── commands.md              # 命令详解
```

---

## 📝 templates/ - 模板文件

```
templates/
├── checklist-template.md    # 检查清单模板
├── outline-template.md      # 大纲模板
├── story-template.md        # 故事模板
├── writing-constitution-template.md
├── GEMINI.md                # Gemini 配置模板
└── knowledge/               # 知识库模板
    ├── character-profiles.md
    ├── character-voices.md
    ├── locations.md
    └── world-setting.md
```

---

## 🎓 experts/ - 专家系统

```
experts/
└── core/
    ├── character.md         # 人物塑造专家
    ├── plot.md              # 剧情结构专家
    ├── style.md             # 文风语言专家
    └── world.md             # 世界观设计专家
```

## Critical: Memory Operations via MCP Only

**禁止手动创建 memory 目录或文件。** 所有记忆操作必须通过 MCP oh-memos 工具完成。

如果你想运行 `mkdir -p .../memory` 或用 `Write` 创建记忆文件 → **停下来**,改用 MCP oh-memos 工具。

### Tools Available:
`oh-memos_context_resume`, `oh-memos_search`(可带 `context` 做上下文感知检索), `oh-memos_save`, `oh-memos_list_v2`, `oh-memos_get`, `oh-memos_suggest`, `oh-memos_think`(证据包+缺口分析), `oh-memos_graph`(`mode`: related/path/impact/schema), `oh-memos_admin`(`action`: list_cubes/register_cube/create_user/validate_cubes/stats/calendar), `oh-memos_export_wiki`

### Cube Routing (CRITICAL)

每个项目有自己的 memory cube。**必须传 `project_path` 参数**,让 MCP server 自动推导 cube_id。

推导规则: 取目录名 → 小写 → 替换 `-`/`.`/空格为 `_` → 追加 `_cube`

示例:
| 项目路径 | 自动推导 cube_id |
|---------|----------------|
| `/mnt/g/test/oh-memos` | `oh_memos_cube` |
| `/mnt/g/Cyber/AudioCraft Studio` | `audiocraft_studio_cube` |
| `~/projects/my-web-app` | `my_web_app_cube` |

```python
# 正确用法
oh-memos_save(content="...", memory_type="BUGFIX", project_path="/mnt/g/test/oh-memos")
oh-memos_search(query="...", project_path="/mnt/g/test/oh-memos")

# 错误用法 — 不要硬编码 dev_cube
oh-memos_save(content="...", cube_id="dev_cube")  # ✗
```

### Operational Workflow:
1. **Before Coding (Context Retrieval)**:
    - 在回答任何复杂问题或开始新功能前,**必须**使用 `oh-memos_search` 或 `oh-memos_list_v2` 检索项目记忆。
    - 上下文压缩后,调用 `oh-memos_context_resume` 恢复上下文。

2. **During Development (Dependency & Logic)**:
    - 识别当前项目的技术栈版本。
    - 如果发现现有记忆与当前代码冲突,使用 `oh-memos_graph`(mode=related)梳理关系。

3. **After Coding (Knowledge Consolidation)**:
    - 完成功能模块、修复 Bug 或达成技术决策后,**必须**使用 `oh-memos_save` 将关键信息写入记忆。
    - **必须显式指定 `memory_type` 参数**,不依赖自动检测。

### Memory Type 速查表
- Bug 修复 → `BUGFIX` 或 `ERROR_PATTERN`
- 技术决策 → `DECISION`
- 发现陷阱 → `GOTCHA`
- 代码模板 → `CODE_PATTERN`
- 配置变更 → `CONFIG`
- 完成里程碑 → `MILESTONE`
- 新增功能 → `FEATURE`
- 纯进度汇报 → `PROGRESS`

**详细操作规则、MCP 工具使用说明、决策树见 `/project-memory` skill**
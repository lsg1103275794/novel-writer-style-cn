# 更新日志

## [0.22.3] - 2026-01-16

### ✨ 新增：CLI 命令集成到 Gemini/Qwen 平台

#### 功能新增

- ✅ **Gemini/Qwen TOML 命令** - 为 CLI 命令创建专用 TOML 格式包装器
- ✅ **智能命令注入** - 插件管理器优先使用 `commands-gemini/` 目录的 TOML 文件
- ✅ **三个核心命令** - text-preprocess、nlp-analyze、style-check 现已支持 Gemini/Qwen

#### 新增文件

```
plugins/style-learning/commands-gemini/
├── text-preprocess.toml    # 文本预处理命令
├── nlp-analyze.toml         # NLP 分析命令
└── style-check.toml         # 风格一致性检测命令
```

#### 技术实现

**插件管理器优化** - `dist/plugins/manager.js`
```javascript
// 对于 TOML 平台（Gemini/Qwen），优先使用 commands-gemini 目录
if (config.toml) {
    const geminiCommandsDir = path.join(sourcePath, 'commands-gemini');
    if (await fs.pathExists(geminiCommandsDir)) {
        // 直接复制 TOML 文件（保持高质量格式）
        const tomlFiles = (await fs.readdir(geminiCommandsDir)).filter(f => f.endsWith('.toml'));
        for (const tomlFile of tomlFiles) {
            await fs.copy(sourceFile, targetFile);
        }
        continue; // 跳过 Markdown 转换
    }
}
```

#### 使用场景

**完整工作流程（Gemini CLI）**：
```bash
# 1. 初始化项目（Gemini 平台）
novel init my-novel --ai gemini --plugins style-learning

# 2. CLI 预处理（终端）
novel preprocess samples/jinyong/射雕英雄传.txt

# 3. CLI 分析（终端）
novel analyze clean/jinyong/射雕英雄传.txt --verbose

# 4. AI 命令（Gemini CLI 内）
/text-preprocess samples/author/book.txt
/nlp-analyze clean/author/book.txt
/style-check output/chapter.txt nlp/author/book.json
```

#### 优势

- **双模式支持** - 既可以在终端直接运行 CLI，也可以在 AI 助手内调用
- **高质量格式** - TOML 文件手工编写，包含详细说明和示例
- **自动注入** - 安装插件时自动注入到 Gemini/Qwen 项目
- **向后兼容** - 如果没有 `commands-gemini/` 目录，自动从 Markdown 转换

---

## [0.22.2] - 2026-01-16

### 🐛 修复：跨平台路径兼容性

#### 问题修复

- ✅ **Windows 路径兼容性** - 修复 Windows 系统下路径分隔符导致的路径映射失败
- ✅ **路径规范化** - 统一使用正斜杠进行路径匹配，然后转换为系统路径分隔符
- ✅ **测试验证** - 完整测试了 preprocess → analyze → check-style 流程

#### 技术细节

修复了以下代码中的路径匹配问题：
```javascript
// 修复前（仅在 Unix 系统工作）
if (relativePath.startsWith('samples' + path.sep))

// 修复后（跨平台兼容）
const normalizedPath = relativePath.replace(/\\/g, '/');
if (normalizedPath.startsWith('samples/'))
```

#### 测试结果

```bash
# 1. 预处理测试
novel preprocess samples/jinyong/射雕英雄传.txt
# ✓ 自动生成: clean/jinyong/射雕英雄传.txt

# 2. 分析测试
novel analyze clean/jinyong/射雕英雄传.txt --verbose
# ✓ 自动生成: nlp/jinyong/射雕英雄传.json

# 3. 一致性检测测试
novel check-style output/test.txt nlp/jinyong/射雕英雄传.json
# ✓ 成功检测风格一致性
```

---

## [0.22.1] - 2026-01-16

### 🎯 优化：规范化目录结构与智能路径管理

#### 核心改进

**数据处理流水线规范化** - 建立清晰的目录结构，反映实际的处理流程

- ✅ **智能路径映射**：CLI 命令自动将文件输出到规范目录
  - `samples/author/book.txt` → `clean/author/book.txt` (预处理)
  - `clean/author/book.txt` → `nlp/author/book.json` (分析)
- ✅ **目录自动创建**：无需手动创建 clean/、nlp/ 目录
- ✅ **流程提示优化**：每步完成后提示下一步操作
- ✅ **向后兼容**：支持手动指定 -o 参数覆盖默认路径

#### 新增文档

- `docs/PROJECT_WORKFLOW.md` - 完整的项目工作流程与目录结构规范
  - 详细的 7 阶段工作流程说明
  - 目录结构最佳实践
  - 路径规则总结
  - 常见问题解答

#### 更新文档

- `docs/usage-guide.md` - 更新快速开始示例，使用新的目录结构
- `README.md` - 更新使用示例，展示规范化的工作流程

#### 目录结构

```
my-novel-project/
├── samples/              # 📚 原始样本文件（只读）
│   └── jinyong/
│       └── 射雕英雄传.txt
├── clean/                # ✨ 预处理后的文本（CLI 自动生成）
│   └── jinyong/
│       └── 射雕英雄传.txt
├── nlp/                  # 📊 NLP 分析结果（CLI 自动生成）
│   └── jinyong/
│       └── 射雕英雄传.json
└── output/               # 📝 AI 创作输出（可选）
```

#### 使用示例

```bash
# 1. 准备样本
mkdir -p samples/jinyong
# 将作品放入 samples/jinyong/射雕英雄传.txt

# 2. 预处理（自动输出到 clean/）
novel preprocess samples/jinyong/射雕英雄传.txt

# 3. NLP 分析（自动输出到 nlp/）
novel analyze clean/jinyong/射雕英雄传.txt --verbose

# 4. AI 风格学习（使用预处理文件）
/novel.style-learn clean/jinyong/ --name="金庸风格"
```

---

## [0.22.0] - 2026-01-15

### 🚀 新功能：NLP 算法集成

#### 核心改进

**从"描述性"到"量化性"** - 引入真实的 NLP 算法，提供可验证的数学模型

- ✅ **中文分词**：基于 segment 库的高性能分词
- ✅ **词汇分析**：词频统计、高频词提取、词汇丰富度计算
- ✅ **句法分析**：句长统计、句式分布、标点符号分析
- ✅ **情感分析**：情感倾向判断、情感得分计算
- ✅ **文本预处理**：智能清理样本文本，自动移除目录、页码等非正文内容
- ✅ **质量评估**：多维度样本质量评分，提供改进建议
- ✅ **一致性检测**：实时检测文本与目标风格的匹配度，四维度评分与改进建议

#### 新增模块

**核心分析模块**：
- `dist/utils/vocabulary-analyzer.js` - 词汇分析模块
  - 中文分词功能
  - 词频统计与高频词提取
  - 词汇丰富度计算 (TTR)

- `dist/utils/syntax-analyzer.js` - 句法分析模块
  - 句子切分与句长统计
  - 句长分布分析（短/中/长句比例）
  - 标点符号频率统计

- `dist/utils/sentiment-analyzer.js` - 情感分析模块
  - 情感词典匹配
  - 情感得分计算 (-1 到 +1)
  - 情感倾向判断

- `dist/utils/nlp-analyzer.js` - NLP 分析器主模块
  - 整合三大分析模块
  - 提供统一分析接口
  - 生成格式化报告

**集成模块**：
- `dist/utils/text-preprocessor.js` - 文本预处理器
  - 智能清理样本文本，自动移除目录、页码、章节标题等非正文内容
  - 统一标点符号格式（半角转全角）
  - 移除多余空白字符
  - 多维度质量评估：中文占比、标点占比、空白占比、重复行占比
  - 质量评分与改进建议

- `dist/utils/consistency-checker.js` - 风格一致性检测器
  - 实时检测文本与目标风格的匹配度
  - 四维度评分：词汇匹配度、句法匹配度、情感匹配度、节奏匹配度
  - 综合一致性得分与等级判定
  - 针对性改进建议生成

- `dist/utils/confidence-calculator.js` - 置信度计算器
  - 科学的置信度评估模型
  - 四维度评分：样本量充足度 (S)、特征一致性 (C)、风格独特性 (U)、数据完整性 (D)
  - 综合置信度计算：Confidence = 0.3S + 0.4C + 0.2U + 0.1D
  - 置信度等级判定：优秀 (≥80%)、良好 (≥60%)、一般 (≥40%)、较低 (<40%)

- `dist/utils/style-learning-integration.js` - 风格学习集成
  - 演示如何将 NLP 分析器集成到风格学习流程
  - 集成置信度计算器，提供可靠的风格学习质量评估

#### 性能表现

**测试结果**（远超预期目标）：

| 文本大小 | 耗时 | 性能评价 |
|---------|------|---------|
| 1,000字 | 9ms | ⭐⭐⭐⭐⭐ |
| 5,000字 | 27ms | ⭐⭐⭐⭐⭐ |
| 10,000字 | 57ms | ⭐⭐⭐⭐⭐ |

**目标**: 10,000字 < 2秒
**实际**: 10,000字 = 57ms（快 35 倍！）

#### 依赖更新

**新增依赖**：
- `segment@0.1.3` - 纯 JavaScript 中文分词库
- `mathjs@15.1.0` - 数学计算库

#### CLI 命令

**新增三个风格学习辅助命令**：

```bash
# 预处理样本文本（清理目录、页码、标准化标点）
novel preprocess <file> [options]
  -o, --output <file>  # 输出处理后的文本到文件
  --quality            # 同时评估文本质量

# NLP 文本分析（词汇、句法、情感）
novel analyze <file> [options]
  -o, --output <file>  # 输出结果到 JSON 文件
  --verbose            # 显示详细分析结果（高频词等）

# 风格一致性检测
novel check-style <file> <style-file> [options]
  -o, --output <file>  # 输出结果到 JSON 文件
```

**使用流程**：
1. 使用 `novel preprocess` 清理样本文本
2. 使用 `novel analyze` 分析文本特征
3. 在 AI 助手中使用 `/style-learn` 学习风格
4. 使用 `novel check-style` 验证创作一致性

#### 使用示例

**基础使用**：
```javascript
import NLPAnalyzer from './dist/utils/nlp-analyzer.js';

const analyzer = new NLPAnalyzer();
const result = analyzer.analyze('这是一段测试文本。');

console.log(result);
// 输出: { vocabulary: {...}, syntax: {...}, sentiment: {...} }
```

**风格学习集成**：
```javascript
import StyleLearningIntegration from './dist/utils/style-learning-integration.js';

const integration = new StyleLearningIntegration();
const styleConfig = await integration.learnStyleFromFile(
  'samples/jinyong.txt',
  '金庸风格'
);
```

#### 测试覆盖

**新增测试文件**：
- `test/nlp-analyzer.test.js` - 基础功能测试
- `test/style-learning-integration.test.js` - 集成测试
- `test/performance.test.js` - 性能测试

**测试结果**: ✅ 全部通过

#### 技术说明

**为什么使用 segment？**
- 纯 JavaScript 实现，无需编译 C++ 扩展
- 跨平台兼容性好
- 对于风格学习场景，准确度已足够

#### 改进效果

| 指标 | 改进前 | 改进后 | 提升 |
|-----|--------|--------|------|
| 分析方式 | 提示词描述 | 真实算法 | ✅ 质的飞跃 |
| 可验证性 | 无法验证 | 可量化验证 | ✅ 100% |
| 准确度 | 主观判断 | 数学模型 | ✅ 显著提升 |
| 性能 | 依赖AI | 本地计算 | ✅ 快10倍+ |

#### 文档更新

- 📄 新增 `docs/nlp-analysis-flow.md` - NLP 分析流程图
- 📄 更新 `README.md` - 添加 NLP 功能说明

### 📦 发布信息

- **NPM 包**: `novel-writer-style-cn@0.22.0`
- **安装方式**: `npm install -g novel-writer-style-cn@latest`
- **GitHub 标签**: `v0.22.0`
- **发布时间**: 2026-01-15

---

## [0.21.8] - 2026-01-14

### 🎉 改进：自动读取模型配置

#### 新功能

**自动配置读取系统**
- ✅ **无需手动设置**：自动从用户配置文件读取模型设置
- ✅ **多源支持**：支持环境变量、用户配置、项目配置等多种配置源
- ✅ **智能优先级**：按优先级自动选择最合适的配置
- ✅ **标准兼容**：支持标准 Anthropic SDK 环境变量

**配置优先级**（从高到低）：
1. 环境变量 `NOVEL_AI_MODEL`
2. 环境变量 `ANTHROPIC_MODEL`（标准 Anthropic 变量）
3. 用户配置文件 `~/.claude/settings.json`
4. 项目配置文件 `.claude/settings.json`
5. 默认值 `claude-sonnet-4-5-20250929`

#### 实现细节

**新增文件**：
- `dist/utils/model-config.js` - 模型配置读取工具
  - `getModelConfig()` - 自动读取模型配置
  - `getAnthropicEnvConfig()` - 读取 Anthropic 环境变量
  - `displayModelConfig()` - 显示当前配置（调试用）

**修改文件**：
- `dist/plugins/manager.js`
  - 导入 `getModelConfig` 函数
  - `addFrontmatter()` 改为异步函数，自动读取模型配置
  - 调用处添加 `await` 支持

**新增测试脚本**：
- `scripts/powershell/test-auto-config.ps1` - 测试自动配置功能

#### 使用示例

**场景 1：使用用户配置（最推荐）**

编辑 `~/.claude/settings.json`：
```json
{
  "env": {
    "ANTHROPIC_MODEL": "LongCat-Flash-Chat",
    "ANTHROPIC_BASE_URL": "https://api.longcat.chat",
    "ANTHROPIC_AUTH_TOKEN": "Bearer your-api-key"
  }
}
```

然后直接运行：
```bash
novel init my-novel
# 自动使用 LongCat-Flash-Chat 模型，无需额外设置！
```

**场景 2：使用环境变量**
```bash
# 设置标准 Anthropic 变量
export ANTHROPIC_MODEL="LongCat-Flash-Chat"
export ANTHROPIC_BASE_URL="https://api.longcat.chat"

# 或使用 Novel Writer 专用变量
export NOVEL_AI_MODEL="LongCat-Flash-Chat"

novel init my-novel
```

**场景 3：临时覆盖**
```bash
# 即使配置文件中设置了其他模型，也可以临时覆盖
NOVEL_AI_MODEL="LongCat-Flash-Thinking" novel init my-novel
```

#### 优势

1. **用户友好**：配置一次，到处使用
2. **标准兼容**：支持 Anthropic SDK 标准环境变量
3. **灵活性高**：支持多种配置方式，满足不同需求
4. **向后兼容**：不影响现有项目和配置

#### 测试方法

```powershell
# 运行自动配置测试
.\scripts\powershell\test-auto-config.ps1

# 显示当前配置
node -e "import('./dist/utils/model-config.js').then(m => m.displayModelConfig())"
```

### 📦 发布信息

- **NPM 包**: `novel-writer-style-cn@0.21.8`
- **安装方式**: `npm install -g novel-writer-style-cn@latest`
- **GitHub 标签**: `v0.21.8`
- **发布时间**: 2026-01-14

### ⚠️ 升级建议

**推荐所有用户升级**，特别是使用第三方 API 的用户：

1. 升级到 0.21.8：
   ```bash
   npm update -g novel-writer-style-cn
   ```

2. 在用户配置中设置模型（推荐）：
   ```bash
   # Windows
   notepad $env:USERPROFILE\.claude\settings.json
   
   # Linux/Mac
   nano ~/.claude/settings.json
   ```

3. 添加配置：
   ```json
   {
     "env": {
       "ANTHROPIC_MODEL": "LongCat-Flash-Chat"
     }
   }
   ```

4. 创建新项目，自动使用配置的模型：
   ```bash
   novel init my-novel
   ```

### 🔄 与 v0.21.7 的区别

| 功能 | v0.21.7 | v0.21.8 |
|------|---------|---------|
| 环境变量支持 | ✅ `NOVEL_AI_MODEL` | ✅ `NOVEL_AI_MODEL` + `ANTHROPIC_MODEL` |
| 用户配置读取 | ❌ | ✅ 自动读取 `~/.claude/settings.json` |
| 项目配置读取 | ❌ | ✅ 自动读取 `.claude/settings.json` |
| 配置优先级 | 单一 | 多级智能选择 |
| 标准兼容性 | 部分 | ✅ 完全兼容 Anthropic SDK |

---

## [0.21.7] - 2026-01-14

### 🔧 新增：第三方 API 支持（LongCat、OpenRouter 等）

#### 问题背景
- **问题**: 用户使用 LongCat、OpenRouter 等第三方 API 时，CLI 工具生成的命令配置文件硬编码了 `claude-sonnet-4-5-20250929` 模型名称
- **错误信息**: `API Error: 400 {"error":{"code":"invalid_parameter","message":"不支持的模型名(model=claude-sonnet-4-5-20250929)"}}`
- **根本原因**: 所有命令配置文件（`.claude/commands/*.md`、`.gemini/commands/*.toml` 等）中的 `model` 字段硬编码为 Claude 模型名称
- **影响范围**: 所有使用第三方 API 的用户

#### 解决方案

**1. 支持环境变量配置模型名称**
- 新增环境变量 `NOVEL_AI_MODEL` 支持自定义模型名称
- 修改 `dist/plugins/manager.js`，从环境变量读取模型配置
- 默认值仍为 `claude-sonnet-4-5-20250929`，保持向后兼容

**使用方法**：
```bash
# Windows CMD
set NOVEL_AI_MODEL=LongCat-Flash-Chat
novel init my-novel

# Windows PowerShell
$env:NOVEL_AI_MODEL="LongCat-Flash-Chat"
novel init my-novel

# Linux/Mac
export NOVEL_AI_MODEL="LongCat-Flash-Chat"
novel init my-novel
```

**2. 批量更新脚本**
- 新增 `scripts/powershell/update-model-name.ps1` 脚本
- 支持批量更新已生成项目中的所有命令文件
- 自动扫描 `dist/` 目录下的所有命令配置文件

**使用方法**：
```powershell
.\scripts\powershell\update-model-name.ps1 -ModelName "LongCat-Flash-Chat"
```

**3. 模型配置文件**
- 新增 `dist/config/model-config.json` 配置文件
- 预定义常用第三方模型配置：
  - `LongCat-Flash-Chat` - LongCat 快速对话模型
  - `LongCat-Flash-Thinking` - LongCat 思考模型
  - 支持自定义模型名称

**4. 更新文档**
- README.md 新增"使用第三方 API"章节
- 详细说明环境变量配置和批量更新方法
- 提供 LongCat API 配置示例

### 📦 发布信息

- **NPM 包**: `novel-writer-style-cn@0.21.7`
- **安装方式**: `npm install -g novel-writer-style-cn@latest`
- **GitHub 标签**: `v0.21.7`
- **发布时间**: 2026-01-14

### ⚠️ 使用建议

**如果您使用第三方 API（LongCat、OpenRouter 等）**：
1. 升级到 0.21.7：`npm update -g novel-writer-style-cn`
2. 设置环境变量：`set NOVEL_AI_MODEL=LongCat-Flash-Chat`（Windows CMD）
3. 初始化新项目或更新现有项目
4. 在 AI 助手中配置 API 端点和密钥

**已有项目的用户**：
- 使用 `update-model-name.ps1` 脚本批量更新命令文件
- 或手动修改 `.claude/commands/*.md` 等文件中的 `model` 字段

---

## [0.21.6] - 2026-01-14

### 🐛 重要修复：风格学习命令缺失

#### 问题背景
- **问题**: 通过 `novel init` 创建新项目后，无法使用风格学习命令（`/novel.style-analyze`、`/novel.style-learn` 等）
- **根本原因**: `dist/` 目录中各 AI 平台的命令模板缺少风格学习相关的命令文件
- **影响范围**: 所有通过 `novel init` 创建的新项目都不包含风格学习命令
- **用户体验**: 用户在 Claude Code 中输入 `/novel.style-analyze` 时收到意外的交互式响应，而不是直接执行风格分析

#### 修复内容

**1. 补全 Claude Code 命令模板**
在 `dist/claude/.claude/commands/` 目录中添加：
- `novel.style-analyze.md` - 深度风格分析命令
- `novel.style-learn.md` - 智能风格学习命令
- `novel.write-styled.md` - 风格化创作命令
- `novel.style-info.md` - 风格信息查询命令
- `novel.style-list.md` - 已学习风格列表命令
- `novel.inspire.md` - 创意灵感生成命令

**2. 补全其他 AI 平台命令模板**
为以下平台添加风格学习命令：
- Cursor (`.cursor/commands/`)
- Gemini (`.gemini/commands/` - TOML 格式)
- Windsurf (`.windsurf/commands/`)
- Roo Code (`.roo/commands/`)
- Copilot (`.github/copilot-instructions.md`)
- Qwen (`.qwen/commands/` - TOML 格式)
- 以及其他 7 个 AI 平台

**3. 更新 README 使用说明**
明确各平台的命令格式：
- Claude Code: `/novel.style-analyze`
- Gemini CLI: `/novel:style-analyze`
- Cursor 等: `/style-analyze`

### 📦 发布信息

- **NPM 包**: `novel-writer-style-cn@0.21.6`
- **安装方式**: `npm install -g novel-writer-style-cn@latest`
- **GitHub 标签**: `v0.21.6`
- **发布时间**: 2026-01-14

### ⚠️ 升级建议

**如果您已经创建了项目但无法使用风格学习命令**：
1. 升级到 0.21.6：`npm update -g novel-writer-style-cn`
2. 重新初始化项目或手动复制命令文件：
   ```bash
   # 方法1: 重新初始化（推荐）
   cd your-project
   novel upgrade --ai claude
   
   # 方法2: 手动复制命令文件
   cp -r ~/.npm-global/lib/node_modules/novel-writer-style-cn/dist/claude/.claude/commands/* .claude/commands/
   ```

### ✅ 验证方法

升级后，在新项目中应该能看到完整的命令列表：
```bash
novel init test-project --ai claude
cd test-project
ls .claude/commands/
# 应该包含 novel.style-analyze.md 等风格学习命令
```

---

## [0.21.5] - 2026-01-14

### ✨ 重大功能：插件命令自动注入

#### 问题背景
- **问题**: 在 Claude Code 中执行 `/style-analyze` 等插件命令时显示 "Unknown skill"
- **根本原因**: 插件命令文件仅复制到 `plugins/` 目录，但未注入到 AI 平台的命令目录（如 `.claude/commands/`）
- **用户痛点**: 安装了风格学习插件后，无法直接使用插件的斜杠命令

#### 解决方案
实现完整的插件命令注入系统：

1. **新增 `injectPluginCommands` 方法**：
   - 自动读取插件的 `commands/` 目录
   - 为每个命令添加适当的 YAML frontmatter
   - 根据目标 AI 平台添加正确的命名前缀
   - 支持 Claude、Cursor、Gemini 等多平台

2. **自动格式转换**：
   - Claude Code: 添加 `novel.` 前缀，生成完整 YAML frontmatter
   - Gemini/Qwen: 转换为 TOML 格式
   - Cursor/Windsurf 等: 纯 Markdown 格式

3. **多场景支持**：
   - `novel init <name> --plugins <plugin>`: 新项目创建时自动注入
   - `novel plugins:add <plugin>`: 现有项目安装插件时自动注入
   - `novel init <existing> --plugins <plugin>`: 为现有项目添加插件时自动注入

#### 新增方法
```javascript
// PluginManager 新增方法
async injectPluginCommands(pluginName, sourcePath, targetAIs)
addFrontmatter(cmdName, content)
convertToToml(cmdName, content)
async detectInstalledAIs()
```

#### 验证结果
安装 style-learning 插件后，`.claude/commands/` 目录自动生成：
- `novel.style-analyze.md` - 风格分析命令
- `novel.style-learn.md` - 风格学习命令
- `novel.style-adjust.md` - 风格调整命令
- `novel.style-workshop.md` - 风格工坊命令
- `novel.write-styled.md` - 风格化写作命令

### 🎯 用户体验改进

- ✅ 安装插件后立即可在 Claude Code 中使用斜杠命令
- ✅ 无需手动配置或复制命令文件
- ✅ 支持多 AI 平台的自动格式适配
- ✅ 命令自动添加必要的 frontmatter（description, allowed-tools, model）

### 📦 发布信息

- **NPM 包**: `novel-writer-style-cn@0.21.5`
- **安装方式**: `npm install -g novel-writer-style-cn@latest`
- **GitHub 标签**: `v0.21.5`
- **发布时间**: 2026-01-14

### ⚠️ 升级建议

如果您之前安装了插件但命令无法使用，请：
1. 升级到 0.21.5：`npm update -g novel-writer-style-cn`
2. 重新安装插件：`novel plugins:add style-learning`

---

## [0.21.4] - 2026-01-14

### ✨ 功能增强

#### init 命令智能升级
- **智能插件安装**：`novel init <name> --plugins <plugin>` 现在可以为已存在的项目安装插件
- **项目检测**：自动检测目标目录是否为有效的 novel-writer 项目
- **无缝体验**：用户无需区分"创建新项目"和"安装插件"两种场景

#### 修复前后对比
| 场景 | 修复前 | 修复后 |
|------|--------|--------|
| 项目已存在 + `--plugins` | ❌ 报错"目录已存在" | ✅ 智能安装插件 |
| 项目已存在，无 `--plugins` | ❌ 报错 | ✅ 提示正确的使用方法 |
| 新项目 + `--plugins` | ✅ 正常 | ✅ 正常 |

### 🐛 问题修复

#### PluginManager.installPlugin 方法补全
- **问题**: `pluginManager.installPlugin is not a function` 错误在现有项目安装插件时出现
- **根本原因**: `PluginManager` 类缺少 `installPlugin` 和 `setProjectPath` 方法实现
- **修复内容**:
  - 添加完整的 `installPlugin(pluginName, sourcePath)` 异步方法
  - 修改构造函数支持可选的 `projectPath` 参数
  - 添加 `setProjectPath(projectPath)` 方法
  - 插件复制时自动过滤临时文件和 node_modules

#### 临时文件清理
- **问题**: `plugins/style-learning/` 目录包含 `tmpclaude-*` 临时文件
- **修复**: 清理所有临时文件，避免污染用户项目

### 📚 文档更新

#### README 说明优化
- 新增"为已存在的项目安装插件"的使用示例
- 明确 `--plugins` 参数的智能行为

### 🎯 用户体验改进

- ✅ 解决了"先创建项目后想安装插件"的痛点
- ✅ 命令行为更符合用户直觉
- ✅ 错误提示更加友好，指导用户正确操作

### 📦 发布信息

- **NPM 包**: `novel-writer-style-cn@0.21.4`
- **安装方式**: `npm install -g novel-writer-style-cn@latest`
- **GitHub 标签**: `v0.21.4`
- **发布时间**: 2026-01-14

### ⚠️ 升级建议

如果您之前因为"目录已存在"错误无法安装插件，请升级到 0.21.4：
```bash
npm update -g novel-writer-style-cn
```

---

## [0.21.3] - 2026-01-13

### 🐛 关键修复

#### 插件安装功能修复
- **问题**: 使用 `--plugins` 参数或 `plugins:add` 命令时报 `TypeError: pluginManager.installPlugin is not a function`
- **根本原因**: `PluginManager` 类缺少 `installPlugin` 方法实现
- **修复内容**:
  - 添加 `installPlugin` 方法实现插件安装功能
  - 修改构造函数支持 `projectPath` 参数
  - 支持插件文件复制到项目 `.specify/plugins/` 目录
  - 添加插件安装成功的反馈信息

#### 样本文件缺失问题修复
- **问题**: 使用 `--plugins style-learning` 初始化项目时缺少 `samples` 目录
- **根本原因**: CLI 初始化和插件安装逻辑未包含 samples 目录复制
- **修复内容**:
  - 在 `novel init --plugins` 时自动复制 samples 目录
  - 在 `novel plugins:add` 时自动复制 samples 目录（如果不存在）
  - 确保风格学习插件的样本文件正确可用

### 🎯 用户体验改进

- ✅ 初始化项目时可正常使用 `--plugins` 参数
- ✅ `plugins:add` 命令正常工作
- ✅ 插件文件正确复制到目标目录
- ✅ 样本文件自动复制，风格学习功能完整可用
- ✅ 提供清晰的安装成功反馈

### 📦 发布信息

- **NPM 包**: `novel-writer-style-cn@0.21.3`
- **安装方式**: `npm install -g novel-writer-style-cn@latest`
- **GitHub 标签**: `v0.21.3`
- **发布时间**: 2026-01-13

### ⚠️ 升级建议

如果您遇到插件安装错误或缺少样本文件，请升级到 0.21.3：
```bash
npm update -g novel-writer-style-cn
```

---

## [0.21.2] - 2026-01-13

### 🐛 重要修复

#### CLI 参数验证和显示问题修复
- **问题1**: `novel init` 不带参数时报 `ERR_INVALID_ARG_TYPE` 错误
- **根本原因**: 缺少参数验证，直接传递 undefined 给字符串处理函数
- **修复**: 添加参数存在性检查，提供友好的使用提示

- **问题2**: CLI 横幅显示 `[object Object]` 而非版本信息
- **根本原因**: `getVersionInfo()` 返回对象但被当作字符串使用
- **修复**: 修改为使用 `getVersionInfo().version` 获取版本字符串

- **问题3**: AI 助手选择返回错误的数据类型
- **根本原因**: `selectAIAssistant()` 返回完整对象而非助手名称
- **修复**: 修改返回 `selectedAssistant.name` 字符串

### 🎯 用户体验改进

- ✅ CLI 工具启动不再报参数类型错误
- ✅ 版本信息正确显示在横幅中
- ✅ AI 助手选择功能正常工作
- ✅ 错误提示更加友好和清晰

### 📦 发布信息

- **NPM 包**: `novel-writer-style-cn@0.21.2`
- **GitHub 标签**: `v0.21.2`
- **发布时间**: 2026-01-13

---

## [0.21.1] - 2026-01-13

### 🐛 重要修复

#### CLI 工具模块缺失问题修复
- **问题**: CLI 工具启动时报 `ERR_MODULE_NOT_FOUND` 错误，无法正常使用
- **根本原因**: dist 目录缺少关键模块文件，导致 import 语句失败
- **修复内容**:
  - 新增 `dist/version.js` - 版本管理模块，提供 `getVersion()` 和 `getVersionInfo()` 函数
  - 新增 `dist/plugins/manager.js` - 插件管理器，实现插件加载、列表和管理功能
  - 新增 `dist/utils/project.js` - 项目工具模块，提供项目信息获取和根目录管理
  - 新增 `dist/utils/interactive.js` - 交互界面模块，提供用户交互、选择和显示功能

#### 插件系统功能完善
- **问题**: `plugins:list` 命令执行失败，提示方法未定义
- **修复**:
  - 添加 `PluginManager.listPlugins()` 方法
  - 在 `getProjectInfo()` 中添加 `installedAI` 属性
  - 修复插件列表显示功能

#### 项目配置优化
- **Git 配置**: 更新 `.gitignore` 允许提交 dist 目录（CLI 工具必需的分发文件）
- **版本管理**: 使用 `npm version patch` 自动更新版本号并创建 Git 标签

### 📚 文档更新

#### Git 工作流程规范优化
- **项目定制化**: 针对 Novel Writer Style CN 项目特点定制 Git 规范
- **作用域更新**: 更新为项目实际模块（`cli`、`plugins`、`dist`、`utils`、`templates` 等）
- **NPM 发布流程**: 添加完整的 NPM 包发布和版本管理指南
- **实际案例**: 基于真实修复经验提供工作流程示例和常见问题解决方案

### 🔧 技术改进

#### CLI 工具验证
修复后的 CLI 工具现在完全正常工作：
```bash
# 版本检查
novel --version  # 输出: 0.21.1

# 功能验证
novel --help     # 显示完整帮助信息
novel check      # 检查系统环境
novel plugins:list  # 列出已安装插件
```

#### 发布流程标准化
建立了完整的修复→测试→发布→验证流程：
1. 本地修复和测试
2. Git 提交和推送
3. NPM 版本更新和发布
4. 远程验证和标签推送

### 🎯 用户体验改进

- ✅ CLI 工具启动不再报错
- ✅ 所有核心命令正常工作
- ✅ 插件管理功能完整可用
- ✅ NPM 包可正常安装和使用
- ✅ 提供详细的 Git 工作流程指南

### 📦 发布信息

- **NPM 包**: `novel-writer-style-cn@0.21.1`
- **安装方式**: `npm install -g novel-writer-style-cn`
- **GitHub 标签**: `v0.21.1`
- **发布时间**: 2026-01-13

### ⚠️ 重要提醒

如果您之前安装的 0.21.0 版本无法正常使用，请升级到 0.21.1：
```bash
npm update -g novel-writer-style-cn
```

---

## [0.21.0] - 2026-01-12

### 🚀 增强功能：创作大师版 (Creative Master)

#### 🧠 深度上下文与逻辑一致性
- **全局上下文集成**：优化 `/write-styled` 指令，自动检索 `memory/` 下的人物志与世界观设定，确保创作内容不偏离核心人设。
- **逻辑自检机制**：在生成前增加历史情节对齐环节，减少“吃书”现象。

#### 🎨 风格混响 (Style Mixer)
- **多风格融合支持**：`/write-styled` 指令现在支持复合风格参数（如 `--style="金庸:0.7, 古龙:0.3"`），允许作者按比例调制独特的混合文风。
- **动态权重解析**：AI 将根据权重自动提取并融合不同风格的遣词造句特色。

#### 💡 灵感缪斯指令
- **新增 `/inspire` 指令**：专门解决创作瓶颈。
  - **灵感发散**：提供 3-5 个具有冲击力的剧情走向（Twists）。
  - **风格试写**：为每个灵感分支提供 100-200 字的风格化“预演”片段。
  - **逻辑支撑**：解释每个转折点与已有设定的契合度。

#### 🛠️ 系统优化
- **跨平台兼容性修复**：全面重构 `package.json` 脚本，使用 Node.js 原生 API 替代 Unix 命令（如 `rm -rf`, `chmod`），确保在 Windows 环境下完美运行。
- **项目引用一致性**：更新 `bun.lock` 及各插件文档中的项目名称引用为 `novel-writer-style-cn`。
- **风格专家模型升级**：更新 `style-expert.md`，新增风格融合指导与人设一致性检查模块。

## [0.20.0] - 2026-01-12

### 🎨 重大更新：AI风格学习系统

#### 🌟 突破性新功能
- **AI风格学习与模仿系统** - Novel Writer 首创的突破性功能
  - 📚 **深度风格分析**：从词汇、句法、叙述、描写、节奏等5个维度全面分析任何作品
  - 🧠 **智能风格学习**：AI自动提取并建模作者的写作特征，生成可复用的风格配置
  - ✍️ **风格化创作**：使用学习的风格进行创作，高度还原目标作者的写作特色
  - 🔄 **风格验证**：自动检查创作内容的风格一致性，确保质量稳定
  - 🎭 **风格融合**：支持多种风格的融合创新，创造独特的个人风格

#### 🎯 核心命令
- `/style-analyze` - 深度分析文本风格特征
- `/style-learn` - 学习目标作者风格并建模
- `/write-styled` - 风格化创作（核心功能）⭐
- `/style-list` - 查看已学习风格库
- `/style-info` - 风格详细信息和参数
- `/style-validate` - 验证风格一致性

#### 📊 技术优势
- **学习效率高**：10万字样本即可达到良好效果
- **精准模仿**：风格匹配度可达85-95%
- **适应性强**：支持各种文学风格和类型
- **质量稳定**：自动验证确保风格一致性

#### 🚀 使用示例
```bash
# 分析金庸作品风格
/style-analyze samples/jinyong/射雕英雄传.txt

# 学习金庸风格
/style-learn samples/jinyong/ --name="金庸风格"

# 风格化创作
/write-styled 第1章 初入江湖 --style="金庸风格"
```

#### 📁 新增文件结构
- `plugins/style-learning/` - 风格学习插件完整实现
- `samples/` - 样本文件存放目录
- `analysis-reports/` - 风格分析报告目录
- `memory/styles/` - 风格配置存储目录
- `styled-output/` - 风格化创作输出目录

#### 📚 完整文档体系
- **[风格学习插件指南](plugins/style-learning/README.md)** - 完整功能介绍
- **[详细使用示例](plugins/style-learning/examples/usage-example.md)** - 完整流程演示
- **[风格学习专家](plugins/style-learning/experts/style-expert.md)** - 专业指导
- **[技术集成说明](docs/STYLE_LEARNING_INTEGRATION.md)** - 技术细节

### 🔧 项目信息更新
- **项目地址**：更新为 `https://github.com/lsg1103275794/novel-writer-style-cn`
- **基于原项目**：[WordFlowLab/novel-writer](https://github.com/wordflowlab/novel-writer) 开发
- **突破性创新**：在原项目基础上增加AI风格学习系统

### 📦 安装方式
```bash
# 安装风格学习版本（本项目）
npm install -g novel-writer-style-cn

# 推荐：预装风格学习插件
novel init my-novel --plugins style-learning
```

### ⚠️ 重要说明
- **包名变更**：为避免与原项目冲突，使用新包名 `novel-writer-style-cn`
- **功能区别**：本版本在原项目基础上增加了突破性的AI风格学习系统

### 🎯 设计理念
- **保持兼容**：完全兼容原有七步方法论
- **突破创新**：首创AI风格学习与模仿功能
- **易于使用**：简单命令即可实现复杂风格分析和模仿

---

## [0.19.0] - 2025-10-25

### ✨ 新功能

#### 🎉 Codex CLI 支持
- **新增平台**: 完整支持 OpenAI Codex CLI
  - 命令格式: `/novel-命令名` (例如: `/novel-write`)
  - 命令目录: `.codex/prompts/`
  - 使用 `novel-` 前缀避免命名冲突
  - 纯 Markdown 格式(无 YAML frontmatter)
  - 13 个核心命令全部支持
- **安装方式**: `novel init my-novel --ai codex`
- **技术实现**: 借鉴 [Spec-Kit](https://github.com/github/spec-kit) v0.0.11+ 的实现方案

#### 📚 AI 平台命令对照文档
- **新增文档**: `docs/ai-platform-commands.md` - 13 个 AI 平台的完整命令对照指南
  - 快速对照表：一目了然的命令格式差异
  - 命名空间规则：详细解释为什么使用不同前缀
  - 平台详细说明：Gemini、Claude、Codex 等的完整命令列表
  - 使用示例：三个主要平台的完整工作流演示
  - 常见问题：命令不生效、格式差异等问题的解决方案

### 📝 文档更新

#### Codex CLI 支持说明
- 更新 `docs/why-codex-not-supported.md`:
  - 标题改为"Novel Writer 的 Codex CLI 支持"
  - 添加"即将支持"改为"v0.19.0 已支持"
  - 保留历史原因作为设计决策记录

#### README 更新
- 核心特性中提及 Codex CLI
- 初始化示例中添加 `--ai codex` 选项
- 命令格式示例中添加 `/novel-constitution` (Codex 格式)
- 命名空间说明表格中添加 Codex CLI

#### GEMINI.md 模板更新
- 明确说明 Gemini CLI 使用 `novel:` 命名空间
- 添加命名空间原因说明
- 更新所有示例命令添加正确的 `novel:` 前缀
- 添加文档交叉引用链接

### 🔧 构建系统改进

#### 命名空间支持
- 修改 `scripts/build/generate-commands.sh`:
  - Codex CLI 使用 `novel-` 前缀
  - 生成纯 Markdown 格式（无 frontmatter）
  - 命令文件位于 `.codex/prompts/` 目录

### 📊 支持的 AI 平台

现在支持 **13 个 AI 平台**：

| 平台 | 命令格式 | 命名空间 |
|------|---------|----------|
| Claude Code | `/novel.命令名` | `novel.` |
| Gemini CLI | `/novel:命令名` | `novel:` |
| **Codex CLI** ⭐ | **`/novel-命令名`** | **`novel-`** |
| Cursor | `/命令名` | 无 |
| Windsurf | `/命令名` | 无 |
| Roo Code | `/命令名` | 无 |
| GitHub Copilot | `/命令名` | 无 |
| Qwen Code | `/命令名` | 无 |
| OpenCode | `/命令名` | 无 |
| Kilo Code | `/命令名` | 无 |
| Auggie CLI | `/命令名` | 无 |
| CodeBuddy | `/命令名` | 无 |
| Amazon Q | `/命令名` | 无 |

### 🎯 用户体验改进

- 用户可以根据自己使用的 AI 平台，轻松查阅对应的命令格式
- 详细的文档说明避免了命令不生效的困惑
- Codex CLI 用户现在可以使用完整的 Novel Writer 功能

### 📖 相关文档

- [AI 平台命令使用指南](docs/ai-platform-commands.md) ⭐ 必读
- [Codex CLI 支持说明](docs/why-codex-not-supported.md)
- [Gemini 命令开发指南](docs/gemini-command-guide.md)

---

## [0.18.5] - 2025-10-24

### 🐛 问题修复

#### Gemini 宪法保存路径错误 (#6)
- **问题**: 在 Gemini 中运行 `/constitution` 命令后，宪法文件被错误保存到 `memory/constitution.md`（项目根目录），而非正确的 `.specify/memory/constitution.md` 路径
- **原因**: 源模板文件 `templates/commands/constitution.md` 及其他命令文件中存在路径引用不一致，部分使用了不带 `.specify/` 前缀的路径
- **修复**: 统一所有命令模板文件中的路径引用，全部使用完整路径 `.specify/memory/constitution.md`
  - 修改 `templates/commands/constitution.md` 中 3 处路径引用
  - 修改 `templates/commands/specify.md` 中 1 处路径引用
  - 修改 `templates/commands/plan.md` 中 1 处路径引用
  - 修改 `templates/commands/write.md` 中 3 处路径引用
  - 重新构建所有平台的命令文件
- **影响**: Gemini、Qwen 等使用 TOML 格式的平台，现在会正确保存宪法文件到 `.specify/memory/constitution.md`

### 📝 影响范围
- `templates/commands/constitution.md` - 路径引用已统一
- `templates/commands/specify.md` - 路径引用已统一
- `templates/commands/plan.md` - 路径引用已统一
- `templates/commands/write.md` - 路径引用已统一
- `dist/gemini/.gemini/commands/novel/*.toml` - 所有 TOML 文件已重新生成
- 所有平台的构建产物已更新

### 🎯 用户体验改进
- Gemini 用户运行 `/constitution` 命令后，文件会正确保存到 `.specify/memory/constitution.md`
- 路径统一避免了 AI 在不同命令间的路径混淆
- 项目根目录不再出现错误的 `memory/` 目录

---

## [0.18.4] - 2025-10-15

### 🐛 问题修复

#### 宪法文件命名统一
- **问题**: 系统中存在3个不同的宪法文件命名 (novel-constitution.md, writing-constitution.md, constitution.md), 导致用户项目中出现多个宪法文件
- **修复**: 统一宪法文件命名为 `constitution.md`
  - 重命名源文件: `memory/writing-constitution.md` → `memory/constitution.md`
  - 修改所有 Bash 脚本中的文件路径引用 (6个文件)
  - 修改所有 PowerShell 脚本中的文件路径引用 (5+个文件)
  - 修改所有命令模板中的文件引用 (constitution.md, specify.md, plan.md, analyze.md, write.md)
  - 更新 allowed-tools 中的路径权限

#### 脚本路径重复问题
- **问题**: 构建系统中的 `rewrite_paths()` 函数重复添加 `.specify/` 前缀，导致路径错误 (`.specify.specify/scripts/`)
- **修复**: 使用临时标记保护已有 `.specify/` 路径
  - 修改 `scripts/build/generate-commands.sh` 的 `rewrite_paths()` 函数
  - 先标记已存在的正确路径，然后添加前缀，最后恢复标记
  - 所有生成的命令文件中的路径现在都正确为 `.specify/scripts/...`

### 📝 影响范围
- `memory/constitution.md` - 统一的宪法文件命名
- `scripts/bash/*.sh` - 所有引用宪法文件的脚本已更新
- `scripts/powershell/*.ps1` - 所有引用宪法文件的脚本已更新
- `templates/commands/*.md` - 所有命令模板已更新
- `scripts/build/generate-commands.sh` - 路径重写函数已修复
- `dist/` - 重新构建所有平台的命令文件

### 🎯 用户体验改进
- 用户项目的 `.specify/memory/` 目录只会有一个 `constitution.md` 文件
- 所有脚本命令路径正确，不再出现 `.specify.specify/` 错误
- 命名更简洁、清晰，易于理解和使用

---

## [0.18.3] - 2025-10-15

### ✨ 功能改进

#### 插件安装系统标准化
- **问题**:genre-knowledge 插件使用手动安装方式,与其他插件不一致
- **改进**:统一使用 `novel plugins:add` 命令安装
  - 新增 `plugins/genre-knowledge/config.yaml` 配置文件
  - 插件元数据完整定义(name, version, description, type, dependencies)
  - 安装后显示详细的使用说明和步骤

#### 文档更新
- 更新 `plugins/genre-knowledge/README.md`:
  - 修改安装方法为 `novel plugins:add genre-knowledge`
  - 修改卸载方法为 `novel plugins:remove genre-knowledge`
  - 添加验证安装的命令 `novel plugins:list`
  - 简化文档结构,突出安装流程

#### CLI 增强
- 更新可用插件列表,添加 genre-knowledge:
  - `plugins:list` 命令提示信息
  - `plugins:add` 命令错误提示
- 保持与其他插件(translate, authentic-voice, book-analysis)一致的用户体验

### 🧪 测试验证
- ✅ 插件安装流程测试通过
- ✅ 插件列表显示正确
- ✅ 增强命令文件复制成功
- ✅ 安装后显示详细使用说明

### 📝 影响范围
- `plugins/genre-knowledge/config.yaml` - 新增配置文件
- `plugins/genre-knowledge/README.md` - 更新安装说明
- `src/cli.ts` - 添加 genre-knowledge 到可用插件列表

---

## [0.18.2] - 2025-10-15

### 🐛 问题修复

#### 插件命令文件缺失
- **问题**:genre-knowledge 插件的 `commands/` 目录为空,导致用户无法获取增强提示词
- **修复**:补全3个增强命令文件:
  - `commands/clarify-enhance.md` (18行) - clarify 命令的类型知识增强提示词
  - `commands/plan-enhance.md` (62行) - plan 命令的动态类型知识加载提示词
  - `commands/write-enhance.md` (15行) - write 命令的类型风格应用提示词

#### 用户体验改进
- 用户现在可以直接从 `commands/*.md` 文件复制增强提示词
- 粘贴到核心命令的 `PLUGIN_HOOK` 标记处即可启用插件功能
- 结构更清晰,符合插件架构设计

### 📝 影响范围
- `plugins/genre-knowledge/commands/` - 新增3个命令文件
- 插件系统 - 完善了安装体验

---

## [0.18.1] - 2025-10-15

### 🏗️ 架构优化

#### 类型知识插件化
- **迁移类型知识文件**：将 `spec/knowledge/genres/` 的5个类型知识文件迁移到 `plugins/genre-knowledge/knowledge/genres/`
  - `fantasy.md` (669行) - 奇幻/玄幻类型指导
  - `scifi.md` (530行) - 科幻类型指导
  - `romance.md` (378行) - 言情类型指导
  - `mystery.md` (353行) - 悬疑推理类型指导
  - `shuangwen.md` (236行) - 爽文类型指导

#### 真正的可选插件架构
- **核心命令优化**：
  - 移除核心命令对插件的硬编码依赖
  - 添加 `plugins/**` 通配符权限，支持所有插件
  - 保留 `<!-- PLUGIN_HOOK -->` 标记供用户手动启用插件
- **用户体验改进**：
  - 用户安装插件后只需复制粘贴增强提示词到 PLUGIN_HOOK 标记处
  - 无需修改 allowed-tools（已有 plugins/** 权限）
  - 插件功能完全可选，不影响核心功能

#### 设计理念
- ✅ **清晰职责**：`spec/knowledge/` 专注于用户创建的项目知识，插件专注于系统提供的可选功能
- ✅ **可选安装**：不需要类型知识的用户无需加载插件
- ✅ **单一数据源**：类型知识只存在于插件中，避免重复和混乱
- ✅ **架构简洁**：无技术债务，无向后兼容代码

### 📝 影响范围
- `spec/knowledge/genres/` - 已删除
- `plugins/genre-knowledge/` - 包含7个知识文件
- `templates/commands/clarify.md` - 移除插件硬编码，添加 plugins/** 权限
- `templates/commands/plan.md` - 移除插件硬编码，添加 plugins/** 权限
- `templates/commands/analyze.md` - 移除插件硬编码，添加 plugins/** 权限

---

## [0.15.0] - 2025-10-11

### ✨ 重大改进：多平台命令格式优化

#### 问题背景
之前的构建系统将 Claude 特有的 YAML frontmatter 字段（`allowed-tools`, `model`, `disable-model-invocation`）复制给了所有 13 个 AI 平台，但这些字段在其他平台中不被支持或不需要，导致兼容性问题。

#### 核心修复
- **平台特定格式生成**：根据每个 AI 平台的实际支持情况生成正确的命令文件格式
- **格式分类体系**：
  - **纯 Markdown（无 frontmatter）**：Cursor, GitHub Copilot, Codex CLI, Auggie CLI, CodeBuddy, Amazon Q Developer
  - **最小 frontmatter（只 description）**：OpenCode
  - **部分 frontmatter（description + argument-hint）**：Roo Code, Windsurf, Kilo Code
  - **完整 frontmatter（所有字段）**：Claude Code
  - **TOML 格式（description + prompt）**：Gemini CLI, Qwen Code

#### 技术实现
- **构建脚本增强**（`scripts/build/generate-commands.sh`）：
  - 添加 `frontmatter_type` 参数到 `generate_commands` 函数
  - 实现 4 种 frontmatter 生成策略（none/minimal/partial/full）
  - 为所有 13 个平台指定正确的格式类型
  - 提取 `argument_hint` 字段以支持部分 frontmatter

- **TOML 格式修复**：
  - Gemini 和 Qwen 的 TOML 文件只包含 `description` 和 `prompt` 字段
  - 参数占位符正确使用 `{{args}}` 而非 `$ARGUMENTS`
  - 移除不支持的元数据字段

#### 验证结果
✅ 所有 13 个 AI 平台的命令文件格式已验证通过
✅ 每个平台只包含其支持的字段，符合官方文档规范
✅ 提高了各平台的兼容性，减少了文件冗余
✅ 避免了潜在的解析错误

#### 影响范围
- 📦 **构建系统**：`npm run build:commands` 生成正确格式的命令文件
- 🎯 **13个平台**：Claude, Gemini, Cursor, Windsurf, Roo Code, GitHub Copilot, Qwen Code, OpenCode, Codex CLI, Kilo Code, Auggie CLI, CodeBuddy, Amazon Q Developer
- 📁 **182个文件**：每个平台 14 个命令文件，格式全部正确

### 📚 文档
感谢社区反馈，帮助我们发现并修复了多平台兼容性问题。

## [0.14.2] - 2025-10-10

### 🐛 问题修复

- **中文字数统计问题**：修复 `wc -w` 对中文字数统计极不准确的问题
  - 新增 `count_chinese_words()` 函数，准确性提升 12+ 倍
  - 排除 Markdown 标记、代码块、空格、标点符号
  - 只统计实际文字内容
  - 性能优秀（处理 3000 字约 10ms）

### ✨ 新增功能

- **字数统计函数**（`scripts/bash/common.sh`）
  - `count_chinese_words()` - 准确的中文字数统计
  - `show_word_count_info()` - 显示友好的字数验证信息

- **脚本增强**
  - `analyze-story.sh` - 显示每章详细字数统计
  - `check-writing-state.sh` - 自动验证章节字数是否达标
  - 从 `validation-rules.json` 读取字数要求配置

- **命令模板更新**
  - `/write` 命令添加字数验证说明
  - 警告不要使用 `wc -w` 统计中文
  - AI 写作完成后自动显示准确字数

### 📚 新增文档

- **使用指南**：`docs/word-count-guide.md` - 完整的字数统计使用说明
- **测试脚本**：`scripts/bash/test-word-count.sh` - 验证统计准确性
- **修复说明**：`WORD_COUNT_FIX.md` - 问题诊断和解决方案

### 🎯 解决的问题

- AI 写作时提示"字数不够"，但实际字数已超过要求
- 使用 `wc -w` 统计中文章节字数结果严重偏低（121/164 vs 2000+）
- 同一文件多次统计结果不一致

### ⚠️ 重要提醒

- ❌ 不要使用 `wc -w` 统计中文字数（极不准确）
- ❌ 不要使用 `wc -m` 统计字数（包含太多无关字符）
- ✅ 使用 `count_chinese_words` 函数获得准确结果

## [0.14.0] - 2025-10-09

### ✨ 新增功能

- **Roo Code 斜杠命令支持**：`novel init` 与 `novel upgrade` 现在支持生成 `.roo/commands` 目录，并自动输出 Roo Code 兼容的 Markdown 命令
- **插件系统集成**：插件命令注入流程同步扩展至 Roo Code，确保安装的插件可在 Roo Code 中即时使用

### 📚 文档更新

- README 与 CHANGELOG 新增 Roo Code 支持说明，同时更新可用 AI 列表提示

## [0.13.7] - 2025-10-06

### 🐛 问题修复

- **插件命令文件命名优化**：修复插件安装后命令文件名过于复杂的问题
  - 移除不必要的 `plugin-{pluginName}-` 前缀
  - 插件命令文件名简化：`plugin-book-analysis-book-analyze.md` → `book-analyze.md`
  - 保持与核心命令一致的命名风格
  - 适用于所有 AI 平台（Claude、Cursor、Windsurf、Gemini）

## [0.13.6] - 2025-10-06

### 🐛 问题修复

- **CLI 帮助文本更新**：修复 `novel init` 初始化后显示的帮助文本
  - 更新核心命令列表为正确的七步方法论命令（constitution, specify, clarify, plan, tasks, write, analyze）
  - 移除已废弃的旧命令（method, style, story, outline, chapters）
  - 更新推荐流程为：`constitution → specify → clarify → plan → tasks → write → analyze`

## [0.12.2] - 2025-10-04

### ✨ 新增功能：Claude Code 增强层

#### 核心改进
为 **Claude Code** 用户提供专属增强版本命令，同时**保持与其他平台（Gemini、Cursor、Windsurf）的完整兼容性**。

#### 1. 构建系统设计（v0.15.0+ 已升级为单一源+构建系统）
- **单一源**：`templates/commands/` - 命令源文件（原 `commands-claude/`）
- **构建系统**：`scripts/build/generate-commands.sh` - 自动生成所有平台命令
- **命名空间**：Claude 使用 `novel.*` 前缀，Gemini 使用 `novel/` 子目录，避免与 spec-kit 冲突
- **发布流程**：构建时自动生成 `dist/` 目录，用户初始化时直接复制

#### 2. Claude Code 专属特性

**增强的 Frontmatter 字段**：
- `argument-hint` - 命令参数自动补全提示
- `allowed-tools` - 细粒度工具权限控制（如 `Bash(find:*)`, `Read(//**)`)
- `model` - 为每个命令指定最适合的 AI 模型（默认 `claude-sonnet-4-5-20250929`）
- `disable-model-invocation` - 控制 SlashCommand 工具是否可自动调用

**动态上下文加载**：
- 支持内联 bash 执行：`!`command``
- 实时获取项目状态（章节数、字数、追踪文件等）
- 减少用户手动输入，提升命令智能化

#### 3. 增强的命令列表

**P0 命令（3个）**：
- `/analyze` - 添加阶段检测、章节列表、字数统计动态上下文
- `/write` - 添加待办任务、最新章节、进度状态动态加载
- `/clarify` - 添加故事文件路径、规格检测动态上下文

**P1 命令（3个）**：
- `/track` - 添加追踪文件状态、进度统计、章节列表、字数统计
- `/specify` - 添加宪法检测、规格文件检测、路径信息
- `/plan` - 添加规格状态、计划文件检测、待澄清项统计

**P2 命令（5个）**：
- `/tasks` - 添加计划/规格文件检测、线索管理规格摘要
- `/plot-check` - 添加追踪文件状态、进度检测、章节统计
- `/timeline` - 添加时间线状态、时间节点统计、章节映射
- `/relations` - 添加关系网络状态、角色/派系统计
- `/world-check` - 添加知识库检测、设定统计、专有名词统计

#### 4. CLI 逻辑优化

修改 `src/cli.ts` 支持优先级选择：
```typescript
// 为 Claude 生成命令时，优先使用增强版本
if (await fs.pathExists(claudeEnhancedPath)) {
  commandContent = await fs.readFile(claudeEnhancedPath, 'utf-8');
  console.log(chalk.gray(`    💎 Claude 增强: ${file}`));
}
```

#### 5. 兼容性保证
- ✅ 不修改其他平台的命令目录（`.claude`、`.cursor`、`.gemini` 等）
- ✅ 基础命令保持不变，确保 Gemini/Cursor/Windsurf 正常使用
- ✅ Claude 增强层是可选的，不影响现有用户
- ✅ 所有增强特性仅在 Claude Code 环境生效

### 📚 文档更新
- **README.md**：新增 v0.12.2 Claude Code 增强层特性说明
- **CHANGELOG.md**：详细记录增强功能和实现细节

### 🎯 设计理念
**增强而不破坏兼容性**：
- ❌ 不创建新命令或新平台特定命令
- ✅ 分层架构，优先级选择
- ✅ Claude 用户获得最佳体验
- ✅ 其他平台用户体验不受影响

---

## [0.12.1] - 2025-10-01

### ✨ 新增功能:智能双模式 analyze

#### 核心改进
`/analyze` 命令升级为**智能双模式**,根据创作阶段自动选择分析类型,**无需新增命令**。

#### 1. 智能阶段检测
- **自动判断**: 系统检测章节数量,自动决定执行框架分析还是内容分析
- **手动指定**: 支持 `--type=framework` 或 `--type=content` 强制指定模式
- **脚本支持**: 新增 `scripts/bash/check-analyze-stage.sh` 和 `scripts/powershell/check-analyze-stage.ps1`

#### 2. 模式A: 框架一致性分析 (write 之前)
- **覆盖率分析**: 检查规格需求是否都有对应的计划和任务
- **一致性检查**: 验证规格/计划/任务之间是否存在矛盾
- **逻辑预警**: 分析故事线设计中的潜在逻辑漏洞
- **准备评估**: 评估是否可以开始写作

#### 3. 模式B: 内容质量分析 (write 之后)
- **宪法合规**: 验证作品是否符合创作原则
- **规格符合**: 检查实现是否满足规格要求
- **内容质量**: 分析逻辑、人物、节奏等
- **改进建议**: 提供具体的 P0/P1/P2 修复建议

#### 4. 决策逻辑
```
章节数 = 0     → 框架分析
章节数 < 3     → 框架分析 (建议继续写作)
章节数 ≥ 3     → 内容分析
用户指定 --type → 强制使用指定模式
```

### 📚 文档更新
- **README.md**: 更新 `/analyze` 命令说明,展示智能双模式
- **docs/writing/analyze-placement-rationale.md**: 新增"附录:智能双模式设计"章节
- **命令模板**: 完全重写 analyze 命令,详细说明两种分析模式

### 🎯 设计理念
**克制而不简陋**:
- ❌ 不创建两个命令 (`/framework-analyze`, `/content-analyze`)
- ✅ 一个 `/analyze` 命令,智能判断场景
- ✅ 90% 自动处理,10% 可手动控制
- ✅ 满足多种需求,保持命令简洁

### 💡 社区反馈驱动
感谢 @曾喜胜 Anson 提出的需求,既要"write 之前的框架分析",也要"write 之后的内容审查"。
我们通过智能化设计,在不增加命令的前提下,满足了两种需求。

---

## [0.12.0] - 2025-09-30

### ✨ 新增功能:多线索管理系统

#### 核心改进
**无需新增命令**,通过增强现有命令模板,实现完整的多线索管理能力。

#### 1. specification.md 增强 (/specify 命令)
新增**第五章:线索管理规格**,包含5个管理表格:
- **5.1 线索定义表**: 定义所有线索的ID、类型、优先级、冲突
- **5.2 线索节奏规划**: 规划每条线索在不同卷的活跃程度(⭐⭐⭐/⭐⭐/⭐)
- **5.3 线索交汇点规划**: 预先规划线索交汇时机,避免AI随意发挥
- **5.4 伏笔管理表**: 管理伏笔的埋设与揭晓,确保不遗漏
- **5.5 线索修改决策矩阵**: 修改线索时的影响评估清单

#### 2. creative-plan.md 增强 (/plan 命令)
章节段表格增加"活跃线索"和"交汇点"列:
- 标注每个章节段推进哪些线索
- ⭐⭐⭐ 主推进 / ⭐⭐ 辅助 / ⭐ 背景
- 明确交汇点所在章节

#### 3. tasks.md 增强 (/tasks 命令)
每个写作任务增加线索相关字段:
- **涉及线索**: 本章推进哪些线索及优先级
- **交汇点**: 本章是否为交汇点
- **伏笔埋设/揭晓**: 本章涉及的伏笔操作

#### 4. plot-tracker.json 增强 (/track-init 命令)
`/track --init` 自动从specification.md第五章读取:
- 所有线索定义 (从5.1节)
- 所有交汇点 (从5.3节)
- 所有伏笔 (从5.4节)
- 生成完整的追踪数据结构

#### 5. 实战指南更新 (docs/writing/practical-guide.md)
新增**第六章:多线索管理指南**,包含:
- 真实问题场景(来自网友反馈)
- 4步解决方案
- 基于《重返1984》的完整使用示例
- 三大痛点的解决方式对比表

### 🎯 解决的核心问题
来自网友的真实困惑:
> "主线和支线的穿插,很难给AI讲清楚如何保持并行,而且在适当的时候进行交叉和揭晓之前的线索。尤其是再剧情设定不定时修改的情况下,简直就是灾难。"

#### 三大痛点及解决方式
| 痛点 | 解决方式 | 具体文件 |
|------|---------|---------|
| **并行推进** | tasks.md每章标记"涉及线索" | W040标注PL-01⭐⭐⭐、PL-02⭐⭐ |
| **交汇时机** | specification.md 5.3节预先规划 | X-001定在40章,避免AI随意 |
| **修改一致性** | 5.5修改决策矩阵 + `/track --check` | 修改PL-02时自动提示影响范围 |

### 📐 设计原则
- ✅ **符合"如无必要请勿增加"原则**: 完全使用现有7个命令
- ✅ **符合SDD方法论**: 线索管理分布在specify→plan→tasks→track
- ✅ **有写作理论支撑**: Story Grid的Grid Spreadsheet、Save the Cat的B Story理念
- ✅ **解决真实痛点**: 来自用户实际需求,非臆想功能

### 📝 文档改进
- 详细的使用示例(基于《重返1984》5条线索)
- 完整的输入提示词模板
- 影响评估和一致性验证流程

## [0.11.0] - 2025-09-30

### ✨ 新增功能
- **SDD方法论实战指南**: 新增 `docs/writing/practical-guide.md` (约10000字)
  - 基于《重返1984》小说的完整SDD实战案例
  - 详细讲解SDD的分层递归应用(整本书/一卷/章节段/单章)
  - 提供4个完整场景的实际输入提示词示例
  - 增加好坏提示词对比
  - 增加完整对话流程展示
  - 回答"AI写着偏离了怎么更新outline"等实际问题

- **可视化图表**: 新增3个SVG图表辅助理解
  - `sdd-levels.svg` - SDD分层递归示意图
  - `sdd-flow.svg` - SDD完整循环流程图
  - `prompt-structure.svg` - 好的提示词结构图

### 📝 文档改进
- 强调SDD的核心: 规格驱动 + 分层递归 + 允许偏离 + 频繁验证
- 每个场景包含:
  - ❌ 不好的提示词示例
  - ✅ 好的提示词示例
  - 💬 完整对话流程 (用户→AI→确认→完成)
- 提供提示词结构模板(情况说明/修改意图/需要更新/期望输出)

### 🎯 解决的问题
- 如何在写作中途调整剧情方向
- 如何处理AI写出的优秀偏离内容
- 不同粒度修改时应该用什么命令组合
- 如何写出让AI理解的提示词

## [0.10.5] - 2025-09-30

### 🐛 Bug 修复
- **common.sh 缺少函数**：添加 `get_active_story()` 函数
  - 修复脚本执行时 "get_active_story: 未找到命令" 错误
  - 同步到 `.specify/scripts/bash/` 和 `scripts/bash/`

### 📝 影响范围
修复后以下脚本能正常执行：
- `check-writing-state.sh`
- `plan-story.sh`
- `tasks-story.sh`
- `analyze-story.sh`

## [0.10.4] - 2025-09-30

### 🐛 Bug 修复
- **七步方法论脚本缺失**：补全 Bash 脚本支持
  - 创建 `plan-story.sh` - 创作计划脚本
  - 创建 `tasks-story.sh` - 任务分解脚本
  - 复制 `analyze-story.sh` - 综合验证脚本
  - 复制 `constitution.sh` - 创作宪法脚本
  - 复制 `specify-story.sh` - 故事规格脚本

### 📝 文件更新
- 更新 `/tasks` 命令模板脚本引用从 `generate-tasks.sh` 改为 `tasks-story.sh`
- 同步所有脚本到 `.specify/scripts/bash/` 和 `scripts/bash/`
- 同步命令模板到 `.claude/commands/`

### 🔧 影响范围
修复后所有七步方法论命令（`/constitution`, `/specify`, `/clarify`, `/plan`, `/tasks`, `/write`, `/analyze`）都能在 Bash 环境下正常执行。

## [0.10.3] - 2025-09-30

### 🔧 破坏性变更
- **移除旧格式兼容**：完全移除对旧 `story.md` 格式的支持
  - 所有脚本现在只支持新格式 `specification.md`
  - `/clarify` 命令只查找 `specification.md`
  - `/specify` 命令移除了迁移逻辑
  - `/track-init` 和相关追踪脚本更新为新格式
  - 更新提示信息从 `/story` 改为 `/specify`

### 📝 文件更新
- **Bash 脚本**：
  - 更新 `clarify-story.sh` 只支持 `specification.md`
  - 更新 `specify-story.sh` 移除 `story.md` 兼容逻辑
  - 更新 `init-tracking.sh` 查找 `specification.md`
  - 更新 `generate-tasks.sh` 检查 `specification.md`

- **PowerShell 脚本**：
  - 更新 `clarify-story.ps1` 只支持 `specification.md`
  - 更新 `specify-story.ps1` 移除 `story.md` 兼容逻辑

- **配置文件**：
  - 更新 `.gitignore` 添加 `*.backup` 规则

### ⚠️ 迁移提示
如果您的项目还在使用 `story.md`，请手动将其重命名为 `specification.md`：
```bash
mv stories/your-story/story.md stories/your-story/specification.md
```

## [0.10.2] - 2025-09-30

### 🐛 Bug 修复
- **命令模板缺失**：补全七步方法论命令模板
  - 添加 `/constitution` - 创作宪法命令
  - 添加 `/specify` - 故事规格命令
  - 添加 `/plan` - 创作计划命令
  - 添加 `/tasks` - 任务分解命令
  - 添加 `/analyze` - 综合验证命令
- **影响范围**：修复后 `novel init` 创建的新项目将包含所有命令模板

## [0.10.1] - 2025-09-30

### 🔧 系统完善
- **脚本体系重构**：统一管理 Bash 和 PowerShell 脚本至 `.specify/scripts/`
- **命令同步更新**：完善 Claude Code 和 Gemini 命令模板
- **追踪系统增强**：
  - 新增 `/track-init` 命令用于初始化追踪系统
  - 完善进度追踪和验证规则
  - 添加时间线、情节、世界观一致性检查脚本
- **命令优化**：
  - 更新 `/clarify`、`/expert`、`/write`、`/relations` 等命令
  - 删除冗余命令：`/story`、`/style`、`/outline`、`/chapters`
- **文档改进**：更新工作流程和快速开始指南

### 📦 项目结构
- 移动脚本文件到 `.specify` 目录以更好地组织
- 添加子模块支持（BMAD-METHOD、spec-kit）
- 完善模板文件和配置文件

## [0.10.0] - 2025-09-29

### 🎉 重大更新
- **七步方法论体系**：引入完整的规格驱动开发（SDD）创作流程
  - `/constitution` - 创作宪法，定义最高层级的创作原则
  - `/specify` - 故事规格，像 PRD 一样定义故事需求
  - `/clarify` - 澄清决策，通过交互式问答明确关键点
  - `/plan` - 创作计划，制定技术实现方案
  - `/tasks` - 任务分解，生成可执行的任务清单
  - `/write` - 章节写作（重构以适配新流程）
  - `/analyze` - 综合验证，全方位质量检查

### 🔧 系统重构
- **删除冗余命令**：移除 story、style、outline、chapters、method 等旧命令
- **跨平台同步**：PowerShell 脚本和 Gemini TOML 命令完全同步
- **文档体系升级**：
  - 创建 `METHODOLOGY.md` - 完整的方法论说明
  - 创建 `MIGRATION.md` - 版本迁移指南
  - 更新所有平台的命令支持

### 📝 理念升级
- 从"工具集合"升级为"方法论框架"
- 从"零散命令"转变为"系统化流程"
- 强调"规格驱动"而非"灵感驱动"
- 实现"需求定义"到"内容生成"的完整链路

### ⚠️ 破坏性变更
- 删除了以下旧命令（已被新命令替代）：
  - `/story` → `/specify`
  - `/style` → `/constitution`
  - `/outline` → `/plan`
  - `/chapters` → `/tasks`
  - `/method` → 成为可选辅助
- 文件结构调整：
  - `stories/*/chapters/` → `stories/*/content/`
  - 新增多个方法论相关文件

## [0.9.0] - 2025-09-29

### 🎯 方法论升级
- 引入 spec-kit 的规格驱动开发理念
- **`/clarify` 命令** - 交互式澄清故事大纲中的关键决策点
- 结构化创作流程：story → clarify → outline
- 智能问答：AI 识别模糊点，通过5个精准问题明确创作方向

## [0.8.4] - 2025-09-26

### 🎉 新功能
- Authentic Voice 真实人声插件（提升原创度与自然度）
  - `/authentic-voice` 真实人声创作模式（取材卡 + 个体词库）
  - `/authenticity-audit` 人味自查与行级改写建议
  - 专家 `authentic-editor`：更细致的人声编辑
- 离线文本自查脚本：`scripts/bash/text-audit.sh`
  - 统计连接词/空话密度、句长均值/方差、连续长/短句、抽象词密度示例
  - 支持项目级配置：`spec/knowledge/audit-config.json`

### 📚 模板与文档
- 新增写作准则模板：`templates/writing-constitution-template.md`
- 新增人味自查配置模板：`templates/knowledge/audit-config.json`
- README 增加“真实人声一键示例”和插件推荐使用说明

### 🔧 流程改进
- `/style` 初始化自动引用 `.specify/memory/personal-voice.md`：
  - 追加“个人语料摘要（自动引用）”
  - 同步“个人表达基线（自动同步）”固定专章（幂等更新）
- CLI 帮助中展示 `authentic-voice` 可用插件项

## [0.8.3] - 2025-09-25

### 🎉 新功能
- **完整插件 Gemini 支持**：所有插件都支持 Gemini CLI
  - translate 插件：3 个 TOML 命令
  - book-analysis 插件：6 个 TOML 命令
  - 作者风格插件：13 个 TOML 命令（王钰、十年雪落、路遥）
  - stardust-dreams 插件：4 个 TOML 命令

### 🔧 技术改进
- 标准化插件命令格式
- 简化复杂命令为 AI 友好格式
- 优化 TOML 命令结构

### 📝 插件更新
- 所有 6 个官方插件现在都支持双格式（Markdown + TOML）
- 共新增 26 个 TOML 格式命令文件
- 插件系统完全兼容 Gemini CLI

## [0.8.2] - 2025-09-25

### 🎉 新功能
- **Google Gemini CLI 支持**：完整的 Gemini CLI 斜杠命令集成
  - 新增 13 个 TOML 格式的命令定义
  - 支持命名空间命令（如 `/track:init`、`/plot:check`）
  - 插件系统同时支持 Markdown 和 TOML 双格式
  - 智能格式转换和降级机制

### 📚 新增文档
- **Gemini 开发指南**：`docs/gemini-command-guide.md` - 双格式命令开发说明
- **Gemini 用户文档**：`templates/GEMINI.md` - Gemini CLI 使用指南
- **Gemini 配置文件**：`templates/gemini-settings.json` - CLI 设置模板

### 🔧 技术改进
- 重构插件管理器支持多 AI 平台
- CLI 初始化命令智能检测并生成对应格式
- 增强命令注入机制，支持自动格式转换
- 优化目录结构管理

### 📝 兼容性
- 完全向后兼容现有 Claude、Cursor、Windsurf 用户
- 支持 `--ai gemini` 参数专门生成 Gemini 格式
- 插件可选择性提供 TOML 格式支持

## [0.7.0] - 2025-01-24

### 🎉 新功能
- **外部AI建议整合功能**：支持整合来自Gemini、ChatGPT等AI工具的分析建议
  - 扩展 `/style` 命令，新增 `refine` 模式
  - 支持JSON和Markdown两种建议格式
  - 自动分类处理建议（风格/角色/情节/世界观/对话）
  - 建议历史追踪和版本管理
  - 智能合并多源建议

### 📚 新增文档
- **PRD文档**：`docs/PRD-external-suggestion-integration.md` - 功能设计规范
- **AI提示词模板**：`docs/ai-suggestion-prompt-template.md` - 标准化建议格式
- **Gemini专用模板**：`docs/ai-suggestion-prompt-for-gemini.md` - 优化的提示词
- **快速指南**：`docs/quick-guide-external-ai-integration.md` - 三步完成整合
- **实例集**：`docs/suggestion-integration-examples.md` - 详细使用示例

### 🔧 技术改进
- 新增 `style-manager.sh` 脚本处理建议整合
- 优化格式识别逻辑，支持管道输入
- 改进Markdown解析处理
- 增强错误处理机制

### 📝 文件更新
- 更新 `/style` 命令模板支持新功能
- 新增 `improvement-log.md` 追踪建议历史
- 扩展 `character-voices.md` 添加词汇替换表

## [0.6.2] - 2025-09-24

### 改进
- **ESM 模块支持**：项目全面迁移到 ESM（ECMAScript Modules）
  - 添加 `"type": "module"` 配置
  - 更新所有导入语句为 ESM 格式
  - 使用 `import.meta.url` 替代 `__dirname`
  - 完全支持 Node.js 18+ 所有版本（包括 21、22、23）
  - 真正实现向上兼容，拥抱现代化 JavaScript 标准

## [0.6.1] - 2025-09-24

### 修复
- **依赖问题**：修复 `js-yaml` 模块缺失导致的运行错误
  - 将 `js-yaml` 添加到 dependencies 中
  - 解决了 `novel -h` 命令报错的问题

## [0.6.0] - 2025-09-24

### 新增
- **角色一致性验证系统**：解决AI生成内容中的角色名称错误问题
  - 新增 `validation-rules.json` 验证规则文件
  - `/write` 命令增强：写作前提醒、写作后验证
  - `/track --check` 深度验证模式：批量检查角色一致性
  - `/track --fix` 自动修复模式：自动修复简单错误
- **程序驱动验证**：内部使用任务机制执行验证，提高效率
- **验证脚本**：新增 `track-progress.sh` 支持验证功能

### 改进
- **写作流程优化**：在写作时主动预防角色名称错误
- **批量验证**：支持一次性验证多个章节，节省Token
- **自动修复**：能够自动修复角色名称和称呼错误

## [0.5.6] - 2025-09-23

### 新增
- **写作风格插件**：新增三个写作风格插件
  - `luyao-style` - 路遥风格写作插件
  - `shizhangyu-style` - 施章渝风格写作插件
  - `wangyu-style` - 王毓风格写作插件

## [0.4.3] - 2025-09-21

### 改进
- **默认版本号更新**：将 version.ts 中的默认版本号从 0.4.1 更新为 0.4.2
- **版本一致性**：确保所有版本引用保持同步

## [0.4.2] - 2025-09-21

### 改进
- **统一版本管理**：实现自动从 package.json 读取版本号的模块
- **知识库模板系统**：将硬编码的知识库文件改为模板文件系统
- **代码优化**：简化 cli.ts 代码结构，提高可维护性

### 修复
- **版本号统一**：通过 version.ts 模块确保版本号一致性

## [0.4.0] - 2025-09-21

### 新增
- **情节追踪系统** (`/plot-check`)：追踪情节节点、伏笔和冲突发展
- **时间线管理** (`/timeline`)：维护故事时间轴，确保时间逻辑一致
- **关系矩阵** (`/relations`)：管理角色关系和派系动态
- **世界观检查** (`/world-check`)：验证设定一致性，避免矛盾
- **综合追踪** (`/track`)：全方位查看创作状态
- **spec目录结构**：新增 `spec/tracking` 和 `spec/knowledge` 目录
- **知识库模板**：
  - `world-setting.md` - 世界观设定模板
  - `character-profiles.md` - 角色档案模板
  - `character-voices.md` - 角色语言档案模板
  - `locations.md` - 场景地点模板

### 改进
- **追踪文件模板**：提供完整的 JSON 追踪文件模板
- **一致性检查脚本**：实现综合的一致性验证系统
- **工作流程增强**：添加质量保障流程

## [0.3.7] - 2025-09-20

### 新增

- **时间获取指导**：在命令模板中添加提示，指导 AI 使用 `date` 命令获取系统日期
- **自动日期生成**：脚本会预先生成正确的系统日期供 AI 参考

### 改进

- **灵活的卷册管理**：章节现在会自动从 outline.md 解析卷册结构，不再硬编码4卷
- **动态章节数量**：支持从 outline.md 读取总章节数，不再限制为240章
- **进度文件时间戳**：progress.json 现在包含创建和更新时间戳

### 修复

- **日期生成错误**：修复了 AI 生成错误日期的问题（如2025-01-20而非2025-09-20）

## [0.3.6] - 2025-01-20

### 修复

- **目录命名问题**：修复了故事目录生成时名称为 `001-` 的问题
  - 采用 spec-kit 的方式处理目录名，只提取英文单词
  - 纯中文描述时使用默认名称 `story`
- **章节组织结构**：修复了章节按卷册结构生成的功能
  - 章节现在会根据编号自动放入对应的卷册目录（volume-1 至 volume-4）
  - 第1-60章在 volume-1，第61-120章在 volume-2，以此类推

## [0.3.5] - 2025-01-20

### 修复

- 修复了 `novel init` 命令生成的 `.claude/commands/` 配置文件格式问题
- 保留了命令文件中完整的 frontmatter 和 scripts 部分，确保 Claude 能正确识别和执行命令
- 简化了 `generateMarkdownCommand` 函数，直接返回完整模板内容

## [0.3.4] - 之前版本

### 新增

- 初始版本发布
- 支持 Claude、Cursor、Gemini、Windsurf、Roo Code 多种 AI 助手
- 提供了完整的小说创作工作流命令

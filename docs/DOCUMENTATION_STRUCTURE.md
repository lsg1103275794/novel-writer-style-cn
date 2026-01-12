# 文档结构说明

## 📁 文档组织结构

所有的说明文档现在都统一存放在 `docs/` 目录中，除了各个功能模块的 README.md 文件保持在原位置。

### 🗂️ 目录结构

```
novel-writer-style-cn/
├── docs/                           # 📚 文档中心
│   ├── README.md                   # 文档索引和导航
│   ├── INSTALLATION_COMPLETE.md   # 安装完成指南
│   ├── STYLE_LEARNING_INTEGRATION.md  # 风格学习集成说明
│   ├── METHODOLOGY.md              # 创作方法论
│   ├── novel-sdd.md               # 规格驱动创作法
│   └── DOCUMENTATION_STRUCTURE.md # 本文档
├── plugins/style-learning/
│   ├── README.md                   # 插件功能说明（保留原位置）
│   ├── examples/
│   │   └── usage-example.md        # 使用示例
│   └── experts/
│       └── style-expert.md         # 专家指导
├── experts/core/                   # 核心专家系统
│   ├── character.md
│   ├── plot.md
│   ├── style.md
│   └── world.md
├── templates/                      # 模板文件
│   ├── checklist-template.md
│   ├── outline-template.md
│   └── story-template.md
├── samples/
│   └── README.md                   # 样本使用说明（保留原位置）
└── README.md                       # 项目主说明（保留原位置）
```

## 📖 文档分类

### 🚀 用户指南类
- **README.md** (项目根目录) - 项目总览和快速开始
- **docs/INSTALLATION_COMPLETE.md** - 安装完成后的使用指南
- **docs/README.md** - 文档中心导航

### 📚 理论方法类
- **docs/METHODOLOGY.md** - Novel Writer 的七步创作方法论
- **docs/novel-sdd.md** - 规格驱动创作法详解

### 🔧 技术集成类
- **docs/STYLE_LEARNING_INTEGRATION.md** - 风格学习插件的技术集成说明

### 🎯 功能说明类
- **plugins/style-learning/README.md** - 风格学习插件功能说明
- **plugins/style-learning/examples/usage-example.md** - 详细使用示例
- **samples/README.md** - 样本文件使用说明

### 👨‍🏫 专家指导类
- **plugins/style-learning/experts/style-expert.md** - 风格学习专家
- **experts/core/*.md** - 核心专家系统（人物、剧情、文风、世界观）

### 📋 模板参考类
- **templates/*.md** - 各种创作模板和检查清单

## 🔍 文档查找指南

### 按使用场景查找

**🆕 新用户入门**
1. 项目 README.md - 了解项目概况
2. docs/INSTALLATION_COMPLETE.md - 安装后的使用指南
3. docs/METHODOLOGY.md - 学习创作方法论

**🎨 风格学习功能**
1. plugins/style-learning/README.md - 功能概览
2. plugins/style-learning/examples/usage-example.md - 详细使用流程
3. docs/STYLE_LEARNING_INTEGRATION.md - 技术集成细节

**📖 深入理解**
1. docs/novel-sdd.md - 理解规格驱动创作法
2. experts/core/*.md - 学习各专业领域知识
3. plugins/style-learning/experts/style-expert.md - 风格学习专业指导

**🛠️ 实际操作**
1. samples/README.md - 准备样本文件
2. templates/*.md - 使用创作模板
3. 各种命令文档 - 具体操作指南

### 按文档类型查找

**📋 快速参考**
- docs/README.md - 文档导航
- 项目 README.md - 命令速查

**📚 详细教程**
- docs/METHODOLOGY.md - 方法论教程
- plugins/style-learning/examples/usage-example.md - 使用教程

**🔧 技术文档**
- docs/STYLE_LEARNING_INTEGRATION.md - 技术集成
- plugins/style-learning/config.yaml - 配置参考

**👨‍🏫 专业指导**
- experts/core/*.md - 专业领域指导
- plugins/style-learning/experts/style-expert.md - 风格学习指导

## 📝 文档维护原则

### 位置原则
- **通用说明文档** → `docs/` 目录
- **功能模块README** → 保持在各自目录中
- **使用说明和指南** → 相关功能目录中

### 命名原则
- 使用英文文件名，便于跨平台兼容
- 使用大写字母开头，便于识别重要文档
- 使用描述性名称，便于理解内容

### 内容原则
- 每个文档都有明确的目标读者
- 提供清晰的导航和交叉引用
- 保持内容的时效性和准确性

## 🔄 文档更新流程

1. **新增功能** → 在相应目录创建说明文档
2. **重要更新** → 更新 docs/README.md 的索引
3. **结构调整** → 更新本文档的结构说明
4. **定期维护** → 检查链接有效性和内容准确性

---

通过这样的文档组织结构，用户可以快速找到所需的信息，开发者也能方便地维护和更新文档。
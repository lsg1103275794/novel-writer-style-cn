# Style Learning 插件 - 风格学习与模仿

## 简介

Style Learning Plugin 是一个智能风格分析和模仿工具，通过深度分析目标作品的写作风格，提取作者的语言特征、叙述习惯、节奏模式等，让AI能够模仿特定作者的写作风格进行创作。

**项目地址**：[https://github.com/lsg1103275794/novel-writer-style-cn](https://github.com/lsg1103275794/novel-writer-style-cn)  
**原始项目**：基于 [WordFlowLab/novel-writer](https://github.com/wordflowlab/novel-writer) 开发

## 功能特色

- 📚 **全文风格分析** - 深度解析整本小说的写作特征
- 🎨 **多维度特征提取** - 词汇、句式、节奏、描写手法全覆盖
- 🧠 **智能风格学习** - AI自动学习并内化作者风格
- ✍️ **风格化创作** - 基于学习的风格进行模仿创作
- 🔄 **风格对比** - 对比分析不同作者的风格差异
- 📊 **风格报告** - 生成详细的风格分析报告
- 🎯 **精准模仿** - 高度还原目标作者的写作特色

## 安装方法

```bash
# 安装风格学习插件
novel plugins add style-learning
```

## 使用方法

### 1. 准备样本文件

将要学习的小说文件放在项目的 `samples/` 目录下：

```
my-novel/
├── samples/           # 样本文件目录
│   ├── author-a/      # 作者A的作品
│   │   ├── novel1.txt
│   │   ├── novel2.txt
│   │   └── novel3.txt
│   ├── author-b/      # 作者B的作品
│   │   ├── work1.md
│   │   └── work2.md
│   └── reference/     # 参考作品
│       └── target-style.txt
```

### 2. 基础命令

#### 风格分析命令

```bash
# 分析单个作品的风格
/style-analyze [文件路径]

# 分析作者的整体风格（多个作品）
/author-analyze [作者目录]

# 对比分析多个作者的风格
/style-compare [作者1] [作者2]
```

#### 风格学习命令

```bash
# 学习目标风格
/style-learn [样本文件/目录]

# 查看已学习的风格
/style-list

# 切换当前使用的风格
/style-switch [风格名称]
```

#### 风格化创作命令

```bash
# 使用学习的风格进行创作
/write-styled [章节名] --style=[风格名]

# 将现有文本转换为目标风格
/style-convert [文本文件] --target=[风格名]

# 风格化改写
/rewrite-styled [段落] --style=[风格名]
```

### 3. 详细使用流程

#### 步骤 1：风格分析

```bash
# 分析金庸的写作风格
/style-analyze samples/jinyong/

# 输出示例：
# 正在分析金庸作品风格...
# ✓ 词汇特征分析完成
# ✓ 句式结构分析完成  
# ✓ 叙述节奏分析完成
# ✓ 描写手法分析完成
# 
# 风格分析报告已生成：analysis-reports/jinyong-style-analysis.md
```

#### 步骤 2：风格学习

```bash
# 学习金庸风格
/style-learn samples/jinyong/ --name="金庸风格"

# 输出示例：
# 开始学习金庸风格...
# ✓ 提取语言特征 (1247个特征点)
# ✓ 分析句式模式 (89种常用句式)
# ✓ 学习描写技法 (156种描写模式)
# ✓ 内化叙述节奏 (节奏模板已建立)
# 
# 风格学习完成！风格配置已保存到：memory/styles/金庸风格.json
```

#### 步骤 3：风格化创作

```bash
# 使用金庸风格写作
/write-styled 第1章 武林初现 --style="金庸风格"

# 或者在普通写作时指定风格
/write 第1章 武林初现
# AI会自动询问：检测到已学习的风格，是否使用"金庸风格"进行创作？
```

## 分析维度

### 1. 词汇特征分析

- **常用词汇统计** - 作者偏好的词汇和表达
- **专业术语** - 特定领域的词汇使用
- **情感词汇** - 表达情感的词汇偏好
- **修饰词使用** - 形容词、副词的使用习惯
- **口语化程度** - 书面语与口语的比例

### 2. 句式结构分析

- **句子长度分布** - 长句、短句的使用比例
- **句式复杂度** - 简单句、复合句、复杂句的分布
- **标点使用习惯** - 逗号、分号、破折号等的使用
- **句式变化** - 陈述句、疑问句、感叹句的比例
- **并列与递进** - 句子间的逻辑关系

### 3. 叙述技巧分析

- **视角选择** - 第一人称、第三人称的使用
- **时态运用** - 过去时、现在时的偏好
- **叙述距离** - 亲密叙述与疏离叙述
- **内心独白** - 心理描写的频率和方式
- **对话比例** - 对话与叙述的平衡

### 4. 描写手法分析

- **感官描写** - 视觉、听觉、触觉等的使用
- **环境描写** - 场景描述的详细程度
- **人物描写** - 外貌、动作、神态的描写方式
- **情感描写** - 情感表达的技巧和强度
- **比喻修辞** - 比喻、拟人等修辞手法

### 5. 节奏控制分析

- **段落长度** - 段落的平均长度和变化
- **信息密度** - 单位文字的信息量
- **张弛节奏** - 紧张与舒缓的交替
- **高潮设置** - 情节高潮的营造方式
- **过渡技巧** - 场景和时间的转换

## 输出文件结构

```
project/
├── samples/                    # 样本文件
├── analysis-reports/           # 分析报告
│   ├── [作者名]-style-analysis.md
│   ├── style-comparison.md
│   └── feature-extraction.json
├── memory/styles/              # 学习的风格配置
│   ├── 金庸风格.json
│   ├── 古龙风格.json
│   └── 个人风格.json
└── styled-output/              # 风格化创作输出
    ├── chapter-01-styled.md
    └── converted-text.md
```

## 风格配置文件示例

```json
{
  "styleName": "金庸风格",
  "author": "金庸",
  "analysisDate": "2025-01-12",
  "sampleFiles": ["射雕英雄传.txt", "神雕侠侣.txt"],
  
  "vocabulary": {
    "commonWords": ["江湖", "武功", "内力", "轻功"],
    "emotionalWords": ["愤怒", "悲伤", "欣喜"],
    "descriptiveWords": ["飘逸", "凌厉", "沉稳"],
    "formalityLevel": 0.7
  },
  
  "sentenceStructure": {
    "averageLength": 18.5,
    "lengthDistribution": {
      "short": 0.3,
      "medium": 0.5,
      "long": 0.2
    },
    "complexityScore": 0.6,
    "punctuationPatterns": {
      "comma": 0.45,
      "period": 0.35,
      "exclamation": 0.1,
      "question": 0.05,
      "dash": 0.05
    }
  },
  
  "narrativeTechniques": {
    "perspective": "third_person_omniscient",
    "tense": "past_tense",
    "dialogueRatio": 0.4,
    "innerMonologueFreq": 0.15,
    "narrativeDistance": "medium"
  },
  
  "descriptiveTechniques": {
    "sensoryDetails": {
      "visual": 0.6,
      "auditory": 0.2,
      "tactile": 0.15,
      "olfactory": 0.03,
      "gustatory": 0.02
    },
    "metaphorFrequency": 0.25,
    "environmentDetailLevel": 0.7,
    "characterDescriptionStyle": "action_based"
  },
  
  "rhythmPatterns": {
    "paragraphLength": {
      "average": 85,
      "variation": 0.4
    },
    "informationDensity": 0.6,
    "tensionCurve": "gradual_buildup",
    "transitionStyle": "scene_break"
  }
}
```

## 高级功能

### 1. 风格融合

```bash
# 融合多种风格
/style-blend [风格1] [风格2] --ratio=0.7:0.3

# 创建个性化风格
/style-create-personal --base=[基础风格] --adjust=[调整参数]
```

### 2. 风格进化

```bash
# 根据反馈优化风格
/style-evolve [风格名] --feedback=[反馈文件]

# 风格微调
/style-finetune [风格名] --aspect=[词汇/句式/节奏]
```

### 3. 风格验证

```bash
# 验证风格一致性
/style-validate [文本文件] --target=[风格名]

# 风格相似度检测
/style-similarity [文本1] [文本2]
```

## 最佳实践

### 1. 样本选择建议

- **数量充足**：至少3-5万字的样本
- **质量保证**：选择作者的代表作品
- **风格统一**：同一时期、同一类型的作品
- **多样性**：包含不同场景和情节类型

### 2. 学习策略

- **渐进学习**：先学习一种风格，熟练后再学习其他
- **对比分析**：通过对比加深对风格特征的理解
- **实践验证**：学习后立即进行创作实践
- **持续优化**：根据效果不断调整和完善

### 3. 创作应用

- **场景适配**：不同场景使用不同的风格强度
- **角色区分**：不同角色可以有不同的语言风格
- **情节配合**：风格要与情节发展相协调
- **读者考虑**：考虑目标读者对风格的接受度

## 注意事项

⚠️ **版权提醒**：仅用于学习和个人创作，不得用于商业抄袭

⚠️ **原创性**：风格学习是为了提升写作技巧，不是复制内容

⚠️ **适度模仿**：保持个人特色，避免完全模仿

⚠️ **质量控制**：模仿风格的同时要保证内容质量

## 技术原理

- **自然语言处理**：基于NLP技术分析文本特征
- **统计学习**：通过统计分析提取风格模式
- **机器学习**：使用ML算法学习和预测风格特征
- **模式匹配**：将学习的模式应用到新的创作中

## 更新日志

### v1.0.0 (2025-01-12)

- 初版发布
- 支持多维度风格分析
- 实现风格学习和模仿功能
- 提供风格化创作命令

## 支持

如遇问题或有建议，请提交 Issue：
[https://github.com/lsg1103275794/novel-writer-style-cn]

## 许可证

MIT License
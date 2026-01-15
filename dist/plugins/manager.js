import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { getModelConfig } from '../utils/model-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 插件管理器
 */
export class PluginManager {
    constructor(projectPath = null) {
        this.plugins = new Map();
        this.projectPath = projectPath;
        this.loadPlugins();
    }

    /**
     * 加载插件
     */
    loadPlugins() {
        try {
            const pluginsDir = path.join(__dirname, '..', '..', 'plugins');
            if (fs.existsSync(pluginsDir)) {
                const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);

                for (const pluginName of pluginDirs) {
                    this.loadPlugin(pluginName);
                }
            }
        } catch (error) {
            console.warn('Failed to load plugins:', error.message);
        }
    }

    /**
     * 加载单个插件
     */
    loadPlugin(pluginName) {
        try {
            const pluginPath = path.join(__dirname, '..', '..', 'plugins', pluginName);
            const packagePath = path.join(pluginPath, 'package.json');
            
            if (fs.existsSync(packagePath)) {
                const packageJson = fs.readJsonSync(packagePath);
                this.plugins.set(pluginName, {
                    name: pluginName,
                    version: packageJson.version || '1.0.0',
                    description: packageJson.description || '',
                    path: pluginPath
                });
            }
        } catch (error) {
            console.warn(`Failed to load plugin ${pluginName}:`, error.message);
        }
    }

    /**
     * 获取所有插件
     */
    getPlugins() {
        return Array.from(this.plugins.values());
    }

    /**
     * 获取插件
     */
    getPlugin(name) {
        return this.plugins.get(name);
    }

    /**
     * 检查插件是否存在
     */
    hasPlugin(name) {
        return this.plugins.has(name);
    }

    /**
     * 列出所有插件
     */
    listPlugins() {
        return this.getPlugins();
    }

    /**
     * 安装插件到项目
     * @param {string} pluginName - 插件名称
     * @param {string} sourcePath - 插件源路径
     * @returns {Promise<boolean>} - 安装是否成功
     */
    async installPlugin(pluginName, sourcePath) {
        if (!this.projectPath) {
            throw new Error('Project path not set. Cannot install plugin.');
        }

        try {
            // 目标路径：项目下的 plugins 目录
            const targetPluginDir = path.join(this.projectPath, 'plugins', pluginName);

            // 检查源插件是否存在
            if (!await fs.pathExists(sourcePath)) {
                throw new Error(`Plugin source not found: ${sourcePath}`);
            }

            // 确保目标目录存在
            await fs.ensureDir(path.dirname(targetPluginDir));

            // 如果目标已存在，先删除
            if (await fs.pathExists(targetPluginDir)) {
                await fs.remove(targetPluginDir);
            }

            // 复制插件文件
            await fs.copy(sourcePath, targetPluginDir, {
                overwrite: true,
                filter: (src) => {
                    // 排除临时文件和不必要的文件
                    const basename = path.basename(src);
                    return !basename.startsWith('tmpclaude-') &&
                           !basename.startsWith('.') &&
                           basename !== 'node_modules';
                }
            });

            // 重新加载插件列表
            this.loadPlugin(pluginName);

            return true;
        } catch (error) {
            console.error(`Failed to install plugin ${pluginName}:`, error.message);
            throw error;
        }
    }

    /**
     * 设置项目路径
     * @param {string} projectPath - 项目路径
     */
    setProjectPath(projectPath) {
        this.projectPath = projectPath;
    }

    /**
     * 将插件命令注入到 AI 平台的命令目录
     * @param {string} pluginName - 插件名称
     * @param {string} sourcePath - 插件源路径
     * @param {string[]} targetAIs - 目标 AI 平台列表
     * @returns {Promise<number>} - 注入的命令数量
     */
    async injectPluginCommands(pluginName, sourcePath, targetAIs = []) {
        if (!this.projectPath) {
            throw new Error('Project path not set. Cannot inject plugin commands.');
        }

        const commandsDir = path.join(sourcePath, 'commands');
        if (!await fs.pathExists(commandsDir)) {
            return 0; // 插件没有命令目录
        }

        const commandFiles = await fs.readdir(commandsDir);
        const mdFiles = commandFiles.filter(f => f.endsWith('.md'));

        if (mdFiles.length === 0) {
            return 0;
        }

        // AI 平台配置
        const AI_COMMAND_DIRS = {
            'claude': { dir: '.claude/commands', prefix: 'novel.', needsFrontmatter: true },
            'cursor': { dir: '.cursor/commands', prefix: '', needsFrontmatter: false },
            'gemini': { dir: '.gemini/commands/novel', prefix: '', needsFrontmatter: false, toml: true },
            'windsurf': { dir: '.windsurf/workflows', prefix: '', needsFrontmatter: false },
            'roocode': { dir: '.roo/commands', prefix: '', needsFrontmatter: false },
            'copilot': { dir: '.github/prompts', prefix: '', needsFrontmatter: false },
            'qwen': { dir: '.qwen/commands', prefix: '', needsFrontmatter: false, toml: true },
        };

        let injectedCount = 0;

        for (const ai of targetAIs) {
            const config = AI_COMMAND_DIRS[ai];
            if (!config) continue;

            const targetDir = path.join(this.projectPath, config.dir);

            // 确保目标目录存在
            if (!await fs.pathExists(targetDir)) {
                continue; // 如果 AI 目录不存在，跳过
            }

            // 对于 TOML 平台（Gemini/Qwen），优先使用 commands-gemini 目录
            if (config.toml) {
                const geminiCommandsDir = path.join(sourcePath, 'commands-gemini');
                if (await fs.pathExists(geminiCommandsDir)) {
                    // 直接复制 TOML 文件
                    const tomlFiles = (await fs.readdir(geminiCommandsDir)).filter(f => f.endsWith('.toml'));
                    for (const tomlFile of tomlFiles) {
                        const sourceFile = path.join(geminiCommandsDir, tomlFile);
                        const targetFile = path.join(targetDir, tomlFile);
                        await fs.copy(sourceFile, targetFile);
                        injectedCount++;
                    }
                    continue; // 跳过 Markdown 转换
                }
            }

            for (const cmdFile of mdFiles) {
                const cmdName = cmdFile.replace('.md', '');
                const sourceFile = path.join(commandsDir, cmdFile);
                const content = await fs.readFile(sourceFile, 'utf-8');

                if (config.toml) {
                    // 转换为 TOML 格式（如果没有 commands-gemini 目录）
                    const tomlContent = this.convertToToml(cmdName, content);
                    const targetFile = path.join(targetDir, `${cmdName}.toml`);
                    await fs.writeFile(targetFile, tomlContent, 'utf-8');
                } else {
                    // Markdown 格式
                    let finalContent = content;

                    if (config.needsFrontmatter && !content.startsWith('---')) {
                        // 添加 YAML frontmatter（异步调用）
                        finalContent = await this.addFrontmatter(cmdName, content);
                    }

                    const targetFileName = config.prefix ? `${config.prefix}${cmdName}.md` : `${cmdName}.md`;
                    const targetFile = path.join(targetDir, targetFileName);
                    await fs.writeFile(targetFile, finalContent, 'utf-8');
                }

                injectedCount++;
            }
        }

        return injectedCount;
    }

    /**
     * 为命令内容添加 YAML frontmatter
     * @param {string} cmdName - 命令名称
     * @param {string} content - 原始内容
     * @returns {Promise<string>} - 添加 frontmatter 后的内容
     */
    async addFrontmatter(cmdName, content) {
        // 从内容中提取第一行作为描述
        const lines = content.split('\n');
        let description = `${cmdName} 命令`;

        // 尝试从 # 标题或第一段提取描述
        for (const line of lines) {
            if (line.startsWith('# ')) {
                description = line.replace('# ', '').trim();
                break;
            }
            if (line.trim() && !line.startsWith('#')) {
                description = line.trim().substring(0, 80);
                break;
            }
        }

        // 自动读取模型配置（优先级：环境变量 > 用户配置 > 默认值）
        const modelConfig = await getModelConfig();
        const modelName = modelConfig.model;
        
        const frontmatter = `---
description: ${description}
argument-hint: [参数]
allowed-tools: Read(//**), Write(//**), Bash(*)
model: ${modelName}
---

`;
        return frontmatter + content;
    }

    /**
     * 将 Markdown 命令转换为 TOML 格式
     * @param {string} cmdName - 命令名称
     * @param {string} content - Markdown 内容
     * @returns {string} - TOML 格式内容
     */
    convertToToml(cmdName, content) {
        // 从内容中提取描述
        const lines = content.split('\n');
        let description = `${cmdName} 命令`;

        for (const line of lines) {
            if (line.startsWith('# ')) {
                description = line.replace('# ', '').trim();
                break;
            }
        }

        // 转义 TOML 多行字符串中的特殊字符
        const escapedContent = content.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"');

        return `description = "${description}"

prompt = """
${escapedContent}
"""
`;
    }

    /**
     * 检测项目中已安装的 AI 平台
     * @returns {Promise<string[]>} - AI 平台列表
     */
    async detectInstalledAIs() {
        if (!this.projectPath) {
            return [];
        }

        const aiDirs = {
            'claude': '.claude',
            'cursor': '.cursor',
            'gemini': '.gemini',
            'windsurf': '.windsurf',
            'roocode': '.roo',
            'copilot': '.github',
            'qwen': '.qwen',
        };

        const installedAIs = [];
        for (const [ai, dir] of Object.entries(aiDirs)) {
            if (await fs.pathExists(path.join(this.projectPath, dir))) {
                installedAIs.push(ai);
            }
        }

        return installedAIs;
    }
}
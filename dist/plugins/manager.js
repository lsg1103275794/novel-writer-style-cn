import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 插件管理器
 */
export class PluginManager {
    constructor() {
        this.plugins = new Map();
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
}
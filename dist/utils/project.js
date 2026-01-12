import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 确保项目根目录存在
 */
export function ensureProjectRoot() {
    const cwd = process.cwd();
    return cwd;
}

/**
 * 获取项目信息
 */
export function getProjectInfo() {
    try {
        const projectRoot = ensureProjectRoot();
        const packagePath = path.join(projectRoot, 'package.json');
        
        if (fs.existsSync(packagePath)) {
            const packageJson = fs.readJsonSync(packagePath);
            return {
                name: packageJson.name || 'unknown',
                version: packageJson.version || '1.0.0',
                description: packageJson.description || '',
                root: projectRoot,
                installedAI: [] // 添加默认的 AI 配置数组
            };
        }
        
        return {
            name: path.basename(projectRoot),
            version: '1.0.0',
            description: '',
            root: projectRoot,
            installedAI: [] // 添加默认的 AI 配置数组
        };
    } catch (error) {
        return {
            name: 'unknown',
            version: '1.0.0',
            description: '',
            root: process.cwd(),
            installedAI: [] // 添加默认的 AI 配置数组
        };
    }
}

/**
 * 检查是否在项目根目录
 */
export function isProjectRoot(dir = process.cwd()) {
    const packagePath = path.join(dir, 'package.json');
    return fs.existsSync(packagePath);
}

/**
 * 查找项目根目录
 */
export function findProjectRoot(startDir = process.cwd()) {
    let currentDir = startDir;
    
    while (currentDir !== path.dirname(currentDir)) {
        if (isProjectRoot(currentDir)) {
            return currentDir;
        }
        currentDir = path.dirname(currentDir);
    }
    
    return startDir;
}
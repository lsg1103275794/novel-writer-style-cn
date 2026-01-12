import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 获取版本号
 */
export function getVersion() {
    try {
        const packagePath = path.join(__dirname, '..', 'package.json');
        const packageJson = fs.readJsonSync(packagePath);
        return packageJson.version || '0.21.0';
    } catch (error) {
        return '0.21.0';
    }
}

/**
 * 获取版本信息
 */
export function getVersionInfo() {
    const version = getVersion();
    return {
        version,
        name: 'novel-writer-style-cn',
        description: 'AI 驱动的中文小说创作工具'
    };
}
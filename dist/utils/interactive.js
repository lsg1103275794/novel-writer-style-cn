import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

/**
 * 显示项目横幅
 */
export function displayProjectBanner() {
    console.log(chalk.cyan.bold('\n📚 Novel Writer Style CN'));
    console.log(chalk.gray('AI 驱动的中文小说创作工具\n'));
}

/**
 * 选择 AI 助手
 */
export async function selectAIAssistant(configs) {
    if (!isInteractive()) {
        return configs[0].name; // 返回第一个配置的 name
    }

    const choices = configs.map(config => ({
        name: `${config.displayName} (${config.name})`,
        value: config.name // 返回 name 而不是整个对象
    }));

    const { assistant } = await inquirer.prompt([
        {
            type: 'list',
            name: 'assistant',
            message: '选择 AI 助手:',
            choices
        }
    ]);

    return assistant;
}

/**
 * 选择写作方法
 */
export async function selectWritingMethod() {
    if (!isInteractive()) {
        return 'structured'; // 默认返回结构化写作
    }

    const { method } = await inquirer.prompt([
        {
            type: 'list',
            name: 'method',
            message: '选择写作方法:',
            choices: [
                { name: '结构化写作 (推荐)', value: 'structured' },
                { name: '自由写作', value: 'free' },
                { name: '模板写作', value: 'template' }
            ]
        }
    ]);

    return method;
}

/**
 * 选择脚本类型
 */
export async function selectScriptType() {
    if (!isInteractive()) {
        return 'novel'; // 默认返回小说
    }

    const { type } = await inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: '选择创作类型:',
            choices: [
                { name: '长篇小说', value: 'novel' },
                { name: '短篇故事', value: 'story' },
                { name: '剧本', value: 'script' },
                { name: '其他', value: 'other' }
            ]
        }
    ]);

    return type;
}

/**
 * 确认专家模式
 */
export async function confirmExpertMode() {
    if (!isInteractive()) {
        return false; // 默认不启用专家模式
    }

    const { expert } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'expert',
            message: '启用专家模式? (提供更多高级选项)',
            default: false
        }
    ]);

    return expert;
}

/**
 * 显示步骤信息
 */
export function displayStep(step, total, message) {
    console.log(chalk.blue(`[${step}/${total}]`) + ' ' + message);
}

/**
 * 检查是否在交互模式
 */
export function isInteractive() {
    return process.stdin.isTTY && process.stdout.isTTY;
}

/**
 * 显示加载动画
 */
export function createSpinner(text) {
    return ora(text);
}

/**
 * 显示成功消息
 */
export function displaySuccess(message) {
    console.log(chalk.green('✓ ' + message));
}

/**
 * 显示错误消息
 */
export function displayError(message) {
    console.log(chalk.red('✗ ' + message));
}

/**
 * 显示警告消息
 */
export function displayWarning(message) {
    console.log(chalk.yellow('⚠ ' + message));
}

/**
 * 显示信息消息
 */
export function displayInfo(message) {
    console.log(chalk.blue('ℹ ' + message));
}
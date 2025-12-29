/**
 * 游戏入口文件
 *
 * 职责：
 * 1. 初始化 Phaser 游戏实例
 * 2. 全局错误处理
 * 3. 显示加载状态
 */

import { createGame } from './Game';

/**
 * 初始化游戏
 */
function initGame(): void {
  try {
    console.log('========================================');
    console.log('PopMatch 消消乐游戏启动');
    console.log('========================================\n');

    // 创建 Phaser 游戏实例
    const game = createGame();

    // 输出游戏信息
    console.log('✅ 游戏初始化成功');
    console.log(`📦 Phaser 版本: ${game.VERSION}`);
    console.log(`🎮 渲染器: ${game.config.type === Phaser.AUTO ? 'AUTO' : game.config.type === Phaser.WEBGL ? 'WebGL' : 'Canvas'}`);
    console.log(`📐 画布尺寸: ${game.config.width} x ${game.config.height}\n`);

    // 监听游戏事件（可选）
    game.events.on('ready', () => {
      console.log('🎉 游戏准备就绪\n');
    });

    // 暴露到全局（开发调试用）
    if (process.env.NODE_ENV === 'development') {
      (window as any).game = game;
      console.log('💡 开发模式：游戏实例已暴露到 window.game');
    }
  } catch (error) {
    console.error('❌ 游戏初始化失败:', error);
    showErrorMessage('游戏加载失败，请刷新页面重试');
  }
}

/**
 * 显示错误信息
 */
function showErrorMessage(message: string): void {
  const container = document.getElementById('game-container');
  if (container) {
    container.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 600px;
        color: white;
        font-family: Arial, sans-serif;
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
      ">
        <div>
          <h2 style="margin: 0 0 10px 0;">⚠️ 错误</h2>
          <p style="margin: 0;">${message}</p>
        </div>
      </div>
    `;
  }
}

// 等待 DOM 加载完成后启动游戏
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

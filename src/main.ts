/**
 * 游戏入口文件
 */

import { createGame } from './Game';

// 启动游戏
const game = createGame();

console.log('游戏已启动');
console.log('Phaser 版本:', game.VERSION);

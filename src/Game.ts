/**
 * 游戏配置和初始化
 */

import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

// 游戏画布尺寸
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

/**
 * Phaser 游戏配置
 */
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  // backgroundColor 由 MainScene 根据 BACKGROUND_CONFIG 动态设置
  transparent: false,
  scene: [MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

/**
 * 创建游戏实例
 */
export function createGame(): Phaser.Game {
  const game = new Phaser.Game(gameConfig);
  return game;
}

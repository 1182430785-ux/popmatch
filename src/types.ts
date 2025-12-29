/**
 * 全局类型定义
 *
 * 将共享的接口定义集中管理，避免循环引用
 */

import { Cell } from './Cell';

/**
 * 元素移动信息
 * 用于动画系统记录元素的移动轨迹
 */
export interface CellMoveInfo {
  cell: Cell;
  fromRow: number;
  toRow: number;
  col: number;
}

/**
 * 重力系统结果
 * 包含下落的元素和新生成的元素
 */
export interface GravityResult {
  moved: CellMoveInfo[];  // 下落的元素列表
  filled: Cell[];         // 新生成的元素列表
}

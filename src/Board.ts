/**
 * 棋盘数据模型（纯逻辑）
 */

import { Cell } from './Cell';
import { BOARD_ROWS, BOARD_COLS, ELEMENT_TYPES } from './constants';

/**
 * 元素移动信息
 */
export interface CellMoveInfo {
  cell: Cell;
  fromRow: number;
  toRow: number;
  col: number;
}

/**
 * 重力结果
 */
export interface GravityResult {
  moved: CellMoveInfo[];  // 下落的元素
  filled: Cell[];         // 新生成的元素
}

/**
 * 匹配组信息
 */
export interface MatchGroup {
  cells: Cell[];          // 匹配的单元格列表
  count: number;          // 匹配数量
  direction: 'horizontal' | 'vertical';  // 匹配方向
}

export class Board {
  /** 二维数组保存棋盘数据 */
  private grid: Cell[][];

  /** 行数 */
  public readonly rows: number;

  /** 列数 */
  public readonly cols: number;

  constructor() {
    this.rows = BOARD_ROWS;
    this.cols = BOARD_COLS;
    this.grid = [];

    this.initialize();
  }

  /**
   * 初始化棋盘，随机生成元素
   */
  private initialize(): void {
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const type = this.getRandomType();
        this.grid[row][col] = new Cell(row, col, type);
      }
    }

    console.log('[Board] 棋盘初始化完成');
  }

  /**
   * 获取随机元素类型
   */
  private getRandomType(): number {
    return Math.floor(Math.random() * ELEMENT_TYPES);
  }

  /**
   * 获取指定位置的单元格
   */
  public getCell(row: number, col: number): Cell | null {
    if (this.isValidPosition(row, col)) {
      return this.grid[row][col];
    }
    return null;
  }

  /**
   * 设置指定位置的单元格
   */
  public setCell(row: number, col: number, cell: Cell): void {
    if (this.isValidPosition(row, col)) {
      this.grid[row][col] = cell;
      cell.row = row;
      cell.col = col;
    }
  }

  /**
   * 检查位置是否有效
   */
  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  /**
   * 打印棋盘状态（用于调试）
   */
  public print(): void {
    console.log('[Board] 当前棋盘状态：');
    for (let row = 0; row < this.rows; row++) {
      const rowStr = this.grid[row].map(cell => cell ? cell.type.toString() : 'X').join(' ');
      console.log(`  行 ${row}: ${rowStr}`);
    }
    const emptyCount = this.countEmptyCells();
    if (emptyCount > 0) {
      console.log(`[Board] 空单元格数量: ${emptyCount}`);
    }
  }

  /**
   * 获取所有单元格
   */
  public getAllCells(): Cell[] {
    const cells: Cell[] = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        cells.push(this.grid[row][col]);
      }
    }
    return cells;
  }

  /**
   * 交换两个单元格的类型
   */
  public swap(row1: number, col1: number, row2: number, col2: number): void {
    const cell1 = this.getCell(row1, col1);
    const cell2 = this.getCell(row2, col2);

    if (!cell1 || !cell2) {
      console.error('[Board] 交换失败：单元格不存在');
      return;
    }

    // 交换类型
    const tempType = cell1.type;
    cell1.type = cell2.type;
    cell2.type = tempType;

    console.log(`[Board] 交换: (${row1},${col1})[${cell2.type}] <-> (${row2},${col2})[${cell1.type}]`);
  }

  /**
   * 查找所有匹配组（包含分组信息）
   * @returns 匹配组数组
   */
  public findMatchGroups(): MatchGroup[] {
    const groups: MatchGroup[] = [];

    // 检测横向匹配组
    const horizontalGroups = this.checkHorizontalMatchGroups();
    groups.push(...horizontalGroups);

    // 检测纵向匹配组
    const verticalGroups = this.checkVerticalMatchGroups();
    groups.push(...verticalGroups);

    if (groups.length > 0) {
      const totalCells = groups.reduce((sum, g) => sum + g.count, 0);
      console.log(`[Board] 找到 ${groups.length} 个匹配组，共 ${totalCells} 个单元格`);
      groups.forEach((g, i) => {
        console.log(`  组 ${i + 1}: ${g.count} 个${g.direction === 'horizontal' ? '横向' : '纵向'}匹配`);
      });
    }

    return groups;
  }

  /**
   * 查找所有需要消除的单元格（去重后的列表）
   * @returns 需要消除的单元格数组
   */
  public findMatches(): Cell[] {
    const groups = this.findMatchGroups();
    const matchedCells = new Set<Cell>();

    groups.forEach(group => {
      group.cells.forEach(cell => matchedCells.add(cell));
    });

    const result = Array.from(matchedCells);

    if (result.length > 0) {
      console.log(`[Board] 去重后需要消除 ${result.length} 个单元格`);
    }

    return result;
  }

  /**
   * 检测横向匹配组（每行从左到右）
   */
  private checkHorizontalMatchGroups(): MatchGroup[] {
    const groups: MatchGroup[] = [];

    for (let row = 0; row < this.rows; row++) {
      let matchLength = 1;
      let currentType = this.grid[row][0].type;

      for (let col = 1; col < this.cols; col++) {
        const cell = this.grid[row][col];

        if (cell.type === currentType) {
          // 相同类型，延续匹配
          matchLength++;
        } else {
          // 不同类型，检查之前的匹配
          if (matchLength >= 3) {
            // 记录匹配组
            const cells: Cell[] = [];
            for (let i = col - matchLength; i < col; i++) {
              cells.push(this.grid[row][i]);
            }
            groups.push({
              cells,
              count: matchLength,
              direction: 'horizontal'
            });
          }

          // 重置匹配
          currentType = cell.type;
          matchLength = 1;
        }
      }

      // 检查行尾的匹配
      if (matchLength >= 3) {
        const cells: Cell[] = [];
        for (let i = this.cols - matchLength; i < this.cols; i++) {
          cells.push(this.grid[row][i]);
        }
        groups.push({
          cells,
          count: matchLength,
          direction: 'horizontal'
        });
      }
    }

    return groups;
  }

  /**
   * 检测横向匹配（每行从左到右）- 兼容旧接口
   */
  private checkHorizontalMatches(): Cell[] {
    const groups = this.checkHorizontalMatchGroups();
    const cells: Cell[] = [];
    groups.forEach(g => cells.push(...g.cells));
    return cells;
  }

  /**
   * 检测纵向匹配组（每列从上到下）
   */
  private checkVerticalMatchGroups(): MatchGroup[] {
    const groups: MatchGroup[] = [];

    for (let col = 0; col < this.cols; col++) {
      let matchLength = 1;
      let currentType = this.grid[0][col].type;

      for (let row = 1; row < this.rows; row++) {
        const cell = this.grid[row][col];

        if (cell.type === currentType) {
          // 相同类型，延续匹配
          matchLength++;
        } else {
          // 不同类型，检查之前的匹配
          if (matchLength >= 3) {
            // 记录匹配组
            const cells: Cell[] = [];
            for (let i = row - matchLength; i < row; i++) {
              cells.push(this.grid[i][col]);
            }
            groups.push({
              cells,
              count: matchLength,
              direction: 'vertical'
            });
          }

          // 重置匹配
          currentType = cell.type;
          matchLength = 1;
        }
      }

      // 检查列尾的匹配
      if (matchLength >= 3) {
        const cells: Cell[] = [];
        for (let i = this.rows - matchLength; i < this.rows; i++) {
          cells.push(this.grid[i][col]);
        }
        groups.push({
          cells,
          count: matchLength,
          direction: 'vertical'
        });
      }
    }

    return groups;
  }

  /**
   * 检测纵向匹配（每列从上到下）- 兼容旧接口
   */
  private checkVerticalMatches(): Cell[] {
    const groups = this.checkVerticalMatchGroups();
    const cells: Cell[] = [];
    groups.forEach(g => cells.push(...g.cells));
    return cells;
  }

  /**
   * 移除指定的单元格（设为 null）
   * @param cells 需要移除的单元格数组
   */
  public removeCells(cells: Cell[]): void {
    if (cells.length === 0) {
      return;
    }

    console.log(`[Board] 开始移除 ${cells.length} 个单元格`);

    cells.forEach(cell => {
      if (this.isValidPosition(cell.row, cell.col)) {
        this.grid[cell.row][cell.col] = null as any; // 设为 null 表示空位
        console.log(`[Board] 移除单元格: (${cell.row}, ${cell.col}) - 类型: ${cell.type}`);
      }
    });

    console.log('[Board] 单元格移除完成');
  }

  /**
   * 检查指定位置是否为空
   */
  public isEmpty(row: number, col: number): boolean {
    if (!this.isValidPosition(row, col)) {
      return false;
    }
    return this.grid[row][col] === null;
  }

  /**
   * 统计空单元格数量
   */
  public countEmptyCells(): number {
    let count = 0;
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col] === null) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * 应用重力：让上方元素下落填补空位
   * @returns 下落的元素信息
   */
  public applyGravity(): CellMoveInfo[] {
    console.log('[Board] 开始应用重力');

    const allMoves: CellMoveInfo[] = [];

    // 对每一列应用重力
    for (let col = 0; col < this.cols; col++) {
      const moves = this.applyGravityToColumn(col);
      allMoves.push(...moves);
    }

    if (allMoves.length > 0) {
      console.log(`[Board] 重力应用完成: ${allMoves.length} 个元素下落`);
    } else {
      console.log('[Board] 重力应用完成: 没有元素需要下落');
    }

    return allMoves;
  }

  /**
   * 对单列应用重力
   * @returns 该列下落的元素信息
   */
  private applyGravityToColumn(col: number): CellMoveInfo[] {
    const moves: CellMoveInfo[] = [];

    // 从下往上扫描，找到空位
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.grid[row][col] === null) {
        // 找到空位，向上查找非空元素
        for (let upperRow = row - 1; upperRow >= 0; upperRow--) {
          if (this.grid[upperRow][col] !== null) {
            // 找到非空元素，记录移动信息
            const cell = this.grid[upperRow][col];
            moves.push({
              cell,
              fromRow: upperRow,
              toRow: row,
              col,
            });

            // 下落到当前空位
            this.grid[row][col] = cell;
            this.grid[row][col].row = row; // 更新行坐标
            this.grid[upperRow][col] = null as any;
            break;
          }
        }
      }
    }

    return moves;
  }

  /**
   * 填充空位：在顶部生成新元素
   * @returns 新生成的元素
   */
  public fillEmptySpaces(): Cell[] {
    console.log('[Board] 开始填充空位');

    const newCells: Cell[] = [];

    // 对每一列填充空位
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (this.grid[row][col] === null) {
          // 生成新元素
          const type = this.getRandomType();
          const cell = new Cell(row, col, type);
          this.grid[row][col] = cell;
          newCells.push(cell);
          console.log(`[Board] 在 (${row}, ${col}) 生成新元素，类型: ${type}`);
        }
      }
    }

    if (newCells.length > 0) {
      console.log(`[Board] 填充完成: 生成 ${newCells.length} 个新元素`);
    } else {
      console.log('[Board] 填充完成: 没有空位需要填充');
    }

    return newCells;
  }

  /**
   * 应用重力并填充空位（组合操作）
   * @returns 重力结果（移动和填充信息）
   */
  public applyGravityAndFill(): GravityResult {
    console.log('\n=== 开始重力系统 ===');

    const emptyBefore = this.countEmptyCells();
    console.log(`[Board] 空位数量: ${emptyBefore}`);

    // 1. 应用重力，让元素下落
    const moved = this.applyGravity();

    // 2. 填充顶部空位
    const filled = this.fillEmptySpaces();

    const emptyAfter = this.countEmptyCells();
    console.log(`[Board] 最终空位数量: ${emptyAfter}`);

    console.log('=== 重力系统完成 ===\n');

    return { moved, filled };
  }
}

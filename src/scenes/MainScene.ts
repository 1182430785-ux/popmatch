/**
 * 主场景
 */

import Phaser from 'phaser';
import { Board, CellMoveInfo, GravityResult, MatchGroup } from '../Board';
import { Cell } from '../Cell';
import {
  CELL_SIZE,
  CELL_GAP,
  BOARD_OFFSET_X,
  BOARD_OFFSET_Y,
  ELEMENT_COLORS,
  ELEMENT_CONFIGS,
  RENDER_MODE,
  BACKGROUND_CONFIG,
} from '../constants';

// 动画时长常量（毫秒）
const ANIM_SWAP_DURATION = 250;      // 交换动画
const ANIM_ELIMINATE_DURATION = 300; // 消除闪烁
const ANIM_FALL_DURATION = 400;      // 下落动画

export class MainScene extends Phaser.Scene {
  /** 用于控制 update 日志只打印一次 */
  private updateLogPrinted: boolean = false;

  /** 棋盘数据模型 */
  private board!: Board;

  /** 存储所有单元格的容器对象 */
  private cellContainers: Phaser.GameObjects.Container[][] = [];

  /** 当前选中的单元格 */
  private selectedCell: { row: number; col: number } | null = null;

  /** 选中框 */
  private selectionBorder: Phaser.GameObjects.Graphics | null = null;

  /** 是否正在播放动画（防止重复点击） */
  private isAnimating: boolean = false;

  /** 当前分数 */
  private score: number = 0;

  /** 分数显示文本 */
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MainScene' });
    console.log('[MainScene] constructor 执行');
  }

  /**
   * 预加载资源
   */
  preload(): void {
    console.log('[MainScene] preload 执行');

    // 加载背景图片（如果配置了）
    if ((BACKGROUND_CONFIG.type === 'image' || BACKGROUND_CONFIG.type === 'pattern') && BACKGROUND_CONFIG.imagePath) {
      console.log(`[MainScene] 加载背景图片: ${BACKGROUND_CONFIG.imagePath}`);
      this.load.image('background', BACKGROUND_CONFIG.imagePath);
    }

    // 根据渲染模式加载元素图片资源
    if (RENDER_MODE === 'image' || RENDER_MODE === 'auto') {
      console.log('[MainScene] 开始加载元素图片资源...');

      ELEMENT_CONFIGS.forEach(config => {
        if (config.texture && config.imagePath) {
          try {
            // 检查文件扩展名
            const isSVG = config.imagePath.toLowerCase().endsWith('.svg');

            if (isSVG) {
              // SVG 文件使用 svg 加载器
              this.load.svg(config.texture, config.imagePath, { scale: 1 });
              console.log(`[MainScene] 加载 SVG: ${config.texture} <- ${config.imagePath}`);
            } else {
              // PNG/JPG 使用 image 加载器
              this.load.image(config.texture, config.imagePath);
              console.log(`[MainScene] 加载图片: ${config.texture} <- ${config.imagePath}`);
            }
          } catch (error) {
            console.warn(`[MainScene] 加载图片失败: ${config.texture}`, error);
          }
        }
      });

      console.log('[MainScene] 图片资源加载队列已建立');
    } else {
      console.log('[MainScene] 使用颜色模式，跳过图片加载');
    }
  }

  /**
   * 渲染背景
   */
  private renderBackground(): void {
    console.log('[MainScene] 渲染背景...');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    switch (BACKGROUND_CONFIG.type) {
      case 'color': {
        // 纯色背景
        const color = BACKGROUND_CONFIG.color || 0x2d3561;
        this.cameras.main.setBackgroundColor(color);
        console.log(`[背景] 纯色: #${color.toString(16)}`);
        break;
      }

      case 'gradient': {
        // 渐变背景
        if (BACKGROUND_CONFIG.gradient) {
          const gradient = BACKGROUND_CONFIG.gradient;
          const graphics = this.add.graphics();

          if (gradient.type === 'linear') {
            // 线性渐变
            const angle = gradient.angle || 0;
            const rad = Phaser.Math.DegToRad(angle);
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            // 计算渐变的起点和终点
            const x1 = width / 2 - (cos * width) / 2;
            const y1 = height / 2 - (sin * height) / 2;
            const x2 = width / 2 + (cos * width) / 2;
            const y2 = height / 2 + (sin * height) / 2;

            graphics.fillGradientStyle(
              gradient.colors[0],
              gradient.colors[0],
              gradient.colors[gradient.colors.length - 1],
              gradient.colors[gradient.colors.length - 1],
              1
            );
            graphics.fillRect(0, 0, width, height);
            console.log(`[背景] 线性渐变: ${gradient.colors.length} 色, 角度 ${angle}°`);
          } else {
            // 径向渐变（使用圆形近似）
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.max(width, height);

            for (let i = gradient.colors.length - 1; i >= 0; i--) {
              const progress = i / (gradient.colors.length - 1);
              graphics.fillStyle(gradient.colors[i], 1);
              graphics.fillCircle(centerX, centerY, radius * (1 - progress));
            }
            console.log(`[背景] 径向渐变: ${gradient.colors.length} 色`);
          }

          graphics.setDepth(-1000);
        }
        break;
      }

      case 'image': {
        // 图片背景
        if (BACKGROUND_CONFIG.imagePath && this.textures.exists('background')) {
          const bg = this.add.image(width / 2, height / 2, 'background');
          bg.setDepth(-1000);

          const mode = BACKGROUND_CONFIG.imageMode || 'cover';
          if (mode === 'cover') {
            const scaleX = width / bg.width;
            const scaleY = height / bg.height;
            const scale = Math.max(scaleX, scaleY);
            bg.setScale(scale);
          } else if (mode === 'contain') {
            const scaleX = width / bg.width;
            const scaleY = height / bg.height;
            const scale = Math.min(scaleX, scaleY);
            bg.setScale(scale);
          } else if (mode === 'stretch') {
            bg.setDisplaySize(width, height);
          }

          console.log(`[背景] 图片: ${BACKGROUND_CONFIG.imagePath}, 模式: ${mode}`);
        } else {
          console.warn('[背景] 图片未加载，使用默认颜色');
          this.cameras.main.setBackgroundColor(0x2d3561);
        }
        break;
      }

      case 'pattern': {
        // 平铺背景
        if (BACKGROUND_CONFIG.imagePath && this.textures.exists('background')) {
          const texture = this.textures.get('background');
          const tileWidth = texture.source[0].width;
          const tileHeight = texture.source[0].height;

          const cols = Math.ceil(width / tileWidth) + 1;
          const rows = Math.ceil(height / tileHeight) + 1;

          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
              const tile = this.add.image(col * tileWidth, row * tileHeight, 'background');
              tile.setOrigin(0, 0);
              tile.setDepth(-1000);
            }
          }

          console.log(`[背景] 平铺图案: ${cols}x${rows} tiles`);
        } else {
          console.warn('[背景] 平铺图案未加载，使用默认颜色');
          this.cameras.main.setBackgroundColor(0x2d3561);
        }
        break;
      }

      default:
        this.cameras.main.setBackgroundColor(0x2d3561);
    }
  }

  /**
   * 创建场景
   */
  create(): void {
    console.log('[MainScene] create 执行');

    // 渲染背景（最先渲染）
    this.renderBackground();

    // 添加标题
    this.add
      .text(400, 40, 'PopMatch 消消乐', {
        fontSize: '36px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // 添加分数显示
    this.scoreText = this.add
      .text(650, 100, '分数: 0', {
        fontSize: '28px',
        color: '#FFD700',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    // 创建棋盘数据
    this.board = new Board();
    console.log('[MainScene] 棋盘数据创建完成');
    this.board.print();

    // 渲染棋盘
    this.renderBoard();

    console.log('[MainScene] create 完成 - 场景已准备就绪');
  }

  /**
   * 创建元素的可视化对象（Sprite 或 Graphics）
   */
  private createCellVisual(cellType: number): Phaser.GameObjects.GameObject {
    const config = ELEMENT_CONFIGS[cellType];

    // 尝试使用图片渲染
    if ((RENDER_MODE === 'image' || RENDER_MODE === 'auto') && config.texture) {
      // 检查纹理是否加载成功
      if (this.textures.exists(config.texture)) {
        const sprite = this.add.sprite(CELL_SIZE / 2, CELL_SIZE / 2, config.texture);
        sprite.setDisplaySize(CELL_SIZE, CELL_SIZE);
        console.log(`[渲染] 使用图片: ${config.texture}`);
        return sprite;
      } else if (RENDER_MODE === 'image') {
        console.warn(`[渲染] 图片未加载: ${config.texture}，渲染失败`);
      }
    }

    // 回退到颜色渲染
    const color = config.color;
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(0, 0, CELL_SIZE, CELL_SIZE, 8);

    // 添加高光效果
    graphics.fillStyle(0xffffff, 0.2);
    graphics.fillRoundedRect(0, 0, CELL_SIZE, CELL_SIZE * 0.4, { tl: 8, tr: 8, bl: 0, br: 0 });

    return graphics;
  }

  /**
   * 渲染棋盘
   */
  private renderBoard(): void {
    console.log('[MainScene] 开始渲染棋盘');

    // 清空现有的容器
    this.cellContainers.forEach(row => row.forEach(container => container?.destroy()));
    this.cellContainers = [];

    let renderedCount = 0;

    // 遍历棋盘数据，为每个单元格创建可交互对象
    for (let row = 0; row < this.board.rows; row++) {
      this.cellContainers[row] = [];

      for (let col = 0; col < this.board.cols; col++) {
        const cell = this.board.getCell(row, col);

        if (cell) {
          // 计算单元格的屏幕位置
          const x = BOARD_OFFSET_X + col * (CELL_SIZE + CELL_GAP);
          const y = BOARD_OFFSET_Y + row * (CELL_SIZE + CELL_GAP);

          // 创建容器
          const container = this.add.container(x, y);

          // 创建元素可视化对象（图片或颜色）
          const visual = this.createCellVisual(cell.type);
          container.add(visual);

          // 创建可交互的透明区域
          const hitArea = this.add.rectangle(
            CELL_SIZE / 2,
            CELL_SIZE / 2,
            CELL_SIZE,
            CELL_SIZE,
            0xffffff,
            0
          );
          hitArea.setInteractive();

          // 添加点击事件
          hitArea.on('pointerdown', () => this.onCellClick(row, col));

          container.add(hitArea);

          // 保存容器引用
          this.cellContainers[row][col] = container;
          renderedCount++;
        } else {
          // 空单元格不渲染，留空
          this.cellContainers[row][col] = null as any;
        }
      }
    }

    const totalCells = this.board.rows * this.board.cols;
    const emptyCells = totalCells - renderedCount;
    console.log(`[MainScene] 棋盘渲染完成: ${renderedCount}/${totalCells} 个单元格 (${emptyCells} 个空位)`);
  }

  /**
   * 获取单元格在屏幕上的位置
   */
  private getCellPosition(row: number, col: number): { x: number; y: number } {
    return {
      x: BOARD_OFFSET_X + col * (CELL_SIZE + CELL_GAP),
      y: BOARD_OFFSET_Y + row * (CELL_SIZE + CELL_GAP),
    };
  }

  /**
   * 获取单元格容器
   */
  private getCellContainer(row: number, col: number): Phaser.GameObjects.Container | null {
    if (this.cellContainers[row] && this.cellContainers[row][col]) {
      return this.cellContainers[row][col];
    }
    return null;
  }

  /**
   * 单元格点击处理
   */
  private onCellClick(row: number, col: number): void {
    // 如果正在播放动画，忽略点击
    if (this.isAnimating) {
      console.log('[MainScene] 动画播放中，忽略点击');
      return;
    }

    console.log(`[MainScene] 点击单元格: (${row}, ${col})`);

    // 如果没有选中的单元格，选中当前单元格
    if (this.selectedCell === null) {
      this.selectCell(row, col);
      return;
    }

    // 如果点击的是已选中的单元格，取消选中
    if (this.selectedCell.row === row && this.selectedCell.col === col) {
      this.deselectCell();
      return;
    }

    // 检查是否相邻
    if (this.isAdjacent(this.selectedCell.row, this.selectedCell.col, row, col)) {
      console.log(`[MainScene] 单元格相邻，执行交换`);
      this.swapCells(this.selectedCell.row, this.selectedCell.col, row, col);
      this.deselectCell();
    } else {
      console.log(`[MainScene] 单元格不相邻，重新选中`);
      // 不相邻，选中新的单元格
      this.deselectCell();
      this.selectCell(row, col);
    }
  }

  /**
   * 选中单元格
   */
  private selectCell(row: number, col: number): void {
    this.selectedCell = { row, col };

    // 计算选中框位置
    const x = BOARD_OFFSET_X + col * (CELL_SIZE + CELL_GAP);
    const y = BOARD_OFFSET_Y + row * (CELL_SIZE + CELL_GAP);

    // 创建选中框
    if (this.selectionBorder) {
      this.selectionBorder.destroy();
    }

    this.selectionBorder = this.add.graphics();
    this.selectionBorder.lineStyle(4, 0xffffff, 1);
    this.selectionBorder.strokeRoundedRect(x - 2, y - 2, CELL_SIZE + 4, CELL_SIZE + 4, 10);

    console.log(`[MainScene] 选中单元格: (${row}, ${col}), 类型: ${this.board.getCell(row, col)?.type}`);
  }

  /**
   * 取消选中
   */
  private deselectCell(): void {
    this.selectedCell = null;

    if (this.selectionBorder) {
      this.selectionBorder.destroy();
      this.selectionBorder = null;
    }

    console.log('[MainScene] 取消选中');
  }

  /**
   * 判断两个单元格是否相邻（上下左右）
   */
  private isAdjacent(row1: number, col1: number, row2: number, col2: number): boolean {
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);

    // 相邻条件：行差为1且列差为0，或行差为0且列差为1
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  /**
   * 交换两个单元格（带动画）
   */
  private async swapCells(row1: number, col1: number, row2: number, col2: number): Promise<void> {
    const cell1 = this.board.getCell(row1, col1);
    const cell2 = this.board.getCell(row2, col2);

    if (!cell1 || !cell2) {
      console.error('[MainScene] 交换失败：单元格不存在');
      return;
    }

    console.log(`[MainScene] 交换: (${row1},${col1})[type=${cell1.type}] <-> (${row2},${col2})[type=${cell2.type}]`);

    // 设置动画锁
    this.isAnimating = true;

    // 播放交换动画
    await this.playSwapAnimation(row1, col1, row2, col2);

    // 交换数据
    this.board.swap(row1, col1, row2, col2);

    // 重新渲染棋盘
    this.renderBoard();

    // 打印交换后的棋盘状态
    this.board.print();

    // 检测是否有消除
    const matches = this.board.findMatches();

    if (matches.length > 0) {
      // 有消除：执行连消流程
      console.log(`[MainScene] 检测到 ${matches.length} 个匹配，执行消除`);
      await this.processAllMatches();
    } else {
      // 无消除：交换回退
      console.log('[MainScene] 无消除，执行回退');
      await this.playSwapAnimation(row1, col1, row2, col2);
      this.board.swap(row1, col1, row2, col2);
      this.renderBoard();
      console.log('[MainScene] 回退完成');
    }

    // 释放动画锁
    this.isAnimating = false;
  }

  /**
   * 播放交换动画
   */
  private playSwapAnimation(row1: number, col1: number, row2: number, col2: number): Promise<void> {
    return new Promise((resolve) => {
      const container1 = this.getCellContainer(row1, col1);
      const container2 = this.getCellContainer(row2, col2);

      if (!container1 || !container2) {
        resolve();
        return;
      }

      const pos1 = this.getCellPosition(row1, col1);
      const pos2 = this.getCellPosition(row2, col2);

      let completed = 0;
      const onComplete = () => {
        completed++;
        if (completed === 2) {
          resolve();
        }
      };

      // 方块1移动到方块2的位置
      this.tweens.add({
        targets: container1,
        x: pos2.x,
        y: pos2.y,
        duration: ANIM_SWAP_DURATION,
        ease: 'Cubic.easeInOut',
        onComplete,
      });

      // 方块2移动到方块1的位置
      this.tweens.add({
        targets: container2,
        x: pos1.x,
        y: pos1.y,
        duration: ANIM_SWAP_DURATION,
        ease: 'Cubic.easeInOut',
        onComplete,
      });
    });
  }

  /**
   * 根据匹配组数量计算分数
   * 规则：3个=5分, 4个=10分, 5个及以上=50分
   */
  private calculateScore(matchGroups: MatchGroup[]): number {
    let totalScore = 0;

    matchGroups.forEach(group => {
      let score = 0;
      if (group.count === 3) {
        score = 5;
      } else if (group.count === 4) {
        score = 10;
      } else if (group.count >= 5) {
        score = 50;
      }

      totalScore += score;
      console.log(`[分数] ${group.count}个${group.direction === 'horizontal' ? '横向' : '纵向'}消除 +${score}分`);
    });

    return totalScore;
  }

  /**
   * 更新分数显示
   */
  private updateScore(points: number): void {
    this.score += points;
    this.scoreText.setText(`分数: ${this.score}`);
    console.log(`[分数] 总分: ${this.score} (+${points})`);
  }

  /**
   * 自动连消流程：循环检测并消除，直到无可消除
   */
  private async processAllMatches(): Promise<void> {
    let comboCount = 0;
    const maxCombos = 10; // 防止无限循环的安全限制

    console.log('\n========================================');
    console.log('=== 开始自动连消流程 ===');
    console.log('========================================\n');

    while (comboCount < maxCombos) {
      // 检测匹配组
      const matchGroups = this.board.findMatchGroups();

      if (matchGroups.length === 0) {
        // 没有匹配，退出循环
        console.log('[连消] 没有找到可消除的单元格，连消结束');
        break;
      }

      // 找到匹配，执行第 N 次消除
      comboCount++;
      console.log(`\n┌─────────────────────────────────────┐`);
      console.log(`│      第 ${comboCount} 次消除 (Combo x${comboCount})      │`);
      console.log(`└─────────────────────────────────────┘`);

      // 计算并更新分数
      const score = this.calculateScore(matchGroups);
      this.updateScore(score);

      // 获取所有匹配的单元格（去重后）
      const matches = this.board.findMatches();

      // 显示匹配信息
      this.displayMatches(matches);

      // 执行单次消除（带闪烁动画）
      await this.executeSingleElimination(matches);

      // 应用重力和填充（数据层面）
      const gravityResult = this.board.applyGravityAndFill();

      // 打印重力后的棋盘状态
      console.log('[连消] 重力后棋盘状态:');
      this.board.print();

      // 播放下落动画
      await this.playFallAndFillAnimation(gravityResult);

      // 重新渲染棋盘
      this.renderBoard();
    }

    if (comboCount >= maxCombos) {
      console.warn(`[连消] 达到最大连消次数限制 (${maxCombos})，强制结束`);
    }

    console.log('\n========================================');
    console.log(`=== 连消流程完成：共 ${comboCount} 次消除 ===`);
    console.log('========================================\n');
  }

  /**
   * 显示匹配信息
   */
  private displayMatches(matches: Cell[]): void {
    console.log(`[连消] 找到 ${matches.length} 个可消除的单元格`);

    // 按行列分组显示
    const byRow: { [key: number]: Cell[] } = {};
    const byCol: { [key: number]: Cell[] } = {};

    matches.forEach(cell => {
      if (!byRow[cell.row]) byRow[cell.row] = [];
      if (!byCol[cell.col]) byCol[cell.col] = [];
      byRow[cell.row].push(cell);
      byCol[cell.col].push(cell);
    });

    // 显示横向匹配
    const horizontalRows = Object.keys(byRow).filter(row => byRow[Number(row)].length >= 3);
    if (horizontalRows.length > 0) {
      console.log('[连消] 横向匹配：');
      horizontalRows.forEach(row => {
        const cells = byRow[Number(row)].sort((a, b) => a.col - b.col);
        const positions = cells.map(c => `(${c.row},${c.col})`).join(' ');
        console.log(`  行 ${row}: ${positions} - 类型 ${cells[0].type}`);
      });
    }

    // 显示纵向匹配
    const verticalCols = Object.keys(byCol).filter(col => byCol[Number(col)].length >= 3);
    if (verticalCols.length > 0) {
      console.log('[连消] 纵向匹配：');
      verticalCols.forEach(col => {
        const cells = byCol[Number(col)].sort((a, b) => a.row - b.row);
        const positions = cells.map(c => `(${c.row},${c.col})`).join(' ');
        console.log(`  列 ${col}: ${positions} - 类型 ${cells[0].type}`);
      });
    }
  }

  /**
   * 执行单次消除（带闪烁动画）
   */
  private async executeSingleElimination(matches: Cell[]): Promise<void> {
    console.log(`[连消] 开始移除 ${matches.length} 个单元格`);

    // 播放消除闪烁动画
    await this.playEliminateAnimation(matches);

    // 移除匹配的单元格
    this.board.removeCells(matches);

    // 打印消除后的棋盘状态
    console.log('[连消] 消除后棋盘状态:');
    this.board.print();
  }

  /**
   * 播放消除闪烁动画
   */
  private playEliminateAnimation(matches: Cell[]): Promise<void> {
    return new Promise((resolve) => {
      const containers = matches
        .map(cell => this.getCellContainer(cell.row, cell.col))
        .filter(c => c !== null) as Phaser.GameObjects.Container[];

      if (containers.length === 0) {
        resolve();
        return;
      }

      // 闪烁动画：透明度变化
      let completedCount = 0;
      const onComplete = () => {
        completedCount++;
        if (completedCount === containers.length) {
          resolve();
        }
      };

      containers.forEach(container => {
        this.tweens.add({
          targets: container,
          alpha: 0,
          scale: 1.2,
          duration: ANIM_ELIMINATE_DURATION,
          ease: 'Cubic.easeOut',
          yoyo: false,
          onComplete,
        });
      });
    });
  }

  /**
   * 播放下落和填充动画
   */
  private playFallAndFillAnimation(gravityResult: GravityResult): Promise<void> {
    return new Promise((resolve) => {
      const { moved, filled } = gravityResult;

      // 如果没有移动和填充，直接完成
      if (moved.length === 0 && filled.length === 0) {
        resolve();
        return;
      }

      let completedCount = 0;
      const totalAnimations = moved.length + filled.length;

      const onComplete = () => {
        completedCount++;
        if (completedCount === totalAnimations) {
          resolve();
        }
      };

      // 下落动画：移动已有元素
      moved.forEach(moveInfo => {
        const container = this.getCellContainer(moveInfo.fromRow, moveInfo.col);
        if (container) {
          const toPos = this.getCellPosition(moveInfo.toRow, moveInfo.col);
          this.tweens.add({
            targets: container,
            y: toPos.y,
            duration: ANIM_FALL_DURATION,
            ease: 'Bounce.easeOut',
            onComplete,
          });
        } else {
          onComplete();
        }
      });

      // 填充动画：新元素从上方落下
      filled.forEach(cell => {
        // 新元素从顶部上方开始
        const startY = BOARD_OFFSET_Y - (CELL_SIZE + CELL_GAP);
        const endPos = this.getCellPosition(cell.row, cell.col);

        // 创建临时容器用于动画（将在渲染时被替换）
        const container = this.add.container(endPos.x, startY);
        const graphics = this.add.graphics();
        const color = ELEMENT_COLORS[cell.type];
        graphics.fillStyle(color, 1);
        graphics.fillRoundedRect(0, 0, CELL_SIZE, CELL_SIZE, 8);
        graphics.fillStyle(0xffffff, 0.2);
        graphics.fillRoundedRect(0, 0, CELL_SIZE, CELL_SIZE * 0.4, { tl: 8, tr: 8, bl: 0, br: 0 });
        container.add(graphics);

        this.tweens.add({
          targets: container,
          y: endPos.y,
          duration: ANIM_FALL_DURATION,
          ease: 'Bounce.easeOut',
          onComplete: () => {
            container.destroy();
            onComplete();
          },
        });
      });
    });
  }

  /**
   * 更新循环
   */
  update(): void {
    // 只打印一次，避免刷屏
    if (!this.updateLogPrinted) {
      console.log('[MainScene] update 执行 - 游戏循环已启动');
      this.updateLogPrinted = true;
    }

    // 游戏主循环
  }
}

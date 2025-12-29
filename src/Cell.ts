/**
 * 单元格数据模型
 */

export class Cell {
  /** 行索引 */
  public row: number;

  /** 列索引 */
  public col: number;

  /** 元素类型（0-5 表示不同的颜色/形状） */
  public type: number;

  constructor(row: number, col: number, type: number) {
    this.row = row;
    this.col = col;
    this.type = type;
  }

  /**
   * 检查是否与另一个单元格类型相同
   */
  public isSameType(other: Cell): boolean {
    return this.type === other.type;
  }

  /**
   * 返回单元格信息的字符串表示
   */
  public toString(): string {
    return `Cell(${this.row},${this.col}):type=${this.type}`;
  }
}

/*
 * 游戏常量定义
 */

// 棋盘尺寸
export const BOARD_ROWS = 10;  // 行数
export const BOARD_COLS = 8;  // 列数

// 元素类型数量（不同颜色/形状的元素种类）
export const ELEMENT_TYPES = 6;

// 渲染相关常量
export const CELL_SIZE = 40;       // 单元格大小（像素）
export const CELL_GAP = 4;         // 单元格间距（像素）
export const BOARD_OFFSET_X = 180; // 棋盘 X 偏移
export const BOARD_OFFSET_Y = 100; // 棋盘 Y 偏移

/**
 * 元素配置接口
 */
export interface ElementConfig {
  type: number;           // 元素类型编号
  color: number;          // 备用颜色（当图片加载失败或未配置时使用）
  texture?: string;       // 纹理/图片的 key（可选）
  imagePath?: string;     // 图片资源路径（可选）
}

/**
 * 渲染模式
 */
export type RenderMode = 'color' | 'image' | 'auto';

/**
 * 当前渲染模式
 * - 'color': 仅使用颜色渲染
 * - 'image': 仅使用图片渲染
 * - 'auto': 优先使用图片，回退到颜色
 */
export const RENDER_MODE: RenderMode = 'auto';

/**
 * 元素配置列表
 */
export const ELEMENT_CONFIGS: ElementConfig[] = [
  {
    type: 0,
    color: 0xff6b6b,
    texture: 'element_0',
    imagePath: 'assets/elements/element_0.svg',
  },
  {
    type: 1,
    color: 0x4ecdc4,
    texture: 'element_1',
    imagePath: '',
  },
  {
    type: 2,
    color: 0xffe66d,
    texture: 'element_2',
    imagePath: 'assets/elements/element_2.svg',
  },
  {
    type: 3,
    color: 0x95e1d3,
    texture: 'element_3',
    imagePath: 'assets/elements/element_3.svg',
  },
  {
    type: 4,
    color: 0xc7ceea,
    texture: 'element_4',
    imagePath: 'assets/elements/element_4.svg',
  },
  {
    type: 5,
    color: 0xffa07a,
    texture: 'element_5',
    imagePath: 'assets/elements/element_5.svg',
  },
];

/**
 * 元素类型对应的颜色（兼容旧代码）
 */
export const ELEMENT_COLORS = ELEMENT_CONFIGS.map(config => config.color);

/**
 * 背景类型
 */
export type BackgroundType = 'color' | 'gradient' | 'image' | 'pattern';

/**
 * 渐变配置
 */
export interface GradientConfig {
  type: 'linear' | 'radial';
  colors: number[];       // 渐变颜色数组
  stops?: number[];       // 渐变停止点（0-1），可选
  angle?: number;         // 线性渐变角度（度），默认 0（从上到下）
}

/**
 * 背景配置接口
 */
export interface BackgroundConfig {
  type: BackgroundType;
  color?: number;              // 纯色背景颜色
  gradient?: GradientConfig;   // 渐变配置
  imagePath?: string;          // 背景图片路径
  imageMode?: 'cover' | 'contain' | 'tile' | 'stretch';  // 图片模式
  opacity?: number;            // 透明度（0-1）
}

/**
 * 当前背景配置
 *
 * 示例配置：
 *
 * 1. 纯色背景：
 * {
 *   type: 'color',
 *   color: 0x2d3561,
 * }
 *
 * 2. 线性渐变背景：
 * {
 *   type: 'gradient',
 *   gradient: {
 *     type: 'linear',
 *     colors: [0x1a1a2e, 0x16213e, 0x0f3460],
 *     angle: 135,
 *   }
 * }
 *
 * 3. 径向渐变背景：
 * {
 *   type: 'gradient',
 *   gradient: {
 *     type: 'radial',
 *     colors: [0x4a148c, 0x1a237e, 0x0d47a1],
 *   }
 * }
 *
 * 4. 图片背景：
 * {
 *   type: 'image',
 *   imagePath: 'assets/backgrounds/bg.jpg',
 *   imageMode: 'cover',
 * }
 *
 * 5. 平铺图案背景：
 * {
 *   type: 'pattern',
 *   imagePath: 'assets/backgrounds/pattern.png',
 *   imageMode: 'tile',
 * }
 */
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'gradient',
  gradient: {
    type: 'linear',
    colors: [0x1a1a2e, 0x16213e, 0x0f3460],
    angle: 135,
  }
};

// 备选背景配置示例（可以直接替换 BACKGROUND_CONFIG）

// 纯色深蓝
export const BG_DARK_BLUE: BackgroundConfig = {
  type: 'color',
  color: 0x2d3561,
};

// 紫色渐变
export const BG_PURPLE_GRADIENT: BackgroundConfig = {
  type: 'gradient',
  gradient: {
    type: 'linear',
    colors: [0x4a148c, 0x6a1b9a, 0x8e24aa],
    angle: 180,
  }
};

// 蓝绿渐变
export const BG_OCEAN_GRADIENT: BackgroundConfig = {
  type: 'gradient',
  gradient: {
    type: 'radial',
    colors: [0x006064, 0x00838f, 0x0097a7],
  }
};

// 日落渐变
export const BG_SUNSET_GRADIENT: BackgroundConfig = {
  type: 'gradient',
  gradient: {
    type: 'linear',
    colors: [0xff6b6b, 0xff8e53, 0xffd93d],
    angle: 45,
  }
};

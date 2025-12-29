# 背景配置指南

## 概述

PopMatch 现在支持多种背景类型：
1. **纯色背景** - 单一颜色
2. **渐变背景** - 线性或径向渐变
3. **图片背景** - 使用自定义图片
4. **平铺图案** - 重复的小图案

---

## 快速开始

### 修改背景

在 `src/constants.ts` 中找到 `BACKGROUND_CONFIG` 并修改：

```typescript
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'gradient',  // 背景类型
  gradient: {
    type: 'linear',
    colors: [0x1a1a2e, 0x16213e, 0x0f3460],
    angle: 135,
  }
};
```

---

## 背景类型详解

### 1. 纯色背景 (color)

最简单的背景，使用单一颜色。

```typescript
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'color',
  color: 0x2d3561,  // 十六进制颜色值
};
```

**快捷配置：**
```typescript
export const BACKGROUND_CONFIG = BG_DARK_BLUE;  // 使用预设
```

**颜色示例：**
- `0x2d3561` - 深蓝色
- `0x1a1a2e` - 深紫色
- `0x0f3460` - 午夜蓝
- `0x4a148c` - 深紫红

---

### 2. 线性渐变背景 (gradient + linear)

从一个方向渐变到另一个方向。

```typescript
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'gradient',
  gradient: {
    type: 'linear',
    colors: [0x1a1a2e, 0x16213e, 0x0f3460],  // 颜色数组
    angle: 135,  // 渐变角度（度）
  }
};
```

**角度说明：**
- `0` - 从上到下 ↓
- `90` - 从左到右 →
- `180` - 从下到上 ↑
- `270` - 从右到左 ←
- `45` - 左上到右下 ↘
- `135` - 左下到右上 ↗

**快捷配置：**
```typescript
// 紫色渐变
export const BACKGROUND_CONFIG = BG_PURPLE_GRADIENT;

// 日落渐变
export const BACKGROUND_CONFIG = BG_SUNSET_GRADIENT;
```

**颜色搭配建议：**
```typescript
// 深蓝系列
colors: [0x1a1a2e, 0x16213e, 0x0f3460]

// 紫色系列
colors: [0x4a148c, 0x6a1b9a, 0x8e24aa]

// 蓝绿系列
colors: [0x006064, 0x00838f, 0x0097a7]

// 日落系列
colors: [0xff6b6b, 0xff8e53, 0xffd93d]

// 夜空系列
colors: [0x0d1b2a, 0x1b263b, 0x415a77]
```

---

### 3. 径向渐变背景 (gradient + radial)

从中心向外辐射的渐变。

```typescript
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'gradient',
  gradient: {
    type: 'radial',
    colors: [0x006064, 0x00838f, 0x0097a7],  // 从内到外的颜色
  }
};
```

**快捷配置：**
```typescript
export const BACKGROUND_CONFIG = BG_OCEAN_GRADIENT;
```

---

### 4. 图片背景 (image)

使用自定义图片作为背景。

```typescript
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'image',
  imagePath: 'assets/backgrounds/space_bg.svg',
  imageMode: 'cover',  // 图片填充模式
};
```

**图片模式 (imageMode)：**

| 模式 | 说明 | 效果 |
|------|------|------|
| `'cover'` | 覆盖整个区域，可能裁剪 | 填满屏幕，保持比例 |
| `'contain'` | 完整显示图片，可能留白 | 完整可见，保持比例 |
| `'stretch'` | 拉伸填充 | 填满屏幕，可能变形 |

**示例配置：**
```typescript
// 使用自带的太空背景
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'image',
  imagePath: 'assets/backgrounds/space_bg.svg',
  imageMode: 'cover',
};
```

---

### 5. 平铺图案背景 (pattern)

重复小图案填充整个背景。

```typescript
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'pattern',
  imagePath: 'assets/backgrounds/pattern_dots.svg',
  imageMode: 'tile',
};
```

**适合平铺的图案：**
- 点状图案
- 网格图案
- 小图标重复
- 纹理图案

**示例配置：**
```typescript
// 使用自带的点状图案
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'pattern',
  imagePath: 'assets/backgrounds/pattern_dots.svg',
  imageMode: 'tile',
};
```

---

## 使用自定义背景图片

### 步骤 1: 准备图片

**图片要求：**
- **格式**：PNG, JPG, SVG
- **尺寸**：推荐 800x600 或更高
- **大小**：建议不超过 500KB

### 步骤 2: 放置文件

将图片放到 `public/assets/backgrounds/` 目录：

```bash
public/assets/backgrounds/
├── my_bg.jpg          # 你的背景图片
├── my_pattern.png     # 你的平铺图案
└── space_bg.svg       # 自带示例
```

### 步骤 3: 修改配置

在 `src/constants.ts` 中修改 `BACKGROUND_CONFIG`：

```typescript
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'image',
  imagePath: 'assets/backgrounds/my_bg.jpg',
  imageMode: 'cover',
};
```

### 步骤 4: 测试

```bash
npm run dev
```

打开浏览器查看效果！

---

## 配置示例集合

### 简约风格
```typescript
// 纯色深蓝
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'color',
  color: 0x2d3561,
};
```

### 科技感
```typescript
// 深蓝渐变
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'gradient',
  gradient: {
    type: 'linear',
    colors: [0x0f0f1e, 0x1a1a3e, 0x2d2d5f],
    angle: 135,
  }
};
```

### 温暖风格
```typescript
// 日落渐变
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'gradient',
  gradient: {
    type: 'linear',
    colors: [0xff6b6b, 0xff8e53, 0xffd93d],
    angle: 45,
  }
};
```

### 清新风格
```typescript
// 海洋径向渐变
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'gradient',
  gradient: {
    type: 'radial',
    colors: [0x00bcd4, 0x0097a7, 0x00838f],
  }
};
```

### 星空背景
```typescript
// 使用自带的太空背景
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'image',
  imagePath: 'assets/backgrounds/space_bg.svg',
  imageMode: 'cover',
};
```

### 纹理风格
```typescript
// 平铺点状图案
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'pattern',
  imagePath: 'assets/backgrounds/pattern_dots.svg',
  imageMode: 'tile',
};
```

---

## 预设背景

项目提供了以下预设背景，可以直接使用：

```typescript
// 使用方式：
export const BACKGROUND_CONFIG = BG_DARK_BLUE;
```

**可用预设：**

| 预设名称 | 类型 | 说明 |
|---------|------|------|
| `BG_DARK_BLUE` | 纯色 | 深蓝色 |
| `BG_PURPLE_GRADIENT` | 线性渐变 | 紫色系 |
| `BG_OCEAN_GRADIENT` | 径向渐变 | 海洋蓝绿 |
| `BG_SUNSET_GRADIENT` | 线性渐变 | 日落橙黄 |

---

## 高级技巧

### 1. 多色渐变

可以使用 3 个或更多颜色：

```typescript
gradient: {
  type: 'linear',
  colors: [0x1a1a2e, 0x16213e, 0x0f3460, 0x0a2540],
  angle: 180,
}
```

### 2. 半透明效果

使用 `opacity` 参数（目前在配置中预留）：

```typescript
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'color',
  color: 0x2d3561,
  opacity: 0.8,  // 0-1 之间
};
```

### 3. 动态背景

可以创建多个配置，在游戏中动态切换：

```typescript
const backgrounds = [
  BG_DARK_BLUE,
  BG_PURPLE_GRADIENT,
  BG_OCEAN_GRADIENT,
];

// 在代码中切换
export const BACKGROUND_CONFIG = backgrounds[Math.floor(Math.random() * backgrounds.length)];
```

---

## 故障排查

### 问题：背景图片不显示

**检查清单：**
1. ✅ 图片文件是否存在于 `public/assets/backgrounds/` 目录？
2. ✅ `imagePath` 路径是否正确？（相对于 `public/` 目录）
3. ✅ 图片格式是否支持（PNG/JPG/SVG）？
4. ✅ 打开浏览器控制台，查看是否有加载错误

**控制台日志示例：**
```
[MainScene] 加载背景图片: assets/backgrounds/space_bg.svg
[背景] 图片: assets/backgrounds/space_bg.svg, 模式: cover
```

### 问题：渐变显示不正确

- 检查 `type` 是否设置为 `'gradient'`
- 检查 `gradient` 对象是否正确配置
- 确保 `colors` 数组至少有 2 个颜色

### 问题：背景显示为默认颜色

这是正常的回退行为。检查：
- 背景配置是否正确
- 图片是否成功加载
- 控制台是否有警告信息

---

## 获取颜色值

### 在线工具

- [ColorHexa](https://www.colorhexa.com/) - 颜色转换工具
- [Adobe Color](https://color.adobe.com/) - 配色方案生成

### 转换方法

从 CSS 颜色转换为十六进制：

```
#2d3561 (CSS) → 0x2d3561 (Phaser)
rgb(45,53,97) → 0x2d3561
```

### 常用配色

**深色系：**
- `0x1a1a2e` - 深紫灰
- `0x16213e` - 深蓝灰
- `0x0f3460` - 深海蓝
- `0x2d3561` - 午夜蓝

**亮色系：**
- `0xff6b6b` - 珊瑚红
- `0x4ecdc4` - 青绿色
- `0xffe66d` - 阳光黄
- `0x95e1d3` - 薄荷绿

---

## 最佳实践

1. **性能优化**
   - 图片尺寸不要过大（< 500KB）
   - 使用 SVG 获得更好的缩放效果
   - 平铺图案使用小尺寸图片（如 40x40）

2. **视觉效果**
   - 背景颜色不要太亮，避免影响游戏元素
   - 保持背景与游戏元素的对比度
   - 渐变角度建议使用 45 的倍数

3. **开发建议**
   - 使用预设配置快速切换风格
   - 先测试纯色/渐变，再尝试图片
   - 保留多个配置方便对比

---

## 自带资源

项目自带以下背景资源：

```
public/assets/backgrounds/
├── space_bg.svg          # 太空背景（带星星）
└── pattern_dots.svg      # 点状平铺图案
```

直接使用：
```typescript
// 太空背景
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'image',
  imagePath: 'assets/backgrounds/space_bg.svg',
  imageMode: 'cover',
};

// 点状图案
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'pattern',
  imagePath: 'assets/backgrounds/pattern_dots.svg',
  imageMode: 'tile',
};
```

---

**享受自定义背景的乐趣！** 🎨

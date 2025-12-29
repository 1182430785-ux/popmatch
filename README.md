# PopMatch 消消乐 🎮

一个使用 **TypeScript + Phaser 3** 开发的 match-3 消除游戏。

![游戏截图](https://via.placeholder.com/800x600?text=PopMatch+%E6%B6%88%E6%B6%88%E4%B9%90)

## ✨ 功能特性

### 🎯 核心游戏玩法
- ✅ **经典消消乐机制**：点击相邻元素交换，3个或以上消除
- ✅ **智能回退系统**：无消除时自动回退交换
- ✅ **重力系统**：元素自动下落填充空位
- ✅ **连消系统**：支持多次连续消除
- ✅ **流畅动画**：交换、消除、下落动画效果

### 📊 游戏系统
- ✅ **分数系统**
  - 3个消除 = 5分
  - 4个消除 = 10分
  - 5个及以上 = 50分
- ✅ **10x8 棋盘**：适中的难度和挑战性
- ✅ **6种元素类型**：丰富的游戏体验

### 🎨 可视化定制

#### 元素样式
- 🔴 纯色模式：使用颜色块渲染
- 🖼️ 图片模式：使用自定义图片/SVG
- 🔄 自动模式：优先图片，失败回退颜色

#### 背景系统
- 🎨 **纯色背景**：简洁风格
- 🌈 **渐变背景**：线性/径向渐变
- 🖼️ **图片背景**：自定义背景图
- 🔲 **平铺图案**：重复纹理效果

### 📐 技术架构
- ✅ **模块化设计**：数据层与视图层分离
- ✅ **TypeScript**：类型安全
- ✅ **单向依赖**：清晰的依赖关系，无循环引用
- ✅ **可扩展性**：易于添加新功能

---

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

游戏将在 `http://localhost:5173` 运行

### 构建生产版本
```bash
npm run build
```

构建结果在 `dist/` 目录

---

## 🎮 游戏操作

1. **点击选中**元素（高亮显示）
2. **点击相邻元素**进行交换
3. **形成3个或以上**相同元素即可消除
4. **无法消除**的交换会自动回退
5. **查看分数**实时更新在右上角

---

## ⚙️ 配置说明

### 修改棋盘尺寸

编辑 `src/constants.ts`：

```typescript
export const BOARD_ROWS = 10;  // 行数
export const BOARD_COLS = 8;   // 列数
export const CELL_SIZE = 40;   // 单元格大小
```

### 切换元素渲染模式

```typescript
export const RENDER_MODE: RenderMode = 'auto';
// 可选: 'color' | 'image' | 'auto'
```

### 更换背景

```typescript
// 使用预设
export const BACKGROUND_CONFIG = BG_PURPLE_GRADIENT;

// 或自定义
export const BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'gradient',
  gradient: {
    type: 'linear',
    colors: [0x1a1a2e, 0x16213e, 0x0f3460],
    angle: 135,
  }
};
```

详细配置请查看：
- 📖 [元素配置指南](./ELEMENT_ASSETS_GUIDE.md)
- 📖 [背景配置指南](./BACKGROUND_GUIDE.md)

---

## 📁 项目结构

```
popmatch/
├── src/
│   ├── main.ts              # 入口文件
│   ├── Game.ts              # Phaser 配置
│   ├── constants.ts         # 游戏常量和配置
│   ├── types.ts            # TypeScript 类型定义
│   ├── Board.ts            # 棋盘逻辑（纯 TypeScript）
│   ├── Cell.ts             # 单元格数据模型
│   └── scenes/
│       └── MainScene.ts    # 主游戏场景
├── public/
│   └── assets/
│       ├── elements/       # 元素图片资源
│       └── backgrounds/    # 背景图片资源
├── index.html              # HTML 入口
├── package.json
├── tsconfig.json
└── *.md                    # 文档文件
```

---

## 📚 文档

| 文档 | 说明 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 架构设计详解 |
| [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) | 架构评审报告 |
| [ELEMENT_ASSETS_GUIDE.md](./ELEMENT_ASSETS_GUIDE.md) | 元素资源使用指南 |
| [BACKGROUND_GUIDE.md](./BACKGROUND_GUIDE.md) | 背景配置指南 |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | 项目结构分析 |
| [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md) | 重构指南 |

---

## 🎨 自定义资源

### 添加自定义元素图片

1. 准备 6 张图片（PNG/JPG/SVG）
2. 放到 `public/assets/elements/` 目录
3. 修改 `src/constants.ts` 中的 `ELEMENT_CONFIGS`
4. 刷新浏览器即可

详细步骤：[元素配置指南](./ELEMENT_ASSETS_GUIDE.md)

### 添加自定义背景

1. 准备背景图片
2. 放到 `public/assets/backgrounds/` 目录
3. 修改 `src/constants.ts` 中的 `BACKGROUND_CONFIG`
4. 刷新浏览器即可

详细步骤：[背景配置指南](./BACKGROUND_GUIDE.md)

---

## 🏗️ 技术栈

- **框架**：[Phaser 3](https://phaser.io/) - HTML5 游戏框架
- **语言**：[TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- **构建工具**：[Vite](https://vitejs.dev/) - 快速的前端构建工具
- **架构模式**：MVC 分层架构

---

## 🎯 架构设计

### 依赖关系
```
main.ts
  └─> Game.ts
       └─> MainScene (视图层)
            ├─> Board (数据/逻辑层)
            │    └─> Cell (数据模型)
            └─> constants (配置层)
```

### 核心原则
- ✅ **单向依赖**：视图 → 数据，避免循环引用
- ✅ **职责分离**：Board 纯逻辑，Scene 纯渲染
- ✅ **可测试性**：Board 可独立测试，无 Phaser 依赖
- ✅ **KISS 原则**：保持简单，不过度设计

架构评分：⭐⭐⭐⭐⭐ 29/30

---

## 🔧 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（热重载）
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

---

## 📝 待办事项

### 已完成 ✅
- [x] 基础游戏逻辑
- [x] 交换和消除机制
- [x] 重力系统
- [x] 连消系统
- [x] 分数系统
- [x] 交换回退
- [x] 动画效果
- [x] 图片渲染支持
- [x] 可配置背景系统

### 计划中 🎯
- [ ] 音效系统
- [ ] 关卡系统
- [ ] 特殊元素（炸弹、彩虹等）
- [ ] 移动步数限制
- [ ] 目标系统
- [ ] 暂停/重新开始
- [ ] 本地最高分记录
- [ ] 移动端适配

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 👨‍💻 作者

开发者：[你的名字]

🤖 使用 [Claude Code](https://claude.com/claude-code) 辅助开发

---

## 🙏 致谢

- [Phaser](https://phaser.io/) - 强大的 HTML5 游戏框架
- [Vite](https://vitejs.dev/) - 极速的构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

---

**享受游戏吧！** 🎮✨

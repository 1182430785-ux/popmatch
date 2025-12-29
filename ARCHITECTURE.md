# PopMatch 架构文档

## 1. 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              index.html                           │  │
│  │  <div id="game-container"></div>                 │  │
│  └────────────────────┬─────────────────────────────┘  │
└───────────────────────┼────────────────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │    main.ts      │  入口文件
              │  - 初始化游戏   │
              │  - 错误处理     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │    Game.ts      │  配置层
              │  - Phaser配置   │
              │  - 场景注册     │
              └────────┬────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │      MainScene          │  视图层
         │  - UI 渲染              │
         │  - 动画控制             │
         │  - 用户交互             │
         └──────┬─────────┬────────┘
                │         │
       ┌────────┘         └─────────┐
       ▼                            ▼
┌──────────────┐           ┌──────────────┐
│   Board      │           │  constants   │
│ - 数据模型   │           │ - 配置常量   │
│ - 游戏逻辑   │           │ - 颜色定义   │
│ - 匹配检测   │           └──────────────┘
│ - 重力系统   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Cell      │
│ - 单元格数据 │
└──────────────┘
```

## 2. 依赖关系分析

### 2.1 导入链
```
main.ts
  └─> Game.ts
       └─> MainScene.ts
            ├─> Board.ts
            │    └─> Cell.ts
            │    └─> constants.ts
            ├─> Cell.ts
            └─> constants.ts
```

### 2.2 依赖规则

✅ **允许的依赖方向**：
- View → Model (MainScene → Board)
- Model → Model (Board → Cell)
- Any → Constants

❌ **禁止的依赖方向**：
- Model → View (Board 不能导入 MainScene)
- Circular (任何循环引用)

### 2.3 循环引用检查

**结果：✅ 无循环引用**

所有依赖都是单向的，从上层到下层。

## 3. 模块职责

### 3.1 main.ts（入口层）
```typescript
职责：
  - 初始化 Phaser 游戏
  - 全局错误处理
  - 开发环境配置

依赖：
  - Game.ts

被依赖：
  - 无（顶层模块）
```

### 3.2 Game.ts（配置层）
```typescript
职责：
  - Phaser 游戏配置
  - 场景注册
  - 游戏实例创建

依赖：
  - Phaser
  - MainScene

被依赖：
  - main.ts
```

### 3.3 MainScene.ts（视图层）
```typescript
职责：
  - 棋盘渲染
  - 用户交互处理
  - 动画控制
  - 游戏流程编排

依赖：
  - Phaser
  - Board（数据模型）
  - Cell（数据模型）
  - constants（配置）

被依赖：
  - Game.ts
```

### 3.4 Board.ts（模型层）
```typescript
职责：
  - 棋盘数据管理
  - 消除检测算法
  - 重力系统逻辑
  - 纯数据操作（无 Phaser 依赖）

依赖：
  - Cell
  - constants

被依赖：
  - MainScene
```

### 3.5 Cell.ts（数据层）
```typescript
职责：
  - 单元格数据结构
  - 基础属性和方法

依赖：
  - 无

被依赖：
  - Board
  - MainScene
```

### 3.6 constants.ts（配置层）
```typescript
职责：
  - 游戏常量定义
  - 颜色配置
  - 尺寸配置

依赖：
  - 无

被依赖：
  - Board
  - MainScene
```

## 4. 解耦评估

### 4.1 Board 与 Scene 的解耦

#### ✅ 优点
1. **Board 完全独立**
   - 不依赖 Phaser
   - 可独立测试
   - 可移植到其他框架

2. **单向依赖**
   - Scene 知道 Board
   - Board 不知道 Scene
   - 符合依赖倒置原则

3. **职责分离清晰**
   - Board：数据和逻辑
   - Scene：渲染和交互

#### ⚠️ 耦合点
1. **返回值类型**
   - `CellMoveInfo` 和 `GravityResult` 是为动画设计的
   - 这些类型定义在 Board.ts 中
   - 可以提取到 types.ts 进一步解耦

2. **改进方案**
   ```typescript
   // 选项1: 提取到 types.ts（推荐）
   types.ts
     ├─ CellMoveInfo
     └─ GravityResult

   Board.ts → import from types.ts
   MainScene.ts → import from types.ts

   // 选项2: 使用事件系统（复杂，不推荐）
   Board.emit('gravity', data)
   Scene.on('gravity', handler)
   ```

## 5. GameManager 需求分析

### 5.1 当前情况：❌ 不需要

**原因**：
- 只有一个场景
- 状态简单，无需全局管理
- MainScene 足以胜任

### 5.2 何时需要 GameManager？

当出现以下需求时考虑引入：

```
需要 GameManager 的信号：
✓ 多个场景（MenuScene, GameScene, PauseScene, GameOverScene）
✓ 场景间数据共享（分数、等级、进度）
✓ 全局状态管理（玩家信息、设置）
✓ 复杂的场景切换逻辑
✓ 持久化存储需求
✓ 全局服务（音效、网络）
```

### 5.3 GameManager 架构预览（未来）

```
GameManager
  ├─ SceneManager    // 场景切换
  ├─ StateManager    // 全局状态
  ├─ ScoreManager    // 分数系统
  ├─ SoundManager    // 音效管理
  └─ StorageManager  // 存档系统

main.ts → GameManager → Scenes
```

## 6. 架构评分卡

| 评估项 | 状态 | 说明 |
|--------|------|------|
| 依赖方向 | ✅ 优秀 | 单向依赖，无循环 |
| 职责分离 | ✅ 优秀 | 数据/视图清晰分离 |
| 可测试性 | ✅ 良好 | Board 可独立测试 |
| 可扩展性 | ✅ 良好 | 易于添加新功能 |
| 复杂度 | ✅ 适中 | 不过度设计 |
| 代码重复 | ⚠️ 需清理 | 存在历史遗留文件 |

## 7. 结论

**当前架构：✅ 合格且合理**

- 无需引入 GameManager
- 无需重大重构
- 只需清理历史文件
- 可选：提取类型定义

**架构原则**：
- KISS（Keep It Simple, Stupid）
- YAGNI（You Aren't Gonna Need It）
- 单一职责原则
- 依赖倒置原则

# 重构指南

## 问题诊断

项目中存在**两套并行代码**，导致混乱：

### 旧代码（未使用，可删除）
```
src/config/
  ├── GameConfig.ts
  ├── BoardConfig.ts
  └── VisualConfig.ts
src/models/
  ├── Board.ts
  └── Tile.ts
src/sprites/
  └── TileSprite.ts
src/scenes/
  └── GameScene.ts
```

### 新代码（实际使用）
```
src/
  ├── main.ts
  ├── Game.ts
  ├── constants.ts
  ├── Board.ts
  ├── Cell.ts
  └── scenes/
      └── MainScene.ts
```

## 推荐操作

### 选项 A：清理旧文件（推荐）

```bash
# 删除未使用的旧代码
rm -rf src/config
rm -rf src/models
rm -rf src/sprites
rm src/scenes/GameScene.ts

# 保留的文件
# src/main.ts
# src/Game.ts
# src/constants.ts
# src/Board.ts
# src/Cell.ts
# src/scenes/MainScene.ts
```

### 选项 B：使用新的 main.ts（可选）

如果需要更好的错误处理和日志：

```bash
# 备份旧文件
mv src/main.ts src/main.old.ts

# 使用新版本
mv src/main.final.ts src/main.ts
```

### 选项 C：提取类型定义（可选）

将 Board.ts 中的接口定义移到 types.ts：

**修改 Board.ts**：
```typescript
// 删除这些接口定义
// export interface CellMoveInfo { ... }
// export interface GravityResult { ... }

// 改为导入
import { CellMoveInfo, GravityResult } from './types';
```

**修改 MainScene.ts**：
```typescript
// 从
import { Board, CellMoveInfo, GravityResult } from '../Board';

// 改为
import { Board } from '../Board';
import { CellMoveInfo, GravityResult } from '../types';
```

## 不推荐的操作

❌ **不要创建 GameManager**（除非需要以下功能）：
- 多场景管理
- 全局状态共享
- 复杂的游戏流程控制

❌ **不要过度抽象**：
- 当前架构简单清晰
- 保持 YAGNI 原则（You Aren't Gonna Need It）

## 验证步骤

清理后运行以下命令确保游戏正常：

```bash
# 启动开发服务器
npm run dev

# 检查控制台无错误
# 测试游戏基本功能：
# 1. 点击选中
# 2. 交换动画
# 3. 消除效果
# 4. 下落和填充
# 5. 连消流程
```

## 当前架构总结

✅ **优点**：
- 依赖关系清晰，单向流动
- 数据模型与视图完全分离
- 无循环引用
- 易于测试和扩展

✅ **当前架构足够好**：
- 不需要 GameManager
- 不需要过度抽象
- 符合 KISS 原则（Keep It Simple, Stupid）

⚠️ **唯一需要的**：
- 清理未使用的旧代码

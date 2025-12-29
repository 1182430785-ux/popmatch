#!/bin/bash

# PopMatch 项目清理脚本
# 删除未使用的历史遗留文件

echo "========================================="
echo "PopMatch 项目清理脚本"
echo "========================================="
echo ""

echo "⚠️  警告：此脚本将删除以下未使用的文件："
echo ""
echo "  📁 src/config/"
echo "    ├── GameConfig.ts"
echo "    ├── BoardConfig.ts"
echo "    └── VisualConfig.ts"
echo ""
echo "  📁 src/models/"
echo "    ├── Board.ts"
echo "    └── Tile.ts"
echo ""
echo "  📁 src/sprites/"
echo "    └── TileSprite.ts"
echo ""
echo "  📄 src/scenes/GameScene.ts"
echo ""

read -p "确认删除？(y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ 已取消"
    exit 1
fi

echo ""
echo "🗑️  开始清理..."
echo ""

# 删除未使用的目录和文件
if [ -d "src/config" ]; then
    rm -rf src/config
    echo "✅ 已删除 src/config/"
fi

if [ -d "src/models" ]; then
    rm -rf src/models
    echo "✅ 已删除 src/models/"
fi

if [ -d "src/sprites" ]; then
    rm -rf src/sprites
    echo "✅ 已删除 src/sprites/"
fi

if [ -f "src/scenes/GameScene.ts" ]; then
    rm src/scenes/GameScene.ts
    echo "✅ 已删除 src/scenes/GameScene.ts"
fi

echo ""
echo "========================================="
echo "✨ 清理完成！"
echo "========================================="
echo ""
echo "保留的文件结构："
echo ""
echo "  src/"
echo "    ├── main.ts"
echo "    ├── Game.ts"
echo "    ├── constants.ts"
echo "    ├── Board.ts"
echo "    ├── Cell.ts"
echo "    ├── types.ts (新增)"
echo "    └── scenes/"
echo "        └── MainScene.ts"
echo ""
echo "📝 建议下一步："
echo "  1. 运行 'npm run dev' 测试游戏"
echo "  2. 查看 REFACTORING_GUIDE.md 了解更多信息"
echo ""

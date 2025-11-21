#!/bin/bash

# 快速提交脚本：自动 add、commit、push
# 使用方式： ./quick.sh "你的commit信息"

# 如果没有填 commit 信息，默认使用时间戳
msg=${1:-"quick commit: $(date '+%Y-%m-%d %H:%M:%S')"}

echo "🔄 Adding changes..."
git add .

echo "📝 Committing: $msg"
git commit -m "$msg"

echo "⬆️ Pushing to remote..."
git push

echo "✅ Done!"

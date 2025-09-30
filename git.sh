#!/bin/bash

# 函数：检查目录是否有未提交的更改
check_changes() {
    local dir=$1
    cd "$dir" || exit 1
    if [[ -n $(git status -s) ]]; then
        return 0  # 有更改
    else
        return 1  # 无更改
    fi
}

# 函数：提交更改
commit_changes() {
    local dir=$1
    cd "$dir" || exit 1
    
    echo "检测到 $dir 有更新"
    echo "请输入提交信息 (commit message)："
    read -r commit_message
    
    if [ -z "$commit_message" ]; then
        echo "提交信息不能为空，使用默认信息：update"
        commit_message="update"
    fi
    
    git add .
    git commit -m "$commit_message"
    echo "$dir 提交完成"
    echo "------------------------"
}

# 主目录路径
main_dir=$(pwd)

# 检查并提交 df.im.client
if check_changes "$main_dir/df.im.client"; then
    commit_changes "$main_dir/df.im.client"
else
    echo "df.im.client 没有需要提交的更改"
    echo "------------------------"
fi

# 检查并提交 df.im.server
if check_changes "$main_dir/df.im.server"; then
    commit_changes "$main_dir/df.im.server"
else
    echo "df.im.server 没有需要提交的更改"
    echo "------------------------"
fi

# 返回主目录
cd "$main_dir" || exit 1

echo "Git 操作完成！"

# cat > git.sh << 'EOF'
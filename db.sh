#!/bin/bash

function print_and_exec() {
  cmd="$1"
  echo ">>> [Execcute Command]: $cmd"
  eval "$cmd"
}

while true; do
  echo "============================================================"
  echo "0: 根据 schema 成迁移文件"
  echo "1: 根据数据库已有的表生成 schema"
  echo "2: 生成空白的迁移文件(SQL)"
  echo "3: 执行迁移同步到数据库"
  echo "4: 启动一个 webui 管理面板(类似PHPMyAdmin)"
  echo "5: 执行 src/db/seed.ts 数据库填充脚本"
  echo "6: 执行 src/db/truncate.ts 清空数据表脚本(危险操作)"
  echo "7: 执行 src/db/reset.ts 删除所有数据表(危险操作)"
  echo "q: 退出脚本"
  echo "============================================================"
  echo "请输入命令编号:"
  read -r command_id

  case $command_id in
  0)
    print_and_exec "npx drizzle-kit generate"
    ;;
  1)
    print_and_exec "npx drizzle-kit pull"
    ;;
  2)
    echo "请输入迁移名称(如:seed-users-data):"
    read -r migration_name
    if [ -z "$migration_name" ]; then
      echo "迁移名称不能为空"
      continue
    fi
    print_and_exec "drizzle-kit generate --custom --name=${migration_name}"
    ;;
  3)
    print_and_exec "npx drizzle-kit migrate"
    ;;
  4)
    default_port=4983
    echo "请输入服务启动端口(默认:$default_port):"
    read -r port
    if [ -z "$port" ]; then
      port="$default_port"
    fi
    print_and_exec "npx drizzle-kit studio --port=${port}"
    ;;
  5)
    print_and_exec "npx tsx ./src/db/actions/seed.ts"
    ;;
  6)
    echo "确定要清空所有数据表吗?(y/n)"
    read -r are_you_sure
    if [ "$are_you_sure" == "y" ]; then
      print_and_exec "npx tsx ./src/db/actions/truncate.ts"
    fi
    ;;
  7)
    echo "确定要删除所有数据表吗?(y/n)"
    read -r are_you_sure
    if [ "$are_you_sure" == "y" ]; then
      print_and_exec "npx tsx ./src/db/actions/reset.ts"
    fi
    ;;
  q)
    break
    ;;
  *)
    echo "无效的指令，请重新输入"
    ;;
  esac

  echo -e "\n"
done

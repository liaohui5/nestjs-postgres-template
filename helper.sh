#!/bin/bash

function print_and_exec() {
  cmd="$1"
  echo ">>> [Execcute Command]: $cmd"
  eval "$cmd"
}

docker_image_tag="nestjs-api:latest"
docker_saved_tar="${docker_image_tag}.tar"

while true; do
  echo "============================================================"
  echo "0: 启动开发环境所需服务"
  echo "1: 打包 docker 镜像"
  echo "2: 保存 docker 镜像"
  echo "3: 打包需要部署的文件"
  echo "q: 退出脚本"
  echo "============================================================"
  echo "请输入命令编号:"
  read -r command_id

  case $command_id in
  0)
    print_and_exec "docker compose -f ./docker-compose-dev.yaml up -d"
    ;;
  1)
    print_and_exec "docker build -t ${docker_image_tag}"
    ;;
  2)
    if [[ -f "${docker_saved_tar}" ]]; then
      rm -rf "${docker_saved_tar}"
    fi
    print_and_exec "docker save -o ${docker_saved_tar} ${docker_image_tag}"
    ;;
  3)
    build_dir="./build"
    if [ -d "$build_dir" ]; then
      rm -rf "$build_dir"
    fi
    if [[ -f "${docker_saved_tar}" ]]; then
      cp "${docker_saved_tar}" ./build
    fi
    cp -r ./mysql ./config ./docker-compose.yaml ./build
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

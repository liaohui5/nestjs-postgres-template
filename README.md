<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## introduction

This is a simple nestjs project template for myself, build with:

- [nestjs](https://nestjs.com) framework
- [drizzle-orm](https://github.com/drizzle-team/drizzle-orm) + [pg](https://github.com/brianc/node-postgres) for connect to postgres
- [zod](https://v3.zod.dev/) for data validation

## Features

- database migration
- database seed
- database clearup
- shell script helpers
- docker & docker compose

## command helpers

```sh
chmod +x ./db.sh

# execute
./db.sh

# input command id and execute, like this:
============================================================
0: 根据 schema 成迁移文件
1: 根据数据库已有的表生成 schema
2: 生成空白的迁移文件(SQL)
3: 执行迁移同步到数据库
4: 启动一个 webui 管理面板(类似PHPMyAdmin)
5: 执行 src/db/seed.ts 数据库填充脚本
6: 执行 src/db/truncate.ts 清空数据表脚本(危险操作)
7: 执行 src/db/reset.ts 删除所有数据表(危险操作)
q: 退出脚本
============================================================
请输入命令编号:
```

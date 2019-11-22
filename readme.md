# Moment-server

一瞬后端。正在咕咕咕<del>开发中</del>修复 Bug。此仓库为存档。

## 快速构建开发环境

** 请确保安装并启动 MongoDB 和 Redis (默认端口) **

```bash
yarn && yarn start
```

## 生产环境

```
yarn prod
```

## 环境变量

```
cp .env.example .env
```

打开 `.env` 修改自己的域名，私钥等。

## 用到的技术栈

- express
- MongoDB
- mongoose
- redis

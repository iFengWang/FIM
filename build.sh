#!/bin/bash

echo "开始构建 df.im.client..."
cd df.im.client
npm run build
docker build -t df.im.client . --no-cache

echo "开始构建 df.im.server..."
cd ../df.im.server
npm run build
docker build -t df.im.server . --no-cache

echo "开始部署服务..."
cd ..
docker-compose down
docker-compose up -d

echo "部署完成！"

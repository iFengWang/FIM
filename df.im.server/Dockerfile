FROM node:14.0.0

WORKDIR /root

# 先复制 package.json 并安装依赖
COPY package.json ./
RUN npm install

# 然后复制源代码和编译后的文件
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

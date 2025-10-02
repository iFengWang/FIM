# Free IM 操作指南

![FIM](ascii-FIM.png)


          _____                    _____                    _____          
         /\    \                  /\    \                  /\    \         
        /::\    \                /::\    \                /::\____\        
       /::::\    \               \:::\    \              /::::|   |        
      /::::::\    \               \:::\    \            /:::::|   |        
     /:::/\:::\    \               \:::\    \          /::::::|   |        
    /:::/__\:::\    \               \:::\    \        /:::/|::|   |        
   /::::\   \:::\    \              /::::\    \      /:::/ |::|   |        
  /::::::\   \:::\    \    ____    /::::::\    \    /:::/  |::|___|______  
 /:::/\:::\   \:::\    \  /\   \  /:::/\:::\    \  /:::/   |::::::::\    \ 
/:::/  \:::\   \:::\____\/::\   \/:::/  \:::\____\/:::/    |:::::::::\____\
\::/    \:::\   \::/    /\:::\  /:::/    \::/    /\::/    / ~~~~~/:::/    /
 \/____/ \:::\   \/____/  \:::\/:::/    / \/____/  \/____/      /:::/    / 
          \:::\    \       \::::::/    /                       /:::/    /  
           \:::\____\       \::::/____/                       /:::/    /   
            \::/    /        \:::\    \                      /:::/    /    
             \/____/          \:::\    \                    /:::/    /     
                               \:::\    \                  /:::/    /      
                                \:::\____\                /:::/    /       
                                 \::/    /                \::/    /        
                                  \/____/                  \/____/         
                                                                           




## 1. 项目介绍

Free IM 是一款为满足企业内部员工之间的沟通，而提供的一款工具，具备文字语音视频交流、文件传输、电子白板、屏幕共享、远程控件、组建会议、消息通知等功能。采用 webRTC 技术来实现音视频通讯。client 端采用 react 框架实现，server 端采用 nest.js 框架实现。

## 2. CLIENT 端配置

执行位置：/df.im.client/

### 配置 SERVER 连接的 IP 和 端口

1. 在 config.js 中，修改连接 server 的 IP 地址和 port;
2. 在 config.js 中，修改默认的主题色和 IM 最小化停靠位置(可选项);

### 快捷键介绍

1. enter : 发送消息;
2. ctrl+alt+m : 切换最小化;
3. ctrl+alt+c : 切换 chat 对话框;
4. ctrl+alt+s : 切换设置;
5. ctrl+alt+h : 切换帮助;

### Docker 配置

1. 制作 镜像: docker build -t df.im.client .
2. 制作 容器: docker run -d -p 443:443 df.im.client:latest;
3. 访问:

```
   1. https://192.168.3.186/index.html?uId=111
   2. https://192.168.3.186/index.html?uId=112
   3. https://192.168.3.186/index.html?uId=113
   4. https://192.168.3.186/index.html?uId=114
```

## 3. SERVER 端配置

执行位置：/df.im.server/

### 生成 IP 证书

1. 通过 mkcert 命令生成当前 IP 的证书，然后放到 cert 目录下;

```

1. mkcert -install // 只需运行一次即可，保证系统中已经存在根证书 CA
2. mkcert wwww.xiaofeng.com 192.168.3.186 localhost 127.0.0.1 0.0.0.0 ::1
3. 生成的证书需 COPY 一份到 client 端的 nginx/cert 目录下

```

### 设置允许跨域访问的 CLIENT 端 IP 和 端口

1. 在 index.ts 中修改允许跨域访问的 CLIENT 端 IP 和 端口;
2. 运行 npm run r;

### Docker 配置

1. 制作 镜像: docker build -t df.im.server .
2. 制作 容器: docker run -d -p 3000:3000 df.im.server:latest;

## 4. 通过 docker-compose 管理

执行位置：与 docker-compose.yml 相同目录

- 启动：docker-compose up -d
- 停止：docker-compose stop
- 注销：docker-compose down

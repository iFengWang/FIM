FROM nginx:latest

COPY ./build /usr/share/nginx/html
COPY ./nginx/cert /etc/nginx/cert
COPY ./nginx/nginx.conf /etc/nginx/conf.d

# VOLUME [ "/etc/nginx/nginx.conf" ]
# WORKDIR /usr/share/nginx/html
# RUN  cp -r ./nginx/cert /etc/nginx && cp -r ./nginx/nginx.conf /etc/nginx/conf.d

ENV HOST="www.xiaofeng.com 192.168.3.37 localhost 127.0.0.1 0.0.0.0"

EXPOSE 80
EXPOSE 443

CMD ["nginx","-g","daemon off;"]

title: "科学上网ShadowSocks"
date: 2015-04-27 02:23:45
tags: [ubuntu ,ghost]
---
shadowsocks项目地址
https://github.com/shadowsocks/shadowsocks
配置说明地址：<br />
https://github.com/shadowsocks/shadowsocks/wiki/Configuration-via-Config-File


Server:
```shell
apt-get update
apt-get -y install python-pip
pip install shadowsocks
```

设置多个用户<br />
Create a config file /etc/shadowsocks.json. Example:
```shell
touch /etc/shadowsocks.json
vim /etc/shadowsocks.json

#修改成下面的配置文件
{
    "server":"104.236.129.151",
    "local_address": "127.0.0.1",
    "local_port":1080,
    "port_password":{
         "9001":"password1",
         "9002":"password2",
         "9003":"password3",
         "9004":"password4"
    },
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```
---
```shell
# To run in the foreground:
ssserver -c /etc/shadowsocks.json

# To run in the background:
ssserver -c /etc/shadowsocks.json -d start
ssserver -c /etc/shadowsocks.json -d stop

# To check the log:
sudo less /var/log/shadowsocks.log
```


google scholar 使用ipv6访问
```
# 增加一条hosts记录
vim /etc/hosts

# 加一条记录
2607:f8b0:4007:805::100f scholar.google.com
2607:f8b0:4005:800::1005 google.com
```

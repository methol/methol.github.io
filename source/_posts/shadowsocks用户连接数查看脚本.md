title: "shadowsocks用户连接数查看脚本"
date: 2015-09-06 04:10:55
tags: [ubuntu]
---
```shell
#!/bin/bash
cd ~
echo  >shadowsocks_clients.txt
for ((i=9101; i<9105; i++)); do
echo ${i}: >>shadowsocks_clients.txt
lsof -i -n -P | egrep -c ":${i}.+ESTABLISHED"  >>shadowsocks_clients.txt
lsof -i -n -P | egrep ":${i}.+ESTABLISHED"  >>shadowsocks_clients.txt
echo  >>shadowsocks_clients.txt
echo  >>shadowsocks_clients.txt
done

vim shadowsocks_clients.txt
```
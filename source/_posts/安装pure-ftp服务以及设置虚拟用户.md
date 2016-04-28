title: "安装pure-ftp服务以及设置虚拟用户"
date: 2015-04-26 10:02:19
tags: [ubuntu]
---
今天才算是终于把ghost的bolg弄好了，但是还是很麻烦，都是自己搭建的，没有好的管理平台，传文件也很麻烦，就装了一个pure-ftp，来上传和下载文件什么的。

命令不多，就下面几条。

```
#安装pure-ftpd
apt-get install pure-ftpd
# 在系统中添加相应的用户和组，如用户ftpuser 和组ftpgroup 
groupadd ftpgroup
useradd ftpuser -g ftpgroup -d /home/ftp -s /sbin/nologin 
# 添加虚拟用户，如添加ftpmethol，并指定查看目录为/srv/ghost
pure-pw useradd ftpmethol -u ftpuser -g ftpgroup -d /srv/ghost
# 根据提示输入两次密码

# 让 pure-ftpd 建立虚拟用户数据
pure-pw mkdb

# 重启服务
/etc/init.d/pure-ftpd restart

```

但是往往这样弄完之后，还是不能登陆成功，会提示用户密码验证失败，解决办法：
```
# 在/etc/pure-ftpd/auth下，创建一个软链接
cd /etc/pure-ftpd/auth
ln -s /etc/pure-ftpd/conf/PureDB 60puredb
```

其他重要配置：
```
# 匿名用户登录改为否
/etc/pure-ftpd/conf/NoAnonymous  内容改为no
```

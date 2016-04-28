title: "ubuntu下安装mysql并开启远程登陆"
date: 2015-03-11 00:47:00
tags: [ubuntu]
---
安装很简单，一行命令。<br />
==apt-get install mysql-server== <br />
开启远程登陆。<br />
==netstat -an | grep 3306==<br />
显示结果：**tcp 0 0 127.0.0.1:3306 0.0.0.0:* LISTEN**  <br />
从上面可以看出，mysql的3306端口只是监听本地的连接，这样就阻碍了外部IP对该数据库的访问，修改的办法其实很简单，进入到mysql的配置文件所在目录（==/etc/mysql/my.cnf==）下，找到文件中的如下内容：<br />
**bind-address = 127.0.0.1**<br />
将bind-address注释掉就可以让别的ip访问。
然后登陆到mysql。

==mysql -uroot -pxxxxxxxx==<br />
输入以下命令。

	mysql> grant all on *.* to user_name@'%' identified by 'user_password';
	mysql >use mysql;
	mysql>update user set host = '%' where user = 'root';
	mysql> flush privileges;

如果第三命令报错，看是不是root已经有了，primary key的错误，如果是的，可以忽略，执行下面一条命令。

之后重启mysql就可以了。

==/etc/init.d/mysql restart==


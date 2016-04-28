title: "ubuntu命令行下安装jdk"
date: 2015-03-10 20:47:00
tags: [ubuntu]
---
通过终端在/usr/local目录下新建java文件夹，并切换到目录

==mkdir /usr/local/java==<br />
==cd /usr/local/java==<br />
首先下载jdk

== wget http://download.oracle.com/otn-pub/java/jdk/8u40-b25/jdk-8u40-linux-x64.tar.gz?AuthParam=1426050099_a7374ae62bb8c10ea270621a31e5a344 ==

安装tar,解压压缩包

==apt-get install tar==<br />
==tar xvf jdk-8u40-linux-x64.tar.gz== <br />

设置jdk环境变量<br />
这里采用全局设置方法，它是是所有用户的共用的环境变量

==vim ~/.bashrc==<br />
打开之后在末尾添加：

**export JAVA_HOME=/usr/local/java/jdk1.8.0_40
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH**

保存之后，输入以下命令使之立即生效。

==source ~/.bashrc==<br />
这样就配置好了，输入下面命令查看是否生效。

==java -version==  <br />
显示如下<br />
java version “1.8.0_40″
Java(TM) SE Runtime Environment (build 1.8.0_40-b25)
Java HotSpot(TM) 64-Bit Server VM (build 25.40-b25, mixed mode)
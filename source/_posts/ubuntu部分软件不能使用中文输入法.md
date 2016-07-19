---
title: ubuntu部分软件不能使用中文输入法
date: 2016-07-19 17:20:54
tags: [ubuntu]
---
  
ubuntu安装了fcitx之后，安装了搜狗输入法，但是还是不能在wine下的QQ下输入中文，包括Intellij IDEA有时候也不行。  
看网上的教程，好像是因为有ibus的存在，而且默认为ibus，所以才不行的，有一个简单的解决办法，就是在这些软件的启动脚本前加一行命令，就可以解决了。  
例如：  
Intellij IDEA，启动脚本是 `/home/methol/software/idea-IU-162.1121.32/bin/idea.sh`，使用vim编辑，在下面这段文字前加上这段话。
```
# ---------------------------------------------------------------------
# Run the IDE.
# ---------------------------------------------------------------------
```
加上：  
```
XMODIFIERS="@im=fcitx"
export XMODIFIERS
```
如图：  
![IDEA脚本示例](/upload/image/ubuntu部分软件不能使用中文输入法1.png)  
  
  
Wine QQ的启动脚本是`/opt/longene/qq/qq.sh`  
如图：  
![Wine QQ 脚本示例](/upload/image/ubuntu部分软件不能使用中文输入法1.png)  
  
  
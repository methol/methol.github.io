title: "Ubuntu设置交换文件"
date: 2015-03-09 23:47:00
tags: [ubuntu]
---
### 首先要先说明优化修改swap

在ubuntu 里面，swappiness的值的大小对如何使用swap分区是有着很大的联系的。  

swappiness=0的时候表示最大限度使用物理内存，然后才是 swap空间，  

swappiness＝100的时候表示积极的使用swap分区，并且把内存上的数据及时的搬运到swap空间里面。  

两个极端，对于ubuntu的默认设置，这个值等于60，建议修改为10。  

### 修改swappiness的值的大小的具体操作方法
1.查看你的系统里面的swappiness  
`cat /proc/sys/vm/swappiness`
  
不出意外的话，你应该看到是 60  
  
2.修改swappiness值为10  
  
`sysctl vm.swappiness=10`  
  
但是这只是临时性的修改，在你重启系统后会恢复默认的60，所以，还要做一步：  
  
`vim /etc/sysctl.conf`  
  
在这个文档的最后加上这样一行:  
  
`vm.swappiness=10`  
  
然后保存，重启。ok，你的设置就生效了。  
  
### 设置交换文件
`mkdir /swap`  
然后进入目录  
`cd /swap`  
创建自己希望的交换分区文件的大小  
`sudo dd if=/dev/zero of=swapfile bs=1M count=2k`  
(创建2G的swap, 这步比较慢 创建分区的大小就= bs * count)  
成功后会有提示，这时候查看swap文件夹下会多一个交换文件（swapfile），文件名字你可以自己定义在上面创建命令里。  
然后输入命令 `mkswap swapfile`  
挂载交换分区：`swapon swapfile`  
如果想卸载的话输入：`swapoff swapfile`  
卸载后可以删除这个文件，然后重新根据你新的需要创建和调整交换文件大小  
  
最后可以查看空间大小:`free -m`  
swap项后面的大小就是你设定交换文件的大小如果不为0就说明挂载成功了。  
  
自动挂在交换文件（交换分区）  
自动挂载交换文件  
输入命令 `vim /etc/fstab`  
在最后添加 `/swap/swapfile swap swap defaults 0 0`  
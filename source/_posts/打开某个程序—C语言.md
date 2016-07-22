title: "打开某个程序—C语言"
date: 2014-12-23 05:40:00
tags: [c语言]
---
>一个程序经常自动关闭，想让它隔断时间开启一次，自己写了一个C语言程序，半小时打开一次。

```c
#include <iostream>
#include<windows.h>
#pragma comment(lib, "Kernel32.lib")
using namespace std;
int main()
{
  while(1){
    STARTUPINFO si; //一些必备参数设置
    memset(&si, 0, sizeof(STARTUPINFO));
    si.cb = sizeof(STARTUPINFO);
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_SHOW;
    PROCESS_INFORMATION pi; //必备参数设置结束
    if(!CreateProcess(NULL,"ExcuteApp.exe 8888",NULL,NULL,FALSE,0,NULL,NULL,&si,&pi)) //8888为命令行参数，ExcuteApp.exe为当前目录下的一个exe文件。
    {
        cout<<"Create Fail!"<<endl;
        exit(1);
    }
    else
    {cout<<"Sucess!"<<endl;}
    Sleep(1800000);//暂停 1800s
  }

  return 0;
}
```

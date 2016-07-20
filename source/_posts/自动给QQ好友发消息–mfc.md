title: "自动给QQ好友发消息–mfc"
date: 2014-12-24 01:47:00
tags: [c语言]
---
  
>用vc6.0就可以运行，自动给好友发消息  
  
``` c
	#include <windows.h>
	#include <stdlib.h>
	#include <malloc.h>
	#include <memory.h>
	#include <tchar.h>
	void CALLBACK MY(HWND hwnd,UINT a,UINT b,DWORD c);
	int APIENTRY WinMain(HINSTANCE hInstance,
		HINSTANCE hPrevInstance,
		LPSTR lpCmdLine,
		int nCmdShow)
	{
		SetTimer(NULL,1,1000,MY);//设置定时器,1000ms一次
		MessageBox(NULL,"","",0);//
		return 0;
	}

	void CALLBACK MY(HWND hwnd,UINT a,UINT b,DWORD c)
	{
		//通过spy++获得，也可以直接改后面的为好友的QQ昵称，有备注的为备注，并且这个窗口要是单独开的
		HWND qqhand = FindWindow("TXGuiFoundation", "　　　　　　 Marc");
		SendMessage(qqhand, WM_CHAR, 'I', 0);// 发送字符I
		SendMessage(qqhand, WM_CHAR, ' ', 0);
		SendMessage(qqhand, WM_CHAR, 'l', 0);
		SendMessage(qqhand, WM_CHAR, 'o', 0);
		SendMessage(qqhand, WM_CHAR, 'v', 0);
		SendMessage(qqhand, WM_CHAR, 'e', 0);
		SendMessage(qqhand, WM_CHAR, ' ', 0);
		SendMessage(qqhand, WM_CHAR, 'y', 0);
		SendMessage(qqhand, WM_CHAR, 'o', 0);
		SendMessage(qqhand, WM_CHAR, 'u', 0);
		SendMessage(qqhand, WM_KEYDOWN, VK_RETURN, 0);//发送enter,设置QQ为按enter发送
	}
``` 
  
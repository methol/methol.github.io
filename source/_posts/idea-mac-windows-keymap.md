title: "IntelliJ IDEA 快捷键，mac-windows对照"
date: 2015-03-20 05:47:00
tags: [IntelliJ IDEA]
---

# 从 Windows 过度到 Mac 必备快捷键对照表

## Mac 键盘符号说明

- `⌘` == `Command`
- `⇧` == `Shift`
- `⇪` == `Caps Lock`
- `⌥` == `Option`
- `⌃` == `Control`
- `↩` == `Return/Enter`
- `⌫` == `Delete`
- `⌦` == `向前删除键（Fn+Delete）`
- `↑` == `上箭头`
- `↓` == `下箭头`
- `←` == `左箭头`
- `→` == `右箭头`
- `⇞` == `Page Up（Fn+↑）`
- `⇟` == `Page Down（Fn+↓）`
- `Home` == `Fn + ←`
- `End` == `Fn + →`
- `⇥` == `右制表符（Tab键）`
- `⇤` == `左制表符（Shift+Tab）`
- `⎋` == `Escape (Esc)`
- `⏏` == `电源开关键`

## Ctrl

|Win 快捷键|Mac 快捷键|介绍|
|:---------|:---------|:---------|
|Ctrl + F|Command + F|在当前文件进行文本查找|
|Ctrl + R|Command + R|在当前文件进行文本替换|
|Ctrl + Z|Command + Z|撤销|
|Ctrl + Y|Command + Delete|删除光标所在行 或 删除选中的行|
|Ctrl + D|Command + D|复制光标所在行 或 复制选择内容，并把复制内容插入光标位置下面|
|Ctrl + W|Option + 方向键上|递进式选择代码块。可选中光标所在的单词或段落，连续按会在原有选中的基础上再扩展选中范围|
|Ctrl + E|Command + E|显示最近打开的文件记录列表|
|Ctrl + N|Command + O|根据输入的 **类名** 查找类文件|
|Ctrl + J|Command + J|插入自定义动态代码模板|
|Ctrl + P|Command + P|方法参数提示显示|
|Ctrl + U|Command + U|前往当前光标所在的方法的父类的方法 / 接口定义|
|Ctrl + B|Command + B|进入光标所在的方法/变量的接口或是定义处，等效于 `Ctrl + 左键单击` |
|Ctrl + /|Command + /|注释光标所在行代码，会根据当前不同文件类型使用不同的注释符号|
|Ctrl + F1|Command + F1|在光标所在的错误代码处显示错误信息|
|Ctrl + F11|Option + F3|选中文件 / 文件夹，使用助记符设定 / 取消书签|
|Ctrl + F12|Command + F12|弹出当前文件结构层，可以在弹出的层上直接输入，进行筛选|
|Ctrl + Space|Control + Space|基础代码补全，默认在 Windows 系统上被输入法占用，需要进行修改，建议修改为 `Ctrl + 逗号`|
|Ctrl + Delete|Option + Fn + Delete|删除光标后面的单词或是中文句|
|Ctrl + BackSpace|Option + Delete|删除光标前面的单词或是中文句|
|Ctrl + 1,2,3...9|Control + 1,2,3...9|定位到对应数值的书签位置|
|Ctrl + 加号|Command + 加号|展开代码|
|Ctrl + 减号|Command + 减号|折叠代码|
|Ctrl + 左键单击|Control + 左键单击|在打开的文件标题上，弹出该文件路径|
|Ctrl + 左方向键|Option + 左方向键|光标跳转到当前单词 / 中文句的左侧开头位置|
|Ctrl + 右方向键|Option + 右方向键|光标跳转到当前单词 / 中文句的右侧开头位置|
|Ctrl + 前方向键|预设中没有该快捷键|等效于鼠标滚轮向前效果|
|Ctrl + 后方向键|预设中没有该快捷键|等效于鼠标滚轮向后效果|

## Alt

|Win 快捷键|Mac 快捷键|介绍|
|:---------|:---------|:---------|
|Alt + \`|Control + V|显示版本控制常用操作菜单弹出层|
|Alt + F1|Option + F1|显示当前文件选择目标弹出层，弹出层中有很多目标可以进行选择|
|Alt + F7|Option + F7|查询所选对象/变量被引用|
|Alt + Enter|Option + Enter|IntelliJ IDEA 根据光标所在问题，提供快速修复选择，光标放在的位置不同提示的结果也不同|
|Alt + Insert|Command + N|代码自动生成，如生成对象的 set / get 方法，构造函数，toString() 等|
|Alt + 左方向键|Control + 左方向键|切换当前已打开的窗口中的子视图，比如Debug窗口中有Output、Debugger等子视图，用此快捷键就可以在子视图中切换|
|Alt + 右方向键|Control + 右方向键|切换当前已打开的窗口中的子视图，比如Debug窗口中有Output、Debugger等子视图，用此快捷键就可以在子视图中切换|
|Alt + 前方向键|Control + 前方向键|当前光标跳转到当前文件的前一个方法名位置|
|Alt + 后方向键|Control + 后方向键|当前光标跳转到当前文件的后一个方法名位置|
|Alt + 1,2,3...9|Command + 1,2,3...9|显示对应数值的选项卡，其中 1 是 Project 用得最多|

## Shift

|Win 快捷键|Mac 快捷键|介绍|
|:---------|:---------|:---------|
|Shift + F11|Command + F3|弹出书签显示层|
|Shift + Tab|Shift + Tab|取消缩进|
|Shift + Enter|Shift + Enter|开始新一行。光标所在行下空出一行，光标定位到新行位置|
|Shift + 左键单击|Shift + 左键单击|在打开的文件名上按此快捷键，可以关闭当前打开文件|

## Ctrl + Alt

|Win 快捷键|Mac 快捷键|介绍|
|:---------|:---------|:---------|
|Ctrl + Alt + L|Command + Option + L|格式化代码，可以对当前文件和整个包目录使用|
|Ctrl + Alt + O|Control + Option + O|优化导入的类，可以对当前文件和整个包目录使用|
|Ctrl + Alt + T|Command + Option + T|对选中的代码弹出环绕选项弹出层|
|Ctrl + Alt + S|Command + 逗号|打开 IntelliJ IDEA 系统设置|
|Ctrl + Alt + Enter|Command + Option + Enter|光标所在行上空出一行，光标定位到新行|
|Ctrl + Alt + 左方向键|Command + Option + 左方向键|退回到上一个操作的地方|
|Ctrl + Alt + 右方向键|Command + Option + 右方向键|前进到上一个操作的地方|

## Ctrl + Shift

|Win 快捷键|Mac 快捷键|介绍|
|:---------|:---------|:---------|
|Ctrl + Shift + F|Command + Shift + F|根据输入内容查找整个项目 或 指定目录内文件|
|Ctrl + Shift + R|Command + Shift + F|根据输入内容替换对应内容，范围为整个项目 或 指定目录内文件|
|Ctrl + Shift + J|Control + Shift + J|自动将下一行合并到当前行末尾|
|Ctrl + Shift + Z|Command + Shift + Z|取消撤销|
|Ctrl + Shift + W|Option + 方向键下|递进式取消选择代码块。可选中光标所在的单词或段落，连续按会在原有选中的基础上再扩展取消选中范围|
|Ctrl + Shift + N|Command + Shift + O|通过文件名定位 / 打开文件 / 目录，打开目录需要在输入的内容后面多加一个正斜杠|
|Ctrl + Shift + U|Command + Shift + U|对选中的代码进行大 / 小写轮流转换|
|Ctrl + Shift + T|Command + Shift + T|对当前类生成单元测试类，如果已经存在的单元测试类则可以进行选择|
|Ctrl + Shift + C|Command + Shift + C|复制当前文件磁盘路径到剪贴板|
|Ctrl + Shift + B|Control + Shift + B|跳转到类型声明处|
|Ctrl + Shift + /|Command + Option + /|代码块注释|
|Ctrl + Shift + \[|Command + Shift + \[|选中从光标所在位置到它的顶部中括号位置|
|Ctrl + Shift + \]|Command + Shift + \]|选中从光标所在位置到它的底部中括号位置|
|Ctrl + Shift + 加号|Command + Shift + 加号|展开所有代码|
|Ctrl + Shift + 减号|Command + Shift + 减号|折叠所有代码|
|Ctrl + Shift + F7|Command + Shift + F7|高亮显示所有该选中文本，按Esc高亮消失|
|Ctrl + Shift + F12|Command + Shift + F12|编辑器最大化|
|Ctrl + Shift + Enter|Command + Shift + Enter|自动结束代码，行末自动添加分号|
|Ctrl + Shift + Backspace|Ctrl + Shift + Backspace|退回到上次修改的地方|
|Ctrl + Shift + 1,2,3...9|Control + Shift + 1,2,3...9|快速添加指定数值的书签|
|Ctrl + Shift + 左键单击|Command + Shift + 左键单击|把光标放在某个类变量上，按此快捷键可以直接定位到该类中|
|Ctrl + Shift + 左方向键|Option + Shift + 左方向键|在代码文件上，光标跳转到当前单词 / 中文句的左侧开头位置，同时选中该单词 / 中文句|
|Ctrl + Shift + 右方向键|Option + Shift + 右方向键|在代码文件上，光标跳转到当前单词 / 中文句的右侧开头位置，同时选中该单词 / 中文句|
|Ctrl + Shift + 前方向键|Command + Shift + 前方向键|光标放在方法名上，将方法移动到上一个方法前面，调整方法排序|
|Ctrl + Shift + 后方向键|Command + Shift + 后方向键|光标放在方法名上，将方法移动到下一个方法前面，调整方法排序|

## Alt + Shift

|Win 快捷键|Mac 快捷键|介绍|
|:---------|:---------|:---------|
|Alt + Shift + N|Option + Shift + B|选择 / 添加 task|
|Alt + Shift + 左键双击|Option + Shift + 左键双击|选择被双击的单词 / 中文句，按住不放，可以同时选择其他单词 / 中文句|
|Alt + Shift + 前方向键|Option + Shift + 前方向键|移动光标所在行向上移动|
|Alt + Shift + 后方向键|Option + Shift + 后方向键|移动光标所在行向下移动|

## Ctrl + Shift + Alt

|Win 快捷键|Mac 快捷键|介绍|
|:---------|:---------|:---------|
|Ctrl + Shift + Alt + V|Command + Shift + Option + V|无格式黏贴|
|Ctrl + Shift + Alt + S|Command + ;|打开当前项目设置|

## 其他

|Win 快捷键|Mac 快捷键|介绍|
|:---------|:---------|:---------|
|F2|F2|跳转到下一个高亮错误 或 警告位置|
|F4|F4|编辑源|
|F11|F3|添加书签|
|F12|F12|回到前一个工具窗口|
|Tab|Tab|缩进|
|ESC|ESC|从工具窗口进入代码文件窗口|

----------

# IntelliJ IDEA 快捷键

## Ctrl

|快捷键|介绍|
|:---------|:---------|
|Ctrl + F|在当前文件进行文本查找 `（必备）` |
|Ctrl + R|在当前文件进行文本替换 `（必备）` |
|Ctrl + Z|撤销 `（必备）` |
|Ctrl + Y|删除光标所在行 或 删除选中的行 `（必备）` |
|Ctrl + X|剪切光标所在行 或 剪切选择内容|
|Ctrl + C|复制光标所在行 或 复制选择内容|
|Ctrl + D|复制光标所在行 或 复制选择内容，并把复制内容插入光标位置下面 `（必备）` |
|Ctrl + W|递进式选择代码块。可选中光标所在的单词或段落，连续按会在原有选中的基础上再扩展选中范围 `（必备）` |
|Ctrl + E|显示最近打开的文件记录列表|
|Ctrl + N|根据输入的 **类名** 查找类文件|
|Ctrl + G|在当前文件跳转到指定行处|
|Ctrl + J|插入自定义动态代码模板|
|Ctrl + P|方法参数提示显示|
|Ctrl + Q|光标所在的变量 / 类名 / 方法名等上面（也可以在提示补充的时候按），显示文档内容|
|Ctrl + U|前往当前光标所在的方法的父类的方法 / 接口定义|
|Ctrl + B|进入光标所在的方法/变量的接口或是定义出，等效于 `Ctrl + 左键单击` |
|Ctrl + K|版本控制提交项目，需要此项目有加入到版本控制才可用|
|Ctrl + T|版本控制更新项目，需要此项目有加入到版本控制才可用|
|Ctrl + H|显示当前类的层次结构|
|Ctrl + O|选择可重写的方法|
|Ctrl + I|选择可继承的方法|
|Ctrl + \+|展开代码|
|Ctrl + \-|折叠代码|
|Ctrl + /|注释光标所在行代码，会根据当前不同文件类型使用不同的注释符号 `（必备）` |
|Ctrl + \[|移动光标到当前所在代码的花括号开始位置|
|Ctrl + \]|移动光标到当前所在代码的花括号结束位置|
|Ctrl + F1|在光标所在的错误代码出显示错误信息|
|Ctrl + F3|调转到所选中的词的下一个引用位置|
|Ctrl + F4|关闭当前编辑文件|
|Ctrl + F8|在 Debug 模式下，切换断点|
|Ctrl + F9|执行 Make Project 操作|
|Ctrl + F11|选中文件 / 文件夹，使用助记符设定 / 取消书签|
|Ctrl + F12|弹出当前文件结构层，可以在弹出的层上直接输入，进行筛选|
|Ctrl + Tab|编辑窗口切换，如果在切换的过程又加按上delete，则是关闭对应选中的窗口|
|Ctrl + Enter|智能分隔行|
|Ctrl + End|跳到文件尾|
|Ctrl + Home|跳到文件头|
|Ctrl + Space|基础代码补全，默认在 Windows 系统上被输入法占用，需要进行修改 `（必备）` |
|Ctrl + Delete|删除光标后面的单词或是中文句|
|Ctrl + BackSpace|删除光标前面的单词或是中文句|
|Ctrl + 1,2,3...9|定位到对应数值的书签位置|
|Ctrl + 左键单击|在打开的文件标题上，弹出该文件路径|
|Ctrl + 光标定位|按 Ctrl 不要松开，会显示光标所在的类信息摘要|
|Ctrl + 左方向键|光标跳转到当前单词 / 中文句的左侧开头位置|
|Ctrl + 右方向键|光标跳转到当前单词 / 中文句的右侧开头位置|
|Ctrl + 前方向键|等效于鼠标滚轮向前效果|
|Ctrl + 后方向键|等效于鼠标滚轮向后效果|

## Alt

|快捷键|介绍|
|:---------|:---------|
|Alt + \`|显示版本控制常用操作菜单弹出层|
|Alt + Q|弹出一个提示，显示当前类的声明 / 上下文信息|
|Alt + F1|显示当前文件选择目标弹出层，弹出层中有很多目标可以进行选择|
|Alt + F2|对于前面页面，显示各类浏览器打开目标选择弹出层|
|Alt + F3|选中文本，逐个往下查找相同文本，并高亮显示|
|Alt + F7|查找光标所在的方法 / 变量 / 类被调用的地方|
|Alt + F8|在 Debug 的状态下，选中对象，弹出可输入计算表达式调试框，查看该输入内容的调试结果|
|Alt + Home|定位 / 显示到当前文件的 `Navigation Bar` |
|Alt + Enter|IntelliJ IDEA 根据光标所在问题，提供快速修复选择，光标放在的位置不同提示的结果也不同 `（必备）` |
|Alt + Insert|代码自动生成，如生成对象的 set / get 方法，构造函数，toString() 等|
|Alt + 左方向键|按左方向切换当前已打开的文件视图|
|Alt + 右方向键|按右方向切换当前已打开的文件视图|
|Alt + 前方向键|当前光标跳转到当前文件的前一个方法名位置|
|Alt + 后方向键|当前光标跳转到当前文件的后一个方法名位置|
|Alt + 1,2,3...9|显示对应数值的选项卡，其中 1 是 Project 用得最多|

## Shift

|快捷键|介绍|
|:---------|:---------|
|Shift + F1|如果有外部文档可以连接外部文档|
|Shift + F2|跳转到上一个高亮错误 或 警告位置|
|Shift + F3|在查找模式下，查找匹配上一个|
|Shift + F6|对文件 / 文件夹 重命名|
|Shift + F7|在 Debug 模式下，智能步入|
|Shift + F8|在 Debug 模式下，跳出|
|Shift + F9|等效于点击工具栏的 `Debug` 按钮|
|Shift + F10|等效于点击工具栏的 `Run` 按钮|
|Shift + F11|弹出书签显示层|
|Shift + Tab|取消缩进|
|Shift + ESC|隐藏当前 或 最后一个激活的工具窗口|
|Shift + End|选中光标到当前行尾位置|
|Shift + Home|选中光标到当前行头位置|
|Shift + Enter|开始新一行。光标所在行下空出一行，光标定位到新行位置|
|Shift + 左键单击|在打开的文件名上按此快捷键，可以关闭当前打开文件|
|Shift + 滚轮前后滚动|当前文件的横向滚动轴滚动|

## Ctrl + Alt

|快捷键|介绍|
|:---------|:---------|
|Ctrl + Alt + L|格式化代码，可以对当前文件和整个包目录使用 `（必备）` |
|Ctrl + Alt + O|优化导入的类，可以对当前文件和整个包目录使用 `（必备）` |
|Ctrl + Alt + I|光标所在行 或 选中部分进行自动代码缩进，有点类似格式化|
|Ctrl + Alt + T|对选中的代码弹出环绕选项弹出层|
|Ctrl + Alt + J|弹出模板选择窗口，讲选定的代码加入动态模板中|
|Ctrl + Alt + H|调用层次|
|Ctrl + Alt + B|在某个调用的方法名上使用会跳到具体的实现处，可以跳过接口|
|Ctrl + Alt + V|快速引进变量|
|Ctrl + Alt + Y|同步、刷新|
|Ctrl + Alt + S|打开 IntelliJ IDEA 系统设置|
|Ctrl + Alt + F7|显示使用的地方。寻找被该类或是变量被调用的地方，用弹出框的方式找出来|
|Ctrl + Alt + F11|切换全屏模式|
|Ctrl + Alt + Enter|光标所在行上空出一行，光标定位到新行|
|Ctrl + Alt + Home|弹出跟当前文件有关联的文件弹出层|
|Ctrl + Alt + Space|类名自动完成|
|Ctrl + Alt + 左方向键|退回到上一个操作的地方 `（必备）` |
|Ctrl + Alt + 右方向键|前进到上一个操作的地方 `（必备）` |
|Ctrl + Alt + 前方向键|在查找模式下，跳到上个查找的文件|
|Ctrl + Alt + 后方向键|在查找模式下，跳到下个查找的文件|

## Ctrl + Shift

|快捷键|介绍|
|:---------|:---------|
|Ctrl + Shift + F|根据输入内容查找整个项目 或 指定目录内文件 `（必备）` |
|Ctrl + Shift + R|根据输入内容替换对应内容，范围为整个项目 或 指定目录内文件 `（必备）` |
|Ctrl + Shift + J|自动将下一行合并到当前行末尾 `（必备）` |
|Ctrl + Shift + Z|取消撤销 `（必备）` |
|Ctrl + Shift + W|递进式取消选择代码块。可选中光标所在的单词或段落，连续按会在原有选中的基础上再扩展取消选中范围 `（必备）` |
|Ctrl + Shift + N|通过文件名定位 / 打开文件 / 目录，打开目录需要在输入的内容后面多加一个正斜杠 `（必备）` |
|Ctrl + Shift + U|对选中的代码进行大 / 小写轮流转换 `（必备）` |
|Ctrl + Shift + T|对当前类生成单元测试类，如果已经存在的单元测试类则可以进行选择|
|Ctrl + Shift + C|复制当前文件磁盘路径到剪贴板|
|Ctrl + Shift + V|弹出缓存的最近拷贝的内容管理器弹出层|
|Ctrl + Shift + E|显示最近修改的文件列表的弹出层|
|Ctrl + Shift + H|显示方法层次结构|
|Ctrl + Shift + B|跳转到类型声明处|
|Ctrl + Shift + I|快速查看光标所在的方法 或 类的定义|
|Ctrl + Shift + A|查找动作 / 设置|
|Ctrl + Shift + /|代码块注释 `（必备）` |
|Ctrl + Shift + \[|选中从光标所在位置到它的顶部中括号位置|
|Ctrl + Shift + \]|选中从光标所在位置到它的底部中括号位置|
|Ctrl + Shift + \+|展开所有代码|
|Ctrl + Shift + \-|折叠所有代码|
|Ctrl + Shift + F7|高亮显示所有该选中文本，按Esc高亮消失|
|Ctrl + Shift + F8|在 Debug 模式下，查看断点|
|Ctrl + Shift + F9|编译选中的文件 / 包 / Module|
|Ctrl + Shift + F12|编辑器最大化|
|Ctrl + Shift + Space|智能代码提示|
|Ctrl + Shift + Enter|自动结束代码，行末自动添加分号 `（必备）` |
|Ctrl + Shift + Backspace|退回到上次修改的地方|
|Ctrl + Shift + 1,2,3...9|快速添加指定数值的书签|
|Ctrl + Shift + 左方向键|在代码文件上，光标跳转到当前单词 / 中文句的左侧开头位置，同时选中该单词 / 中文句|
|Ctrl + Shift + 右方向键|在代码文件上，光标跳转到当前单词 / 中文句的右侧开头位置，同时选中该单词 / 中文句|
|Ctrl + Shift + 左方向键|在光标焦点是在工具选项卡上，缩小选项卡区域|
|Ctrl + Shift + 右方向键|在光标焦点是在工具选项卡上，扩大选项卡区域|
|Ctrl + Shift + 前方向键|光标放在方法名上，将方法移动到上一个方法前面，调整方法排序|
|Ctrl + Shift + 后方向键|光标放在方法名上，将方法移动到下一个方法前面，调整方法排序|

## Alt + Shift

|快捷键|介绍|
|:---------|:---------|
|Alt + Shift + N|选择 / 添加 task|
|Alt + Shift + F|显示添加到收藏夹弹出层|
|Alt + Shift + C|查看最近操作项目的变化情况列表|
|Alt + Shift + F|添加到收藏夹|
|Alt + Shift + I|查看项目当前文件|
|Alt + Shift + F9|弹出 `Debug`  的可选择菜单|
|Alt + Shift + F10|弹出 `Run`  的可选择菜单|
|Alt + Shift + 左键双击|选择被双击的单词 / 中文句，按住不放，可以同时选择其他单词 / 中文句|
|Alt + Shift + 前方向键|移动光标所在行向上移动|
|Alt + Shift + 后方向键|移动光标所在行向下移动|

## Ctrl + Shift + Alt

|快捷键|介绍|
|:---------|:---------|
|Ctrl + Shift + Alt + V|无格式黏贴|
|Ctrl + Shift + Alt + N|前往指定的变量 / 方法|
|Ctrl + Shift + Alt + S|打开当前项目设置|
|Ctrl + Shift + Alt + C|复制参考信息|

## 其他

|快捷键|介绍|
|:---------|:---------|
|F2|跳转到下一个高亮错误 或 警告位置 `（必备）` |
|F3|在查找模式下，定位到下一个匹配处|
|F4|编辑源|
|F7|在 Debug 模式下，进入|
|F8|在 Debug 模式下，跳过，进入下一步|
|F9|在 Debug 模式下，恢复程序运行|
|F11|添加书签|
|F12|回到前一个工具窗口|
|Tab|缩进|
|ESC|从工具窗口进入代码文件窗口|

### 官网快捷键资料
> * Windows / Linux：<https://www.jetbrains.com/idea/docs/IntelliJIDEA_ReferenceCard.pdf>
> * Mac OS X：<https://www.jetbrains.com/idea/docs/IntelliJIDEA_ReferenceCard_Mac.pdf>

### 第三方快捷键资料
> * 来自 eta02913：<http://xinyuwu.iteye.com/blog/1005454>

### 版本
> * 版本1.0 2015年07月
> * 来源 Judas.n：<http://www.YouMeek.com>

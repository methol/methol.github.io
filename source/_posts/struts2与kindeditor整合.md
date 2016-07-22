title: "struts2与kindeditor整合"
date: 2015-05-28 04:20:15
tags: [java web]
---
之前也谈到过使用kindeditor这个非常好用的编辑器，文章也发在博客里面了。<br />
[KindEditor——textarer](/kindeditor-textarer/)<br />
之前还是研究的不深刻，只是简单的编辑器，放在struts2框架中，上传功能就不能用了，因此又重新研究下了kindeditor的用法。


####1.更改struts2的配置文件
添加如下两行就可以了。
```xml
<constant name="struts.multipart.saveDir" value="\temp"/>
<constant name="struts.multipart.maxSize" value="304857600"/>
```

####2.导包的问题。
kindeditor给我们提供了三个包，都要放到lib文件夹下，有两个是和struts2的包重复了，再添加一个就行了。
kindeditor给的三个jar包如下：
*commons-fileupload-1.2.1.jar* <br />
*commons-io-1.4.jar*<br />
*json_simple-1.1.jar*<br />

struts里面用到了*commons-fileupload-x.x.x.jar*和*commons-io-x.x.jar*，自己把另外一个包放进去就行了.

####3.jsp页面要修改
kindeditor\jsp文件夹下面的upload_json.jsp文件改为如下代码就可以了：
```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*,java.io.*" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="org.apache.commons.fileupload.*" %>
<%@ page import="org.apache.commons.fileupload.disk.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="org.apache.struts2.dispatcher.multipart.MultiPartRequestWrapper" %>

<%
    //文件保存目录路径
    String savePath = request.getSession().getServletContext().getRealPath("/") + "attached/";
//文件保存目录URL /zswz/attached/
    String saveUrl = request.getContextPath() + "/attached/";
//定义允许上传的文件扩展名
//定义允许上传的文件扩展名
    HashMap<String, String> extMap = new HashMap<String, String>();
    extMap.put("image", "gif,jpg,jpeg,png,bmp");
    extMap.put("flash", "swf,flv");
    extMap.put("media", "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb");
    extMap.put("file", "doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2");

//允许最大上传文件大小 struts.xml struts.multipart.maxSize=3G
    long maxSize = 3000000000l;

    response.setContentType("text/html; charset=UTF-8");

    if(!ServletFileUpload.isMultipartContent(request)){
        out.println(getError("请选择文件。"));
        return;
    }
//检查目录
    File uploadDir = new File(savePath);
    if(!uploadDir.isDirectory()){
        out.println(getError("上传目录不存在。"));
        return;
    }
//检查目录写权限
    if(!uploadDir.canWrite()){
        out.println(getError("上传目录没有写权限。"));
        return;
    }

    String dirName = request.getParameter("dir");//image
    if (dirName == null) {
        dirName = "image";
    }
    if(!extMap.containsKey(dirName)){
        out.println(getError("目录名不正确。"));
        return;
    }
//创建文件夹
    savePath += dirName + "/";//D:\Tomcat6.0\webapps\zswz\attached/image/
    saveUrl += dirName + "/";///zswz/attached/image/
    File saveDirFile = new File(savePath);
    if (!saveDirFile.exists()) {
        saveDirFile.mkdirs();
    }
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
    String ymd = sdf.format(new Date());
    savePath += ymd + "/";//D:\Tomcat6.0\webapps\zswz\attached/image/20111129/
    saveUrl += ymd + "/";///zswz/attached/image/20111129/
    File dirFile = new File(savePath);
    if (!dirFile.exists()) {
        dirFile.mkdirs();
    }
    if (!dirFile.isDirectory()) {
        out.println(getError("上传目录不存在 。"));
        return;
    }
//检查目录写入权限
    if (!dirFile.canWrite()) {
        out.println(getError("上传目录没有写入权限。"));
        return;
    }

//Struts2 请求 包装过滤器
    MultiPartRequestWrapper wrapper = (MultiPartRequestWrapper) request;
//获得上传的文件名
    String fileName = wrapper.getFileNames("imgFile")[0];//imgFile,imgFile,imgFile
//获得文件过滤器
    File file = wrapper.getFiles("imgFile")[0];

//检查扩展名
    String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    if(!Arrays.<String>asList(extMap.get(dirName).split(",")).contains(fileExt)){
        out.println(getError("上传文件扩展名是不允许的扩展名。\n只允许" + extMap.get(dirName) + "格式。"));
        return;
    }
//检查文件大小
    if (file.length() > maxSize) {
        out.println(getError("上传文件大小超过限制。"));
        return;
    }


//重构上传图片的名称
    SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
    String newImgName = df.format(new Date()) + "_"
            + new Random().nextInt(1000) + "." + fileExt;
    byte[] buffer = new byte[1024];
//获取文件输出流
    FileOutputStream fos = new FileOutputStream(savePath +"/" + newImgName);
//获取内存中当前文件输入流
    InputStream in = new FileInputStream(file);
    try {
        int num = 0;
        while ((num = in.read(buffer)) > 0) {
            fos.write(buffer, 0, num);
        }
    } catch (Exception e) {
        e.printStackTrace(System.err);
    } finally {
        in.close();
        fos.close();
    }
//发送给 KE
    JSONObject obj = new JSONObject();
    obj.put("error", 0);
    obj.put("url", saveUrl +"/" + newImgName);
    out.println(obj.toJSONString());
%>
<%!
    private String getError(String message) {
        JSONObject obj = new JSONObject();
        obj.put("error", 1);
        obj.put("message", message);
        return obj.toJSONString();
    }
%>
```

**这个页面不用更改**<br />
file_manager_json.jsp(文件管理)
```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*,java.io.*" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="org.json.simple.*" %>
<%

/**
 * KindEditor JSP
 *
 * 本JSP程序是演示程序，建议不要直接在实际项目中使用。
 * 如果您确定直接使用本程序，使用之前请仔细确认相关安全设置。
 *
 */

//根目录路径，可以指定绝对路径，比如 /var/www/attached/
String rootPath = pageContext.getServletContext().getRealPath("/") + "attached/";
//根目录URL，可以指定绝对路径，比如 http://www.yoursite.com/attached/
String rootUrl  = request.getContextPath() + "/attached/";
//图片扩展名
String[] fileTypes = new String[]{"gif", "jpg", "jpeg", "png", "bmp"};

String dirName = request.getParameter("dir");
if (dirName != null) {
	if(!Arrays.<String>asList(new String[]{"image", "flash", "media", "file"}).contains(dirName)){
		out.println("Invalid Directory name.");
		return;
	}
	rootPath += dirName + "/";
	rootUrl += dirName + "/";
	File saveDirFile = new File(rootPath);
	if (!saveDirFile.exists()) {
		saveDirFile.mkdirs();
	}
}
//根据path参数，设置各路径和URL
String path = request.getParameter("path") != null ? request.getParameter("path") : "";
String currentPath = rootPath + path;
String currentUrl = rootUrl + path;
String currentDirPath = path;
String moveupDirPath = "";
if (!"".equals(path)) {
	String str = currentDirPath.substring(0, currentDirPath.length() - 1);
	moveupDirPath = str.lastIndexOf("/") >= 0 ? str.substring(0, str.lastIndexOf("/") + 1) : "";
}

//排序形式，name or size or type
String order = request.getParameter("order") != null ? request.getParameter("order").toLowerCase() : "name";

//不允许使用..移动到上一级目录
if (path.indexOf("..") >= 0) {
	out.println("Access is not allowed.");
	return;
}
//最后一个字符不是/
if (!"".equals(path) && !path.endsWith("/")) {
	out.println("Parameter is not valid.");
	return;
}
//目录不存在或不是目录
File currentPathFile = new File(currentPath);
if(!currentPathFile.isDirectory()){
	out.println("Directory does not exist.");
	return;
}

//遍历目录取的文件信息
List<Hashtable> fileList = new ArrayList<Hashtable>();
if(currentPathFile.listFiles() != null) {
	for (File file : currentPathFile.listFiles()) {
		Hashtable<String, Object> hash = new Hashtable<String, Object>();
		String fileName = file.getName();
		if(file.isDirectory()) {
			hash.put("is_dir", true);
			hash.put("has_file", (file.listFiles() != null));
			hash.put("filesize", 0L);
			hash.put("is_photo", false);
			hash.put("filetype", "");
		} else if(file.isFile()){
			String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
			hash.put("is_dir", false);
			hash.put("has_file", false);
			hash.put("filesize", file.length());
			hash.put("is_photo", Arrays.<String>asList(fileTypes).contains(fileExt));
			hash.put("filetype", fileExt);
		}
		hash.put("filename", fileName);
		hash.put("datetime", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(file.lastModified()));
		fileList.add(hash);
	}
}

if ("size".equals(order)) {
	Collections.sort(fileList, new SizeComparator());
} else if ("type".equals(order)) {
	Collections.sort(fileList, new TypeComparator());
} else {
	Collections.sort(fileList, new NameComparator());
}
JSONObject result = new JSONObject();
result.put("moveup_dir_path", moveupDirPath);
result.put("current_dir_path", currentDirPath);
result.put("current_url", currentUrl);
result.put("total_count", fileList.size());
result.put("file_list", fileList);

response.setContentType("application/json; charset=UTF-8");
out.println(result.toJSONString());
%>
<%!
public class NameComparator implements Comparator {
	public int compare(Object a, Object b) {
		Hashtable hashA = (Hashtable)a;
		Hashtable hashB = (Hashtable)b;
		if (((Boolean)hashA.get("is_dir")) && !((Boolean)hashB.get("is_dir"))) {
			return -1;
		} else if (!((Boolean)hashA.get("is_dir")) && ((Boolean)hashB.get("is_dir"))) {
			return 1;
		} else {
			return ((String)hashA.get("filename")).compareTo((String)hashB.get("filename"));
		}
	}
}
public class SizeComparator implements Comparator {
	public int compare(Object a, Object b) {
		Hashtable hashA = (Hashtable)a;
		Hashtable hashB = (Hashtable)b;
		if (((Boolean)hashA.get("is_dir")) && !((Boolean)hashB.get("is_dir"))) {
			return -1;
		} else if (!((Boolean)hashA.get("is_dir")) && ((Boolean)hashB.get("is_dir"))) {
			return 1;
		} else {
			if (((Long)hashA.get("filesize")) > ((Long)hashB.get("filesize"))) {
				return 1;
			} else if (((Long)hashA.get("filesize")) < ((Long)hashB.get("filesize"))) {
				return -1;
			} else {
				return 0;
			}
		}
	}
}
public class TypeComparator implements Comparator {
	public int compare(Object a, Object b) {
		Hashtable hashA = (Hashtable)a;
		Hashtable hashB = (Hashtable)b;
		if (((Boolean)hashA.get("is_dir")) && !((Boolean)hashB.get("is_dir"))) {
			return -1;
		} else if (!((Boolean)hashA.get("is_dir")) && ((Boolean)hashB.get("is_dir"))) {
			return 1;
		} else {
			return ((String)hashA.get("filetype")).compareTo((String)hashB.get("filetype"));
		}
	}
}
%>
```
  
这个页面加了一个js函数，用来同步textarea框中数据用的，要不然点击提交按钮之后，post上去是空的内容。  
```
function fromsubmit(){
    content1.sync();
    document.forms['example'].submit();
}
```
demo.jsp(演示页面,开发中修改这个页面即可)  
```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
request.setCharacterEncoding("UTF-8");
String htmlData = request.getParameter("content1") != null ? request.getParameter("content1") : "";
%>
<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<title>KindEditor JSP</title>
	<link rel="stylesheet" href="../themes/default/default.css" />
	<link rel="stylesheet" href="../plugins/code/prettify.css" />
	<script charset="utf-8" src="../kindeditor.js"></script>
	<script charset="utf-8" src="../lang/zh_CN.js"></script>
	<script charset="utf-8" src="../plugins/code/prettify.js"></script>
	<script>
		KindEditor.ready(function(K) {
			var editor1 = K.create('textarea[name="content1"]', {
				cssPath : '../plugins/code/prettify.css',
				uploadJson : '../jsp/upload_json.jsp',
				fileManagerJson : '../jsp/file_manager_json.jsp',
				allowFileManager : true,
				afterCreate : function() {
					var self = this;
					K.ctrl(document, 13, function() {
						self.sync();
						document.forms['example'].submit();
					});
					K.ctrl(self.edit.doc, 13, function() {
						self.sync();
						document.forms['example'].submit();
					});
				}
			});
			prettyPrint();
		});
function fromsubmit(){
    content1.sync();
    document.forms['example'].submit();
}
	</script>
</head>
<body>
	<%=htmlData%>
	<form name="example" method="post" action="demo.jsp">
		<textarea name="content1" cols="100" rows="8" style="width:700px;height:200px;visibility:hidden;"><%=htmlspecialchars(htmlData)%></textarea>
		<br />
		<input type="submit" name="button" value="提交内容" /> (提交快捷键: Ctrl + Enter)
	</form>
</body>
</html>
<%!
private String htmlspecialchars(String str) {
	str = str.replaceAll("&", "&amp;");
	str = str.replaceAll("<", "&lt;");
	str = str.replaceAll(">", "&gt;");
	str = str.replaceAll("\"", "&quot;");
	return str;
}
%>
```
  
  
已经写好，完整的代码，百度云打包下载。<br />
[点击下载(密码kof3)](http://pan.baidu.com/s/1mg41jEK)

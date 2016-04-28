title: "struts2上传文件，并存路径到数据库中"
date: 2015-05-13 04:37:12
tags: [java web]
---
jsp页面
``` jsp
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java"%>
<%@ taglib prefix="s" uri="/struts-tags"%>


<html>
    <head>
        <title>资源上传</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="../js/jquery-1.11.1.min.js"></script>
    </head>
    <body>
        <div style="width: 100%; height: 100%; margin-left:auto;margin-right: auto; margin-bottom: auto; margin-top:auto">
            <p> ${requestScope.message}<br /> </p>
            <div  style="width: 400px;height: 270px;  margin-left: auto;margin-right: auto; margin-bottom: auto; margin-top:40px;">
        <p>选择要上传的文件</p>
        <s:form action="UploadResource" method="post" enctype="multipart/form-data">
            <s:file  name="uploadfile" label="选择文件" /><br /><br />
            <s:submit value="上传"></s:submit>
        </s:form>
        </div>
        </div>

    </body>
</html>
```

action:UploadResource
(注：baseaction中就是简单的把session变为属性，没有别的内容)
``` java
package com.methol.action;

import com.methol.service.ResourceService;
import com.methol.service.TeacherService;
import com.methol.vo.Resource;
import com.methol.vo.Teacher;
import com.opensymphony.xwork2.ActionContext;
import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;

import java.io.File;
import java.io.IOException;

/**
 * Created by Methol on 2015/5/7.
 */
public class UploadResource extends BaseAction{
    //获取上传文件,名称必须和表单file控件名相同
    private File uploadfile;

    //获取上传文件名,命名格式：表单file控件名+FileName(固定)
    private String uploadfileFileName;

    //获取上传文件类型,命名格式：表单file控件名+ContentType(固定)
    private String uploadfileContentType;

    public File getUploadfile() {
        return uploadfile;
    }

    public void setUploadfile(File uploadfile) {
        this.uploadfile = uploadfile;
    }

    public String getUploadfileFileName() {
        return uploadfileFileName;
    }

    public void setUploadfileFileName(String uploadfileFileName) {
        this.uploadfileFileName = uploadfileFileName;
    }

    public String getUploadfileContentType() {
        return uploadfileContentType;
    }

    public void setUploadfileContentType(String uploadfileContentType) {
        this.uploadfileContentType = uploadfileContentType;
    }

    private TeacherService teacherService;
    private ResourceService resourceService;

    public TeacherService getTeacherService() {
        return teacherService;
    }

    public void setTeacherService(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    public ResourceService getResourceService() {
        return resourceService;
    }

    public void setResourceService(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    //使用FileUtils的copyFile来实现文件上传
    public String execute() throws IOException
    {
        //设置上传文件目录
        String realpath = ServletActionContext.getServletContext().getRealPath("/teacher/ResourceUpload");
        System.out.println(realpath);
        //判断上传文件是否为空
        if(uploadfile!=null)
        {
            //设置目标文件（根据 parent 路径名字符串和 child 路径名字符串创建一个新 File 实例）
            File savefile = new File(realpath,uploadfileFileName);

            // 判断上传目录是否存在
            if(!savefile.getParentFile().exists())
                savefile.getParentFile().mkdirs();

            //把文件uploadfile 拷贝到 savefile 里,FileUtils类需要commons-io-x.x.x.jar包支持
            FileUtils.copyFile(uploadfile, savefile);

            System.out.println(savefile.getPath());


            String TeacherId = (String) this.session.get("userid");  //从session中获取用户名
            Teacher teacher = teacherService.getTeacherInfo(TeacherId);  //通过用户名获取教师类的对象
            //System.out.println(teacher.getId());

            //把路径存到数据库中,虽说是存进去了，但是下载还是直接给的url地址，通过文件名下载的
            Resource resource = new Resource();
            resource.setFilename(uploadfileFileName);
            resource.setFilepath(savefile.getPath());
            resource.setTeacherId(teacher.getId());
            resourceService.saveResource(resource);

            //设置request对象值
            ActionContext.getContext().put("message", "上传成功！");
        }
        return SUCCESS;
    }

}

```

Resource，通过hibernate逆向工程生成，有下面这些属性
```java
    private int id;
    private Integer teacherId;
    private String filename;
    private String filepath;
```

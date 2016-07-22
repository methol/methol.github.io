---
title: web上传文件夹
date: 2016-04-11 22:03:58
tags: [js, 前端]
---
使用html5的api来上传文件夹，只有chrome支持。  
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
<input id="upload" type='file' name="file" webkitdirectory>
<button id="button">按钮</button>
</body>
<script src="//libs.useso.com/js/jquery/1.11.1/jquery.min.js" type="text/javascript"></script>
<script type="text/javascript">
  function Map() {
    /**
     * 结构
     * @param key
     * @param value
     */
    function Struct(key, value) {
      this.key = key;
      this.value = value;
    }

    /**
     * 数据存放数组
     */
    this.arr = [];
    /**
     * 增加数据
     * @param key {String}
     * @param value {Object}
     */
    this.put = function (key, value) {
      for (var i = 0; i < this.arr.length; i++) {
        if (this.arr[i].key === key) {
          this.arr[i].value = value;
          return;
        }
      }
      this.arr[this.arr.length] = new Struct(key, value);
    };
    /**
     * 通过key获取数据
     * @param key {String}
     * @returns {Object}
     */
    this.get = function (key) {
      for (var i = 0; i < this.arr.length; i++) {
        if (this.arr[i].key === key) {
          return this.arr[i].value;
        }
      }
      return null;
    };
    /**
     * 删除数据
     * @param key{String}
     */
    this.remove = function (key) {
      var v;
      for (var i = 0; i < this.arr.length; i++) {
        v = this.arr[i];
        if (v.key === key) {
          this.arr.splice(i, 1);
          return;
        }
      }
    };
    /**
     * 是否存在key
     * @param key {String}
     * @returns {boolean}
     */
    this.containsKey = function (key) {
      var v;
      for (var i = 0; i < this.arr.length; i++) {
        v = this.arr[i];
        if (v.key === key) {
          return true;
        }
      }
      return false;
    };
    /**
     * 获取map数据量
     * @returns {Number}
     */
    this.size = function () {
      return this.arr.length;
    };
    /**
     * 判断Map是否为空
     * @returns {boolean}
     */
    this.isEmpty = function () {
      return this.arr.length <= 0;
    };
    /**
     * 全部清空
     */
    this.removeAll = function () {
      this.arr = [];
    };
  }
</script>
<script type="text/javascript">
  var host = "http://example.com";  // 远程服务器地址
  var map = new Map();  // 用来存放文件夹路径和id的键值对
  var files = [];

  $("#upload").change(function () {
    files = this.files;
    console.log(files);
  });

  $("#button").on("click", function () {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      console.log(file);
      var path = getFolder(file.webkitRelativePath);
      var folderId = getFolderIdFromMap(path);
      // 创建文件
      uploadResource(file, folderId, 10001);
    }
  });

  function uploadResource(file, folderId, projectId) {
    var filepath = null;
    var formData = new FormData();
    formData.append("text", file);
    $.ajax({
      url: host + "/sys/upload/uploadProjectResource",
      type: "POST",
      data: formData,
      xhrFields: {
        withCredentials: true // 确保请求会携带上Cookie
      },
      enctype: 'multipart/form-data',
      processData: false,  // tell jQuery not to process the data
      contentType: false,
      complete: function (respResult) {
        if (respResult.status == 200) {
          filepath = respResult.responseText;
          $.ajax({
            url: host + "/project/resource/create",
            type: "post",
            dataType: "json",
            xhrFields: {
              withCredentials: true
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Content-Type", "application/json");
            },
            data: JSON.stringify({
              "projectId": projectId,
              "resourceContent": filepath,
              "resourceName": file.name,
              "folderId": folderId,
              "type": 20  // 当前是文件资源
            }),
            success: function (data) {
              console.log(data);
            },
            error: function (respResult) {
            }
          });
        } else {
        }
      }
    });
  }

  function getFolderIdFromMap(path) {
    var folderId = map.get(path);
    var folderName = path.substring(path.lastIndexOf("/") + 1, path.length);
    var localFolder = 0;
    if (path.indexOf("/") > 0) {
      // 说明当前不是最高级目录，是子目录
      localFolder = getFolderIdFromMap(path.substring(0, path.lastIndexOf("/")));
    }
    if (folderId == null) {
      $.ajax({
        async: false,
        url: host + "/project/resource/create/folder",
        type: "post",
        dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
        },
        data: JSON.stringify({
          "projectId": 10001,
          "folderName": folderName,
          "folderId": localFolder
        }),
        success: function (data) {
          console.log(data);
          folderId = data.id;
          map.put(path, folderId);
        },
        error: function (respResult) {
        }
      });
    }
    return folderId;
  }

  function getFolder(path) {
    console.log(path);
    var index = path.lastIndexOf("/");
    return path.substring(0, index);
  }
</script>

</html>
```


服务器采用java，用了接受文件和创建文件夹。  
文件夹也是虚拟的，采用在当前记录增加parentId来存储父节点，实现树的结构。
表结构：  
```sql
CREATE TABLE t_project_resource_folder
(
    id BIGINT(20) PRIMARY KEY NOT NULL COMMENT '主键',
    folder_name VARCHAR(255) DEFAULT '' COMMENT '文件夹名',
    parent_id BIGINT(20) DEFAULT '0' NOT NULL COMMENT '父文件夹id,0表示顶级目录'
)
CREATE TABLE t_project_resource
(
    id BIGINT(20) PRIMARY KEY NOT NULL COMMENT '主键',
    resource_name VARCHAR(255) NOT NULL COMMENT '资源名',
    resource_content VARCHAR(255) COMMENT '资源内容,通常是放在oss文件的url',
    resource_folder_id BIGINT(20) DEFAULT '0' COMMENT '资源文件夹ID,0表示文件处于顶级目录'
)
```

服务器端接口的代码：  
```java
@RequestMapping(value = "", method = RequestMethod.POST)
public ResponseEntity<String> upload(MultipartFile text) throws Exception {
  String fileName = text.getOriginalFilename();
  int lastDot = fileName.lastIndexOf(".");
  String type = fileName.substring(lastDot + 1);
  String sb = "uploads" + "/" + UUID.randomUUID().toString() + "." + type;
  String uploadPath = storageProvider.upload(sb, text);  // 调用service接口把文件存到oss中，返回文件在oss的地址
  return ResponseEntity.ok(uploadPath);
}
```

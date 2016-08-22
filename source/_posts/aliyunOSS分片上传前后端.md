---
title: 分片上传前后端方案
date: 2016-07-22 11:12:00
tags: [java, 前端]
---

## 使用插件
前端使用baidu的[WebUploader](http://fex.baidu.com/webuploader/)  
后端使用Spring Boot 作为服务器，上传文件到aliyun OSS中，用到了Memcache来暂存中间的一些数据，可以找map替代也是可以的。  
  
>参考文档：  
> https://help.aliyun.com/document_detail/32013.html  
> http://fex.baidu.com/webuploader/doc/index.html  
  
## 代码  
### 后端代码  
controller:  
```java
/**
   * 分片上传 初始化
   *
   * @return
   * @throws Exception
   */
@ApiOperation(value = "上传项目资源", notes = "分片上传,初始化")
@RequestMapping(value = "/upload/multipart/init", method = RequestMethod.POST)
public ResponseEntity<MultipartUploadInitResponse> multipartInit(
    @RequestBody @Valid final MultipartFileInitRequestFormBean form,
    final HttpServletRequest request) throws Exception {

  final StringBuilder sb = new StringBuilder();
  sb.append("projectResource").append("/");
  sb.append(UUID.randomUUID().toString());
  sb.append("/");
  sb.append(form.getFilename());
  final MultipartUploadInitResponse response =
      this.storageProvider.initMultipartUpload(sb.toString());

  return ResponseEntity.ok(response);
}

/**
 * 进行分片上传
 *
 * @return
 * @throws Exception
 */
@ApiOperation(value = "上传项目资源", notes = "分片上传,上传中")
@RequestMapping(value = "/upload/multipart/upload", method = RequestMethod.POST)
public ResponseEntity<Void> multipartUpload(final MultipartFile text,
    final HttpServletRequest request) throws Exception {

  request.setCharacterEncoding("utf-8");
  final String uploadId = request.getParameter("uploadId");
  final String key = request.getParameter("key");
  final int partNumber = Integer.valueOf(request.getParameter("partNumber"));

  this.storageProvider.multipartUpload(uploadId, key, partNumber, text);
  return ResponseEntity.ok().build();
}

/**
 * 分片上传完成
 *
 * @return
 * @throws Exception
 */
@ApiOperation(value = "上传项目资源", notes = "分片上传,完成")
@RequestMapping(value = "/upload/multipart/complete", method = RequestMethod.POST)
public ResponseEntity<String> multipartComplete(
    @RequestBody @Valid final MultipartFileCompleteRequestFormBean form,
    final HttpServletRequest request) throws Exception {

  final String path =
      this.storageProvider
          .completeMultipartUpload(form.getUploadId(), form.getKey(), form.getPart());

  return ResponseEntity.ok(path);
}
```
service:
```java
/**
 * 分片上传流程
 * 1. 由前端发起一个ajax请求，传一个文件名，由后端生成文件路径(key)，后端根据该key向oss请求，获取upload id,返回给前端uploadId和key
 * 2. 前端把文件进行分片，初步定为5MB一片
 * 3. 前端传输文件到后端，同时携带 formData 需要携带参数 uploadId,key,当前第几片，后端存到oss后，会获取一个ETag，可以把这个存到cache里面(或者map)
 * 4. 前端传输分片数目，key，uploadId，后端调用请求，完成本次分片上传
 */

/**
 * 分片上传 上传片
 *
 * @param uploadId   这个文件的uploadId
 * @param key        这个文件的key
 * @param partNumber 设置上传分块（Part）的标识号码（Part Number）。
 *                   每一个上传分块（Part）都有一个标识它的号码（范围1~10000）。
 *                   对于同一个Upload ID，该号码不但唯一标识这一块数据，也标识了这块数据在整个文件中的
 *                   相对位置。如果你用同一个Part号码上传了新的数据，那么OSS上已有的这个号码的Part数据
 *                   将被覆盖。
 * @param file       该片文件
 * @return partETag，里面包含分片的number和当前片的ETag（字符串）
 */
@Override
public void multipartUpload(final String uploadId, final String key, final int partNumber,
    final MultipartFile file) {
  try {
    final UploadPartRequest uploadPartRequest = new UploadPartRequest();
    uploadPartRequest.setBucketName(this.ossConfig.getBucketName());
    uploadPartRequest.setKey(key);
    uploadPartRequest.setUploadId(uploadId);
    uploadPartRequest.setInputStream(file.getInputStream());
    uploadPartRequest.setPartSize(file.getSize());
    uploadPartRequest.setPartNumber(partNumber);
    final UploadPartResult uploadPartResult = this.uploadOSSClient.uploadPart(uploadPartRequest);
    this.memcachedUtil.setETag(uploadId, partNumber, uploadPartResult.getETag());
  } catch (OSSException | ClientException | IOException e) {
    logger.error("OSS storage error", e);
    throw new RuntimeException("OSS storage exception", e);
  }
}

/**
 * 初始化一个分片上传的请求
 *
 * @param storagePath 文件路径
 * @return 一个返回体 封装了key和uploadId
 */
@Override
public MultipartUploadInitResponse initMultipartUpload(final String storagePath) {
  final InitiateMultipartUploadRequest request =
      new InitiateMultipartUploadRequest(this.ossConfig.getBucketName(), storagePath);
  final InitiateMultipartUploadResult result =
      this.uploadOSSClient.initiateMultipartUpload(request);
  final MultipartUploadInitResponse response = new MultipartUploadInitResponse();
  response.setKey(storagePath);
  response.setUploadId(result.getUploadId());
  return response;
}

/**
 * 完成分片上传
 *
 * @param uploadId 文件id
 * @param key      文件key
 * @param part     一共有几份
 * @return 该文件的路径
 */
@Override
public String completeMultipartUpload(final String uploadId, final String key,
    final int part) {
  final List<PartETag> eTags = new ArrayList<>();
  for (int i = 1; i <= part; i++) {
    final String s = this.memcachedUtil.getETag(uploadId, i);
    final PartETag eTag = new PartETag(i, s);
    eTags.add(eTag);
  }
  Collections.sort(eTags, (tag1, tag2) -> tag1.getPartNumber() - tag2.getPartNumber());
  final CompleteMultipartUploadRequest completeMultipartUploadRequest =
      new CompleteMultipartUploadRequest(this.ossConfig.getBucketName(), key, uploadId, eTags);
  this.uploadOSSClient.completeMultipartUpload(completeMultipartUploadRequest);
  return this.ossConfig.getDownloadEndpoint() + "/" + key;
}
```
中间用到的一个bean:
```java

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("初始化分片上传返回体")
public class MultipartUploadInitResponse {

  @ApiModelProperty("文件key")
  private String key;

  @ApiModelProperty("文件id")
  private String uploadId;

  public String getKey() {
    return this.key;
  }

  public void setKey(final String key) {
    this.key = key;
  }

  public String getUploadId() {
    return this.uploadId;
  }

  public void setUploadId(final String uploadId) {
    this.uploadId = uploadId;
  }
}
```
  
  
### 前端代码  
需要引用一个jquery，还有webuploader的css和js即可  
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>分片上传</title>
  <link rel="stylesheet" type="text/css" href="webuploader-0.1.5/webuploader.css">
</head>
<body>

<div id="uploader" class="wu-example">
  <!--用来存放文件信息-->
  <div id="thelist" class="uploader-list"></div>
  <div class="btns">
    <div id="picker">选择文件</div>
    <button id="ctlBtn" class="btn btn-default">开始上传</button>
  </div>
</div>


</body>

<script src="jquery-3.0.0.min.js" type="text/javascript"></script>
<script src="webuploader-0.1.5/webuploader.js" type="text/javascript"></script>


<script type="text/javascript">

    var host = "http://uworks-reactor-console-dev.obaymax.com";
//  var host = "http://localhost:7080";

  var uploadId;
  var key;
  var number = 1;


  var uploader = WebUploader.create({

    // swf文件路径
    swf: 'webuploader-0.1.5//Uploader.swf',

    // 文件接收服务端。
    server: host + "/sys/upload/uploadProjectResource/multipart/upload",

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#picker',

    // 设置为 true 后，不需要手动调用上传，有文件选择即开始上传
    auto: false,

    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
    resize: false,

    // 开启分片上传
    chunked: true,

    // 文件大小
    chunkSize: 204800,  // 200k

    // 设置文件上传域的name
    fileVal: "text",

    // 同时的线程数
    threads: 3,

  });


  // 文件上传过程中创建进度条实时显示。
  uploader.on('uploadProgress', function (file, percentage) {
    var $li = $('#' + file.id),
        $percent = $li.find('.progress .progress-bar');

    // 避免重复创建
    if (!$percent.length) {
      $percent = $('<div class="progress progress-striped active">' +
          '<div class="progress-bar" role="progressbar" style="width: 0%">' +
          '</div>' +
          '</div>').appendTo($li).find('.progress-bar');
    }

    $li.find('p.state').text('上传中');

    $percent.css('width', percentage * 100 + '%');
  });

  /**
   * 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
   * object
   * data 默认的上传参数，可以扩展此对象来控制上传参数
   * headers 可以扩展此对象来控制上传头部
   */
  uploader.on("uploadBeforeSend", function (object, data, headers) {
    console.log("uploadBeforeSend");
    console.log(object);

    data.uploadId = uploadId;
    data.key = key;
    data.partNumber = number++;
    console.log(data);
  });

  /**
   * 当文件被加入队列以后触发。
   *
   * 调用init接口，初始化
   *
   */
  uploader.on("fileQueued", function (file) {
    console.log("fileQueued");
    console.log(file);
    $.ajax({
      url: host + "/sys/upload/uploadProjectResource/multipart/init",
      type: "post",
      dataType: "json",
      crossDomain: true,
      xhrFields: {
        withCredentials: true // 确保请求会携带上Cookie
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Content-Type", "application/json"); // 设置请求协议，会触发PreFlight
      },
      data: JSON.stringify({
        filename: file.name
      }),
      success: function (data) {
        uploadId = data.uploadId;
        key = data.key;
        console.log(data);
        uploader.upload();
      }
    });
  });

  /**
   * 当文件上传成功时触发。
   * file
   * reason 出错的code
   */
  uploader.on("uploadSuccess", function (file, reason) {
    console.log("uploadSuccess");

    // 调用接口 标识完成分片上传 服务合并文件并返回文件url
    $.ajax({
      url: host + "/sys/upload/uploadProjectResource/multipart/complete",
      type: "post",
      dataType: "json",
      crossDomain: true,
      xhrFields: {
        withCredentials: true // 确保请求会携带上Cookie
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Content-Type", "application/json"); // 设置请求协议，会触发PreFlight
      },
      data: JSON.stringify({
        uploadId: uploadId,
        key: key,
        part: number - 1  // 文件的分片数目
      }),
      success: function (data) {
        console.log(data);

        // todo 剩下的具体业务逻辑

      }
    });

  });

  function sleep(d) {
    for (var t = Date.now(); Date.now() - t <= d;);
  }

</script>


</html>
```
  
## 总结  
完成了分片上传，断点上传方案类似。
方案其实并不怎么好，后端可以考虑存储更多的东西，不需要每次让前端发送一个初始化请求，后续可以做调整。
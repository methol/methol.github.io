---
title: test
date: 2016-03-30 13:58:56
tags: test
---
### this is a test article.


这是一段java代码
``` java
package cc.uworks.reactor.api.http;

import com.alibaba.fastjson.JSON;

import javax.net.ssl.SSLContext;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;

import org.apache.http.HttpEntity;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.HttpClientConnectionManager;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.LayeredConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContexts;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;

import cc.uworks.reactor.api.ApiException;
import cc.uworks.reactor.api.HttpParamsHashMap;

/**
 * HTTP工具类
 *
 * @since 0.1.0
 */
public final class HttpUtils {
  private static Logger LOG = Logger.getLogger(HttpUtils.class);

  private static final String DEFAULT_CHARSET = "UTF-8";

  private HttpUtils() {
  }

  ;

  /**
   * 获取采用HTTPS协议的HTTP客户端
   *
   * @return
   */
  public static CloseableHttpClient getHttpsClient() {
    SSLContext sslcontext = SSLContexts.createSystemDefault();
    LayeredConnectionSocketFactory sslsf =
      new SSLConnectionSocketFactory(sslcontext,
        SSLConnectionSocketFactory.STRICT_HOSTNAME_VERIFIER);
    Registry<ConnectionSocketFactory> r =
      RegistryBuilder.<ConnectionSocketFactory>create().register("https", sslsf).build();
    HttpClientConnectionManager cm = new PoolingHttpClientConnectionManager(r);
    return HttpClients.custom().setConnectionManager(cm).build();
  }

  /**
   * 创建一个HTTP响应的处理器
   */
  private static final ResponseHandler<String> responseHandler = response -> {
    // 解析响应实体
    HttpEntity entity = response.getEntity();
    if (entity == null) {
      return null;
    }
    String content = null;
    try {
      content = EntityUtils.toString(entity);
    } catch (Exception e) {
      throw new RuntimeException("获取响应体失败【" + e.getMessage() + "】");
    }

    // 获取HTTP响应状态码
    int status = response.getStatusLine().getStatusCode();
    if (status == HttpStatus.OK.value()) {
      return content;
    } else {
      LOG.info("响应体：" + content);
      ErrorResponse errorResponse = null;
      try {
        errorResponse = JSON.parseObject(content, ErrorResponse.class);
      } catch (Exception e) {
        throw new RuntimeException("解析ErrorResponse出错", e);
      }
      throw new ApiException(errorResponse);
    }
  };

  public static String doGet(String url, HttpParamsHashMap params) {
    return get(HttpClients.createDefault(), url, params);
  }

  public static String get(CloseableHttpClient httpClient, String url,
    HttpParamsHashMap params) throws ApiException {
    String responseBody = null;
    try {
      if (params != null && params.size() > 0) {
        for (Map.Entry<String, String> entry : params.entrySet()) {
          String key = entry.getKey();
          String value = entry.getValue();
          url = url.replaceFirst("\\{" + key + "}", value);
        }
      }
      if (LOG.isDebugEnabled()) {
        LOG.debug(url);
      }
      // 创建HttpGet实例
      HttpGet httpGet = new HttpGet(url);

      // 设置请求头
      httpGet.addHeader("text/plain", DEFAULT_CHARSET);

      // 执行Http Get请求并获取响应
      responseBody = httpClient.execute(httpGet, responseHandler);

    } catch (ApiException e) {
      throw e;
    } catch (Exception ex) {
      throw new RuntimeException(ex);
    }
    try {
      httpClient.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
    return responseBody;
  }

  public static String doPost(String url, HttpParamsHashMap params) throws ApiException {
    return post(HttpClients.createDefault(), url, params);
  }

  public static String post(CloseableHttpClient httpClient, String url,
    HttpParamsHashMap params) throws ApiException {
    String resp = null;
    try {
      String paramJson = (params == null ? "" : JSON.toJSONString(params));
      HttpEntity httpEntity = new StringEntity(paramJson, ContentType.APPLICATION_JSON);

      // 创建Http Post实例
      HttpPost httpPost = new HttpPost(url);

      // 设置请求实体
      httpPost.setEntity(httpEntity);

      // 设置请求头
      httpPost.addHeader("text/plain", DEFAULT_CHARSET);

      httpPost.addHeader("Content-Type", "application/json");

      // 执行Http Post请求并获取响应
      resp = httpClient.execute(httpPost, responseHandler);
    } catch (Exception ex) {
      throw new RuntimeException(ex);
    }

    try {
      httpClient.close();
    } catch (IOException e) {
      e.printStackTrace();
    }

    return resp;
  }
}

```

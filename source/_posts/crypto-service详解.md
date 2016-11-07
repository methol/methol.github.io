title: "crypto-service详解"
date: 2016-10-23 14:47:00
tags: [crypto ,java]
---

# 简介
crypto-service，数据加密服务，是公司内部对重要数据进行加解密的服务。  
当顶层项目需要对用户核心数据(手机号、身份证号等)进行加密的时候，可以选择使用本服务，对数据进行加密后保存数据库，并且当其他系统需要数据时，可以通过密文到本服务解密。  
# 核心功能
## 项目配置
数据加密服务是一个标准的SAAS服务，为其他项目提供服务，需要针对不同项目做出以下配置。  
在项目列表注册项目，可以选择该项目的加密算法。一个项目可以有多个服务，服务设置解密的频率，被允许的IP地址列表，表示当前是否是测试或生产环境以及该服务解密的权限(不同服务解密的权限有限，只能解密指定服务加密的密文)。  
## 数据加密
本服务采用了RSA和DES的加密算法，创建项目的时候可以选择一种加密算法，之后会生成一个密钥，使用者只需要使用密钥和SDK即可，不需要关注内部的加密算法及解密的算法。也不需要关注加密的过程。并且不同服务可以直接传输密文即可，只要解密的服务有权限，他就可以解开其他系统加密的密文。
## 提醒功能
提醒功能主要是用来提醒各个服务的负责人，他们的解密有没有超过规定的限制。在创建项目的时候会配置该项目的预警接收人。添加服务的时候，需要配置解密的频率，分天/小时/分钟三个指标，如果超出了这三个指标的限制，设置的预警接收人就会收到短信和邮件的提醒。  
## 数据报表
提供以下三种报表，按项目解密次数报表、按IP解密次数报表、按服务解密次数报表。
# 实现原理
## RSA和DES
### RSA
引用wikipedia，[RSA加密演算法](https://zh.wikipedia.org/zh-hans/RSA%E5%8A%A0%E5%AF%86%E6%BC%94%E7%AE%97%E6%B3%95)  
RSA加密演算法是一种非对称加密演算法，只要密钥足够长，目前是没办法破解的。    
RSA公钥用来加密，私钥用来解密。  
缺点：速度慢，建议用来加密少量文本。  
### DES
引用wikipedia，[资料加密标准](https://zh.wikipedia.org/wiki/%E8%B3%87%E6%96%99%E5%8A%A0%E5%AF%86%E6%A8%99%E6%BA%96)  
资料加密标准（英语：Data Encryption Standard，缩写为 DES）是一种对称加密演算法。  
DES加密速度比RSA快很多，适合加密大量数据的情况。但是DES算法没有RSA算法安全。  
## 主要流程图
1. 应用-服务交互图
![应用-服务交互图](http://tuzhihao.com/upload/image/crypto-service/app-server.png)    
2. 加密流程图
![加密流程图](http://tuzhihao.com/upload/image/crypto-service/encrypt.png)  
3. 解密流程图
![解密流程图](http://tuzhihao.com/upload/image/crypto-service/decrypt.png)  
4. 获取加密数据唯一值的流程图
![数据唯一值](http://tuzhihao.com/upload/image/crypto-service/dataIdentifier.png)   

## 加解密服务核心类图
![加密工具类](http://tuzhihao.com/upload/image/crypto-service/crypto-class.png)  
## 加解密服务核心类介绍
`ICryptProcess`这是一个接口，规定了  
```java
String encrypt(String data);

String decrypt(String data);

String[] batchEncrypt(String[] datas);

String[] batchDecrypt(String[] datas);
```
这四个方法，分别是加密，解密，批量加密，批量解密。  
`AbstractCryptProcessor`实现了`ICryptProcess`这个接口，并对`encrypt`和`batchEncrypt`进行简单的封装。  
```java
/**
 * 封装被加密的数据，如加密后数据为<code>null</code>或为空字符串，则不做封装，直接原样返回
 *
 * @param encryptedData 被加密的数据
 * @return 封装后的数据
 */
private String wrapEncryptData(String encryptedData) {
    if (StringUtils.isEmpty(encryptedData)) {
        return encryptedData;
    }
    CryptData cryptData = new CryptData(serviceInfo.getServiceId(), encryptedData, CryptUtil.getVersion());
    return Encodes.encodeBase64(JSONObject.toJSONString(cryptData).getBytes(Charset.forName("UTF-8")));
}
```
主要是把加密后的数据，封装成为`CryptData`对象，里面包含了加密的服务ID，加密的数据，以及当前加密工具的版本，并把对象转为json字符串，进行base64转换，返回给上层应用。  
`AbstractCryptProcessor`增加了两个抽象的方法，`doEncrypt`和`doBatchEncrypt`，继承的子类实现父类的抽象方法。同时又一个成员变量`private ServiceInfoDto serviceInfo;`，用来存储调用加密服务上层应用的信息，包含服务的ID和加解密的key等。    
子类`RsaCryptProcessor`和`DesCryptProcessor`集成抽象类`AbstractCryptProcessor`，并实现了父类的抽象方法，主要是对具体加解密的实现过程。  
## 加解密工具类图
![加密工具类](http://tuzhihao.com/upload/image/crypto-service/crypt-util-class.png)  
## 加解密工具类介绍
对DES和RSA进行加解密的封装，使用的是`java.security.*`和`javax.crypto.*`里面的一些工具类，在这些工具类的基础上，根据我们的业务，做的一个工具类。

# 使用方法
## 服务注册
使用SDK之前，需要先申请注册服务，请发送一下信息到邮件:**tuzhihao@mucang.cn**
需要提供的字段：  

字段  | 说明         |是否必须
--------- | --------|---
项目名  | |是
项目描述  | |否
提醒接收人| (姓名、手机、邮箱)可以设置多个接收人|是
加密算法 | RSA 或 DES | 是
服务名| 一个项目可以有多个服务 |是
服务的项目名称| 该服务的项目名称 |是
解密频率| 日/小时/分钟 三个参考频率|是
ip白名单|可以有多个|是
生产环境|当前项目是否在生产环境|是
测试状态|如果是测试状态，不会有ip限制|是

返回的数据：  
一个32位长的key，例如：1f44ffd08b568ee056d044c0c4a768a5
## SDK集成
1. pom.xml引入maven依赖
```xml
<dependency>
    <groupId>cn.mucang.crypt</groupId>
    <artifactId>crypto-client</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```
2. 加密
```java
// PHONE_ENCRYPT_KEY 是返回的32位的key
CryptoClient cryptoClient = new CryptoClient(PHONE_ENCRYPT_KEY);  
final String phone = "18062509865";
final String encrypt = cryptoClient.encrypt(phone);  // encrypt是加密后的数据
// dataIdentifier 是该手机号的唯一值，同样的文本的 dataIdentifier 是一样的，encrypt是不一样的
final String dataIdentifier = cryptoClient.getDataIdentifier(encrypt);  
```
3. 解密
```java
final String encrypt = "密文xxxxxxxxxxxxxxxxxxxxxxxxx";
CryptoClient cryptoClient = new CryptoClient(PHONE_ENCRYPT_KEY);
final String phone = cryptoClient.decrypt(encrypt);
```
4. 获取手机号唯一值
```java
final String encrypt = "密文xxxxxxxxxxxxxxxxxxxxxxxxx";
CryptoClient cryptoClient = new CryptoClient(PHONE_ENCRYPT_KEY);
// dataIdentifier 是该手机号的唯一值，同样的文本的 dataIdentifier 是一样的，encrypt是不一样的
final String dataIdentifier = cryptoClient.getDataIdentifier(encrypt);
```
5. 批量加密
```java
public String[] batchEncrypt(String[] datas) throws CryptoException
```
6. 批量解密
```java
public String[] batchDecrypt(String[] encryptedDatas) throws CryptoException
```
7. 判断传入数据是否是加密数据
```java
public static boolean isEncrypted(String data)
```
8. 批量获取手机号唯一值 (todo)

## 关于提醒
如果用户使用频率超过了d/h/m的限制，判断该服务是不是**用户服务**，如果是用户服务，还会继续提供服务，如果不是用户服务，会立即封掉当前请求的IP，目前公司内部的服务都是用户服务。  
不管是不是用户服务，设置的提醒人都会收到短信和邮件的提醒，短信提醒频率是10分钟一次，邮件是60分钟一次。  
# 使用场景
需要对一些敏感数据加密，并且之后还有解密需求的数据，可以通过加密服务来进行加解密。  
数据量较少的如手机号和身份证号，建议采用RSA算法，目前加密服务的RSA算法最多支持加密117个字节的数据。  
数据量大的数据建议采用DES算法，可以更快得到加密结果。  
# 后期更新与维护
1. 报表功能有BUG，目前只能提供最近三天的报表，需要进行修复。  
   原因是因为统计次数采用的是redis-count，没有把数据存储到数据库中。
2. 每天应生成按项目解密次数报表、按IP解密次数报表、按服务解密次数报表并发送邮件。
3. 内存cache切换到redis。
4. 增加一个批量获取手机号唯一值的方法。
5. 根据authKey从缓存获取加密工具(cryptProcessor)的时候有可能再次从缓存获取serviceInfo
10. 多机不间断服务部署实践。

# FAQ
Q: 为什么采用RSA算法时，服务端同时保存公钥和私钥？  
A: 第一、因为不管是RSA还是DES算法，返回给用户的都是一个authKey，用户并不知道这个加密的过程，也不需要知道加密的过程。第二、这样可以更好的统计用户的使用频率及使用次数。第三、返回给用户加密的数据是一种封装过的格式，不希望用户知道这种格式，用户也不需要知道这种格式。第四、不同项目的服务之间可能交换数据，为了保证服务端既能加密，又能解密。  
Q: 项目A和项目B获取同一个手机号的Identifier一样吗？  
A: 不一样，因为密钥不同，获取的Identifier也不一样。如果项目A有解密项目B的权限，就可以解密这个手机号，如果A没有B的权限，那么即使有密文，也没办法解密手机号。（具体参见流程图）  

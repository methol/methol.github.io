title: "java MD5加密 bcrypt加密工具类"
date: 2015-05-26 04:30:54
tags: [java, 工具类]
---

## md5  
```java

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 将密码进行MD5加密处理
 */
public class PassWordDigester {

    private static final String ALGORITHM_MD5 = "MD5";

    /**
     * 把明文转换为经过MD5加密的密文
     *
     * @param pass 明文password
     * @return 密文password
     */
    public final static String getPassMD5(String pass) {
        String keys = null;
        try {
            MessageDigest md = MessageDigest.getInstance(ALGORITHM_MD5);
            if (pass == null) {
                pass = "";
            }
            byte[] bPass = pass.getBytes("UTF-8");
            md.update(bPass);
            keys = bytesToHexString(md.digest());
        } catch (NoSuchAlgorithmException aex) {
            aex.printStackTrace();
        } catch (java.io.UnsupportedEncodingException uex) {
            uex.printStackTrace();
        }
        return keys;
    }

    /**
     * 将byte[]转换为十六进制字符串
     *
     * @param bArray
     * @return
     */
    public final static String bytesToHexString(byte[] bArray) {
        StringBuffer sb = new StringBuffer(bArray.length);
        String sTemp;
        for (int i = 0; i < bArray.length; i++) {
            sTemp = Integer.toHexString(0xFF & bArray[i]);
            if (sTemp.length() < 2) {
                sb.append(0);
            }
            sb.append(sTemp.toLowerCase());
        }
        return sb.toString();
    }


    public static void main(String[] args) {
        String a = "admin";
        System.out.println(getPassMD5(a));
        System.out.println("21232f297a57a5a743894a0e4a801fc3");
    }
}
```

## bcrypt  
```java

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.apache.commons.lang3.RandomUtils;


/**
 * 同一个字符串，每次encode的结果都不一样，需要使用checkPassword验证面面正确性.
 */
public class PasswordEncoder {

  public static final Integer OPENSERVICE_PASSWORD_LENGTH = 8;

  public static final Integer OPS_PASSWORD_LENGTH = 6;

  public static final Character[] PASSWORD_SCOPE =
      {'0', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J',
          'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c',
          'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
          'y', 'z'};

  public static final Character[] ONLY_DIGITAL_PASSWORD_SCOPE =
      {'0', '2', '3', '4', '5', '6', '7', '8', '9'};


  public static String encode(String rawPassword) {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    return encoder.encode(rawPassword);
  }

  public static boolean checkPassword(String password, String encodedPassword) {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    return encoder.matches(password, encodedPassword);
  }


  /**
   * 得到包含大小写字母，随机数字的密码
   *
   * @param length 密码长度
   * @return
   */
  public static String getRandomPassword(Integer length) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < length; i++) {
      int coordinate = RandomUtils.nextInt(0, ONLY_DIGITAL_PASSWORD_SCOPE.length);
      sb.append(ONLY_DIGITAL_PASSWORD_SCOPE[coordinate]);
    }
    return sb.toString();
  }

}
```
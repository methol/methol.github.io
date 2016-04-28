title: "java MD5加密"
date: 2015-05-26 04:30:54
tags: [java]
---
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
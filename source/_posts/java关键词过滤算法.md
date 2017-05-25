title: "java关键词过滤算法"
date: 2015-01-06 22:47:00
tags: [Java]
---
```java
/**
 * java关键字过滤
 * HashMap实现DFA算法
 * 关键词替换为*
 * @author Methol
 */

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SuppressWarnings({ "rawtypes", "unchecked" })
public class KeywordFilter {
  /** 直接禁止的 */
  private HashMap keysMap = new HashMap();
  static final String tihuantxt = "**********************************************************";
  private int matchType = 1; // 1:最小长度匹配 2：最大长度匹配

  public void addKeywords(List<String> keywords) {
    for (int i = 0; i < keywords.size(); i++) {
      String key = keywords.get(i).trim();
      HashMap nowhash = null;
      nowhash = keysMap;
      for (int j = 0; j < key.length(); j++) {
        char word = key.charAt(j);
        Object wordMap = nowhash.get(word);
        if (wordMap != null) {
          nowhash = (HashMap) wordMap;
        } else {
          HashMap<String, String> newWordHash = new HashMap<String, String>();
          newWordHash.put("isEnd", "0");
          nowhash.put(word, newWordHash);
          nowhash = newWordHash;
        }
        if (j == key.length() - 1) {
          nowhash.put("isEnd", "1");
        }
      }
    }
  }

  /**
   * 重置关键词
   */
  public void clearKeywords() {
    keysMap.clear();
  }

  /**
   * 检查一个字符串从begin位置起开始是否有keyword符合， 如果有符合的keyword值，返回值为匹配keyword的长度，否则返回零
   * flag 1:最小长度匹配 2：最大长度匹配
   */
  private int checkKeyWords(String txt, int begin, int flag) {
    HashMap nowhash = null;
    nowhash = keysMap;
    int maxMatchRes = 0;
    int res = 0;
    int l = txt.length();
    char word = 0;
    for (int i = begin; i < l; i++) {
      word = txt.charAt(i);
      Object wordMap = nowhash.get(word);
      if (wordMap != null) {
        res++;
        nowhash = (HashMap) wordMap;
        if (((String) nowhash.get("isEnd")).equals("1")) {
          if (flag == 1) {
            wordMap = null;
            nowhash = null;
            txt = null;
            return res;
          } else {
            maxMatchRes = res;
          }
        }
      } else {
        txt = null;
        nowhash = null;
        return maxMatchRes;
      }
    }
    txt = null;
    nowhash = null;
    return maxMatchRes;
  }

  /**
   * 返回txt中关键字的列表
   */
  public String getTxtKeyWords(String txt) {
    Set set = new HashSet();
    int l = txt.length();
    String newtxt = new String();
    for (int i = 0; i < l;) {
      int len = checkKeyWords(txt, i, matchType);
      if (len > 0) {
        newtxt += txt.substring(0, i);
        newtxt += tihuantxt.substring(0, len);
        newtxt += txt.substring(i + len, txt.length());
        txt = newtxt;
        newtxt = "";
        i += len;
      } else {
        i++;
      }
    }
    return txt;
  }

  /**
   * 仅判断txt中是否有关键字
   */
  public boolean isContentKeyWords(String txt) {
    for (int i = 0; i < txt.length(); i++) {
      int len = checkKeyWords(txt, i, 1);
      if (len > 0) {
        return true;
      }
    }
    txt = null;
    return false;
  }

  public int getMatchType() {
    return matchType;
  }

  public void setMatchType(int matchType) {
    this.matchType = matchType;
  }
}
```
  
	   

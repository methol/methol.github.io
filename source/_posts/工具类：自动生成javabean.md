title: "工具类：自动生成javabean"
date: 2015-07-15 01:39:26
tags: [java, 工具类]
---

## 通用
```java

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

/**
 * 数据库表转换成javaBean对象小工具
 * 1 bean属性按原始数据库字段经过去掉下划线,并大写处理首字母等等.
 * 2 生成的bean带了数据库的字段说明.
 * 3 各位自己可以修改此工具用到项目中去.
 * 需要自己修改connection的连接
 * 在main函数中传入table name
 */
public class MyEntityUtils {
    private String tablename = "";
    private String[] colnames;
    private String[] colTypes;
    private int[] colSizes; // 列名大小
    private int[] colScale; // 列名小数精度
    private boolean importUtil = false;
    private boolean importSql = false;
    private boolean importMath = false;

    /**
     * @param args
     */
    public static void main(String[] args) {
        MyEntityUtils t = new MyEntityUtils();
        t.tableToEntity("imginfo");  //这里传入table  name
    }

    public Connection getConnection() {
        String driver = "com.mysql.jdbc.Driver";
        String url = "jdbc:mysql://127.0.0.1:3306/jwt";
        String username = "root";
        String password = "tuzhihao";
        Connection con = null;
        try {
            Class.forName(driver);
            con = DriverManager.getConnection(url, username, password);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return con;
    }

    /**
     * @param tName 各位按自己的
     */
    public void tableToEntity(String tName) {
        tablename = tName;
        //数据连Connection获取,自己想办法就行.
        Connection conn = getConnection();
        String strsql = "SELECT * FROM " + tablename;//+" WHERE ROWNUM=1" 读一行记录;
        try {
            System.out.println(strsql);
            PreparedStatement pstmt = conn.prepareStatement(strsql);
            pstmt.executeQuery();
            ResultSetMetaData rsmd = pstmt.getMetaData();
            int size = rsmd.getColumnCount(); // 共有多少列
            colnames = new String[size];
            colTypes = new String[size];
            colSizes = new int[size];
            colScale = new int[size];
            for (int i = 0; i < rsmd.getColumnCount(); i++) {
                rsmd.getCatalogName(i + 1);
                colnames[i] = rsmd.getColumnName(i + 1).toLowerCase();
                colTypes[i] = rsmd.getColumnTypeName(i + 1).toLowerCase();
                colScale[i] = rsmd.getScale(i + 1);
                System.out.println(rsmd.getCatalogName(i + 1));
                if ("datetime".equals(colTypes[i])) {
                    importUtil = true;
                }
                if ("image".equals(colTypes[i]) || "text".equals(colTypes[i])) {
                    importSql = true;
                }
                if (colScale[i] > 0) {
                    importMath = true;
                }
                colSizes[i] = rsmd.getPrecision(i + 1);
            }
            String content = parse(colnames, colTypes, colSizes);
            try {
                FileWriter fw = new FileWriter(initcap(tablename) + ".java");
                PrintWriter pw = new PrintWriter(fw);
                pw.println(content);
                pw.flush();
                pw.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 解析处理(生成实体类主体代码)
     */
    private String parse(String[] colNames, String[] colTypes, int[] colSizes) {
        StringBuffer sb = new StringBuffer();
        sb.append("\r\nimport java.io.Serializable;\r\n");
        if (importUtil) {
            sb.append("import java.util.Date;\r\n");
        }
        if (importSql) {
            sb.append("import java.sql.*;\r\n\r\n");
        }
        if (importMath) {
            sb.append("import java.math.*;\r\n\r\n");
        }
        //表注释
        processColnames(sb);
        sb.append("public class " + initcap(tablename) + " implements Serializable {\r\n");
        processAllAttrs(sb);
        processAllMethod(sb);
        sb.append("}\r\n");
        System.out.println(sb.toString());
        return sb.toString();

    }

    /**
     * 处理列名,把空格下划线'_'去掉,同时把下划线后的首字母大写
     * 要是整个列在3个字符及以内,则去掉'_'后,不把"_"后首字母大写.
     * 同时把数据库列名,列类型写到注释中以便查看,
     *
     * @param sb
     */
    private void processColnames(StringBuffer sb) {
        sb.append("\r\n/** " + tablename + "\r\n");
        String colsiz = "";
        String colsca = "";
        for (int i = 0; i < colnames.length; i++) {
            colsiz = colSizes[i] <= 0 ? "" : (colScale[i] <= 0 ? "(" + colSizes[i] + ")" : "(" + colSizes[i] + "," + colScale[i] + ")");
            sb.append("\t" + colnames[i].toUpperCase() + "	" + colTypes[i].toUpperCase() + colsiz + "\r\n");
            char[] ch = colnames[i].toCharArray();
            char c = 'a';
            if (ch.length > 3) {
                for (int j = 0; j < ch.length; j++) {
                    c = ch[j];
                    if (c == '_') {
                        if (ch[j + 1] >= 'a' && ch[j + 1] <= 'z') {
                            ch[j + 1] = (char) (ch[j + 1] - 32);
                        }
                    }
                }
            }
            String str = new String(ch);
            colnames[i] = str.replaceAll("_", "");
        }
        sb.append("*/\r\n");
    }

    /**
     * 生成所有的方法
     *
     * @param sb
     */
    private void processAllMethod(StringBuffer sb) {
        for (int i = 0; i < colnames.length; i++) {
            sb.append("\tpublic void set" + initcap(colnames[i]) + "("
                    + oracleSqlType2JavaType(colTypes[i], colScale[i], colSizes[i]) + " " + colnames[i]
                    + "){\r\n");
            sb.append("\t\tthis." + colnames[i] + "=" + colnames[i] + ";\r\n");
            sb.append("\t}\r\n");

            sb.append("\tpublic " + oracleSqlType2JavaType(colTypes[i], colScale[i], colSizes[i]) + " get"
                    + initcap(colnames[i]) + "(){\r\n");
            sb.append("\t\treturn " + colnames[i] + ";\r\n");
            sb.append("\t}\r\n");
        }
    }

    /**
     * 解析输出属性
     *
     * @return
     */
    private void processAllAttrs(StringBuffer sb) {
        sb.append("\tprivate static final long serialVersionUID = 1L;\r\n");
        for (int i = 0; i < colnames.length; i++) {
            sb.append("\tprivate " + oracleSqlType2JavaType(colTypes[i], colScale[i], colSizes[i]) + " "
                    + colnames[i] + ";\r\n");
        }
        sb.append("\r\n");
    }

    /**
     * 把输入字符串的首字母改成大写
     *
     * @param str
     * @return
     */
    private String initcap(String str) {
        char[] ch = str.toCharArray();
        if (ch[0] >= 'a' && ch[0] <= 'z') {
            ch[0] = (char) (ch[0] - 32);
        }
        return new String(ch);
    }

    /**
     * Oracle
     *
     * @param sqlType
     * @param scale
     * @return
     */
    private String oracleSqlType2JavaType(String sqlType, int scale, int size) {
        if (sqlType.equals("integer")) {
            return "Integer";
        } else if (sqlType.equals("long")) {
            return "Long";
        } else if (sqlType.equals("float")
                || sqlType.equals("float precision")
                || sqlType.equals("double")
                || sqlType.equals("double precision")
                ) {
            return "BigDecimal";
        } else if (sqlType.equals("number")
                || sqlType.equals("decimal")
                || sqlType.equals("numeric")
                || sqlType.equals("real")) {
            return scale == 0 ? (size < 10 ? "Integer" : "Long") : "BigDecimal";
        } else if (sqlType.equals("varchar")
                || sqlType.equals("varchar2")
                || sqlType.equals("char")
                || sqlType.equals("nvarchar")
                || sqlType.equals("nchar")) {
            return "String";
        } else if (sqlType.equals("datetime")
                || sqlType.equals("date")
                || sqlType.equals("timestamp")) {
            return "Date";
        }else if(sqlType.equals("int")){
            return "int";
        }
        return null;
    }

}

```

## 适合我们的项目
更改上面的工具类，优化了方法，写了适用自己项目的工具类。
```java
import javax.swing.filechooser.FileSystemView;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 使用时修改连接 url username password
 * 针对不同表获取，修改表名 TABLE_NAME
 */
public class DBEntityUtils {
  private static final String URL = "jdbc:mysql://localhost:3306/test?zeroDateTimeBehavior=convertToNull&useUnicode=true&characterEncoding=UTF8";
  private static final String USERNAME = "root";
  private static final String PASSWORD = "tuzhihao";
  private static final String DRIVER = "com.mysql.jdbc.Driver";

  private static final String TAB_SEPARATOR = "  ";  // 空格的表示方法
  private static final String LINE_SEPARATOR = "\r\n";  // 换行的表示方法

  // 每次运行，需要修改这个参数
  private static final String TABLE_NAME = "test";

  private static Connection getConnection = null;


  private static List<String> colNames = new ArrayList<String>();  // 列名
  private static List<String> colTypes = new ArrayList<String>();  // 列名类型
  private static List<String> remarks = new ArrayList<String>();  // 备注
  private static List<Integer> nullable = new ArrayList<Integer>();  // 是否允许为空 1=不允许为空 0=允许


  public static void main(String[] args) {
    setData();
    final String content = getEntity();
    string2File(content);
  }

  private static void string2File(String content) {
    try {
      FileWriter fw = new FileWriter(getClassName() + ".java");
      PrintWriter pw = new PrintWriter(fw);
      pw.println(content);
      pw.flush();
      pw.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private static void setData() {
    FileSystemView fsv = FileSystemView.getFileSystemView();
    getConnection = getConnections();
    try {
      DatabaseMetaData dbmd = getConnection.getMetaData();
      ResultSet resultSet = dbmd.getTables(null, "%", "%", new String[]{"TABLE"});
      while (resultSet.next()) {
        String tableName = resultSet.getString("TABLE_NAME");
        if (tableName.equals(TABLE_NAME)) {
          //ResultSet rs =getConnection.getMetaData().getColumns(null, getXMLConfig.getSchema(),tableName.toUpperCase(), "%");//其他数据库不需要这个方法的，直接传null，这个是oracle和db2这么用
          ResultSet rs = dbmd.getColumns(null, "%", tableName, "%");
          while (rs.next()) {
            colNames.add(rs.getString("COLUMN_NAME"));
            colTypes.add(rs.getString("TYPE_NAME"));
            remarks.add(rs.getString("REMARKS"));
            nullable.add(Integer.parseInt(rs.getString("NULLABLE")));
            System.out.println(
                rs.getString("COLUMN_NAME") + "\t\t\t\t" +
                    rs.getString("TYPE_NAME") + "\t\t\t\t" +
//                    rs.getString("COLUMN_SIZE") + "\t\t\t\t" +
//                    rs.getString("DECIMAL_DIGITS") + "\t\t\t\t" +
                    rs.getString("NULLABLE") + "\t\t\t\t" +
                    rs.getString("REMARKS") + "\t\t\t\t"
            );
          }
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public static Connection getConnections() {
    try {
      //Properties props =new Properties();
      //props.put("remarksReporting","true");
      Class.forName(DRIVER);
      getConnection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return getConnection;
  }

  ////其他数据库不需要这个方法 oracle和db2需要
  public static String getSchema() throws Exception {
    String schema;
    schema = getConnection.getMetaData().getUserName();
    if ((schema == null) || (schema.length() == 0)) {
      throw new Exception("ORACLE数据库模式不允许为空");
    }
    return schema.toUpperCase();

  }


  public static String getEntity() {
    StringBuilder sb = new StringBuilder();

    String importString = LINE_SEPARATOR +
        "import io.swagger.annotations.ApiModelProperty;" + LINE_SEPARATOR +
        "import javax.persistence.Column;" + LINE_SEPARATOR +
        "import javax.persistence.Entity;" + LINE_SEPARATOR +
        "import javax.persistence.GeneratedValue;" + LINE_SEPARATOR +
        "import javax.persistence.GenerationType;" + LINE_SEPARATOR +
        "import javax.persistence.Id;" + LINE_SEPARATOR +
        "import javax.persistence.Table;" + LINE_SEPARATOR +
        "import javax.persistence.Transient;" + LINE_SEPARATOR +
        "import java.math.BigDecimal;" + LINE_SEPARATOR +
        "import java.util.Date;" + LINE_SEPARATOR +
        "import java.io.Serializable;" + LINE_SEPARATOR +
        LINE_SEPARATOR;

    sb.append(importString);
    sb.append("public class " + getClassName() + " implements Serializable {" + LINE_SEPARATOR);
    sb.append(processAllAttrs());
    sb.append(processGetAndSetMethod());
    sb.append("}" + LINE_SEPARATOR);
    return sb.toString();
  }

  /**
   * 通过表名获取类名
   * 会自动去掉 t_的前缀 以第一个 _ 作为分隔符
   *
   * @return
   */
  public static String getClassName() {
    return underlineToCamel(TABLE_NAME.substring(TABLE_NAME.indexOf("_"), TABLE_NAME.length()));
  }

  /**
   * 解析输出属性
   *
   * @return
   */
  private static String processAllAttrs() {
    StringBuilder sb = new StringBuilder();
    sb.append(TAB_SEPARATOR + "private static final long serialVersionUID = 1L;\r\n");
    int size = colNames.size();
    for (int i = 0; i < size; i++) {

      String nullAble = "false";
      if (nullable.get(i) == 1) {
        nullAble = "true";
      }

      String columnAnnotation;

      if (colNames.get(i).equalsIgnoreCase("id")) {
        columnAnnotation = TAB_SEPARATOR + "@Id" + LINE_SEPARATOR +
            TAB_SEPARATOR + "@GeneratedValue(strategy = GenerationType.IDENTITY)" + LINE_SEPARATOR;
      } else {
        columnAnnotation =
            TAB_SEPARATOR + "@Column(name = \"" + colNames.get(i) + "\", nullable = " + nullAble +
                ")" + LINE_SEPARATOR;
      }

      String apiModelPropertyAnnotation =
          TAB_SEPARATOR + "@ApiModelProperty(value = \"" + remarks.get(i) +
              "\", dataType = \"" + mysqlSqlType2JavaType(colTypes.get(i)) + "\", required = " +
              nullAble + ")" + LINE_SEPARATOR;
      String attr = TAB_SEPARATOR +
          "private " + mysqlSqlType2JavaType(colTypes.get(i)) + " " +
          underlineToCamel(colNames.get(i)) + ";"
          + TAB_SEPARATOR + "//" + remarks.get(i) + LINE_SEPARATOR;
      sb.append(LINE_SEPARATOR);
      sb.append(columnAnnotation);
      sb.append(apiModelPropertyAnnotation);
      sb.append(attr);
    }
    sb.append(LINE_SEPARATOR);
    return sb.toString();
  }

  /**
   * 生成get set 方法
   */
  private static String processGetAndSetMethod() {
    int size = colNames.size();
    StringBuilder sb = new StringBuilder();
    sb.append(LINE_SEPARATOR);

    for (int i = 0; i < size; i++) {


      final String attrName = underlineToCamel(colNames.get(i));

      // set
      sb.append(TAB_SEPARATOR + "public void set" + upperFirstChar(attrName) + "(" +
          mysqlSqlType2JavaType(colTypes.get(i)) + " " + attrName + "){" + LINE_SEPARATOR);
      sb.append(TAB_SEPARATOR + TAB_SEPARATOR + "this." + attrName + "=" + attrName + ";" +
          LINE_SEPARATOR);
      sb.append(TAB_SEPARATOR + "}" + LINE_SEPARATOR + LINE_SEPARATOR);

      // get
      sb.append(TAB_SEPARATOR + "public " + mysqlSqlType2JavaType(colTypes.get(i)) + " get" +
          upperFirstChar(attrName) + "(){" + LINE_SEPARATOR);
      sb.append(TAB_SEPARATOR + TAB_SEPARATOR + "return " + attrName + ";" + LINE_SEPARATOR);
      sb.append("\t}" + LINE_SEPARATOR + LINE_SEPARATOR);
    }
    sb.append(LINE_SEPARATOR);
    return sb.toString();
  }

  /**
   * 把输入字符串的首字母改成大写
   *
   * @param str
   * @return
   */
  private static String upperFirstChar(String str) {
    char[] ch = str.toCharArray();
    if (ch[0] >= 'a' && ch[0] <= 'z') {
      ch[0] = (char) (ch[0] - 32);
    }
    return new String(ch);
  }

  /**
   * mysql <-> java 类型转换工具类
   *
   * @param sqlType mysql的字段类型
   * @return
   */
  private static String mysqlSqlType2JavaType(String sqlType) {

    if (sqlType.equalsIgnoreCase("BIGINT")) {
      return "Long";
    }
    if (sqlType.equalsIgnoreCase("INT")) {
      return "Integer";
    }
    if (sqlType.equalsIgnoreCase("VARCHAR")) {
      return "String";
    }
    if (sqlType.equalsIgnoreCase("TEXT")) {
      return "String";
    }
    if (sqlType.equalsIgnoreCase("DECIMAL")) {
      return "BigDecimal";
    }
    if (sqlType.equalsIgnoreCase("DOUBLE")) {
      return "BigDecimal";
    }
    if (sqlType.equalsIgnoreCase("FLOAT")) {
      return "BigDecimal";
    }
    if (sqlType.equalsIgnoreCase("TIMESTAMP")) {
      return "Date";
    }
    if (sqlType.equalsIgnoreCase("DATETIME")) {
      return "Date";
    }
    if (sqlType.equalsIgnoreCase("DATE")) {
      return "Date";
    }
    return null;
  }

  public static String underlineToCamel(String param) {
    if (param == null || "".equals(param.trim())) {
      return "";
    }
    StringBuilder sb = new StringBuilder(param);
    Matcher mc = Pattern.compile("_").matcher(param);
    int i = 0;
    while (mc.find()) {
      int position = mc.end() - (i++);
      //String.valueOf(Character.toUpperCase(sb.charAt(position)));
      sb.replace(position - 1, position + 1, sb.substring(position, position + 1).toUpperCase());
    }
    return sb.toString();
  }
}

/*

TABLE_CAT String => 表类别（可为null）

TABLE_SCHEM String => 表模式（可为null）

TABLE_NAME String => 表名称

COLUMN_NAME String => 列名称

DATA_TYPE int => 来自 java.sql.Types 的 SQL 类型

TYPE_NAME String => 数据源依赖的类型名称，对于 UDT，该类型名称是完全限定的

COLUMN_SIZE int => 列的大小。

BUFFER_LENGTH 未被使用。

DECIMAL_DIGITS int => 小数部分的位数。对于 DECIMAL_DIGITS 不适用的数据类型，则返回 Null。

NUM_PREC_RADIX int => 基数（通常为 10 或 2）

NULLABLE int => 是否允许使用 NULL。

columnNoNulls - 可能不允许使用NULL值

columnNullable - 明确允许使用NULL值

columnNullableUnknown - 不知道是否可使用 null

REMARKS String => 描述列的注释（可为null）

COLUMN_DEF String => 该列的默认值，当值在单引号内时应被解释为一个字符串（可为null）

SQL_DATA_TYPE int => 未使用

SQL_DATETIME_SUB int => 未使用

CHAR_OCTET_LENGTH int => 对于 char 类型，该长度是列中的最大字节数

ORDINAL_POSITION int => 表中的列的索引（从 1 开始）

IS_NULLABLE String => ISO 规则用于确定列是否包括 null。
YES --- 如果参数可以包括 NULL
NO --- 如果参数不可以包括 NULL
空字符串 --- 如果不知道参数是否可以包括 null

SCOPE_CATLOG String => 表的类别，它是引用属性的作用域（如果 DATA_TYPE 不是 REF，则为null）

SCOPE_SCHEMA String => 表的模式，它是引用属性的作用域（如果 DATA_TYPE 不是 REF，则为null）

SCOPE_TABLE String => 表名称，它是引用属性的作用域（如果 DATA_TYPE 不是 REF，则为null）

SOURCE_DATA_TYPE short => 不同类型或用户生成 Ref 类型、来自 java.sql.Types 的 SQL 类型的源类型（如果 DATA_TYPE 不是 DISTINCT 或用户生成的 REF，则为null）

IS_AUTOINCREMENT String => 指示此列是否自动增加
YES --- 如果该列自动增加
NO --- 如果该列不自动增加
空字符串 --- 如果不能确定该列是否是自动增加参数

 */
```
title: "java socket 传送文件"
date: 2015-05-18 11:40:07
tags: [java]
---
java socket 传送文件

---
### 版本一：
**只能传文件，服务器会自动命名。**<br />
server
```java

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * Created by Methol on 2015/5/17.
 * 服务器接受文件,先接收文件名,在接收文件
 */
public class FileServer {
    public static void main(String[] args) {
        try {
            ServerSocket ss = new ServerSocket(9999);   //开启一个服务器，监听端口9999
            System.out.println("服务器开启，等待客户端连接...");
            while (true) {
                Socket s = ss.accept();   //开始监听
                new Filetask(s).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}

class Filetask extends Thread {

    private InputStream is;
    private Socket s;

    public Filetask(Socket s) {
        this.s = s;
        try {
            this.is = s.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void run() {
        try {
            FileOutputStream fos = new FileOutputStream("D:\\wepull\\ServerReceive\\" + System.currentTimeMillis()+"1.rar");
            byte[] buf = new byte[1024];
            int len = 0;
            while ((len = is.read(buf)) != -1) {   //从网络中获取数据
                fos.write(buf, 0, len);  //写入本地文件中
            }
            System.out.println("已经成功接收来自"+s.getInetAddress()+"的文件");
            fos.flush();
            fos.close();
            is.close();
            s.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
```
client
```java

import java.io.*;
import java.net.Socket;
import java.util.Scanner;

/**
 * Created by Methol on 2015/5/17.
 * 客户端，从控制台输入文件路径和文件名
 * 先发送文件名到服务器，再发送文件内容到服务器
 */
public class FileClient {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String f = sc.nextLine();
        File file = new File(f);
        if (file.exists()) {  //如果文件存在，连接服务器，发送文件
            try {
                Socket s = new Socket("127.0.0.1", 9999);
                OutputStream os = s.getOutputStream();
                FileInputStream fis = new FileInputStream(file);  //获取文件写入流，从硬盘写入内存，发送给服务器
                byte[] buf = new byte[1024];
                int len = 0;
                //向服务器发文件
                while ((len = fis.read(buf)) != -1) {  //从硬盘中获取数据，写入内存
                    os.write(buf, 0, len);  //写入到网络，发送数据到服务器
                }
                os.flush();
                fis.close();
                os.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("文件不存在！");
        }
    }
}

```

---
### 版本二：
**客户端发送文件名和文件大小，服务器会设置客户端发来的文件名，并检测文件传输的完整性。**<br />
server
```java

import java.io.*;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Methol on 2015/5/17.
 * 服务器分两个端口
 * 一个用来接收文件名等文件相关信息(30001)
 * 一个用来接收文件数据(30002)
 */
public class FServer {

    private static Map<InetAddress,File> ip_file_map = new HashMap<InetAddress, File>();  
    private static Map<InetAddress,Long> ip_file_length_map = new HashMap<InetAddress, Long>();

    public static void main(String[] args) {
        try {
            ServerSocket fss = new ServerSocket(30001);
            ServerSocket dss = new ServerSocket(30002);
            System.out.println("服务器开启，等待客户端连接...");
            while (true) {
                Socket fs = fss.accept();   //开始监听
                Socket ds = dss.accept();   //开始监听
                new FileTask(fs).start();
                new DataTask(ds).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static class FileTask extends Thread {
        private File file;
        private Socket fs;
        private BufferedReader br;

        public FileTask(Socket fs) {
            try {
                this.fs = fs;
                br = new BufferedReader(new InputStreamReader(fs.getInputStream()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void run() {
            try {
                String filename = br.readLine();  //从客户端获取文件名
                file = new File("D:\\wepull\\ServerReceive\\" + filename);
                ip_file_map.put(fs.getInetAddress(),file);
                long length = Long.parseLong(br.readLine());  //从客户端获取文件大小
                ip_file_length_map.put(fs.getInetAddress(),length);
                br.close();
                fs.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static class DataTask extends Thread {

        private InputStream is;
        private Socket ds;

        public DataTask(Socket s) {
            this.ds = s;
            try {
                this.is = ds.getInputStream();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void run() {
            try {
                InetAddress inetAddress = ds.getInetAddress();
                File file = ip_file_map.get(inetAddress);
                FileOutputStream fos = new FileOutputStream(file);
                byte[] buf = new byte[1024];
                int len = 0;
                while ((len = is.read(buf)) != -1) {   //从网络中获取数据
                    fos.write(buf, 0, len);  //写入本地文件中
                }
                System.out.println("已经成功接收来自" + ds.getInetAddress() + "的文件，文件名："+file.getName());
                fos.flush();
                fos.close();
                is.close();
                ds.close();
                //判断文件接收是不是完整的
                if(ip_file_length_map.get(inetAddress).equals(file.length())){
                    System.out.println("文件接收正确！");
                }else{
                    System.out.println("文件接收不完整！");
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}

```
client
```java

import java.io.*;
import java.net.Socket;
import java.util.Scanner;

/**
 * Created by Methol on 2015/5/17.
 * 客户端，从控制台输入文件路径和文件名
 * 1.连接发送字符的30001端口，发送文件名、文件大小到服务器
 * 2.连接发送数据的30002端口，发送文件内容到服务器
 */
public class FClient {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String f = sc.nextLine();
        File file = new File(f);
        if (file.exists()) {  //如果文件存在，连接服务器，发送文件
            try {
                //建立连接，发送文件名
                Socket fs = new Socket("127.0.0.1", 30001);
                PrintStream ps = new PrintStream(fs.getOutputStream());  //获取输出流，为了向服务器发送数据
                ps.println(file.getName());  //向服务器发送文件名
                ps.println(file.length());
                ps.flush();
                ps.close();

                //建立连接，发送文件
                Socket ds = new Socket("127.0.0.1",30002);
                OutputStream os = ds.getOutputStream();
                FileInputStream fis = new FileInputStream(file);  //获取文件写入流，从硬盘写入内存，发送给服务器
                byte[] buf = new byte[1024];
                int len = 0;
                //向服务器发文件
                while ((len = fis.read(buf)) != -1) {  //从硬盘中获取数据，写入内存
                    os.write(buf, 0, len);  //写入到网络，发送数据到服务器
                }
                os.flush();
                fis.close();
                os.close();

            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("文件不存在！");
        }


    }
}

```
title: "Struts2中的ModelDriven机制及其运用"
date: 2015-04-22 05:50:00
tags: [java web]
---
所谓ModelDriven，意思是直接把实体类当成页面数据的收集对象。比如，有实体类User如下(通过hibernate逆向工程生成)：
``` java
	package com.methol.vo;

	import javax.persistence.Basic;
	import javax.persistence.Column;
	import javax.persistence.Entity;
	import javax.persistence.Id;

	/**
	 * Created by Methol on 2015/4/15.
	 */
	@Entity
	public class User {
		private int id;
		private String name;
		private String password;
		private String email;
		private String phone;

		@Id
		@Column(name = "id", nullable = false, insertable = true, updatable = true)
		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		@Basic
		@Column(name = "name", nullable = false, insertable = true, updatable = true, length = 30)
		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		@Basic
		@Column(name = "password", nullable = false, insertable = true, updatable = true, length = 30)
		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		@Basic
		@Column(name = "email", nullable = true, insertable = true, updatable = true, length = 50)
		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		@Basic
		@Column(name = "phone", nullable = true, insertable = true, updatable = true, length = 50)
		public String getPhone() {
			return phone;
		}

		public void setPhone(String phone) {
			this.phone = phone;
		}

		@Override
		public boolean equals(Object o) {
			if (this == o) return true;
			if (o == null || getClass() != o.getClass()) return false;

			User user = (User) o;

			if (id != user.id) return false;
			if (email != null ? !email.equals(user.email) : user.email != null) return false;
			if (name != null ? !name.equals(user.name) : user.name != null) return false;
			if (password != null ? !password.equals(user.password) : user.password != null) return false;
			if (phone != null ? !phone.equals(user.phone) : user.phone != null) return false;

			return true;
		}

		@Override
		public int hashCode() {
			int result = id;
			result = 31 * result + (name != null ? name.hashCode() : 0);
			result = 31 * result + (password != null ? password.hashCode() : 0);
			result = 31 * result + (email != null ? email.hashCode() : 0);
			result = 31 * result + (phone != null ? phone.hashCode() : 0);
			return result;
		}
	}
```
---
在一个登陆页面，我需要获取表单中的用户名和密码，以前都是一个一个写对应的属性，写get、set方法，获取表单中的值，但是通过ModelDriven可以自动帮我构建user这个类的对象。

action这样写：
``` java
	package com.methol.action;

	import com.methol.service.UserService;
	import com.methol.vo.User;
	import com.opensymphony.xwork2.ModelDriven;
	import org.apache.struts2.interceptor.SessionAware;

	/**
	 * Created by Methol on 2015/4/15.
	 * 处理用户登陆action
	 * 接受参数：用户名name,密码password
	 * 成功返回success，失败返回input
	 */
	public class UserLogin extends BaseAction implements ModelDriven<User> {
		//通过实现ModelDriven接口，可以自动构建user这个类，减少参数的书写，详见：http://blog.csdn.net/li_tengfei/article/details/6098145
		private UserService userService;
		private String message;  //消息
		private User user;
		public UserService getUserService() {
			return userService;
		}
		public void setUserService(UserService userService) {
			this.userService = userService;
		}
		@Override
		public User getModel() {
			if(user == null){
				user = new User();
			}
			return user;
		}

		public User getUser() {
			return user;
		}

		public void setUser(User user) {
			this.user = user;
		}

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}


		public String execute(){
			if(  "".equals(user.getName()) || "".equals(user.getPassword()) ) { //没有读取到参数
				message = "参数输入不完整！";
				return INPUT;
			} else if(userService.login(user)){
				this.session.put("username",user.getName());  //把username添加到session中
				return SUCCESS;
			}
			return INPUT;
		}

	}
```

---
jsp页面（和之前的代码是一样的）：
``` jsp
	<%--
	  Created by IntelliJ IDEA.
	  User: Methol
	  Date: 2015/4/21
	  Time: 17:30
	  To change this template use File | Settings | File Templates.
	--%>
	<%@ page contentType="text/html;charset=UTF-8" language="java" %>
	<%@ taglib prefix="s" uri="/struts-tags"%>
	<html>
	<head>
		<title>用户登陆</title>
	</head>
	<body>
		<form name="loginfrom" action="/users/login.action" method="post">
			用户名：<input name="name" /> <br />
			密码  ：<input name="password" type="password" /> <br />
			<input type="submit" value="提交"> <s:property value="message" />
		</form>
	</body>
	</html>
``` 

---

参见http://blog.csdn.net/li_tengfei/article/details/6098145

title: "Hibernate中Session.load与Session.get的区别"
date: 2015-04-22 06:50:00
tags: [Java web]
---
`Session.load()/get()`方法均可以根据指定的实体类和id从数据库读取记录，并返回与之对应的实体对象。

其区别在于：<br />
如果未能发现符合条件的记录，get方法返回null，而load方法会抛出一个ObjectNotFoundException。
Load方法可返回实体的代理类实例，而get方法永远直接返回实体类。
load方法可以充分利用内部缓存和二级缓存中的现有数据，而get方法则仅仅在内部缓存中进行数据查找，如没有发现对应数据，将越过二级缓存，直接调用SQL完成数据读取。

上面是看别人写的，我自己觉得<br />
**get()主要用于数据库有可能存在，也有可能不存在的时候，需要从数据库取出数据的时候。
load()主要用于可以肯定数据库中有这一条记录的时候，从数据库中去除这条数据。**

下面两个例子，第一个是通过订单号得到订单这个实体类对象，第二个是通过订单号，从数据库中删除这条数据。
  
```java
//通过订单号得到订单这个实体类对象，不能肯定这个订单是不是在数据库中存在
public Order getOrder(int orderid) {
  Session session = sessionFactory.getCurrentSession();
  Order order = null;
  try {
    order = (Order) session.get(Order.class, orderid);
  } catch (RuntimeException e) {
    throw e;
  }
  return order;
}
```
  
---
  
```java
	//通过订单号，从数据库中删除这条数据，可以肯定数据库中有这一条数据
	public int deleteOrder(int orderId) {
		Session session = sessionFactory.getCurrentSession();
		try {
			Order order = (Order) session.load(Order.class, orderId);
			session.delete(order);
		} catch (Exception e) {
			return -1;
		}
		return 0;
	}	
```
参见http://blog.csdn.net/zhaoshl_368/article/details/6577103

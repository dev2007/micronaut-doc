---
sidebar_position: 60
---

# 6. 注解

Micronaut MicroStream 提供了以下方法注解。它们简化了在关联的存储管理器中存储对象的过程。

这些注解封装了装饰方法，以确保线程隔离。

|||
|--|--|
|@StoreParams|它存储在注解值中指定的方法参数。|
|@StoreReturn|它存储方法返回。|
|@StoreRoot|它存储根对象。|
|@Store|Micronaut MicroStream 将其他注解映射到此注解。你将不会直接使用此注解。|

如果使用多个 MicroStream 实例，可以为注解提供名称限定符，以指定正在使用的实例。

此外，你可以通过注解指定 [StoringStrategy](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/api/io/micronaut/microstream/annotations/StoringStrategy.html)。默认情况下，`LAZY` 是默认存储模式。

> [英文链接](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/guide/index.html#annotations)

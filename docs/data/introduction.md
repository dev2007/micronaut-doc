---
sidebar_position: 10
---

# 1. 简介

Micronaut Data 是一个数据库访问工具包，它使用超前编译（AoT）来预先计算存储库接口的查询，然后由一个薄型、轻量级的运行时层来执行。

Micronaut Data 受到 [GORM](https://gorm.grails.org/) 和 [Spring Data](https://spring.io/projects/spring-data) 的启发，但在以下方面对这些解决方案进行了改进：

- **无运行时模型** -- GORM 和 Spring Data 都维护一个运行时元模型，使用反射来模拟实体之间的关系。该模型会消耗大量内存，而且随着应用程序规模的扩大，内存需求也会增加。当与维护自己元模型的 Hibernate 结合使用时，问题会更加严重，因为最终会出现重复的元模型。
- **没有查询翻译** -- GORM 和 Spring Data 都使用正则表达式和模式匹配，结合运行时生成的代理，在运行时将 Java 接口上的方法定义翻译成查询。Micronaut Data 中不存在这种运行时翻译，这项工作由 Micronaut 编译器在编译时完成。
- **没有反射或运行时代理** -- Micronaut Data 不使用反射或运行时代理，因此性能更好，堆栈跟踪更小，由于完全没有反射缓存而减少了内存消耗（注意，后备实现，例如 Hibernate，可能使用反射）。
- **类型安全** -- Micronaut Data 将在编译时主动检查存储库方法是否可以实现，如果不能，则编译失败。

Micronaut Data 提供了一个通用的 API，用于在编译时将编译时的查询模型转换为查询，并为以下后端提供运行时支持：

- [JPA (Hibernate)](/data/hibernate) 和 [Hibernate Reactive](/data/hibernateReactive)
- [SQL (JDBC, R2DBC)](/data/dbc)
- [MongoDB](/data/mongo)
- [Azure Cosmos](/data/azureCosmos)

未来还计划进一步实现其他数据库。

下面的章节将带您了解查询和使用 Micronaut Data 的基础知识，如果您想更详细地了解 [Micronaut Data 如何工作](/data/howItWorks)，请查看 Micronaut Data 如何工作部分。

不过，从根本上来说，Micronaut Data 的工作可以用以下片段来概括。给定以下接口：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.context.annotation.Parameter;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.annotation.QueryHint;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.Slice;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;

@Repository // (1)
interface BookRepository extends CrudRepository<Book, Long> { // (2)
    Book find(String title);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example;

import io.micronaut.context.annotation.Parameter;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.annotation.QueryHint;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.Slice;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;

@Repository // (1)
interface BookRepository extends CrudRepository<Book, Long> { // (2)
    Book find(String title);
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.context.annotation.Executable
import io.micronaut.context.annotation.Parameter
import io.micronaut.data.annotation.*
import io.micronaut.data.model.*
import io.micronaut.data.repository.CrudRepository

@Repository // (1)
interface BookRepository : CrudRepository<Book, Long> { // (2)
    @Executable
    fun find(title: String): Book
}
```

  </TabItem>
</Tabs>

1. `@Repository` 注解将 `BookRepository` 指定为数据仓库。由于它是一个接口，`@Repository` 注解在编译时提供了实现。
2. 通过扩展 [CrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/CrudRepository.html)，可以自动生成 CRUD（创建、读取、更新、删除）操作。

Micronaut Data 会在编译时自动计算查找方法的查询，并在运行时通过注解元数据提供：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Inject
BeanContext beanContext;

@Test
void testAnnotationMetadata() {
    String query = beanContext.getBeanDefinition(BookRepository.class) // (1)
            .getRequiredMethod("find", String.class) // (2)
            .getAnnotationMetadata().stringValue(Query.class) // (3)
            .orElse(null);

    assertEquals( // (4)
            "SELECT book_ FROM example.Book AS book_ WHERE (book_.title = :p1)", query);

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Inject
BeanContext beanContext

void "test annotation metadata"() {
    given:"The value of the Query annotation"
    String query = beanContext.getBeanDefinition(BookRepository.class) // (1)
            .getRequiredMethod("find", String.class) // (2)
            .getAnnotationMetadata()
            .stringValue(Query.class) // (3)
            .orElse(null)

    expect:"The JPA-QL query to be correct" // (4)
    query == "SELECT book_ FROM example.Book AS book_ WHERE (book_.title = :p1)"
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Inject
lateinit var beanContext: BeanContext

@Test
fun testAnnotationMetadata() {
    val query = beanContext.getBeanDefinition(BookRepository::class.java) // (1)
            .getRequiredMethod<Any>("find", String::class.java) // (2)
            .annotationMetadata
            .stringValue(Query::class.java) // (3)
            .orElse(null)


    assertEquals( // (4)
            "SELECT book_ FROM example.Book AS book_ WHERE (book_.title = :p1)",
            query
    )

}
```

  </TabItem>
</Tabs>

1. 从 [BeanContext](https://docs.micronaut.io/latest/api/io/micronaut/context/BeanContext.html) 获取 [BeanDefinition](https://docs.micronaut.io/latest/api/io/micronaut/inject/BeanDefinition.html)
2. 检索 `find` 方法
3. 检索 [@Query](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Query.html) 注解的值
4. 方法的 JPA-QL 查询是正确的

## 1.1 新特性

**Micronaut Data 4.0**

- [Hibernate 6](https://hibernate.org/orm/documentation/6.0/)
- [Hibernate Reactive 2](https://hibernate.org/reactive/releases/2.0/)（兼容 Hibernate 6）
- 事务和连接管理的新实现
- JPA 仓库 `merge` 方法
- 支持 Oracle JSON-Relational 双重视图

**Micronaut Data 3.5**

- Hibernate Reactive
- 类型安全的 Java 标准
- 类型安全的 Kotlin 标准和构建器
- 改进的事务处理

**Micronaut Data 3.4**

- 支持分页的新异步、反应和 coroutines 资源库
- 在 Kotlin 的 coroutines 中传播同步事务状态
- R2DBC 已升级至 `1.0.0.RELEASE`。

**Micronaut Data 3.3**

- 支持 [MongoDB 仓库](https://micronaut-projects.github.io/micronaut-data/latest/guide/#mongo)
- R2DBC 升级至 Arabba-SR12 和 OracleDB R2DBC 0.4.0
- 在 Kotlin 的例程中传播 JDBC 事务上下文

**Micronaut Data 3.2**

- 用于 Micronaut JDBC/R2DBC 的具有 JPA 标准 API 规范的仓库

**Micronaut Data 3.1**

- 支持 Kotlin 的例程。新的仓库接口 `CoroutineCrudRepository`
- 支持 [`AttributeConverter`](/data/dbc#67-使用属性转换器)
- R2DBC 升级至 `Arabba-SR11`

**Micronaut Data 3.0**

- Micronaut 3.0
- 优化 Hibernate

**Micronaut Data 2.5.0**

- 库现在支持批量插入/更新/删除，即使使用自定义查询也是如此
- 重写的实体映射器允许对 JDBC/R2DBC 实体进行更复杂的映射
- 支持 `@JoinTable` 和 `@JoinColumn` 注解

**Micronaut Data 2.4.0**

- 完全支持不可变实体。您可以使用 Java 16 记录或 Kotlin 不可变数据类
- 集成了对 R2DBC 的支持，现在 `data-r2dbc` 模块是数据项目的一部分，与 JDBC 共享相同的代码
- JDBC/R2DBC 的优化锁定

## 1.2 重大变更

本节记录 Micronaut 版本之间的重大变更。

### 4.0.0

**仓库验证**

默认仓库接口不再有验证实体和 ID 的 Jakarta 验证注解。要添加验证，请使用 Jakarta 验证注解注解仓库的通用类型参数：

```java
@Repository
public interface BookRepository implements CrudRepository<@jakarta.validation.Valid Book, @jakarta.validation.constraints.NotNull Long> {
}
```

**仓库现在返回 `List`**

查找所有返回类型改为 `List`，而不是 `Iterable`

**Hibernate 事务管理器**

Hibernate 事务管理器的签名已更改为包含 `org.hibernate.Session` 而不是数据源连接：

```java
@Inject
public TransactionOperations<org.hibernate.Session> hibernateTransactionOperations;
```

**事务管理器**

Micronaut 4 重写了事务传播和管理。它取代了之前从 Spring Framework 分支而来的实现。新的实现新增了连接管理，允许在没有打开事务的情况下在多个存储库和服务之间共享连接。新方法支持提取当前事务状态 `TransactionOperations#findTransactionStatus`。`TransactionStatus` 现在包括有关连接和事务定义的信息。

**异步和响应式仓库**

如果未找到实体，异步和反应式资源库不再抛出 `EmptyResultException`。

## 1.3 版本历史

关于本项目，你可以在此处找到发布版本列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-data/releases

> [英文链接](https://micronaut-projects.github.io/micronaut-data/latest/guide/#introduction)

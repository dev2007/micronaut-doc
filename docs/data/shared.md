---
sidebar_position: 30
---

# 3. 共享概念

以下部分描述了所有 Micronaut 数据模块的共享概念：

- [仓库（Repositories）](https://micronaut-projects.github.io/micronaut-data/latest/guide/#repositories) —— 使用现有或创建自定义仓库
- [查询（Querying）](https://micronaut-projects.github.io/micronaut-data/latest/guide/#querying) —— 定义存储库方法以访问数据
- [数据访问（Data access）](https://micronaut-projects.github.io/micronaut-data/latest/guide/#dataUpdates) —— 数据访问操作
- [事务（Transactions）](https://micronaut-projects.github.io/micronaut-data/latest/guide/#transactions) —— 支持事务访问

## 3.1 仓库接口

Micronaut 数据库被定义为使用 [@Repository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Repository.html) 注解的接口。

[@Repository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Repository.html)  注解接受一个可选的字符串值，在多数据源情况下代表连接或数据源的名称。默认情况下，Micronaut Data 会查找默认数据源。

可以用 [@Repository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Repository.html)  注解仓库注入点并设置数据源名称。注意不能注入通用资源库，每个仓库都需要绑定到一个实体。

根据方法签名或为 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html) 接口指定的通用类型参数，可以确定将哪个实体作为根实体进行查询。

如果无法确定根实体，则会出现编译错误。

下表总结了 Micronaut Data 附带的仓库接口：

*表 1. 内置仓库接口*

|接口|描述|
|--|--|
|[GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html)|根接口没有方法，但将实体类型和 ID 类型定义为通用参数|
|[CrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/CrudRepository.html)|扩展 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html) 并添加执行 CRUD 的方法|
|[JpaRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jpa/repository/JpaRepository.html)|扩展了 [CrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/CrudRepository.html)，并添加了 `merge` 和 `flush` 等 JPA 特定方法（需要 JPA 实现）。|
|[PageableRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/PageableRepository.html)|扩展 [CrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/CrudRepository.html) 并添加分页方法|
|[AsyncCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/async/AsyncCrudRepository.html)|扩展 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html) 并添加异步 CRUD 执行方法|
|[AsyncPageableRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/async/AsyncPageableRepository.html)|扩展 [AsyncCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/async/AsyncCrudRepository.html) 并添加分页方法|
|[ReactiveStreamsCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactiveStreamsCrudRepository.html)|扩展了 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html)，并添加了返回 [Publisher](https://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 的 CRUD 方法|
|[ReactiveStreamsPageableRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactiveStreamsPageableRepository.html)|扩展 [ReactiveStreamsCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactiveStreamsCrudRepository.html) 并添加分页方法|
|[ReactorCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactorCrudRepository.html)|扩展了 [ReactiveStreamsCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/ReactiveStreamsCrudRepository.html)，并使用了 Reactor 返回类型|
|[ReactorPageableRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactorPageableRepository.html)|扩展 [ReactorCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactorCrudRepository.html) 并添加分页方法|
|[RxJavaCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/RxJavaCrudRepository.html)|扩展 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html) 并添加可返回 RxJava 2 类型的 CRUD 方法|
|[CoroutineCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/kotlin/CoroutineCrudRepository.html)|扩展了 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html)，并使用 Kotlin 例程进行反应式 CRUD 操作|
|[CoroutinePageableCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/kotlin/CoroutinePageableCrudRepository.html)|扩展 [CoroutineCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/kotlin/CoroutineCrudRepository.html) 并添加分页方法|

请注意，除了接口外，您还可以将仓库定义为抽象类：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import jakarta.persistence.EntityManager;
import java.util.List;

@Repository
public abstract class AbstractBookRepository implements CrudRepository<Book, Long> {

    private final EntityManager entityManager;

    public AbstractBookRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<Book> findByTitle(String title) {
        return entityManager.createQuery("FROM Book AS book WHERE book.title = :title", Book.class)
                    .setParameter("title", title)
                    .getResultList();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.data.annotation.Repository
import io.micronaut.data.repository.CrudRepository

import jakarta.persistence.EntityManager

@Repository
abstract class AbstractBookRepository implements CrudRepository<Book, Long> {

    private final EntityManager entityManager

    AbstractBookRepository(EntityManager entityManager) {
        this.entityManager = entityManager
    }

    List<Book> findByTitle(String title) {
        return entityManager.createQuery("FROM Book AS book WHERE book.title = :title", Book)
                .setParameter("title", title)
                .getResultList()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.Repository
import io.micronaut.data.repository.CrudRepository

import jakarta.persistence.EntityManager

@Repository
abstract class AbstractBookRepository(private val entityManager: EntityManager) : CrudRepository<Book, Long> {

    fun findByTitle(title: String): List<Book> {
        return entityManager.createQuery("FROM Book AS book WHERE book.title = :title", Book::class.java)
                .setParameter("title", title)
                .resultList
    }
}
```

  </TabItem>
</Tabs>

从上面的例子可以看出，使用抽象类是非常有用的，因为它允许你将自定义代码与 Micronaut Data 自动实现的存储库接口进行交互。

## 3.2 验证

仓库可以对实体和 ID 值进行验证。要添加验证，请使用 Jakarta 验证注解注解版本库的通用类型参数：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface AccountRepository extends CrudRepository<@jakarta.validation.Valid Account, @jakarta.validation.constraints.Min(0) Long> {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface AccountRepository extends CrudRepository<@jakarta.validation.Valid Account, @jakarta.validation.constraints.Min(0) Long> {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.Repository
import io.micronaut.data.repository.CrudRepository

@Repository
interface AccountRepository : CrudRepository<@jakarta.validation.Valid Account, @jakarta.validation.constraints.Min(0) Long>
```

  </TabItem>
</Tabs>

## 3.3 编写查询

Micronaut Data 中查询的实现基于 [GORM](https://gorm.grails.org/) 中的动态查找器。

在编译时采用模式匹配方法。查询方法的一般模式是：

![finderpattern](./_imgs/finderpattern.svg)

*图 1. 查询方法模式*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Book findByTitle(String title);

Book getByTitle(String title);

Book retrieveByTitle(String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Book findByTitle(String title)

Book getByTitle(String title)

Book retrieveByTitle(String title)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun findByTitle(title: String): Book

fun getByTitle(title: String): Book

fun retrieveByTitle(title: String): Book
```

  </TabItem>
</Tabs>

上述示例返回实体的单个实例，支持的返回类型如下表所示：

*表 1. 查找器方法支持的返回类型*

|返回类型|描述|
|--|--|
|`Book`|如果检索到 `null`，则仅在返回类型为可空的情况下才会抛出 [EmptyResultException](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/exceptions/EmptyResultException.html)。|
|`List<Book>`|一个 `java.util.List` 或任何常见的 `Iterable` 类型|
|`Stream<Book>`|一个 Java 8 `java.util.stream.Stream` 实例|
|`Optional<Book>`|一个可选值|
|`Page<Book>`|用于分页的 [Page](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/Page.html) 实例。|
|`Slice<Book>`|用于分页的 [Slice](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/Slice.html) 实例。|
|`Future<Book>` 或 `CompletableFuture<Book>`|用于异步执行的 java.util.concurrent.Future|
|`Publisher<Book>` （或 `Flowable`、`Single`、`Maybe`、`Flux`、`Mono` 等。）|与响应流兼容的类型|
|`Flow<Book>` 作为 `suspend` 函数的替代|一种 Kotlin 响应类型。需要依赖 `kotlinx-coroutines-reactive` 才能正确转换。|
|原生/简单类型|在投影情况下，可以返回原生/基本类型|

:::tip 注意
带有 `Stream<Book>` 结果的方法需要与 "try-with-resources" 块一起使用，并应在事务中执行。
:::

除标准 `findBy*` 模式外，还有其他一些模式对返回类型有特殊要求。

下表总结了可能的替代模式、行为和预期返回类型：

*表 2. 方法模式和返回类型*

|方法前缀|支持的返回类型|描述|
|--|--|--|
|`findBy`、 `getBy`、 `queryBy`、 `retrieveBy`、 `readBy`、 `searchBy` 之后是 [criteria](https://micronaut-projects.github.io/micronaut-data/latest/guide/#criteria)，且方法参数用于标准谓词|一个实体或任何常见的 `Iterable<E>` 类型、`Stream<E>`、 `Optional<E>`、 `Page<E>`、 `Slice<E>`|查找一条或多条符合标准的记录|
|`find`、 `get`、 `query`、 `retrieve`、 `read`、 `search`，它们带零个或多个方法参数用于匹配|一个实体或任何常见的 `Iterable<E>` 类型、`Stream<E>`、 `Optional<E>`、 `Page<E>`、 `Slice<E>`|查找一条或多条与属性匹配的记录（每个方法参数都应在要匹配的属性后加上一个名称）|
|`countBy` 之后是 [criteria](https://micronaut-projects.github.io/micronaut-data/latest/guide/#criteria)，且带有标准谓词的方法参数|`java.lang.Number` 实例的原生数|计算符合标准的记录数|
|`count`，带有用于匹配的零个或多个方法参数|`java.lang.Number` 实例的原生数|计算匹配属性的记录数|
|`existsBy` 之后是 [criteria](https://micronaut-projects.github.io/micronaut-data/latest/guide/#criteria)，且带有标准谓词的方法参数|一个原生或包装的 `boolean`|检查是否存在符合标准的记录|
|`exists` 带零个或多个方法参数用于匹配|一个原生或包装的 `boolean`|检查是否存在与属性匹配的记录|
|`delete`、 `remove`、 `erase`、 `eliminate` 带一个或多个实体方法参数|一个 `void` 或 `Number` 返回类型|删除一个或多个实体|
|`deleteBy`、`removeBy`、 `eraseBy`、 `eliminateBy` 之后是 [criteria](https://micronaut-projects.github.io/micronaut-data/latest/guide/#criteria)，且带有标准谓词的方法参数|一个 `void` 或 `Number` 返回类型|批量删除匹配标准|
|`delete`、 `remove`、 `erase`、 `eliminate` 带一个或多个实体方法参数|一个 `void` 或 `Number` 返回类型|批量删除，其中参数代表实体的属性（名字必须相同）|
|`update` 带一个或多个实体参数|一个 `void` 或 `Number` 返回类型|更新一个或多个实体|
|`update` + 更新的属性 + `By` 之后是 [criteria](https://micronaut-projects.github.io/micronaut-data/latest/guide/#criteria)，且方法参数与标准谓词的参数相匹配|一个 `void` 或 `Number` 返回类型|按属性批量更新|
|`update` 带方法参数匹配（注解 `@Id` 或 `@Version`），之后是用于更新的方法参数|一个 `void` 或 `Number` 返回类型|批量更新，其中参数代表实体属性（名字必须相同）|

请注意，每个方法前缀都可以有 `One` 或 `All` 后缀：`findOneByTitle`、`countAllByTitle` 等。

:::note 提示
有关这些方法的批量更新变体的更多详情，参阅[数据更新](#34-访问数据)部分。
:::

最后，作为 `By` 语法的另一种选择，你还可以定义简单的查找器，使用参数名来匹配要查询的属性。这种语法的灵活性较差，但在某些情况下更具可读性。例如，以下内容可作为 `findByTitle` 的替代语法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Book find(String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Executable
Book find(String title)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Executable
fun find(title: String): Book
```

  </TabItem>
</Tabs>

请注意，在这种情况下，如果 `title` 参数不作为属性存在于被查询的实体中，或者类型不匹配，就会出现编译错误。此外，您还可以指定多个参数来执行逻辑 `AND`。

### 3.3.1 查询标准

前面的示例介绍了一个简单的 `findByTitle` 查询，该查询可搜索 `title` 属性等于给定值的所有 `Book` 实例。

这是 Micronaut Data 支持的最简单的查询类型，但您可以在属性名称上使用可选后缀来修改要应用的标准类型。

例如，以下查询模式将执行查询，只查找页数大于给定值的 `Book` 实例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
List<Book> findByPagesGreaterThan(int pageCount);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
List<Book> findByPagesGreaterThan(int pageCount)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun findByPagesGreaterThan(pageCount: Int): List<Book>
```

  </TabItem>
</Tabs>

下表总结了可能的表达方式和行为：

*表 1. 属性标准表达式*

|后缀示例|描述|示例|
|--|--|--|
|`After`|查找属性位于给定值之后的结果|`findByDateCreatedAfter`|
|`Before`|查找属性在给定值之前的结果|`findByDateCreatedBefore`|
|`Contains`|查找属性包含给定值的结果|`findByTitleContains`|
|`StartsWith` 或 `StartingWith`|查找属性以给定值开头的结果|`findByTitleStartsWith`|
|`EndsWith` 或 `EndingWith`|查找属性以给定值结束的结果|`findByTitleEndsWith`|
|`Equals` 或 `Equal`|查找与给定值相等的结果|`findByTitleEquals`|
|`NotEquals` 或 `NotEqual`|查找不等于给定值的结果|`findByTitleNotEquals`|
|`GreaterThan`|查找属性大于给定值的结果|`findByPagesGreaterThan`|
|`GreaterThanEquals`|查找属性大于或等于给定值的结果|`findByPagesGreaterThanEquals`|
|`LessThan`|查找属性小于给定值的结果|`findByPagesLessThan`|
|`LessThanEquals`|查找属性小于或等于给定值的结果|`findByPagesLessThanEquals`|
|`Like`|查找与给定表达式"类似"的字符串值|`findByTitleLike`|
|`Ilike`|不区分大小写的"类似"查询|`findByTitleIlike`|
|`InList` 或 `In`|查找给定列表中包含该属性的结果|`findByTitleInList`|
|`Between` 或 `InRange`|查找属性介于给定值之间的结果|`findByDateCreatedBetween`|
|`IsNull`|查找属性为 `null` 的结果|`findByAuthorIsNull`|
|`IsNotNull`|查找属性不为 `null` 的结果|`findByAuthorIsNotNull`|
|`IsEmpty`|查找属性为空或 `null` 的结果|`findByAuthorIsEmpty`|
|`IsNotEmpty`|查找属性不为空或 `null` 的结果|`findByAuthorIsNotEmpty`|
|`True`|查找属性为 true 的结果|`findByAuthorEnabledTrue`|
|`False`|查找属性为 false 的结果|`findByAuthorEnabledFalse`|
|`ArrayContains` 或 `CollectionContains`|查找数组或列表属性中包含给定元素的结果。仅受 Micronaut Data MongoDB 和 Azure Cosmos Db 支持。|`findByTagsArrayContains` 或 `findByColorsCollectionContains`|

:::note 提示
这些标准表达式中的任何一个都可以通过在表达式前添加 Not 来否定（例如 NotInList）。
:::

您可以用 `And` 或 `Or` 逻辑运算符将多个标准组合起来。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
List<Book> findByPagesGreaterThanOrTitleLike(int pageCount, String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
List<Book> findByPagesGreaterThanOrTitleLike(int pageCount, String title)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun findByPagesGreaterThanOrTitleLike(pageCount: Int, title: String): List<Book>
```

  </TabItem>
</Tabs>

上例使用 `Or` 表达了大于条件和类似条件。

您还可以在表达式名称前添加 `Not` 来否定上述任何表达式（例如 `NotTrue` 或 `NotContain`）。

### 3.3.2 分页

通常，当返回多条记录时，您需要对数据分页进行一些控制。Micronaut Data 包含使用 [Pageable](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/Pageable.html) 类型（受 GORM 的 [PagedResultList](https://gorm.grails.org/latest/api/grails/orm/PagedResultList.html) 和 Spring Data 的 [Pageable](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Pageable.html) 启发）指定分页要求的功能。

此外，方法可以返回一个 [Page](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/Page.html) 对象，其中包括执行额外的查询，以获得给定查询的结果总数。

下面是一些签名示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
List<Book> findByPagesGreaterThan(int pageCount, Pageable pageable);

Page<Book> findByTitleLike(String title, Pageable pageable);

Slice<Book> list(Pageable pageable);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
List<Book> findByPagesGreaterThan(int pageCount, Pageable pageable);

Page<Book> findByTitleLike(String title, Pageable pageable);

Slice<Book> list(Pageable pageable);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
List<Book> findByPagesGreaterThan(int pageCount, Pageable pageable)

Page<Book> findByTitleLike(String title, Pageable pageable)

Slice<Book> list(Pageable pageable)
```

  </TabItem>
</Tabs>

还有一些测试数据：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
bookRepository.saveAll(Arrays.asList(new Book("The Stand", 1000), new Book("The Shining", 600),
        new Book("The Power of the Dog", 500), new Book("The Border", 700),
        new Book("Along Came a Spider", 300), new Book("Pet Cemetery", 400), new Book("A Game of Thrones", 900),
        new Book("A Clash of Kings", 1100)));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
bookRepository.saveAll(Arrays.asList(new Book("The Stand", 1000), new Book("The Shining", 600),
        new Book("The Power of the Dog", 500), new Book("The Border", 700),
        new Book("Along Came a Spider", 300), new Book("Pet Cemetery", 400), new Book("A Game of Thrones", 900),
        new Book("A Clash of Kings", 1100)));
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
bookRepository.saveAll(Arrays.asList(
        Book(0,"The Stand", 1000),
        Book(0,"The Shining", 600),
        Book(0,"The Power of the Dog", 500),
        Book(0,"The Border", 700),
        Book(0,"Along Came a Spider", 300),
        Book(0,"Pet Cemetery", 400),
        Book(0,"A Game of Thrones", 900),
        Book(0,"A Clash of Kings", 1100)
))
```

  </TabItem>
</Tabs>

使用 [Pageable](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/Pageable.html) 的 `from` 方法并指定适当的返回类型，可以执行查询并返回分页数据：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Slice<Book> slice = bookRepository.list(Pageable.from(0, 3));
List<Book> resultList = bookRepository.findByPagesGreaterThan(500, Pageable.from(0, 3));
Page<Book> page = bookRepository.findByTitleLike("The%", Pageable.from(0, 3));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Slice<Book> slice = bookRepository.list(Pageable.from(0, 3))
List<Book> resultList =
        bookRepository.findByPagesGreaterThan(500, Pageable.from(0, 3))
Page<Book> page = bookRepository.findByTitleLike("The%", Pageable.from(0, 3))
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val slice = bookRepository.list(Pageable.from(0, 3))
val resultList = bookRepository.findByPagesGreaterThan(500, Pageable.from(0, 3))
val page = bookRepository.findByTitleLike("The%", Pageable.from(0, 3))
```

  </TabItem>
</Tabs>

`from` 方法接受 `index` 和 `size` 参数，即开始的页码和每页要返回的记录数。

[Slice](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/Slice.html) 与 [Page](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/Page.html) 相同，但由于不计算总页数，因此少了一次查询。

### 3.3.3 排序

通过在方法名称后附加 `OrderBy*` 表达式，可以控制结果的排序：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
List<Book> listOrderByTitle();

List<Book> listOrderByTitleDesc();
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
List<Book> listOrderByTitle()

List<Book> listOrderByTitleDesc()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun listOrderByTitle(): List<Book>

fun listOrderByTitleDesc(): List<Book>
```

  </TabItem>
</Tabs>

`OrderBy*` 表达式指的是要排序的属性名称，可以选择附加 `Asc` 或 `Desc` 来控制升序或降序。可以使用 `And` 连接多个条件，如 `findByTypeOrderByNameAndDate`。

### 3.3.4 查询投影

通常情况下，您可能不需要检索特定实体的所有数据，而只需要实体的某个属性或关联，或者只需要执行某种计算并获得该结果。这就是查询投影的用武之地。

最简单的预测形式是检索一个属性或关联。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
List<String> findTitleByPagesGreaterThan(int pageCount)
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
List<String> findTitleByPagesGreaterThan(int pageCount)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun findTitleByPagesGreaterThan(pageCount: Int): List<String>
```

  </TabItem>
</Tabs>

在上例中，`findTitleByPagesGreaterThan` 方法正在解析图书 `Book` 的 `title` 属性，并以 `String` `List` 的形式返回数据。

:::tip 注意
如果预测属性类型和返回泛型类型不匹配，Micronaut Data 将无法编译该方法。
:::

您还可以在关联路径上使用投影，例如，如果存在作者关联，您可以编写 findAuthorNameByPagesGreaterThan 来检索所有作者的姓名。

除此之外，Micronaut Data 还支持投影表达式。下表总结了可能的表达式，并附有示例和说明：

*表 1. 投影表达式*

|表达式|示例|描述|
|--|--|--|
|`Count`|`countTitleByPagesGreaterThan`|计算数量|
|`CountDistinct`|`countDistinctTitleByPagesGreaterThan`|计算不重复数量|
|`Distinct`|`findDistinctTitleByPagesGreaterThan`|查找不同的属性值|
|`Max`|`findMaxPagesByTitleLike`|查找最大属性值|
|`Min`|`findMinPagesByTitleLike`|查找最小属性值|
|`Sum`|`findSumPagesByTitleLike`|找出所有属性值的总和
|`Avg`|`findAvgPagesByTitleLike`|找出所有属性值的平均值|

您还可以使用 `top` 或 `first` 来限制返回的结果（作为分页的一种简单替代方法）。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
List<Book> findTop3ByTitleLike(String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
List<Book> findTop3ByTitleLike(String title);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun findTop3ByTitleLike(title: String): List<Book>
```

  </TabItem>
</Tabs>

上述查询将返回给定查询表达式的前 3 个结果。

### 3.3.5 DTO 投影

如果返回类型注有 `@Introspected`，Micronaut Data 支持无反射数据传输对象（DTO）投影。

例如，如果你想对一个名为 `Book` 的实体进行投影，你可以定义一个 DTO 如下：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.annotation.Introspected;

@Introspected
public class BookDTO {

    private String title;
    private int pages;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.core.annotation.Introspected

@Introspected
data class BookDTO(
    var title: String,
    var pages: Int
)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.core.annotation.Introspected

@Introspected
data class BookDTO(
    var title: String,
    var pages: Int
)
```

  </TabItem>
</Tabs>

DTO 应包含与您希望投影的属性名称（此处为 `title` 和 `pages`）相匹配的属性。如果有任何属性不匹配，就会出现编译错误。

然后，您就可以在查询方法中使用 DTO 对象作为返回类型：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
BookDTO findOne(String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
BookDTO findOne(String title);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun findOne(title: String): BookDTO
```

  </TabItem>
</Tabs>

Micronaut Data 将优化查询，只从数据库中选择必要的属性。

:::tip 注意
你可以使用 [@NamingStrategy](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/NamingStrategy.html) 注解来覆盖默认的命名策略。
:::

### 3.3.6 明确查询

如果你想对 JPA-QL 查询有更多的控制，那么你可以使用 [@Query](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Query.html) 注解来指定一个显式查询：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Query("FROM Book b WHERE b.title = :t ORDER BY b.title")
List<Book> listBooks(String t);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Query("FROM Book b WHERE b.title = :t ORDER BY b.title")
List<Book> listBooks(String t)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Query("FROM Book b WHERE b.title = :t ORDER BY b.title")
fun listBooks(t: String): List<Book>
```

  </TabItem>
</Tabs>

使用冒号（`:`）指定已命名的参数，参数名后必须有一个与方法指定的参数相匹配的参数，否则会出现编译错误，使用反斜线 `\:` 来转义不是参数特定的冒号。

:::tip 注意
目前，Micronaut Data 不会解析 JPA-QL AST 并执行任何进一步的类型检查，因此在使用显式查询时应更加小心。这可能会在 Micronaut Data 的未来版本中改变。
:::

请注意，如果该方法返回一个用于分页的 [Page](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/Page.html)，则必须使用 [@Query](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Query.html) 注解中的 `countQuery` 成员额外指定一个执行等价计数的查询。

### 3.3.7 使用 @Where 修改查询

您可以使用 [@Where](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Where.html) 注解通过附加查询条件修改编译时生成的查询。

常见的用例是实现软删除。例如，下面的 `User` 实体声明了一个 `enabled` 属性：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.*;
import io.micronaut.data.model.naming.NamingStrategies;

@MappedEntity(namingStrategy = NamingStrategies.Raw.class)
@Where("@.userEnabled = true") // (1)
public class User {
    @GeneratedValue
    @Id
    private Long id;
    private String userName;
    private boolean userEnabled = true; // (2)

    public User(String userName) {
        this.userName = userName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public boolean isUserEnabled() {
        return userEnabled;
    }

    public void setUserEnabled(boolean userEnabled) {
        this.userEnabled = userEnabled;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import groovy.transform.EqualsAndHashCode
import io.micronaut.data.annotation.*

@MappedEntity
@Where("@.enabled = true") // (1)
@EqualsAndHashCode(includes = "name")
class User {
    @GeneratedValue
    @Id
    Long id
    String name
    boolean enabled = true // (2)

    User(String name) {
        this.name = name
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import io.micronaut.data.annotation.Where


@MappedEntity
@Where("@.enabled = true") // (1)
data class User(
    @GeneratedValue
    @field:Id
    var id: Long,
    val name: String,
    val enabled: Boolean // (2)
)
```

  </TabItem>
</Tabs>

1. [@Where](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Where.html) 注解用于声明所有查询都应包含 `enabled = true`，而 `@` 则是查询别名的占位符。
2. 实体上存在 `enabled` 属性

这样，您就可以轻松修改 `delete` 操作，转而发布更新。例如，请看下面的仓库实现：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.annotation.NonNull;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@JdbcRepository(dialect = Dialect.H2)
public interface UserRepository extends CrudRepository<User, Long> { // (1)

    @Override
    @Query("UPDATE user SET userEnabled = false WHERE id = :id") // (2)
    void deleteById(@NonNull @NotNull Long id);

    @Query("SELECT * FROM user WHERE userEnabled = false") // (3)
    List<User> findDisabled();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.core.annotation.NonNull
import io.micronaut.data.annotation.Query
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository

import jakarta.validation.constraints.NotNull

@JdbcRepository(dialect = Dialect.H2)
interface UserRepository extends CrudRepository<User, Long> { // (1)

    @Override
    @Query("UPDATE user SET enabled = false WHERE id = :id") // (2)
    void deleteById(@NonNull @NotNull Long id)

    @Query("SELECT * FROM user WHERE enabled = false") // (3)
    List<User> findDisabled()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.Query
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository

@JdbcRepository(dialect = Dialect.H2)
interface UserRepository : CrudRepository<User, Long> { // (1)

    @Query("UPDATE user SET enabled = false WHERE id = :id") // (2)
    override fun deleteById(id: Long)

    @Query("SELECT * FROM user WHERE enabled = false") // (3)
    fun findDisabled(): List<User>
}
```

  </TabItem>
</Tabs>

1. 接口扩展了 [CrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/CrudRepository.html)
2. 重载 `deleteById`，通过将 `enabled` 设为 `false` 来执行软删除。
3. 添加了一个扩展方法，以便在需要时使用显式查询返回禁用实体。

对实体执行的所有其他查询都将在查询语句中包含 `enabled = true`。

也可以通过注解仓库方法来覆盖实体的 [@Where](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Where.html) 注解。这样，`findDisabled` 的示例将是：

```java
package example;

import io.micronaut.data.annotation.Where;

import java.util.List;

public interface UserRepositoryWithWhere {

    // ...

    @Where("@.enabled = false")
    List<User> findDisabled();
}
```

如果要从特定资源库方法中移除 [@Where](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Where.html) 条件，可以使用 [@IgnoreWhere](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/IgnoreWhere.html)。

### 3.3.8 异步查询

Micronaut Data 通过定义返回 `CompletionStage`、`CompletableFuture` 或 `Future` 的方法来支持异步查询执行。

在异步执行的情况下，如果后盾实现是阻塞的，Micronaut Data 将使用[配置的 I/O 线程池](/core/httpserver/reactiveServer)在不同的线程上调度查询执行。

下面是几个异步方法的示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Repository
public interface ProductRepository extends CrudRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Join("manufacturer")
    CompletableFuture<Product> findByNameContains(String str);

    CompletableFuture<Long> countByManufacturerName(String name);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Repository
abstract class ProductRepository implements CrudRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Join("manufacturer")
    abstract CompletableFuture<Product> findByNameContains(String str)

    abstract CompletableFuture<Long> countByManufacturerName(String name)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Repository
interface ProductRepository : CrudRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Join("manufacturer")
    fun findByNameContains(str: String): CompletableFuture<Product>

    fun countByManufacturerName(name: String): CompletableFuture<Long>
}
```

  </TabItem>
</Tabs>

上面的示例定义了两个使用 `CompletableFuture` 作为返回类型的方法，您可以使用其 API 来组合查询操作：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
long total = productRepository.findByNameContains("o")
        .thenCompose(product -> productRepository.countByManufacturerName(product.getManufacturer().getName()))
        .get(1000, TimeUnit.SECONDS);

Assertions.assertEquals(
        2,
        total
);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
when:"A result is retrieved using async composition"
long total = productRepository.findByNameContains("o")
        .thenCompose { product -> productRepository.countByManufacturerName(product.manufacturer.name) }
        .get(1000, TimeUnit.SECONDS)

then:"the result is correct"
total == 2
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val total = productRepository.findByNameContains("o")
        .thenCompose { product -> productRepository.countByManufacturerName(product.manufacturer.name) }
        .get(1000, TimeUnit.SECONDS)

assertEquals(
        2,
        total
)
```

  </TabItem>
</Tabs>

:::tip 注意
在 JPA 的情况下，每个操作都将使用自己的事务和会话运行，因此需要注意获取正确的数据并避免分离对象。此外，对于更复杂的操作，编写使用单一会话的自定义代码可能更有效。
:::

### 3.3.9 响应式查询

Micronaut Data 通过定义返回 [Publisher](https://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)、Reactor 或 RxJava 2 类型的方法来支持反应式查询执行。如果使用 Kotlin，则可以使用 coroutines 和 `Flow`。

在响应式执行的情况下，如果支持的实现是阻塞的，Micronaut Data 将使用[配置的 I/O 线程池](/core/httpserver/reactiveServer)在不同的线程上调度查询执行。

如果后备实现在驱动级别原生支持响应式类型，则不会使用 I/O 线程池，而是假定驱动程序将以非阻塞方式处理查询。

下面是几个响应式方法的示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Join("manufacturer")
Maybe<Product> queryByNameContains(String str);

Single<Long> countDistinctByManufacturerName(String name);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Join("manufacturer")
abstract Maybe<Product> queryByNameContains(String str)

abstract Single<Long> countDistinctByManufacturerName(String name)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Join("manufacturer")
fun queryByNameContains(str: String): Maybe<Product>

fun countDistinctByManufacturerName(name: String): Single<Long>
```

  </TabItem>
</Tabs>

上面的示例定义了两个使用 RxJava 2 的响应式返回类型的方法，您可以使用 RxJava 2 的 API 来组合查询操作：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
long total = productRepository.queryByNameContains("o")
        .flatMap(product -> productRepository.countDistinctByManufacturerName(product.getManufacturer().getName())
                                .toMaybe())
        .defaultIfEmpty(0L)
        .blockingGet();

Assertions.assertEquals(
        2,
        total
);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
long total = productRepository.queryByNameContains("o")
        .flatMap(product -> productRepository.countDistinctByManufacturerName(product.getManufacturer().getName())
                                .toMaybe())
        .defaultIfEmpty(0L)
        .blockingGet();

Assertions.assertEquals(
        2,
        total
);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val total = productRepository.queryByNameContains("o")
        .flatMap { product ->
            productRepository.countDistinctByManufacturerName(product.manufacturer.name)
                    .toMaybe()
        }
        .defaultIfEmpty(0L)
        .blockingGet()

assertEquals(
        2,
        total
)
```

  </TabItem>
</Tabs>

在 JPA 的情况下，每个操作都将使用自己的事务和会话运行，因此需要注意获取正确的数据并避免分离对象。

此外，对于更复杂的操作，编写使用单一会话的自定义代码可能更有效。

## 3.4 访问数据

使用 Micronaut 数据接口执行读/写操作有多种方法：

- 扩展一个[内置仓库接口](#31-仓库接口)
- 使用[标准查询命名约定](#331-查询标准)定义一个新方法
- 使用 [@Query](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Query.html) 注解使用自定义查询定义一个新方法

### 3.4.1 插入

要插入数据，最简单的方法是定义一个接受实体类型的方法，与 [CrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/CrudRepository.html) 接口的方法相同：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Book save(Book entity)
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
fun save(entity: Book): Book
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun save(entity: Book): Book
```

  </TabItem>
</Tabs>

该方法必须接受一个参数，即实体，并以 `save`、 `persist`、 `insert` 或 `store` 开头，要持久化多个实体，该方法需要接受实体的 `java.lag.Iterable` 参数。

或者，你也可以定义一个方法，该方法的参数名称与实体名称的属性相匹配：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Book persist(String title, int pages);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Query("INSERT INTO Book(title, pages) VALUES (:title, :pages)")
void insert(String title, int pages)

@Query("INSERT INTO Book(title, pages) VALUES (:title, :pages)")
void insertOne(Book entity)

@Query("INSERT INTO Book(title, pages) VALUES (:title, :pages)")
void insertMany(Iterable<Book> entities)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Query("INSERT INTO Book(title, pages) VALUES (:title, :pages)")
fun insert(title: String, pages: Int)

@Query("INSERT INTO Book(title, pages) VALUES (:title, :pages)")
fun insertOne(book: Book)

@Query("INSERT INTO Book(title, pages) VALUES (:title, :pages)")
fun insertMany(books: Iterable<Book>)
```

  </TabItem>
</Tabs>

:::notice 提示
在部分更新中不可能使用实体作为返回类型，因为这需要额外的选择来检索额外的信息。可以返回数字类型（int、long 等）来表示更新的行数。在大多数情况下，应检查更新的行数，以确保更新确实影响了行。
:::

### 3.4.2 更新

要更新实体，您可以再次将实体传递给 `update` 方法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Book update(Book newBook);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Book update(Book newBook)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun update(newBook: Book): Book
```

  </TabItem>
</Tabs>


不过，一般来说，使用批量更新只更新实际发生变化的属性会更有效率。

有几种方法可以实现批量更新。一种方法是定义一个以 [@Id](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Id.html) 为参数注解的方法，以主干 `update` 开始：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void update(@Id Long id, int pages);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void update(@Id Long id, int pages)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun update(@Id id: Long?, pages: Int)
```

  </TabItem>
</Tabs>

在这种情况下，实体的 ID 将被用于查询和执行对实体的更新，并包含所有剩余参数（在本例中为 `pages`）。如果某个参数与实体的现有属性不匹配，就会出现编译错误。

另一种方法是使用 `updateBy*`（该方法应再次返回 `void` 或表示已更新记录数的 `Number`）：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void updateByTitle(String title, int pages);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void updateByTitle(String title, int pages)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun updateByTitle(title: String, pages: Int)
```

  </TabItem>
</Tabs>

在这种情况下，你可以使用任何查找表达式对任意属性进行查询，任何不构成查询表达式一部分的剩余参数都将用于更新。同样，如果剩余参数中有一个与实体的现有属性不匹配，就会出现编译错误。

您还可以为更新方法指定自定义查询：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Query("UPDATE book SET title = :title where id = :id")
void updateOne(Book book);

@Query("UPDATE book SET title = :title where id = :id")
void updateMany(Iterable<Book> books);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Query("UPDATE book SET title = :title where id = :id")
void updateOne(Book book);

@Query("UPDATE book SET title = :title where id = :id")
void updateMany(Iterable<Book> books);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Query("UPDATE book SET title = :title where id = :id")
fun updateOne(book: Book)

@Query("UPDATE book SET title = :title where id = :id")
fun updateMany(books: Iterable<Book>)
```

  </TabItem>
</Tabs>

### 3.4.3 删除

删除有多种方式。要删除所有内容（小心使用！），可以使用 `deleteAll`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void deleteAll();
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void deleteAll()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
override fun deleteAll()
```

  </TabItem>
</Tabs>

:::tip 注意
`deleteAll` 不能级联。请先删除所有外键引用，或在所有单个项目上使用 `delete`。
:::

要按 ID 或属性值删除，可以指定一个与实体属性匹配的参数：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void delete(String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void delete(String title)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun delete(title: String)
```

  </TabItem>
</Tabs>

最后，您还可以使用 `deleteBy*` 模式（方法必须以 `delete`、`remove`、`erase` 或 `eliminate` 开头）和任何查找表达式，例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void deleteByTitleLike(String title)
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
fun deleteByTitleLike(title: String)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun deleteByTitleLike(title: String)
```

  </TabItem>
</Tabs>

您还可以为删除方法指定自定义查询：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Query("DELETE FROM Book WHERE title = :title")
void deleteOne(Book book);

@Query("DELETE FROM Book WHERE title = :title")
void deleteMany(Iterable<Book> books);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Query("DELETE FROM Book WHERE title = :title")
void deleteOne(Book book);

@Query("DELETE FROM Book WHERE title = :title")
void deleteMany(Iterable<Book> books);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Query("DELETE FROM Book WHERE title = :title")
fun deleteOne(book: Book)

@Query("DELETE FROM Book WHERE title = :title")
fun deleteMany(books: Iterable<Book>)
```

  </TabItem>
</Tabs>

### 3.4.4 实体时间戳

通常需要添加一个字段来表示实体首次持久化的时间和最后更新的时间。

您可以用 [@DateCreated](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/DateCreated.html) 来注解实体的日期类型属性，它将在保存实体时自动填充，并指示记录的创建日期。

您也可以用 [@DateUpdated](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/DateUpdated.html) 来注解实体日期类型的属性，当实体通过 `persist` 方法或使用 Micronaut Data 的批量更新方法更新时，该属性将被自动填充。

:::tip 注意
如果使用外部 SQL 语句或自定义逻辑更新实体，则需要手动更新底层的 `DateUpdated` 列。
:::

### 3.4.5 实体事件

自 2.3 起，Micronaut Data 支持使用注解或通过实现 [EntityEventListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/EntityEventListener.html) 接口为 JPA 或 JDBC 定义实体事件监听器。
下表列出了可用的事件注解：

*表 1. 实体事件监听器注解*

|注解|描述|
|--|--|
|[@PrePersist](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/event/PrePersist.html)|在持久化对象之前触发|
|[@PostPersist](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/event/PostPersist.html)|在持久化对象后触发
|[@PreRemove](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/event/PreRemove.html)|在删除对象之前触发（注意：不适用于批量删除）
|[@PostRemove](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/event/PostRemove.html)|删除对象后触发（注意：不适用于批量删除）|
|[@PreUpdate](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/event/PreUpdate.html)|在更新对象之前触发（注：不适用于批量更新）|
|[@PostUpdate](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/event/PostUpdate.html)|更新对象后触发（注：不适用于批量更新）|

:::notice 提示
如果您愿意，也可以使用 `javax.persistence` 包中的 JPA 注解。
:::

每个事件监听器注解都可应用于实体类（JPA 实体或注解为 ann:data.annotation.MappedEntity 的类）的实例方法，在这种情况下，方法必须返回 `void` 且参数为零：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import java.nio.charset.StandardCharsets;
import java.time.MonthDay;
import java.util.Base64;

@Entity
public class Account {
    @GeneratedValue
    @Id
    private Long id;
    private String username;
    private String password;
    @Column(columnDefinition = "date")
    @Convert(converter = MonthDayDateAttributeConverter.class)
    private MonthDay paymentDay;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public MonthDay getPaymentDay() {
        return paymentDay;
    }

    public void setPaymentDay(MonthDay paymentDay) {
        this.paymentDay = paymentDay;
    }

    @PrePersist
    void encodePassword() {
        this.password = Base64.getEncoder()
                .encodeToString(this.password.getBytes(StandardCharsets.UTF_8));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import jakarta.persistence.*
import java.nio.charset.StandardCharsets

@Entity
class Account {
    @GeneratedValue
    @Id
    Long id
    String username
    String password

    @PrePersist
    void encodePassword() {
        this.password = Base64.encoder
                .encodeToString(this.password.getBytes(StandardCharsets.UTF_8))
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import java.nio.charset.StandardCharsets
import java.util.*
import jakarta.persistence.*

@Entity
data class Account(@GeneratedValue @Id
                   var id: Long? = null,
                   val username: String,
                   var password: String) {

    @PrePersist
    fun encodePassword() {
        password = Base64.getEncoder()
            .encodeToString(password.toByteArray(StandardCharsets.UTF_8))
    }
}
```

  </TabItem>
</Tabs>

上面的示例定义了一个 `@PrePersist` 监听器，该监听器在将密码插入数据库之前对密码进行编码（采用不太安全的 base64 格式，显然不推荐使用！）。

此外，注解可应用于 Micronaut Bean 的任何实例方法，在这种情况下，该方法必须返回 `void`，并有一个作为实体类型的参数（注意，对于所有事件，`Object` 可以是对象，也可以是监听器）。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.event.PrePersist;

import jakarta.inject.Singleton;

@Singleton
public class AccountUsernameValidator {
    @PrePersist
    void validateUsername(Account account) {
        final String username = account.getUsername();
        if (username == null || !username.matches("[a-z0-9]+")) {
            throw new IllegalArgumentException("Invalid username");
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example;

import io.micronaut.data.annotation.event.PrePersist;

import jakarta.inject.Singleton;

@Singleton
public class AccountUsernameValidator {
    @PrePersist
    void validateUsername(Account account) {
        final String username = account.getUsername();
        if (username == null || !username.matches("[a-z0-9]+")) {
            throw new IllegalArgumentException("Invalid username");
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.event.PrePersist

import jakarta.inject.Singleton

@Singleton
class AccountUsernameValidator {
    @PrePersist
    void validateUsername(Account account) {
        final String username = account.username
        if (!username || !(username ==~ /[a-z0-9]+/)) {
            throw new IllegalArgumentException("Invalid username")
        }
    }
}
```

  </TabItem>
</Tabs>

上述监听器的作用是在插入之前验证账户用户名。

最后，我们还可以定义一个 Micronaut Bean，它可以实现 [EntityEventListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/EntityEventListener.html) 接口或下表所列 [EntityEventListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/EntityEventListener.html) 的子接口之一：

*表 2. 实体事件监听器接口实体事件监听器接口*

|接口|描述|
|--|--|
|[PrePersistListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/listeners/PrePersistListener.html)|在持久化对象之前触发|
|[@PostPersistListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/listeners/PostPersistListener.html)|在持久化对象后触发|
|[@PreRemoveListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/listeners/PreRemoveListener.html)|在删除对象之前触发（注意：不适用于批量删除）|
|[@PostRemoveListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/listeners/PostRemoveListener.html)|删除对象后触发（注意：不适用于批量删除）|
|[@PreUpdateListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/listeners/PreUpdateListener.html)|在更新对象之前触发（注：不适用于批量更新）
|[@PostUpdateListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/listeners/PostUpdateListener.html)|更新对象后触发（注：不适用于批量更新）|

例如，下面的 Micronaut 工厂 bean 定义了在 `Book` 实体持久化之前和之后执行的监听器：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.context.annotation.Factory;
import io.micronaut.data.event.listeners.PostPersistEventListener;
import io.micronaut.data.event.listeners.PrePersistEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.inject.Singleton;

@Factory
public class BookListeners {
    private static final Logger LOG = LoggerFactory.getLogger(BookListeners.class);

    @Singleton
    PrePersistEventListener<Book> beforeBookPersist() { // (1)
        return (book) -> {
            LOG.debug("Inserting book: {}", book.getTitle() );
            return true; // (2)
        };
    }

    @Singleton
    PostPersistEventListener<Book> afterBookPersist() { // (3)
        return (book) -> LOG.debug("Book inserted: {}", book.getTitle() );
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.context.annotation.Factory
import io.micronaut.data.event.listeners.PostPersistEventListener
import io.micronaut.data.event.listeners.PrePersistEventListener
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import jakarta.inject.Singleton

@Factory
class BookListeners {
    private static final Logger LOG = LoggerFactory.getLogger(BookListeners)

    @Singleton
    PrePersistEventListener<Book> beforeBookPersist() { // (1)
        return (book) -> {
            LOG.debug "Inserting book: ${book.title}"
            return true // (2)
        }
    }

    @Singleton
    PostPersistEventListener<Book> afterBookPersist() { // (3)
        return (book) -> LOG.debug("Book inserted: ${book.title}")
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.context.annotation.Factory
import io.micronaut.data.event.listeners.PostPersistEventListener
import io.micronaut.data.event.listeners.PrePersistEventListener
import org.slf4j.LoggerFactory
import jakarta.inject.Singleton

@Factory
class BookListeners {
    @Singleton
    fun beforeBookPersist(): PrePersistEventListener<Book> { // (1)
        return PrePersistEventListener { book: Book ->
            LOG.debug("Inserting book: ${book.title}")
            true // (2)
        }
    }

    @Singleton
    fun afterBookPersist(): PostPersistEventListener<Book> { // (3)
        return PostPersistEventListener { book: Book ->
            LOG.debug("Book inserted: ${book.title}")
        }
    }

    companion object {
        private val LOG = LoggerFactory.getLogger(BookListeners::class.java)
    }
}
```

  </TabItem>
</Tabs>

1. 工厂会返回一个 [PrePersistListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/listeners/PrePersistListener.html) 类型的 Bean，该 Bean 将 `Book` 作为通用参数
2. 如果操作不应继续，`PrePersistLener` 可以返回 `false`，如果是这种情况，则返回 `true`
3. 定义了一个额外的 [@PostPersistLener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/event/listeners/PostPersistListener.html) 事件监听器

## 3.5 交易

Micronaut Data 会自动为您管理事务。您只需使用 `jakarta.transaction.Transactional` 注解将方法声明为事务。

Micronaut Data 会将声明的事务注解映射到正确的底层语义和编译时。

:::tip 注意
启动 Micronaut Data 4 资源库时不再使用新事务执行，如果没有新事务，将创建新连接。
:::

:::notice 提示
如果你更喜欢 Hibernate 或 JDBC 的 Spring 管理事务，你可以添加 micronaut-data-spring 依赖关系，Spring 管理事务将被替代使用。更多信息参阅 [Spring 支持](/spring)部分。
:::

### 3.5.1 编程式事务

您可以使用 [TransactionOperations](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/transaction/TransactionOperations.html) API 执行编程事务。

下面演示了一个示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.transaction.TransactionOperations;
import jakarta.inject.Singleton;
import jakarta.persistence.EntityManager;
import org.hibernate.Session;

@Singleton
public class ProductManager {

    private final EntityManager entityManager;
    private final TransactionOperations<Session> transactionManager;

    public ProductManager(EntityManager entityManager,
                          TransactionOperations<Session> transactionManager) { // (1)
        this.entityManager = entityManager;
        this.transactionManager = transactionManager;
    }

    Product save(String name, Manufacturer manufacturer) {
        return transactionManager.executeWrite(status -> { // (2)
            final Product product = new Product(name, manufacturer);
            entityManager.persist(product);
            return product;
        });
    }

    Product find(String name) {
        return transactionManager.executeRead(status -> // (3)
            status.getConnection().createQuery("from Product p where p.name = :name", Product.class)
                .setParameter("name", name)
                .getSingleResult()
        );
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.transaction.TransactionOperations
import jakarta.inject.Singleton
import jakarta.persistence.EntityManager
import org.hibernate.Session

@Singleton
class ProductManager {

    private final EntityManager entityManager
    private final TransactionOperations<Session> transactionManager

    ProductManager(EntityManager entityManager,
                   TransactionOperations<Session> transactionManager) { // (1)
        this.entityManager = entityManager
        this.transactionManager = transactionManager
    }

    Product save(String name, Manufacturer manufacturer) {
        return transactionManager.executeWrite { // (2)
            Product product = new Product(name, manufacturer)
            entityManager.persist(product)
            return product
        }
    }

    Product find(String name) {
        return transactionManager.executeRead { status -> // (3)
            status.getConnection().createQuery("from Product p where p.name = :name", Product)
                    .setParameter("name", name)
                    .singleResult
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.transaction.TransactionOperations
import jakarta.inject.Singleton
import jakarta.persistence.EntityManager
import org.hibernate.Session

@Singleton
class ProductManager(
    private val entityManager: EntityManager,
    private val transactionManager: TransactionOperations<Session> // (1)
) {

    fun save(name: String, manufacturer: Manufacturer): Product {
        return transactionManager.executeWrite { // (2)
            val product = Product(null, name, manufacturer)
            entityManager.persist(product)
            product
        }
    }

    fun find(name: String): Product {
        return transactionManager.executeRead { status ->  // (3)
            status.connection.createQuery("from Product p where p.name = :name", Product::class.java)
                .setParameter("name", name)
                .singleResult
        }
    }
}
```

  </TabItem>
</Tabs>

1. 构造函数注入了 [TransactionOperations](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/transaction/TransactionOperations.html) 和会话感知 `EntityManager`。
2. 保存方法使用 `executeWrite` 方法在传递的 lambda 上下文中执行写事务。
3. find 方法使用 `executeRead` 方法在传递的 lambda 上下文中执行只读事务。本例使用事务管理器提供的状态访问会话。

请注意，如果使用 Micronaut Data JDBC，则应注入一个上下文连接感知的 JDBC `Connection` 对象，而不是 `EntityManager`。

下面是一个例子：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.transaction.TransactionOperations;
import jakarta.inject.Singleton;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Singleton
public class ProductManager {

    private final Connection connection;
    private final TransactionOperations<Connection> transactionManager;

    public ProductManager(Connection connection,
                          TransactionOperations<Connection> transactionManager) { // (1)
        this.connection = connection;
        this.transactionManager = transactionManager;
    }

    Product save(String name, Manufacturer manufacturer) {
        return transactionManager.executeWrite(status -> { // (2)
            final Product product = new Product(name, manufacturer);
            try (PreparedStatement ps = connection.prepareStatement("insert into product (name, manufacturer_id) values (?, ?)")) {
                ps.setString(1, name);
                ps.setLong(2, manufacturer.getId());
                ps.execute();
            }
            return product;
        });
    }

    Product find(String name) {
        return transactionManager.executeRead(status -> { // (3)
            try (PreparedStatement ps = status.getConnection().prepareStatement("select * from product p where p.name = ?")) {
                ps.setString(1, name);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        return new Product(rs.getString("name"), null);
                    }
                    return null;
                }
            }
        });
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.transaction.TransactionOperations
import jakarta.inject.Singleton

import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet

@Singleton
class ProductManager {

    private final Connection connection
    private final TransactionOperations<Connection> transactionManager

    ProductManager(Connection connection,
                   TransactionOperations<Connection> transactionManager) { // (1)
        this.connection = connection
        this.transactionManager = transactionManager
    }

    Product save(String name, Manufacturer manufacturer) {
        return transactionManager.executeWrite { // (2)
            final Product product = new Product(name, manufacturer)
            connection.prepareStatement("insert into product (name, manufacturer_id) values (?, ?)")
                    .withCloseable { PreparedStatement ps ->
                        ps.setString(1, name)
                        ps.setLong(2, manufacturer.getId())
                        ps.execute()
                    }
            return product
        }
    }

    Product find(String name) {
        return transactionManager.executeRead { status -> // (3)
            status.getConnection().prepareStatement("select * from product p where p.name = ?").withCloseable {
                PreparedStatement ps ->
                    ps.setString(1, name)
                    ps.executeQuery().withCloseable { ResultSet rs ->
                        if (rs.next()) {
                            return new Product(rs.getString("name"), null)
                        }
                        return null
                    }
            }
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.exceptions.EmptyResultException
import io.micronaut.transaction.TransactionOperations
import jakarta.inject.Singleton
import java.sql.Connection

@Singleton
class ProductManager(
    private val connection: Connection,
    private val transactionManager: TransactionOperations<Connection> // (1)
) {

    fun save(name: String, manufacturer: Manufacturer): Product {
        return transactionManager.executeWrite { // (2)
            val product = Product(0, name, manufacturer)
            connection.prepareStatement("insert into product (name, manufacturer_id) values (?, ?)").use { ps ->
                ps.setString(1, name)
                ps.setLong(2, manufacturer.id!!)
                ps.execute()
            }
            product
        }
    }

    fun find(name: String): Product {
        return transactionManager.executeRead { status -> // (3)
            status.connection.prepareStatement("select * from product p where p.name = ?").use { ps ->
                    ps.setString(1, name)
                    ps.executeQuery().use { rs ->
                        if (rs.next()) {
                            return@executeRead Product(
                                rs.getLong("id"), rs.getString("name"), null
                            )
                        }
                        throw EmptyResultException()
                    }
                }
        }
    }
}
```

  </TabItem>
</Tabs>

1. 构造函数注入了 [TransactionOperations](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/transaction/TransactionOperations.html) 和上下文连接感知 `Connection`。
2. 保存方法使用 `executeWrite` 方法在传递的 lambda 上下文中执行写事务。
3. `find` 方法使用 `executeRead` 方法在传递的 lambda 上下文中执行只读事务。本示例使用事务管理器提供的状态访问连接。

请注意，您必须始终使用注入的连接，因为 Micronaut Data 提供的事务感知实现会使用与底层事务相关的连接。

如果使用该连接时事务未激活，则会抛出 [NoTransactionException](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/transaction/exceptions/NoTransactionException.html)，表明你应该提供一个编程事务或使用 `@Transactional`。

### 3.5.2 事务性事件

您可以使用 [@TransactionalEventListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/transaction/annotation/TransactionalEventListener.html) 注解编写事务感知事件侦听器。

下面是一个示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.context.event.ApplicationEventPublisher;
import io.micronaut.transaction.annotation.TransactionalEventListener;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

@Singleton
public class BookManager {
    private final BookRepository bookRepository;
    private final ApplicationEventPublisher<NewBookEvent> eventPublisher;

    public BookManager(BookRepository bookRepository, ApplicationEventPublisher<NewBookEvent> eventPublisher) { // (1)
        this.bookRepository = bookRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    void saveBook(String title, int pages) {
        final Book book = new Book(title, pages);
        bookRepository.save(book);
        eventPublisher.publishEvent(new NewBookEvent(book)); // (2)
    }

    @TransactionalEventListener
    void onNewBook(NewBookEvent event) {
        System.out.println("book = " + event.book); // (3)
    }

    static class NewBookEvent {
        final Book book;

        public NewBookEvent(Book book) {
            this.book = book;
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.context.event.ApplicationEventPublisher
import io.micronaut.transaction.annotation.TransactionalEventListener
import jakarta.inject.Singleton
import jakarta.transaction.Transactional

@Singleton
class BookManager {
    private final BookRepository bookRepository
    private final ApplicationEventPublisher<NewBookEvent> eventPublisher

    BookManager(BookRepository bookRepository, ApplicationEventPublisher<NewBookEvent> eventPublisher) { // (1)
        this.bookRepository = bookRepository
        this.eventPublisher = eventPublisher
    }

    @Transactional
    void saveBook(String title, int pages) {
        final Book book = new Book(title, pages)
        bookRepository.save(book)
        eventPublisher.publishEvent(new NewBookEvent(book)) // (2)
    }

    @TransactionalEventListener
    void onNewBook(NewBookEvent event) {
        println("book = $event.book") // (3)
    }

    static class NewBookEvent {
        final Book book

        NewBookEvent(Book book) {
            this.book = book
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.context.event.ApplicationEventPublisher
import io.micronaut.transaction.annotation.TransactionalEventListener
import jakarta.inject.Singleton
import jakarta.transaction.Transactional

@Singleton
open class BookManager(
        private val bookRepository: BookRepository, private val eventPublisher: ApplicationEventPublisher<NewBookEvent>) { // (1)

    @Transactional
    open fun saveBook(title: String, pages: Int) {
        val book = Book(0, title, pages)
        bookRepository.save(book)
        eventPublisher.publishEvent(NewBookEvent(book)) // (2)
    }

    @TransactionalEventListener
    open fun onNewBook(event: NewBookEvent) {
        println("book = ${event.book}") // (3)
    }

    class NewBookEvent(val book: Book)
}
```

  </TabItem>
</Tabs>

1. `BookManager` 类接收 `ApplicationEventPublisher` 的实例。
2. 发布事件时，如果有正在运行的事务，那么只有在事务提交后才会触发监听器。
3. 监听器本身注解为 [@TransactionalEventListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/transaction/annotation/TransactionalEventListener.html)

:::notice 提示
您可以设置 [@TransactionalEventListener](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/transaction/annotation/TransactionalEventListener.html) 注解的值，将监听器绑定到特定的事务阶段。
:::

## 3.6 Kotlin 标准 API 扩展

Micronaut Data 包含 Jakarta Criteria API 的实验性扩展和查询构建器，可简化使用 Kotlin 编写查询的过程。

扩展和构建器位于 `io.micronaut.data.runtime.criteria.KCriteriaBuilderExt` 文件中。

有一些简单的扩展方法可简化标准 API 的工作：

- `KProperty.asPath(jakarta.persistence.criteria.Root): jakarta.persistence.criteria.Path` —— 扩展 `KProperty` 允许获取类型安全的属性路径：`Person::name.asPath(root)`
- `operator Path.get(KProperty1): Path` 连锁属性访问： `root[Person::parent][Parent::name]`
- `From.joinMany(KProperty1, JoinType): Join` 连接 `*-to-many` 关系
- `From.joinOne(KProperty1, JoinType): Join` 连接 `*-to-one` 关系

**谓词生成器**

要实现简单的谓词查询，可以使用函数 `where`：

```kt
fun nameEquals(name: String?) = where<Person> { root[Person::name] eq name }

fun ageIsLessThan(age: Int) = where<Person> { root[Person::age] lt age }
```

这里是添加到 `jakarta.persistence.criteria.Expression` 中的上下文扩展函数，允许在表达式实例上直接使用 `jakarta.persistence.criteria.CriteriaBuilder` 中的谓词方法。其中大部分是下位函数，允许使用语法：`root[Person::name] eq "Xyz"`。

在连词/副词中可以使用 `and`、`or`，否定使用 `not`：

```kotlin
fun nameOrAgeMatches(age: Int, name: String?) = where<Person> {
    or {
        root[Person::name] eq name
        root[Person::age] lt age
    }
}
```

可以通过 [JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/JpaSpecificationExecutor.html) 中的以下方法使用 `where` 谓词生成器：

- findOne(io.micronaut.data.repository.jpa.criteria.PredicateSpecification)
- findAll(io.micronaut.data.repository.jpa.criteria.PredicateSpecification)
- findAll(io.micronaut.data.repository.jpa.criteria.PredicateSpecification, io.micronaut.data.model.Sort)
- findAll(io.micronaut.data.repository.jpa.criteria.PredicateSpecification, io.micronaut.data.model.Pageable)
- count(io.micronaut.data.repository.jpa.criteria.PredicateSpecification)
- deleteAll(io.micronaut.data.repository.jpa.criteria.PredicateSpecification)

*使用连接的示例*

```kotlin
personRepository.findOne(where {
    val manufacturer = root.joinOne(Product::manufacturer)
    manufacturer[Manufacturer::name] eq name
})
```

*删除的示例*

```kotlin
val recordsDeleted = personRepository.deleteAll(where {
    root[Person::name] eq "Denis"
})
```

**更新生成器**

要实现更新查询，可以使用函数 `update`：

```kotlin
val updateQuery = update<Person> {
    set(Person::name, "Frank")
    where {
        root[Person::name] eq "Denis"
    }
}
personRepository.updateAll(updateQuery)
```

## 3.7 多租户

Micronaut Data 支持多租户，允许单个 Micronaut 应用程序使用多个数据库或模式。

*支持的多租户模式*

- DATASOURCE —— 带有单独连接池的单独数据库用于存储每个租户的数据。每个租户将使用不同的内部存储库操作/事务管理器实例。
- SCHEMA —— 使用相同的数据库，但不同的模式来存储每个租户的数据。仅支持 JDBC/R2DBC/MongoDB（集合）

**数据源模式**

DATASOURCE 模式与 micronaut-multitenancy 库结合使用，以解析租户名称。在下面的示例中，租户解析器被设置为使用 http 标头。更多信息，参阅 [Micronaut Multitenancy](/multitenancy)。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.data.multi-tenancy.mode=DATASOURCE
micronaut.multitenancy.tenantresolver.httpheader.enabled=true
datasources.foo.url=jdbc:h2:mem:dbTenantFoo
datasources.foo.driverClassName=org.h2.Driver
datasources.foo.username=sa
datasources.foo.password=
datasources.foo.schema-generate=CREATE_DROP
datasources.foo.dialect=H2
datasources.bar.url=jdbc:h2:mem:dbTenantBar
datasources.bar.driverClassName=org.h2.Driver
datasources.bar.username=sa
datasources.bar.password=
datasources.bar.schema-generate=CREATE_DROP
datasources.bar.dialect=H2
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  data:
    multi-tenancy:
      mode: DATASOURCE
  multitenancy:
    tenantresolver:
      httpheader:
        enabled: true

datasources:
  foo:
    url: jdbc:h2:mem:dbTenantFoo
    driverClassName: org.h2.Driver
    username: sa
    password: ''
    schema-generate: CREATE_DROP
    dialect: H2
  bar:
    url: jdbc:h2:mem:dbTenantBar
    driverClassName: org.h2.Driver
    username: sa
    password: ''
    schema-generate: CREATE_DROP
    dialect: H2
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.data]
    [micronaut.data.multi-tenancy]
      mode="DATASOURCE"
  [micronaut.multitenancy]
    [micronaut.multitenancy.tenantresolver]
      [micronaut.multitenancy.tenantresolver.httpheader]
        enabled=true
[datasources]
  [datasources.foo]
    url="jdbc:h2:mem:dbTenantFoo"
    driverClassName="org.h2.Driver"
    username="sa"
    password=""
    schema-generate="CREATE_DROP"
    dialect="H2"
  [datasources.bar]
    url="jdbc:h2:mem:dbTenantBar"
    driverClassName="org.h2.Driver"
    username="sa"
    password=""
    schema-generate="CREATE_DROP"
    dialect="H2"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  data {
    multiTenancy {
      mode = "DATASOURCE"
    }
  }
  multitenancy {
    tenantresolver {
      httpheader {
        enabled = true
      }
    }
  }
}
datasources {
  foo {
    url = "jdbc:h2:mem:dbTenantFoo"
    driverClassName = "org.h2.Driver"
    username = "sa"
    password = ""
    schemaGenerate = "CREATE_DROP"
    dialect = "H2"
  }
  bar {
    url = "jdbc:h2:mem:dbTenantBar"
    driverClassName = "org.h2.Driver"
    username = "sa"
    password = ""
    schemaGenerate = "CREATE_DROP"
    dialect = "H2"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    data {
      multi-tenancy {
        mode = "DATASOURCE"
      }
    }
    multitenancy {
      tenantresolver {
        httpheader {
          enabled = true
        }
      }
    }
  }
  datasources {
    foo {
      url = "jdbc:h2:mem:dbTenantFoo"
      driverClassName = "org.h2.Driver"
      username = "sa"
      password = ""
      schema-generate = "CREATE_DROP"
      dialect = "H2"
    }
    bar {
      url = "jdbc:h2:mem:dbTenantBar"
      driverClassName = "org.h2.Driver"
      username = "sa"
      password = ""
      schema-generate = "CREATE_DROP"
      dialect = "H2"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "micronaut": {
    "data": {
      "multi-tenancy": {
        "mode": "DATASOURCE"
      }
    },
    "multitenancy": {
      "tenantresolver": {
        "httpheader": {
          "enabled": true
        }
      }
    }
  },
  "datasources": {
    "foo": {
      "url": "jdbc:h2:mem:dbTenantFoo",
      "driverClassName": "org.h2.Driver",
      "username": "sa",
      "password": "",
      "schema-generate": "CREATE_DROP",
      "dialect": "H2"
    },
    "bar": {
      "url": "jdbc:h2:mem:dbTenantBar",
      "driverClassName": "org.h2.Driver",
      "username": "sa",
      "password": "",
      "schema-generate": "CREATE_DROP",
      "dialect": "H2"
    }
  }
}
```

  </TabItem>
</Tabs>

以下 HTTP 客户端将访问不同的租户数据源：

```java
@Header(name = "tenantId", value = "foo")
@Client("/books")
interface FooBookClient extends BookClient {
}

@Header(name = "tenantId", value = "bar")
@Client("/books")
interface BarBookClient extends BookClient {
}
```

**Schema 模式**

SCHEMA 模式使用单一数据源，并根据已解决的租户设置活动模式。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.data.multi-tenancy.mode=SCHEMA
micronaut.multitenancy.tenantresolver.httpheader.enabled=true
datasources.default.url=jdbc:h2:mem:db
datasources.default.driverClassName=org.h2.Driver
datasources.default.username=sa
datasources.default.password=
datasources.default.dialect=H2
datasources.default.schema-generate=CREATE_DROP
datasources.default.schema-generate-names[0]=foo
datasources.default.schema-generate-names[1]=bar
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  data:
    multi-tenancy:
      mode: SCHEMA
  multitenancy:
    tenantresolver:
      httpheader:
        enabled: true

datasources:
  default:
    url: jdbc:h2:mem:db
    driverClassName: org.h2.Driver
    username: sa
    password: ''
    dialect: H2
    schema-generate: CREATE_DROP
    schema-generate-names:
      - foo
      - bar
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.data]
    [micronaut.data.multi-tenancy]
      mode="SCHEMA"
  [micronaut.multitenancy]
    [micronaut.multitenancy.tenantresolver]
      [micronaut.multitenancy.tenantresolver.httpheader]
        enabled=true
[datasources]
  [datasources.default]
    url="jdbc:h2:mem:db"
    driverClassName="org.h2.Driver"
    username="sa"
    password=""
    dialect="H2"
    schema-generate="CREATE_DROP"
    schema-generate-names=[
      "foo",
      "bar"
    ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  data {
    multiTenancy {
      mode = "SCHEMA"
    }
  }
  multitenancy {
    tenantresolver {
      httpheader {
        enabled = true
      }
    }
  }
}
datasources {
  'default' {
    url = "jdbc:h2:mem:db"
    driverClassName = "org.h2.Driver"
    username = "sa"
    password = ""
    dialect = "H2"
    schemaGenerate = "CREATE_DROP"
    schemaGenerateNames = ["foo", "bar"]
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    data {
      multi-tenancy {
        mode = "SCHEMA"
      }
    }
    multitenancy {
      tenantresolver {
        httpheader {
          enabled = true
        }
      }
    }
  }
  datasources {
    default {
      url = "jdbc:h2:mem:db"
      driverClassName = "org.h2.Driver"
      username = "sa"
      password = ""
      dialect = "H2"
      schema-generate = "CREATE_DROP"
      schema-generate-names = ["foo", "bar"]
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "micronaut": {
    "data": {
      "multi-tenancy": {
        "mode": "SCHEMA"
      }
    },
    "multitenancy": {
      "tenantresolver": {
        "httpheader": {
          "enabled": true
        }
      }
    }
  },
  "datasources": {
    "default": {
      "url": "jdbc:h2:mem:db",
      "driverClassName": "org.h2.Driver",
      "username": "sa",
      "password": "",
      "dialect": "H2",
      "schema-generate": "CREATE_DROP",
      "schema-generate-names": ["foo", "bar"]
    }
  }
}
```

  </TabItem>
</Tabs>

:::tip 注意
您可以使用属性 `schema-generate-names` 指定要创建和初始化的多个模式，以便进行测试。
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-data/latest/guide/#shared)

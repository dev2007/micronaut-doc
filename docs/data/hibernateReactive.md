---
sidebar_position: 50
---

# 5. Micronaut Data Hibernate Reactive

Hibernate Reactive 为传统的JPA带来了响应性。

通过将 Hibernate Reactive 与 Micronaut Data 结合使用，你可以使用与仓库、JPA 标准等相同的功能，但却是以一种响应的方式。

有关 Hibernate Reactive 的更多信息，参阅[官方文档](https://hibernate.org/reactive/documentation/)。

包括 Hibernate Reactive Micronaut Data 支持：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.data:micronaut-data-hibernate-reactive")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.data</groupId>
    <artifactId>micronaut-data-hibernate-reactive</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

:::tip 提示
Micronaut Data 中的 Hibernate Reactive 需要 Hibernate 6。
:::

配置与普通的 [Hibernate 快速入门](/data/hibernate#42-快速入门)不同，因为 Hibernate Reactive 使用的不是传统的 JDBC 驱动，而是 Vertx 项目提供的自定义驱动。你需要为你的数据库选择一个合适的驱动：

对于 MySQL：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.vertx:vertx-mysql-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.vertx</groupId>
    <artifactId>vertx-mysql-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

对于 Postgres：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.vertx:vertx-pg-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.vertx</groupId>
    <artifactId>vertx-pg-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

对于 Microsoft SQLServer：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.vertx:vertx-mssql-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.vertx</groupId>
    <artifactId>vertx-mssql-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

对于 Oracle：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.vertx:vertx-oracle-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.vertx</groupId>
    <artifactId>vertx-oracle-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

并基于 [Micronaut SQL Hibernate Reactive 支持](/data/hibernate)进行配置。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
jpa.default.reactive=true
jpa.default.properties.hibernate.hbm2ddl.auto=create-drop
jpa.default.properties.hibernate.show_sql=true
jpa.default.properties.hibernate.connection.url=jdbc:mysql://localhost:3307/my_db
jpa.default.properties.hibernate.connection.username=myUser
jpa.default.properties.hibernate.connection.password=myPassword
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
jpa:
  default:
    reactive: true
    properties:
      hibernate:
        hbm2ddl:
          auto: create-drop
        show_sql: true
        connection:
          url: jdbc:mysql://localhost:3307/my_db
          username: myUser
          password: myPassword
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[jpa]
  [jpa.default]
    reactive=true
    [jpa.default.properties]
      [jpa.default.properties.hibernate]
        [jpa.default.properties.hibernate.hbm2ddl]
          auto="create-drop"
        show_sql=true
        [jpa.default.properties.hibernate.connection]
          url="jdbc:mysql://localhost:3307/my_db"
          username="myUser"
          password="myPassword"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
jpa {
  'default' {
    reactive = true
    properties {
      hibernate {
        hbm2ddl {
          auto = "create-drop"
        }
        show_sql = true
        connection {
          url = "jdbc:mysql://localhost:3307/my_db"
          username = "myUser"
          password = "myPassword"
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  jpa {
    default {
      reactive = true
      properties {
        hibernate {
          hbm2ddl {
            auto = "create-drop"
          }
          show_sql = true
          connection {
            url = "jdbc:mysql://localhost:3307/my_db"
            username = "myUser"
            password = "myPassword"
          }
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "jpa": {
    "default": {
      "reactive": true,
      "properties": {
        "hibernate": {
          "hbm2ddl": {
            "auto": "create-drop"
          },
          "show_sql": true,
          "connection": {
            "url": "jdbc:mysql://localhost:3307/my_db",
            "username": "myUser",
            "password": "myPassword"
          }
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

Hibernate 反应式是非阻塞的，你定义的仓资源库接口和类都会扩展其中一个响应式仓库：

*表 1. 内置响应式仓库接口*

|接口|描述|
|--|--|
|[ReactiveStreamsCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactiveStreamsCrudRepository.html)|扩展了 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html)，并添加了返回 [Publisher](https://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 的 CRUD 方法|
|[ReactorCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactorCrudRepository.html)|扩展了 ReactiveStreamsCrudRepository，并使用了 Reactor 返回类型|
|[RxJavaCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/RxJavaCrudRepository.html)|扩展 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html) 并添加可返回 RxJava 2 类型的 CRUD 方法|
|[CoroutineCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/kotlin/CoroutineCrudRepository.html)|扩展了 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html)，并使用 Kotlin 例程进行反应式 CRUD 操作|
|[ReactiveStreamsJpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/jpa/reactive/ReactiveStreamsJpaSpecificationExecutor.html)|响应式 JPA 标准执行器|
|[ReactorJpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/jpa/reactive/ReactorJpaSpecificationExecutor.html)|使用 Reactor `Flux`/`Mono` 类公开方法的响应式 JPA 标准执行器|

下面是一个 Hibernate Reactive 仓库示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Repository // (1)
interface BookRepository extends ReactorCrudRepository<Book, Long> { // (2)

    Mono<Book> find(String title);

    Mono<BookDTO> findOne(String title);

    Flux<Book> findByPagesGreaterThan(int pageCount, Pageable pageable);

    Mono<Page<Book>> findByTitleLike(String title, Pageable pageable);

    Mono<Slice<Book>> list(Pageable pageable);

    @Transactional
    default Mono<Void> findByIdAndUpdate(Long id, Consumer<Book> bookConsumer) {
        return findById(id).map(book -> {
            bookConsumer.accept(book);
            return book;
        }).then();
    }

    Mono<Book> save(Book entity);

    Mono<Book> update(Book newBook);

    Mono<Void> update(@Id Long id, int pages);

    @Override
    Mono<Long> deleteAll();

    Mono<Void> delete(String title);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Repository // (1)
abstract class BookRepository implements ReactorCrudRepository<Book, Long> { // (2)

    abstract Mono<Book> find(String title);

    abstract Mono<Page<Book>> findByTitleLike(String title, Pageable pageable);

    abstract Mono<BookDTO> findOne(String title);

    abstract Flux<Book> findByPagesGreaterThan(int pageCount, Pageable pageable);

    abstract Mono<Slice<Book>> list(Pageable pageable);

    abstract Mono<Book> save(Book entity);

    @Transactional
    Mono<Void> findByIdAndUpdate(Long id, Consumer<Book> bookConsumer) {
        return findById(id).map(book -> {
            bookConsumer.accept(book)
            return book
        }).then()
    }

    abstract Mono<Book> update(Book newBook);

    abstract Mono<Void> update(@Id Long id, int pages);

    @Override
    abstract Mono<Long> deleteAll();

    abstract Mono<Void> delete(String title);
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Repository // (1)
interface BookRepository : CoroutineCrudRepository<Book, Long> { // (2)

    suspend fun find(title: String): Book

    suspend fun findOne(title: String): BookDTO

    suspend fun findByPagesGreaterThan(pageCount: Int, pageable: Pageable): List<Book>

    suspend fun findByTitleLike(title: String, pageable: Pageable): Page<Book>

    suspend fun list(pageable: Pageable): Slice<Book>

    suspend fun save(entity: Book): Book

    @Query("INSERT INTO Book(title, pages) VALUES (:title, :pages)")
    suspend fun insert(title: String, pages: Int)

    @Transactional
    suspend fun findByIdAndUpdate(id: Long, bookConsumer: Consumer<Book?>) {
        bookConsumer.accept(findById(id))
    }

    suspend fun update(newBook: Book): Book

    suspend fun update(@Id id: Long?, pages: Int)

    suspend fun delete(title: String)
}
```

  </TabItem>
</Tabs>

1. 接口使用 [@Repository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Repository.html) 进行注解
2. `ReactorCrudRepository` 接口接受 2 个通用参数，即实体类型（此处为 `Book`）和 ID 类型（此处为 `Long`）。

**保存实例（创建）**

要保存实例，请使用 `ReactorCrudRepository` 接口的 `save` 方法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Book book = new Book();
book.setTitle("The Stand");
book.setPages(1000);
bookRepository.save(book).block();
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Book book = new Book(title:"The Stand", pages:1000)
bookRepository.save(book).block()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
var book = Book(0, "The Stand", 1000)
bookRepository.save(book)
```

  </TabItem>
</Tabs>

**检索实例（读取）**

要回读一个 book，请使用 `findById`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
book = bookRepository.findById(id).block();
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
book = bookRepository.findById(id).block()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
book = bookRepository.findById(id)!!
```

  </TabItem>
</Tabs>

**更新实例（更新）**

要更新实例，我们使用自定义方法在事务中进行更新：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
bookRepository.findByIdAndUpdate(id) {
    it.title = "Changed"
}.block()
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
bookRepository.findByIdAndUpdate(id) {
    it.title = "Changed"
}.block()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
bookRepository.findByIdAndUpdate(id) {
    it!!.title = "Changed"
}
```

  </TabItem>
</Tabs>

**删除实例（删除）**

要删除一个实例，请使用 `deleteById`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
bookRepository.deleteById(id).block();
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
bookRepository.deleteById(id).block()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
bookRepository.deleteById(id).block()
```

  </TabItem>
</Tabs>

:::tip 注意
这些示例使用 `block` 来检索结果，在您的应用程序中，您绝对不应该阻塞反应式存储库，因为这可能会导致性能问题，而且后盾实现可能也不支持这种阻塞。
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-data/latest/guide/#hibernateReactive)

---
sidebar_position: 70
---

# 7. Micronaut Data MongoDB

Micronaut Data MongoDB 支持 JPA 和 JDBC/R2DBC 实现的大部分功能，包括：

- [具有编译时生成的过滤、聚合的仓库](#72-仓库)和[投影](/data/shared#334-查询投影)查询
- [实体关系和级联](#736-关联映射)
- [事务](/data/shared#35-事务)
- [连接关系](#74-连接查询)
- [JPA 标准 API](#76-带有标准的仓库)
- [属性转换器](#75-使用属性转换器)
- [优化锁定](#77-乐观锁定)

对象层与 MongoDB 驱动程序序列化/反序列化之间的交互是通过 [Micronaut 序列化](/serialization)和 BSON 支持实现的。

## 7.1 快速入门

最快速的入门方法是使用 [Micronaut Launch](https://micronaut.io/launch/) 创建一个新的 Micronaut 应用程序，然后选择 `data-mongodb` 或 `data-mongodb-async`。

:::note 提示
你还可以在 Micronaut Guides 中找到关于构建 Micronaut Data MongoDB 应用程序的精彩指南，包括各种语言的示例代码：[使用 Micronaut Data MongoDB 访问 MongoDB 数据库](https://guides.micronaut.io/latest/micronaut-data-mongodb-synchronous.html)和[使用 Micronaut Data MongoDB 和响应流异步访问 MongoDB 数据库](https://guides.micronaut.io/latest/micronaut-data-mongodb-asynchronous.html)。
:::

点击下表中的链接之一，您将进入 [Micronaut Launch](https://micronaut.io/launch/)，其中的相应选项已根据您选择的语言和构建工具进行了预配置：

*表 1. 使用 Micronaut Launch 创建 MongoDB 应用程序*

||Gradle|Maven|
|--|--|--|
|Java|[打开](https://micronaut.io/launch?features=data-mongodb&lang=JAVA&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-mongodb&lang=JAVA&build=MAVEN)|
|Kotlin|[打开](https://micronaut.io/launch?features=data-mongodb&lang=KOTLIN&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-mongodb&lang=KOTLIN&build=MAVEN)|
|Groovy|[打开](https://micronaut.io/launch?features=data-mongodb&lang=GROOVY&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-mongodb&lang=GROOVY&build=MAVEN)|

*表 2. 使用 Micronaut Launch 创建反应式 MongoDB 应用程序*

||Gradle|Maven|
|--|--|--|
|Java|[打开](https://micronaut.io/launch?features=data-mongodb-reactive&lang=JAVA&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-mongodb-reactive&lang=JAVA&build=MAVEN)|
|Kotlin|[打开](https://micronaut.io/launch?features=data-mongodb-reactive&lang=KOTLIN&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-mongodb-reactive&lang=KOTLIN&build=MAVEN)|
|Groovy|[打开](https://micronaut.io/launch?features=data-mongodb-reactive&lang=GROOVY&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-mongodb-reactive&lang=GROOVY&build=MAVEN)|

*使用 CLI 创建应用程序*

```bash
# For Maven add: --build maven
$ mn create-app --lang java example --features data-mongodb
```

或通过 `curl`：

*使用 `curl` 创建应用程序*

```bash
# For Maven add to the URL: &build=maven
$ curl https://launch.micronaut.io/demo.zip?lang=java&features=data-mongodb -o demo.zip && unzip demo.zip -d demo && cd demo
```

预生成的应用程序应已正确设置好一切。你可以按照手动配置说明正确理解依赖关系设置。

要开始使用 Micronaut Data MongoDB，请在注释处理器路径中添加以下依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut.data:micronaut-data-document-processor")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut.data</groupId>
        <artifactId>micronaut-data-document-processor</artifactId>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

:::tip 注意
对于 Kotlin，依赖应位于 `kapt` 作用域中，而对于 Groovy，依赖应位于 `compileOnly` 作用域中。
:::

然后，你应该配置对 `micronaut-data-mongodb` 模块的编译范围依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.data:micronaut-data-mongodb")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.data</groupId>
    <artifactId>micronaut-data-mongodb</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

并包含 MongoDB 同步驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("org.mongodb:mongodb-driver-sync")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.mongodb</groupId>
    <artifactId>mongodb-driver-sync</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

或响应式 MongoDB 驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("org.mongodb:mongodb-driver-reactivestreams")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.mongodb</groupId>
    <artifactId>mongodb-driver-reactivestreams</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

不可能同时使用两种驱动。如果两个驱动都在 classpath 上，你可以使用属性 `micronaut.data.mongodb.driver-type` 和值：`sync` 或 `reactive` 来选择合适的驱动。

接下来，你需要配置至少一个数据源。下面的应用程序配置文件片段是配置默认 MongoDB 数据源的示例：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
mongodb.uri=mongodb://username:password@localhost:27017/databaseName
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
mongodb:
  uri: mongodb://username:password@localhost:27017/databaseName
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[mongodb]
  uri="mongodb://username:password@localhost:27017/databaseName"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
mongodb {
  uri = "mongodb://username:password@localhost:27017/databaseName"
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  mongodb {
    uri = "mongodb://username:password@localhost:27017/databaseName"
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "mongodb": {
    "uri": "mongodb://username:password@localhost:27017/databaseName"
  }
}
```

  </TabItem>
</Tabs>

要从数据库中检索对象，需要定义一个注解为 [@MappedEntity](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedEntity.html) 的类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MappedEntity
public class Book {
    @Id
    @GeneratedValue
    private ObjectId id;
    private String title;
    private int pages;

    public Book(String title, int pages) {
        this.title = title;
        this.pages = pages;
    }
    // ...
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@MappedEntity
class Book {
    @Id
    @GeneratedValue
    private ObjectId id
    private String title
    private int pages

    Book(String title, int pages) {
        this.title = title
        this.pages = pages
    }
    //...
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MappedEntity
data class Book(@field:Id
                @GeneratedValue
                var id: ObjectId,
                var title: String,
                var pages: Int = 0)
```

  </TabItem>
</Tabs>

随后是一个继承 [CrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/CrudRepository.html) 的接口：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.Id;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.Slice;
import io.micronaut.data.mongodb.annotation.MongoAggregateQuery;
import io.micronaut.data.mongodb.annotation.MongoDeleteQuery;
import io.micronaut.data.mongodb.annotation.MongoFindQuery;
import io.micronaut.data.mongodb.annotation.MongoRepository;
import io.micronaut.data.mongodb.annotation.MongoUpdateQuery;
import io.micronaut.data.repository.CrudRepository;
import org.bson.types.ObjectId;

import java.util.List;


@MongoRepository // (1)
interface BookRepository extends CrudRepository<Book, ObjectId> { // (2)
    Book find(String title);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.data.annotation.Id
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.Slice
import io.micronaut.data.mongodb.annotation.MongoAggregateQuery
import io.micronaut.data.mongodb.annotation.MongoDeleteQuery
import io.micronaut.data.mongodb.annotation.MongoFindQuery
import io.micronaut.data.mongodb.annotation.MongoRepository
import io.micronaut.data.mongodb.annotation.MongoUpdateQuery
import io.micronaut.data.repository.CrudRepository
import org.bson.types.ObjectId

@MongoRepository // (1)
interface BookRepository extends CrudRepository<Book, ObjectId> { // (2)
    Book find(String title);
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.context.annotation.Executable
import io.micronaut.data.annotation.Id
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.Slice
import io.micronaut.data.mongodb.annotation.*
import io.micronaut.data.repository.CrudRepository
import org.bson.types.ObjectId

@MongoRepository // (1)
interface BookRepository : CrudRepository<Book, ObjectId> { // (2)
    @Executable
    fun find(title: String): Book
}
```

  </TabItem>
</Tabs>

1. 接口使用 [@MongoRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MongoRepository.html) 注解
2. `CrudRepository` 接口接受 2 个通用参数，即实体类型（本例中为 `Book`）和 ID 类型（本例中为 `ObjectId`）。

现在，您可以对实体执行 CRUD（创建、读取、更新、删除）操作。`example.BookRepository` 的实现是在编译时创建的。要获得对它的引用，只需注入 Bean：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Inject BookRepository bookRepository;
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Inject @Shared BookRepository bookRepository
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Inject
lateinit var bookRepository: BookRepository
```

  </TabItem>
</Tabs>

**保存实例（创建）**

要保存实例，请使用 `CrudRepository` 接口的 `save` 方法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Book book = new Book("The Stand", 1000);
bookRepository.save(book);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Book book = new Book("The Stand", 1000)
bookRepository.save(book)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
var book = Book(ObjectId(),"The Stand", 1000)
bookRepository.save(book)
```

  </TabItem>
</Tabs>

**检索实例（读取）**

要回读一个 book，请使用 `findById`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
book = bookRepository.findById(id).orElse(null);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
book = bookRepository.findById(id).orElse(null)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
book = bookRepository.findById(id).orElse(null)
```

  </TabItem>
</Tabs>

**更新实例（更新）**

使用 Micronaut Data MongoDB，您必须手动实现 `update` 方法，因为 MongoDB 的实现不包括任何脏检查或持久化会话概念。因此，您必须为存储库中的更新定义显式更新方法。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void update(@Id ObjectId id, int pages);

void update(@Id ObjectId id, String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void update(@Id ObjectId id, int pages);

void update(@Id ObjectId id, String title);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun update(@Id id: ObjectId, pages: Int)

fun update(@Id id: ObjectId, title: String)
```

  </TabItem>
</Tabs>

然后就可以这样调用了：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
bookRepository.deleteById(id);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
bookRepository.deleteById(id)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
bookRepository.deleteById(id)
```

  </TabItem>
</Tabs>

恭喜您已经实施了第一个 Micronaut Data MongoDB 仓库！继续阅读，了解更多信息。

:::tip 注意
Micronaut Data MongoDB 支持通过设置属性 `micronaut.data.mongodb.create-collections` 为 `true` 来创建集合。MongoDB 会自动创建它们，除了少数情况，如事务上下文，在这种情况下集合需要已经存在。
:::

## 7.2 仓库

如[快速入门](#71-快速入门)中所述，Micronaut Data 中的 MongoDB 仓库被定义为使用 [@MongoRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoRepository.html) 进行注解的接口。

在多服务器场景中，`serverName` 注解属性可用于指定要使用的数据源配置。默认情况下，Micronaut Data 会查找默认服务器。

例如：

```java
@MongoRepository(serverName = "inventoryServer") (1)
public interface PhoneRepository extends CrudRepository<Phone, Integer> {
    Optional<Phone> findByAssetId(@NotNull Integer assetId);
}
```

1. `@MongoRepository` 标识了访问 MongoDB 的接口，并指向服务器配置 "inventoryServer"。

根据方法签名或为 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html) 接口指定的通用类型参数，可确定将哪个实体作为根实体进行查询。

如果无法确定根实体，则会出现编译错误。

MongoDB 支持与 JPA 实现相同的接口。

请注意，除了接口外，您还可以将仓库定义为抽象类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.mongodb.annotation.MongoRepository;
import io.micronaut.data.repository.CrudRepository;
import org.bson.types.ObjectId;

import java.util.List;

@MongoRepository
public abstract class AbstractBookRepository implements CrudRepository<Book, ObjectId> {

    public abstract List<Book> findByTitle(String title);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example;

import io.micronaut.data.mongodb.annotation.MongoRepository;
import io.micronaut.data.repository.CrudRepository;
import org.bson.types.ObjectId;

import java.util.List;

@MongoRepository
public abstract class AbstractBookRepository implements CrudRepository<Book, ObjectId> {

    public abstract List<Book> findByTitle(String title);
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.mongodb.annotation.MongoRepository
import io.micronaut.data.repository.CrudRepository
import org.bson.types.ObjectId

@MongoRepository
abstract class AbstractBookRepository : CrudRepository<Book, ObjectId> {

    abstract fun findByTitle(title: String): List<Book>
}
```

  </TabItem>
</Tabs>

:::tip 注意
您可以使用版本库注解指定 MongoDB 的数据库名称：`@MongoRepository(databaseName = "mydb")`，或在连接 url 中指定：`mongodb://username:password@localhost:27017/mydb`。
:::

Micronaut Data MongoDB 引入了一个特殊的仓库接口 [MongoQueryExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/repository/MongoQueryExecutor.html)，它接受 `Bson/List<Bson>` 过滤/管道/更新参数，旨在与 MongoDB DSL API 结合使用：

- `com.mongodb.client.model.Filters`
- `com.mongodb.client.model.Aggregates`
- `com.mongodb.client.model.Updates`

Micronaut Data MongoDB 支持的特定条件允许通过检查给定字段中字符串在列表或数组中的出现情况来过滤文档，可以使用 `ArrayContains` 或 `CollectionContains` 条件来实现。下面是一个仓库方法声明示例，它将搜索兴趣字段（字符串列表）包含给定值的人：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
List<Person> findByInterestsCollectionContains(String interest);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
List<Person> findByInterestsCollectionContains(String interest)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
List<Person> findByInterestsCollectionContains(String interest)
```

  </TabItem>
</Tabs>

Micronaut Data MongoDB 支持使用 `ArrayContains` 或 `CollectionContainscriteria` 对单个或多个值进行数组或列表包含检查。

### 7.2.1 访问数据

与 JPA/Hibernate 不同，Micronaut Data MongoDB 是无状态的，没有需要状态管理的持久化会话概念。

由于没有会话，所以不支持脏检查等功能。这对定义插入和更新的仓库方法有影响。

默认情况下，当使用 `save(MyEntity)` 等方法保存实体时，总是执行插入操作，因为 Micronaut Data 无法知道实体是否与特定会话相关联。

如果你想更新一个实体，你应该使用 `update(MyEntity)`，或者定义一个合适的更新方法，例如只更新你想更新的数据：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void update(@Id ObjectId id, int pages);

void update(@Id ObjectId id, String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void update(@Id ObjectId id, int pages);

void update(@Id ObjectId id, String title);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun update(@Id id: ObjectId, pages: Int)

fun update(@Id id: ObjectId, title: String)
```

  </TabItem>
</Tabs>

### 7.2.2 自定义查询和选项

Micronaut Data MongoDB 引入了一些注解，可用于定义自定义查询和修改默认选项：

*表 1. Micronaut Data MongoDB 注解*

|注解|描述|
|--|--|
|[@MongoFindQuery](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoFindQuery.html)|允许定义自定义查找方法的执行，并为过滤、排序、投影和整理提供值。|
|[@MongoAggregateQuery](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoAggregateQuery.html)允许使用管道值定义自定义聚合方法的执行。|
|[@MongoUpdateQuery](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoUpdateQuery.html)|允许使用过滤器、更新和校对值定义自定义更新方法的执行。|
|[@MongoDeleteQuery](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoDeleteQuery.html)|允许定义自定义更新方法的执行，并为过滤器和校对设置值。|
|[@MongoFilter](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoFilter.html)|允许为支持自定义过滤器的操作定义自定义过滤器值。可用于注释以创建预定义的筛选器注释。|
|[@MongoSort](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoSort.html)|允许为支持自定义排序的操作定义自定义排序值。可用于存储库类，以定义默认排序或创建预定义排序注解。|
|[@MongoProjection](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoProjection.html)|允许为支持自定义投影的操作定义自定义投影值。可用于存储库类，以定义默认投影或创建预定义投影注解。|
|[@MongoCollation](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoCollation.html)|允许为支持自定义校对的操作定义自定义校对值。可用于存储库类，以定义默认校对或创建预定义校对注解。|
|[@MongoAggregateOptions](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoAggregateOptions.html)|聚合操作选项。|
|[@MongoFindOptions](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoFindOptions.html)|查找操作选项。|
|[@MongoUpdateOptions](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoUpdateOptions.html)|更新操作选项。|
|[@MongoDeleteOptions](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/mongodb/annotation/MongoDeleteOptions.html)|删除操作选项。|

MongoDB 的自定义查询以 JSON 格式定义，方法参数可作为以 `:` 为前缀的变量引用。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MongoFindQuery(filter = "{title:{$regex: :t}}", sort = "{title: 1}")
List<Book> customFind(String t);

@MongoAggregateQuery("[{$match: {name:{$regex: :t}}}, {$sort: {name: 1}}, {$project: {name: 1}}]")
List<Person> customAggregate(String t);

@MongoUpdateQuery(filter = "{title:{$regex: :t}}", update = "{$set:{name: 'tom'}}")
List<Book> customUpdate(String t);

@MongoDeleteQuery(filter = "{title:{$regex: :t}}", collation = "{locale:'en_US', numericOrdering:true}")
void customDelete(String t);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@MongoFindQuery(filter = '{title:{$regex: :t}}', sort = '{title: 1}')
List<Book> customFind(String t);

@MongoAggregateQuery('[{$match: {name:{$regex: :t}}}, {$sort: {name: 1}}, {$project: {name: 1}}]')
List<Person> customAggregate(String t)

@MongoUpdateQuery(filter = '{title:{$regex: :t}}', update = '{$set:{name: "tom"}}')
List<Book> customUpdate(String t);

@MongoDeleteQuery(filter = '{title:{$regex: :t}}', collation = "{locale:'en_US', numericOrdering:true}")
void customDelete(String t);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MongoFindQuery(filter = "{title:{\$regex: :t}}", sort = "{title: 1}")
fun customFind(t: String): List<Book>

@MongoAggregateQuery("[{\$match: {name:{\$regex: :t}}}, {\$sort: {name: 1}}, {\$project: {name: 1}}]")
fun customAggregate(t: String): List<Person>

@MongoUpdateQuery(filter = "{title:{\$regex: :t}}", update = "{\$set:{name: 'tom'}}")
fun customUpdate(t: String): List<Book>

@MongoDeleteQuery(filter = "{title:{\$regex: :t}}", collation = "{locale:'en_US', numericOrdering:true}")
fun customDelete(t: String)
```

  </TabItem>
</Tabs>

:::tip 注意
只有过滤器、管道和更新的查询可以引用方法参数。
:::

某些注解支持在资源库上定义，可用于为所有支持该注解的操作提供默认值：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MongoFindOptions(allowDiskUse = true, maxTimeMS = 1000)
@MongoAggregateOptions(allowDiskUse = true, maxTimeMS = 100)
@MongoCollation("{ locale: 'en_US', numericOrdering: true}")
@MongoRepository
public interface SaleRepository extends CrudRepository<Sale, ObjectId> {
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@MongoFindOptions(allowDiskUse = true, maxTimeMS = 1000L)
@MongoAggregateOptions(allowDiskUse = true, maxTimeMS = 100L)
@MongoCollation("{ locale: 'en_US', numericOrdering: true}")
@MongoRepository
interface SaleRepository extends CrudRepository<Sale, ObjectId> {
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MongoFindOptions(allowDiskUse = true, maxTimeMS = 1000)
@MongoAggregateOptions(allowDiskUse = true, maxTimeMS = 100)
@MongoCollation("{ locale: 'en_US', numericOrdering: true}")
@MongoRepository
interface SaleRepository : CrudRepository<Sale, ObjectId> {
```

  </TabItem>
</Tabs>

## 7.3 映射实体

如快速入门部分所述，如果你需要自定义实体如何映射到集合和集合的属性名，你需要使用 Micronaut Data 自己在 `io.micronaut.data.annotation` 包中的注解。

Micronaut Data MongoDB 的一个重要方面是实体类必须与 Micronaut Data 一起编译。这是因为 Micronaut Data 在编译时预先计算了持久化模型（实体之间的关系、类/属性名称到集合/属性名称的映射），这也是 Micronaut Data MongoDB 能够快速启动的原因之一。

下面是一个使用 Micronaut Data 注释进行映射的例子：

*Micronaut Data 注解映射示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MappedEntity // (1)
public class Country {

    @Id
    private ObjectId id; // (2)

    @Relation(value = Relation.Kind.ONE_TO_MANY, mappedBy = "country")
    private Set<CountryRegion> regions; // (3)

    private String name; // (4)

    // ...
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@MappedEntity // (1)
class Country {

    @Id
    private ObjectId id // (2)

    @Relation(value = Relation.Kind.ONE_TO_MANY, mappedBy = "country")
    private Set<CountryRegion> regions // (3)

    private String name // (4)

    // ...
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MappedEntity // (1)
data class Country(
        @field:Id
        val id: ObjectId, // (2)
        @Relation(value = Relation.Kind.ONE_TO_MANY, mappedBy = "country")
        val regions: Set<CountryRegion>, // (3)
        val name: String // (4)
        )
```

  </TabItem>
</Tabs>

1. 该类被标记为映射实体，应在 `country` 集合中持久化
2. id 被定义为 MongoDB 的 `ObjectId`
3. `regions` 存储在由 `CountryRegion` 表示的单独集合中
4. 应在集合中持久化的 `name` 字段

### 7.3.1 映射注解

下表总结了不同的注解及其功能。如果您熟悉并喜欢 JPA 注释，请跳至下一节：

*表 1. Micronaut 数据注解*

|注解|描述|
|--|--|
|[@AutoPopulated](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/AutoPopulated.html)|应由 Micronaut Data 自动填充的值的元注解（如时间戳和 UUID）|
|[@DateCreated](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/DateCreated.html)|允许在插入前分配数据创建值（如 `java.time.Instant`）|
|[@DateUpdated](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/DateUpdated.html)|允许在插入前分配最后更新值（如 `java.time.Instant`）|
|[@Embeddable](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Embeddable.html)|指定 bean 是可嵌入的|
|[@EmbeddedId](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/EmbeddedId.html)|指定实体的嵌入式 ID|
|[@GeneratedValue](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/GeneratedValue.html)|指定属性值由数据库生成，不包含在插入中|
|[@JoinTable](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/JoinTable.html)|指定连接集合关联|
|[@JoinColumn](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/JoinColumn.html)|指定连接属性映射|
|[@Id](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Id.html)|指定实体的 ID|
|[@MappedEntity](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedEntity.html)|指定映射到集合的实体。如果您的集合名称与实体名称不同，请传递名称作为 `value`。例如 `@MappedEntity( value = "my_collection")`。|
|[@MappedProperty](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedProperty.html)|用于自定义属性名称|
|[@Relation](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Relation.html)|用于指定关系（一对一、一对多等）。|
|[@Transient](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Transient.html)|用于指定一个属性为 transient 属性|
|[@Version](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Version.html)|指定实体的版本字段，启用乐观锁定|

Micronaut Data MongoDB 并非 ORM，而是一个简单的数据映射器，因此 JPA 中的许多概念并不适用，不过对于熟悉这些注解的用户来说，使用这些注解还是很方便的。

:::tip 注意
Micronaut Data MongoDB 不支持 JPA 注释
:::

### 7.3.2 ID 生成

MongoDB 的默认 ID 生成方式是使用 `ObjectId` 作为 ID，支持的类型只有两种：默认 `ObjectId` 和简单的 Java 字符串，后者将具有 `ObjectId` 的十六进制值。

您可以移除 `@GeneratedValue` 注解，在这种情况下，我们希望您在调用 `save()` 之前分配一个 ID。

通过添加带有 `@Id` 和 `@AutoPopulated` 注解的属性，还可以支持自动分配 UUID。

### 7.3.3 复合主键

复合主键可以使用 [@EmbeddedId](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/EmbeddedId.html) 注解来定义。复合 ID 需要一个额外的类来表示该键。该类应定义与组成复合键的集合属性相对应的字段。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.EmbeddedId;
import io.micronaut.data.annotation.MappedEntity;

@MappedEntity
public class Project {
    @EmbeddedId
    private ProjectId projectId;
    private String name;

    public Project(ProjectId projectId, String name) {
        this.projectId = projectId;
        this.name = name;
    }

    public ProjectId getProjectId() {
        return projectId;
    }

    public String getName() {
        return name;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.data.annotation.EmbeddedId
import io.micronaut.data.annotation.MappedEntity

@MappedEntity
class Project {
    @EmbeddedId
    private ProjectId projectId
    private String name

    Project(ProjectId projectId, String name) {
        this.projectId = projectId
        this.name = name
    }

    ProjectId getProjectId() {
        return projectId
    }

    String getName() {
        return name
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.EmbeddedId
import io.micronaut.data.annotation.MappedEntity

@MappedEntity
class Project(@EmbeddedId val projectId: ProjectId, val name: String)
```

  </TabItem>
</Tabs>

:::note 提示
要更改 ID 的集合属性映射，可以在 `ProjectId` 类中的字段上使用 [@MappedProperty](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedProperty.html) 注解
:::

### 7.3.4 构造函数参数

Micronaut Data MongoDB 还允许使用构造函数参数而不是 getters/setters 来定义不可变对象。如果定义了多个构造函数，那么用于从数据库中创建对象的构造函数应使用 `io.micronaut.core.annotation.Creator` 进行注解。

例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.annotation.Creator;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import org.bson.types.ObjectId;

@MappedEntity
public class Manufacturer {
    @Id
    @GeneratedValue
    private ObjectId id;
    private String name;

    @Creator
    public Manufacturer(String name) {
        this.name = name;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.core.annotation.Creator
import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity

@MappedEntity
class Manufacturer {
    @Id
    @GeneratedValue
    Long id
    final String name

    @Creator
    Manufacturer(String name) {
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
import org.bson.types.ObjectId

@MappedEntity
data class Manufacturer(
        @field:Id
        @GeneratedValue
        var id: ObjectId?,
        val name: String
)
```

  </TabItem>
</Tabs>

从上面的示例中可以看出，对象的 `ID` 应包含一个设置器，因为它必须从数据库生成的值中分配。

### 7.3.5 命名策略

将驼峰大小写的类名和属性名转换为集合名和属性名时，默认的命名策略是使用下划线分隔的小写字母。换句话说，`FooBar` 变成了 `foo_bar`。

如果不满意，可以通过设置实体上 [@MappedEntity](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedEntity.html) 注解的 `namingStrategy` 成员来定制：

*Micronaut 数据命名策略*

```java
@MappedEntity(namingStrategy = NamingStrategies.Raw.class)
public class CountryRegion {
    ...
}
```

需要注意的几个重要事项。由于 Micronaut Data 会在编译时预先计算集合和属性名称映射，因此指定的 [NamingStrategy](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/naming/NamingStrategy.html) 实现必须位于注解处理器类路径（Java 为 `annotationProcessor` scope，Kotlin 为 `kapt`）上。

此外，如果不想在每个实体上重复上述注解定义，定义一个元注解（meta-annotation）也很方便，在元注解中，上述注解定义会应用到添加到类中的另一个注解上。

### 7.3.6 关联映射

要指定两个实体之间的关系，需要使用 [@Relation](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Relation.html) 注解。关系类型是使用枚举 [@Kind](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Relation.Kind.html) `value` 属性指定的，它与 JPA 关系注解名称（`@OneToMany`、`@OneToOne` 等）类似。

*表 1. Micronaut Data 支持的关系：*

|类型|描述|
|--|--|
|`Kind.ONE_TO_MANY`|一对多关系|
|`Kind.ONE_TO_ONE`|一对一关系|
|`Kind.MANY_TO_MANY`|多对多关系|
|`Kind.MANY_TO_ONE`|多对一关系|
|`Kind.EMBEDDED`|嵌入关系|

使用 “mappedBy” 指定此关系映射的逆属性。

*表 2. Micronaut Data 支持的关联级联类型：*

|类型|描述|
|--|--|
|`Cascade.PERSIST`|保存所有者实体时，相关的一个或多个实体将被持久化|

|`Cascade.UPDATE`|更新拥有实体时，将更新关联实体|

|`Cascade.NONE`|(默认）不进行级联操作|

|`Cascade.ALL`|所有（`Cascade.PERSIST` 和 `Cascade.UPDATE`）操作都是级联的|

### 7.3.7 关联检索

Micronaut Data 是一个简单的数据映射器，因此它不会使用实体代理的懒加载等技术为你获取任何单端关联。

您必须提前指定要获取的数据。您不能将关联映射为 eager 或 lazy。这样设计的原因很简单，即使在 JPA 世界中，由于 N+1 查询问题，访问懒关联或懒初始化集合也被认为是不好的做法，建议始终编写优化的连接查询。

Micronaut Data MongoDB 在此基础上更进一步，干脆不支持这些被认为是糟糕做法的功能。不过，这确实会影响您如何为关联建模。例如，如果您在构造函数参数中定义关联，如以下实体：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.Relation;
import org.bson.types.ObjectId;

@MappedEntity
public class Product {

    @Id
    @GeneratedValue
    private ObjectId id;
    private String name;
    @Nullable
    @Relation(Relation.Kind.MANY_TO_ONE)
    private Manufacturer manufacturer;

    public Product(String name, @Nullable Manufacturer manufacturer) {
        this.name = name;
        this.manufacturer = manufacturer;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Manufacturer getManufacturer() {
        return manufacturer;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.core.annotation.Nullable
import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import io.micronaut.data.annotation.Relation
import org.bson.types.ObjectId

@MappedEntity
class Product {
    @Id
    @GeneratedValue
    ObjectId id
    private String name
    @Nullable
    @Relation(Relation.Kind.MANY_TO_ONE)
    private Manufacturer manufacturer

    Product(String name, Manufacturer manufacturer) {
        this.name = name
        this.manufacturer = manufacturer
    }

    String getName() {
        return name
    }

    Manufacturer getManufacturer() {
        return manufacturer
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
import io.micronaut.data.annotation.Relation
import org.bson.types.ObjectId

@MappedEntity
data class Product(@field:Id @GeneratedValue
                   var id: ObjectId?,
                   var name: String,
                   @Relation(Relation.Kind.MANY_TO_ONE)
                   var manufacturer: Manufacturer?) {

    constructor(name: String, manufacturer: Manufacturer?) : this(null, name, manufacturer)

}
```

  </TabItem>
</Tabs>

然后，在未指定连接的情况下尝试读回 `Product` 实体，就会出现异常，因为 `manufacturer` 关联不是 `Nullable`。

有几种方法可以解决这个问题，一种方法是在存储库级别声明始终获取 `manufacturer`，另一种方法是在 `manufacturer` 参数上声明 `@Nullable` 注解，允许将其声明为 `null`（或者在 Kotlin 中，在构造函数参数名称的末尾添加 `?`）选择哪种方法取决于应用程序的设计。

下一节将提供更多有关处理连接的内容。

## 7.4 连接查询

如上一节所述，Micronaut Data MongoDB 不支持传统 ORM 意义上的关联。没有懒加载，也不支持代理。

请看上一节中的 `Product` 实体，它与 `Manufacturer` 实体有关联：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.annotation.Creator;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import org.bson.types.ObjectId;

@MappedEntity
public class Manufacturer {
    @Id
    @GeneratedValue
    private ObjectId id;
    private String name;

    @Creator
    public Manufacturer(String name) {
        this.name = name;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.core.annotation.Creator
import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity

@MappedEntity
class Manufacturer {
    @Id
    @GeneratedValue
    Long id
    final String name

    @Creator
    Manufacturer(String name) {
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
import org.bson.types.ObjectId

@MappedEntity
data class Manufacturer(
        @field:Id
        @GeneratedValue
        var id: ObjectId?,
        val name: String
)
```

  </TabItem>
</Tabs>

如果您查询 `Product` 实例，默认情况下 Micronaut Data MongoDB 将只查询和获取简单的属性。对于像上面这样的单端关联，如果可能的话，Micronaut Data 将只检索 ID 并分配它（对于需要构造函数参数的实体，这甚至是不可能的）。

如果你也需要获取关联，那么你可以在存储库接口上使用 [@Join](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Join.html) 注解来指定聚合应与关联 `Manufacturer` 的查询一起执行。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MongoRepository
public interface ProductRepository extends CrudRepository<Product, ObjectId> {
    @Join("manufacturer") // (1)
    List<Product> list();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@MongoRepository
public interface ProductRepository extends CrudRepository<Product, ObjectId> {
    @Join("manufacturer") // (1)
    List<Product> list();
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MongoRepository
public interface ProductRepository extends CrudRepository<Product, ObjectId> {
    @Join("manufacturer") // (1)
    List<Product> list();
}
```

  </TabItem>
</Tabs>

1. 列表查询应包括来自不同集合的连接关系的 `manufacturer`

Micronaut Data MongoDB 将在编译时生成以下聚合 JSON 查询，并只在运行时绑定所需的参数：

```json
[
   {
      "$lookup":{
         "from":"cart_item",
         "localField":"_id",
         "foreignField":"cart._id",
         "as":"items"
      }
   },
   {
      "$match":{
         "_id":{
            "$eq":{
               "$oid":"61d69d67e8cb2c06b66d2e67"
            }
         }
      }
   }
]
```

请注意，[@Join](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Join.html) 注解是可重复的，因此可以为不同的关联多次指定。

:::tip 注意
Micronaut Data MongoDB 不支持不同的连接类型或在 [@Join](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Join.html) 中定义的自定义别名。
:::

## 7.5 使用属性转换器

在某些情况下，您希望以不同于实体的方式在数据库中表示属性。

请看下面的实体示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.MappedProperty;
import io.micronaut.data.annotation.Relation;
import org.bson.types.ObjectId;

@MappedEntity
public class Sale {

    @Relation(Relation.Kind.MANY_TO_ONE)
    private final Product product;
    @MappedProperty(converter = QuantityAttributeConverter.class)
    private final Quantity quantity;

    @Id
    @GeneratedValue
    private ObjectId id;

    public Sale(Product product, Quantity quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public Product getProduct() {
        return product;
    }

    public Quantity getQuantity() {
        return quantity;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import io.micronaut.data.annotation.Relation
import org.bson.types.ObjectId

@MappedEntity
class Sale {
    @Id
    @GeneratedValue
    ObjectId id
    @Relation(Relation.Kind.MANY_TO_ONE)
    final Product product
    final Quantity quantity

    Sale(Product product, Quantity quantity) {
        this.product = product
        this.quantity = quantity
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.*
import org.bson.types.ObjectId

@MappedEntity
data class Sale(
    @field:Id
    @GeneratedValue
    var id: ObjectId?,
    @Relation(Relation.Kind.MANY_TO_ONE)
    val product: Product,
    @MappedProperty(converter = QuantityAttributeConverter::class)
    val quantity: Quantity
)
```

  </TabItem>
</Tabs>

`Sale` 类有一个 `Quantity` 类型的引用。`Quantity` 类型定义如下：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

public class Quantity {

    private final int amount;

    private Quantity(int amount) {
        this.amount = amount;
    }

    public int getAmount() {
        return amount;
    }

    public static Quantity valueOf(int amount) {
        return new Quantity(amount);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import groovy.transform.Immutable

@Immutable
class Quantity {
    int amount
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

data class Quantity(val amount: Int)
```

  </TabItem>
</Tabs>

如您所见，`@MappedProperty(converter = QuantityAttributeConverter.class)` 用于定义 `Quantity` 转换器。

:::tip 注意
Micronaut Data MongoDB 不支持使用 `@TypeDef` 定义转换器。
:::

最后一步是添加自定义属性转换，以便 Micronaut Data 知道如何读写 `Integer` 类型：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.convert.ConversionContext;
import io.micronaut.data.model.runtime.convert.AttributeConverter;
import jakarta.inject.Singleton;

@Singleton // (1)
public class QuantityAttributeConverter implements AttributeConverter<Quantity, Integer> {

    @Override // (2)
    public Integer convertToPersistedValue(Quantity quantity, ConversionContext context) {
        return quantity == null ? null : quantity.getAmount();
    }

    @Override // (3)
    public Quantity convertToEntityValue(Integer value, ConversionContext context) {
        return value == null ? null : Quantity.valueOf(value);
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import groovy.transform.CompileStatic
import io.micronaut.core.convert.ConversionContext
import io.micronaut.data.model.runtime.convert.AttributeConverter
import jakarta.inject.Singleton

@Singleton // (1)
@CompileStatic
class QuantityAttributeConverter implements AttributeConverter<Quantity, Integer> {

    @Override // (2)
    Integer convertToPersistedValue(Quantity quantity, ConversionContext context) {
        return quantity == null ? null : quantity.getAmount()
    }

    @Override // (3)
    Quantity convertToEntityValue(Integer value, ConversionContext context) {
        return value == null ? null : new Quantity(value)
    }

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.core.convert.ConversionContext
import io.micronaut.data.model.runtime.convert.AttributeConverter
import jakarta.inject.Singleton

@Singleton // (1)
class QuantityAttributeConverter : AttributeConverter<Quantity?, Int?> {

    // (2)
    override fun convertToPersistedValue(quantity: Quantity?, context: ConversionContext): Int? {
        return quantity?.amount
    }

    // (3)
    override fun convertToEntityValue(value: Int?, context: ConversionContext): Quantity? {
        return if (value == null) null else Quantity(value)
    }

}
```

  </TabItem>
</Tabs>

1. 属性转换器实现 [@AttributeConverter](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/runtime/convert/AttributeConverter.html) 且必须是一个 Bean
2. 从 `Quantity` 到 `Integer` 的转换器
3. 从 `Integer` 到 `Quantity` 的转换器

:::tip 注意
使用 @MappedProperty 可以定义转换器的结果类型：[@MappedProperty(converterPersistedType = Integer.class)](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedProperty.html)，在这种情况下，数据类型将被自动检测到。
:::

## 7.6 带有标准 API 的仓库

在某些情况下，你需要在运行时以编程方式建立查询；为此，Micronaut Data 实现了 Jakarta Persistence Criteria API 3.0 的一个子集，可用于 Micronaut Data MongoDB 功能。

为了实现无法在编译时定义的查询，Micronaut Data 引入了 [JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/JpaSpecificationExecutor.html) 仓库接口，可用于扩展您的仓库接口：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MongoRepository
public interface PersonRepository extends CrudRepository<Person, ObjectId>, JpaSpecificationExecutor<Person> {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@MongoRepository
interface PersonRepository extends CrudRepository<Person, ObjectId>, JpaSpecificationExecutor<Person> {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MongoRepository
interface PersonRepository extends CrudRepository<Person, ObjectId>, JpaSpecificationExecutor<Person> {
}
```

  </TabItem>
</Tabs>

每种方法都需要一个“规范”，它是一个功能接口，包含一组旨在以编程方式建立查询的 Criteria API 对象。

Micronaut Criteria API 目前只实现了 API 的一个子集。其中大部分在内部用于创建带有谓词和投影的查询。

目前，不支持 JPA Criteria API 功能：

- 使用自定义 `ON` 表达式和类型化连接方法（如 `joinSet` 等）进行连接
- 子查询
- 集合操作：`isMember` 等
- 自定义或元组结果类型
- 转换表达式，如 concat、substring 等
- 案例和函数

有关 Jakarta Persistence Criteria API 3.0 的更多信息，参阅[官方 API 规范](https://jakarta.ee/specifications/persistence/3.0/jakarta-persistence-spec-3.0.html#a6925)。

### 7.6.1 查询

要查找一个或多个实体，可以使用 [JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jpa/repository/JpaSpecificationExecutor.html) 接口的以下方法之一：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Optional<Person> findOne(PredicateSpecification<Person> spec);

Optional<Person> findOne(QuerySpecification<Person> spec);

List<Person> findAll(PredicateSpecification<Person> spec);

List<Person> findAll(QuerySpecification<Person> spec);

List<Person> findAll(PredicateSpecification<Person> spec, Sort sort);

List<Person> findAll(QuerySpecification<Person> spec, Sort sort);

Page<Person> findAll(PredicateSpecification<Person> spec, Pageable pageable);

Page<Person> findAll(QuerySpecification<Person> spec, Pageable pageable);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Optional<Person> findOne(PredicateSpecification<Person> spec);

Optional<Person> findOne(QuerySpecification<Person> spec);

List<Person> findAll(PredicateSpecification<Person> spec);

List<Person> findAll(QuerySpecification<Person> spec);

List<Person> findAll(PredicateSpecification<Person> spec, Sort sort);

List<Person> findAll(QuerySpecification<Person> spec, Sort sort);

Page<Person> findAll(PredicateSpecification<Person> spec, Pageable pageable);

Page<Person> findAll(QuerySpecification<Person> spec, Pageable pageable);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun findOne(spec: PredicateSpecification<Person>?): Optional<Person>

fun findOne(spec: QuerySpecification<Person>?): Optional<Person>

fun findAll(spec: PredicateSpecification<Person>?): List<Person>

fun findAll(spec: QuerySpecification<Person>?): List<Person>

fun findAll(spec: PredicateSpecification<Person>?, sort: Sort): List<Person>

fun findAll(spec: QuerySpecification<Person>?, sort: Sort): List<Person>

fun findAll(spec: PredicateSpecification<Person>?, pageable: Pageable): Page<Person>

fun findAll(spec: QuerySpecification<Person>?, pageable: Pageable): Page<Person>
```

  </TabItem>
</Tabs>

如你所见，`findOne` / `findAll` 方法有两种变体。

第一个方法是期待 [PredicateSpecification](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/criteria/PredicateSpecification.html)，这是一个简单的规范接口，可以通过实现它来返回一个谓词：

```java
import static jakarta.persistence.criteria.*;

public interface PredicateSpecification<T> {

    (1)
    @Nullable
    Predicate toPredicate(@NonNull Root<T> root, (2)
                          @NonNull CriteriaBuilder criteriaBuilder (3)
    );

}
```

1. 该规范正在生成一个查询限制谓词
2. 实体根
3. 标准生成器

该接口还可用于更新和删除方法，并提供了或 和 方法，用于组合多个谓词。

第二个接口仅用于查询标准，因为它包含 `jakarta.persistence.criteria.CriteriaQuery` 作为参数。

```java
import static jakarta.persistence.criteria.*;

public interface QuerySpecification<T> {

    (1)
    @Nullable
    Predicate toPredicate(@NonNull Root<T> root, (2)
                          @NonNull CriteriaQuery<?> query, (3)
                          @NonNull CriteriaBuilder criteriaBuilder (4)
    );

}
```

1. 该规范正在生成一个查询限制谓词
2. 实体根
3. 标准查询实例
4. 标准生成器

实现计数查询可使用以下方法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
long count(PredicateSpecification<Person> spec);

long count(QuerySpecification<Person> spec);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
long count(PredicateSpecification<Person> spec)

long count(QuerySpecification<Person> spec)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun count(spec: PredicateSpecification<Person>?): Long

fun count(spec: QuerySpecification<Person>?): Long
```

  </TabItem>
</Tabs>

您可以定义有助于创建查询的标准规范方法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
class Specifications {

    static PredicateSpecification<Person> nameEquals(String name) {
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get("name"), name);
    }

    static PredicateSpecification<Person> ageIsLessThan(int age) {
        return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("age"), age);
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
class Specifications {

    static PredicateSpecification<Person> nameEquals(String name) {
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get("name"), name)
    }

    static PredicateSpecification<Person> ageIsLessThan(int age) {
        return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("age"), age)
    }

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
object Specifications {
    fun nameEquals(name: String?) = where<Person> { root[Person::name] eq name }

    fun ageIsLessThan(age: Int) = where<Person> { root[Person::age] lt age }

    fun nameOrAgeMatches(age: Int, name: String?) = where<Person> {
        or {
            root[Person::name] eq name
            root[Person::age] lt age
        }
    }

}
```

  </TabItem>
</Tabs>

然后，您可以将它们组合起来进行 `find` 或 `count` 查询：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Person denis = personRepository.findOne(nameEquals("Denis")).orElse(null);

long countAgeLess30 = personRepository.count(ageIsLessThan(30));

long countAgeLess20 = personRepository.count(ageIsLessThan(20));

long countAgeLess30NotDenis = personRepository.count(ageIsLessThan(30).and(not(nameEquals("Denis"))));

List<Person> people = personRepository.findAll(where(nameEquals("Denis").or(nameEquals("Josh"))));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Person denis = personRepository.findOne(nameEquals("Denis")).orElse(null);

long countAgeLess30 = personRepository.count(ageIsLessThan(30));

long countAgeLess20 = personRepository.count(ageIsLessThan(20));

long countAgeLess30NotDenis = personRepository.count(ageIsLessThan(30).and(not(nameEquals("Denis"))));

List<Person> people = personRepository.findAll(where(nameEquals("Denis").or(nameEquals("Josh"))));
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val denis: Person? = personRepository.findOne(nameEquals("Denis")).orElse(null)

val countAgeLess30: Long = personRepository.count(ageIsLessThan(30))

val countAgeLess20: Long = personRepository.count(ageIsLessThan(20))

val countAgeLess30NotDenis: Long = personRepository.count(ageIsLessThan(30).and(not(nameEquals("Denis"))))

val people = personRepository.findAll(PredicateSpecification.where(nameEquals("Denis").or(nameEquals("Josh"))))
```

  </TabItem>
</Tabs>

:::tip 注意
示例使用的是编译时已知的值，在这种情况下，最好创建自定义存储库方法，这样就能在编译时生成查询，并消除运行时的开销。建议仅在动态查询中使用标准，因为在构建时查询结构是未知的。
:::

### 7.6.2 更新

要实现更新，可以使用 [JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/JpaSpecificationExecutor.html) 接口中的以下方法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
long updateAll(UpdateSpecification<Person> spec);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
long updateAll(UpdateSpecification<Person> spec)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun updateAll(spec: UpdateSpecification<Person>?): Long
```

  </TabItem>
</Tabs>

该方法期待 [UpdateSpecification](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/criteria/UpdateSpecification.html)，它是规范接口的一个变体，包括对 `jakarta.persistence.criteria.CriteriaUpdate` 的访问：

```java
import static jakarta.persistence.criteria.*;

public interface UpdateSpecification<T> {

    (1)
    @Nullable
    Predicate toPredicate(@NonNull Root<T> root, (2)
                          @NonNull CriteriaUpdate<?> query, (3)
                          @NonNull CriteriaBuilder criteriaBuilder (4)
    );

}
```

1. 该规范正在生成一个查询限制谓词
2. 实体根
3. 标准更新实例
4. 标准生成器

可使用 `jakarta.persistence.criteria.CriteriaUpdate` 接口更新特定属性：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
query.set(root.get("name"), newName);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
query.set(root.get("name"), newName)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun updateName(newName: String, existingName: String) = update<Person> {
    set(Person::name, newName)
    where {
        root[Person::name] eq existingName
    }
}
    query.set(root[Person::name], newName)
```

  </TabItem>
</Tabs>

您可以定义标准规范方法，包括更新规范，这将有助于您创建更新查询：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
class Specifications {

    static PredicateSpecification<Person> nameEquals(String name) {
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get("name"), name);
    }

    static PredicateSpecification<Person> ageIsLessThan(int age) {
        return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("age"), age);
    }

    static UpdateSpecification<Person> setNewName(String newName) {
        return (root, query, criteriaBuilder) -> {
            query.set(root.get("name"), newName);
            return null;
        };
    }

    static PredicateSpecification<Person> interestsContains(String interest) {
        return (root, criteriaBuilder) -> ((PersistentEntityCriteriaBuilder) criteriaBuilder).arrayContains(root.get("interests"), criteriaBuilder.literal(interest));
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
class Specifications {

    static PredicateSpecification<Person> nameEquals(String name) {
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get("name"), name)
    }

    static PredicateSpecification<Person> ageIsLessThan(int age) {
        return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("age"), age)
    }

    static UpdateSpecification<Person> setNewName(String newName) {
        return (root, query, criteriaBuilder) -> {
            query.set(root.get("name"), newName)
            null
        }
    }

    static PredicateSpecification<Person> interestsContains(String interest) {
        return (root, criteriaBuilder) -> ((PersistentEntityCriteriaBuilder) criteriaBuilder).arrayContains(root.get("interests"), criteriaBuilder.literal(interest))
    }

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
object Specifications {
    fun nameEquals(name: String?) = where<Person> { root[Person::name] eq name }

    fun ageIsLessThan(age: Int) = where<Person> { root[Person::age] lt age }

    fun nameOrAgeMatches(age: Int, name: String?) = where<Person> {
        or {
            root[Person::name] eq name
            root[Person::age] lt age
        }
    }

    fun updateName(newName: String, existingName: String) = update<Person> {
        set(Person::name, newName)
        where {
            root[Person::name] eq existingName
        }
    }

    fun interestsContains(interest: String): PredicateSpecification<Person>? {
        return PredicateSpecification { root: Root<Person>, criteriaBuilder: CriteriaBuilder ->
            (criteriaBuilder as PersistentEntityCriteriaBuilder).arrayContains(
                root.get<Any>("interests"),
                criteriaBuilder.literal(interest)
            )
        }
    }

    // Different style using the criteria builder
    fun nameEquals2(name: String?) = PredicateSpecification { root, criteriaBuilder ->
        criteriaBuilder.equal(root[Person::name], name)
    }

    fun ageIsLessThan2(age: Int) = PredicateSpecification { root, criteriaBuilder ->
        criteriaBuilder.lessThan(root[Person::age], age)
    }

    fun setNewName2(newName: String) = UpdateSpecification { root, query, criteriaBuilder ->
        query.set(root[Person::name], newName)
        null
    }

}
```

  </TabItem>
</Tabs>

然后，您可以使用更新规范与谓词规范相结合：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
long recordsUpdated = personRepository.updateAll(setNewName("Steven").where(nameEquals("Denis")));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
long recordsUpdated = personRepository.updateAll(setNewName("Steven").where(nameEquals("Denis")))
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val recordsUpdated = personRepository.updateAll(updateName("Steven", "Denis"))
```

  </TabItem>
</Tabs>

### 7.6.3 删除

要删除一个实体或多个实体，可以使用 [JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/JpaSpecificationExecutor.html) 接口中的以下方法之一：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
long deleteAll(PredicateSpecification<Person> spec);

long deleteAll(DeleteSpecification<Person> spec);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
long deleteAll(PredicateSpecification<Person> spec)

long deleteAll(DeleteSpecification<Person> spec)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun deleteAll(spec: PredicateSpecification<Person>?): Long

fun deleteAll(spec: DeleteSpecification<Person>?): Long
```

  </TabItem>
</Tabs>

与查询一样，`deleteAll` 方法也有两种变体。

第一个方法期待 [PredicateSpecification](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/criteria/PredicateSpecification.html)，它与[查询](#761-查询)部分描述的接口相同。

第二种方法带有 [DeleteSpecification](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/DeleteSpecification.html)，仅用于删除标准，因为它包含了对 `jakarta.persistence.criteria.CriteriaDelete` 的访问。

```java
import static jakarta.persistence.criteria.*;

public interface DeleteSpecification<T> {

    (1)
    @Nullable
    Predicate toPredicate(@NonNull Root<T> root, (2)
                          @NonNull CriteriaDelete<?> query, (3)
                          @NonNull CriteriaBuilder criteriaBuilder (4)
    );

}
```

1. 该规范正在生成一个查询限制谓词
2. 实体根
3. 标准删除实例
4. 标准生成器

对于删除，您可以重复使用与查询和更新相同的谓词：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
class Specifications {

    static PredicateSpecification<Person> nameEquals(String name) {
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get("name"), name);
    }

    static PredicateSpecification<Person> ageIsLessThan(int age) {
        return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("age"), age);
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
class Specifications {

    static PredicateSpecification<Person> nameEquals(String name) {
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get("name"), name)
    }

    static PredicateSpecification<Person> ageIsLessThan(int age) {
        return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("age"), age)
    }

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
object Specifications {
    fun nameEquals(name: String?) = where<Person> { root[Person::name] eq name }

    fun ageIsLessThan(age: Int) = where<Person> { root[Person::age] lt age }

    fun nameOrAgeMatches(age: Int, name: String?) = where<Person> {
        or {
            root[Person::name] eq name
            root[Person::age] lt age
        }
    }

}
```

  </TabItem>
</Tabs>

只需将谓词规范传递给 deleteAll 方法即可：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
long recordsDeleted = personRepository.deleteAll(where(nameEquals("Denis")));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
long recordsDeleted = personRepository.deleteAll(where(nameEquals("Denis")))
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val recordsDeleted = personRepository.deleteAll(PredicateSpecification.where(nameEquals("Denis")))
val recordsDeleted = personRepository.deleteAll(where {
    root[Person::name] eq "Denis"
})
val recordsDeleted = personRepository.deleteAll(where {
    root[Person::name] eq "Denis"
})
```

  </TabItem>
</Tabs>

### 7.6.4 其他版本库变化

Micronaut Data 包含不同的规范执行器接口变体，旨在与异步或反应式版本库一起使用。

*表 1. `JpaSpecificationExecutor` 仓库接口的内置变体*

|接口|描述|
|--|--|
|[JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/JpaSpecificationExecutor.html)|查询、删除和更新数据的默认接口|
|[AsyncJpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/async/AsyncJpaSpecificationExecutor.html)|规格库的异步版本|
|[ReactiveStreamsJpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactiveStreamsJpaSpecificationExecutor.html)|规范库的响应流 -- `Publisher<>` 版本|
|[ReactorJpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactorJpaSpecificationExecutor.html)|Reactor 版本的规范库|
|[CoroutineJpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/kotlin/CoroutineJpaSpecificationExecutor.html)|使用例程的 Kotlin 版本接口|

## 7.7 乐观锁定

乐观锁定是一种策略，即注意实际记录状态的版本，只有当版本相同时才修改记录。

要为实体启用乐观锁定，请添加以下类型之一的 [@Version](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Version.html) 注解字段：

- `java.lang.Integer`
- `java.lang.Long`
- `java.lang.Short`
- 扩展了 `java.time.Temporal` 的日期时间类型

该字段将在更新操作中递增（对于数字类型）或替换（对于日期类型）。

Micronaut Data 将生成版本匹配的更新/删除过滤查询，如果更新/删除没有产生任何结果，将抛出 [OptimisticLockException](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/exceptions/OptimisticLockException.html)。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MappedEntity
public class Student {

    @Id
    @GeneratedValue
    private ObjectId id;
    @Version
    private Long version;
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@MappedEntity
class Student {

    @Id
    @GeneratedValue
    ObjectId id
    @Version
    Long version
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MappedEntity
data class Student(
        @field:Id @GeneratedValue
        val id: ObjectId?,
        @field:Version
        val version: Long?,
```

  </TabItem>
</Tabs>

可以在部分更新或删除方法中使用 [@Version](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Version.html)，在这种情况下，版本必须与存储记录的版本相匹配。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MongoRepository
public interface StudentRepository extends CrudRepository<Student, ObjectId> {

    void update(@Id ObjectId id, @Version Long version, String name);

    void delete(@Id ObjectId id, @Version Long version);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@MongoRepository
interface StudentRepository extends CrudRepository<Student, ObjectId> {

    void update(@Id ObjectId id, @Version Long version, String name)

    void delete(@Id ObjectId id, @Version Long version)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MongoRepository
interface StudentRepository : CrudRepository<Student, ObjectId> {

    fun update(@Id id: ObjectId, @Version version: Long, name: String)

    fun delete(@Id id: ObjectId, @Version version: Long)

}
```

  </TabItem>
</Tabs>

> [英文链接](https://micronaut-projects.github.io/micronaut-data/latest/guide/#mongo)

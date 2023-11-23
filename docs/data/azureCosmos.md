---
sidebar_position: 80
---

# 8. Micronaut Data Azure Cosmos

Micronaut Data Azure Cosmos 支持 JPA 实现的部分功能，包括：

- [编译时生成的仓库](#83-仓库)和[投影](/data/shared#334-查询投影)查询
- [属性转换器](#86-使用属性转换器)
- [优化锁定](#87-优化锁定)

与其他数据模块一样，不支持级联和连接。更多[规格](#85-azure-cosmos-规格)信息，参阅此处。

对象层与 Azure Cosmos Db 序列化/反序列化之间的交互是使用 [Micronaut 序列化](/serialization)实现的。

## 8.1 快速入门

目前仍无法通过 Micronaut Launch 创建支持 Azure Cosmos Db 的 Micronaut 项目。我们的团队将在不久的将来解决这个问题。

要开始使用 Micronaut Data Azure Cosmos，请在注解处理器路径中添加以下依赖：

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
对于 Kotlin，依赖关系应在 `kapt` 作用域中；对于 Groovy，依赖关系应在 `compileOnly` 作用域中。
:::

然后，您应该在 `micronaut-data-azure-cosmos` 模块上配置编译作用域依赖关系：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.data:micronaut-data-azure-cosmos")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.data</groupId>
    <artifactId>micronaut-data-azure-cosmos</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

接下来，你需要配置至少一个数据源。应用程序配置文件中的以下片段是配置默认 Azure Cosmos Db 数据源的示例：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.application.name=example
azure.cosmos.default-gateway-mode=true
azure.cosmos.endpoint-discovery-enabled=false
azure.cosmos.endpoint=https://localhost:8081
azure.cosmos.key=
azure.cosmos.database.throughput-settings.request-units=1000
azure.cosmos.database.throughput-settings.auto-scale=false
azure.cosmos.database.database-name=testDb
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  application:
    name: example
azure:
  cosmos:
    default-gateway-mode: true
    endpoint-discovery-enabled: false
    endpoint: https://localhost:8081
    key: ''
    database:
      throughput-settings:
        request-units: 1000
        auto-scale: false
      database-name: testDb
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.application]
    name="example"
[azure]
  [azure.cosmos]
    default-gateway-mode=true
    endpoint-discovery-enabled=false
    endpoint="https://localhost:8081"
    key=""
    [azure.cosmos.database]
      [azure.cosmos.database.throughput-settings]
        request-units=1000
        auto-scale=false
      database-name="testDb"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  application {
    name = "example"
  }
}
azure {
  cosmos {
    defaultGatewayMode = true
    endpointDiscoveryEnabled = false
    endpoint = "https://localhost:8081"
    key = ""
    database {
      throughputSettings {
        requestUnits = 1000
        autoScale = false
      }
      databaseName = "testDb"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    application {
      name = "example"
    }
  }
  azure {
    cosmos {
      default-gateway-mode = true
      endpoint-discovery-enabled = false
      endpoint = "https://localhost:8081"
      key = ""
      database {
        throughput-settings {
          request-units = 1000
          auto-scale = false
        }
        database-name = "testDb"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "micronaut": {
    "application": {
      "name": "example"
    }
  },
  "azure": {
    "cosmos": {
      "default-gateway-mode": true,
      "endpoint-discovery-enabled": false,
      "endpoint": "https://localhost:8081",
      "key": "",
      "database": {
        "throughput-settings": {
          "request-units": 1000,
          "auto-scale": false
        },
        "database-name": "testDb"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

你可以从[这里](#82-配置)查找关于配置的更多信息。

要从数据库中检索对象，需要定义一个注解为 [@MappedEntity](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedEntity.html) 的类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MappedEntity
public class Book {
    @Id
    @GeneratedValue
    @PartitionKey
    private String id;
    private String title;
    private int pages;
    @MappedProperty(converter = ItemPriceAttributeConverter.class)
    @Nullable
    private ItemPrice itemPrice;
    @DateCreated
    private Date createdDate;
    @DateUpdated
    private Date updatedDate;

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
    private String id
    private String title
    private int pages
    @MappedProperty(converter = ItemPriceAttributeConverter)
    @Nullable
    private ItemPrice itemPrice
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
                var id: String?,
                var title: String,
                var pages: Int = 0,
                @MappedProperty(converter = ItemPriceAttributeConverter::class)
                var itemPrice: ItemPrice? = null,
                @DateCreated
                var createdDate: Date? = null,
                @DateUpdated
                var updatedDate: Date? = null)
```

  </TabItem>
</Tabs>

随后是一个从 [CrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/CrudRepository.html) 扩展而来的接口：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.Id;
import io.micronaut.data.cosmos.annotation.CosmosRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.Slice;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;


@CosmosRepository // (1)
interface BookRepository extends CrudRepository<Book, String> { // (2)
    Book find(String title);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.data.annotation.Id
import io.micronaut.data.cosmos.annotation.CosmosRepository
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.Slice
import io.micronaut.data.repository.CrudRepository

@CosmosRepository // (1)
interface BookRepository extends CrudRepository<Book, String> { // (2)
    Book find(String title)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.Id
import io.micronaut.data.cosmos.annotation.CosmosRepository
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.Slice
import io.micronaut.data.repository.CrudRepository

@CosmosRepository // (1)
interface BookRepository : CrudRepository<Book, String> { // (2)
    fun find(title: String): Book
}
```

  </TabItem>
</Tabs>

1. 接口注解为 [@CosmosRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/cosmos/annotation/CosmosRepository.html)
2. `CrudRepository` 接口接受 2 个通用参数，实体类型（在本例中是 `Book`）和 ID 类型（在本例中是 `String`）。

现在您可以对实体执行 CRUD（创建、读取、更新、删除）操作。`example.BookRepository` 的实现是在编译时创建的。要获得对它的引用，只需注入 Bean：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Inject
BookRepository bookRepository;
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

使用 Micronaut Data Azure Cosmos 时，每个 `MappedEntity` 都将与容器相对应。一个容器只能容纳一个实体或文档类型。默认情况下，用 `@MappedEntity` 注解的类的简单名称将用作容器名称。如果实体类是 `CosmosBook`，那么预期的容器名称将是 `cosmos_book`，除非在 `MappedEntity` 注解值中没有被覆盖。实体字段的默认命名策略是 `Raw` 策略，用户通常不需要覆盖它。

**保存实例（创建）**

要保存实例，请使用 `CrudRepository` 接口的 `save` 方法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Book book = new Book("The Stand", 1000);
book.setItemPrice(new ItemPrice(200));
bookRepository.save(book);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
def book = new Book("The Stand", 1000)
book.itemPrice = new ItemPrice(99.5)
bookRepository.save(book)
def id = book.id
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
var book = Book(null,"The Stand", 1000, ItemPrice(199.99))
bookRepository.save(book)
```

  </TabItem>
</Tabs>

**检索实例（读取）**

要获取一个 `book`，请使用 `findById`：

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

有了 Micronaut Data Azure Cosmos，你可以使用 `CrudRepository` 的 `save` 方法或手动实现更新方法。您可以为仓库中的更新定义显式更新方法。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void update(@Id String id, int pages);

void update(@Id String id, String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void update(@Id String id, int pages)

void update(@Id String id, String title)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun update(@Id id: String, pages: Int)

fun update(@Id id: String, title: String)
```

  </TabItem>
</Tabs>

然后就可以这样调用了：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
bookRepository.update(book.getId(), "Changed");
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
bookRepository.update(book.getId(), "Changed");
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
bookRepository.update(book.getId(), "Changed")
```

  </TabItem>
</Tabs>

**删除实例（删除）**

要删除一个实例，请使用 `deleteById`：

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

恭喜您实现了第一个 Micronaut Data Azure Cosmos 仓库！继续阅读，了解更多。

## 8.2 配置

在现有容器中使用现有 Azure Cosmos 数据库时，除了端点、密钥和数据库名称外，不需要任何特殊配置。但是，出于测试目的或需要在应用程序启动期间创建数据库容器时，还有其他配置容器的选项。

正如[快速入门中提到的，在 Azure Cosmos Db 中，每个用 `@MappedEntity` 标注的类都对应一个容器。如果属性 `azure.cosmos.database.update-policy` 设置为 `NONE`，则不会尝试创建容器。如果该值设置为 `CREATE_IF_NOT_EXISTS`，那么如果容器不存在，应用程序将尝试创建容器。而如果值为 `UPDATE`，应用程序将尝试替换现有的任何容器及其属性。

目前，只能为数据库和容器配置一小部分属性。数据库的吞吐量属性可以配置，而容器的吞吐量属性和分区密钥路径可以配置。

:::tip 注意
配置分区键值的另一种方法是添加注解 [@PartitionKey](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/cosmos/annotation/PartitionKey.html)
:::

下面是一个应用程序配置示例，显示了在创建新容器（如果容器不存在）时使用的容器和数据库属性：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.application.name=example
azure.cosmos.default-gateway-mode=true
azure.cosmos.endpoint-discovery-enabled=false
azure.cosmos.endpoint=https://localhost:8081
azure.cosmos.key=
azure.cosmos.database.throughput-settings.request-units=1000
azure.cosmos.database.throughput-settings.auto-scale=false
azure.cosmos.database.database-name=testDb
azure.cosmos.database.packages=io.micronaut.data.azure.entities
azure.cosmos.database.update-policy=CREATE_IF_NOT_EXISTS
azure.cosmos.database.container-settings[0].container-name=family
azure.cosmos.database.container-settings[0].partition-key-path=/lastname
azure.cosmos.database.container-settings[0].throughput-settings.request-units=1000
azure.cosmos.database.container-settings[0].throughput-settings.auto-scale=false
azure.cosmos.database.container-settings[1].container-name=book
azure.cosmos.database.container-settings[1].partition-key-path=/id
azure.cosmos.database.container-settings[1].throughput-settings.request-units=1200
azure.cosmos.database.container-settings[1].throughput-settings.auto-scale=false
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  application:
    name: example
azure:
  cosmos:
    default-gateway-mode: true
    endpoint-discovery-enabled: false
    endpoint: https://localhost:8081
    key: ''
    database:
      throughput-settings:
        request-units: 1000
        auto-scale: false
      database-name: testDb
      packages: io.micronaut.data.azure.entities
      update-policy: CREATE_IF_NOT_EXISTS
      container-settings:
        - container-name: family
          partition-key-path: /lastname
          throughput-settings:
            request-units: 1000
            auto-scale: false
        - container-name: book
          partition-key-path: /id
          throughput-settings:
            request-units: 1200
            auto-scale: false
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.application]
    name="example"
[azure]
  [azure.cosmos]
    default-gateway-mode=true
    endpoint-discovery-enabled=false
    endpoint="https://localhost:8081"
    key=""
    [azure.cosmos.database]
      [azure.cosmos.database.throughput-settings]
        request-units=1000
        auto-scale=false
      database-name="testDb"
      packages="io.micronaut.data.azure.entities"
      update-policy="CREATE_IF_NOT_EXISTS"
      [[azure.cosmos.database.container-settings]]
        container-name="family"
        partition-key-path="/lastname"
        [azure.cosmos.database.container-settings.throughput-settings]
          request-units=1000
          auto-scale=false
      [[azure.cosmos.database.container-settings]]
        container-name="book"
        partition-key-path="/id"
        [azure.cosmos.database.container-settings.throughput-settings]
          request-units=1200
          auto-scale=false
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  application {
    name = "example"
  }
}
azure {
  cosmos {
    defaultGatewayMode = true
    endpointDiscoveryEnabled = false
    endpoint = "https://localhost:8081"
    key = ""
    database {
      throughputSettings {
        requestUnits = 1000
        autoScale = false
      }
      databaseName = "testDb"
      packages = "io.micronaut.data.azure.entities"
      updatePolicy = "CREATE_IF_NOT_EXISTS"
      containerSettings = [{
          containerName = "family"
          partitionKeyPath = "/lastname"
          throughputSettings {
            requestUnits = 1000
            autoScale = false
          }
        }, {
          containerName = "book"
          partitionKeyPath = "/id"
          throughputSettings {
            requestUnits = 1200
            autoScale = false
          }
        }]
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    application {
      name = "example"
    }
  }
  azure {
    cosmos {
      default-gateway-mode = true
      endpoint-discovery-enabled = false
      endpoint = "https://localhost:8081"
      key = ""
      database {
        throughput-settings {
          request-units = 1000
          auto-scale = false
        }
        database-name = "testDb"
        packages = "io.micronaut.data.azure.entities"
        update-policy = "CREATE_IF_NOT_EXISTS"
        container-settings = [{
            container-name = "family"
            partition-key-path = "/lastname"
            throughput-settings {
              request-units = 1000
              auto-scale = false
            }
          }, {
            container-name = "book"
            partition-key-path = "/id"
            throughput-settings {
              request-units = 1200
              auto-scale = false
            }
          }]
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "micronaut": {
    "application": {
      "name": "example"
    }
  },
  "azure": {
    "cosmos": {
      "default-gateway-mode": true,
      "endpoint-discovery-enabled": false,
      "endpoint": "https://localhost:8081",
      "key": "",
      "database": {
        "throughput-settings": {
          "request-units": 1000,
          "auto-scale": false
        },
        "database-name": "testDb",
        "packages": "io.micronaut.data.azure.entities",
        "update-policy": "CREATE_IF_NOT_EXISTS",
        "container-settings": [{
            "container-name": "family",
            "partition-key-path": "/lastname",
            "throughput-settings": {
              "request-units": 1000,
              "auto-scale": false
            }
          }, {
            "container-name": "book",
            "partition-key-path": "/id",
            "throughput-settings": {
              "request-units": 1200,
              "auto-scale": false
            }
          }]
      }
    }
  }
}
```

  </TabItem>
</Tabs>

## 8.3 仓库

如[快速入门](#81-快速入门)中所述，Micronaut Data 中的 Azure Cosmos 数据库被定义为带有 [@CosmosRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/cosmos/annotation/CosmosRepository.html) 注解的接口。

例如：

```java
@CosmosRepository (1)
public interface BookRepository extends CrudRepository<Book, String> {
    Optional<Book> findByAuthorId(@NotNull String authorId);
}
```

1. `@CosmosRepository` 标识访问 Azure Cosmos 数据库的接口

根据方法签名或为 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html) 接口指定的通用类型参数，确定查询时作为根实体的实体。

如果无法确定根实体，则会出现编译错误。

Azure Cosmos Data 支持与 JPA 实现相同的接口。

请注意，除了接口外，您还可以将存储库定义为抽象类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.cosmos.annotation.CosmosRepository;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;

@CosmosRepository
public abstract class AbstractBookRepository implements CrudRepository<Book, String> {

    public abstract List<Book> findByTitle(String title);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.data.cosmos.annotation.CosmosRepository
import io.micronaut.data.repository.CrudRepository

@CosmosRepository
abstract class AbstractBookRepository implements CrudRepository<Book, String> {

    abstract List<Book> findByTitle(String title)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.cosmos.annotation.CosmosRepository
import io.micronaut.data.repository.CrudRepository

@CosmosRepository
abstract class AbstractBookRepository : CrudRepository<Book, String> {

    abstract fun findByTitle(title: String): List<Book>
}
```

  </TabItem>
</Tabs>

## 8.4 带有标准 API 的仓库

在某些情况下，您需要在运行时以编程方式建立查询；为此，Micronaut Data 实现了 Jakarta Persistence Criteria API 3.0 的子集，可用于 Micronaut Data Azure Cosmos 功能。

为了实现无法在编译时定义的查询，Micronaut Data 引入了 [JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/JpaSpecificationExecutor.html) 资源库接口，可用于扩展您的仓库接口：

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
interface PersonRepository : CrudRepository<Person, ObjectId>, JpaSpecificationExecutor<Person> {
}
```

  </TabItem>
</Tabs>

每种方法都需要一个 "规范"，它是一个功能接口，包含一组旨在以编程方式建立查询的 Criteria API 对象。

Micronaut Criteria API 目前只实现了 API 的一个子集。其中大部分在内部用于创建带有谓词和投影的查询。

目前，不支持 JPA Criteria API 功能：

- 使用自定义 `ON` 表达式和类型化连接方法（如 `joinSet` 等）进行连接
- 子查询
- 集合操作：`isMember` 等
- 自定义或元组结果类型
- 转换表达式，如 concat、substring 等
- 案例和函数

有关 Jakarta Persistence Criteria API 3.0 的更多信息，参阅[官方 API 规范](https://jakarta.ee/specifications/persistence/3.0/jakarta-persistence-spec-3.0.html#a6925)。

### 8.4.1 查询

要查找一个或多个实体，您可以使用 [JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jpa/repository/JpaSpecificationExecutor.html) 接口中的以下方法之一：

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
Optional<Person> findOne(PredicateSpecification<Person> spec)

Optional<Person> findOne(QuerySpecification<Person> spec)

List<Person> findAll(PredicateSpecification<Person> spec)

List<Person> findAll(QuerySpecification<Person> spec)

List<Person> findAll(PredicateSpecification<Person> spec, Sort sort)

List<Person> findAll(QuerySpecification<Person> spec, Sort sort)

Page<Person> findAll(PredicateSpecification<Person> spec, Pageable pageable)

Page<Person> findAll(QuerySpecification<Person> spec, Pageable pageable)
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

如你所见，`findOne`/`findAll` 方法有两种变体。

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

该接口还可用于更新和删除方法，并提供了 `or` 和 `and` 方法，用于组合多个谓词。

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
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get("name"), name);
    }

    static PredicateSpecification<Person> ageIsLessThan(int age) {
        return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("age"), age);
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
Person denis = personRepository.findOne(nameEquals("Denis")).orElse(null)

long countAgeLess30 = personRepository.count(ageIsLessThan(30))

long countAgeLess20 = personRepository.count(ageIsLessThan(20))

long countAgeLess30NotDenis = personRepository.count(ageIsLessThan(30) & not(nameEquals("Denis")))

List<Person> people = personRepository.findAll(where(nameEquals("Denis") | nameEquals("Josh")))
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

Micronaut Azure Cosmos Data 支持的特定标准是 `ArrayContains` 或 `CollectionContains`，对于具有名为 `tags` 的数组或字符串字段列表的类，可以通过类似这样的自定义仓库方法来使用：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public abstract List<Family> findByTagsArrayContains(String tag);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
abstract List<Family> findByTagsArrayContains(String tag)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
abstract fun findByTagsArrayContains(tag: String): List<Family>
```

  </TabItem>
</Tabs>

或谓词规范：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public static PredicateSpecification<Family> tagsContain(String tag) {
    return (root, criteriaBuilder) -> ((PersistentEntityCriteriaBuilder) criteriaBuilder).arrayContains(root.get("tags"), criteriaBuilder.literal(tag));
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
static PredicateSpecification<Family> tagsContain(String tag) {
    return (root, criteriaBuilder) -> ((PersistentEntityCriteriaBuilder)criteriaBuilder).arrayContains(root.get("tags"), criteriaBuilder.literal(tag))
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun tagsContain(tag: String): PredicateSpecification<Family?>? {
    return PredicateSpecification { root: Root<Family?>, criteriaBuilder: CriteriaBuilder ->
        (criteriaBuilder as PersistentEntityCriteriaBuilder).arrayContains(
            root.get<Any>("tags"),
            criteriaBuilder.literal(tag)
        )
    }
}
```

  </TabItem>
</Tabs>

请注意，Microsoft Data Azure Cosmos Db 支持搜索仅包含单个元素的列表或数组。使用 `ArrayContains` 进行部分搜索时，不能使用通用仓库方法，而只能使用像这样的原始查询自定义方法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Query("SELECT DISTINCT VALUE f FROM family f WHERE ARRAY_CONTAINS(f.children, :gender, true)")
public abstract List<Family> childrenArrayContainsGender(Map.Entry<String, Object> gender);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Query("SELECT DISTINCT VALUE f FROM family f WHERE ARRAY_CONTAINS(f.children, :gender, true)")
abstract List<Family> childrenArrayContainsGender(Map.Entry<String, Object> gender)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Query("SELECT DISTINCT VALUE f FROM family f WHERE ARRAY_CONTAINS(f.children, :gender, true)")
abstract fun childrenArrayContainsGender(gender: Map.Entry<String, Any>): List<Family>
```

  </TabItem>
</Tabs>

然后传递以 "gender" 为键、"gender" 为值的 map 条目，基本上任何对象都可以序列化为 `{"gender"."<gender_value>"}："<gender_value>"}` 的任何对象。这将仅使用性别字段对 `Family` 类中的子女数组执行搜索。这也可以通过使用谓词规范来实现：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public static PredicateSpecification<Family> childrenArrayContainsGender(GenderAware gender) {
    return (root, criteriaBuilder) -> ((PersistentEntityCriteriaBuilder) criteriaBuilder).arrayContains(root.join("children"), criteriaBuilder.literal(gender));
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
static PredicateSpecification<Family> childrenArrayContainsGender(GenderAware gender) {
    return (root, criteriaBuilder) -> ((PersistentEntityCriteriaBuilder) criteriaBuilder).arrayContains(root.join("children"), criteriaBuilder.literal(gender))
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun childrenArrayContainsGender(gender: IGenderAware): PredicateSpecification<Family?>? {
    return PredicateSpecification { root: Root<Family?>, criteriaBuilder: CriteriaBuilder ->
        (criteriaBuilder as PersistentEntityCriteriaBuilder).arrayContains(
            root.join<Any, Any>("children"),
            criteriaBuilder.literal(gender)
        )
    }
}
```

  </TabItem>
</Tabs>

:::tip 注意
示例使用的是编译时已知的值，在这种情况下，最好创建自定义仓库方法，这样就能在编译时生成查询，并消除运行时的开销。建议仅在动态查询中使用标准，因为在构建时查询结构是未知的。
:::

### 8.4.2 更新

要实现更新，您可以使用 [JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/JpaSpecificationExecutor.html) 接口中的以下方法：

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

    // Different style using the criteria builder
    fun nameEquals2(name: String?) = PredicateSpecification { root, criteriaBuilder ->
        criteriaBuilder.equal(root[Person::name], name)
    }

    fun ageIsLessThan2(age: Int) = PredicateSpecification { root, criteriaBuilder ->
        criteriaBuilder.lessThan(root[Person::age], age)
    }

    fun setNewName2(newName: String) = UpdateSpecification { root, query, _ ->
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

### 8.4.3 删除

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

第一个方法期待 [PredicateSpecification](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/criteria/PredicateSpecification.html)，它与[查询](/data/dbc#641-查询)部分描述的接口相同。

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

只需将谓词规范传递给 `deleteAll` 方法即可：

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

## 8.5 Azure Cosmos 规格

由于 Azure Cosmos 数据库不像 Micronaut Data 支持的大多数数据库那样是关系型数据库，它在某些具体方面确实有不同的实现方式。

**关系映射**

由于该数据库不是关系型数据库，不支持跨容器和跨文档连接，因此实体/容器之间的关系不可映射。唯一支持的关系类型是 `@Relation(value=Relation.Kind.EMBEDDED)` 和 `@Relation(value=Relation.Kind.ONE_TO_MANY)`，它们实际上是文档与其嵌入对象或数组之间的关系。

下面是此类映射的一个示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MappedEntity
public class Family {

    @Id
    private String id;

    @PartitionKey
    private String lastName;

    @Relation(value = Relation.Kind.EMBEDDED)
    private Address address;

    @Relation(value = Relation.Kind.ONE_TO_MANY)
    private List<Child> children = new ArrayList<>();
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@MappedEntity
class Family {

    @Id
    private String id
    @PartitionKey
    private String lastName
    @Relation(value = Relation.Kind.EMBEDDED)
    private Address address
    @Relation(value = Relation.Kind.ONE_TO_MANY)
    private List<Child> children = new ArrayList<>()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MappedEntity
data class Family(
    @field:Id
    val id: String,
    @PartitionKey
    var lastName: String,
    @Relation(value = Relation.Kind.EMBEDDED)
    var address: Address,
    @Relation(value = Relation.Kind.ONE_TO_MANY)
    var children: List<Child> = ArrayList(),
```

  </TabItem>
</Tabs>

在这种情况下，我们的查询生成器需要使用 `Relation` 映射，以便根据嵌入对象或数组中的字段生成投影、排序和筛选，这可以在 `FamilyRepository` 中声明的方法中看到。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
    public abstract List<Family> findByAddressStateAndAddressCityOrderByAddressCity(String state, String city);

    public abstract void updateByAddressCounty(String county, boolean registered, @Nullable Date registeredDate);

    @Join(value = "children.pets", alias = "pets")
    public abstract List<Family> findByChildrenPetsType(PetType type);

    public abstract List<Child> findChildrenByChildrenPetsGivenName(String name);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
    abstract List<Family> findByAddressStateAndAddressCityOrderByAddressCity(String state, String city)

    abstract void updateByAddressCounty(String county, boolean registered, @Nullable Date registeredDate)

    @Join(value = "children.pets", alias = "pets")
    abstract List<Family> findByChildrenPetsType(PetType type)

    abstract List<Child> findChildrenByChildrenPetsGivenName(String name)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
    abstract fun findByAddressStateAndAddressCityOrderByAddressCity(state: String, city: String): List<Family>
    abstract fun updateByAddressCounty(county: String, registered: Boolean, @Nullable registeredDate: Date?)
    @Join(value = "children.pets", alias = "pets")
    abstract fun findByChildrenPetsType(type: PetType): List<Family>
    abstract fun findChildrenByChildrenPetsGivenName(name: String): List<Child>
```

  </TabItem>
</Tabs>

由于数据库的性质和关系的实现，级联的意义也不大。文档中的嵌入对象和数组会在保存文档时自动保存。

**身份**

在 Azure Cosmos 数据库中，每个文档都有字符串类型的内部 id 属性。Micronaut Data Cosmos 希望 `@Id` 的类型为：`Short`、 `Integer`、 `Long`、 `String` 或 `UUID`。在保存和读取时，类型被序列化为字符串，并从存储在 id 属性中的字符串反序列化。使用不支持的类型声明带有 `@Id` 注解的属性将导致异常。生成 id 只适用于 `String` 和 `UUID`，其中 `UUID` 可通过使用 `@GeneratedValue` 或 `@AutoPopulated` 注解生成。字符串 ID 只能通过 `@GeneratedValue` 注解生成。数字 id 不能自动生成，应由用户在保存前设置 id 值。不支持复合标识。

**分区密钥**

在 Azure Cosmos 数据库中，分区键是将数据有效分配到不同逻辑集和物理集的核心要素，以便尽快完成对数据库的查询。每个映射实体都应定义分区键。如上文所述，可以在适当的实体字段上使用 [@PartitionKey](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/cosmos/annotation/PartitionKey.html) 注解或通过[配置](#82-配置)来定义分区键，详见配置部分的说明。有效使用定义明确的分区密钥将提高操作性能并降低请求单位成本。Micronaut Data Cosmos 尽可能使用分区密钥。下面是一些在读取、更新或删除操作中使用分区密钥的仓库方法示例。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
    public abstract Optional<Family> queryById(String id, PartitionKey partitionKey);

    public abstract void updateRegistered(@Id String id, boolean registered, PartitionKey partitionKey);

    public abstract void deleteByLastName(String lastName, PartitionKey partitionKey);

    public abstract void deleteById(String id, PartitionKey partitionKey);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
    abstract Optional<Family> queryById(String id, PartitionKey partitionKey)

    abstract void updateRegistered(@Id String id, boolean registered, PartitionKey partitionKey)

    abstract void deleteByLastName(String lastName, PartitionKey partitionKey)

    abstract void deleteById(String id, PartitionKey partitionKey)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
    abstract fun queryById(id: String?, partitionKey: PartitionKey?): Optional<Family?>?
    abstract fun deleteByLastName(lastName: String, partitionKey: PartitionKey)
    abstract fun deleteById(id: String, partitionKey: PartitionKey)
    abstract fun updateRegistered(@Id id: String, registered: Boolean, partitionKey: PartitionKey)
```

  </TabItem>
</Tabs>

**诊断**

Azure Cosmos Db 提供操作诊断，这样用户就可以获得这些信息，或许还可以与他们的日志或度量系统集成。在 Micronaut Data Azure 中，我们公开了 [CosmosDiagnosticsProcessor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/cosmos/operations/CosmosDiagnosticsProcessor.html) 接口。用户需要实现该接口并将其添加到上下文中，这样我们的操作类就可以使用该接口。它只有一个方法：

```java
void processDiagnostics(String operationName, @Nullable CosmosDiagnostics cosmosDiagnostics, @Nullable String activityId, double requestCharge);
```

在每次对 Azure Cosmos Db 进行操作后都会调用。参数 operationName 是 Micronaut Data Azure 中的内部操作名称，它有这些已知值：

```java
String CREATE_DATABASE_IF_NOT_EXISTS = "CreateDatabaseIfNotExists";
String REPLACE_DATABASE_THROUGHPUT = "ReplaceDatabaseThroughput";
String CREATE_CONTAINER_IF_NOT_EXISTS = "CreateContainerIfNotExists";
String REPLACE_CONTAINER_THROUGHPUT = "ReplaceContainerThroughput";
String REPLACE_CONTAINER = "ReplaceContainer";
String QUERY_ITEMS = "QueryItems";
String EXECUTE_BULK = "ExecuteBulk";
String CREATE_ITEM = "CreateItem";
String REPLACE_ITEM = "ReplaceItem";
String DELETE_ITEM = "DeleteItem";
```
以便用户了解正在处理哪个操作的诊断结果。

## 8.6 使用属性转换器

在某些情况下，您希望以不同于实体的方式在数据库中表示属性。

请看下面的实体示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MappedEntity
public class Book {
    @Id
    @GeneratedValue
    @PartitionKey
    private String id;
    private String title;
    private int pages;
    @MappedProperty(converter = ItemPriceAttributeConverter.class)
    @Nullable
    private ItemPrice itemPrice;
    @DateCreated
    private Date createdDate;
    @DateUpdated
    private Date updatedDate;

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
    private String id
    private String title
    private int pages
    @MappedProperty(converter = ItemPriceAttributeConverter)
    @Nullable
    private ItemPrice itemPrice
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
                var id: String?,
                var title: String,
                var pages: Int = 0,
                @MappedProperty(converter = ItemPriceAttributeConverter::class)
                var itemPrice: ItemPrice? = null,
                @DateCreated
                var createdDate: Date? = null,
                @DateUpdated
                var updatedDate: Date? = null)
```

  </TabItem>
</Tabs>

`Book` 类引用了 `ItemPrice` 类型。`ItemPrice` 类型定义如下：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.annotation.Introspected;

@Introspected
public class ItemPrice {

    private double price;

    public ItemPrice(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }

    public static ItemPrice valueOf(double price) {
        return new ItemPrice(price);
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
class ItemPriceAttributeConverter implements AttributeConverter<ItemPrice, Double> {

    @Override // (2)
    Double convertToPersistedValue(ItemPrice itemPrice, ConversionContext context) {
        return itemPrice == null ? null : itemPrice.getPrice()
    }

    @Override // (3)
    ItemPrice convertToEntityValue(Double value, ConversionContext context) {
        return value == null ? null : new ItemPrice(value)
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
class ItemPriceAttributeConverter : AttributeConverter<ItemPrice?, Double?> {

    // (2)
    override fun convertToPersistedValue(itemPrice: ItemPrice?, context: ConversionContext): Double? {
        return itemPrice?.price
    }

    // (3)
    override fun convertToEntityValue(value: Double?, context: ConversionContext): ItemPrice? {
        return if (value == null) null else ItemPrice(value)
    }

}
```

  </TabItem>
</Tabs>

1. 属性转换器实现 [@AttributeConverter](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/runtime/convert/AttributeConverter.html) 且必须是一个 Bean
2. 从 `ItemPrice` 到 `Double` 的转换器
3. 从 `Double` 到 `ItemPrice` 的转换器

:::tip 注意
使用 [@MappedProperty](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedProperty.html) 可以定义转换器的结果类型：`@MappedProperty(converterPersistedType = Double.class)`，在这种情况下，数据类型将被自动检测到。
:::

## 8.7 优化锁定

乐观锁定是一种策略，即注意实际记录状态的版本，只有当版本相同时才修改记录。

与 Micronaut 中的其他数据库实现不同，Azure Cosmos 数据库依赖于每个文档中 _etag 字段的存在。我们不使用 [@Version](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Version.html)，因为 _etag 字段是字符串类型，为此我们引入了 [@ETag](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/cosmos/annotation/ETag.html) 注解。

每次在 Azure Cosmos 数据库中更新文档时都会更新该字段，在下一次更新之前，它会检查正在更新的文档中的当前值是否与数据库中的当前值匹配。如果值不匹配，Micronaut 将抛出 [OptimisticLockException](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/exceptions/OptimisticLockException.html)。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@ETag
private String documentVersion;
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@ETag
private String documentVersion;
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@ETag
var documentVersion: String? = null
```

  </TabItem>
</Tabs>

> [英文链接](https://micronaut-projects.github.io/micronaut-data/latest/guide/#azureCosmos)

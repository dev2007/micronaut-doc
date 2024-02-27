---
sidebar_position: 40
---

# 4. Micronaut Data JPA Hibernate

Micronaut Data JPA 增加了对具有编译时生成的查询、JPA 标准和事务管理的存储库的支持。

## 4.1 JPA 注解

Micronaut Data JPA 4.0.0 版本支持 Hibernate 6，而早期版本支持Hibernate 5。您可以使用 `javax.persistenceannotations`（如 `javax.persistence.Entity`）来映射您的实体。

对于 Hibernate 6 Micronaut Data JPA 支持 `jakarta.persistence` 注解，如 `jakarta.persistence.Entity` 来映射你的实体。

## 4.2 快速入门

最快速的入门方法是使用 [Micronaut Launch](https://micronaut.io/launch/) 创建一个新的 Micronaut 应用程序，并选择 `data-jpa`、数据库驱动程序、池化和数据库迁移框架功能。

:::note 提示
你还可以在 Micronaut 指南中找到关于构建 Micronaut Data JPA 应用程序的精彩指南，包括各种语言的示例代码：[使用 Micronaut Data JPA 访问数据库](https://guides.micronaut.io/latest/micronaut-jpa-hibernate.html)。
:::

点击下表中的一个链接，您将进入 [Micronaut Launch](https://micronaut.io/launch/)，其中的相应选项已根据您选择的语言和构建工具进行了预配置：

*表 1. 使用 Micronaut Launch 创建应用程序*

	
||Gradle|Maven|
|--|--|--|
|Java|[打开](https://micronaut.io/launch?features=data-jpa&features=flyway&features=mysql&features=jdbc-hikari&lang=JAVA&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-jpa&features=flyway&features=mysql&features=jdbc-hikari&lang=JAVA&build=MAVEN)]|
|Kotlin|[打开](https://micronaut.io/launch?features=data-jpa&features=flyway&features=mysql&features=jdbc-hikari&lang=KOTLIN&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-jpa&features=flyway&features=mysql&features=jdbc-hikari&lang=KOTLIN&build=MAVEN)|
|Groovy|[打开](https://micronaut.io/launch?features=data-jpa&features=flyway&features=mysql&features=jdbc-hikari&lang=GROOVY&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-jpa&features=flyway&features=mysql&features=jdbc-hikari&lang=GROOVY&build=MAVEN)|

*使用 CLI 创建应用程序*

```bash
# For Maven add: --build maven
$ mn create-app --lang java example --features data-jpa,flyway,mysql,jdbc-hikari
```

或通过 `curl`：

*使用 `curl` 创建应用程序*

:::tip 提示
使用 JDBC 驱动时，需要从 Micronaut SQL 项目中添加 JDBC 连接池模块（Hikari、Tomcat JDBC 或 DBCP）。
:::

有关配置 [Hibernate](/sql#4-配置-Hibernate)、[JDBC 和池](/sql#3-配置-JDBC)的更多信息，使用 Micronaut SQL 项目文档。

您需要在应用程序配置文件中配置数据源。例如，对于 H2：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
datasources.default.url=jdbc:h2:mem:devDb
datasources.default.driverClassName=org.h2.Driver
datasources.default.username=sa
datasources.default.password=
datasources.default.schema-generate=CREATE_DROP
datasources.default.dialect=H2
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
datasources:
  default:
    url: jdbc:h2:mem:devDb
    driverClassName: org.h2.Driver
    username: sa
    password: ''
    schema-generate: CREATE_DROP
    dialect: H2
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[datasources]
  [datasources.default]
    url="jdbc:h2:mem:devDb"
    driverClassName="org.h2.Driver"
    username="sa"
    password=""
    schema-generate="CREATE_DROP"
    dialect="H2"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
datasources {
  'default' {
    url = "jdbc:h2:mem:devDb"
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
  datasources {
    default {
      url = "jdbc:h2:mem:devDb"
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
  "datasources": {
    "default": {
      "url": "jdbc:h2:mem:devDb",
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

并在应用程序配置文件中添加以下配置。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
jpa.default.entity-scan.packages=example.domain
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
jpa:
  default:
    entity-scan:
        packages: 'example.domain'
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[jpa]
  [jpa.default]
    [jpa.default.entity-scan]
      packages="example.domain"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
jpa {
  'default' {
    entityScan {
      packages = "example.domain"
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
      entity-scan {
        packages = "example.domain"
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
      "entity-scan": {
        "packages": "example.domain"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

其中，`jpa.default.entity-scan.packages` 引用了 `@Entity` 类所在的根包。

并确保正确配置了实现。

然后，您就可以定义一个 `@Entity`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.serde.annotation.Serdeable;

import jakarta.persistence.*;

@Serdeable
@Entity
public class Book {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    private int pages;

    public Book(String title, int pages) {
        this.title = title;
        this.pages = pages;
    }

    public Book() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id

@Entity
class Book {
    @Id
    @GeneratedValue
    Long id
    String title
    int pages

    Book(String title, int pages) {
        this.title = title
        this.pages = pages
    }

    Book() {
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id

@Entity
data class Book(@Id
                @GeneratedValue
                var id: Long,
                var title: String,
                var pages: Int = 0)
```

  </TabItem>
</Tabs>

随后是一个从 [CrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/CrudRepository.html) 扩展而来的接口：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example

import io.micronaut.context.annotation.Executable
import io.micronaut.context.annotation.Parameter
import io.micronaut.data.annotation.*
import io.micronaut.data.model.*
import io.micronaut.data.repository.CrudRepository

@Repository // (1)
interface BookRepository extends CrudRepository<Book, Long> { // (2)
    @Executable
    Book find(String title)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.context.annotation.Executable
import io.micronaut.context.annotation.Parameter
import io.micronaut.data.annotation.*
import io.micronaut.data.model.*
import io.micronaut.data.repository.CrudRepository

@Repository // (1)
interface BookRepository extends CrudRepository<Book, Long> { // (2)
    @Executable
    Book find(String title)
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

1. 接口使用 [@Repository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Repository.html) 进行注解
2. `CrudRepository` 接口有两个通用参数，即实体类型（本例中为 `Book`）和 ID 类型（本例中为 `Long`）。

现在，您可以对实体执行 CRUD（创建、读取、更新、删除）操作。`example.BookRepository` 的实现是在编译时创建的。要获得对它的引用，只需注入 Bean：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Inject
BookRepository bookRepository;
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Inject
BookRepository bookRepository;
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
Book book = new Book();
book.setTitle("The Stand");
book.setPages(1000);
bookRepository.save(book);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Book book = new Book(title:"The Stand", pages:1000)
bookRepository.save(book)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
var book = Book(0,"The Stand", 1000)
bookRepository.save(book)
```

  </TabItem>
</Tabs>

**检索实例（读取）**

要读取一本 `book`，请使用 `findById`：

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

要更新实例，请再次使用 `save`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
book.setTitle("Changed");
bookRepository.save(book);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
book.title = "Changed"
bookRepository.save(book)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
book.title = "Changed"
bookRepository.save(book)
```

  </TabItem>
</Tabs>

对于部分实体更新，可以使用类似这样的自定义更新方法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@QueryHint(name = "jakarta.persistence.FlushModeType", value = "AUTO")
void updatePages(@Id Long id, @Parameter("pages") int pages);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@QueryHint(name = "jakarta.persistence.FlushModeType", value = "AUTO")
void updatePages(@Id Long id, @Parameter("pages") int pages)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@QueryHint(name = "jakarta.persistence.FlushModeType", value = "AUTO")
void updatePages(@Id Long id, @Parameter("pages") int pages)
```

  </TabItem>
</Tabs>

在本例中，为了让更新在当前会话中传播，可以添加 `QueryHint` 注解来强制会话刷新。

对于 Hibernate 6，需要使用 `jakarta.persistence.FlushModeType` 代替 `javax.persistence.FlushModeType`。

**删除实例（删除）**

要删除一个实例，请使用 `deleteById`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
bookRepository.deleteById(id)
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

## 4.3 使用 Micronaut 数据 JPA Hibernate 记录 SQL

在应用程序的配置中，将 `jpa.default.properties.hibernate.show_sql` 和 `jpa.default.properties.hibernate.format_sql` 设置为 `true`，就可以记录查询。

## 4.4 连接查询

为了优化你的查询，你可能需要改变连接，以便在结果集中准确获取你需要的数据。

:::note 提示
如果出现 `LazyInitializationException`，这并不是 Micronaut Data 或 Hibernate 中的错误，而是表明你应该改变你的查询连接，以获取实现用例所需的相关数据。
:::

考虑一个 `Product` 实体：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import jakarta.persistence.*;

@Entity
public class Product {

    @Id
    @GeneratedValue
    private Long id;
    private String name;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Manufacturer manufacturer;

    public Product(String name, Manufacturer manufacturer) {
        this.name = name;
        this.manufacturer = manufacturer;
    }

    public Product() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Manufacturer getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(Manufacturer manufacturer) {
        this.manufacturer = manufacturer;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import jakarta.persistence.*

@Entity
class Product {

    @Id
    @GeneratedValue
    Long id
    String name
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    Manufacturer manufacturer

    Product(String name, Manufacturer manufacturer) {
        this.name = name
        this.manufacturer = manufacturer
    }

    Product() {
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import jakarta.persistence.*

@Entity
data class Product(
    @Id
    @GeneratedValue
    var id: Long?,
    var name: String,
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    var manufacturer: Manufacturer
)
```

  </TabItem>
</Tabs>

这与 `Manufacturer` 实体有关联：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.configuration.hibernate.jpa.proxy.GenerateProxy;
import org.hibernate.annotations.BatchSize;

import jakarta.persistence.*;

@Entity
@GenerateProxy
@BatchSize(size = 10)
public class Manufacturer {
    @Id
    @GeneratedValue
    private Long id;
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import jakarta.persistence.*

@Entity
class Manufacturer {

    @Id
    @GeneratedValue
    Long id
    String name
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import jakarta.persistence.*

@Entity
data class Manufacturer(
    @Id
    @GeneratedValue
    var id: Long?,
    var name: String
)
```

  </TabItem>
</Tabs>

在这种情况下，当您从数据库读取每个 `Product` 时，还需要额外的选择来检索每个 `Product` 的 `Manufacturer`。这将导致 N + 1 次查询。

要解决这个问题，您可以在仓库接口上使用 [@Join](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Join.html) 注解来指定执行 JOIN FETCH 以检索相关的 `Manufacturer`。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Repository
public interface ProductRepository extends CrudRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Join(value = "manufacturer", type = Join.Type.FETCH) // (1)
    List<Product> list();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Repository
abstract class ProductRepository implements CrudRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Join(value = "manufacturer", type = Join.Type.FETCH) // (1)
    abstract List<Product> list()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Repository
interface ProductRepository : CrudRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Join(value = "manufacturer", type = Join.Type.FETCH) // (1)
    fun list(): List<Product>
}
```

  </TabItem>
</Tabs>

1. [@Join](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Join.html) 用于表示应包含 `JOIN FETCH` 子句。

请注意，[@Join](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Join.html) 注解是可重复的，因此可以为不同的关联指定多次。此外，注解的类型成员可用于指定连接类型，例如 LEFT、INNER 或 RIGHT。

**JPA 2.1 实体图**

使用 JPA 2.1 实体图是指定查询连接的 JPA 特定替代方法。使用实体图时，您可以由 JPA 实现来选择要使用的适当连接类型：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@EntityGraph(attributePaths = {"manufacturer", "title"}) // (1)
List<Product> findAll();
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@EntityGraph(attributePaths = ["manufacturer", "title"]) // (1)
abstract List<Product> findAll()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@EntityGraph(attributePaths = ["manufacturer", "title"]) // (1)
override fun findAll(): List<Product>
```

  </TabItem>
</Tabs>

1. `attributePaths` 成员用于指定实体图中要包含的路径。

## 4.5 明确查询

如果想对编译时生成的查询进行更多控制，可以使用 [@Query](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Query.html) 注解指定一个显式查询：

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

您可以使用冒号（`:`）指定命名参数，冒号后跟名称，这些参数必须与指定给方法的参数相匹配，否则会出现编译错误，请使用反斜杠 `\:` 转义冒号，因为它不是参数指定。

请注意，如果该方法返回一个用于分页的 [Page](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/Page.html)，则必须使用 [@Query](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Query.html) 注解中的 `countQuery` 成员额外指定一个执行等价计数的查询。

## 4.6 本地查询

在 JPA 中使用 Micronaut Data 时，可以通过在 [@Query](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Query.html) 注解中将 `nativeQuery` 设置为 true 来执行本地 SQL 查询：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Query(value = "select * from books b where b.title like :title limit 5",
       nativeQuery = true)
List<Book> findNativeBooks(String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Query(value = "select * from books b where b.title like :title limit 5",
        nativeQuery = true)
List<Book> findNativeBooks(String title)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Query(value = "select * from books b where b.title like :title limit 5", nativeQuery = true)
fun findNativeBooks(title: String): List<Book>
```

  </TabItem>
</Tabs>

上述示例将针对数据库执行原始 SQL。

:::tip 提示
对于返回 [Page](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/Page.html) 的 [Pagination](https://micronaut-projects.github.io/micronaut-data/latest/guide/#pagination) 查询，您还需要指定一个本地 `countQuery`。
:::

## 4.7 JPA 规范

基于[与 Spring Data 相同的概念](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#specifications)，当您需要通过组合 JPA 标准动态创建查询时，您可以实现 [JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jpa/repository/JpaSpecificationExecutor.html) 接口，该接口提供了多个接收 [Specification](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jpa/repository/criteria/Specification.html) 实例的方法，可与现有的仓库接口结合使用。

[Specification](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jpa/repository/criteria/Specification.html) 接口代表了一个简单的基于标准的 API 入口点：

```java
public interface Specification<T> {

    @Nullable
    Predicate toPredicate(@NonNull Root<T> root,
                          @NonNull CriteriaQuery<?> query,
                          @NonNull CriteriaBuilder criteriaBuilder);

}
```

下面的示例演示了使用规范进行自定义实体过滤：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
class Specifications {

    public static Specification<Product> nameEquals(String name) {
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(root.get("name"), name);
    }

    public static Specification<Product> nameEqualsCaseInsensitive(String name) {
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(criteriaBuilder.lower(root.get("name")), name.toLowerCase());
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
static class Specifications {

    static Specification<Product> nameEquals(String name) {
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(root.get("name"), name)
    }

    static Specification<Product> nameEqualsCaseInsensitive(String name) {
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(criteriaBuilder.lower(root.get("name")), name.toLowerCase());
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
static class Specifications {

    static Specification<Product> nameEquals(String name) {
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(root.get("name"), name)
    }

    static Specification<Product> nameEqualsCaseInsensitive(String name) {
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(criteriaBuilder.lower(root.get("name")), name.toLowerCase());
    }
}
```

  </TabItem>
</Tabs>

您可以在仓库类中创建默认方法，并结合多种规范提供动态实现：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Repository
public interface ProductRepository extends CrudRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Transactional
    default List<Product> findByName(String name, boolean caseInsensitive, boolean includeBlank) {
        Specification<Product> specification;
        if (caseInsensitive) {
            specification = Specifications.nameEqualsCaseInsensitive(name);
        } else {
            specification = Specifications.nameEquals(name);
        }
        if (includeBlank) {
            specification = specification.or(Specifications.nameEquals(""));
        }
        return findAll(specification);
    }

    class Specifications {

        public static Specification<Product> nameEquals(String name) {
            return (root, query, criteriaBuilder)
                    -> criteriaBuilder.equal(root.get("name"), name);
        }

        public static Specification<Product> nameEqualsCaseInsensitive(String name) {
            return (root, query, criteriaBuilder)
                    -> criteriaBuilder.equal(criteriaBuilder.lower(root.get("name")), name.toLowerCase());
        }
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Repository
abstract class ProductRepository implements CrudRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Transactional
    List<Product> findByName(String name, boolean caseInsensitive, boolean includeBlank) {
        Specification<Product> specification
        if (caseInsensitive) {
            specification = Specifications.nameEqualsCaseInsensitive(name)
        } else {
            specification = Specifications.nameEquals(name)
        }
        if (includeBlank) {
            specification = specification | Specifications.nameEquals("")
        }
        return findAll(specification)
    }

    static class Specifications {

        static Specification<Product> nameEquals(String name) {
            return (root, query, criteriaBuilder)
                    -> criteriaBuilder.equal(root.get("name"), name)
        }

        static Specification<Product> nameEqualsCaseInsensitive(String name) {
            return (root, query, criteriaBuilder)
                    -> criteriaBuilder.equal(criteriaBuilder.lower(root.get("name")), name.toLowerCase());
        }
    }

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Repository
interface ProductRepository : CrudRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Transactional
    fun findByName(name: String, caseInsensitive: Boolean, includeBlank: Boolean): List<Product> {
        var specification = if (caseInsensitive) {
            Specifications.nameEqualsCaseInsensitive(name)
        } else {
            Specifications.nameEquals(name)
        }
        if (includeBlank) {
            specification = specification.or(Specifications.nameEquals(""))
        }
        return findAll(specification)
    }

    object Specifications {

        fun nameEquals(name: String) = Specification<Product> { root, _, criteriaBuilder ->
            criteriaBuilder.equal(root.get<String>("name"), name)
        }

        fun nameEqualsCaseInsensitive(name: String) = Specification<Product> { root, _, criteriaBuilder ->
            criteriaBuilder.equal(criteriaBuilder.lower(root.get("name")), name.toLowerCase())
        }
    }

}
```

  </TabItem>
</Tabs>

:::tip 注意
在 Micronaut Data 中，首选方式是在构建时生成查询。建议仅对需要在运行时动态生成的查询使用基于标准的 API。
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-data/latest/guide/#hibernate)

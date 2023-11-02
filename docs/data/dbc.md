---
sidebar_position: 50
---

# 6. Micronaut Data JDBC 和 R2DBC

Micronaut Data JDBC / R2DBC 是一个预计算本地 SQL 查询（给定一个特定的数据库方言）并提供一个仓库的实现，它是本地结果集和实体之间的一个简单数据映射器。

Micronaut Data JDBC / R2DBC 支持 Micronaut Data for JPA 的所有功能，包括[动态查找器](/data/shared#331-查询标准)、[分页](/data/shared#332-分页)、[投影](/data/shared#334-查询投影)、[数据传输对象（DTO）](/data/shared#335-DTO-投影)、[批量更新](/data/shared#34-访问数据)、[优化锁定](#632-乐观锁定)等。

但是，Micronaut Data JDBC / R2DBC 不是对象关系映射（ORM）实现，现在和将来都不会包含以下任何概念：

- 关联的懒加载或代理
- 脏检查
- 持久化上下文/会话
- 一级缓存和实体代理

Micronaut Data JDBC / R2DBC 是为喜欢低级体验和直接使用 SQL 的用户设计的。

:::tip 注意
Micronaut Data JDBC / R2DBC 可用于实现典型应用程序中存在的大多数简单 SQL 查询，并且不包括任何运行时查询构建 DSL。对于更复杂的查询，Micronaut Data JDBC / R2DBC 可以与现有的许多优秀的 Java SQL DSL（如 [JOOQ](https://www.jooq.org/)、[QueryDSL](http://www.querydsl.com/)、[Requery](https://github.com/requery/requery) 或甚至 JPA）之一搭配使用。
:::

## 6.1 JDBC

Micronaut Data JDBC 是为喜欢低级体验和直接使用 SQL 的用户设计的。
以下部分包含 JDBC 的具体配置和文档。

### 6.1.1 快速入门

最快速的入门方法是使用 [Micronaut Launch](https://micronaut.io/launch/) 创建一个新的 Micronaut 应用程序，并选择 `data-jdbc`、数据库驱动和数据库迁移框架功能。这也可以通过 CLI 完成。

:::notice 提示
您还可以在 Micronaut 指南中找到关于构建 Micronaut 数据 JDBC 应用程序的精彩指南，包括各种语言的示例代码：[使用 Micronaut Data JDBC 访问数据库](https://guides.micronaut.io/latest/micronaut-data-jdbc-repository.html)
:::

点击下表中的一个链接，您将进入 [Micronaut Launch](https://micronaut.io/launch/)，其中的相应选项已根据您选择的语言和构建工具进行了预配置：

*表 1. 使用 Micronaut Launch 创建 JDBC 应用程序*

	
||Gradle|Maven|
|--|--|--|
|Java|[打开](https://micronaut.io/launch?features=data-jdbc&features=flyway&features=mysql&features=jdbc-hikari&lang=JAVA&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-jdbc&features=flyway&features=mysql&features=jdbc-hikari&lang=JAVA&build=MAVEN)|
|Kotlin|[打开](https://micronaut.io/launch?features=data-jdbc&features=flyway&features=mysql&features=jdbc-hikari&lang=KOTLIN&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-jdbc&features=flyway&features=mysql&features=jdbc-hikari&lang=KOTLIN&build=MAVEN)|
|Groovy|[打开](https://micronaut.io/launch?features=data-jdbc&features=flyway&features=mysql&features=jdbc-hikari&lang=GROOVY&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-jdbc&features=flyway&features=mysql&features=jdbc-hikari&lang=GROOVY&build=MAVEN)|


*使用 CLI 创建应用程序*

```bash
# For Maven add: --build maven
$ mn create-app --lang java example --features data-jdbc,flyway,mysql,jdbc-hikari
```

或通过 `curl`：

*使用 `curl` 创建应用程序*

```bash
# For Maven add to the URL: &build=maven
$ curl https://launch.micronaut.io/demo.zip?lang=java&features=data-jdbc,flyway,mysql,jdbc-hikari -o demo.zip && unzip demo.zip -d demo && cd demo
```

生成的应用程序将在编译范围内依赖于 `micronaut-data-jdbc` 模块，并将使用 MySQL，因为我们通过 `mysql` 特性添加了对 MySQL JDBC 驱动的依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.data:micronaut-data-jdbc")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.data</groupId>
    <artifactId>micronaut-data-jdbc</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

还应确保已配置 JDBC 驱动和连接池依赖关系：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.micronaut.sql:micronaut-jdbc-hikari")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-jdbc-hikari</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

注解处理器需要正确设置 Micronaut 数据处理器依赖关系，以实现编译时生成和评估：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut.data:micronaut-data-processor")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut.data</groupId>
        <artifactId>micronaut-data-processor</artifactId>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

:::tip 注意
对于 Kotlin，依赖应位于 `kapt` 范围中；对于 Groovy，依赖应位于 `compileOnly` 范围中。
:::

接下来，你需要配置至少一个数据源。应用程序配置文件中的以下代码段是配置默认 JDBC 数据源的示例：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
datasources.default.url=jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER
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
    url: jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER
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
    url="jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER"
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
    url = "jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER"
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
      url = "jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER"
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
      "url": "jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER",
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

:::tip 注意
`schema-generate` 设置仅对演示和测试微不足道的示例有用，对于生产使用，建议将 Micronaut Data 与 SQL 迁移工具，如 [Flyway](https://micronaut-projects.github.io/micronaut-flyway/latest/guide/index.html) 或 [Liquibase](https://micronaut-projects.github.io/micronaut-liquibase/latest/guide/index.html) 搭配使用。
:::

要从数据库中检索对象，你需要定义一个 [@MappedEntity](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedEntity.html) 注解的类。请注意，这是一个元注解，实际上，如果你愿意，可以使用 JPA 注释（仅支持一部分，稍后详述）。如果您希望使用 JPA 注释，请包含以下仅 `compileOnly` 范围的依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
compileOnly("jakarta.persistence:jakarta.persistence-api")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>jakarta.persistence</groupId>
    <artifactId>jakarta.persistence-api</artifactId>
    <scope>provided</scope>
</dependency>
```

  </TabItem>
</Tabs>

要在 `javax.persistence` 包中使用 JPA 注释，请使用：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
compileOnly("jakarta.persistence:jakarta.persistence-api:3.0.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>jakarta.persistence</groupId>
    <artifactId>jakarta.persistence-api</artifactId>
    <version>3.0.0</version>
    <scope>provided</scope>
</dependency>
```

  </TabItem>
</Tabs>

:::caution 警告
如果您想在使用 Micronaut Data JDBC 的实体中使用 JPA 注释，我们强烈建议您使用 `jakarta.persistence` 注释。Micronaut Data 将在未来移除对 `javax.persistence` 注解的支持。
:::

如上所述，由于只使用注解，因此依赖关系只能在编译时包含，而不能在运行时包含，这样就不会拖累其他 API，从而减少 JAR 文件的大小。
然后，您可以定义一个 `@Entity`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import jakarta.persistence.*;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public int getPages() {
        return pages;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import jakarta.persistence.*

@Entity
class Book {
    @Id
    @GeneratedValue
    Long id
    private String title
    private int pages

    Book(String title, int pages) {
        this.title = title
        this.pages = pages
    }

    String getTitle() {
        return title
    }

    int getPages() {
        return pages
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

随后是一个从 [CrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/CrudRepository.html) 扩展而来的接口。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.*;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.*;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import java.util.List;


@JdbcRepository(dialect = Dialect.H2)        // (1)
interface BookRepository extends CrudRepository<Book, Long> { // (2)
    Book find(String title);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.data.annotation.*
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.*
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository
import java.util.List


@JdbcRepository(dialect = Dialect.H2)        // (1)
interface BookRepository extends CrudRepository<Book, Long> { // (2)
    Book find(String title);
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.context.annotation.Executable
import io.micronaut.data.annotation.*
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.*
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository
import jakarta.transaction.Transactional

@JdbcRepository(dialect = Dialect.H2) // (1)
interface BookRepository : CrudRepository<Book, Long> { // (2)
    @Executable
    fun find(title: String): Book
}
```

  </TabItem>
</Tabs>

1. 该接口使用 [@JdbcRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jdbc/annotation/JdbcRepository.html) 进行注解，并指定了用于生成查询的 H2 方言
2. `CrudRepository` 接口接受 2 个通用参数，即实体类型（本例中为 `Book`）和 ID 类型（本例中为 `Long`）。

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

要保存实例，请使用 `CrudRepository` 接口的保存方法：

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
var book = Book(0,"The Stand", 1000)
bookRepository.save(book)
```

  </TabItem>
</Tabs>

:::tip 注意
与 JPA 实现不同的是，没有脏检查，因此 `save` 总是执行 SQL `INSERT`。对于批量更新，请使用 `update` 方法（参见下一节）。
:::

**检索实例（读取）**

要回读一个 book，请使用 `findById` 方法：

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

使用 Micronaut Data JDBC，您必须手动实现 `update` 方法，因为 JDBC 实现不包括任何脏检查或持久化会话概念。因此，您必须为仓库中的更新定义明确的更新方法。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void update(@Id Long id, int pages);

void update(@Id Long id, String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void update(@Id Long id, int pages);

void update(@Id Long id, String title);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun update(@Id id: Long?, pages: Int)

fun update(@Id id: Long?, title: String)
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
bookRepository.update(book.getId(), "Changed")
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
bookRepository.update(book.id, "Changed")
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

恭喜您已经实施了第一个 Micronaut Data JDBC 仓库！继续阅读，了解更多信息。

### 6.1.2 配置

**JDBC 驱动**

Micronaut Data JDBC 要求配置一个适当的 java.sql.DataSource bean。

你可以手动完成或使用 [Micronaut JDBC](/sql#3-配置-JDBC) 模块，该模块提供开箱即用的支持，可配置 Tomcat JDBC、Hikari、Commons DBCP 或 Oracle UCP 的连接池。

**SQL 日志**

你可以通过为 `io.micronaut.data.query` 日志器启用跟踪日志来启用 SQL 日志。例如在 `logback.xml` 中：

*启用 SQL 查询记录*

```xml
<logger name="io.micronaut.data.query" level="trace" />
```

**创建模式**

要创建数据库模式，建议将 Micronaut Data 与 SQL 迁移工具，如 [Flyway](https://micronaut-projects.github.io/micronaut-flyway/latest/guide/index.html) 或 [Liquibase](https://micronaut-projects.github.io/micronaut-liquibase/latest/guide/index.html) 配对使用。

SQL 迁移工具可为在一系列数据库中创建和演化模式提供更全面的支持。

如果你想快速测试 Micronaut Data，那么你可以将数据源的 `schema-generate` 选项设置为 `create-drop` 以及适当的模式名称：

:::tip 注意
大多数数据库迁移工具都使用 JDBC 驱动程序来更改数据库。如果使用 R2DBC，则需要单独配置 JDBC 数据源。
:::

*使用 schema-generate*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
datasources.default.url=jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER
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
    url: jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER
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
    url="jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER"
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
    url = "jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER"
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
      url = "jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER"
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
      "url": "jdbc:h2:mem:devDb;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE;NON_KEYWORDS=USER",
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

`schema-generate` 选项目前只推荐用于简单的应用程序、测试和演示，并不能用于生产。配置中设置的方言是用于生成模式的方言。

**设置方言**

如上配置所示，您还应配置方言。虽然查询会在资源库中预先计算，但在某些情况下（如分页）仍需要指定方言。下表总结了支持的方言：

*表 1. 支持的 JDBC / R2DBC 方言*

|方言|描述|
|--|--|
|[H2](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/sql/Dialect.html#H2)|H2 数据库（通常用于内存测试）|
|[MYSQL](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/sql/Dialect.html#MYSQL)|MySQL 5.5 或更高版本|
|[POSTGRES](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/sql/Dialect.html#POSTGRES)|Postgres 9.5 或更高版本|
|[SQL_SERVER](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/sql/Dialect.html#SQL_SERVER)|SQL Server 2012 或更高版本|
|[ORACLE](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/sql/Dialect.html#ORACLE)|Oracle 12c 或更高版本|

:::danger 危险
配置中的方言设置不能取代确保在版本库中设置正确方言的需要。如果配置中的方言是 H2，那么版本库中应该有 `@JdbcRepository(dialect = Dialect.H2) / @R2dbcRepository(dialect = Dialect.H2)`。因为版本库是在编译时计算的，所以当时并不知道配置值。
:::

## 6.2 R2DBC

Micronaut Data R2DBC 是专为喜欢较低级体验和直接使用 SQL 并希望构建非阻塞、反应式应用程序的用户设计的。
以下部分包含 R2DBC 的具体配置和文档。

### 6.2.1 快速入门

最快速的入门方法是使用 [Micronaut Launch](https://micronaut.io/launch/) 和 `data-r2dbc`（数据库驱动程序和数据库迁移框架功能）创建一个新的 Micronaut 应用程序。这也可以通过 CLI 完成。

点击下表中的一个链接，就能进入 [Micronaut Launch](https://micronaut.io/launch/)，其中的相应选项已根据你选择的语言和构建工具进行了预配置：

*表 1. 使用 Micronaut Launch 创建 R2DBC 应用程序*
	
|||Gradle|Maven|
|--|--|--|
|Java|[打开](https://micronaut.io/launch?features=data-r2dbc&features=mysql&lang=JAVA&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-r2dbc&features=mysql&lang=JAVA&build=MAVEN)|
|Kotlin|[打开](https://micronaut.io/launch?features=data-r2dbc&features=mysql&lang=KOTLIN&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-r2dbc&features=mysql&lang=KOTLIN&build=MAVEN)|
|Groovy|[打开](https://micronaut.io/launch?features=data-r2dbc&features=mysql&lang=GROOVY&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-r2dbc&features=mysql&lang=GROOVY&build=MAVEN)|

*使用 CLI 创建应用程序*

```bash
# For Maven add: --build maven
$ mn create-app --lang java example --features data-r2dbc,flyway,mysql
```

或通过 `curl`：

*使用 curl 创建应用程序*

```bash
# For Maven add to the URL: &build=maven
$ curl https://launch.micronaut.io/demo.zip?lang=java&features=data-r2dbc,flyway,mysql -o demo.zip && unzip demo.zip -d demo && cd demo
```

由于我们通过 `mysql` 特性添加了对 MySQL 的 R2DBC 驱动的依赖，因此生成的应用程序将使用 MySQL：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("dev.miku:r2dbc-mysql")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>dev.miku</groupId>
    <artifactId>r2dbc-mysql</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

而对于 flyway 来说，则是 JDBC 驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("mysql:mysql-connector-java")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

:::notice 提示
要为其他驱动创建配置，可以选择相应的功能：`Oracle`、`Postgres`、`SQLServer`、`H2` 或 `Mariadb`。
:::

现在定义一个 SQL 脚本，在 `src/main/resources/db/migration` 中创建初始模式。例如：

*示例 V1__create-schema.sql*

```sql
CREATE TABLE book(id SERIAL NOT NULL PRIMARY KEY, title VARCHAR(255), pages INT, author_id BIGINT NOT NULL);
CREATE TABLE author(id SERIAL NOT NULL PRIMARY KEY, name VARCHAR(255));
```

现在，您可以使用 `src/main/resources` 下的应用程序配置文件，配置应用程序连接数据库：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
flyway.datasources.default.enabled=true
datasources.default.url=jdbc:mysql://localhost:3306/mydatabase
r2dbc.datasources.default.url=r2dbc:mysql:///mydatabase
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
flyway:
  datasources:
    default:
      enabled: true
datasources:
  default:
    url: jdbc:mysql://localhost:3306/mydatabase
r2dbc:
  datasources:
    default: # (3)
      url: r2dbc:mysql:///mydatabase
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[flyway]
  [flyway.datasources]
    [flyway.datasources.default]
      enabled=true
[datasources]
  [datasources.default]
    url="jdbc:mysql://localhost:3306/mydatabase"
[r2dbc]
  [r2dbc.datasources]
    [r2dbc.datasources.default]
      url="r2dbc:mysql:///mydatabase"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
flyway {
  datasources {
    'default' {
      enabled = true
    }
  }
}
datasources {
  'default' {
    url = "jdbc:mysql://localhost:3306/mydatabase"
  }
}
r2dbc {
  datasources {
    'default' {
      url = "r2dbc:mysql:///mydatabase"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  flyway {
    datasources {
      default {
        enabled = true
      }
    }
  }
  datasources {
    default {
      url = "jdbc:mysql://localhost:3306/mydatabase"
    }
  }
  r2dbc {
    datasources {
      default {
        url = "r2dbc:mysql:///mydatabase"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "flyway": {
    "datasources": {
      "default": {
        "enabled": true
      }
    }
  },
  "datasources": {
    "default": {
      "url": "jdbc:mysql://localhost:3306/mydatabase"
    }
  },
  "r2dbc": {
    "datasources": {
      "default": {
        "url": "r2dbc:mysql:///mydatabase"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- 启用设置可确保应用 Flyway 模式迁移。更多信息参阅 [Micronaut Flyway](/flyway)
- Flyway 配置需要一个 JDBC 数据源，`datasources.defaul.url` 可配置一个。更多信息，参阅[数据源配置](/data/dbc)
- `r2dbc.datasources.default.url` 用于配置默认的 R2DBC `ConnectionFactory`

:::notice 提示
R2DBC ConnectionFactory 对象可通过依赖注入注入到代码中的任何位置。
:::

现在定义一个 `@MappedEntity`，映射到模式中定义的 `author` 表：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.*;
import io.micronaut.serde.annotation.Serdeable;

@Serdeable
@MappedEntity
public class Author {
    @GeneratedValue
    @Id
    private Long id;
    private final String name;

    public Author(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.data.annotation.*
import io.micronaut.serde.annotation.Serdeable

@Serdeable
@MappedEntity
class Author {
    @GeneratedValue
    @Id
    Long id
    final String name

    Author(String name) {
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
import io.micronaut.serde.annotation.Serdeable

@Serdeable
@MappedEntity
data class Author(val name: String) {
    @GeneratedValue
    @Id
    var id: Long? = null
}
```

  </TabItem>
</Tabs>

还有一个从 `ReactiveStreamsRepository` 扩展而来的存储库接口，用于访问数据库：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.annotation.NonNull;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.r2dbc.annotation.R2dbcRepository;
import io.micronaut.data.repository.reactive.ReactiveStreamsCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import jakarta.validation.constraints.NotNull;

@R2dbcRepository(dialect = Dialect.POSTGRES) // (1)
public interface AuthorRepository extends ReactiveStreamsCrudRepository<Author, Long> {
    @NonNull
    @Override
    Mono<Author> findById(@NonNull @NotNull Long aLong); // (2)

    @NonNull
    @Override
    Flux<Author> findAll();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.core.annotation.NonNull
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.r2dbc.annotation.R2dbcRepository
import io.micronaut.data.repository.reactive.ReactiveStreamsCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

import jakarta.validation.constraints.NotNull

@R2dbcRepository(dialect = Dialect.POSTGRES) // (1)
interface AuthorRepository extends ReactiveStreamsCrudRepository<Author, Long> {
    @NonNull
    @Override
    Mono<Author> findById(@NonNull @NotNull Long aLong) // (2)

    @NonNull
    @Override
    Flux<Author> findAll()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.r2dbc.annotation.R2dbcRepository
import io.micronaut.data.repository.reactive.ReactiveStreamsCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import jakarta.validation.constraints.NotNull

@R2dbcRepository(dialect = Dialect.MYSQL) // (1)
interface AuthorRepository : ReactiveStreamsCrudRepository<Author, Long> {
    override fun findById(id: @NotNull Long): Mono<Author> // (2)
    override fun findAll(): Flux<Author>
}
```

  </TabItem>
</Tabs>

1. [@R2dbcRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/r2dbc/annotation/R2dbcRepository.html) 注解可用于指定数据源和方言
2. 您可以覆盖超级接口中的方法，用具体实现来专门化默认 [Publisher](https://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 返回类型

现在，您可以将此接口注入控制器，并用它来执行 R2DBC 查询：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Controller("/authors")
public class AuthorController {
    private final AuthorRepository repository;

    public AuthorController(AuthorRepository repository) {
        this.repository = repository;
    }

    @Get
    Flux<Author> all() { // (1)
        return repository.findAll();
    }

    @Get("/id")
    Mono<Author> get(Long id) { // (2)
        return repository.findById(id);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Controller("/authors")
class AuthorController {
    private final AuthorRepository repository

    AuthorController(AuthorRepository repository) {
        this.repository = repository
    }

    @Get
    Flux<Author> all() { // (1)
        return repository.findAll()
    }

    @Get("/id")
    Mono<Author> get(Long id) { // (2)
        return repository.findById(id)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Controller("/authors")
class AuthorController(private val repository: AuthorRepository) {
    @Get
    fun all(): Flux<Author> { // (1)
        return repository.findAll()
    }

    @Get("/id")
    fun get(id: Long): Mono<Author> { // (2)
        return repository.findById(id)
    }
}
```

  </TabItem>
</Tabs>

1. 通过返回一个可发出许多项目的响应式类型，您可以实现数据流（[Flowable](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Flowable.html) 或 `Flux`）。
2. 通过返回发出单个项的响应式，您可以返回整个响应（[Single](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Single.html) 或 `Mono`）。

### 6.2.2 配置

**R2DBC 驱动**

Micronaut Data R2DBC 需要使用 [Micronaut R2DBC](/r2dbc) 进行驱动配置。

*表 1. 截至本文撰写时，可使用以下驱动*

|数据库|依赖|
|--|--|
|H2 数据库|`io.r2dbc:r2dbc-h2`|
|MySQL|`dev.miku:r2dbc-mysql`|
|MariaDB|`org.mariadb:r2dbc-mariadb`|
|Postgres|`org.postgresql:r2dbc-postgresql`|
|SQL Server|`io.r2dbc:r2dbc-mssql`|
|Oracle|`com.oracle.database.r2dbc:oracle-r2db`|

**SQL 日志**

您可以通过为 `io.micronaut.data.query` 日志器启用跟踪日志来启用 SQL 日志。例如在 `logback.xml` 中：

*启用 SQL 查询日志记录*

```xml
<logger name="io.micronaut.data.query" level="trace" />
```

**创建模式**

要创建数据库模式，建议将 Micronaut Data 与 SQL 迁移工具，如 [Flyway](/flyway) 或 [Liquibase](/liquibase)，配对使用。

SQL 迁移工具可为在各种数据库中创建和演进模式提供更全面的支持。

:::tip 注意
大多数数据库迁移工具都使用 JDBC 驱动来更改数据库。因此，除了 R2DBC 驱动外，您可能还需要包含一个 [JDBC 驱动模块](/sql#3-配置-JDBC)，以便进行模式迁移。
:::

如果想快速测试 Micronaut Data R2DBC，可以将数据源的 `schema-generate` 选项设置为 `create-drop`，并设置适当的模式名称：

*使用 `schema-generate`*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.application.name=example
r2dbc.datasources.default.db-type=postgresql
r2dbc.datasources.default.schema-generate=CREATE_DROP
r2dbc.datasources.default.dialect=POSTGRES
datasources.default.db-type=postgresql
datasources.default.schema-generate=CREATE_DROP
datasources.default.dialect=POSTGRES
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  application:
    name: example

r2dbc:
  datasources:
    default:
      db-type: postgresql
      schema-generate: CREATE_DROP
      dialect: POSTGRES
datasources:
  default:
    db-type: postgresql
    schema-generate: CREATE_DROP
    dialect: POSTGRES
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.application]
    name="example"
[r2dbc]
  [r2dbc.datasources]
    [r2dbc.datasources.default]
      db-type="postgresql"
      schema-generate="CREATE_DROP"
      dialect="POSTGRES"
[datasources]
  [datasources.default]
    db-type="postgresql"
    schema-generate="CREATE_DROP"
    dialect="POSTGRES"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  application {
    name = "example"
  }
}
r2dbc {
  datasources {
    'default' {
      dbType = "postgresql"
      schemaGenerate = "CREATE_DROP"
      dialect = "POSTGRES"
    }
  }
}
datasources {
  'default' {
    dbType = "postgresql"
    schemaGenerate = "CREATE_DROP"
    dialect = "POSTGRES"
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
  r2dbc {
    datasources {
      default {
        db-type = "postgresql"
        schema-generate = "CREATE_DROP"
        dialect = "POSTGRES"
      }
    }
  }
  datasources {
    default {
      db-type = "postgresql"
      schema-generate = "CREATE_DROP"
      dialect = "POSTGRES"
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
  "r2dbc": {
    "datasources": {
      "default": {
        "db-type": "postgresql",
        "schema-generate": "CREATE_DROP",
        "dialect": "POSTGRES"
      }
    }
  },
  "datasources": {
    "default": {
      "db-type": "postgresql",
      "schema-generate": "CREATE_DROP",
      "dialect": "POSTGRES"
    }
  }
}
```

  </TabItem>
</Tabs>

`schema-generate` 选项目前只推荐用于简单的应用程序、测试和演示，并不能用于生产。配置中设置的方言是用于生成模式的方言。

**设置方言**

如上配置所示，您还应配置方言。虽然查询会在资源库中预先计算，但在某些情况下（如分页）仍需要指定方言。下表总结了支持的方言：

*表 2. 支持的 JDBC / R2DBC 方言*

|方言|说明|
|--|--|
|[H2](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/sql/Dialect.html#H2)|H2 数据库（通常用于内存测试）|
|[MYSQL](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/sql/Dialect.html#MYSQL)|MySQL 5.5 或以上版本|
|[POSTGRES](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/sql/Dialect.html#POSTGRES)|Postgres 9.5 或更高版本|
|[SQL_SERVER](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/sql/Dialect.html#SQL_SERVER)|SQL Server 2012 或更高版本|
|[ORACLE](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/sql/Dialect.html#ORACLE)|Oracle 12c 或更高版本|

:::danger 危险
配置中的方言设置并不能取代确保在版本库中设置正确方言的需要。如果配置中的方言是 H2，那么版本库应具有 @R2dbcRepository(dialect = Dialect.H2)。因为版本库是在编译时计算的，所以当时并不知道配置值。
:::

### 6.2.3 响应式仓库

下表总结了 Micronaut Data 自带的响应式仓库接口，建议与 R2DBC 一起使用：

*表 1. 内置响应式资源库接口*

|接口|描述|
|--|--|
|[ReactiveStreamsCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactiveStreamsCrudRepository.html)|继承 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html)，并添加了返回 [Publisher](https://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 的 CRUD 方法|
|[ReactorCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactorCrudRepository.html)|继承 [ReactiveStreamsCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/ReactiveStreamsCrudRepository.html)，并使用了 Reactor 返回类型|
|[RxJavaCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/RxJavaCrudRepository.html)|继承 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html) 并添加可返回 RxJava 2 类型的 CRUD 方法|
|[CoroutineCrudRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/kotlin/CoroutineCrudRepository.html)|继承 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html)，并使用 Kotlin 例程进行反应式 CRUD 操作|

### 6.2.4 事务

Micronaut Data R2DBC 支持响应式事务管理，例如，您可以在方法中声明 `jakarta.transaction.Transactional`，然后启动一个响应式事务：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import reactor.core.publisher.Mono;

import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.util.Arrays;

@Singleton
public class AuthorService {
    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;

    public AuthorService(AuthorRepository authorRepository, BookRepository bookRepository) { // (1)
        this.authorRepository = authorRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional // (2)
    Mono<Void> setupData() {
        return Mono.from(authorRepository.save(new Author("Stephen King")))
                .flatMapMany((author -> bookRepository.saveAll(Arrays.asList(
                        new Book("The Stand", 1000, author),
                        new Book("The Shining", 400, author)
                ))))
                .then(Mono.from(authorRepository.save(new Author("James Patterson"))))
                .flatMapMany((author ->
                        bookRepository.save(new Book("Along Came a Spider", 300, author))
                )).then();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import reactor.core.publisher.Mono

import jakarta.inject.Singleton
import jakarta.transaction.Transactional

@Singleton
class AuthorService {
    private final AuthorRepository authorRepository
    private final BookRepository bookRepository

    AuthorService(AuthorRepository authorRepository, BookRepository bookRepository) { // (1)
        this.authorRepository = authorRepository
        this.bookRepository = bookRepository
    }

    @Transactional // (2)
    Mono<Void> setupData() {
        return Mono.from(authorRepository.save(new Author("Stephen King")))
                .flatMapMany((author -> bookRepository.saveAll([
                        new Book("The Stand", 1000, author),
                        new Book("The Shining", 400, author)
                ])))
                .then(Mono.from(authorRepository.save(new Author("James Patterson"))))
                .flatMapMany((author ->
                        bookRepository.save(new Book("Along Came a Spider", 300, author))
                )).then()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import reactor.core.publisher.Mono
import jakarta.inject.Singleton
import jakarta.transaction.Transactional

@Singleton
open class AuthorService(
        private val authorRepository: AuthorRepository,
        private val bookRepository: BookReactiveRepository) { // (1)

    @Transactional // (2)
    open fun setupData(): Mono<Void> {
        return Mono.from(authorRepository.save(Author("Stephen King")))
                .flatMapMany { author: Author ->
                    bookRepository.saveAll(listOf(
                            Book("The Stand", 1000, author),
                            Book("The Shining", 400, author)
                    ))
                }
                .then(Mono.from(authorRepository.save(Author("James Patterson"))))
                .flatMapMany { author: Author ->
                    bookRepository.save(Book("Along Came a Spider", 300, author))
                }.then()
    }
}
```

  </TabItem>
</Tabs>

1. 注入了支持仓库
2. `@Transactional` 用于声明事务

同样的声明逻辑也可以通过注入 [R2dbcOperations](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/r2dbc/operations/R2dbcOperations.html) 接口以编程方式完成：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux.from(operations.withTransaction(status ->
    Flux.from(authorRepository.save(new Author("Stephen King")))
            .flatMap((author -> bookRepository.saveAll(Arrays.asList(
                    new Book("The Stand", 1000, author),
                    new Book("The Shining", 400, author)
            ))))
    .thenMany(Flux.from(authorRepository.save(new Author("James Patterson"))))
        .flatMap((author ->
                bookRepository.save(new Book("Along Came a Spider", 300, author))
    )).then()
)).collectList().block();
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Flux.from(operations.withTransaction(status ->
        Flux.from(authorRepository.save(new Author("Stephen King")))
                .flatMap((author -> bookRepository.saveAll([
                        new Book("The Stand", 1000, author),
                        new Book("The Shining", 400, author)
                ])))
                .thenMany(Flux.from(authorRepository.save(new Author("James Patterson"))))
                .flatMap((author ->
                        bookRepository.save(new Book("Along Came a Spider", 300, author))
                )).then()
)).collectList().block()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
Flux.from(operations.withTransaction {
    Flux.from(authorRepository.save(Author("Stephen King")))
            .flatMap { author: Author ->
                bookRepository.saveAll(listOf(
                        Book("The Stand", 1000, author),
                        Book("The Shining", 400, author)
                ))
            }
            .thenMany(Flux.from(authorRepository.save(Author("James Patterson"))))
            .flatMap { author: Author -> bookRepository.save(Book("Along Came a Spider", 300, author)) }.then()
}).collectList().block()
```

  </TabItem>
</Tabs>

在上述案例中，`withTransaction` 方法用于启动事务。

但请注意，事务管理可能是响应式编程中最难处理的问题之一，因为您需要在响应式流程中传播事务。

大多数 R2DBC 驱动都是在 [Project Reactor](https://projectreactor.io/) 中实现的，Project Reactor 能够跨响应式操作符[传播上下文](https://projectreactor.io/docs/core/release/reference/#context)，Micronaut Data R2DBC 将填充此上下文，并确保事务在其中被发现时被重复使用。

不过，上下文还是很容易丢失，因为实现响应式流的不同库不会在彼此间传播上下文，所以如果包含 RxJava 或任何其他响应式运算符库，上下文很可能会丢失。

为了确保这种情况不会发生，建议将参与事务的写入操作注解为 `MANDATORY`，以确保在没有周围事务的情况下无法运行这些方法，这样，如果事务在响应流中丢失，就不会导致操作在单独的事务中运行：

 <Tabs>
  <TabItem value="Java" label="Java" default>

```java
@NonNull
@Override
@Transactional(Transactional.TxType.MANDATORY)
<S extends Book> Publisher<S> save(@NonNull @Valid @NotNull S entity);

@NonNull
@Override
@Transactional(Transactional.TxType.MANDATORY)
<S extends Book> Publisher<S> saveAll(@NonNull @Valid @NotNull Iterable<S> entities);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@NonNull
@Override
@Transactional(Transactional.TxType.MANDATORY)
<S extends Book> Publisher<S> save(@NonNull @Valid @NotNull S entity);

@NonNull
@Override
@Transactional(Transactional.TxType.MANDATORY)
<S extends Book> Publisher<S> saveAll(@NonNull @Valid @NotNull Iterable<S> entities);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Transactional(Transactional.TxType.MANDATORY)
override suspend fun <S : Book> save(entity: S): S

@Transactional(Transactional.TxType.MANDATORY)
override fun <S : Book> saveAll(entities: Iterable<S>): Flow<S>
```

  </TabItem>
</Tabs>

如果事务在响应流程中丢失，有几种方法可以解决问题。一种方法是使用 [R2dbcOperations](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/r2dbc/operations/R2dbcOperations.html) 接口的 `withTransaction` 方法获取当前的 `ReactiveTransactionStatus`，然后将此实例传递到另一个 `withTransaction` 方法的执行中，或者直接将其作为最后一个参数传递给在仓库本身声明的任何方法。

下面是前一种方法的示例，这次使用的 RxJava 2 会导致传播损失：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux.from(operations.withTransaction(status -> // (1)
        Flux.from(authorRepository.save(new Author("Michael Crichton")))
                .flatMap((author -> operations.withTransaction(status, (s) -> // (2)
                        bookRepository.saveAll(Arrays.asList(
                                new Book("Jurassic Park", 300, author),
                                new Book("Disclosure", 400, author)
                        )))))
)).collectList().block();
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Flux.from(operations.withTransaction(status -> // (1)
        Flux.from(authorRepository.save(new Author("Michael Crichton")))
                .flatMap((author -> operations.withTransaction(status, (s) -> // (2)
                        bookRepository.saveAll([
                                new Book("Jurassic Park", 300, author),
                                new Book("Disclosure", 400, author)
                        ]))))
)).collectList().block()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
Flux.from(operations.withTransaction { status: ReactiveTransactionStatus<Connection> ->  // (1)
    Flux.from(authorRepository.save(Author("Michael Crichton")))
            .flatMap { author: Author ->
                operations.withTransaction(status) {   // (2)
                    bookRepository.saveAll(listOf(
                            Book("Jurassic Park", 300, author),
                            Book("Disclosure", 400, author)
                    ))
                }
            }
}).collectList().block()
```

  </TabItem>
</Tabs>

1. 外部 `withTransaction` 调用启动事务
2. 内部调用确保现有事务得到传播

### 6.2.5 响应式实体事件

Micronaut Data R2DBC 支持在 Micronaut Data 2.3 及以上版本中引入的持久化事件，但是应该注意的是，这些事件不应该阻塞，只应该执行不引起任何网络I/O的操作，如果执行了这些操作，应该有一个新的线程来执行这个逻辑。

请注意，持久化事件最常用于在执行插入之前预填充数据库属性（例如对密码等进行编码），这些类型的操作通常不涉及阻塞 I/O，可以安全执行。

## 6.3 仓库

在 Micronaut Data 中的[快速入门](/data/) JDBC / R2DBC 资源库被定义为使用 [@JdbcRepositoryannotation](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jdbc/annotation/JdbcRepository.html) 和 [@R2dbcRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/r2dbc/annotation/R2dbcRepository.html) 进行注解的接口。

在多数据源场景中，[@Repository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Repository.html) 和 [@Transactional](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/transaction/annotation/Transactional.html) 注解可用于指定要使用的数据源配置。默认情况下，Micronaut Data 会查找默认数据源。

例如：

```java
@JdbcRepository(dialect = Dialect.ORACLE, dataSource = "inventoryDataSource") (1)
@io.micronaut.transaction.annotation.Transactional("inventoryDataSource") (2)
public interface PhoneRepository extends CrudRepository<Phone, Integer> {
    Optional<Phone> findByAssetId(@NotNull Integer assetId);
}
```

1. `@JdbcRepository` 具有特定方言和数据源配置 "inventoryDataSource
2. 事务注解，指向数据源配置 "inventoryDataSource

根据方法签名或为 [GenericRepository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/GenericRepository.html) 接口指定的通用类型参数，可以确定将哪个实体作为根实体进行查询。

如果无法确定根实体，则会出现编译错误。

JDBC 也支持 JPA 实现所支持的相同接口。

请注意，由于查询是在编译时计算的，因此必须在仓库中指定所使用的 `dialect`。

:::notice 提示
建议针对目标方言进行测试。[测试容器](https://www.testcontainers.org/)项目就是一个很好的解决方案。如果必须针对另一种方言（如 H2）进行测试，则可以定义一个子接口，在测试范围内用不同的方言 `@Replaces` 仓库。
:::

请注意，除了接口，您还可以将仓库定义为抽象类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.jdbc.runtime.JdbcOperations;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import jakarta.transaction.Transactional;
import java.sql.ResultSet;
import java.util.List;
import java.util.stream.Collectors;

@JdbcRepository(dialect = Dialect.H2)
public abstract class AbstractBookRepository implements CrudRepository<Book, Long> {

    private final JdbcOperations jdbcOperations;

    public AbstractBookRepository(JdbcOperations jdbcOperations) {
        this.jdbcOperations = jdbcOperations;
    }

    @Transactional
    public List<Book> findByTitle(String title) {
        String sql = "SELECT * FROM Book AS book WHERE book.title = ?";
        return jdbcOperations.prepareStatement(sql, statement -> {
            statement.setString(1, title);
            ResultSet resultSet = statement.executeQuery();
            return jdbcOperations.entityStream(resultSet, Book.class).collect(Collectors.toList());
        });
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.jdbc.runtime.JdbcOperations
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository

import jakarta.transaction.Transactional
import java.sql.ResultSet
import java.util.stream.Collectors

@JdbcRepository(dialect = Dialect.H2)
abstract class AbstractBookRepository implements CrudRepository<Book, Long> {

    private final JdbcOperations jdbcOperations

    AbstractBookRepository(JdbcOperations jdbcOperations) {
        this.jdbcOperations = jdbcOperations
    }

    @Transactional
    List<Book> findByTitle(String title) {
        String sql = "SELECT * FROM Book AS book WHERE book.title = ?"
        return jdbcOperations.prepareStatement(sql,  { statement ->
            statement.setString(1, title)
            ResultSet resultSet = statement.executeQuery()
            return jdbcOperations.entityStream(resultSet, Book.class)
                    .collect(Collectors.toList())
        })
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.runtime.JdbcOperations
import io.micronaut.data.repository.CrudRepository

import jakarta.transaction.Transactional
import kotlin.streams.toList

@Repository
abstract class AbstractBookRepository(private val jdbcOperations: JdbcOperations) : CrudRepository<Book, Long> {

    @Transactional
    open fun findByTitle(title: String): List<Book> {
        val sql = "SELECT * FROM Book AS book WHERE book.title = ?"
        return jdbcOperations.prepareStatement(sql) { statement ->
            statement.setString(1, title)
            val resultSet = statement.executeQuery()
            jdbcOperations.entityStream(resultSet, Book::class.java)
                    .toList()
        }
    }
}
```

  </TabItem>
</Tabs>

从上面的示例中可以看出，使用抽象类是非常有用的，因为它允许你结合自定义代码来执行自己的 SQL 查询。

上面的示例使用了 [JdbcOperations](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jdbc/runtime/JdbcOperations.html) 接口，它简化了在事务上下文中执行 JDBC 查询的过程。

:::notice 提示
您还可以注入任何其他工具来处理更复杂的查询，如 QueryDSL、JOOQ、Spring JdbcTemplate 等。
:::

### 6.3.1 访问数据

与 JPA/Hibernate 不同，Micronaut Data JDBC / R2DBC 是无状态的，没有需要状态管理的持久化会话概念。

由于没有会话，所以不支持脏检查等功能。这对定义插入和更新的存储库方法有影响。

默认情况下，当使用 `save(MyEntity)` 等方法保存实体时，总是执行 SQL `INSERT`，因为 Micronaut Data 无法知道实体是否与特定会话相关联。

如果你想更新一个实体，你应该使用 `update(MyEntity)`，或者定义一个合适的更新方法，只更新你想更新的数据：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void update(@Id Long id, int pages);

void update(@Id Long id, String title);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void update(@Id Long id, int pages);

void update(@Id Long id, String title);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun update(@Id id: Long?, pages: Int)

fun update(@Id id: Long?, title: String)
```

  </TabItem>
</Tabs>

通过将方法明确定义为更新方法，Micronaut Data 知道要执行 `UPDATE`。

### 6.3.2 乐观锁定

乐观锁定是一种策略，即注意实际记录状态的版本，只有当版本相同时才修改记录。

要为实体启用乐观锁定，请添加以下类型之一的 [@Version](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Version.html) 注解字段：

- `java.lang.Integer`
- `java.lang.Long`
- `java.lang.Short`
- 扩展了 `java.time.Temporal` 的日期时间类型

该字段将在更新操作中递增（对于数字类型）或替换（对于日期类型）。

Micronaut Data 将生成版本匹配的 `UPDATE/DELETE` SQL 查询：`... WHERE rec.version = :currentVersion ...` 如果更新/删除没有产生任何结果，将抛出 [OptimisticLockException](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/exceptions/OptimisticLockException.html)。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Entity
public class Student {

    @Id
    @GeneratedValue
    private Long id;
    @Version
    private Long version;
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Entity
class Student {

    @Id
    @GeneratedValue
    Long id
    @Version
    Long version
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Entity
data class Student(
        @Id @GeneratedValue
        var id: Long?,
        @Version
        val version: Long,
```

  </TabItem>
</Tabs>

可以在部分更新或删除方法中使用 [@Version](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Version.html)，在这种情况下，版本必须与存储记录的版本相匹配。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Repository
public interface StudentRepository extends CrudRepository<Student, Long> {

    void update(@Id Long id, @Version Long version, String name);

    void delete(@Id Long id, @Version Long version);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Repository
interface StudentRepository extends CrudRepository<Student, Long> {

    void update(@Id Long id, @Version Long version, String name)

    void delete(@Id Long id, @Version Long version)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Repository
interface StudentRepository : CrudRepository<Student, Long> {

    fun update(@Id id: Long, @Version version: Long, name: String)

    fun delete(@Id id: Long, @Version version: Long)

}
```

  </TabItem>
</Tabs>

### 6.3.3 悲观锁定

通过使用 `find*ForUpdate` 方法支持悲观锁定。

```java
@JdbcRepository(dialect = Dialect.POSTGRES)
public interface AccountBalanceRepository extends CrudRepository<AccountBalance, Long> {

    AccountBalance findByIdForUpdate(Long id); (1)

    @Transactional (2)
    void addToBalance(Long id, BigInteger amount) {
        AccountBalance accountBalance = findByIdForUpdate(id); (3)
        accountBalance.addAmount(amount);
        update(accountBalance); (4)
    }
}
```

1. `ForUpdate` 后缀表示应锁定所选记录。
2. 读取和写入操作都封装在一个事务中。
3. 执行锁定读取，防止其他查询访问记录。
4. 安全地更新记录。

所有 `find` 方法都可以声明为 `ForUpdate`：

```java
@JdbcRepository(dialect = Dialect.POSTGRES)
public interface BookRepository extends CrudRepository<Book, Long> {

    @Join("author")
    Optional<Book> findByIdForUpdate(Long id);

    List<Book> findAllOrderByTotalPagesForUpdate();

    List<Book> findByTitleForUpdate(String title);
}
```

为这些方法生成的查询会使用 `FOR UPDATE` SQL 子句，或在 SQL Server 中使用 `UPDLOCK` 和 `ROWLOCK` 查询提示。

:::caution 警告
`FOR UPDATE` 子句的语义可能因数据库而异。请务必查看引擎的相关文档。
:::

## 6.4 带有标准 API 的仓库

在某些情况下，你需要在运行时以编程方式建立一个查询；为此，Micronaut Data实现了Jakarta Persistence Criteria API 3.0的一个子集，它可用于Micronaut Data JDBC和R2DBC功能。

为了实现无法在编译时定义的查询，Micronaut Data 引入了 [JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/JpaSpecificationExecutor.html) 仓库接口，可用于扩展您的仓库接口：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@JdbcRepository(dialect = Dialect.H2)
public interface PersonRepository extends CrudRepository<Person, Long>, JpaSpecificationExecutor<Person> {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@JdbcRepository(dialect = Dialect.H2)
interface PersonRepository extends CrudRepository<Person, Long>, JpaSpecificationExecutor<Person> {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@JdbcRepository(dialect = Dialect.H2)
interface PersonRepository : CrudRepository<Person, Long>, JpaSpecificationExecutor<Person> {
}
```

  </TabItem>
</Tabs>

每种方法都需要一个“规范”，它是一个功能接口，包含一组旨在以编程方式建立查询的标准 API 对象。

Micronaut 标准 API 目前只实现了 API 的一个子集。其中大部分在内部用于创建带有谓词和投影的查询。

目前，不支持 JPA Criteria API 功能：

- 使用自定义 `ON` 表达式和类型化连接方法（如 `joinSet` 等）进行连接
- 子查询
- 集合操作：`isMember` 等
- 自定义或元组结果类型
- 转换表达式，如 concat、substring 等
- 案例和函数

有关 Jakarta Persistence Criteria API 3.0 的更多信息，参阅[官方 API 规范](https://jakarta.ee/specifications/persistence/3.0/jakarta-persistence-spec-3.0.html#a6925)。

### 6.4.1 查询

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
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get(Person_.name), name);
    }

    static PredicateSpecification<Person> longNameEquals(String longName) {
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get(Person_.longName), longName);
    }

    static PredicateSpecification<Person> ageIsLessThan(int age) {
        return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get(Person_.age), age);
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

    fun nameEquals(name: String?) = PredicateSpecification<Person> { root, criteriaBuilder ->
        criteriaBuilder.equal(root.get<Any>("name"), name)
    }

    fun ageIsLessThan(age: Int) = PredicateSpecification<Person> { root, criteriaBuilder ->
        criteriaBuilder.lessThan(root.get("age"), age)
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

Person josh = personRepository.findOne(longNameEquals("Josh PM")).orElse(null);

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

:::tip 注意
示例使用的是编译时已知的值，在这种情况下，最好创建自定义存储库方法，这样就可以在编译时生成查询，消除运行时的开销。建议仅在动态查询中使用标准，因为动态查询的结构在构建时是未知的。
:::

### 6.4.2 更新

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

该方法期待 [UpdateSpecification](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/criteria/UpdateSpecification.html)，它是规范接口的一个变体，包括对 j`akarta.persistence.criteria.CriteriaUpdate` 的访问：

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
query.set(root.get(Person_.name), newName);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
query.set(root.get("name"), newName)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
query.set(root.get("name"), newName)
```

  </TabItem>
</Tabs>

您可以定义标准规范方法，包括更新规范，这将有助于您创建更新查询：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
class Specifications {

    static PredicateSpecification<Person> nameEquals(String name) {
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get(Person_.name), name);
    }

    static PredicateSpecification<Person> longNameEquals(String longName) {
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get(Person_.longName), longName);
    }

    static PredicateSpecification<Person> ageIsLessThan(int age) {
        return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get(Person_.age), age);
    }

    static UpdateSpecification<Person> setNewName(String newName) {
        return (root, query, criteriaBuilder) -> {
            query.set(root.get(Person_.name), newName);
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

    fun nameEquals(name: String?) = PredicateSpecification<Person> { root, criteriaBuilder ->
        criteriaBuilder.equal(root.get<Any>("name"), name)
    }

    fun ageIsLessThan(age: Int) = PredicateSpecification<Person> { root, criteriaBuilder ->
        criteriaBuilder.lessThan(root.get("age"), age)
    }

    fun setNewName(newName: String) = UpdateSpecification<Person> { root, query, criteriaBuilder ->
        query.set(root.get("name"), newName)
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
val recordsUpdated = personRepository.updateAll(setNewName("Steven").where(nameEquals("Denis")))
```

  </TabItem>
</Tabs>

### 6.4.3 删除

要删除一个实体或多个实体，可以使用 JpaSpecificationExecutor 接口中的以下方法之一：

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

第一个方法期待 [PredicateSpecification](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/criteria/PredicateSpecification.html)，它与[查询](#641-查询)部分描述的接口相同。

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
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get(Person_.name), name);
    }

    static PredicateSpecification<Person> longNameEquals(String longName) {
        return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get(Person_.longName), longName);
    }

    static PredicateSpecification<Person> ageIsLessThan(int age) {
        return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get(Person_.age), age);
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

    fun nameEquals(name: String?) = PredicateSpecification<Person> { root, criteriaBuilder ->
        criteriaBuilder.equal(root.get<Any>("name"), name)
    }

    fun ageIsLessThan(age: Int) = PredicateSpecification<Person> { root, criteriaBuilder ->
        criteriaBuilder.lessThan(root.get("age"), age)
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
```

  </TabItem>
</Tabs>

### 6.4.4 其他仓库变化

Micronaut Data 包含不同的规范执行器接口变体，旨在与异步或反应式版本库一起使用。

*表 1. JpaSpecificationExecutor 仓库接口的内置变体*

|接口|描述|
|--|--|
|[JpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/JpaSpecificationExecutor.html)|查询、删除和更新数据的默认接口|
|[AsyncJpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/async/AsyncJpaSpecificationExecutor.html)|规格库的异步版本|
|[ReactiveStreamsJpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactiveStreamsJpaSpecificationExecutor.html)|规范库的响应流--`Publisher<>` 版本
|[ReactorJpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/reactive/ReactorJpaSpecificationExecutor.html)|规范库 Reactor 版本|
|[CoroutineJpaSpecificationExecutor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/repository/kotlin/CoroutineJpaSpecificationExecutor.html)|使用例程的 Kotlin 版本接口|

### 6.4.5 类型安全的 Java 查询

Jakarta Persistence 标准 API 通过使用编译时生成的静态元模型支持类型安全查询。

例如，实体 `MyEntity` 将生成一个名称为 `MyEntity_` 的相应元模型实体，它将与原始实体位于同一个包中。新生成实体中的每个字段都将与实体的属性相对应，并可用作属性引用。

[官方 API 规范](https://jakarta.ee/specifications/persistence/3.0/jakarta-persistence-spec-3.0.html#a10643)中的示例：

```java
CriteriaBuilder cb = ...
CriteriaQuery<String> q = cb.createQuery(String.class);
Root<Customer> customer = q.from(Customer.class);
Join<Customer, Order> order = customer.join(Customer_.orders);
Join<Order, Item> item = order.join(Order_.lineItems);
q.select(customer.get(Customer_.name))
.where(cb.equal(item.get(Item_.product).get(Product_.productType), "printer"));
```

请注意，到目前为止，您还不能使用 Micronaut Data 注解（`io.micronaut.data.annotation` 包中的注解）来生成静态 JPA 元数据，唯一支持的方法是使用 Jakarta Persistence 注解（位于 `jakarta.persistence` 包中）与 Hibernate JPA 静态元模型生成器相结合，即使在运行时您实际上没有使用 Hibernate，而是使用 Micronaut Data JDBC，该生成器也会生成元模型。

要配置元模型生成器，只需在注解处理器类路径中添加以下依赖即可：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("org.hibernate:hibernate-jpamodelgen-jakarta")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>org.hibernate</groupId>
        <artifactId>hibernate-jpamodelgen-jakarta</artifactId>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

:::tip 注意
需要使用 Hibernate 6 版本的 `hibernate-jpamodelgen-jakarta`，因为之前版本的 Hibernate 仍在使用 `javax.persistence` 包。
:::

我们需要在 Java classpath 中包含生成的类，以便它们可以被访问：

Gradle 构建示例：

```groovy
sourceSets {
    generated {
        java {
            srcDirs = ["$build/generated/java"]
        }
    }
}
```

如果一切设置正确，您就可以在集成开发环境代码完成中看到生成的元模型类，并可以使用它们：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
static PredicateSpecification<Person> nameEquals(String name) {
    return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get(Person_.name), name);
}

static PredicateSpecification<Person> longNameEquals(String longName) {
    return (root, criteriaBuilder) -> criteriaBuilder.equal(root.get(Person_.longName), longName);
}

static PredicateSpecification<Person> ageIsLessThan(int age) {
    return (root, criteriaBuilder) -> criteriaBuilder.lessThan(root.get(Person_.age), age);
}

static UpdateSpecification<Person> setNewName(String newName) {
    return (root, query, criteriaBuilder) -> {
        query.set(root.get(Person_.name), newName);
        return null;
    };
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy

```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt

```

  </TabItem>
</Tabs>

---

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
static PredicateSpecification<Product> manufacturerNameEquals(String name) {
    return (root, cb) -> cb.equal(root.join(Product_.manufacturer).get(Manufacturer_.name), name);
}

static PredicateSpecification<Product> joined() {
    return (root, cb) -> {
        root.join("manufacturer");
        return null;
    };
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy

```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt

```

  </TabItem>
</Tabs>

:::tip 注意
有关静态元模型的更多信息，参阅[官方规范](https://jakarta.ee/specifications/persistence/3.0/jakarta-persistence-spec-3.0.html#a6933)。
:::

## 6.5 映射实体

正如[快速入门](#611-快速入门)部分所提到的，如果你需要自定义实体如何映射到数据库的表和列名称，你可以使用 JPA 注解或 Micronaut Data 自己的 `io.micronaut.data.annotation` 包中的注解来实现。

Micronaut Data JDBC / R2DBC 的一个重要方面是，无论使用 JPA 注解还是 Micronaut Data 注解，实体类都必须与 Micronaut Data 一起编译。

这是因为Micronaut Data在编译时预先计算了持久化模型（实体之间的关系、类/属性名称到表/列名称的映射），这也是 Micronaut Data JDBC 能快速启动的原因之一。

下面是一个使用 Micronaut Data 注解进行映射的例子：

*Micronaut Data 注解映射示例*

```java
/*
 * Copyright 2017-2020 original authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.micronaut.data.tck.entities;

import io.micronaut.data.annotation.AutoPopulated;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.Relation;

import java.util.Set;
import java.util.UUID;

@MappedEntity
public class Country {

    @Id
    @AutoPopulated
    private UUID uuid;
    private String name;

    @Relation(value = Relation.Kind.ONE_TO_MANY, mappedBy = "country")
    private Set<CountryRegion> regions;

    public Country(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public Set<CountryRegion> getRegions() {
        return regions;
    }

    public void setRegions(Set<CountryRegion> regions) {
        this.regions = regions;
    }
}
```

### 6.5.1 SQL 注解

下表总结了不同的注解及其功能。如果您熟悉并喜欢 JPA 注释，请跳至下一节：

*表 1. Micronaut 数据注解*

|注解|描述|
|--|--|
|[@AutoPopulated](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/AutoPopulated.html)|应由 Micronaut Data 自动填充的值的元注释（如时间戳和 UUID）|
|[@DateCreated](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/DateCreated.html)|允许在插入前分配数据创建值（如 `java.time.Instant`）|
|[@DateUpdated](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/DateUpdated.html)|允许在插入或更新之前分配最后更新值（如 java.time.Instant）|
|[@Embeddable](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Embeddable.html)|指定 bean 是可嵌入的|
|[@EmbeddedId](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/EmbeddedId.html)|指定实体的嵌入式 ID|
|[@GeneratedValue](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/GeneratedValue.html)|指定属性值由数据库生成，不包含在插入中|
|[@JoinTable](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jdbc/annotation/JoinTable.html)|指定连接表关联|
|[@JoinColumn](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jdbc/annotation/JoinColumn.html)|指定连接列映射|
|[@Id](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Id.html)|指定实体的 ID|
|[@MappedEntity](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedEntity.html)|指定映射到数据库的实体。如果表名与实体名不同，请将表名作为 `value` 传入。例如 `@MappedEntity( value = "TABLE_NAME" )`|
|[@MappedProperty](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedProperty.html)|用于自定义列名、定义和数据类型|
|[@Relation](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Relation.html)|用于指定关系（一对一、一对多等）。|
|[@Transient](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Transient.html)|用于指定一个属性为瞬时属性|
|[@TypeDef](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/TypeDef.html)|用于指定属性的数据类型和自定义转换器|
|[@Version](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Version.html)|指定实体的版本字段，启用乐观锁定|

在使用 JPA 的情况下，只支持以下注解的子集：

- 基本注解 `@Table` `@Id` `@Version` `@Column` `@Transient` `@Enumerated`
- 嵌入式定义：`@Embedded` `@EmbeddedId` `@Embeddable`
- 关系映射：`@OneToMany` `@OneToOne` `@ManyToMany`
- 连接规范：`@JoinTable` `@JoinColumn`
- 类型转换器： `@Convert` `@Converter` 和 `AttributeConverter` 接口

:::tip 注意
Micronaut Data 支持 `javax.persistence` 和 `jakarta.persistence` 包。
:::

Micronaut Data JDBC / R2DBC 也不是一个 ORM，而是一个简单的数据映射器，因此 JPA 中的许多概念并不适用，不过对于熟悉这些注解的用户来说，使用它们还是很方便的。

### 6.5.2 可扩展查询

在某些情况下，查询需要扩展以容纳所有参数的值。参数为集合或数组的查询：`WHERE value IN (?)` 的查询将扩展为 `WHERE value IN (?, ?, ?, ?)`

如果其中一个参数是可扩展的，Micronaut Data 将在构建时存储查询的附加信息，这样就不需要在运行时解析查询了。

默认情况下，所有扩展了 `java.lang.Iterable` 类型的参数都是自动可扩展的。您可以使用 [@Expandable](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Expandable.html) 注解将参数标记为可扩展，例如，如果参数是一个数组，您可能就需要这样做。

:::tip 注意
如果目标数据库支持数组类型，最好使用数组类型。例如，在 Postgres 中，可以使用 WHERE value = ANY (:myValues) ，其中 myValues 的类型是 @TypeDef(type=DataType.STRING_ARRAY)。
:::

### 6.5.3 ID 生成

默认 ID 生成期望数据库为 ID 填充一个值，如 `IDENTITY` 列。

您可以移除 `@GeneratedValue` 注解，在这种情况下，我们希望您在调用 `save()` 之前为 ID 赋值。

如果希望使用序列来指定 ID，则应调用生成序列值的 SQL，并在调用 `save()` 之前进行指定。

通过添加注有 `@Id` 和 `@AutoPopulated` 的属性，也可支持自动分配的 UUID。

### 6.5.4 复合主键

可以使用 JPA 或 Micronaut 数据注解定义复合主键。复合 ID 需要一个额外的类来表示该键。该类应定义与组成复合键的列相对应的字段。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import jakarta.persistence.Embeddable;
import java.util.Objects;

@Embeddable
public class ProjectId {
    private final int departmentId;
    private final int projectId;

    public ProjectId(int departmentId, int projectId) {
        this.departmentId = departmentId;
        this.projectId = projectId;
    }

    public int getDepartmentId() {
        return departmentId;
    }

    public int getProjectId() {
        return projectId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ProjectId projectId1 = (ProjectId) o;
        return departmentId == projectId1.departmentId &&
                projectId == projectId1.projectId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(departmentId, projectId);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import groovy.transform.EqualsAndHashCode
import jakarta.persistence.Embeddable

@EqualsAndHashCode
@Embeddable
class ProjectId {
    final int departmentId
    final int projectId

    ProjectId(int departmentId, int projectId) {
        this.departmentId = departmentId
        this.projectId = projectId
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import jakarta.persistence.Embeddable

@Embeddable
data class ProjectId(val departmentId: Int, val projectId: Int)
```

  </TabItem>
</Tabs>

:::notice 提示
建议 ID 类不可变，并实现 `equals`/`hashCode`。提示：使用 Java 时，请务必为组成复合键的字段定义获取器。
:::

然后，您可以使用 JPA 的 `@EmbeddedId` 或 [@EmbeddedId](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/EmbeddedId.html) 声明实体的 `id` 属性：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;

@Entity
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

import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity

@Entity
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

import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity

@Entity
class Project(
    @EmbeddedId val projectId: ProjectId,
    val name: String
)
```

  </TabItem>
</Tabs>

:::notice 提示
要更改 ID 的列映射，可在 `ProjectId` 类中的字段上使用 `@Column` 注解。
:::

### 6.5.5 构造函数参数

Micronaut Data JDBC / R2DBC 还允许使用构造函数参数而不是 getters/setters 来定义不可变对象。如果您定义了多个构造函数，那么用于从数据库创建对象的构造函数应使用 `io.micronaut.core.annotation.Creator` 注解。

例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.annotation.Creator;

import jakarta.persistence.*;

@Entity
public class Manufacturer {
    @Id
    @GeneratedValue
    private Long id;
    private String name;

    @Creator
    public Manufacturer(String name) {
        this.name = name;
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

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.core.annotation.Creator

import jakarta.persistence.*

@Entity
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

import jakarta.persistence.*

@Entity
data class Manufacturer(
    @Id
    @GeneratedValue
    var id: Long?,
    val name: String
)
```

  </TabItem>
</Tabs>

从上面的示例中可以看出，对象的 ID 应包含一个设置器，因为它必须从数据库生成的值中分配。

### 6.5.6 SQL 命名策略

将驼峰大小写的类名和属性名转换为数据库表和列时，默认的命名策略是使用下划线分隔的小写字母。换句话说，`FooBar` 变成了 `foo_bar`。

如果不满意，可以通过设置实体上 @MappedEntity 注解的 namingStrategy 成员来定制：

*Micronaut 数据命名策略*

```java
@MappedEntity(namingStrategy = NamingStrategies.Raw.class)
public class CountryRegion {
    ...
}
```

需要注意的几个重要事项。由于 Micronaut Data 会在编译时预先计算表和列的名称映射，因此指定的 [NamingStrategy](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/naming/NamingStrategy.html) 实现必须位于注解处理器类路径（Java 为 `annotationProcessor` 作用域，Kotlin 为 `kapt`）上。

如果在本地镜像中运行项目，自定义命名策略需要有 `io.micronaut.core.annotation.TypeHint(CustomNamingStrategy.class)` 注解，其中自定义命名策略类是 `CustomNamingStrategy`。

此外，如果不想在每个实体上重复上述注解定义，定义元注解也很方便，在元注解中，上述注解定义会应用到添加到类中的另一个注解。

**转义表/列名称标识符**

在某些情况下，如果表名和/或列名中使用的字符在不转义的情况下无效，则有必要转义表名和/或列名。

在这种情况下，应将 [@MappedEntity](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedEntity.html) 注解的转义成员设置为 `true`：

```java
@MappedEntity(escape=true)
```

Micronaut Data 将生成 SQL 语句，在查询中使用适合配置的 SQL 方言的转义字符转义表和列名称。

**覆盖默认查询别名**

默认查询别名是表名后跟一个下划线。如果要更改，请在 [@MappedEntity](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedEntity.html) 注解中指定：

```java
@MappedEntity(alias="my_table_")
```

### 6.5.7 关联映射

要指定两个实体之间的关系，需要使用 [@Relation](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Relation.html) 注解。关系类型是使用枚举 [@Kind](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Relation.Kind.html) `value` 属性指定的，它与 JPA 关系注解名称（`@OneToMany`、`@OneToOne` 等）类似。

*表 1. Micronaut Data 支持的关系：*

|Kind|描述|
|--|--|
|`Kind.ONE_TO_MANY`|一对多关联|
|`Kind.ONE_TO_ONE`|一对一关联|
|`Kind.MANY_TO_MANY`|多对多关联|
|`Kind.MANY_TO_ONE`|多对一关联|
|`Kind.EMBEDDED`|嵌入式关联|

使用 "mappedBy" 指定此关系映射的逆属性。

*表 2. Micronaut Data 支持的关联级联类型：*

|类型|描述|
|--|--|
|`Cascade.PERSIST`|保存拥有的实体时，相关的一个或多个实体将被持久化|
|`Cascade.UPDATE`|更新拥有的实体时，将更新关联实体|
|`Cascade.NONE`|(默认）不进行级联操作|
|`Cascade.ALL`|所有（`Cascade.PERSIST` 和 `Cascade.UPDATE`）操作都是级联的|

:::tip 注意
您可以使用 JPA 的等价注解 [@JoinTable](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jdbc/annotation/JoinTable.html) 和 [@JoinColumn](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jdbc/annotation/JoinColumn.html) 来指定更复杂的映射定义。
:::

### 6.5.8 关联检索

Micronaut Data 是一个简单的数据映射器，因此它不会使用单端关联的实体代理懒加载等技术为你获取任何关联。

您必须提前指定要获取的数据。您不能将关联映射为 eager 或 lazy。这种设计选择的原因很简单，即使在 JPA 世界中，由于 N+1 查询问题，访问懒关联或懒初始化集合也被认为是不好的做法，建议总是编写优化的连接查询。

Micronaut Data JDBC / R2DBC 在此基础上更进一步，干脆不支持那些被认为是糟糕做法的功能。不过，这确实会影响您如何为关联建模。例如，如果您在构造函数参数中定义关联，如以下实体：

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
    @ManyToOne
    private Manufacturer manufacturer;

    public Product(String name, Manufacturer manufacturer) {
        this.name = name;
        this.manufacturer = manufacturer;
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

    public Manufacturer getManufacturer() {
        return manufacturer;
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
    private String name
    @ManyToOne
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

import jakarta.persistence.*

@Entity
data class Product(
    @Id
    @GeneratedValue
    var id: Long?,
    var name: String,
    @ManyToOne
    var manufacturer: Manufacturer?
)
```

  </TabItem>
</Tabs>

然后，在未指定连接的情况下尝试读回 Product 实体，就会出现异常，因为 `manufacturer` 关联不是 `Nullable`。

有几种方法可以解决这个问题，一种方法是在存储库级别声明始终获取 `manufacturer`，另一种方法是在 `manufacturer` 参数上声明 `@Nullable` 注解，允许将其声明为 `null`（或者在 Kotlin 中，在构造函数参数名称的末尾添加 `?`）选择哪种方法取决于应用程序的设计。

下一节将提供更多有关处理连接的内容。

### 6.5.9 使用 @ColumnTransformer

受 Hibernate 中类似注解的启发，您可以使用 [@ColumnTransformer](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/jdbc/annotation/ColumnTransformer.html) 注解在从数据库读取或向数据库写入列时应用转换。

此功能可用于加密/解密值或调用任意数据库函数。要定义读取转换，请使用 `read` 成员。例如

*应用读取转换*

```java
@ColumnTransformer(read = "UPPER(@.name)")
private String name;
```

:::tip 注意
`@` 是查询别名占位符，如果查询指定了该别名，则将用该别名替换。例如 `"UPPER(@.name)` 将变为 `UPPER(project_.name)`。
:::

要应用写入转换，应使用写入成员，并包含一个 `?` 占位符：

*应用写转换*

```java
@ColumnTransformer(write = "UPPER(?)")
private String name;
```

在这种情况下生成的任何 `INSERT` 或 `UPDATE` 语句都将包含上述写入条目。

### 6.5.10 使用 @MappedProperty 别名

如果需要在结果集中以自定义名称返回列名，可以使用 [@MappedProperty](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedProperty.html) 注解中的 `alias` 属性。

例如，对于查询结果中可能过长的遗留列（与表别名相结合时可能超过列的最大长度），该别名属性可能非常有用。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;


@Entity
public class Person {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private int age;
    @MappedProperty(value = "long_name_column_legacy_system", alias = "long_name")
    private String longName;

    public Person() {
    }

    public Person(String name, int age, String longName) {
        this(null, name, age, longName);
    }

    public Person(Long id, String name, int age, String longName) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.longName = longName;
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getLongName() {
        return longName;
    }

    public void setLongName(String longName) {
        this.longName = longName;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.data.annotation.Id
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue


@Entity
class Person {
    @Id
    @GeneratedValue
    private Long id
    private String name
    private int age

    Person() {
    }

    Person(String name, int age) {
        this(null, name, age)
    }

    Person(Long id, String name, int age) {
        this.id = id
        this.name = name
        this.age = age
    }

    Long getId() {
        return id
    }

    void setId(Long id) {
        this.id = id
    }

    String getName() {
        return name
    }

    void setName(String name) {
        this.name = name
    }

    int getAge() {
        return age
    }

    void setAge(int age) {
        this.age = age
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.Id
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue

@Entity
class Person {
    @Id
    @GeneratedValue
    var id: Long? = null
    var name: String? = null
    var age = 0

    constructor(name: String?, age: Int) : this(null, name, age) {}
    constructor(id: Long?, name: String?, age: Int) {
        this.id = id
        this.name = name
        this.age = age
    }
}
```

  </TabItem>
</Tabs>

在本例中，数据库将以 `long_name` 的形式在结果中返回原始列名 `long_name_column_legacy_system`。如果设置了 `alias` 属性，那么在编写自定义或本地查询时应注意按照 `alias` 值返回字段。

在关联的 MappedProperty 中设置 `alias` 不会产生影响，因为它只对字段/列映射有意义。

### 6.5.11 支持 JSON 列

您可以使用 [@TypeDef](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/TypeDef.html) 注解将一个类的字段声明为 JSON 类型，如下所示：

```java
@TypeDef(type = DataType.JSON)
private Map<String, String> data;
```

上述内容将映射到名为 `data` 的列。根据数据库的不同，列类型也会有所调整。例如，对于支持本地 JSON 的 Postgres，列类型将是 `JSONB`。

:::tip 注意
要允许在实体属性中序列化和反序列化 JSON，必须在 classpath 中包含 Jackson 和 `micronaut-runtime` 模块。
:::

### 6.5.12 JSON 视图

从 Micronaut Data 4.0 和 Oracle23c 数据库开始，一个实体可以如下方式映射到一个 JSON VIEW：

```java
@JsonView("CONTACT_VIEW")
public class ContactView
```

其中 "CONTACT_VIEW" 是数据库中 duality json 视图对象的实际名称。目前只有 Oracle 数据库从 23c 版本开始支持该功能。有关 Oracle JSON VIEW 的更多信息，请访问 https://docs.oracle.com/en/database/oracle/oracle-database/23/jsnvu/overview-json-relational-duality-views.html。

从本质上讲，json 视图将被视为映射实体，从数据库返回 JSON 结构并映射到 java 实体。所有 CRUD 操作都可针对 json 视图映射实体执行。

限制

- 在模式创建过程中，json 视图映射实体将被跳过，用户应手动或通过迁移脚本创建这些实体

### 6.5.13 支持 Java 16 记录

自 2.3.0 起，Micronaut Data JDBC / R2DBC 支持使用 Java 16。

下面的记录类演示了这一功能：

1. 在记录上使用 [@MappedEntity](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedEntity.html) 注解
2. 数据库标识符使用 [@Id](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Id.html) 和 [@GeneratedValue](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/GeneratedValue.html) 注解，并标记为 `@Nullable`

由于记录是不可变的，因此需要将生成值的构造函数参数标记为 `@Nullable`，并为这些参数传递 `null`。下面是一个示例：

需要注意的是，返回的实例与传递给 `save` 方法的实例不同。当执行写入操作时，Micronaut Data 将使用复制构造函数方法来填充数据库标识符，并从保存方法中返回一个新实例。

### 6.5.14 支持 Kotlin 不可变数据类

Micronaut Data JDBC / R2DBC 支持使用不可变的 Kotlin 数据类作为模型实体。其实现与 Java 16 记录相同：修改实体时将使用复制构造函数，每次修改都意味着一个新的实体实例。

*src/main/kotlin/example/Student.kt*

```kt
package example

import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import io.micronaut.data.annotation.Relation

@MappedEntity
data class Student(
        @field:Id @GeneratedValue
        val id: Long?,
        val name: String,
        @Relation(value = Relation.Kind.MANY_TO_MANY, cascade = [Relation.Cascade.PERSIST])
        val courses: List<Course>,
        @Relation(value = Relation.Kind.ONE_TO_MANY, mappedBy = "student")
        val ratings: List<CourseRating>
) {
    constructor(name: String, items: List<Course>) : this(null, name, items, emptyList())
}
```

:::tip 注意
在实体初始化过程中无法创建的生成值和关系应声明为可空值。
:::

## 6.6 数据类型

Micronaut Data JDBC / R2DBC 支持大多数常见的 Java 数据类型。默认支持以下属性类型：

- 所有原生类型及其封装（`int`、`java.lang.Integer` 等）
- `CharSequence`、 `String` 等
- 日期类型，如 `java.util.Date`、`java.time.LocalDate` 等。
- 枚举类型（仅按名称）
- 实体引用。在 `@ManyToOne` 的情况下，外键列名的计算方法是关联名称加上 `_id` 后缀。你可以用 `@Column(name 或提供 `NamingStrategy.mappedName(..)` 实现来改变这种情况。
- 实体集合。在 `@OneToMany` 的情况下，如果指定了 `mappedBy`，则预计存在定义列的逆属性，否则将创建连接表映射。

如果想定义自定义数据类型，可以通过定义一个注有 [@TypeDef](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/TypeDef.html) 的类来实现。

## 6.7 使用属性转换器

在某些情况下，您希望以不同于实体的方式在数据库中表示属性。

请看下面的实体示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import jakarta.persistence.*;

@Entity
public class Sale {

    @ManyToOne
    private final Product product;
    private final Quantity quantity;

    @Id
    @GeneratedValue
    private Long id;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import jakarta.persistence.Id
import jakarta.persistence.Entity
import jakarta.persistence.ManyToOne
import jakarta.persistence.GeneratedValue

@Entity
class Sale {

    @ManyToOne
    final Product product

    final Quantity quantity

    @Id
    @GeneratedValue
    Long id

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

import jakarta.persistence.*

@Entity
data class Sale(
    @Id
    @GeneratedValue
    var id: Long?,
    @ManyToOne
    val product: Product,
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

import io.micronaut.data.annotation.TypeDef;
import io.micronaut.data.model.DataType;

@TypeDef(type = DataType.INTEGER, converter = QuantityAttributeConverter.class)
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
import io.micronaut.data.annotation.TypeDef
import io.micronaut.data.model.DataType

@TypeDef(type = DataType.INTEGER, converter = QuantityAttributeConverter.class)
@Immutable
class Quantity {
    int amount
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.data.annotation.TypeDef
import io.micronaut.data.model.DataType

@TypeDef(type = DataType.INTEGER, converter = QuantityAttributeConverter::class)
data class Quantity(val amount: Int)
```

  </TabItem>
</Tabs>

正如您所看到的，`@TypeDef` 用于使用 DataType 枚举将 `Quantity` 类型定义为 `INTEGER`。

:::notice 提示
如果不能直接在类型上声明 `@TypeDef`，那么可以在使用该类型的字段上声明。
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
可以使用 [@MappedProperty](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/MappedProperty.html) 来定义转换器：`@MappedProperty(converter = QuantityTypeConverter.class)`，在这种情况下，数据类型将被自动检测到。
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-data/latest/guide/#dbc)

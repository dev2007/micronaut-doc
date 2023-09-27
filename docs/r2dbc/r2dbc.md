---
description: Micronaut R2DCB
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut SQL,sql,nosql,mysql,MSSQL,oracle,data,r2dbc,reactor]
---

# Micronuat R2DBC

## 1. 简介

本模块提供 Micronaut 和 R2DBC 之间的集成。

## 2. 发布历史

你可以在这里找到此项目的发布列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-r2dbc/releases

## 3. 快速入门

最快速的入门方法是使用 Micronaut Launch 创建一个新的 Micronaut 应用程序，并选择 data-r2dbc、mysql 和 flywayfeatures。这也可以通过 Micronaut 2.2 及以上版本的 CLI 完成：

*使用 CLI 创建应用程序*

```bash
# For Maven add: --build maven
$ mn create-app --lang java example --features data-r2dbc,flyway,mysql
```

或通过 `curl`

*使用 curl 创建应用程序*

```bash
# For Maven add to the URL: &build=maven
$ curl https://launch.micronaut.io/demo.zip?lang=java&features=data-r2dbc,flyway,mysql -o demo.zip && unzip demo.zip -d demo && cd demo
```

生成的应用程序将使用 MySQL，因为我们传递了 mysql 功能，增加了对 MySQL 的 R2DBC 驱动的依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

:::note 提示
要为其他驱动程序创建配置，可以选择相应的功能：`Oracle`、`Postgres`、`SQLServer`、`H2` 或 `Mariadb`。
:::

现在定义一个 SQL 脚本，在 `src/main/resources/db/migration` 中创建初始模式。例如：

*示例 `V1__create-schema.sql`*

```sql
CREATE TABLE book(id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), pages INT, author_id BIGINT NOT NULL);
CREATE TABLE author(id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255));
```

现在，你可以使用包含应用程序配置的 `src/main/resources/application.yml` 配置应用程序以连接数据库：

*应用程序配置示例*

```yaml
flyway: (1)
  datasources:
    default:
      enabled: true
datasources:
  default: (2)
    url: jdbc:mysql://localhost:3306/mydatabase
r2dbc:
  datasources:
    default: (3)
      url: r2dbc:mysql:///mydatabase
```

1. Flyway 配置可确保应用模式迁移。更多信息参阅 [Micronaut Flyway](/flyway)。
2. Flyway 配置需要配置 JDBC 数据源，此设置会配置一个。更多信息参阅 [Micronaut JDBC](/sql#3-配置-JDBC)。
3. `r2dbc.datasources.default.url` 属性用于配置默认的 R2DBC `ConnectionFactory`

:::note 提示
R2DBC ConnectionFactory 对象可以通过依赖注入注入到代码中的任何地方。
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

还有一个从 `ReactiveStreamsRepository` 扩展而来的仓库接口，用于访问数据库：

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

@R2dbcRepository(dialect = Dialect.MYSQL) // (1)
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

@R2dbcRepository(dialect = Dialect.MYSQL) // (1)
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

1. [@R2dbcRepository](https://micronaut-projects.github.io/micronaut-r2dbc/latest/api/io/micronaut/data/r2dbc/annotation/R2dbcRepository.html) 注解可用于指定数据源和方言
2. 你可以覆盖超级接口中的方法，用具体实现来专门化默认 [Publisher](https://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 返回类型

现在，你可以将此接口注入控制器，并用它来执行 R2DBC 查询：

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

1. 通过返回一个可发出许多项目的反应式类型，你可以实现数据流（[Flowable](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Flowable.html) 或 `Flux`）。
2. 通过返回发出单个项的反应式，你可以返回整个响应（[Single](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Single.html) 或 `Mono`）

## 4 可用驱动

截至本文撰写时，以下驱动可用。

**H2**

R2DBC 驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.r2dbc:r2dbc-h2")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.r2dbc</groupId>
    <artifactId>r2dbc-h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

对于 Flyway 迁移，则使用 JDBC 驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("com.h2database:h2")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

**MySQL**

R2DBC 驱动：

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

对于 Flyway 迁移，则使用 JDBC 驱动：

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

**MariaDB**

R2DBC 驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("org.mariadb:r2dbc-mariadb:1.0.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.mariadb</groupId>
    <artifactId>r2dbc-mariadb</artifactId>
    <version>1.0.0</version>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

对于 Flyway 迁移，则使用 JDBC 驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("org.mariadb.jdbc:mariadb-java-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.mariadb.jdbc</groupId>
    <artifactId>mariadb-java-client</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

**Postgresql**

R2DBC 驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("org.postgresql:r2dbc-postgresql")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>r2dbc-postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

对于 Flyway 迁移，则使用 JDBC 驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("org.postgresql:postgresql")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

**SQL Server**

R2DBC 驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.r2dbc:r2dbc-mssql")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.r2dbc</groupId>
    <artifactId>r2dbc-mssql</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

对于 Flyway 迁移，则使用 JDBC 驱动：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("com.microsoft.sqlserver:mssql-jdbc")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

## 5. Micronaut Data R2DBC

Micronaut Data 以该模块为基础，为响应式仓库提供支持。更多信息参阅 [Micronaut Data R2DBC](/data/dbc#62-r2dbc) 文档，[快速入门](#3-快速入门)部分将演示如何创建应用程序。

## 6. 仓库

你可以在此仓库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-r2dbc

> [英文链接](https://micronaut-projects.github.io/micronaut-r2dbc/latest/guide/index.html)

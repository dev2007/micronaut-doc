---
sidebar_position: 20
---

# 12.2 数据访问配置

本表总结了为启用这些模块而需要添加到构建中的配置模块和依赖：

*表 1.数据访问配置模块*

|依赖|描述|
|--|--|
|`io.micronaut.sql:micronaut-jdbc-dbcp`|使用 [Commons DBCP](https://commons.apache.org/proper/commons-dbcp/) 配置 SQL [数据源](https://docs.oracle.com/javase/8/docs/api/javax/sql/DataSource.html)|
|`io.micronaut.sql:micronaut-jdbc-hikari`|使用 [Hikari 连接池](https://github.com/brettwooldridge/HikariCP)配置 SQL [数据源](https://docs.oracle.com/javase/8/docs/api/javax/sql/DataSource.html)|
|`io.micronaut.sql:micronaut-jdbc-tomcat`|使用 [Tomcat 连接池](https://tomcat.apache.org/tomcat-7.0-doc/jdbc-pool.html)配置 SQL [数据源](https://docs.oracle.com/javase/8/docs/api/javax/sql/DataSource.html)|
|`io.micronaut.sql:micronaut-hibernate-jpa`|配置 Hibernate/JPA `EntityManagerFactory` Bean|
|`io.micronaut.groovy:micronaut-hibernate-gorm`|为 Groovy 应用程序配置 [Hibernate 的 GORM](https://gorm.grails.org/latest/hibernate/manual)|
|`io.micronaut.mongodb:micronaut-mongo-reactive`|配置 [MongoDB Reactive 驱动](https://mongodb.github.io/mongo-java-driver-reactivestreams)|
|`io.micronaut.groovy:micronaut-mongo-gorm`|为 Groovy 应用程序配置 [MongoDB 的 GORM](https://gorm.grails.org/latest/mongodb/manual)|
|`io.micronaut.neo4j:micronaut-neo4j-bolt`|为 [Neo4j](https://neo4j.com/) 配置 [Bolt Java 驱动](https://github.com/neo4j/neo4j-java-driver)|
|`io.micronaut.groovy:micronaut-neo4j-gorm`|为 Groovy 应用程序配置 [Neo4j 的 GORM](https://gorm.grails.org/latest/neo4j/manual)|
|`io.micronaut.sql:micronaut-vertx-mysql-client`|配置[响应式 MySQL 客户端](https://github.com/eclipse-vertx/vertx-sql-client/tree/master/vertx-mysql-client)|
|`io.micronaut.sql:micronaut-vertx-pg-client`|配置[响应式 Postgres 客户端](https://github.com/eclipse-vertx/vertx-sql-client/tree/master/vertx-pg-client)|
|`io.micronaut.redis:micronaut-redis-lettuce`|为 [Redis](https://redis.io/) 配置 [Lettuce](https://lettuce.io/) 驱动|
|`io.micronaut.cassandra:micronaut-cassandra`|配置用于 [Cassandra](https://cassandra.apache.org/) 的 [Datastax Java 驱动](https://github.com/datastax/java-driver)|

例如，要添加对 MongoDB 的支持，请添加以下依赖：

*build.gradle*

```groovy
compile "io.micronaut.mongodb:micronaut-mongo-reactive"
```

对于 Groovy 用户，Micronaut 为 [GORM](https://gorm.grails.org/) 提供特殊支持。

:::warning 警告
使用 Hibernate 的 GORM 时，不能同时依赖 `hibernate-jpa` 和 `hibernate-gorm`。
:::

以下各节将详细介绍配置选项和每种实现所暴露的 Bean。

## 12.2.1 配置 SQL 数据源

JDBC 数据源可配置为当前提供的三种实现之一--默认支持 Apache DBCP2、Hikari 和 Tomcat。
配置 JDBC 数据源

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请提供 `jdbc-tomcat`、`jdbc-hikari` 或 `jdbc-dbcp` 功能之一，以便在项目中预先配置一个简单的 JDBC 连接池，以及一个默认的 H2 数据库驱动程序：

```bash
$ mn create-app my-app --features jdbc-tomcat
```
:::

要开始操作，请为与您将使用的实现相对应的 JDBC 配置之一添加依赖。请选择以下之一：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.micronaut.sql:micronaut-jdbc-tomcat")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-jdbc-tomcat</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

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

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.micronaut.sql:micronaut-jdbc-dbcp")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-jdbc-dbcp</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.micronaut.sql:micronaut-jdbc-ucp")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-jdbc-ucp</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

此外，在构建过程中添加 JDBC 驱动程序依赖关系。例如，添加 [H2 内存数据库](https://www.h2database.com/)：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("com.h2database:h2")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml

```

  </TabItem>
</Tabs>

更多信息，参阅 [Micronaut SQL 库](https://github.com/micronaut-projects/micronaut-sql)项目中的[配置 JDBC](/sql/jdbc.html) 部分。

## 12.2.2 配置 Hibernate

设置 Hibernate/JPA EntityManager

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请提供 hibernate-jpa 功能，以便在项目中包含 Hibernate JPA 配置：

```bash
$ mn create-app my-app --features hibernate-jpa
```
:::

Micronaut 支持在 [SQL 数据源支持](#1221-配置-sql-数据源)的基础上配置 [Hibernate](https://hibernate.org/) / JPA `EntityManager`。

一旦你配置了[一个或多个数据源](#1221-配置-sql-数据源)以使用 Hibernate，请将 `hibernate-jpa` 依赖添加到你的构建中：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.sql:micronaut-hibernate-jpa")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-hibernate-jpa</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

更多信息，参阅 [Micronaut SQL 库](https://github.com/micronaut-projects/micronaut-sql) 项目中的[配置 Hibernate](/sql/hibernate.html) 部分。

**使用 Hibernate 的 GORM**

对于 Groovy 用户和熟悉 Grails 框架的用户，可以使用 [Hibernate 的 GORM](https://gorm.grails.org/) 特殊支持。要使用 Hibernate 的 GORM，就不要使用 Micronaut 内置的 [SQL 支持](#1221-配置-sql-数据源)或 `hibernate-jpa` 依赖项，因为 GORM 本身负责创建 `DataSource`、`SessionFactory` 等。

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请提供 `hibernate-gorm` 特性，以便在项目中包含 GORM、基本连接池配置和默认 H2 数据库驱动程序：

```bash
$ mn create-app my-app --features hibernate-gorm
```
:::

参阅 [Micronaut for Groovy](https://github.com/micronaut-projects/micronaut-groovy) 用户指南中的 [GORM 模块](/groovy.html#5-GROM-模块)部分。

## 12.2.3 配置 MongoDB

设置本地 MongoDB 驱动程序

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 `mongo-reactive` 特性在项目中配置本地 MongoDB 驱动：

```bash
$ mn create-app my-app --features mongo-reactive
```
:::

Micronaut 可以自动配置本地 MongoDB Java 驱动。要使用此特性，请在构建过程中添加以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.mongodb:micronaut-mongo-reactive")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.mongodb</groupId>
    <artifactId>micronaut-mongo-reactive</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后在配置文件（如 `application.yml`）中配置 MongoDB 服务器的 URI：

*配置 MongoDB 服务器*

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

:::note 提示
`mongodb.uri` 遵循 [MongoDB 连接字符串](https://www.mongodb.com/docs/manual/reference/connection-string/)格式。
:::

这样，一个非阻塞的响应式流的 [MongoClient](https://mongodb.github.io/mongo-java-driver-reactivestreams/1.8/javadoc/com/mongodb/reactivestreams/client/MongoClient.html) 就可以用于依赖注入了。

要使用阻塞型驱动程序，请在构建过程中添加对 mongo-java-driver 的依赖：

```groovy
runtimeOnly "org.mongodb:mongo-java-driver"
```

然后，阻塞的 [MongoClient](https://mongodb.github.io/mongo-java-driver/3.7/javadoc/com/mongodb/MongoClient.html) 将可用于注入。

有关在 Micronaut 中配置和使用 MongoDB 的更多信息，参阅 [Micronaut MongoDB](/mongodb.html) 文档。

## 12.2.4 配置 Neo4j

Micronaut 专门支持为流行的 Neo4j Graph 数据库自动配置 Neo4j Bolt 驱动程序。

:::note 提示
*使用 CLI*

如果你使用 Micronaut CLI 创建你的项目，提供 `neo4j-bolt` 特性在你的项目中配置 Neo4j Bolt 驱动：

```bash
$ mn create-app my-app --features neo4j-bolt
```
:::

要配置 Neo4j Bolt 驱动，首先要在构建中添加 `neo4j-bolt` 模块：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-neo4j-bolt")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-neo4j-bolt</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后在配置文件（如 `application.yml`）中配置 Neo4j 服务器的 URI：

*配置 `neo4j.uri`*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
neo4j.uri=bolt://localhost
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
neo4j:
  uri: bolt://localhost
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[neo4j]
  uri="bolt://localhost"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
neo4j {
  uri = "bolt://localhost"
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  neo4j {
    uri = "bolt://localhost"
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "neo4j": {
    "uri": "bolt://localhost"
  }
}
```

  </TabItem>
</Tabs>

:::note 提示
`neo4j.uri` 设置的格式必须与 Neo4j 文档中[连接 URI](https://neo4j.com/docs/developer-manual/current/drivers/client-applications/#driver-connection-uris)部分所描述的格式一致。
:::

一旦上述配置就绪，你就可以注入一个 `org.neo4j.driver.v1.Driver` bean 实例，它具有同步阻塞 API 和基于 `CompletableFuture` 的非阻塞 API。

有关在 Micronaut 中配置和使用 Neo4j 的更多信息，参阅 [Micronaut Neo4j](/neo4j.html) 文档。

## 12.2.5 配置 Postgres

Micronaut 支持使用 [vertx-pg-client](https://github.com/eclipse-vertx/vertx-sql-client/tree/master/vertx-pg-client) 连接 Postgres 的反应式非阻塞客户端，它可以用单线程处理多个数据库连接。

### 配置响应式 Postgres 客户端

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 `vertx-pg-client` 功能在项目中配置响应式 Postgres 客户端：

```bash
$ mn create-app my-app --features vertx-pg-client
```
:::

要配置响应式 Postgres 客户端，首先要在构建过程中添加 `vertx-pg-client` 模块：

*build.gradle*

```groovy
compile "io.micronaut.sql:micronaut-vertx-pg-client"
```

更多信息，参阅 [Micronaut SQL 库](https://github.com/micronaut-projects/micronaut-sql)项目中的[配置响应式 Postgres](/sql/vertxpgclient.html) 部分。

## 12.2.6 配置 Redis

Micronaut 通过 redis-lettuce 模块为 [Redis](https://redis.io/) 自动配置 [Lettuce](https://lettuce.io/) 驱动。

### 配置 Lettuce

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 `redis-lettuce` 功能在项目中配置 Lettuce 驱动：

```bash
$ mn create-app my-app --features redis-lettuce
```
:::

要配置 Lettuce 驱动，首先要在构建过程中添加 `redis-lettuce` 模块：

*build.gradle*

```groovy
compile "io.micronaut.redis:micronaut-redis-lettuce"
```

然后在配置文件（如 `application.yml`）中配置 Redis 服务器的 URI：

*配置 `redis.uri`*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
redis.uri=redis://localhost
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
redis:
  uri: redis://localhost
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[redis]
  uri="redis://localhost"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
redis {
  uri = "redis://localhost"
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  redis {
    uri = "redis://localhost"
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "redis": {
    "uri": "redis://localhost"
  }
}
```

  </TabItem>
</Tabs>

:::note 提示
`redis.uri` 设置的格式必须与 Lettuce 维基中[连接 URI](https://github.com/lettuce-io/lettuce-core/wiki/Redis-URI-and-connection-details) 部分所描述的格式一致。
:::

你也可以使用 `redis.uris` 指定多个 Redis URI，在这种情况下，会创建一个 `RedisClusterClient`。

更多信息和文档，参阅 [Micronaut Redis](/redis/introduction.html) 文档。

## 12.2.7 配置 Cassandra

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请提供 `cassandra` 特性，以便在项目中包含 Cassandra 配置：

```bash
$ mn create-app my-app --features cassandra
```
:::

更多信息，参阅 [Micronaut Cassandra 模块](/cassandra.html)文档。

## 12.2.8 配置 Liquibase

要配置 Micronaut 与 [Liquibase](https://www.liquibase.org/) 的集成，请遵循[这些说明](/liquibase.html)。

## 12.2.9 配置 Flyway

要配置 Micronaut 与 [Flyway](https://flywaydb.org/) 的集成，请遵循[这些说明](/flyway.html)。



> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#dataAccess)

---
description: Micronaut SQL 库
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut SQL 库,sql,nosql,mysql,MSSQL,oracle]
---

# Micronaut SQL 库

在 Micronaut 中支持 SQL 数据库访问的项目

## 1. 简介

本项目包括在 Micronaut 中支持 SQL 数据库访问的模块。

## 2. 发布历史

你可以在这里找到这个项目的发布列表（包含发布说明）：

https://github.com/micronaut-projects/micronaut-sql/releases

## 3. 配置 JDBC

Java 数据源可配置为当前提供的三种实现之一。默认支持 Apache DBCP2、Hikari 和 Tomcat。

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请提供 `jdbc-tomcat`、`jdbc-hikari`、`jdbc-dbcp` 或 `jdbc-ucp` 功能之一，以便在项目中预先配置简单的 JDBC 连接和默认的 H2 数据库驱动：

```bash
如果使用 Micronaut CLI 创建项目，请提供 jdbc-tomcat、jdbc-hikari、jdbc-dbcp 或 jdbc-ucp 功能之一，以便在项目中预先配置简单的 JDBC 连接和默认的 H2 数据库驱动程序：
```
:::

要开始使用，只需在与要使用的实现相对应的 JDBC 配置中添加一个依赖即可。请选择以下之一：

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

你还需要在类路径中添加 JDBC 驱动程序依赖关系。例如，添加 [H2 内存数据库](http://www.h2database.com/)：

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

### 3.1 配置 JDBC 连接池

可以配置所有具体实现参数。我们努力使基本配置在不同实现之间保持一致。
- Hikari：除了 jdbcUrl 之外，还可以通过 url 配置 URL。除 dataSourceJNDI 外，还可通过 jndiName 配置 JNDI 名称。
- Tomcat：除了 dataSourceJNDI 外，还可通过 jndiName 配置 JNDI 名称。

如果未提供配置选项，将计算多个配置选项。

|||
|--|--|
|URL|将在 class path 中搜索嵌入式数据库驱动程序。如果找到，URL 将设置为该驱动的默认值。|
|Driver Class|如果配置了 URL，驱动程序类将从 URL 派生，否则将在类路径中搜索嵌入式数据库驱动。如果找到，将使用该驱动的默认类名。|
|Username|如果配置的数据库驱动是嵌入式的，则用户名将设置为 "sa"。|
|Password|如果配置的数据库驱动是嵌入式的，密码将设置为空字符串。|

例如：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
datasources.default.url=jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
datasources.default.username=sa
datasources.default.password=
datasources.default.driverClassName=org.h2.Driver
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
datasources:
    default:
        url: jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
        username: sa
        password: ""
        driverClassName: org.h2.Driver
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[datasources]
  [datasources.default]
    url="jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
    username="sa"
    password=""
    driverClassName="org.h2.Driver"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
datasources {
  'default' {
    url = "jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
    username = "sa"
    password = ""
    driverClassName = "org.h2.Driver"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  datasources {
    default {
      url = "jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
      username = "sa"
      password = ""
      driverClassName = "org.h2.Driver"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "datasources.default": {
  }
}
```

  </TabItem>
</Tabs>

要使用 Oracle UCP，请提供与下面类似的配置：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
datasources.default.url=null
datasources.default.connectionFactoryClassName=oracle.jdbc.pool.OracleDataSource
datasources.default.username=null
datasources.default.password=null
datasources.default.minPoolSize=1
datasources.default.maxPoolSize=10
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
datasources:
  default:
    url:
    connectionFactoryClassName: oracle.jdbc.pool.OracleDataSource
    username:
    password:
    minPoolSize: 1
    maxPoolSize: 10
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[datasources]
  [datasources.default]
    connectionFactoryClassName="oracle.jdbc.pool.OracleDataSource"
    minPoolSize=1
    maxPoolSize=10
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
datasources {
  'default' {
    url = null
    connectionFactoryClassName = "oracle.jdbc.pool.OracleDataSource"
    username = null
    password = null
    minPoolSize = 1
    maxPoolSize = 10
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  datasources {
    default {
      url = null
      connectionFactoryClassName = "oracle.jdbc.pool.OracleDataSource"
      username = null
      password = null
      minPoolSize = 1
      maxPoolSize = 10
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
      "url": null,
      "connectionFactoryClassName": "oracle.jdbc.pool.OracleDataSource",
      "username": null,
      "password": null,
      "minPoolSize": 1,
      "maxPoolSize": 10
    }
  }
}
```

  </TabItem>
</Tabs>

Oracle UCP 由 [UniversalConnectionPoolManager](https://docs.oracle.com/en/database/oracle/oracle-database/21/jjuar/oracle/ucp/admin/UniversalConnectionPoolManager.html) 管理。可以通过将 `ucp-manager.enabled` 设置为 `false` 来禁用该管理器。此外，还可以通过将 `ucp-manager.jmx.enabled` 设置为 `true` 并提供 `ojdbc8dms.jar` 和 `dms.jardependencies` 来启用基于 JMX 的管理。

有关可配置的其他属性列表，参考正在使用的实现。所有设置方法都可进行配置。

|||
|--|--|
|Tomcat|[PoolProperties](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/tomcat/jdbc/pool/PoolProperties.html)|
|Hikari|[HikariConfig](http://static.javadoc.io/com.zaxxer/HikariCP/2.7.1/com/zaxxer/hikari/HikariConfig.html)|
|Apache DBCP|[BasicDataSource](http://commons.apache.org/proper/commons-dbcp/api-2.1.1/org/apache/commons/dbcp2/BasicDataSource.html)|
|Oracle UCP|[PoolDataSource](https://docs.oracle.com/en/database/oracle/oracle-database/21/jjuar/oracle/ucp/jdbc/PoolDataSource.html)|

### 3.2 配置多个数据源

要注册多个数据源，只需将它们配置为不同的名称即可。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
datasources.default=...
datasources.warehouse=...
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
datasources:
    default:
        ...
    warehouse:
        ...
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[datasources]
  default="..."
  warehouse="..."
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
datasources {
  'default' = "..."
  warehouse = "..."
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  datasources {
    default = "..."
    warehouse = "..."
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "datasources": {
    "default": "...",
    "warehouse": "..."
  }
}
```

  </TabItem>
</Tabs>

在注入 DataSource Bean 时，将注入名称为 "default "的 Bean，除非注入时限定了配置名称。如果没有名为 "default "的配置，那么所有的 Bean 都不会是主要的，因此所有注入都必须加以限定。例如：

```java
@Inject DataSource dataSource // "default" will be injected
@Inject @Named("warehouse") DataSource dataSource // "warehouse" will be injected
```

### 3.3 JDBC 健康检查

一旦配置了 JDBC `DataSource`，[JdbcIndicator](https://docs.micronaut.io/latest/api/io/micronaut/management/health/indicator/jdbc/JdbcIndicator.html) 就会被激活，从而产生 `/health` 端点和 [CurrentHealthStatus](https://docs.micronaut.io/latest/api/io/micronaut/health/CurrentHealthStatus.html) 接口，解析 JDBC 连接的健康状况。

有关详细信息，参阅[健康端点](/core/management/providedEndpoints#1523-健康端点)部分。

## 4. 配置 Hibernate

**设置 Hibernate/JPA EntityManager**

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请提供 `hibernate-jpa` 特性，以便在项目中包含 Hibernate JPA 配置：

```bash
$ mn create-app my-app --features hibernate-jpa
```

:::

Micronaut 内置了对配置 [Hibernate](http://hibernate.org/)/JPA `EntityManager` 的支持，它建立在对 [SQL 数据源支持的](#3-配置-jdbc)基础之上。

一旦[配置了一个或多个数据源](#3-配置-jdbc)以使用 Hibernate，就需要在构建配置中添加 `hibernate-jpa` 依赖：

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

以及 Micronaut 数据事务 Hibernate 依赖：

[dependency:micronaut-data-tx-hibernate="io.micronaut.data"]。

就是这样。对于每个注册的 SQL `DataSource`，Micronaut 将使用 [EntityManagerFactoryBean](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/hibernate/jpa/EntityManagerFactoryBean.html) 配置以下 Bean：

- [StandardServiceRegistry](https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/boot/registry/StandardServiceRegistry.html) —— Hibernate `StandardServiceRegistry`
- [MetadataSources](https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/boot/MetadataSources.html) —— Hibernate `MetadataSources`
- [SessionFactoryBuilder](https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/boot/SessionFactoryBuilder.html) —— Hibernate `SessionFactoryBuilder`
- [SessionFactory](https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/SessionFactory.html) —— 实现了 JPA `EntityManagerFactory` 接口的 Hibernate `SessionFactory` bean

### 4.1 禁用 Micronaut Hibernate JPA

你可以禁用 Micronaut Hibernate JPA，例如在测试中，设置 `jpa.enabled` 为 `false`。

### 4.2 注入 EntityManager 或 Hibernate 会话

你可以使用 `javax.persistence.PersistenceContext` 注解来注入 `EntityManager`（或 Hibernate `Session`）。为此，你需要确保 JPA 注解位于构建中的 `annotationProcessor` 路径上：

*在 Gradle 中为 `annotationProcessor` 添加 JPA 依赖*

```groovy
annotationProcessor "jakarta.persistence:jakarta.persistence-api:2.2"
```

*使用 `@PersistenceContext`*

```java
@PersistenceContext
EntityManager entityManager;

@PersistenceContext(name = "other")
EntityManager otherManager;
```

当使用 [@Transactional](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html) 时，Micronaut 将注入一个编译时作用域的代理，以检索与当前事务相关联的 `EntityManager`（请参阅下面的 "使用 Spring 事务管理"）。

请注意，上述示例使用的是字段注入，因为 `@PersistenceContext` 注解不支持构造函数或方法参数的参数声明。因此，如果想使用构造函数或方法注入，就必须使用 [@CurrentSession](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/hibernate/jpa/scope/CurrentSession.html) 注解：

*使用 `@CurrentSession` 进行构造函数注入*

```java
public MyService(@CurrentSession EntityManager entityManager) {
     this.entityManager = entityManager;
}
```

### 4.3 定制 Hibernate/JPA 配置

定制和配置会话工厂（SessionFactory）有几种不同的方法。最简单的方法是通过配置。下面的配置演示了一个例子：

*配置 Hibernate 属性*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
datasources.default.name=mydb
jpa.default.entity-scan.packages[0]=foo.bar
jpa.default.entity-scan.packages[1]=foo.baz
jpa.default.properties.hibernate.hbm2ddl.auto=update
jpa.default.properties.hibernate.show_sql=true
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
datasources:
    default:
        name: 'mydb'
jpa:
    default:
        entity-scan:
            packages:
                - 'foo.bar'
                - 'foo.baz'
        properties:
            hibernate:
                hbm2ddl:
                    auto: update
                show_sql: true
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[datasources]
  [datasources.default]
    name="mydb"
[jpa]
  [jpa.default]
    [jpa.default.entity-scan]
      packages=[
        "foo.bar",
        "foo.baz"
      ]
    [jpa.default.properties]
      [jpa.default.properties.hibernate]
        [jpa.default.properties.hibernate.hbm2ddl]
          auto="update"
        show_sql=true
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
datasources {
  'default' {
    name = "mydb"
  }
}
jpa {
  'default' {
    entityScan {
      packages = ["foo.bar", "foo.baz"]
    }
    properties {
      hibernate {
        hbm2ddl {
          auto = "update"
        }
        show_sql = true
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  datasources {
    default {
      name = "mydb"
    }
  }
  jpa {
    default {
      entity-scan {
        packages = ["foo.bar", "foo.baz"]
      }
      properties {
        hibernate {
          hbm2ddl {
            auto = "update"
          }
          show_sql = true
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
  "datasources": {
    "default": {
      "name": "mydb"
    }
  },
  "jpa": {
    "default": {
      "entity-scan": {
        "packages": ["foo.bar", "foo.baz"]
      },
      "properties": {
        "hibernate": {
          "hbm2ddl": {
            "auto": "update"
          },
          "show_sql": true
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

上面的示例配置了要扫描的包，并设置了要传递给 Hibernate 的属性。正如你所看到的，这些都是以每个 `DataSource` 为基础完成的。有关可用的选项，请参阅 [JpaConfiguration](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/hibernate/jpa/JpaConfiguration.html) 配置类。

如果需要进一步控制 `SessionFactory` 的创建方式，可以注册 [BeanCreatedEventListener](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/context/event/BeanCreatedEventListener.html) Bean，监听会话 [SessionFactoryBuilder](https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/boot/SessionFactoryBuilder.html)、 [MetadataSources](https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/boot/MetadataSources.html) 等的创建，并在监听器中应用自定义配置。

你还可以选择创建 [Integrator](https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/integrator/spi/Integrator.html) 和 [Interceptor](https://docs.jboss.org/hibernate/orm/current/javadocs/org/hibernate/Interceptor.html) 类型的 Bean，这些 Bean 将被自动接收和注入。

### 4.4 实体扫描配置

自本库 1.2 版起，实体扫描配置变得更加灵活，可以在 GraalVM 底层上进行无反射扫描。

默认配置将查找 Micronaut 编译的所有包含 `@Entity` 注解的类。

如果你想限制包含在特定 JPA 实体管理器中的包，可以使用 `entity-scan` 配置选项：

*限制实体扫描*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
datasources.default.url=jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
datasources.default.username=sa
datasources.default.password=
datasources.default.driverClassName=org.h2.Driver
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
datasources:
    default:
        url: jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
        username: sa
        password: ""
        driverClassName: org.h2.Driver
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[datasources]
  [datasources.default]
    url="jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
    username="sa"
    password=""
    driverClassName="org.h2.Driver"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
datasources {
  'default' {
    url = "jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
    username = "sa"
    password = ""
    driverClassName = "org.h2.Driver"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  datasources {
    default {
      url = "jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
      username = "sa"
      password = ""
      driverClassName = "org.h2.Driver"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "datasources.default": {
  }
}
```

  </TabItem>
</Tabs>

要使用 Oracle UCP，请提供与下面类似的配置：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
jpa.default.entity-scan.packages[0]=foo.bar
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
jpa:
    default:
        entity-scan:
            packages:
                - 'foo.bar'
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[jpa]
  [jpa.default]
    [jpa.default.entity-scan]
      packages=[
        "foo.bar"
      ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
jpa {
  'default' {
    entityScan {
      packages = ["foo.bar"]
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
        packages = ["foo.bar"]
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
        "packages": ["foo.bar"]
      }
    }
  }
}
```

  </TabItem>
</Tabs>

上述配置将搜索范围限制在 `foo.bar` 包中的类。请注意，如果类没有被 Micronaut 编译，它们将不会被找到。有两种方法可以解决这个问题，一种是为外部类生成自省元数据。例如，你可以在 `Application` 类中加入这个元数据：

*为外部类生成自省元数据*

```java
@Introspected(packages="foo.bar")
```

这将为 `foo.bar` 包中的所有类生成自省元数据。

如果此选项不适合你，你也可以使用 `classpath` 属性启用全类路径扫描：

*启用全类路径扫描*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
datasources.default.url=jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
datasources.default.username=sa
datasources.default.password=
datasources.default.driverClassName=org.h2.Driver
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
datasources:
    default:
        url: jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
        username: sa
        password: ""
        driverClassName: org.h2.Driver
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[datasources]
  [datasources.default]
    url="jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
    username="sa"
    password=""
    driverClassName="org.h2.Driver"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
datasources {
  'default' {
    url = "jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
    username = "sa"
    password = ""
    driverClassName = "org.h2.Driver"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  datasources {
    default {
      url = "jdbc:h2:mem:default;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
      username = "sa"
      password = ""
      driverClassName = "org.h2.Driver"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "datasources.default": {
  }
}
```

  </TabItem>
</Tabs>

要使用 Oracle UCP，请提供与下面类似的配置：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
jpa.default.entity-scan.classpath=true
jpa.default.entity-scan.packages[0]=foo.bar
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
jpa:
    default:
        entity-scan:
            classpath: true
            packages:
                - 'foo.bar'
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[jpa]
  [jpa.default]
    [jpa.default.entity-scan]
      classpath=true
      packages=[
        "foo.bar"
      ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
jpa {
  'default' {
    entityScan {
      classpath = true
      packages = ["foo.bar"]
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
        classpath = true
        packages = ["foo.bar"]
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
        "classpath": true,
        "packages": ["foo.bar"]
      }
    }
  }
}
```

  </TabItem>
</Tabs>

请注意，这种方法有以下缺点：

- 速度较慢，因为 Micronaut 必须搜索 JAR 文件并使用 ASM 扫描类文件
- 无法在 GraalVM 底层运行。

### 4.5 配置 Hibernate 响应式

通过添加以下依赖，可以使用 Hibernate Reactive：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.sql:micronaut-hibernate-reactive")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-hibernate-reactive</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

以及 Micronaut 数据事务 Hibernate 依赖：

[dependency:micronaut-data-tx-hibernate="io.micronaut.data"]。

:::tip 注意
Hibernate Reactive 需要 Java 11
:::

要启用响应式会话工厂，JPA 配置需要将 `reactive` 属性设为 `true`。响应式实现不使用传统的 JDBC 驱动，而是使用 Vertx 驱动。

你可以添加以下选项之一：

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

并使用属性对其进行配置：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
jpa.default.reactive=true
jpa.default.properties.hibernate.connection.url=jdbc:postgresql:database
jpa.default.properties.hibernate.connection.username=myUsername
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
        connection:
          url: jdbc:postgresql:database # Use JDBC style url
          username: myUsername
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
        [jpa.default.properties.hibernate.connection]
          url="jdbc:postgresql:database"
          username="myUsername"
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
        connection {
          url = "jdbc:postgresql:database"
          username = "myUsername"
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
          connection {
            url = "jdbc:postgresql:database"
            username = "myUsername"
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
          "connection": {
            "url": "jdbc:postgresql:database",
            "username": "myUsername",
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

另一种方法是加入现有的 Micronaut SQL 支持库：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.sql:micronaut-vertx-mysql-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-vertx-mysql-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.sql:micronaut-vertx-pg-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-vertx-pg-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

并配置客户端：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
vertx.pg.client.port=5432
vertx.pg.client.host=the-host
vertx.pg.client.database=the-db
vertx.pg.client.user=user
vertx.pg.client.password=secret
vertx.pg.client.max-size=10
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
vertx:
  pg:
    client:
      port: 5432
      host: 'the-host'
      database: 'the-db'
      user: 'user'
      password: 'secret'
      max-size:  10
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[vertx]
  [vertx.pg]
    [vertx.pg.client]
      port=5432
      host="the-host"
      database="the-db"
      user="user"
      password="secret"
      max-size=10
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
vertx {
  pg {
    client {
      port = 5432
      host = "the-host"
      database = "the-db"
      user = "user"
      password = "secret"
      maxSize = 10
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  vertx {
    pg {
      client {
        port = 5432
        host = "the-host"
        database = "the-db"
        user = "user"
        password = "secret"
        max-size = 10
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "vertx": {
    "pg": {
      "client": {
        "port": 5432,
        "host": "the-host",
        "database": "the-db",
        "user": "user",
        "password": "secret",
        "max-size": 10
      }
    }
  }
}
```

  </TabItem>
</Tabs>

集成将自动集成在 bean 上下文中找到的 io.vertx.sqlclient.Pool 的 Vertx 驱动实例。

### 4.6 使用编译时 Hibernate 代理

Hibernate 使用代理对象来实现懒加载，默认实现是在运行时生成一个代理。

这样做有几个缺点：

- 运行时类生成会影响启动和运行性能
- 不支持 GraalVM 等环境

如果希望使用懒实体关联并避免运行时代理，可以启用编译时代理：

```yaml
jpa:
  default:
    compile-time-hibernate-proxies: true
```

编译时代理要求需要代理的实体使用 `@GenerateProxy` 注解：

例如：

```java
@Entity
public class Pet {

    @ManyToOne(fetch = FetchType.LAZY)
    private Owner owner;

    //...
}
```

实体 `Owner` 需要注解 `@GenerateProxy` 才能在编译时生成代理。

```java
@Entity
@GenerateProxy
public class Owner {
    //...
}
```

GraalVM 环境默认启用编译时代理。

### 4.7 理解 LazyInitializationException

Micronaut 基于 Netty 构建，而 Netty 基于非阻塞的事件循环模型。JDBC 和 Hibernate 是阻塞式 API，因此在 Micronaut 应用程序中使用它们时，工作会转移到阻塞式 I/O 线程池中。

当使用 [@Transactional](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html) 时，Hibernate 会话将只在该方法执行期间打开，然后自动关闭。这样可以确保阻塞操作尽可能短。

Micronau t中没有 OpenSessionInView（OSIV）的概念，以后也不会有，因为它是[次优的且不推荐使用](https://vladmihalcea.com/the-open-session-in-view-anti-pattern/)。你应该通过使用适当的连接查询或[数据传输对象（DTO）](https://vladmihalcea.com/the-best-way-to-map-a-projection-query-to-a-dto-with-jpa-and-hibernate/)来优化你编写的查询，以返回 Micronaut 将对象编码为 JSON 所需的所有必要数据。

如果在从方法返回 Hibernate 实体时遇到 `LazyInitializationException`，这表明你的查询是次优的，你应该执行 join。

## 5. 配置 JAsync SQL

Micronaut 支持使用 [jasync-sql](https://github.com/jasync-sql/jasync-sql) 异步访问 PostgreSQL 和 MySQL，允许使用单线程处理多个数据库连接。

### 5.1 配置 jasync-sql 客户端

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 `jasync-sql` 特性在项目中配置 Jasync PostgreSQL 和 MySQL 客户端：

```bash
$ mn create-app my-app --features jasync-sql
```

:::

要配置 Jasync 客户端，首先应在 classpath 中添加 `jasync-sql` 模块：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.sql:micronaut-jasync-sql")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-jasync-sql</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后，应配置希望与之通信的数据库服务器的 [PoolOptions](https://github.com/jasync-sql/jasync-sql/wiki/Configuring-and-Managing-Connections)：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
jasync.client.port=5432
jasync.client.host=the-host
jasync.client.database=the-db
jasync.client.username=test
jasync.client.password=test
jasync.client.maxActiveConnections=5
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
jasync:
    client:
        port: 5432
        host: the-host
        database: the-db
        username: test
        password: test
        maxActiveConnections: 5
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[jasync]
  [jasync.client]
    port=5432
    host="the-host"
    database="the-db"
    username="test"
    password="test"
    maxActiveConnections=5
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
jasync {
  client {
    port = 5432
    host = "the-host"
    database = "the-db"
    username = "test"
    password = "test"
    maxActiveConnections = 5
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
jasync {
  client {
    port = 5432
    host = "the-host"
    database = "the-db"
    username = "test"
    password = "test"
    maxActiveConnections = 5
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "jasync": {
    "client": {
      "port": 5432,
      "host": "the-host",
      "database": "the-db",
      "username": "test",
      "password": "test",
      "maxActiveConnections": 5
    }
  }
}
```

  </TabItem>
</Tabs>

完成上述配置后，就可以注入 `com.github.jasync.sql.db.Connection` Bean。下面是最简单的连接方法：

```groovy
result = client.sendQuery('SELECT * FROM pg_stat_database').thenApply({ QueryResult resultSet -> (1)
    return "Size: ${resultSet.rows.size()}"
}).get()
```

1. 客户端是 `com.github.jasync.sql.db.Connection` bean 的实例。

有关使用客户端运行查询的更多信息，阅读 [jasync-sql](https://github.com/jasync-sql/jasync-sql/wiki/Executing-Statements) 文档中的 "运行查询 "部分。

要使用 [Jasync 查询拦截器](https://github.com/jasync-sql/jasync-sql/wiki/Interceptors)，请注册 `com.github.jasync.sql.db.interceptor.QueryInterceptor` 类型的 Bean。

### 5.2 数据库健康检查

当 `jasync-sql` 模块被激活时，[JasyncHealthIndicator](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/jasync/health/JasyncHealthIndicator.html) 会被激活，导致 `/health` 端点和 [CurrentHealthStatus](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/health/CurrentHealthStatus.html) 接口解析连接的健康状况。

唯一支持的配置选项是通过 `endpoints.health.jasync.enabled` 关键字启用或禁用指示器。

更多信息，参阅[健康端点](/core/management/providedEndpoints#1523-健康端点)部分。

## 6. 配置 jOOQ

Micronaut 支持为流畅、类型安全的 SQL 查询构造自动配置 jOOQ 库。

要配置 jOOQ 库，首先应在类路径中添加 `jooq` 模块：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.sql:micronaut-jooq")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-jooq</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后，你应该[配置一个或多个数据源](#3-配置-jdbc)。对于每个注册的数据源，Micronaut 将使用 [JooqConfigurationFactory](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/jooq/JooqConfigurationFactory.html) 配置以下 jOOQ Bean：

- [Configuration](https://www.jooq.org/javadoc/latest/org/jooq/Configuration.html) —— jOOQ `Configuration`
- [DSLContext](https://www.jooq.org/javadoc/latest/org/jooq/DSLContext.html) —— jOOQ `DSLContext`

如果使用了 Spring 事务管理，它将额外创建以下 Bean：

- [JooqExceptionTranslatorProvider](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/jooq/JooqExceptionTranslatorProvider.html)，用于每个数据源
- [SpringTransactionProvider](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/jooq/SpringTransactionProvider.html)，用于每个 Spring `PlatformTransactionManager`

### 6.1 配置 SQL 方言

Micronaut 将尝试自动检测数据库 SQLDialect。

如果效果不佳，可以通过配置属性手动提供 SQL 方言。下面的示例为默认数据源配置了方言：

*配置 SQL 方言*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
jooq.datasources.default.sql-dialect=POSTGRES
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
jooq:
    datasources:
        default:
            sql-dialect: 'POSTGRES'
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[jooq]
  [jooq.datasources]
    [jooq.datasources.default]
      sql-dialect="POSTGRES"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
jooq {
  datasources {
    'default' {
      sqlDialect = "POSTGRES"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  jooq {
    datasources {
      default {
        sql-dialect = "POSTGRES"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "jooq": {
    "datasources": {
      "default": {
        "sql-dialect": "POSTGRES"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

### 6.2 配置其他提供程序 Bean

你可以定义附加 Bean，这些 Bean 将在创建 jOOQ `Configuration` 时使用。只有与数据源名称限定符相同的 bean 才会被使用。

Micronaut 将查找以下 Bean 类型：

- [Settings](https://www.jooq.org/javadoc/latest/org/jooq/conf/Settings.html)
- [TransactionProvider](https://www.jooq.org/javadoc/latest/org/jooq/TransactionProvider.html)
- [ConnectionProvider](https://www.jooq.org/javadoc/latest/org/jooq/ConnectionProvider.html)
- [ExecutorProvider](https://www.jooq.org/javadoc/latest/org/jooq/ExecutorProvider.html)
- [RecordMapperProvider](https://www.jooq.org/javadoc/latest/org/jooq/RecordMapperProvider.html)
- [RecordUnmapperProvider](https://www.jooq.org/javadoc/latest/org/jooq/RecordUnmapperProvider.html)
- [MetaProvider](https://www.jooq.org/javadoc/latest/org/jooq/MetaProvider.html)
- [ConverterProvider](https://www.jooq.org/javadoc/latest/org/jooq/ConverterProvider.html)
- [ExecuteListenerProvider](https://www.jooq.org/javadoc/latest/org/jooq/ExecuteListenerProvider.html)
- [RecordListenerProvider](https://www.jooq.org/javadoc/latest/org/jooq/RecordListenerProvider.html)
- [VisitListenerProvider](https://www.jooq.org/javadoc/latest/org/jooq/VisitListenerProvider.html)
- [TransactionListenerProvider](https://www.jooq.org/javadoc/latest/org/jooq/TransactionListenerProvider.html)
- [DiagnosticsListenerProvide](https://www.jooq.org/javadoc/latest/org/jooq/DiagnosticsListenerProvider.html)

### 6.3 使用 ObjectMapper 转换 JSON(B) 类型

如果你没有注册 [ConverterProvider](https://www.jooq.org/javadoc/latest/org/jooq/ConverterProvider.html) 类型的 bean 并提供以下配置，`JacksonConverterProvider` 将被使用，它使用 Micronaut 配置的 `ObjectMapper` 转换 JSON 和 JSONB 类型。

*配置 Micronaut Jackson 转换器*

```yaml
jooq:
    datasources:
        default:
            jackson-converter-enabled: true
```

## 6.4 GraalVM 本地镜像

要在本地镜像中使用 JOOQ，就必须为反射声明 `Record` 类。最简单的方法是配置 jOOQ，启用 `jpaAnnotations` 选项，用 JPA 注解来注解生成的类。这样 Micronaut 就能检测到它们，并自动生成 GraalVM 所需的反射配置。

例如，如果使用[此 gradle 插件](https://github.com/etiennestuder/gradle-jooq-plugin)，可以添加以下内容：

```groovy
jooq {
    devDb(sourceSets.main) {
        ...
        generator {
            ...
            generate {
                jpaAnnotations = true (1)
            }
        }
    }
}
```

1. 配置 jOOQ 以生成 JPA 注解。

在本地镜像中使用 [SimpleFlatMapper](https://simpleflatmapper.org/) 和 jOOQ 时也有内置支持。无需额外配置，只需添加 SimpleFlatMapper 依赖即可：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("org.simpleflatmapper:sfm-jdbc:8.2.3")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.simpleflatmapper</groupId>
    <artifactId>sfm-jdbc</artifactId>
    <version>8.2.3</version>
</dependency>
```

  </TabItem>
</Tabs>

更多信息，[参阅 jOOQ 文档](https://www.jooq.org/doc/latest/manual/code-generation/codegen-advanced/codegen-config-generate/codegen-generate-annotations)。

## 7. 配置 Jdbi

Micronaut 支持自动配置 Jdbi 库，以方便、习惯性地访问关系数据。

要配置 Jdbi 库，首先应将 `jdbi` 模块添加到类路径中：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.sql:micronaut-jdbi")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-jdbi</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后，你应该[配置一个或多个数据源](#3-配置-jdbc)。对于每个注册的 `DataSource`，Micronaut 将使用 [JdbiFactory](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/jdbi/JdbiFactory.html) 配置以下 Jdbi bean：

- [Jdbi](https://jdbi.org/apidocs/org/jdbi/v3/core/Jdbi.html) —— `Jdbi` 实例

如果使用的是 Spring 事务管理，它将额外创建以下 bean ：

- [SpringTransactionHandler](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/jdbi/spring/SpringTransactionHandler.html)，用于每个 Spring `PlatformTransactionManager`

### 7.1 配置其他提供程序 Bean

你可以定义其他 Bean，这些 Bean 将在创建 Jdbi 对象时使用。只有名称限定符名称与数据源名称相同的 Bean 才会被使用。

Micronaut 将查找以下 bean 类型：

- [TransactionHandler](https://jdbi.org/apidocs/org/jdbi/v3/core/transaction/TransactionHandler.html)
- [StatementBuilderFactory](https://jdbi.org/apidocs/org/jdbi/v3/core/statement/StatementBuilderFactory.html)
- [JdbiCustomizer](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/jdbi/JdbiCustomizer.html)

## 8. 配置响应式 MySQL 客户端

Micronaut 支持使用 vertx-mysql-client 连接到 MySQL 的响应式和非阻塞客户端，允许使用单线程处理多个数据库连接。

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 `vertx-mysql-client` 特性在项目中配置 MySQL Vertx 客户端：

```bash
$ mn create-app my-app --features vertx-mysql-client
```

:::

要配置 MySQL Vertx 客户端，首先应在类路径中添加 `vertx-mysql-client` 模块：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.sql:micronaut-vertx-mysql-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-vertx-mysql-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后，应在 application.yml 中配置要与之通信的 MySQL 服务器的 URI 或 MySQLConnectOptions、PoolOptions：

*application.yml*

```yaml
vertx:
	mysql:
	    client:
            port: 3306
            host: the-host
            database: the-db
            user: test
            password: test
            maxSize: 5
```

:::note 提示
你也可以使用 `uri` 而不是其他属性来连接 MySQL。
:::

完成上述配置后，就可以注入 `io.vertx.reactivex.mysqlclient.MySQLPool` bean。下面是最简单的连接方法：

```groovy
result = client.query('SELECT * FROM foo').rxExecute().map({ RowSet<Row> rowSet -> (1)
    RowIterator<Row> iterator = rowSet.iterator()
    int id = iterator.next().getInteger("id")
    return "id: ${id}"
}).blockingGet()
```

1. `client` 是 `io.vertx.reactivex.mysqlclient.MySQLPool` bean 的实例。

有关使用响应式客户端在 MySQL 上运行查询的更多信息，阅读 [vertx-mysql-client](https://vertx.io/docs/vertx-mysql-client/java/) 文档中的"运行查询"部分。

### 8.1 MySQL 健康检查

激活 `vertx-mysql-client` 模块后，[MySQLClientPoolHealthIndicator](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/vertx/mysql/client/health/MySQLClientPoolHealthIndicator.html) 将被激活，从而通过 `/health` 端点和 [CurrentHealthStatus](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/health/CurrentHealthStatus.html) 接口解析 MySQL 连接的健康状况。

支持的唯一配置选项是通过 `endpoints.health.vertx.mysql.client.enabled` 关键字启用或禁用指示器。

更多信息，参阅[健康端点](/core/management/providedEndpoints#1523-健康端点)章节。

## 9. 配置响应式 PostgreSQL 客户端

Micronaut 支持使用 [vertx-pg-client](https://github.com/eclipse-vertx/vertx-sql-client/blob/master/vertx-pg-client) 连接 PostgreSQL 的响应式非阻塞客户端，允许使用单线程处理多个数据库连接。

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 `vertx-pg-client` 特性在项目中配置 PostgreSQL Vertx 客户端：

```bash
$ mn create-app my-app --features vertx-pg-client
```

:::

要配置 PostgreSQL Vertx 客户端，应首先在类路径中添加 `vertx-pg-client` 模块：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.sql:micronaut-vertx-pg-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.sql</groupId>
    <artifactId>micronaut-vertx-pg-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后，应配置希望与之通信的 PostgreSQL 服务器的 URI 或 [PgConnectOptions](https://vertx.io/docs/vertx-pg-client/java/)、[PoolOptions](https://vertx.io/docs/vertx-pg-client/java/)：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
vertx.pg.client.port=3306
vertx.pg.client.host=the-host
vertx.pg.client.database=the-db
vertx.pg.client.user=test
vertx.pg.client.password=test
vertx.pg.client.maxSize=5
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
vertx:
  pg:
    client:
      port: 3306
      host: the-host
      database: the-db
      user: test
      password: test
      maxSize: 5
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[vertx]
  [vertx.pg]
    [vertx.pg.client]
      port=3306
      host="the-host"
      database="the-db"
      user="test"
      password="test"
      maxSize=5
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
vertx {
  pg {
    client {
      port = 3306
      host = "the-host"
      database = "the-db"
      user = "test"
      password = "test"
      maxSize = 5
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  vertx {
    pg {
      client {
        port = 3306
        host = "the-host"
        database = "the-db"
        user = "test"
        password = "test"
        maxSize = 5
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "vertx": {
    "pg": {
      "client": {
        "port": 3306,
        "host": "the-host",
        "database": "the-db",
        "user": "test",
        "password": "test",
        "maxSize": 5
      }
    }
  }
}
```

  </TabItem>
</Tabs>

:::note 提示
你也可以使用 `uri` 而不是其他属性来连接 PostgreSQL。
:::

完成上述配置后，就可以注入 `io.vertx.reactivex.pgclient.PgPool` bean。下面是最简单的连接方法：

```groovy
result = client.query('SELECT * FROM pg_stat_database').rxExecute().map({ RowSet<Row> rowSet -> (1)
    int size = 0
    RowIterator<Row> iterator = rowSet.iterator()
    while (iterator.hasNext()) {
        iterator.next()
        size++
    }
    return "Size: ${size}"
}).blockingGet()
```

1. `client` 是 `io.vertx.reactivex.pgclient.PgPool` bean 的实例。

有关使用响应式客户端在 Postgres 上运行查询的更多信息，阅读 [vertx-pg-client](https://vertx.io/docs/vertx-pg-client/java/) 文档中的"运行查询"部分。

### 9.1 PostgreSQL 健康检查

当 `vertx-pg-client` 模块被激活时，[PgClientPoolHealthIndicator](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/configuration/vertx/pg/client/health/PgClientPoolHealthIndicator.html) 会被激活，导致 `/health` 端点和 [CurrentHealthStatus](https://micronaut-projects.github.io/micronaut-sql/latest/api/io/micronaut/health/CurrentHealthStatus.html) 接口解析 Postgres 连接的健康状况。

唯一支持的配置选项是通过 `endpoints.health.vertx.pg.client.enabled` 关键字启用或禁用该指示器。

更多信息，参阅[健康端点](/core/management/providedEndpoints#1523-健康端点)章节。

## 10. 仓库

你可以在此仓库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-sql

> [英文链接](https://micronaut-projects.github.io/micronaut-sql/latest/guide/#introduction)

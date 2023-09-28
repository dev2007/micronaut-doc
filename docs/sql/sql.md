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

您还需要在类路径中添加 JDBC 驱动程序依赖关系。例如，添加 [H2 内存数据库](http://www.h2database.com/)：

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

## 3.2 配置多个数据源

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

> [英文链接](https://micronaut-projects.github.io/micronaut-sql/latest/guide/#introduction)

---
description: Micronaut MongoDB
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut MongoDB,MongoDB,redis,nosql]
---

# Micronaut MongoDB

Micronaut 和 MongoDB 之间的集成。

## 1. 简介

本项目包括 Micronaut 与 MongoDB 之间的集成。

请注意，本项目仅提供对 MongoDB 客户端驱动程序（同步和反应式）的底层访问。如果你正在寻找更完整的体验，包括对数据访问存储库的支持，请
参阅 [Micronaut Data MongoDB](/data/mongo) 文档以及这些有用的指南：

- [了解如何使用 Micronaut Data 和 MongoDB Sync 驱动程序访问 MongoDB 数据库。](https://micronaut-projects.github.io/micronaut-data/latest/guide/#mongo)
- [了解如何使用 Micronaut Data 异步访问 MongoDB 数据库。](https://guides.micronaut.io/latest/micronaut-data-mongodb-asynchronous.html)

## 2. 发布历史

关于此项目，你可以在此处找到版本列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-mongodb/releases

## 3. 重大更改

**版本 5.0.0**

已移除对使用 `flapdoodle` 进行测试的支持。请按照 [MongoDB 和测试](#6-mongodb-和测试)中的说明使用 `test-containers` 代替。

## 4. 设置 Mongo 驱动程序

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请提供 `mongo-reactive` 功能，以便在项目中配置本地 MongoDB 驱动程序：

```bash
$ mn create-app my-app --features mongo-reactive
```
:::

Micronaut 包含一个自动配置本地 MongoDB Java 驱动的配置。要使用该配置，请在应用程序中添加以下依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

然后在 `application.yml` 中配置 MongoDB 服务器的 URI：

*配置 MongoDB 服务器*

```yaml
mongodb:
    uri: mongodb://username:password@localhost:27017/databaseName
```

:::note 提示
`mongodb.uri` 遵循 [MongoDB 连接字符串](https://docs.mongodb.com/manual/reference/connection-string)格式。
:::

这样，一个非阻塞的响应式流 [MongoClient](http://mongodb.github.io/mongo-java-driver-reactivestreams/1.8/javadoc/com/mongodb/reactivestreams/client/MongoClient.html) 就可以用于依赖注入了。

要使用阻塞式驱动程序，请在应用程序中添加一个依赖关系到 `micronaut-mongo-sync` 模块。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.mongodb:micronaut-mongo-sync")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.mongodb</groupId>
    <artifactId>micronaut-mongo-sync</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后，阻塞的 [MongoClient](https://mongodb.github.io/mongo-java-driver/4.0/apidocs/com/mongodb/client/MongoClient.html) 将可用于注入。

**在 MongoDB 中使用 GORM**

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 mongo-gorm 功能在项目中使用 GORM 版 MongoDB：

```bash
$ mn create-app my-app --features mongo-gorm
```

:::

对于 Groovy 用户和熟悉 Grails 的用户，Micronaut 已为使用 [GORM 版 MongoDB](http://gorm.grails.org/latest/mongodb/manual)。 添加了特殊支持。

要添加对 GORM 版 MongoDB 支持，首先要按照本指南前面的说明配置 MongoDB 连接，然后在应用程序中添加以下依赖：

*build.gradle*

```groovy
compile "io.micronaut.configuration:micronaut-mongo-gorm"
```

:::caution 警告
对于适用于 GORM 版 MongoDB，你需要在 `application.yml` 中将数据库名称单独配置为 `grails.mongodb.databaseName` 属性。
:::

在 Micronaut 中使用 GORM 版 MongoDB 时应注意以下几点：
- 希望成为 GORM 实体的每个类都应使用 `grails.gorm.annotation.Entity` 注解。
- 与 GORM 交互的每个方法都应注解为 GORM 的 `grails.gorm.transactions.Transactional`，以确保会话的存在。你也可以在类中添加 `@Transactional` 注解。
- 默认情况下，Micronaut 会扫描与应用程序类相关的实体。如果你希望自定义，可在启动应用程序时通过 [ApplicationContextBuilder](https://micronaut-projects.github.io/micronaut-mongodb/latest/api/io/micronaut/context/ApplicationContextBuilder.html) 指定其他软件包。

## 5. 配置 Mongo 驱动

阻塞客户端和非阻塞客户端的配置选项在驱动程序级别有所不同。

要配置阻塞客户端选项，可以使用 `mongodb.options` 设置，该设置允许你配置 `MongoClientOptions.Builder` 类的任何属性。例如，在 `application.yml` 中：

**配置阻塞驱动选项**

```yaml
mongodb:
    ...
    options:
        maxConnectionIdleTime: 10000
        readConcern: majority
```

有关可用配置选项的更多信息，参阅 [DefaultMongoConfiguration](https://micronaut-projects.github.io/micronaut-mongodb/latest/api/io/micronaut/configuration/mongo/reactive/DefaultMongoConfiguration.html) 的 API。

对于 Reactive 驱动程序，[DefaultReactiveMongoConfiguration](https://micronaut-projects.github.io/micronaut-mongodb/latest/api/io/micronaut/configuration/mongo/reactive/DefaultReactiveMongoConfiguration.html) 提供了配置响应流驱动的选项。例如：

*配置响应流驱动程*

```yaml
mongodb:
    ...
    cluster:
        maxWaitQueueSize: 5
    connectionPool:
        maxSize: 20
```

**多个 MongoDB 驱动**

可以使用 mongodb.servers 设置创建多个 MongoDB 连接。例如，在 `application.yml`：

*配置多个 MongoDB 驱动*

```yaml
mongodb:
    servers:
        another:
            uri: mongodb://localhost:27018
```

有了上述配置，你就可以使用名称 `another` 注入一个 `MongoClient`：

```java
import com.mongodb.reactivestreams.client.*;
import jakarta.inject.*;
...
@Inject @Named("another") MongoClient mongoClient;
```

**MongoDB 健康检查**

当 `mongo-reactive` 模块被激活时，[MongoHealthIndicator](https://micronaut-projects.github.io/micronaut-mongodb/latest/api/io/micronaut/configuration/mongo/reactive/health/MongoHealthIndicator.html) 会被激活，从而产生 `/health` 端点和 [CurrentHealthStatus](https://micronaut-projects.github.io/micronaut-mongodb/latest/api/io/micronaut/health/CurrentHealthStatus.html) 接口，用于解析 MongoDB 连接的健康状况。

更多信息，参阅[健康端点](/core/management/providedEndpoints#1523-健康端点)部分。

## 6. MongoDB 和测试

[Micronaut 测试资源](/testresources/modules#45-MongoDB)中的 MongoDb 支持（使用 Java 的 Testcontainers 库）是测试 Mongo 交互的推荐方法。

另外，也可直接使用 [Java Testcontainers](https://www.testcontainers.org/) 测试 Mongo 交互。对于 Spock 测试，这只是一个简单的问题：

```groovy
@Shared @AutoCleanup GenericContainer mongo =
        new GenericContainer("mongo:4.0")
                .withExposedPorts(27017)

def setupSpec() {
    mongo.start()
}
```

## 7. 仓库

你可以在此仓库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-mongodb

> [英文链接](https://micronaut-projects.github.io/micronaut-mongodb/latest/guide/)

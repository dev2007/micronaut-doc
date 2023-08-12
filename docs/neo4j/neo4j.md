# Micronaut Neo4j

Micronaut 和 Neo4j 之间的集成。

## 1. 简介

本项目包括 Micronaut Framework 和 Neo4j 之间的集成。

## 2. 发布历史

你可以在这里找到这个项目的发布列表（包含发布说明）：

https://github.com/micronaut-projects/micronaut-neo4j/releases

## 3. 设置 Neo4j Bolt 驱动

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 neo4j-bolt 功能在项目中配置 Neo4j Bolt 驱动：

```bash
$ mn create-app my-app --features neo4j-bolt
```
:::

要配置 Neo4j Bolt 驱动，首先应将 `neo4j-bolt` 模块添加到 classpath 中：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-neo4j-bolt:6.0.1")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-neo4j-bolt</artifactId>
    <version>6.0.1</version>
</dependency>
```

  </TabItem>
</Tabs>

然后，在 `application.yml` 中配置希望与之通信的 Neo4j 服务器的 URI：

*配置 neo4j.uri*

```yaml
neo4j:
    uri: bolt://localhost
```

:::note 提示
`neo4j.uri` 设置应采用 Neo4j 文档中[连接 URI](https://neo4j.com/docs/developer-manual/current/drivers/client-applications/#driver-connection-uris) 部分所描述的格式。
:::

一旦完成上述配置，就可以注入 `org.neo4j.driver.v1.Driver` bean 的实例，该实例具有同步阻塞 API 和基于 `CompletableFuture` 的非阻塞 API。

**Neo4j 健康检查**

当 `micronaut-neo4j-bolt` 模块被激活时，[Neo4jHealthIndicator](https://micronaut-projects.github.io/micronaut-neo4j/latest/api/io/micronaut/neo4j/bolt/health/Neo4jHealthIndicator.html) 就会被激活，从而产生 `/health` 端点和 [CurrentHealthStatus](https://docs.micronaut.io/latest/api/io/micronaut/health/CurrentHealthStatus.html) 接口，用于解析 Neo4j 连接的健康状况。

更多信息，参阅[健康端点](/core/management/providedEndpoints#1523-健康端点)部分。

## 4. 配置 Neo4j Bolt 驱动

可以使用 [Neo4jBoltConfiguration](https://micronaut-projects.github.io/micronaut-neo4j/latest/api/io/micronaut/neo4j/bolt/Neo4jBoltConfiguration.html) 类进一步自定义配置的所有选项。

[Neo4jBoltConfiguration](https://micronaut-projects.github.io/micronaut-neo4j/latest/api/io/micronaut/neo4j/bolt/Neo4jBoltConfiguration.html) 还公开了 `org.neo4j.driver.v1.Config.ConfigBuilder` 类的所有选项。

下面是一个配置示例：

*自定义 Bolt 配置*

```yaml
neo4j:
    uri: bolt://localhost
    maxConnectionPoolSize: 50
    connectionAcquisitionTimeout: 30s
```

:::note 提示
你还可以创建一个 [BeanCreatedEventListener](https://docs.micronaut.io/latest/api/io/micronaut/context/event/BeanCreatedEventListener.html) Bean，并监听 [Neo4jBoltConfiguration](https://micronaut-projects.github.io/micronaut-neo4j/latest/api/io/micronaut/configuration/neo4j/bolt/Neo4jBoltConfiguration.html) 的创建，从而进一步以编程方式自定义配置。
:::

## 5. Neo4j 和测试

通过对 Neo4j 测试工具的依赖，可以嵌入 Neo4j 进行测试：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
testImplementation("org.neo4j.test:neo4j-harness")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.neo4j.test</groupId>
    <artifactId>neo4j-harness</artifactId>
    <scope>test</scope>
</dependency>
```

  </TabItem>
</Tabs>

Neo4j test harness 还需要运行时依赖 `javax.annotation` 和 `javax.validation`：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
testRuntimeOnly("javax.annotation:javax.annotation-api:1.3.2")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>javax.annotation</groupId>
    <artifactId>javax.annotation-api</artifactId>
    <version>1.3.2</version>
    <scope>test</scope>
</dependency>
```

  </TabItem>
</Tabs>


<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
testRuntimeOnly("javax.validation:validation-api:2.0.1.Final")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
    <version>2.0.1.Final</version>
    <scope>test</scope>
</dependency>
```

  </TabItem>
</Tabs>

如果 Neo4j 服务器尚未在配置的端口上运行，则将启动嵌入式版本。

你可以使用 [Neo4jBoltConfiguration](https://micronaut-projects.github.io/micronaut-neo4j/latest/api/io/micronaut/neo4j/bolt/Neo4jBoltConfiguration.html) 提供的 `neo4j.embedded` 设置来配置嵌入式 Neo4j 服务器的选项。

其中一个有用的选项是 `ephemeral`，它能确保在测试运行之间清理数据。例如在 `application-test.yml` 中：

*使用 ephemeral*

```yaml
neo4j:
    embedded:
        ephemeral: true
```

## 6. 版本矩阵

- Micronaut Neo4j 6.x 使用 Neo4j Java Driver 5.x，它增加了对 Java 17 运行时版本的支持。要在 Micronaut 框架项目中使用它，版本不是必需的，因为 BOM 已经暴露了这一点。

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

- Micronaut Neo4j 5.x 使用 Neo4j 3.x。它支持 Java 8 和 11 运行时版本。要在 Micronaut Framework 项目中使用它，依赖关系需要指定 micronaut-neo4j-bolt 版本。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-neo4j-bolt:5.2.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-neo4j-bolt</artifactId>
    <version>5.2.0</version>
</dependency>
```

  </TabItem>
</Tabs>


## 7. 重大变更

本节记录 Micronaut Neo4J 版本之间的重大变更：

**Micronaut Neo4J 6.0.1**

Micronaut Neo4J 是基于 Neo4j 5.x 的，它与 Micronaut Neo4J 以前版本使用的 Neo4j 3.5.x 有重大变更。

欲了解更多信息，参阅以下 Neo4j 指南：

- [Neo4j 升级和迁移指南](https://neo4j.com/docs/upgrade-migration-guide/current/)

- [Neo4j 3.5与 Neo4j 4.x 之间的突破性变化](https://neo4j.com/docs/upgrade-migration-guide/current/migration/surface-changes/)

- [Neo4j 4.4 与 Neo4j 5.x 之间的重大变更](https://neo4j.com/docs/upgrade-migration-guide/current/version-5/migration/breaking-changes/)

Neo4J Java 驱动 5.x 增加了对 Java 17 的兼容性

- Neo4jBoltConfiguration 使用的 `GraphDatabase.routingDriver()` 方法在 Neo4J 4.4.x 中被弃用，并在 5.x 中被移除。因此，Neo4jBoltConfiguration 现在只接受一个 URI，而之前它接受一个列表作为选项。更多信息，参阅 Neo4J [初始地址解析](https://neo4j.com/docs/javascript-manual/current/client-applications/#js-initial-address-resolution)指南

Neo4J Harness 5.x 增加了对 Java 17 的兼容性

*build.gradle*

```groovy
test {
    jvmArgs = ['--add-opens', 'java.base/java.nio=ALL-UNNAMED']
}
```

从 Micronaut Framework 4.0.0 开始，Neo4j Harness 需要运行时依赖 `javax.annotation` 和 `javax.validation`

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
testRuntimeOnly("javax.annotation:javax.annotation-api:1.3.2")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>javax.annotation</groupId>
    <artifactId>javax.annotation-api</artifactId>
    <version>1.3.2</version>
    <scope>test</scope>
</dependency>
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
testRuntimeOnly("javax.validation:validation-api:2.0.1.Final")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
    <version>2.0.1.Final</version>
    <scope>test</scope>
</dependency>
```

  </TabItem>
</Tabs>

## 8. 仓库

你可以在此仓库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-neo4j

> [英文链接](https://micronaut-projects.github.io/micronaut-neo4j/latest/guide/)

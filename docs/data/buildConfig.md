---
sidebar_position: 20
---

# 2. 构建配置

由于 Micronaut Data 是一个构建时间工具，除非正确配置构建，否则它将无法正常工作。

Micronaut Data 有两个重要方面：

1. 构建时注解处理器
2. 运行时 API

在 Gradle 或 Maven 的注解处理器配置中添加 `micronaut-data-processor` 模块，即可添加构建时处理器：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

对于 [MongoDB](/data/mongo) 或 [Azure Cosmos Data](/data/azureCosmos) 等文档数据库，你需要使用：

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

您可以使用 Micronaut Launch 创建一个预配置项目：

||Gradle|Maven|
|--|--|--|
|Java|[打开](https://micronaut.io/launch?features=data-jdbc&lang=JAVA&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-jdbc&lang=JAVA&build=MAVEN)|
|Kotlin|[打开](https://micronaut.io/launch?features=data-jdbc&lang=KOTLIN&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-jdbc&lang=KOTLIN&build=MAVEN)|
|Groovy|[打开](https://micronaut.io/launch?features=data-jdbc&lang=GROOVY&build=GRADLE)|[打开](https://micronaut.io/launch?features=data-jdbc&lang=GROOVY&build=MAVEN)|

**Micronaut Data 和 Lombok**

如果你打算将 Lombok 与 Micronaut Data 结合使用，那么你必须在构建配置中将 Lombok 注解处理器放在 Micronaut 处理器**之前**，因为 Micronaut 需要看到 Lombok 应用于 AST 的突变。

:::caution 警告
不支持 Lombok 插件（如 Gradle 插件 `io.franzbecker.gradle-lombok`），因为它们放置注解处理器的顺序不正确。
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-data/latest/guide/#buildConfig)

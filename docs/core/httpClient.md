---
sidebar_position: 70
---

# 7. Http 客户端

:::note 提示
*使用 CLI*

如果你使用 Micronaut CLI 创建你的项目，`http-client` 的依赖是默认包含的。
:::

微服务之间的客户端通信是任何微服务架构的一个重要组成部分。考虑到这一点，Micronaut 包括一个 HTTP 客户端，它有一个低级别的 API 和一个高级别的 AOP 驱动的 API。

:::note 提示
无论你是否选择使用 Micronaut 的 HTTP 服务器，你可能希望在你的应用程序中使用 Micronaut HTTP 客户端，因为它是一个功能丰富的客户端实现。
:::

要使用 HTTP 客户端，请将 `http-client` 依赖性加到你的构建中：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-http-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-http-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

由于高级 API 是建立在低级 HTTP 客户端上的，所以我们首先介绍低级的客户端。

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#httpClient)

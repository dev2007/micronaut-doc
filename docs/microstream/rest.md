---
sidebar_position: 110
---

# 11. REST API

MicroStream 存储不是一个典型的带有管理工具的数据库服务器，它是一个嵌入应用程序中运行的纯 java 持久性引擎。在开发 MicroStream 应用程序时，能够检查当前存储中的图形是很有用的。

`micronaut-microstream-res` 库从 Micronaut 应用程序内部公开 [MicroStream REST API](https://docs.microstream.one/manual/storage/rest-interface/rest-api.html)。

## 11.1 启用 REST API

要启用它，请将以下依赖项添加到你的应用程序中。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
developmentOnly("io.micronaut.microstream:micronaut-microstream-rest")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.microstream</groupId>
    <artifactId>micronaut-microstream-rest</artifactId>
    <scope>provided</scope>
</dependency>
```

  </TabItem>
</Tabs>

你还需要在配置中启用它，因为为了安全起见，它在默认情况下是禁用的。

*src/main/resources/application.yml*

```yaml
microstream:
  rest:
    enabled: true
```

如果 REST 端点已启用，则每次启动应用程序时，它都会输出一条警告，说明不应将其部署到生产环境中。

## 11.2 配置属性

默认 API 路径为 `/microstream`。

:::tip 注意
当定义了多个存储管理器时，URL 必须以管理器名字 `/microstream/«storage-name»` 作为后缀。
:::

此前缀可以通过配置进行配置。

*src/main/resources/application.yml*

```yaml
microstream:
  rest:
    path: custom-prefix
```

上述配置将在 `/custom-prefix` 处暴露 REST API。（或者，如果你定义了多个存储管理器，则为 `/custom-prefix/«storage-name»`）

## 11.3 GUI

与此 REST API 交互的最简单方法是使用 MicroStream 客户端 GUI。

有关下载和运行此程序的说明可以在[此处找到](https://docs.microstream.one/manual/storage/rest-interface/client-gui.html)。

> [英文链接](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/guide/index.html#rest)

---
sidebar_position: 60
---

# 6. HTTP 服务器

:::note 提示
*使用 CLI*
如果使用 Micronaut CLI `create-app` 命令创建项目，则默认情况下会包含 `http-server` 依赖。
:::

Micronaut 包括基于 [Netty](https://netty.io/) 的非阻塞 HTTP 服务器和客户端 API。

Micronaut 中 HTTP 服务器的设计针对微服务之间的消息交换进行了优化，通常采用 JSON，而不是作为一个完整的服务器端 MVC 框架。例如，目前不支持服务器端视图或传统服务器端 MVC 框架的典型功能。

HTTP 服务器的目标是尽可能容易地公开 HTTP 客户端使用的 API，无论它们是用什么语言编写的。要使用 HTTP 服务器，你需要在构建中使用  `http-server-netty` 依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-http-server-netty")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-http-server-netty</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

以下为一个“Hello World”服务器应用程序：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

@Controller("/hello") // (1)
public class HelloController {

    @Get(produces = MediaType.TEXT_PLAIN) // (2)
    public String index() {
        return "Hello World"; // (3)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get

@Controller('/hello') // (1)
class HelloController {

    @Get(produces = MediaType.TEXT_PLAIN) // (2)
    String index() {
        'Hello World' // (3)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get

@Controller("/hello") // (1)
class HelloController {

    @Get(produces = [MediaType.TEXT_PLAIN]) // (2)
    fun index(): String {
        return "Hello World" // (3)
    }
}
```

  </TabItem>
</Tabs>

1. 类被定义为控制器，其中 [@controller](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Controller.html) 注解映射到路径 `/hello`
2. 该方法响应对 `/hello` 的 GET 请求，并返回一个 `text/plain` 类型的响应
3. 通过定义一个名为 `index` 的方法，按照惯例，该方法通过 `/hello` URI 暴露

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#httpServer)

---
description: Micronaut Reactor
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut Reactor,Reactor,响应式编程,反应式编程]
---

# Micronaut Reactor

Micronaut 和 Reactor 之间的集成。

## 1. 简介

Micronaut Reactor 为 Micronaut 2.x 应用程序添加了对 Project Reactor 的支持。如果你使用的是 Micronaut 1.x，则不需要此模块。
- Reactor 类型的转换器，以便在控制器和客户端中使用 Reactor 类型。
- 用于 Reactor 类型的仪表，以便对 Reactor 类型进行跟踪
- 支持 Reactor 的 Http 客户端版本

## 2. 发布历史

关于此项目，你可以在此处找到版本列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-reactor/releases

## 3. 重大变更

### 3.0.0

**Reactor Http 客户端**

Reactor Http 客户端改为返回 `Mono<HttpResponse<O>>` 而非 `Flux<HttpResponse<O>>`。这在语义上更为正确，因为每个请求只能有一个响应。

## 4. 快速开始

在 Micronaut 应用程序中添加以下依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.reactor:micronaut-reactor")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.reactor</groupId>
    <artifactId>micronaut-reactor</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

要使用 HTTP 客户端，请添加以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.reactor:micronaut-reactor-http-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.reactor</groupId>
    <artifactId>micronaut-reactor-http-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

要使用 Micronaut HTTP 客户端的 Reactor 变体，请注入 [ReactorHttpClient](https://micronaut-projects.github.io/micronaut-reactor/latest/api/io/micronaut/reactor/http/client/ReactorHttpClient.html) 接口（或其他变体）。例如：

```java
import io.micronaut.reactor.http.client.*;

@Inject ReactorHttpClient httpClient; // regular client
@Inject ReactorSseClient sseClient; // server sent events
@Inject ReactorStreamingHttpClient streamingClient; // streaming
```

## 5. 仓库

你可以在此资源库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-reactor

> [英文链接](https://micronaut-projects.github.io/micronaut-reactor/latest/guide/)

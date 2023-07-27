---
sidebar_position: 10
---

# 12.1 用于响应式编程的配置

Micronaut 内部使用 [Project Reactor](https://projectreactor.io/)。不过，要在控制器和/或 HTTP 客户端方法中使用 Reactor 或其他反应式库（如 RxJava）类型，需要包含依赖关系。

## 12.1.1 支持 Reactor

要添加对 Reactor 的支持，请添加以下模块：

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

要使用 Reactor HTTP 客户端，请添加以下依赖：

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

更多信息，参阅 [Micronaut Reactor](/reactor.html) 文档。

## 12.1.2 RxJava 3 支持

要添加对 RxJava 3 的支持，请添加以下模块：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.rxjava3:micronaut-rxjava3")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.rxjava3</groupId>
    <artifactId>micronaut-rxjava3</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

要使用 RxJava 3 HTTP 客户端，请添加以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.rxjava2:micronaut-rxjava2-http-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.rxjava3</groupId>
    <artifactId>micronaut-rxjava3-http-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

更多信息，参阅 [Micronaut RxJava 3](/rxjava/rxjava3.html) 文档。

## 12.1.3 RxJava 2 支持

要添加对 RxJava 2 的支持，请添加以下模块：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.rxjava2:micronaut-rxjava2")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
implementation("io.micronaut.rxjava2:micronaut-rxjava2")
```

  </TabItem>
</Tabs>

要使用 RxJava 2 HTTP 客户端，请添加以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.rxjava2:micronaut-rxjava2-http-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.rxjava2</groupId>
    <artifactId>micronaut-rxjava2-http-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

更多信息，参阅 [Micronaut RxJava 2](/rxjava/rxjava2.html) 文档。

## 12.1.4 RxJava 1 支持

可通过以下模块添加对 RxJava 1 的传统支持：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.rxjava1:micronaut-rxjava1")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.rxjava1</groupId>
    <artifactId>micronaut-rxjava1</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

更多信息，参阅 [Micronaut RxJava1](/rxjava/rxjava1.html) 文档。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#reactiveConfigs)

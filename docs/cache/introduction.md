---
description: Micronaut 缓存
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut 缓存,缓存,cache,redis,jcache,microstream,infinispan,hazelcast,ehcache]

sidebar_position: 10
---

# 1. 介绍

该项目为 Micronaut 带来了额外的缓存实现。

要开始，你需要声明以下依赖项：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.cache:micronaut-cache-core")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.cache</groupId>
    <artifactId>micronaut-cache-core</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

:::tip 注意
该模块中的配置实现至少需要 Micronaut 1.3.0 版本。每个实现都是一个单独的依赖项。
:::

要使用此库的 `BUILD-SNAPSHOT` 版本，查看[使用快照文档](../core/appendix.html#203-使用快照)。

> [英文链接](https://micronaut-projects.github.io/micronaut-cache/3.5.0/guide/index.html#introduction)

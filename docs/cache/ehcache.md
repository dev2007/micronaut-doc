---
sidebar_position: 60
---

# 6. Ehcache 支持

要使用 [Ehcache](https://www.ehcache.org/) 作为缓存实现，请将其作为应用程序的依赖项添加：

:::tip 注意
此模块使用 Ehcache {ehcacheVersion} 进行构建和测试。
:::

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.cache:micronaut-cache-ehcache:3.5.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.cache</groupId>
    <artifactId>micronaut-cache-ehcache</artifactId>
    <version>3.5.0</version>
</dependency>
```

  </TabItem>
</Tabs>

要让 Micronaut 创建缓存，最简洁配置为：

```yaml
ehcache:
  caches:
    my-cache:
      enabled: true
```

然后，你可以使用任何缓存注解，并将 `my-cache` 作为缓存名称。

参阅配置参考以检查所有可能的配置选项。

## 分层选项

Ehcache 支持[分层缓存](https://www.ehcache.org/documentation/3.8/tiering.html)的概念。此库允许你在每个缓存的基础上配置分层缓存选项。

如果没有显式配置层，则缓存将配置为最多 100 个条目的堆层。

**堆层**

它可以根据条目的数量进行调整：

```yaml
ehcache:
  caches:
    my-cache:
      heap:
        max-entries: 5000
```

或按大小：

```yaml
ehcache:
  caches:
    my-cache:
      heap:
        max-size: 200Mb
```

**堆外层**

```yaml
ehcache:
  caches:
    my-cache:
      offheap:
        max-size: 1Gb
```

不要忘记在 java 选项中定义 `-XX:MaxDirectMemorySize` 选项，根据你打算使用的堆外大小。

**磁盘层**

```yaml
ehcache:
  storage-path: /var/caches
  caches:
    my-cache:
      disk:
        max-size: 10Gb
```

**集群层**

Ehcache 支持 [Terracotta](http://www.terracotta.org/) 的分布式缓存。

这是一个完整的配置示例：

```yaml
ehcache:
  cluster:
    uri: terracotta://localhost/my-application
    default-server-resource: offheap-1
    resource-pools:
      resource-pool-a:
        max-size: 8Mb
        server-resource: offheap-2
      resource-pool-b:
        max-size: 10Mb
  caches:
    clustered-cache:
      clustered-dedicated:
        server-resource: offheap-1
        max-size: 8Mb
    shared-cache-1:
      clustered-shared:
        server-resource: resource-pool-a
    shared-cache-3:
      clustered-shared:
        server-resource: resource-pool-b
```

**多层设置**

缓存可以配置为具有多个层。阅读有关有效配置选项的 [Ehcache 文档](https://www.ehcache.org/documentation/3.8/tiering.html#multiple-tier-setup)。

例如，要配置堆+堆外+磁盘缓存：

```yaml
ehcache:
  storage-path: /var/caches
  caches:
    my-cache:
      heap:
        max-size: 200Mb
      offheap:
        max-size: 1Gb
      disk:
        max-size: 10Gb
```



> [英文链接](https://micronaut-projects.github.io/micronaut-cache/3.5.0/guide/index.html#ehcache)

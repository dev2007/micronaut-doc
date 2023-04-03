---
sidebar_position: 30
---

# 3. 缓存抽象

与 Spring 和 Grails 类似，Micronaut 在 [io.Micronaut.cache](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/package-summary.html) 包中提供了一组缓存注解。

[CacheManager](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/CacheManager.html) 接口允许根据需要插入不同的缓存实现。

[SyncCache](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/SyncCache.html) 接口提供用于缓存的同步 API，而 [AsyncCache](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/AsyncCache.html) API 允许非阻塞操作

## 缓存注解

支持以下缓存注解：

- [@Cacheable](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/annotation/Cacheable.html)——表示方法在给定的缓存名称内是可缓存的
- [@CachePut](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/annotation/CachePut.html)——指示应该缓存方法调用的返回值。与@Cacheable不同的是，从未跳过原始操作。
- [@CacheInvalidate](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/annotation/CacheInvalidate.html)——指示方法的调用应导致一个或多个缓存失效。

通过使用其中一个注解，[CacheInterceptor](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/interceptor/CacheInterceptor.html) 被激活，在 `@Cacheable` 的情况下，它将缓存方法的返回结果。

如果方法的返回类型是非阻塞类型（[CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html) 或 [Publisher](https://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 的实例），则将缓存发出的结果。

此外，如果底层缓存实现支持非阻塞缓存操作，则将在不阻塞的情况下从缓存中读取缓存值，从而能够实现完全非阻塞的缓存操作。

## 使用 Caffeine 缓存

要使用 [Caffeine](https://github.com/ben-manes/caffeine) 进行缓存，请在应用程序中添加以下依赖项：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.cache:micronaut-cache-caffeine")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.cache</groupId>
    <artifactId>micronaut-cache-caffeine</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后配置一个或多个缓存。例如 `application.yml`：

*缓存配置示例*

```yaml
micronaut:
    caches:
        my-cache:
            maximumSize: 20
```

上面的例子将配置一个名为“my-cache”的缓存，最大大小为 20。

```yaml
micronaut:
    caches:
        my-cache:
            listen-to-removals: true
            listen-to-evictions: true
```

这个例子是一个带有删除/驱逐侦听器的缓存。为了能够使用它们，只需实现 `com.github.benmanes.caffeine.cache.RemovalListener` 接口，如示例所示。

```java
@Singleton
public class RemovalListenerImpl implements RemovalListener<K, V> {

    @Override
    public void onRemoval(
            @Nullable K key,
            @Nullable V value,
            @NonNull RemovalCause cause
    ) {
    }
}
```

:::tip 注意
*命名缓存*

`micronaut.caches` 下的缓存名称应以烤串风格（小写和连字符分隔）定义，如果使用驼峰风格，则名称将标准化为烤串风格。例如，指定  `myCache` 将成为 `my-cache`。引用 [@Cacheable](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/annotation/Cacheable.html) 注解中的缓存时，应使用烤串风格。
:::

要将权重配置为与 `maximumWeight` 配置一起使用，请创建一个实现 `com.github.benmanes.caffeine.cache.weigher` 的 bean。要将给定的秤仅与特定的缓存关联，请使用 `@Named(<cache name>)` 注解 bean。没有命名限定符的权重将应用于所有没有命名权重的缓存。如果没有找到 bean，则将使用默认实现。

> [英文链接](https://micronaut-projects.github.io/micronaut-cache/3.5.0/guide/index.html#cache-abstraction)

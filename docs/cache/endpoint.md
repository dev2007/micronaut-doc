---
sidebar_position: 110
---

# 11. 端点

缓存端点返回有关应用程序中缓存的信息，并允许使其无效。

要使用此端点，你需要以下依赖项：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.cache:micronaut-cache-management")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.cache</groupId>
    <artifactId>micronaut-cache-management</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

另请注意，它在默认情况下是禁用的。要启用它：

```yaml
endpoints:
    caches:
        enabled: true
```

要按名称及其配置获取所有缓存的集合，请向 /caches 发送 GET 请求。

```bash
$ curl http://localhost:8080/caches
```

要获得特定缓存的配置，请在 GET 请求中包含缓存名称。例如，要访问缓存“book-cache”的配置：

```bash
$ curl http://localhost:8080/caches/book-cache
```

要使单个缓存中的特定缓存条目无效，请向具有所需密钥的命名缓存 URL 发送 DELETE 请求。

:::tip 注意
这只适用于具有 `String` 类型键的缓存。
:::

```bash
$ curl -X DELETE http://localhost:8080/caches/book-cache/key
```

要使单个缓存中的所有缓存值无效，请向命名的缓存 URL 发送 DELETE 请求。

```bash
$ curl -X DELETE http://localhost:8080/caches/book-cache
```

要使所有缓存无效，请向 /caches 发送 DELETE 请求。

```bash
$ curl -X DELETE http://localhost:8080/caches
```

## 配置

要配置缓存端点，请通过 `endpoints.caches` 提供配置。

*缓存端点配置示例*

```yaml
endpoints:
  caches:
    enabled: Boolean
    sensitive: Boolean
```

:::tip 注意
有关详细信息，参阅用户指南中关于[内置端点](https://docs.micronaut.io/latest/guide/index.html#providedEndpoints)的部分。
:::

---

## 自定义

缓存端点由缓存数据收集器和缓存数据实现组成。缓存数据收集器（[CacheDataCollector](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/management/endpoint/caches/CacheDataCollector.html)）负责返回一个发布服务器，该发布服务器将返回响应中使用的数据。缓存数据（[CacheData](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/management/endpoint/caches/CacheData.html)）负责返回有关单个缓存的数据。

要覆盖任何一个助手类的默认行为，请扩展默认实现（[RxJavaRouteDataCollector](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/management/endpoint/caches/impl/RxJavaCacheDataCollector.html)、[DefaultRouteData](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/management/endpoint/caches/impl/DefaultCacheData.html)），或者直接实现相关接口。为了确保使用你的实现而不是默认实现，请将 [@Replaces](https://micronaut-projects.github.io/micronaut-core/latest/api/io/micronaut/context/annotation/Replaces.html) 注解添加到你的类中，该值为默认实现。

> [英文链接](https://micronaut-projects.github.io/micronaut-cache/3.5.0/guide/index.html#endpoint)

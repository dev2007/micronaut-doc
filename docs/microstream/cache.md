---
sidebar_position: 80
---

# 8. 缓存

MicroStream 可以用作[缓存抽象](../cache/cache-abstraction.html)层。

## 8.1 缓存配置

要使用 MicroStream 缓存抽象，必须声明依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-microstream-cache")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-microstream-cache</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后，你可以通过向应用程序添加以下配置来定义缓存：

*src/main/resources/application.yml*

```yaml
microstream:
  cache:
    counter: 
      key-type: java.lang.String
      value-type: java.lang.Long
```

1. `counter`： 定义一个具有 String 键和 Long 值的缓存命名 `counter`。

然后可以通过以下方式使用此缓存：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package io.micronaut.microstream.docs;

import io.micronaut.cache.annotation.CacheConfig;
import io.micronaut.cache.annotation.CachePut;
import io.micronaut.cache.annotation.Cacheable;
import jakarta.inject.Singleton;

import java.util.HashMap;
import java.util.Map;

@Singleton
@CacheConfig("counter") // 
public class CounterService {

    Map<String, Long> counters = new HashMap<>();

    @Cacheable // 
    public Long currentCount(String name) {
        return counters.get(name);
    }

    @CachePut(parameters = {"name"}) // 
    public Long setCount(String name, Long count) {
        counters.put(name, count);
        return count;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package io.micronaut.microstream.docs

import io.micronaut.cache.annotation.CacheConfig
import io.micronaut.cache.annotation.CachePut
import io.micronaut.cache.annotation.Cacheable
import jakarta.inject.Singleton

@Singleton
@CacheConfig("counter") // 
class CounterService {

    Map<String, Long> counters = [:]

    @Cacheable // 
    Long currentCount(String name) {
        return counters.get(name)
    }

    @CachePut(parameters = ["name"]) // 
    Long setCount(String name, Long count) {
        counters.put(name, count)
        count
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package io.micronaut.microstream.docs

import io.micronaut.cache.annotation.CacheConfig
import io.micronaut.cache.annotation.CachePut
import io.micronaut.cache.annotation.Cacheable
import jakarta.inject.Singleton
import java.util.HashMap

@Singleton
@CacheConfig("counter") // 
open class CounterService {

    val counters: MutableMap<String, Long> = HashMap()

    @Cacheable // 
    open fun currentCount(name: String): Long? = counters[name]

    @CachePut(parameters = ["name"]) // 
    open fun setCount(name: String, count: Long): Long {
        counters[name] = count
        return count
    }
}
```

  </TabItem>
</Tabs>

1. 使用 `counter` 缓存。
2. 此调用的结果将被缓存。
3. 设置计数器将使该密钥的缓存无效。

## 8.2 缓存存储

如果需要在重新启动时持续进行缓存，则可以使用存储管理器备份 MicroStream 缓存。

*src/main/resources/application.yml*

```yaml
microstream:
  storage:
    backing: 
      storage-directory: "${storageDirectory}"
      channel-count: 4
  cache:
    counter: 
      key-type: java.lang.String
      value-type: java.lang.Long
      storage: backing 
```

1. `backing`：定义一个称为 `backing` 的存储管理器
2. `counter`：定义一个名为 `counter` 的缓存来存储 String 键和 Long 值
3. `storage`：配置缓存以使用 `backing` 存储管理器

上面的示例将在重新启动时持续存在。

> [英文链接](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/guide/index.html#cache)

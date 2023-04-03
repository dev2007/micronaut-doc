---
sidebar_position: 100
---

# 10. 无操作缓存支持

取决于环境或在测试时，可能不希望实际缓存项目。在这种情况下，可以使用无操作缓存管理器，它只接受缓存中的任何项，而不实际存储它们。

添加 Micronaut 无操作缓存模块作为依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.cache:micronaut-cache-noop:3.5.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.cache</groupId>
    <artifactId>micronaut-cache-noop</artifactId>
    <version>3.5.0</version>
</dependency>
```

  </TabItem>
</Tabs>

无操作缓存管理器需要显式启用：

```yaml
noop-cache.enabled: true
```

> [英文链接](https://micronaut-projects.github.io/micronaut-cache/3.5.0/guide/index.html#noop)

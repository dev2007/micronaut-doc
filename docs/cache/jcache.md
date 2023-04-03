---
sidebar_position: 40
---

# 4. JCache API 支持

当 classpath 中有JSR107（JCache）实现时（Ehcache、Hazelcast、Infinispan 等），默认情况下，缓存抽象将在内部使用 JCache API。如果你希望 Micronaut 使用具体的实现 API，则需要禁用 JCache：

```yaml
micronaut:
  jcache:
    enabled: false
```

> [英文链接](https://micronaut-projects.github.io/micronaut-cache/3.5.0/guide/index.html#jcache)

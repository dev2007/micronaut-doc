---
sidebar_position: 40
---

# 4. 配置

Micronaut 应用程序可以有多个 MicroStream 实例。每个 MicroStream 实例代表一个持久数据的连贯实体图。

你可以使用 [MicroStream 配置文档](https://docs.microstream.one/manual/storage/configuration/index.html)中描述的相同值。

以下配置示例使用[Bean 名称限定符](../core/aop.html#35-bean-限定符)配置两个类型为 [EmbeddedStorageConfigurationProvider](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/api/io/micronaut/microstream/conf/EmbeddedStorageConfigurationProvider.html) 的 Bean：`orange` 和 `blue`。

*src/main/resources/application.yml*

```yaml
microstream:
  storage:
    orange: 
      root-class: 'io.micronaut.microstream.docs.OneData' 
      storage-directory: build/microstream${random.shortuuid}
      channel-count: 4
    blue: 
      root-class: 'io.micronaut.microstream.docs.AnotherData' 
      storage-directory: build/microstream${random.shortuuid}
      channel-count: 4
      channel-directory-prefix: 'channel_'
      data-file-prefix: 'channel_'
      data-file-suffix: '.dat'
```

1. `orange`：为每个 MicroStream 实例指定不同的名称限定符
2. `root-class`：指定实体图根类

> [英文链接](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/guide/index.html#configuration)

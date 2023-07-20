---
sidebar_position: 160
---

# 6.16 提供静态资源

默认情况下启用静态资源解析。Micronaut 支持从 classpath 或文件系统解析资源。

有关可用的配置选项，请参阅以下信息：

*表 1. [StaticResourceConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/web/router/resource/StaticResourceConfiguration.html) 配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.router.static-resources.*.enabled|boolean|设置是否启用此特定映射。默认值（true）。|
|micronaut.router.static-resources.*.paths|java.util.List|以 `classpath:` 或 `file:` 开头的路径列表。你可以从磁盘或 classpath 上的任何位置提供文件。例如，要从 `src/main/resources/public` 提供静态资源，可以使用 `classpath:public` 作为路径。|
|micronaut.router.static-resources.*.mapping|java.lang.String|应该从这里提供的路径资源。使用 ant 路径匹配。默认值（“/**”）|

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#staticResources)

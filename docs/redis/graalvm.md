---
sidebar_position: 70
---

# 8. GraalVM 支持

可以为使用 [Lettuce](https://lettuce.io/) 驱动的 Micronaut 应用程序创建本地镜像。由于驱动本身的原因，需要一些限制和配置，因此请确保阅读有关 GraalVM 的[官方驱动文档](https://github.com/lettuce-io/lettuce-core/wiki/Using-Lettuce-with-Native-Images)。Micronaut 为 Netty 提供了配置，因此你不需要将该部分添加到自己的 `reflect-config.json` 中。

:::tip 注意
有关更多信息，参阅用户指南中关于 [GraalVM](https://docs.micronaut.io/latest/guide/index.html#graal) 的部分。
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-redis/5.3.2/guide/index.html#graalvm)

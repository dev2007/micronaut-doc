---
sidebar_position: 140
---

# 14. 语言支持

Micronaut 支持任何实现 [Java 注解处理器](https://docs.oracle.com/javase/8/docs/api/javax/annotation/processing/package-summary.html) API 的 JVM 语言。

尽管 Groovy 不支持该 API，但已使用 AST 转换建立了特殊支持。目前支持的语言列表如下Java、Groovy 和 Kotlin（通过 `kapt` 工具）。

:::tip 注意
理论上，任何支持在编译时分析 AST 的语言都可以支持。[io.micronaut.inject.writer](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/inject/writer/package-summary.html) 软件包包含一些语言中立的类，可在编译时使用 ASM 工具构建 [BeanDefinition](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/inject/BeanDefinition.html) 类。
:::

下面的章节将介绍特定语言的功能以及使用 Micronaut 时的注意事项。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#languageSupport)

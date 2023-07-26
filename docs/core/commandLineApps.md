---
sidebar_position: 110
---

# 11. 独立命令行应用程序

在某些情况下，你可能希望创建与微服务基础架构交互的独立命令行（CLI）应用程序。

此类应用的例子包括计划任务、批处理应用和一般命令行应用。

在这种情况下，有一个强大的方法来解析命令行选项和位置参数是非常重要的。

## 11.1 Picocli 支持

[Picocli](https://github.com/remkop/picocli) 是一款命令行分析器，支持 ANSI 颜色的使用帮助、自动完成和嵌套子命令。它有一个注释应用程序接口（annotations API），用于创建几乎无需代码的命令行应用程序，还有一个编程应用程序接口（programmatic API），用于创建特定领域语言等动态用途。

更多信息，参阅 [Picocli 集成文档](/picocli.html)。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#commandLineApps)

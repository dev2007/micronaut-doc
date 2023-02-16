# 1. 介绍

Micronaut 是一个基于 JVM 的现代全栈 Java 框架，旨在构建模块化、易于测试的 JVM 应用程序，支持 Java、Kotlin 和 Groovy。

Micronaut 由 Grails 框架的创建者开发，并从多年来使用 Spring、Spring Boot 和 Grails 构建从单片到微服务的真实应用程序中汲取的经验教训中汲取灵感。

Micronaut 旨在提供构建 JVM 应用程序所需的所有工具，包括：
- 依赖注入和控制反转（IoC）
- 面向方面编程（AOP）
- 敏感默认值和自动配置

使用 Micronaut，你可以构建消息驱动应用程序、命令行应用程序、HTTP 服务器等，而对于微服务，特别是 Micronaut 还提供：
- 分布式配置
- 服务发现
- HTTP 路由
- 客户端负载平衡

同时，Micronaut 旨在通过提供以下功能来避免 Spring、Spring Boot 和 Grails 等框架的缺点：
- 快速启动时间
- 减少内存占用
- 最少使用反射
- 最少使用代理
- 无运行时字节码生成
- 简洁单元测试

从历史上看，Spring 和 Grails 等框架并非设计用于无服务器功能、Android 应用程序或低内存占用微服务等场景。相比之下，Micronaut 的设计适合所有这些场景。

这一目标是通过使用 Java 的注释处理器以及构建在 Netty 上的 HTTP 服务器和客户端来实现的，这些处理器可用于任何支持它们的 JVM 语言。为了提供与 Spring 和 Grails 类似的编程模型，这些注释处理器预编译必要的元数据以执行 DI、定义 AOP 代理并配置应用程序以在低内存环境中运行。

Micronaut 中的许多 API 深受 Spring 和 Grails 的启发。这是经过设计的，有助于开发人员快速跟上进度。

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html)

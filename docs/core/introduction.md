---
sidebar_position: 10
---

# 1. 简介

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

这一目标是通过使用 Java 的注解处理器以及构建在 Netty 上的 HTTP 服务器和客户端来实现的，这些处理器可用于任何支持它们的 JVM 语言。为了提供与 Spring 和 Grails 类似的编程模型，这些注解处理器预编译必要的元数据以执行 DI、定义 AOP 代理并配置应用程序以在低内存环境中运行。

Micronaut 中的许多 API 深受 Spring 和 Grails 的启发。这是经过设计的，有助于开发人员快速跟上进度。

## 1.1 有什么新变化？

### 3.9.0

**弃用**

`ConversionService.SHARED` 已被弃用，它将在 Micronaut 框架的未来版本中移除。请使用注入的 [ConversionService](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/convert/ConversionService.html) Bean，并通过声明 [TypeConverter](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/convert/TypeConverter.html) 类型的 Bean 来注册新的类型转换器。

---

### 3.8.0

**主要特性**

- [支持 GraalVM 22.3](https://www.graalvm.org/release-notes/22_3/)
- 在 Micronaut `3.8.0` 中，你可以在 [Records](https://docs.oracle.com/en/java/javase/14/language/records.html) 中使用 `@RequestBean` 注解。在 3.8.0 之前，你可以使用 POJO 作为控制器方法参数，并用 `@RequestBean` 对参数进行注解，以绑定任何可绑定的值（例如，`HttpRequest`、`@PathVariable`、`@QueryValue` 或 `@Header` 字段）。
- 自 3.8.0 起，如果你在本地主机（如测试或开发）运行应用程序时从任何来源启用 CORS，则 `CorsFilter` 会对非localhost 来源返回 403，以保护你免受 localhost 驱动的攻击。

参阅 [Micronaut Framework 3.8.0 公告博文](https://micronaut.io/2022/12/27/micronaut-framework-3-8-0-released/)。你会发现 Micronaut 3.8.0 新功能的详细概述。

---

### 3.7.0

#### 多项改进

- 如果你希望完全控制应用程序加载配置的位置（例如，由于安全限制），你可以在启动应用程序时调用 `ApplicationContextBuilder::enableDefaultPropertySources(false)` 来禁用默认的 `PropertySourceLoader` 实现。
- 更好的 YAML 配置 `java.time` 转换
- 客户端 SSL 内部配置与 [Bootstrap](/core/config#49-引导配置) 上下文兼容。
- `UriBuilder` 方法 `queryParam` 和 `replaceQueryParam` 可忽略空值。
- 可以在不停止应用程序上下文的情况下停止 Netty 服务器。
- 可以在运行时使用接口声明 Bean。
- 你可以将静态方法标记为 `@Executable`。
- 重构 HTTP 客户端

#### Spring 集成改进

- [Micronaut Spring](/spring) 对那些想在 Spring 应用程序中使用 Micronaut 模块或从 Micronaut 应用程序中使用 Spring 库的开发人员进行了改进。

#### 新模块：

- [对象存储](/objectstorage)。
- [Micronaut CRaC](/crac)。

参数 [Micronaut Framework 3.7.0 公告博文](https://micronaut.io/2022/09/21/micronaut-framework-3-7-0-released/)。你会发现 Micronaut 3.7.0 新功能的详细概述。

---

### 3.6.0

关键特性：

- [测试资源](/testresources)
- [Hibernate 响应式](/sql/hibernate#45-配置Hibernate-响应式)
- [OpenTelemetry](/tracing/opentelemetry)
- [Azure Vault](/azure#5Azure-Key-Vault-支持)
- [GraalVM 22.2 支持](https://www.graalvm.org/release-notes/22_2/)
- [集成 NubesGen](https://nubesgen.com/)

参阅 [Micronaut Framework 3.6.0 公告博文](https://micronaut.io/2022/08/04/micronaut-framework-3-6-0-released/)。你将看到 Micronaut 3.6.0 新增功能的详细概述。

Micronaut 核心功能：

**不对服务应用 @Filter**

可以使用 `@Filter` 的成员 `excludeServiceId` 从 HTTP 客户端过滤器中排除服务。

```java
@Filter(patterns = '/**', excludeServiceId = 'authClient')
public class AppHttpClientFilter implements HttpClientFilter {
```

**Netty 运行时**

该版本将 [Netty](https://netty.io/) 从 4.1.77 升级到 4.1.79。此外，它还改进了[配置 Netty 客户端管道](https://docs.micronaut.io/snapshot/guide/#nettyClientPipeline)和[配置 Netty 服务器管道](https://docs.micronaut.io/snapshot/guide/#nettyServerPipeline)的 API。

**对 HttpClientException 的改进**

如果存在 `serviceId` 字段，则会在 `HttpClientException` 中填入并显示在异常消息中。

模块升级
- Micronaut AWS 3.5.3 至 3.7.0
- Micronaut Azure 3.2.3 升级至 3.3.0
- Micronaut 缓存 3.4.1 至 3.5.0
- Micronaut Cassandra 4.0.0 至 5.1.1
- Micronaut Coherence 3.4.1 至 3.5.1
- Micronaut Data 3.4.3 至 3.7.2
- Micronaut Elasticsearch 4.2.0 至 4.3.0
- Micronaut Email 1.2.3 至 1.3.1
- Micronaut Flyway 5.3.0 至 5.4.0
- Micronaut GCP 4.2.1 至 4.4.0
- Micronaut GraphQL 3.0.0 至 3.1.0
- Micronaut Groovy 3.1.0 至 3.2.0
- Micronaut JaxRS 3.3.0 至 3.4.0
- Micronaut JMX 3.0.0 至 3.1.0
- Micronaut Kafka 4.3.1 至 4.4.0
- Micronaut Micrometer 4.3.0 至 4.4.0
- Micronaut Microstream 1.0.0-M1 至 1.0.0
- Micronaut Liquibase 5.3.0 至 5.4.1
- Micronaut Mongo 4.2.0 至 4.4.0
- Micronaut Neo4J 5.0.0 至 5.1.0
- Micronaut Nats 3.0.0 至 3.1.0
- Micronaut OpenAPI 4.2.2 至 4.4.3
- Micronaut Picocli 4.2.1 至 4.3.0
- Micronaut Problem 2.3.1 至 2.4.0
- Micronaut RabbitMQ 3.1.0 至 3.3.0
- Micronaut R2DBC 3.0.0 至 3.0.1
- Micronaut Reactor 2.2.3 至 2.3.1
- Micronaut Redis 5.2.0 至 5.3.0
- Micronaut RxJava3 2.2.1 至 2.3.0
- Micronaut 序列化 1.1.1 至 1.3.0
- Micronaut Servlet 3.2.3 至 3.3.0
- Micronaut Spring 4.1.1 至 4.2.1
- Micronaut SQL 4.4.1 至 4.6.3
- Micronaut Test 3.3.1 至 3.4.0
- Micronaut TOML 1.0.0 至 1.1.1
- Micronaut Tracing 4.1.1 至 4.2.1
- Micronaut Views 3.4.0 至 3.5.0
- Micronaut Jackson XML 3.0.1 至 3.1.0

---

### 3.5.0

**GraalVM 22.1.0**

Micronaut 框架 3.5 支持 [GraalVM 22.1.0](https://www.graalvm.org/release-notes/22_1/)。

[Micronaut Gradle Plugin v3.4.0](https://micronaut-projects.github.io/micronaut-gradle-plugin/latest/) 和 [Micronaut Maven Plugin v3.3.0](https://github.com/micronaut-projects/micronaut-maven-plugin/releases/tag/v3.3.0) 支持 GraalVM 22.1.0。

**Gradle 版本的增量编译**

Micronaut 框架 3.5 支持完全增量编译，包括 Gradle Builds 的 GraalVM 元数据。

**Micronaut 数据**

 支持 [Micronaut Data 3.4.0](https://github.com/micronaut-projects/micronaut-data/releases/tag/v3.4.0)：

- 用于 JDBC 的 Postgres 枚举。
- 反应式资源库和规范的分页。
- 为异步（async）、队列（coroutines）资源库和规范分页。

**Turbo 集成**

Micronaut Views 增加了与 [Turbo](/views.html#33-turbo) 的集成。

**新模块 —— Micronaut Microstream**

[Micronaut Microstream](/microstream) 简化了与 [MicroStream](https://microstream.one/) 的工作，MicroStream 是一个本地 Java 对象图存储引擎。

**带有时区的 @Scheduled**

使用 [@Scheduled 注解](/core/aop#58-调度任务)时，可以选择指定时区。

```java
@Scheduled(cron = '1/33 0/1 * 1/1 * ?', zoneId = "America/Chicago")
void runCron() {
...
..
```

**使用 @Validated 支持验证组**

你可以使用 `@Validated` 上的[验证组](/core/httpserver/datavalidation#6151-验证组)强制执行约束子集。

**高级监听器配置**

Micronaut 框架 3.5.0 在配置 HTTP 服务器方面提供了更多灵活性。你可以[手动指定每个监听器](/core/httpserver/serverConfiguration#6294-高级监听器配置)，而不是配置一个端口。

**短暂工厂**

[工厂](/core/ioc#38-bean-工厂)的默认作用域是 `@Singleton`，它会随上下文一起销毁。自 Micronaut 框架 3.5.0 版起，在生成一个 Bean 后，你可以用 `@Prototype` 和 `@Factory` 来注解你的工厂类，从而处置工厂。

**模块升级**

- [Micronaut Test 3.2.0](https://github.com/micronaut-projects/micronaut-test/releases/tag/v3.2.0) 增加了对 KoTest 5 的支持。
- [Micronaut AWS 3.5.0](https://github.com/micronaut-projects/micronaut-aws/releases/tag/v3.5.0) 增加了一个新模块 [Micronaut AWS CDK](/aws/cdk)。它还升级到最新版本的 AWS SDK。
- [Micronaut Micrometer 4.3.0](https://github.com/micronaut-projects/micronaut-micrometer/releases/tag/v4.3.0) 升级到 Micrometer 1.9.0。
- [Micronaut GCP 4.2.0](https://github.com/micronaut-projects/micronaut-gcp/releases/tag/v4.2.0) 更新至 `grpc-auth` 1.45.1 和 `grpc-netty-shaded`。此外，我们明确了使用 GCP 库时支持 GraalVM 原生图像的文档，而且 Micronaut GCP Bom 现在包含 `com.google.cloud:native-image-support` 依赖关系。
- [Micronaut AOT 1.1.0](https://github.com/micronaut-projects/micronaut-aot/releases/tag/v1.1.0)
- [Micronaut SQL 到 4.4.0](https://github.com/micronaut-projects/micronaut-sql/releases/tag/v4.4.0)
- [Micronaut Problem JSON 到 2.3.0 版](https://github.com/micronaut-projects/micronaut-problem-json/releases/tag/v2.3.0)
- [Micronaut GRPC 3.3.0 版](https://github.com/micronaut-projects/micronaut-grpc/releases/tag/v3.3.0) 允许为 grpc-server 公开 gRPC 健康检查。
- [Micronaut 序列化到 1.1.0 版](https://github.com/micronaut-projects/micronaut-serialization/releases/tag/v1.1.0)。它允许对象数组的序列化和反序列化。
- [Micronaut OpenAPI 到 4.1.0 版](https://github.com/micronaut-projects/micronaut-openapi/releases/tag/v4.1.0) 升级至 Swagger 2.2.0。
- [Micronaut R2DBC 到 3.0.0 版](https://github.com/micronaut-projects/micronaut-r2dbc/releases/tag/v3.0.0) 升级到 R2DBC 1.0.0.RELEASE。
- [Micronaut Security 到 3.6.0 版](https://github.com/micronaut-projects/micronaut-security/releases/tag/v3.6.0)。
- [Micronaut 缓存到 3.4.1 版](https://github.com/micronaut-projects/micronaut-cache/releases/tag/v3.4.1)。
- [Micronaut Coherence 到 3.4.1 版](https://github.com/micronaut-projects/micronaut-coherence/releases/tag/v3.4.1)。

多个模块发布了 BOM（物料清单）或使用了 Gradle 版本目录：

- [Micronaut JAX-RS 升级到 3.3.0 版](https://github.com/micronaut-projects/micronaut-jaxrs/releases/tag/v3.3.0)
- [Micronaut Picocli 到 4.2.1 版](https://github.com/micronaut-projects/micronaut-picocli/releases/tag/v4.2.1)
- [Micronaut ACME 到 3.2.0 版](https://github.com/micronaut-projects/micronaut-acme/releases/tag/v3.2.0)。
- [Micronaut MongoDB 到 4.2.0 版](https://github.com/micronaut-projects/micronaut-acme/releases/tag/v3.2.0)
- [Micronaut MQTT 到 2.2.0 版](https://github.com/micronaut-projects/micronaut-mqtt/releases/tag/v2.2.0)。
- [Micronaut Kafka 到 4.3.0 版](https://github.com/micronaut-projects/micronaut-kafka/releases/tag/v4.3.0)。

**模式迁移模块**

- [Micronaut Flyway 5.3.0](https://github.com/micronaut-projects/micronaut-flyway/releases/tag/v5.3.0) 升级 Flyway 至 8.5.8。
- [Micronaut Liquibase 5.3.0](https://github.com/micronaut-projects/micronaut-liquibase/releases/tag/v5.3.0) 将 Liquibase 升级至 4.9.1。

---

### 3.4.0

**本地化消息源**

现在，你可以在控制器中注入 `@RequestScope` Bean [LocalizedMessageSource](/core/i18n#192-本地化信息源)，以解析当前 HTTP 请求的本地化消息。它与 [Micronaut 本地化解析](/core/httpserver/localeResolution)功能结合使用。

**在 @Requires 中引用 Bean 属性**

在 3.4.0 中，你可以在 [`@Requires` 中引用其他 Bean 属性来有条件地加载 Bean](https://docs.micronaut.io/latest/guide/#_referencing_bean_properties_in_requires)。

```java
@Requires(bean=Config.class, beanProperty="foo", value="John")
```

**Micronaut Data MongoDB**

[Micronaut Data 3.3.0](https://github.com/micronaut-projects/micronaut-data/releases/tag/v3.3.0) 包含 [Micronaut Data MongoDB](/data/mongo)。

**Micronaut AOT 和 Maven**

[Micronaut AOT](https://micronaut-projects.github.io/micronaut-aot/latest/guide/) 现在完全支持 Maven 用户。在运行、测试或打包应用程序时，只需通过 `-Dmicronaut.aot.enabled` 即可启用 AOT。

更多详情，参阅 [Micronaut Maven 插件文档](https://micronaut-projects.github.io/micronaut-maven-plugin/latest/examples/aot.html)。

**Micronaut TOML**

[Micronaut TOML](/tomal) 允许你使用 [TOML](https://toml.io/en/) 编写应用程序配置，而不是使用 `Properties`、`YAML`、`Groovy` 或 `Config4k`。

**Micronaut Security**

[Micronaut Security 3.4.1](https://github.com/micronaut-projects/micronaut-security/releases/tag/v3.4.0) 会在已验证用户访问敏感端点时响应错误。这就迫使开发人员定义他们希望自己的应用程序在这种情况下的行为方式。阅读[发布说明](https://github.com/micronaut-projects/micronaut-security/releases/tag/v3.4.0)和[文档](https://micronaut-projects.github.io/micronaut-security/latest/guide/#builtInEndpointsAccess)，以了解更多信息。

**BOM 模块**

多个项目包含 BOM（物料清单）模块：

- [Micronaut Azure 3.1.0](https://github.com/micronaut-projects/micronaut-azure/releases/tag/v3.1.0)
- [Micronaut GCP 4.1.0](https://github.com/micronaut-projects/micronaut-gcp/releases/tag/v4.1.0)。它包括最新版本的 Google Cloud 依赖项更新。
- [Micronaut Kotlin 3.2.0](https://github.com/micronaut-projects/micronaut-kotlin/releases/tag/v3.2.0)
- [Micronaut MongoDB 4.1.0](https://github.com/micronaut-projects/micronaut-mongodb/releases/tag/v4.1.0)
- [Micronaut MQTT 2.1.0](https://github.com/micronaut-projects/micronaut-mqtt/releases/tag/v2.1.0)
- [Micronaut Reactor 2.2.1](https://github.com/micronaut-projects/micronaut-mqtt/releases/tag/v2.1.0)。它包括项目 Reactor 依赖项的更新。
- [Micronaut Redis 5.2.0](https://github.com/micronaut-projects/micronaut-redis/releases/tag/v5.2.0)
- [Micronaut RxJava2 1.2.0](https://github.com/micronaut-projects/micronaut-rxjava2/releases/tag/v1.2.0)
- [Micronaut RxJava3 2.2.0](https://github.com/micronaut-projects/micronaut-rxjava3/releases/tag/v2.2.0)
- [Micronaut Security 3.4.1](https://github.com/micronaut-projects/micronaut-security/releases/tag/v3.4.0)
- [Micronaut Servlet 3.2.0](https://github.com/micronaut-projects/micronaut-security/releases/tag/v3.4.0)，包括 Tomcat 和 Undertow 依赖项的更新。

**其他模块升级**

- [Micronaut AWS 3.2.0](https://github.com/micronaut-projects/micronaut-aws/releases/tag/v3.2.0) 升级到最新版本的 AWS SDK、ASK SDK 和 AWS Serverless Java Container。
- [Micronaut Email 1.1.0](https://github.com/micronaut-projects/micronaut-email/releases/tag/v1.1.0) 更新至 Sendgrid 4.8.3，并包含针对 javamail 模块用户的改进。
- [Micronaut Test 3.1.0](https://github.com/micronaut-projects/micronaut-test/releases/tag/v3.1.0) 更新了底层测试依赖关系。

---

### 3.3.0

**GraalVM 22.0.0.2**

Micronaut 现在支持最新的 GraalVM 22.0.0.2 版本。

**环境端点**

创建了一个新的 API [EnvironmentEndpointFilter](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/env/EnvironmentEndpointFilter.html)，允许应用程序自定义哪些键的值应该被屏蔽，哪些键的值不应该被屏蔽。有关详细信息，参阅[文档](/core/management/providedEndpoints#15210-环境端点)。

**AOP 拦截器绑定**

在将 AOP 注解绑定到拦截器时，只有注解的存在才能决定是否应用拦截器。现在，还可以根据注解的值进行绑定。要启用此功能，请将 [@InterceptorBinding](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/aop/InterceptorBinding.html) 注解的 bindMembers 成员设置为 true。

**Netty 缓冲区分配**

现在可以配置默认的 Netty 缓冲区分配器。参阅[配置参考](https://docs.micronaut.io/3.3.x/guide/configurationreference.html#io.micronaut.buffer.netty.DefaultByteBufAllocatorConfiguration)。

**提高类风格的灵活性**

Micronaut 框架的许多功能都依赖于 getters 和 setters 的约定。由于记录和构建器等原因，我们现在可以使用 [@AccessorsStyle](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/annotation/AccessorsStyle.html) 注解来配置我们寻找的方法名称。例如，可以将注解放在 [@ConfigurationProperties](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/ConfigurationProperties.html) Bean 上，以便将配置绑定到不以 set 开头的方法上。该注解还可用于带有 [@Introspected](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/annotation/Introspected.html) 注解的类。

**访问日志排除**

Netty 访问日志程序现在支持根据一组与 URI 匹配的正则表达式模式排除请求。参阅 [AccessLogger 文档](/core/httpserver/serverConfiguration#6298-启用访问记录器)。

**新的序列化/反序列化模块**

[Micronaut 序列化](/serialization)是一个新模块，可替代 Jackson。它支持将 Java 类型（包括 Java 17 记录）序列化和反序列化为 JSON 和其他格式。

用户现在可以选择一种替代实现，该实现与现有的 Jackson 注解基本兼容，但有许多优点，包括消除反射、编译时验证、更高的安全性（因为只有显式类型才可序列化）以及减少本地映像构建大小、构建时间和内存使用量。

**新电子邮件模块**

[Micronaut Email](/email) 是一个新模块，可方便地从 Micronaut 应用程序发送电子邮件。它可与亚马逊简单电子邮件服务、Postmark、Mailjet 或 SendGrid 等事务电子邮件提供商集成。

**Micronaut AOT**

在这个小周期中，我们发布了新模块 Micronaut AOT 的里程碑版本。你可以使用 Micronaut AOT，并通过 Micronaut Gradle Plugin 使用该模块提供的构建时间优化功能来实现更快的启动时间。请在[公告博文](https://micronaut.io/2021/12/20/micronaut-aot-build-time-optimizations-for-micronaut-applications/)中阅读更多相关信息。

**Micronaut Kubernetes 3.3.0**

Micronaut Kubernetes 3.3 增加了对轻松创建 Kubernetes Operator 的支持。Kubernetes Operator 是一种已知模式，用于通过为本地和自定义资源创建特定于应用程序的控制器来扩展 Kubernetes 的功能。参阅 [Kubernetes Operator](/kubernetes) 的更多信息。

Micronaut Kubernetes 3.3.0 还为 RxJava3 添加了新的 Kubernetes 响应式客户端。

**其他模块升级**

- Micronaut 缓存 3.1.0
- Micronaut 发现客户端 3.1.0
- Micronaut Elasticsearch 4.2.0
- Micronaut Flyway 5.1.1
- Micronaut Kafka 4.1.1
- Micronaut Kotlin 3.1.0
- Micronaut Liquibase 5.1.1
- Micronaut Openapi 4.0.0
- Micronaut Picocli 4.1.0
- Micronaut Problem 2.2.0
- Micronaut Security 3.3.0
- Micronaut SQL 4.1.1
- Micronaut Toml 1.0.0-M2
- Micronaut Views 3.1.2

**其他依赖关系升级**

- Apache Commons DBCP 2.9.0
- Elasticsearch 7.16.3
- Flyway 8.4.2
- Hibernate 5.5.9.Final
- Kotlin 1.6.10
- Liquibase 4.7.1
- Logback 1.2.10
- Swagger 2.1.12

---

### 3.2.0

**GraalVM 21.3.0**

Micronaut 已更新以支持最新的 GraalVM 21.3.0 版本。请注意，从 21.3.0 开始 GraalVM 不再发布基于 JDK 8 的版本。如果你仍然使用 Java 8，请使用 GraalVM JDK 11 发行版。

GraalVM Maven 官方插件有新的 GAV 坐标，因此如果你在 pom.xml 中声明了该插件，请将坐标更新为：

```xml
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
...
</plugin>
```

请查看[官方文档](https://graalvm.github.io/native-build-tools/0.9.7.1/maven-plugin.html)了解如何自定义插件。

**Gradle 插件 3.0.0**

新版 Gradle 插件已发布，包括使用 Gradle 的懒配置 API 的内部更改。在此过程中，还重写了文档。

对 GraalVM 的支持现在由 [GraalVM 官方插件](https://graalvm.github.io/native-build-tools/0.9.7.1/gradle-plugin.html)负责。我们建议升级以获得最新的错误修复，但这对某些用户来说是一个突破性的改变：

- `nativeImage` 任务现在由 `nativeCompile` 代替
- 本地镜像配置在 `graalvmNative` DSL 扩展中进行，而不是在 `nativeCompile` 任务中进行
- 本地镜像构建使用 Gradle 的工具链支持。参考[文档](https://micronaut-projects.github.io/micronaut-gradle-plugin/latest/)以获得帮助。

:::tip 注意
你仍然可以使用 2.x 版本的 Gradle 插件构建现有应用程序或库。该版本的文档可在[此处](https://github.com/micronaut-projects/micronaut-gradle-plugin/blob/2.0.x/README.md)找到。
:::

**Kotlin 1.6.0**

Micronaut 3.2.0 包含对 Kotlin 1.6.0 的支持。

**HTTP 功能**

**WebSocket Ping API**

WebSocket [@OnMessage](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/OnMessage.html) 方法现在可以接受一个 [WebSocketPongMessage](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/OnMessage.html) 参数，该参数将接收作为对使用 [WebSocketSession](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketSession.html) 上新的 `sendPingAsync` 方法提交的 ping 响应而发送的 WebSocket pong。

**HTTP2 服务器推送**

现在可以使用 HTTP2 服务器推送协议将资源（如 HTML 页面所需的样式表）与页面请求一起发送到客户端。有关如何使用此功能的信息，参阅 [HTTP/2 文档](/core/httpserver/http2Server)。

**请求体上的 JsonView**

现在，你可以在控制器方法的 `@Body` 参数上指定 Jackson `@JsonView` 注解。

**支持 WebSocket ws/wss 协议**

WebSocket 客户端现在支持 ws/wss 协议。为实现这一变更，[WebSocketClient](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketClient.html) 创建方法现在使用 URI 而不是 URL。URLmethods 已被弃用。

注意：如果调用 WebSocketClient.create(null)，方法调用现在会变得含糊不清。在这种情况下，请插入铸型：`WebSocketClient.create((URI) null)`

**SSL 握手超时配置**

现在可分别使用服务器和客户端的 `micronaut.ssl.handshakeTimeout` 和 `micronaut.http.client.ssl.handshakeTimeout` 配置来配置 SSL 握手超时。

**模块升级**

**Micronaut Data 3.2.0**

- 针对 Micronaut JDBC/R2DBC 的具有 JPA 标准 API 规范的存储库
- 可扩展查询参数优化

**响应模块**

- RxJava2、RxJava3 和 Reactor 模块已更新，在其核心对应模块上使用了等效的静态 `create` 方法。

**Micronaut Micrometer 4.1.0**

- 增加对 gRPC 度量的支持

**Micronaut Security 3.2.0**

- 针对有多个密钥集的情况，JSON Web 密钥集的缓存方式已大大改进。

**其他模块升级**

- Elasticsearch 7.15.2
- Flyway 8.0.2
- gRPC 1.39.0
- Liquibase 4.6.1
- Micronaut Elasticsearch 4.0.0
- Micronaut Flyway 5.0.0
- Micronaut gRPC 3.1.1
- Micronaut Liquibase 5.0.0
- Micronaut OpenAPI 3.2.0
- Micronaut Redis 5.1.0
- Testcontainers 1.16.1

---

### 3.1.0

**核心功能**

**原始类型 Bean**

[Factory Bean](/core/ioc#38-bean-工厂) 现在可以创建原始类型或原始数组类型的 bean。

有关详细信息，参阅文档中的[原始 Bean 和数组](/core/ioc#38-bean-工厂)部分。

**可重复的限定符**

[Qualifiers](/core/ioc#35-bean-限定符) 现在可以是可重复的（使用 `java.lang.annotation.Repeatable` 进行注解），这样就可以通过完全或部分匹配注入点上声明的限定符来缩小 Bean 的解析范围。

**InjectScope**

新增了 [@InjectScope](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/InjectScope.html) 注解，可在方法或构造函数完成后销毁任何未定义作用域且注入到注有 `@Inject` 的方法或构造函数中的 Bean。

**更多构建时间优化**

新增了更多构建时间元数据优化功能，包括减少为支持 [Bean 自省](/core/ioc#315-bean-自省)而生成的类的数量和大小，以及在生成的元数据中包含可重复注解的知识，从而避免进一步的反射调用并优化 Micronaut 的内存使用，尤其是在 GraalVM 中。

**改进上下文传播**

通过在 [Reactor 上下文](https://projectreactor.io/docs/core/release/reference/#context)中包含请求上下文信息，以及[在使用 Kotlin 正则表达式时如何在响应流中有效传播上下文的文档](/core/languageSupport/kotlin#1437-响应式上下文传播)，进一步改进了对[响应上下文传播](/core/languageSupport/kotlin#1437-响应式上下文传播)的支持。

**改进元素 API**

构建时 [Element](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/inject/ast/Element.html) API 在多个方面得到了改进：

- 在 [MethodElement](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/inject/ast/MethodElement.html) API 中添加了新方法，以解决检索器类型和抛出声明问题。
- 在 [ClassElement](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/inject/ast/ClassElement.html) API 中添加了新的实验性 API，以解析泛型占位符并解析与元素绑定的泛型

**HTTP 功能**

**通过 Regex 过滤**

HTTP 过滤器现在支持通过正则表达式匹配 URL。将注解的 `patternStyle` 成员设置为 `REGEX`，值就会被视为正则表达式。

**随机端口绑定**

服务器绑定到随机端口的方式有所改进，因此在测试中出现端口绑定异常的情况应该会减少。

**客户端数据格式化**

[@Format](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/convert/format/Format.html) 注解现在支持几种新值，可与声明式 HTTP 客户端结合使用，以支持以几种新方式格式化数据。更多信息，参阅[客户端参数](/core/httpclient/clientAnnotation#731-自定义参数绑定)文档。

**流文件上传**

改进了 [StreamingFileUpload](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/multipart/StreamingFileUpload.html) API，以支持直接流式传输到输出流。与其他 transferTo 方法一样，写入流的过程会自动卸载到 IO 池。

**服务器 SSL 配置**

Netty 服务器的 SSL 配置现在会响应刷新事件。这样，无需重启服务器即可更换证书。有关如何触发刷新的信息，参阅 [https 文档](/core/httpserver/serverConfiguration#6296-用-https-保证服务器安全)。

更多信息，参阅[启动辅助服务器](/core/httpserver/serverConfiguration#6299-启动次要服务器)文档。

**弃用**

`netty.response.file.*` 配置已被弃用，改用 `micronaut.server.netty.response.file.*`。旧的配置关键字将在框架的下一个主要版本中移除。

**模块升级**

**Micronaut Data 3.1.0**

- 支持 Kotlin 的协程。新的存储库接口 `CoroutineCrudRepository`。
- 支持 `AttributeConverter`
- R2DBC 升级至 `Arabba-SR11`
- JPA 标准规范

**Micronaut JAX-RS 3.1**

[JAX-RS 模块](/jaxrs)现已与 Micronaut Security 集成，允许绑定 JAX-RS `SecurityContext`。

**Micronaut Kubernetes 3.1.0**

Micronaut Kubernetes 3.1 引入了新注解 [@Informer](https://micronaut-projects.github.io/micronaut-kubernetes/latest/api/io/micronaut/kubernetes/client/informer/Informer.html)。通过在 [ResourceEventHandler](https://javadoc.io/doc/io.kubernetes/client-java/latest/io/kubernetes/client/informer/ResourceEventHandler.html) 上使用注解，Micronaut 将从官方 [Kubernetes Java SDK](https://github.com/kubernetes-client/java) 中实例化 [SharedInformer](https://javadoc.io/doc/io.kubernetes/client-java/latest/io/kubernetes/client/informer/SharedIndexInformer.html)。然后，你只需处理被监视的 Kubernetes 资源的变化即可。更多信息，参阅 [Kubernetes Informer](/kubernetes/kubernetes-informer)。

**Micronaut Oracle Coherence 3.0.0**

Micronaut Oracle Coherence 模块现已脱离预览状态，包括与 Oracle Coherence 的广泛集成，包括对缓存、消息传递和 Micronaut Data 的支持。

**Micronaut Oracle Coherence 3.0.0**

[Micronaut Oracle Coherence](coherence) 模块现已脱离预览状态，并与 Oracle Coherence 广泛集成，包括支持缓存、消息传递和 Micronaut 数据。

---

### 3.0.0

**核心功能**

**优化的构建时间元数据**

Micronaut 3.0 引入了新的构建时间元数据格式，在启动和代码大小方面更加高效。

因此，在使用 GraalVM Native Image 构建本机镜像时，启动和本机镜像的大小都有了明显改善。

建议用户使用 Micronaut 3.0 重新编译应用程序和库，以便从这些变化中获益。

**支持 GraalVM 21.2**

Micronaut 已更新以支持最新的 GraalVM 21.2 版本。

**Jakarta Inject**

`jakarta.inject` 注解现在是 Micronaut 3 的默认注入注解。

**支持 JSR-330 Bean 导入**

使用 [@Import](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Import.html) 注解，现在可以在外部库中使用 JSR-330（`javax.inject` 或 `jakarta.inject` 注解）的应用程序中导入 Bean 定义。

有关详细信息，参阅 [Bean Import](/core/ioc#318-从库导入-bean) 文档。

**支持控制注解继承**

现在可以通过 Java 的 `@Inherited` 注解控制 [AnnotationMetadata](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/annotation/AnnotationMetadata.html) 的继承。如果注解未明确注解 `@Inherited`，则不会包含在元数据中。更多信息，参阅文档中的[注解继承](/core/ioc#317-bean-注解元数据)部分。

:::tip 注意
这是 Micronaut 2.x 的一个重要行为变化，有关如何升级的信息，参阅[重大变化](/core/appendix#205-破坏性更改)部分。
:::

**支持通过通用类型参数缩小注入范围**

Micronaut 现在可以根据注入点上指定的通用类型参数来确定要注入的正确 Bean：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Inject
public Vehicle(Engine<V8> engine) {
    this.engine = engine;
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Inject
public Vehicle(Engine<V8> engine) {
    this.engine = engine;
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Inject
Vehicle(Engine<V8> engine) {
    this.engine = engine
}
```

  </TabItem>
</Tabs>

更多信息，参阅[通过通用类型参数限定](/core/ioc#35-bean-限定符)部分。

**支持在限定符中使用注解成员**

现在，你可以在限定符中使用注解成员，并使用新的 [@NonBinding](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/NonBinding.html) 注解指定应排除哪些成员。

有关详细信息，参阅[通过注解成员限定](/core/ioc#35-bean-限定符)部分。

**支持限制注入类型**

现在，你可以使用 [@Bean](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Bean.html) 注解中的 `typed` 成员来限制 Bean 的暴露类型：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
@Bean(typed = Engine.class) // (1)
public class V8Engine implements Engine {  // (2)
    @Override
    public String start() {
        return "Starting V8";
    }

    @Override
    public int getCylinders() {
        return 8;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
@Bean(typed = Engine.class) // (1)
public class V8Engine implements Engine {  // (2)
    @Override
    public String start() {
        return "Starting V8";
    }

    @Override
    public int getCylinders() {
        return 8;
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
@Bean(typed = Engine) // (1)
class V8Engine implements Engine {  // (2)
    @Override
    String start() { "Starting V8" }

    @Override
    int getCylinders() { 8 }
}
```

  </TabItem>
</Tabs>

更多信息，参阅[限制可注射类型](/core/ioc#36-限制可注入类型)部分。

**工厂可从字段生成 Bean**

例如，使用 [@Factory](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Factory.html) 注解定义的 Bean 现在可以从公共字段或包保护字段生成 Bean：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MicronautTest
public class VehicleMockSpec {
    @Requires(beans = VehicleMockSpec.class)
    @Bean @Replaces(Engine.class)
    Engine mockEngine = () -> "Mock Started"; // (1)

    @Inject Vehicle vehicle; // (2)

    @Test
    void testStartEngine() {
        final String result = vehicle.start();
        assertEquals("Mock Started", result); // (3)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@MicronautTest
public class VehicleMockSpec {
    @Requires(beans = VehicleMockSpec.class)
    @Bean @Replaces(Engine.class)
    Engine mockEngine = () -> "Mock Started"; // (1)

    @Inject Vehicle vehicle; // (2)

    @Test
    void testStartEngine() {
        final String result = vehicle.start();
        assertEquals("Mock Started", result); // (3)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MicronautTest
class VehicleMockSpec extends Specification {
    @Requires(beans=VehicleMockSpec.class)
    @Bean @Replaces(Engine.class)
    Engine mockEngine = {-> "Mock Started" } as Engine  // (1)

    @Inject Vehicle vehicle // (2)

    void "test start engine"() {
        given:
        final String result = vehicle.start()

        expect:
        result == "Mock Started" // (3)
    }
}
```

  </TabItem>
</Tabs>

如需了解更多信息，参阅文档中的 [Bean 工厂](/core/ioc#38-bean-工厂) 部分。

**增强的 `BeanProvider` 接口**

[BeanProvider](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/BeanProvider.html) 接口增强了新方法，如 `iterator()` 和 `stream()` 以及检查 Bean 存在性和唯一性的方法。

**用于 Bean 工厂的新 `@Any` 限定符**

新引入的 [@Any](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Any.html) 限定符允许将任何可用实例注入注入点，并可与上述新的 `BeanProvider` 接口结合使用，以实现更动态的行为。

*将 BeanProvider 与 Any 结合使用*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.BeanProvider;
import io.micronaut.context.annotation.Any;
import jakarta.inject.Singleton;

@Singleton
public class Vehicle {
    final BeanProvider<Engine> engineProvider;

    public Vehicle(@Any BeanProvider<Engine> engineProvider) { // (1)
        this.engineProvider = engineProvider;
    }
    void start() {
        engineProvider.ifPresent(Engine::start); // (2)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.BeanProvider
import io.micronaut.context.annotation.Any
import jakarta.inject.Singleton

@Singleton
class Vehicle {
    final BeanProvider<Engine> engineProvider

    Vehicle(@Any BeanProvider<Engine> engineProvider) { // (1)
        this.engineProvider = engineProvider
    }
    void start() {
        engineProvider.ifPresent(Engine::start) // (2)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.BeanProvider
import io.micronaut.context.annotation.Any
import jakarta.inject.Singleton

@Singleton
class Vehicle {
    final BeanProvider<Engine> engineProvider

    Vehicle(@Any BeanProvider<Engine> engineProvider) { // (1)
        this.engineProvider = engineProvider
    }
    void start() {
        engineProvider.ifPresent(Engine::start) // (2)
    }
}
```

  </TabItem>
</Tabs>

注解还可用于 [@Factory](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Factory.html) 方法，以便自定义通过 [InjectionPoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/inject/InjectionPoint.html) API 注入对象的方式。

**支持 Bean 自省中的字段**

现在支持对公共字段或包保护字段进行 Bean 自省：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Introspected;

@Introspected(accessKind = Introspected.AccessKind.FIELD)
public class User {
    public final String name; // (1)
    public int age = 18; // (2)

    public User(String name) {
        this.name = name;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Introspected

@Introspected(accessKind = Introspected.AccessKind.FIELD)
class User {
    public final String name // (1)
    public int age = 18 // (2)

    User(String name) {
        this.name = name
    }
}
```

  </TabItem>
</Tabs>

有关详细信息，参阅 [Bean 自省](/core/ioc#315-bean-自省)文档中的 "Bean 字段" 部分。

**`ApplicationEventPublisher` 现在有了通用事件类型**

出于性能考虑，建议注入一个带有通用类型参数的 `ApplicationEventPublisher` 实例 —— `ApplicationEventPublisher<MyEvent>`。

**AOP 特性**

**支持构造器拦截**

现在可以通过 [ConstructorInterceptor](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/aop/ConstructorInterceptor.html) 接口和 [@AroundConstruct](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/aop/AroundConstruct.html) 注解拦截 Bean 的构造调用。

有关详细信息，参阅 [Bean 生命周期通知](/core/aop#54-bean-生命周期通知)部分。

**支持 `@PostConstruct` 和 `@PreDestroy` 拦截**

现在可以通过 [MethodInterceptor](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/aop/MethodInterceptor.html) 接口和 [@InterceptorBinding](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/aop/InterceptorBinding.html) 注解拦截 `@PostConstruct` 和 `@PreDestroy` 方法调用。

更多信息，参阅 [Bean 生命周期通知](/core/aop#54-bean-生命周期通知) 部分。

**随机配置值**

现在可以在配置中设置随机数的最大值和范围。例如，要设置 0 到 9 之间的整数，`${random.int(10)}` 可用作配置值。更多信息，参阅"使用随机属性"下的[文档](/core/config#42-具有-propertysources-的外部化配置)。

**内部使用 Project Reactor 而不是 RxJava2**

Micronaut 3 内部使用 [Project Reactor](https://projectreactor.io/) 代替 [RxJava 2](https://github.com/ReactiveX/RxJava)。由于 [Reactor 的 Context](https://projectreactor.io/docs/core/release/api/reactor/util/context/Context.html)，Project Reactor 允许 Micronaut 3 简化仪表，简化转换登录，并方便与 R2DBC 驱动程序集成。我们建议用户迁移到 Reactor。不过，也可以继续使用 RxJava。请参见[响应式编程](/core/configurations/reactiveConfigs)部分。

**模块升级**

**Micronaut Data 3.1.0**

- 支持 Kotlin 的例程。新的仓库接口 `CoroutineCrudRepository`。
- 支持 `AttributeConverter`
- R2DBC 升级至 `Arabba-SR11`
- JPA 标准规范

**Micronaut Micrometer 4.0.0**

[Micrometer 模块](/micrometer)已升级，现在可支持 [@Timed](https://micrometer.io/?/docs/concepts#_the_timed_annotation) 注解的重复定义，当你在注解处理器类路径中添加 `micronaut-micrometer-annotation` 依赖时，还可支持用于计数器的 `@Counted` 注解。

**Micronaut Oracle Cloud 2.0.0**

Micronaut 的 [Oracle 云集成](/oracle)已更新，支持云监控和跟踪。

**Micronaut Cassandra 4.0.0**

[Micronaut Cassandra](/cassandra) 集成现在包括对 GraalVM 的支持。

**其他模块**

- Micronaut Acme 3.0.0
- Micronaut Aws 3.0.0
- Micronaut Azure 3.0.0
- Micronaut 缓存 3.0.0
- Micronaut 发现客户端 3.0.0
- Micronaut ElasticSearch 3.0.0
- Micronaut Flyway 4.1.0
- Micronaut GCP 4.0.0
- Micronaut GraphQL 3.0.0
- Micronaut Groovy 3.0.0
- Micronaut Grpc 3.0.0
- Micronaut Jackson XML 3.0.0
- Micronaut Jaxrs 3.0.0
- Micronaut JMX 3.0.0
- Micronaut Kafka 4.0.0
- Micronaut Kotlin 3.0.0
- Micronaut Kubernetes 3.0.0
- Micronaut Liquibase 4.0.2
- Micronaut Mongo 4.0.0
- Micronaut MQTT 2.0.0
- Micronaut 多租户 4.0.0
- Micronaut Nats Io 3.0.0
- Micronaut Neo4j 5.0.0
- Micronaut OpenApi 3.0.1
- Micronaut Picocli 4.0.0
- Micronaut Problem Json 2.0.0
- Micronaut R2DBC 2.0.0
- Micronaut RabbitMQ 3.0.0
- Micronaut Reactor 2.0.0
- Micronaut Redis 5.0.0
- Micronaut RSS 3.0.0
- Micronaut RxJava2 1.0.0（新）
- Micronaut RxJava3 2.0.0
- Micronaut Security 3.0.0
- Micronaut Servlet 3.0.0
- Micronaut Spring 4.0.0
- Micronaut SQL 4.0.0
- Micronaut 测试 3.0.0
- Micronaut 视图 3.0.0

**依赖升级**

- Caffeine 2.9.1
- Cassandra 4.11.1
- Elasticsearch 7.12.0
- Flyway 7.12.1
- GraalVM 21.2.0
- H2 数据库 1.4.200
- Hazelcast 4.2.1
- Hibernate 5.5.3.Final
- Hikari 4.0.3
- Infinispan 12.1.6.Final
- Jackson 2.12.4
- Jaeger 1.6.0
- Jakarta Annotation API 2.0.0
- JAsync 1.2.2
- JDBI 3.20.1
- JOOQ 3.14.12
- JUnit 5.7.2
- Kafka 2.8.0
- Kotlin 1.5.21
- Ktor 1.6.1
- Ktor 1.6.1
- Liquibase 4.4.3
- MariaDB 驱动程序 2.7.3
- Micrometer 1.7.1
- MongoDB 4.3.0
- MS SQL 驱动程序 9.2.1.jre8
- MySQL 驱动程序 8.0.25
- Neo4j 驱动程序 4.2.7
- Postgres 驱动程序 42.2.23
- Reactor 3.4.8
- RxJava3 3.0.13
- SLF4J 1.7.29
- Snake YAML 1.29
- Spock 2.0-groovy-3.0
- Spring 5.3.9
- Spring Boot 2.5.3
- Testcontainers 1.15.3
- Tomcat JDBC 10.0.8
- Vertx SQL 驱动程序 4.1.1

## 1.2 升级你的 Micronaut 应用程序

本节包括将 Micronaut 2.x 应用程序升级到 Micronaut 3.0.0 所需的步骤。

下面的章节会更详细地介绍，但从高层次上讲，这个过程一般包括：

- 更新版本
- 更新注解
- 选择反应式实现
- 调整受破坏性变更影响的代码

通常情况下，升级应该是简单明了的，但使用 [OpenRewrite](https://docs.openrewrite.org/) 也可以省去一些工作，OpenRewrite 是一个自动重构工具，你可以用它来进行许多所需的升级更改。

**使用 OpenRewrite 自动升级**

OpenRewrite 适用于用 Java 编写的 Micronaut 应用程序，但目前还不支持 Kotlin 或 Groovy。与其他自动化工具一样，它能为你完成大部分工作，但请务必查看由此产生的更改，并手动完成 OpenRewrite 不支持的任何更改，例如从 RxJava2 转换到 Reactor。

:::tip 注意
如果你将使用 OpenRewrite，请先不要进行任何会导致应用程序无法编译的升级更改，例如将 Micronaut 版本升级到 3.x。这将导致使用 `@Singleton` 等 `javax.inject` 注解或 `io.reactivex.Flowable` 等 RxJava2 类的应用程序无法编译，因为默认情况下不再包含这些依赖项。因此，请使用 OpenRewrite 完成初始工作，然后自己完成无法自动化或不切实际的步骤。
:::

在构建过程中添加 OpenRewrite 支持非常简单，只需添加 Gradle 或 Maven 插件，并将插件配置为使用 Micronaut 升级配方即可。

请参阅 [Gradle 功能差异](https://micronaut.io/launch?features=openrewrite&lang=JAVA&build=GRADLE&activity=diff)或 [Maven 功能差异](https://micronaut.io/launch?features=openrewrite&lang=JAVA&build=MAVEN&activity=diff)，了解所需的构建脚本更改。

更改构建脚本后，就可以"模拟运行" Micronaut 升级配方，看看会有哪些变化。

对于 Gradle，运行

```bash
$ ./gradlew rewriteDryRun
```

并查看 `build/reports/rewrite/rewrite.patch` 中生成的差异报告

对于 Maven，运行

```bash
$ ./mvnw rewrite:dryRun
```

并查看 target/site/rewrite/rewrite.patch 中生成的差异报告。

然后就可以真正运行配方，让 OpenRewrite 更新代码了。

对于 Gradle，运行

```bash
$ ./gradlew rewriteRun
```

对于 Maven，运行

```bash
$ ./mvnw rewrite:run
```

修改完成后，你可以移除插件，但保留它也没有问题，因为 OpenRewrite 并不会自动运行，只有当你运行其中一个命令时才会自动运行。除了 Micronaut 升级方法之外，还有许多其他方法可供使用，你可能想加入这些方法来自动修改其他代码。

该插件包含另一条命令，用于列出当前classpath中的所有配方（本例中是核心配方加上rewrite-micronaut模块添加的配方）。

对于 Gradle，运行

```bash
$ ./gradlew rewriteDiscover
```

对于 Maven，运行

```bash
$ ./mvnw rewrite:discover
```

就会将可用的配方和样式输出到控制台。查看 [OpenRewrite 文档](https://docs.openrewrite.org/)，了解更多信息，并查看许多其他可用的配方。

**版本更新**

如果使用 Gradle，请更新 `gradle.properties` 中的 `micronautVersion` 属性，例如

*gradle.properties*

```bash
micronautVersion=3.9.4
```

如果使用 Maven，请更新 `pom.xml` 中的父 POM 版本和 `micronaut.version` 属性，例如

*pom.xml*

```xml
<parent>
  <groupId>io.micronaut</groupId>
  <artifactId>micronaut-parent</artifactId>
  <version>3.9.4</version>
</parent>

<properties>
  ...
  <micronaut.version>3.9.4</micronaut.version>
  ...
</properties>
```

**构建插件更新**

如果你使用 Micronaut Gradle 插件，请更新到最新版本。

对于 Maven 用户，插件版本会在更新 Micronaut 版本时自动更新。

**注入注解**

`javax.inject` 注解不再是传递依赖关系。Micronaut 现在随附 Jakarta 注入注解。要么用 `jakarta.inject` 替换所有 `javax.inject` 导入，要么添加对 `javax-inject` 的依赖以继续使用旧注解：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("javax.inject:javax.inject:1")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>javax.inject</groupId>
    <artifactId>javax.inject</artifactId>
    <version>1</version>
</dependency>
```

  </TabItem>
</Tabs>

任何依赖于注解元数据中的 `javax.inject` 注解的代码仍可按预期运行，但与之交互的代码必须进行修改，以不再引用注解类本身。在处理注解元数据时，应使用 [AnnotationUtil](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/annotation/AnnotationUtil.html) 类中的静态变量（如 `AnnotationUtil.INJECT`、`AnnotationUtil.SINGLETON` 等）来代替注解类。

**可为 Null 注解**

Micronaut 现在只提供自己的注解集来声明无效性。仍然支持 findbugs、javax 和 jetbrains 注解，但必须添加依赖才能使用它们。要么切换到 Micronaut [@Nullable](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/annotation/Nullable.html) / [@NonNull](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/annotation/NonNull.html) 注解，要么为你想使用的注解库添加依赖。

**RxJava2**

Micronaut 不再将任何反应式实现作为默认模块或核心库。升级到 Micronaut 3 需要选择要使用的反应流实现，然后添加相关依赖。
对于已经在使用 RxJava3 或 Project Reactor 的用户，升级到 Micronaut 3 不需要做任何更改：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.rxjava2:micronaut-rxjava2")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.rxjava2</groupId>
    <artifactId>micronaut-rxjava2</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

此外，如果使用了任何 Rx HTTP 客户端接口，则必须添加依赖并更新导入。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.rxjava2:micronaut-rxjava2-http-client")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.rxjava2</groupId>
    <artifactId>micronaut-rxjava2-http-client</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

*表 1.RxJava2 HTTP 客户端导入*

|旧|新|
|--|--|
|io.micronaut.http.client.RxHttpClient|io.micronaut.rxjava2.http.client.RxHttpClient|
|io.micronaut.http.client.RxProxyHttpClient|io.micronaut.rxjava2.http.client.proxy.RxProxyHttpClient|
|io.micronaut.http.client.RxStreamingHttpClient|io.micronaut.rxjava2.http.client.RxStreamingHttpClient|
|io.micronaut.http.client.sse.RxSseClient|io.micronaut.rxjava2.http.client.sse.RxSseClient|
|io.micronaut.websocket.RxWebSocketClient|io.micronaut.rxjava2.http.client.websockets.RxWebSocketClient|

如果使用基于 Netty 的服务器实现，则必须添加额外的依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.rxjava2:micronaut-rxjava2-http-server-netty")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.rxjava2</groupId>
    <artifactId>micronaut-rxjava2-http-server-netty</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

:::tip 注意
我们建议切换到 Project Reactor，因为这是 Micronaut 内部使用的实现。添加对 RxJava2 的依赖关系将导致两种实现都出现在应用程序的运行时 classpath 中。
:::

**环境端点**

自 3.3.0 起，[环境端点](/core/management/providedEndpoints#15210-环境端点)已默认禁用，参阅[重大变更](/core/appendix#205-破坏性更改)了解如何恢复功能。

**重大变更**

查看[重大变更](/core/appendix#205-破坏性更改)部分并更新受影响的应用程序代码

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#introduction)

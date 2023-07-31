---
sidebar_position: 40
---

# 14.4 用于 GraalVM 的 Micronaut

[GraalVM](https://www.graalvm.org/) 是 Oracle 新推出的通用虚拟机，它支持多语言运行环境，并能将 Java 应用程序编译为本地机器代码。

任何 Micronaut 应用程序都可以使用 GraalVM JVM 运行，但 Micronaut 已添加了特殊支持，以支持使用 [GraalVM native-image 工具](https://www.graalvm.org/reference-manual/native-image/)运行 Micronaut 应用程序。

Micronaut 目前支持 GraalVM 版本 22.0.0.2，团队正在改进每个新版本的支持。如果你发现任何问题，请及时[报告](https://github.com/micronaut-projects/micronaut-core/issues)。

Micronaut 的许多模块和第三方库都已验证可以与 GraalVM 一起工作：HTTP 服务器、HTTP 客户端、函数支持、Micronaut Data JDBC 和 JPA、服务发现、RabbitMQ、视图、安全、Zipkin 等。对其他模块的支持也在不断发展，并将逐步完善。

**开始使用**

:::tip 注意
GraalVM `native-image` 工具仅支持 Java 或 Kotlin 项目。Groovy 在很大程度上依赖于反射，而 GraalVM 仅支持部分反射。
:::

要开始使用 GraalVM，首先要通过[入门指南](https://www.graalvm.org/docs/getting-started/)安装 GraalVM SDK，或者使用 [Sdkman!](https://sdkman.io/)。

## 14.4.1 微服务作为 GraalVM 本地镜像

**Micronaut 和 GraalVM 入门**

自 Micronaut 2.2 起，任何 Micronaut 应用程序都可以使用 Micronaut Gradle 或 Maven 插件构建成本地镜像。要开始使用，请创建一个新的应用程序：

*创建 GraalVM 原生微服务*

```bash
$ mn create-app hello-world
```

你可以使用 `--build maven` 来构建 Maven。

**使用 Docker 构建本地镜像**

要使用 Gradle 和 Docker 构建本地镜像，请运行：

*使用 Docker 和 Gradle 构建本地镜像*

```bash
$ ./gradlew dockerBuildNative
```

要使用 Maven 和 Docker 构建本地镜像，请运行：

*使用 Docker 和 Maven 构建本地镜像*

```bash
$ ./mvnw package -Dpackaging=docker-native
```

**在不使用 Docker 的情况下构建本地镜像**

要在不使用 Docker 的情况下构建本地镜像，请通过入门指南或使用 Sdkman! 安装 GraalVM SDK：

*使用 SDKman 安装 GraalVM 22.0.0.2*

```bash
$ sdk install java 22.0.0.2.r11-grl
$ sdk use java 22.0.0.2.r11-grl
```

本机映像工具是从 GraalVM 基本发行版中提取出来的，以插件形式提供。要安装它，请运行：

*安装 `native-image` 工具*

```bash
$ gu install native-image
```

现在，你可以运行 `nativeCompile` 任务，用 Gradle 构建本地镜像：

*使用 Gradle 创建本地镜像*

```bash
$ ./gradlew nativeCompile
```

本地镜像将在 `build/native/nativeCompile` 目录中构建。

要使用 Maven 和 Micronaut Maven 插件创建本地镜像，请使用 `native-image` 打包格式：

*使用 Maven 创建本地镜像*

```bash
$ ./mvnw package -Dpackaging=native-image
```

会在 `target` 目录下生成本地镜像。

然后，就可以从构建本地镜像的目录中运行本地镜像。

*运行本地镜像*

```bash
$ ./hello-world
```

**理解 Micronaut 和 GraalVM**

Micronaut 本身并不依赖于反射或动态类加载，因此它能自动与 GraalVM 本机配合使用，不过 Micronaut 使用的某些第三方库可能需要额外输入反射的使用方法。

Micronaut 包含一个注解处理器，可帮助生成反射配置，并本地镜像工具自动获取：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut:micronaut-graal")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut</groupId>
        <artifactId>micronaut-graal</artifactId>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

该处理器会生成实现 [GraalReflectionConfigurer](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/graal/GraalReflectionConfigurer.html) 接口的附加类，并以编程方式注册反射配置。

例如以下类：

```java
package example;

import io.micronaut.core.annotation.ReflectiveAccess;

@ReflectiveAccess
class Test {
    ...
}
```

通过上面的示例，`example.Test` 的公共方法、声明字段和声明构造函数都被注册为反射访问。

如果你有更高级的要求，只希望包含某些字段或方法，可在任何构造函数、字段或方法上使用注解，只包含特定字段、构造函数或方法。

**为反射访问添加其他类**

为了通知 Micronaut 在生成的反射配置中包含其他类，有许多注解可用，包括
- [@ReflectiveAccess](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/annotation/ReflectiveAccess.html) —— 一个注解，可以在特定类型、构造函数、方法或字段上声明，以便仅对注解元素启用反射访问。
- [@TypeHint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/annotation/TypeHint.html) —— 一种注解，允许对一种或多种类型的反射访问进行批量配置
- [@ReflectionConfig](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/annotation/ReflectionConfig.html) —— 一种可重复的注解，可直接模拟 GraalVM 反射配置 JSON 格式

`@ReflectiveAccess` 注解通常用于特定类型、构造函数、方法或字段，而后两者通常用于模块或 `Application` class，以包含需要反射的类。例如，下面是 Micronaut 的 Jackson 模块中的 @TypeHint：

*使用 @TypeHint 注解*

```java
@TypeHint(
    value = { (1)
        PropertyNamingStrategy.UpperCamelCaseStrategy.class,
        ArrayList.class,
        LinkedHashMap.class,
        HashSet.class
    },
    accessType = TypeHint.AccessType.ALL_DECLARED_CONSTRUCTORS (2)
)
```

1. `value` 成员指定哪些类需要反射。
2. `accessType` 成员指定是否只需要类加载访问，还是需要对所有公共成员进行完全反射。

也可以使用 `@ReflectionConfig` 注解，该注解可重复使用，并允许对每种类型进行不同的配置：

*使用 `@ReflectionConfig` 注解*

```java
@ReflectionConfig(
    type = PropertyNamingStrategy.UpperCamelCaseStrategy.class,
    accessType = TypeHint.AccessType.ALL_DECLARED_CONSTRUCTORS
)
@ReflectionConfig(
    type = ArrayList.class,
    accessType = TypeHint.AccessType.ALL_DECLARED_CONSTRUCTORS
)
@ReflectionConfig(
    type = LinkedHashMap.class,
    accessType = TypeHint.AccessType.ALL_DECLARED_CONSTRUCTORS
)
@ReflectionConfig(
    type = HashSet.class,
    accessType = TypeHint.AccessType.ALL_DECLARED_CONSTRUCTORS
)
```

**生成本地镜像**

GraalVM 的 `native-image` 命令可生成本地镜像。你可以手动使用该命令生成本地镜像。例如

*`native-image` 命令*

```bash
native-image --class-path build/libs/hello-world-0.1-all.jar (1)
```

1. `class-path` 参数指的是 Micronaut shaded JAR

镜像构建完成后，使用本地镜像名称运行应用程序：

*运行本地应用程序*

```bash
$ ./hello-world
15:15:15.153 [main] INFO  io.micronaut.runtime.Micronaut - Startup completed in 14ms. Server Running: http://localhost:8080
```

如您所见，本机图像启动只需几毫秒即可完成，内存消耗不包括 JVM 的开销（一个本机 Micronaut 应用程序仅需 20 MB 内存即可运行）。

**生成资源文件**

从 Micronaut 3.0 开始，自动生成 `resource-config.json` 文件已成为 [Gradle](https://github.com/micronaut-projects/micronaut-gradle-plugin) 和 [Maven](https://github.com/micronaut-projects/micronaut-maven-plugin) 插件的一部分。

## 14.4.2 GraalVM 和 Micronaut 常见问题

**Micronaut 如何在 GraalVM 上运行？**

Micronaut 具有依赖注入（Dependency Injection）和面向切面编程（Aspect-Oriented Programming）运行时，不使用反射。这使得 Micronaut 应用程序更容易在 GraalVM 上运行，因为在本地镜像（Native Images）中的[反射](https://github.com/oracle/graal/blob/master/docs/reference-manual/native-image/Reflection.md)存在[兼容性](https://github.com/oracle/graal/blob/master/docs/reference-manual/native-image/Compatibility.md)问题。

**如何让使用 picocli 的 Micronaut 应用程序在 GraalVM 上运行？**

Picocli 提供了一个 picocli-codegen 模块，其中包含一个用于生成 GraalVM 反射配置文件的工具。该工具可以手动运行，也可以作为构建过程的一部分自动运行。该模块的 README 中包含使用说明，以及配置 Gradle 和 Maven 以自动生成 cli-reflect.json 文件的代码片段。运行原生镜像工具时，将生成的文件添加到 -H:ReflectionConfigurationFiles 选项中。

**其他第三方库怎么办？**

Micronaut 无法保证第三方库可以在 GraalVM SubstrateVM 上运行，这取决于每个库是否实现了支持。

**我收到一个 "类 XXX 以反射方式实例化...... "的异常。异常。我该怎么办？**

如果出现以下错误：

```bash
Class myclass.Foo[] is instantiated reflectively but was never registered. Register the class by using org.graalvm.nativeimage.RuntimeReflection
```

你可能需要手动调整生成的 `reflect.json` 文件。对于常规类，你需要在数组中添加一个条目：

```json
[
    {
        "name" : "myclass.Foo",
        "allDeclaredConstructors" : true
    },
    ...
]
```

对于数组，必须使用 Java JVM 内部数组表示法。例如：

```json
[
    {
        "name" : "[Lmyclass.Foo;",
        "allDeclaredConstructors" : true
    },
    ...
]
```

**如果我想用 `-Xmx` 设置堆的最大大小，但却出现了 `OutOfMemoryError`（内存不足错误），该怎么办？**

如果在用于构建本地镜像的 Dockerfile 中设置堆的最大大小，很可能会出现类似下面的运行时错误：

```bash
java.lang.OutOfMemoryError: Direct buffer memory
```

问题在于，Netty 尝试使用 `io.netty.allocator.pageSize` 和 `io.netty.allocator.maxOrder` 的默认设置为每个分块分配 16MB 内存：

```java
int defaultChunkSize = DEFAULT_PAGE_SIZE << DEFAULT_MAX_ORDER; // 8192 << 11 = 16MB
```

最简单的解决方案是在 Dockerfile 的入口点中明确指定 `io.netty.allocator.maxOrder`。使用 `-Xmx64m` 的工作示例：

```bash
ENTRYPOINT ["/app/application", "-Xmx64m", "-Dio.netty.allocator.maxOrder=8"]
```

如果想更进一步，还可以尝试使用 `io.netty.allocator.numHeapArenas` 或 `io.netty.allocator.numDirectArenas`。有关 Netty 的 `PooledByteBufAllocator` 的更多信息，参阅[官方文档](https://netty.io/4.1/api/io/netty/buffer/PooledByteBufAllocator.html)。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#graal)

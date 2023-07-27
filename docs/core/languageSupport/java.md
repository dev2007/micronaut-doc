---
sidebar_position: 10
---

# 14.1 Java 版 Micronaut

对于 Java，Micronaut 使用 Java [BeanDefinitionInjectProcessor](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/annotation/processing/BeanDefinitionInjectProcessor.html) 注解处理器在编译时处理类，并生成 [BeanDefinition](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/inject/BeanDefinition.html) 类。

这样做的主要好处是，你在编译时会付出一点代价，但在运行时，Micronaut 基本上是无反射的、快速的，而且只消耗很少的内存。

## 14.1.1 将 Micronaut 与 Java 9+ 结合使用

Micronaut 是用 Java 8 构建的，但在 Java 9 及以上版本中也能正常运行。Micronaut 生成的类与同一包中的现有类并存，因此不会违反任何有关 Java 模块系统的规定。

使用 Java 9 及以上版本的 Micronaut 时有一些注意事项。

**javax.annotation 包**

:::note 注意
*使用 CLI*

如果你使用 Micronaut CLI 创建项目，如果你使用 Java 9+，`javax.annotation` 依赖会自动添加到你的项目中。
:::

`javax.annotation` 包括 `@PostConstruct`、`@PreDestroy` 等，已从 JDK 核心移到一个模块中。一般来说，应避免使用此软件包中的注解，而应使用 `jakarta.annotation` 的等价注解。

## 14.1.2 使用 Gradle 进行增量注解处理

Micronaut 支持 [Gradle 增量注解处理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)，只编译已变更的类，避免了完全重新编译，从而加快了构建速度。

不过，由于 Micronaut 允许定义需要配置处理的自定义元注解（例如，定义[自定义 AOP 通知](/core/aop.html)），因此该支持默认是禁用的。

下面的示例演示了如何为 `com.example 包下定义的注解启用和配置增量注解处理：

*启用增量注解处理*

```groovy
tasks.withType(JavaCompile) {
    options.compilerArgs = [
        '-Amicronaut.processing.incremental=true',
        '-Amicronaut.processing.annotations=com.example.*',
    ]
}
```

:::warning 警告
如果你不启用自定义注解的处理功能，Micronaut 将忽略这些注解，这可能会破坏你的应用程序。
:::

## 14.1.3 使用 Project Lombok

[Project Lombok](https://projectlombok.org/) 是一个流行的 Java 库，它通过注解处理器为 Java 语言添加了许多有用的 AST 转换。

由于 Micronaut 和 Lombok 都使用注解处理器，因此在配置 Lombok 时必须特别注意确保 Lombok 处理器先于 Micronaut 处理器运行。

如果使用 Gradle，请添加以下依赖：

*在 Gradle 中配置 Lombok*

```groovy
compileOnly 'org.projectlombok:lombok:1.18.24'
annotationProcessor "org.projectlombok:lombok:1.18.24"
...
// Micronaut processor defined after Lombok
annotationProcessor "io.micronaut:micronaut-inject-java"
```

或者使用 Maven：

*在 Maven 中配置 Lombok*

```xml
<dependencies>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.24</version>
    <scope>provided</scope>
  </dependency>
</dependencies>
...
<annotationProcessorPaths combine.self="override">
  <path>
    <!-- must precede micronaut-inject-java -->
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.24</version>
  </path>
  <path>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-inject-java</artifactId>
    <version>${micronaut.version}</version>
  </path>
    <path>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-validation</artifactId>
    <version>${micronaut.version}</version>
  </path>
</annotationProcessorPaths>
```

:::tip 注意
在这两种情况下（Gradle 和 Maven），Micronaut 处理器必须配置在 Lombok 处理器之后。颠倒所声明的依赖关系的顺序将不起作用。
:::

## 14.1.4 配置 IDE

如果你依赖配置的构建工具（Gradle 或 Maven）来构建应用程序，你可以使用任何集成开发环境来开发 Micronaut 应用程序。

不过，在集成开发环境中运行测试目前只能使用 [IntelliJ IDEA](https://www.jetbrains.com/idea) 或 Eclipse 4.9 或更高版本。

有关如何配置 IntelliJ 和 Eclipse 的详细信息，参阅快速入门中的[IDE 设置](/core/quickstart#23-设置-ide)部分。

## 14.1.5 保留参数名称

默认情况下，Java 在编译时不会保留方法参数的参数名数据。如果你没有明确定义参数名，而依赖于已经编译好的外部 JAR，这可能会给 Micronaut 带来问题。

考虑一下这个接口：

*客户端接口*

```java
interface HelloOperations {
    @Get("/hello/{name}")
    String hello(String name);
}
```

在编译时，参数名 `name` 会丢失，在编译时会变成 `arg0`，以后通过反射读取时也会变成 `arg0`。要避免这个问题，有两种选择。您可以显式声明参数名：

*客户端接口*

```java
interface HelloOperations {
    @Get("/hello/{name}")
    String hello(@QueryValue("name") String name);
}
```

或者，建议你在编译所有字节码时在 `javac` 中加入 `-parameters` 标志。参阅[获取方法参数的名称](https://docs.oracle.com/javase/tutorial/reflect/member/methodparameterreflection.html)。以 `build.gradle` 为例：

*build.gradle*

```groovy
compileJava.options.compilerArgs += '-parameters'
```

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#java)

---
description: Micronaut AOT
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut AOT,AOT]
---

# Micronaut AOT

## 1. 简介

Micronaut AOT 是一个为 Micronaut 应用程序和库实现提前（AOT）优化的框架。这些优化包括在构建时计算通常在运行时完成的事情。这包括但不限于：

- 预解析配置文件（yaml、properties……​)
- 预先计算 bean 要求，以减少启动时间
- 使用特定环境的“优化（optimized）”版本执行类的替换

Micronaut AOT 可以为不同的环境生成特定的优化，特别是，它可以区分 JIT 模式（传统 JVM 应用程序）和本地模式（使用 GraalVM `native-image` 编译的应用程序）所需的优化。

:::caution 警告
与其他 Micronaut 模块不同，Micronaut AOT 不是一个需要添加到应用程序中的依赖项：它是一个需要与构建过程集成的框架：它通常旨在集成到构建工具插件中。
:::

[Micronaut Gradle 插件](https://micronaut-projects.github.io/micronaut-gradle-plugin/latest/#_micronaut_aot_plugin)和 [Micronaut Maven 插件](https://micronaut-projects.github.io/micronaut-maven-plugin/latest/examples/aot.html)都集成了 Micronaut AOT。

## 2. 发布历史

对于此项目，你可以在此处找到版本列表（带发行说明）
https://github.com/micronaut-projects/micronaut-aot/releases

## 3. 快速开始

### 适用性

:::tip 注意
Micronaut AOT 是一个实验项目。使用时风险自负。
:::

Micronaut AOT 的目标是为特定的部署环境创建一个优化的“二进制”。这并**不是**为了让开发体验更快：因为构建时优化需要对应用程序进行深入分析，所以如果使用优化的二进制文件，实际上会使本地开发更慢。

你应该将 Micronaut AOT 视为 GraalVM `native-image` 工具：一个“编译器”，它可以针对特定的运行时生成不同的应用程序。也就是说，根据启用的优化，AOT 优化的二进制文件可能在特定的部署环境中工作，也可能不工作。

### Micronaut AOT 项目

Micronaut AOT 项目由 4 个主要模块组成：

- `micronaut-aot-core` 提供了用于实现“AOT 优化器”或代码生成器的 API。
- `micronaut-aot-api` 公开了用于与 AOT 编译器交互的公共 API。它主要由 `MicronautAotOptimizer` 类组成，该类负责通过服务加载加载不同的 AOT 模块，然后驱动 AOT 进程。
- `micronaut-aot-std-optimizers` 实现了许多标准的 Micronaut AOT 优化器。
- `micronaut-cli` 是负责调用 AOT 编译器的命令行工具。建议通过 CLI 工具与 Micronaut AOT 集成，以便正确隔离流程。

### 如何运作

**优化过程**

Micronaut AOT 是一种后处理工具。我们的意思是，它获取常规 Micronaut 应用程序编译的输出，然后对此进行分析，并生成新的类、资源等，然后用于创建*新的二进制*（jar、原生二进制文件……​)。

简而言之，Micronaut AOT 的输入是：

- 应用程序运行时 classpath
- Micronaut AOT 运行时（包括 AOT 优化器）
- AOT 优化器配置（包括目标运行时，例如 JIT 与本机）

它输出为：

- 由源文件及其编译的（`.class`）版本生成
- 生成的资源文件
- 应该从最终二进制文件中删除的资源列表（例如，如果用 Java 配置替换 YAML 文件，则会生成一个类，但我们知道在最终二进制文件中将不再需要 YAML 文件）
- 日志文件（用于诊断 AOT 过程中发生的情况）

`MicronautAotOptimizer` 类是代码生成器的一个特例，它集成了动态加载的 AOT 优化器，并生成一个 `ApplicationContextConfigurer` 来初始化优化。

然后，集成器有责任将这些输出用于生成不同的二进制文件。

**用户代码加载**

为了执行优化，使用了所谓的优化器（或 AOT 模块）。这些模块需要访问应用程序上下文，以便例如确定在特定的部署环境中是否需要 bean。或者，他们可能需要访问从外部源动态加载的配置（想想分布式配置），以生成静态配置。

因此，AOT 编译器需要在与应用程序代码本身相同的类加载器中执行。这就是为什么AOT编译器有两种不同的类路径：

- *应用* classpath 对应于应用程序运行时 classpath。从技术上讲，它是先前编译的结果加上应用程序（或库）所需的所有可传递依赖项。
- *AOT* classpath，它是 AOT 编译器和 AOT 优化器的 classpath。

**应用程序上下文配置程序的角色**

给定应用程序类路径，AOT 编译器将实例化 `ApplicationContext`，它将自动应用所有上下文配置器（实现 `ApplicationContextConfigurer` 接口并用 `@ContextConfigurer` 注解的类）。这就是 AOT 编译器将如何“了解”用户可以完成的特定应用程序上下文自定义。

因此，重要的是要理解 AOT 编译器无法实现任意的应用程序上下文自定义。例如，在以下代码中：

```java
class Application {
    public static void main(String...args) {
        Micronaut.build()
            .deduceEnvironment(false)
            .mainClass(Application.class)
            .start();
    }
}
```

有一个对 AOT 编译器不透明的 `deduceEnvironment()` 调用：它无法知道应用程序是以这种方式配置的（为此，它实际上必须启动应用程序并执行运行时拦截，这将过于昂贵或不可能）。

因此，所有自定义都需要使用不同的模式来完成：

```java
class Application {
    @ContextConfigurer
    public static class MyConfigurer implements ApplicationContextConfigurer {
        @Override
        public void configure(ApplicationContextBuilder context) {
            context.deduceEnvironment(false);
        }
    }

    public static void main(String... args) {
        Micronaut.run(Application.class, args);
    }
}
```

因为 `@ContextConfigurer` 确保创建的任何应用程序上下文都将看到应用的自定义程序，所以 AOT 编译器为其内部使用创建的应用程序上下文将看到自定义程序。

### 实现 AOT 优化器

**当前能力**

既然我们了解了 AOT 优化环境是如何引导的，我们就可以开始实现 AOT 优化器了。

优化器可以执行以下一项或多项操作：

- 生成静态初始化程序，这些初始化程序将通过 `ApplicationContextConfigurer` 机制自动加载
- 生成新的源文件
- 生成新的资源文件
- 用另一个类替换一个类
- 过滤掉资源

新功能将作为 AOT 开发的一部分。

**代码生成器**

AOT 优化的核心是代码生成器。代码生成器需要实现 `AOTCodeGenerator` 接口，并使用 `@AOTModule` 进行注解。

`AOTModule` 注解负责提供有关代码生成器的元数据，包括：

- `id` 用于标识代码生成器，并通过配置启用/禁用它
- 许多选项（`@Option`），用于描述代码生成器采用的参数（这些参数是通过配置提供的）
- 可能依赖于其他代码生成器（例如，一些代码生成器只有在另一个代码生成器之后执行时才能正常工作）
- 应用于的目标运行时

代码生成器通过 `AOTContext` 接口贡献代码，该接口允许：

- 获取生成的类的包的名称
- 正在注册生成的代码（源文件……​)
- 获取对 `ApplicationContext` 的访问权限
- 共享状态
- 获取对目标运行时的访问权限

例如，生成资源文件的简单代码生成器可以声明为：

```java
@AOTModule(
    id = MyResourceGenerator.ID,
    options = {
        @Option(name = "greeter.message", sampleValue = "Hello, world!", description = "The message to write")
    }
)
public class MyResourceGenerator implements AOTCodeGenerator {
    public static final String ID = "my.resource.generator";

    @Override
    public void generate(AOTContext context) {
        context.registerResource("/hello.txt", file -> {
            try (PrintWriter writer = new PrintWriter(file)) {
                String message = context.getConfiguration()
                    .mandatoryValue("greeter.message");
                writer.println(context.getOption("greeter.message"));
            }
        });
    }
}
```

然后在配置文件中，代码生成器将以这种方式进行配置：

```yaml
my.resource.generator.enabled=true
greeter.message=Hello, world!
```

:::tip 注意
不同的代码生成器可能共享相同的选项值：它是合法的，但通常只是必需的（例如，如果有基于目标运行时的特定优化的不同实现）。
:::

## 4. 仓库

你可以在此仓库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-aot

> [英文链接](https://micronaut-projects.github.io/micronaut-aot/1.1.2/guide/)

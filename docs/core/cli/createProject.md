---
sidebar_position: 10
---

# 18.1 创建一个项目

创建项目是 CLI 的主要用途。创建新项目的主要命令是 create-app，它会创建一个通过 HTTP 通信的标准服务器应用程序。有关其他类型的应用程序，请参阅下面的文档。

*表 1.Micronaut CLI 项目创建命令*

<table>
  <tr>
    <th>命令</th>
    <th>描述</th>
    <th>选项</th>
    <th>示例</th>
  </tr>
  <tr>
    <td><code>create-app</code></td>
    <td>创建基本的 Micronaut 应用程序。</td>
    <td>
        <li>-l, --lang</li>
        <li> -t, --test</li>
        <li>-b, --build</li>
        <li>-f, --features</li>
        <li>-i, --inplace</li>
    </td>
    <td>
        <code>
            mn create-app my-project --features mongo-reactive,security-jwt --build maven
        </code>
    </td>
  </tr>
  <tr>
    <td><code>create-cli-app</code></td>
    <td>创建 Micronaut 命令行应用程序。</td>
    <td>
        <li>-l, --lang</li>
        <li> -t, --test</li>
        <li>-b, --build</li>
        <li>-f, --features</li>
        <li>-i, --inplace</li>
    </td>
    <td>
        <code>
            mn create-cli-app my-project --features http-client,jdbc-hikari --build maven --lang kotlin --test kotest
        </code>
    </td>
  </tr>
  <tr>
    <td><code>create-function-app</code></td>
    <td>创建 Micronaut 无服务器函数，默认使用 AWS。</td>
    <td>
        <li>-l, --lang</li>
        <li> -t, --test</li>
        <li>-b, --build</li>
        <li>-f, --features</li>
        <li>-i, --inplace</li>
    </td>
    <td>
        <code>
            mn create-function-app my-lambda-function --lang groovy --test spock
        </code>
    </td>
  </tr>
  <tr>
    <td><code>create-messaging-app</code></td>
    <td>创建只通过消息协议通信的 Micronaut 应用程序。默认使用 Kafka，但可通过 <code>--features rabbitmq</code> 切换为 RabbitMQ。</td>
    <td>
        <li>-l, --lang</li>
        <li> -t, --test</li>
        <li>-b, --build</li>
        <li>-f, --features</li>
        <li>-i, --inplace</li>
    </td>
    <td>
        <code>
            mn create-messaging-app my-broker --lang groovy --test spock
        </code>
    </td>
  </tr>
  <tr>
    <td><code>create-grpc-app</code></td>
    <td>创建一个使用 gRPC 的 Micronaut 应用程序。</td>
    <td>
        <li>-l, --lang</li>
        <li> -t, --test</li>
        <li>-b, --build</li>
        <li>-f, --features</li>
        <li>-i, --inplace</li>
    </td>
  <td>
    <code>
    mn create-grpc-app my-grpc-app --lang groovy --test spock
    </code>
  </td>
  </tr>
</table>

## 创建命令标志

`create-*` 命令可生成一个基本的 Micronaut 项目，并可选择指定功能、语言、测试框架和构建工具的标志。除功能外，所有项目都包含一个用于启动应用程序的默认 `Application` 类。

*表 2.标志*

|标志|描述|示例|
|--|--|--|
|`-l`、`--lang`|项目使用的语言（`java`、`groovy`、`kotlin` 之一，默认为 `java`）|`--lang groovy`|
|`-t`、`--test`|项目要使用的测试框架（`junit` 和 `spock` 之一，默认为 `junit`）|`--test spock`|
|`-b`、`--build`|构建工具（`gradle`、`gradle_kotlin`、`maven` 中的一种—— `java` 和 `groovy` 语言默认使用 `gradle`；`kotlin` 语言默认使用 `gradle_kotlin`）。|`--build maven`|
|`-f`、`--features`|用于项目的功能，逗号分隔|`--features security-jwt,mongo-gorm` 或 `-f security-jwt -f mongo-gorm`|
|`-i`、`--inplace`|如果存在，则在当前目录下生成项目（如果设置了该标志，项目名称为可选项）|`--inplace`|

创建完成后，可以使用应用程序类或相应的构建工具任务启动应用程序。

*启动 Gradle 项目*

```bash
$ ./gradlew run
```

*启动 Maven 项目*

```bash
$ ./mvnw mn:run
```

**语言/测试特性**

默认情况下，创建命令会生成一个 Java 应用程序，并将 JUnit 配置为测试框架。所有选择的选项和应用的功能都作为属性保存在 `micronaut-cli.yml` 文件中，如下所示：

*micronaut-cli.yml*

```yaml
applicationType: default
defaultPackage: com.example
testFramework: junit
sourceLanguage: java
buildTool: gradle
features: [annotation-api, app-name, application, gradle, http-client, java, junit, logback, netty-server, shade, yaml]
```

有些命令依赖该文件中的数据来决定是否应该执行。例如，`create-kafka-listener` 命令要求 `kafka` 是列表中的功能之一。

:::tip 注意
CLI 会使用 `micronaut-cli.yml` 中的值生成代码。项目生成后，你可以编辑这些值来更改项目默认值，但必须提供所需的依赖项和/或配置，以使用你选择的语言/框架。例如，你可以将 `testFramework` 属性更改为 `spock`，使 CLI 在运行命令（如 `create-controller`）时生成 Spock 测试，但你需要在构建时添加 Spock 依赖。
:::

**Groovy**

要创建支持 Groovy 的应用程序（默认情况下使用 Spock），请通过 `lang` 标志提供相应的语言：

```bash
$ mn create-app my-groovy-app --lang groovy
```

这会在项目中加入 Groovy 和 Spock 依赖，并在 `micronaut-cli.yml` 中写入相应的值。

**Kotlin**

要创建支持 Kotlin 的应用程序（默认使用 Kotest），请通过 `lang` 标志提供相应的语言：

```bash
$ mn create-app my-kotlin-app --lang kotlin
```

这会在项目中加入 Kotlin 和 Kotest 依赖，并在 `micronaut-cli.yml` 中写入适当的值。

**构建工具**

默认情况下，`create-app` 会创建一个 Gradle 项目，并在项目根目录中生成 `build.gradle` 文件。要使用 Maven 构建工具创建应用程序，可通过 `build` 标记提供相应选项：

```bash
$ mn create-app my-maven-app --build maven
```

---

## Create-Cli-App

`create-cli-app` 命令生成 [Micronaut 命令行应用程序](/core/commandLineApps)项目，可选择指定语言、测试框架、功能、配置文件和构建工具的标志。默认情况下，项目包含支持命令行选项解析的 `picocli` 功能。该项目将包括一个 `*Command` 类（基于项目名称，例如 `hello-world` 生成 `HelloWorldCommand`），以及一个相关的测试，该测试将实例化该命令，并验证它是否能解析命令行选项。

创建完成后，就可以使用 `*Command` 类或相应的构建工具任务启动应用程序。

*启动 Gradle 项目*

```bash
$ ./gradlew run
```

*启动 Maven 项目*

```bash
$ ./mvnw mn:run
```

---

## 创建函数应用

`create-function-app` 命令会生成一个 [Micronaut 函数](/core/serverlessFunctions)项目，该项目针对无服务器环境进行了优化，并带有可选标记，用于指定语言、测试框架、功能和构建工具。该项目将包括一个 `*Function` 类（基于项目名称，例如 `hello-world` 生成 `HelloWorldFunction`），以及一个相关测试，该测试将实例化该函数，并验证它是否能接收请求。

:::tip 注意
目前，Micronaut 函数支持的云提供商有 AWS Lambda、Micronaut Azure 和 Google Cloud。要使用其他提供商，请在特性中添加一个：`--features azure-function` 或 `--features google-cloud-function` 。
:::

---

## 贡献

CLI 源代码位于 https://github.com/micronaut-projects/micronaut-starter。有关如何贡献的信息和其他资源都在这里。

## 18.1.1 版本比较

查看 Micronaut 新版本的版本依赖更新和其他更改的最简单方法是使用旧版本和新版本的 `mn` CLI 生成一个干净的应用程序，然后比较这些目录。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#createProject)

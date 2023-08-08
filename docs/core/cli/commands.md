---
sidebar_position: 30
---

# 18.3 命令

例如，你可以使用帮助标志查看可用命令的完整列表：

```bash
$ mn -h
Usage: mn [-hvVx] [COMMAND]
Micronaut CLI command line interface for generating projects and services.
Application generation commands are: (1)

*  create-app NAME
*  create-cli-app NAME
*  create-function-app NAME
*  create-grpc-app NAME
*  create-messaging-app NAME

Options:
  -h, --help         Show this help message and exit.
  -v, --verbose      Create verbose output.
  -V, --version      Print version information and exit.
  -x, --stacktrace   Show full stack trace when exceptions occur.

Commands: (2)
  create-app               Creates an application
  create-cli-app           Creates a CLI application
  create-function-app      Creates a Cloud Function
  create-grpc-app          Creates a gRPC application
  create-messaging-app     Creates a messaging application
  create-job               Creates a job with scheduled method
  create-bean              Creates a singleton bean
  create-websocket-client  Creates a Websocket client
  create-client            Creates a client interface
  create-controller        Creates a controller and associated test
  feature-diff             Produces the diff of an original project with an original project with
                             additional features.
  create-websocket-server  Creates a Websocket server
  create-test              Creates a simple test for the project's testing framework
```

1. 在这里，你可以看到项目生成命令列表
2. 此处列出了当前目录下的所有可用命令
3. **注意**：项目创建命令（始终可用）之后列出的内容取决于当前目录上下文

所有代码生成命令都遵循在 `micronaut-cli.yml` 中定义的值。例如，假设有如下的 `micronaut-cli.yml` 文件。

*micronaut-cli.yml*

```yaml
defaultPackage: example
---
testFramework: spock
sourceLanguage: java
```

根据上述设置，`create-bean` 命令（默认情况下）会在 `example` 包中生成一个 Java 类和相关的 Spock 测试。命令接受参数，这些默认值可按命令进行重写。

## 基本命令

这些命令在 micronaut 项目中始终可用。

**Create-Bean**

*表 1.Create-Bean 标志*

|标志|描述|示例|
|--|--|--|
|`-l`、`--lang`|Bean 类使用的语言|`--lang groovy`|
|`-f`、`--force`|是否覆盖现有文件|`--force`|

`create-bean` 命令会生成一个简单的 [Singleton](https://docs.oracle.com/javaee/6/api/javax/inject/Singleton.html) 类。它不会创建相关的测试。

```bash
$ mn create-bean EmailService
| Rendered template Bean.java to destination src/main/java/example/EmailService.java
```

**Create-Job**

*表 2.Create-Job 标志*

|标志|描述|示例|
|--|--|--|
|`-l`、`--lang`|任务类使用的语言|`--lang groovy`|
|`-f`、`--force`|是否覆盖现有文件|`--force`|

`create-job` 命令生成一个简单的 [Scheduled](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/scheduling/annotation/Scheduled.html) 类。它遵循 `*Job` 惯例生成类名。它不会创建相关的测试。

```bash
$ mn create-job UpdateFeeds --lang groovy
| Rendered template Job.groovy to destination src/main/groovy/example/UpdateFeedsJob.groovy
```

---

## HTTP 相关命令

**Create-Controller**

*表 3.Create-Controller 标志*

|标志|描述|示例|
|--|--|--|
|`-l`、`--lang`|控制器使用的语言|`--lang groovy`|
|`-f`、`--force`|是否覆盖现有文件|`--force`|

`create-controller` 命令生成一个 [Controller](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Controller.html) 类。它遵循 `*Controller` 惯例生成类名。它会创建一个关联测试，运行应用程序并实例化一个 HTTP 客户端，该客户端可以向控制器发出请求。

```bash
$ mn create-controller Book
| Rendered template Controller.java to destination src/main/java/example/BookController.java
| Rendered template ControllerTest.java to destination src/test/java/example/BookControllerTest.java
```

**Create-Client**

*表 4.Create-Client 标志*

|标志|描述|示例|
|--|--|--|
|`-l`、`--lang`|客户端使用的语言|`--lang groovy`|
|`-f`、`--force`|是否覆盖现有文件|`--force`|

`create-client` 命令生成一个简单的 [Client](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/annotation/Client.html) 接口。它遵循 `*Client` 惯例生成类名。它不会创建相关的测试。

```bash
$ mn create-client Book
| Rendered template Client.java to destination src/main/java/example/BookClient.java
```

**Create-Websocket-Server**

*表 5.Create-Websocket-Server 标志*

|标志|描述|示例|
|--|--|--|
|`-l`、`--lang`|服务器使用的语言|`--lang groovy`|
|`-f`、`--force`|是否覆盖现有文件|`--force`|

`create-websocket-server` 命令会生成一个简单的 [ServerWebSocket](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/ServerWebSocket.html) 类。它遵循 `*Server` 惯例生成类名。它不会创建相关的测试。

```bash
$ mn create-websocket-server MyChat
| Rendered template WebsocketServer.java to destination src/main/java/example/MyChatServer.java
```

**Create-Websocket-Client**

*表 6.Create-Websocket-Client 标志*

|标志|描述|示例|
|--|--|--|
|`-l`、`--lang`|客户端使用的语言|`--lang groovy`|
|`-f`、`--force`|是否覆盖现有文件|`--force`|

`create-command` 命令会生成一个可作为 [picocli 命令](https://picocli.info/apidocs/picocli/CommandLine.Command.html)执行的独立应用程序。它遵循 `*Command` 惯例生成类名。它会创建一个相关测试，运行应用程序并验证命令行选项是否已设置。

```bash
$ mn create-command print
| Rendered template Command.java to destination src/main/java/example/PrintCommand.java
| Rendered template CommandTest.java to destination src/test/java/example/PrintCommandTest.java
```

此列表只是 Micronaut CLI 中代码生成命令的一小部分。要查看 CLI 中可用的所有上下文相关命令（以及它们在什么情况下适用），请查看 [micronaut-starter](https://github.com/micronaut-projects/micronaut-starter) 项目并查找扩展 `CodeGenCommand` 的类。`applies` 方法决定了命令是否可用。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#commands)

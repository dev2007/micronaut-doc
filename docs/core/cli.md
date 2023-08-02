---
sidebar_position: 180
---

# 18. Micronaut CLI

Micronaut CLI 是创建新 Micronaut 项目的推荐方式。CLI 包含生成特定类别项目的命令，允许你选择构建工具、测试框架，甚至选择应用中使用的语言。CLI 还提供生成控制器、客户端界面和无服务器功能等工件的命令。

:::note 提示
我们有一个网站可以用来生成项目，而不是 CLI。请访问 [Micronaut Launch](https://micronaut.io/launch/) 开始使用！
:::

在[计算机上安装 Micronaut](/core/quickstart#21-安装-cli) 后，可以使用 mn 命令调用 CLI。

```bash
$ mn create-app my-app
```

Micronaut CLI 项目可通过 `micronaut-cli.yml` 文件识别，如果是通过 CLI 生成的，该文件包含在项目根目录中。该文件包括项目的配置文件、默认软件包和其他变量。项目的默认软件包根据项目名称进行评估。

```bash
$ mn create-app my-demo-app
```

会导致默认包为 `my.demo.app`。

你可以在创建应用程序时提供自己的默认软件包，方法是在应用程序名称前加上软件包：

```bash
$ mn create-app example.my-demo-app
```

导致默认包成为 `example`。

## 交互模式

如果不带任何参数运行 `mn`，Micronaut CLI 会以交互模式启动。这是一种类似 shell 的模式，允许你运行多个 CLI 命令而无需重新初始化 CLI 运行时，尤其适合你使用代码生成命令（如 `create-controller`）、创建多个项目或只是探索 CLI 功能时使用。Tab 补全功能已启用，你可以按 TAB 键查看给定命令或标记的可能选项。

```bash
$ mn
| Starting interactive mode...
| Enter a command name to run. Use TAB for completion:
mn>
```

---

## 帮助和信息

使用命令上的帮助标志可以查看一般使用信息。

```bash
mn> create-app -h
Usage: mn create-app [-hivVx] [--list-features] [-b=BUILD-TOOL] [--jdk=<javaVersion>] [-l=LANG]
                     [-t=TEST] [-f=FEATURE[,FEATURE...]]... [NAME]
Creates an application
      [NAME]               The name of the application to create.
  -b, --build=BUILD-TOOL   Which build tool to configure. Possible values: gradle, gradle_kotlin,
                             maven.
  -f, --features=FEATURE[,FEATURE...]
  -h, --help               Show this help message and exit.
  -i, --inplace            Create a service using the current directory
      --jdk, --java-version=<javaVersion>
                           The JDK version the project should target
  -l, --lang=LANG          Which language to use. Possible values: java, groovy, kotlin.
      --list-features      Output the available features and their descriptions
  -t, --test=TEST          Which test framework to use. Possible values: junit, spock, kotest.
```

使用创建命令中的 `--list-features` 标志，可以查看可用功能列表。

```bash
mn> create-app --list-features
Available Features
(+) denotes the feature is included by default
  Name                             Description
  -------------------------------  ---------------
  Cache
  cache-caffeine                   Adds support for cache using Caffeine (https://github.com/ben-manes/caffeine)
  cache-ehcache                    Adds support for cache using EHCache (https://www.ehcache.org/)
  cache-hazelcast                  Adds support for cache using Hazelcast (https://hazelcast.org/)
  cache-infinispan                 Adds support for cache using Infinispan (https://infinispan.org/)
```

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#cli)

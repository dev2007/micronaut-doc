---
sidebar_position: 20
---

# 18.2 特性

功能包括额外的依赖和配置，以便在你的应用程序中启用特定功能。Micronaut 配置文件定义了大量功能，包括 Micronaut 提供的许多配置的功能，如[数据访问配置](/core/configurations/dataAccess)。

```bash
$ mn create-app my-demo-app --features mongo-reactive
```

这将为应用程序中的 [MongoDB Reactive Driver](https://mongodb.github.io/mongo-java-driver-reactivestreams) 添加必要的依赖和配置。无论使用哪条创建命令，都可以使用 `--list-features` 标志查看可用特性。

```bash
$ mn create-app --list-features # Output will be supported features for the create-app command
$ mn create-function-app --list-features # Output will be supported features for the create-function-app command, different from above.
```

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#features)

# Micronaut TOML

支持 Micronaut 框架的 TOML 配置格式。

## 1. 简介

[TOML](https://toml.io/en/) 是一种易读、易写、易解析的配置格式。

使用该模块，Micronaut 框架支持 TOML 格式的配置文件。这使得配置文件比 Java Properties 更容易阅读，解析速度也比 YAML 更快（而且不依赖缩进）。

## 2. 发布历史

你可以在此处找到此项目的发布列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-toml/releases

## 3. 快速入门

要在现有项目中添加对 TOML 的支持，应在构建配置中添加 Micronaut TOML 模块。例如：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.toml:micronaut-toml")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.toml</groupId>
    <artifactId>micronaut-toml</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后，你就可以开始使用 TOML 进行应用程序配置了：

*最小应用程序.toml*

```toml
[micronaut.application]
name = "example"
```

## 4. 仓库

你可以在此资源库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-toml

> [英文链接](https://micronaut-projects.github.io/micronaut-toml/latest/guide/)

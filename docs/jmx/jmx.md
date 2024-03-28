---
description: Micronaut JMX
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut JMX,JMX,java]

sidebar_position: 10
---

# Micronaut JMX

## 1. 简介

`micronaut-jmx` 模块支持通过 JMX 公开 Micronaut 管理端点。

将根据配置为管理 bean 服务器创建一个 bean。

*表 1. 为 [JmxConfiguration](https://micronaut-projects.github.io/micronaut-jmx/3.2.0/api/io/micronaut/configuration/jmx/JmxConfiguration.html) 配置属性*

|属性|类型|描述|
|--|--|--|
|jmx.agent-id|java.lang.String|设置代理 id。|
|jmx.domain|java.lang.String|设置用于创建新服务器的域。|
|jmx.add-to-factory|boolean|设置服务器是否应保留在工厂中。默认为 true。|
|jmx.ignore-agent-not-found|boolean|设置为在找不到代理时忽略异常。默认值为 false。|
|jmx.register-endpoints|boolean|设置是否应注册端点。默认为 true。|

## 2. 发布历史

对于此项目，你可以在此处找到发布列表（带发布说明）：

https://github.com/micronaut-projects/micronaut-jmx/releases

## 3. 设置 JMX

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.jmx:micronaut-jmx:3.2.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.jmx</groupId>
    <artifactId>micronaut-jmx</artifactId>
    <version>3.2.0</version>
</dependency>
```

  </TabItem>
</Tabs>

## 4. 端点

如果管理依赖项也在 classpath 上，那么默认情况下将为所有端点创建管理 bean。

## 5. 仓库

你可以在此仓库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-jmx

> [英文链接](https://micronaut-projects.github.io/micronaut-jmx/3.2.0/guide/)

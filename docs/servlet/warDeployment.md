---
sidebar_position: 40
---

# 4. WAR 部署

要将其部署为 WAR 文件，你需要对依赖项进行一些调整。

首先使你正在使用的服务端具有 `developmentOnly` 依赖项（或 Maven 中的 `provided`）：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

  <TabItem value="Gradle" label="Gradle">

```groovy
developmentOnly("io.micronaut.servlet:micronaut-http-server-jetty:3.3.5")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.servlet</groupId>
    <artifactId>micronaut-http-server-jetty</artifactId>
    <version>3.3.5</version>
    <scope>provided</scope>
</dependency>
```

  </TabItem>
</Tabs>

然后确保在构建配置中包含 `micronaut-servlet-engine` 依赖项：

<Tabs>

  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.servlet:micronaut-servlet-engine:3.3.5")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.servlet</groupId>
    <artifactId>micronaut-servlet-engine</artifactId>
    <version>3.3.5</version>
</dependency>
```

  </TabItem>
</Tabs>

然后更改你的构建配置以构建一个 WAR 文件。在 Gradle 中，这可以通过应用 WAR 插件来实现：

*应用 Gradle WAR 插件*

```groovy
plugins {
    id "war"
    id "application"
}
```

然后，你可以构建 WAR 文件，并根据容器提供的说明将其部署到 Servlet 容器中。

:::note 提示
Micronaut 将使用注册 [DefaultMicronautServlet](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/api/io/micronaut/servlet/engine/DefaultMicronautServlet.html) 实例的 [MicronautServletInitializer](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/api/io/micronaut/servlet/engine/initializer/MicronautServletInitializer.html) 加载。
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/guide/index.html#warDeployment)

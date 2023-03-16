---
sidebar_position: 60
---

# 6. Tomcat

要使用 [Tomcat](https://tomcat.apache.org/) 作为服务器，请添加以下依赖项：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.servlet:micronaut-http-server-tomcat:3.3.5")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.servlet</groupId>
    <artifactId>micronaut-http-server-tomcat</artifactId>
    <version>3.3.5</version>
</dependency>
```

  </TabItem>
</Tabs>

:::tip 注意
GraalVM 本地镜像支持 Tomcat
:::

:::tip 注意
如果你计划生成一个 WAR 文件，那么依赖应该是 `developmentOnly`。
:::

要自定义 Tomcat 服务器，可以使用以下配置属性：

*表 1. [TomcatConfiguration](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/api/io/micronaut/servlet/tomcat/TomcatConfiguration.html) 配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.server.tomcat.service|org.apache.catalina.Service||
|micronaut.server.tomcat.allow-trace|boolean||
|micronaut.server.tomcat.async-timeout|long||
|micronaut.server.tomcat.discard-facades|boolean||
|micronaut.server.tomcat.enable-lookups|boolean||
|micronaut.server.tomcat.max-cookie-count|int||
|micronaut.server.tomcat.max-parameter-count|int||
|micronaut.server.tomcat.max-post-size|int||
|micronaut.server.tomcat.max-save-post-size|int||
|micronaut.server.tomcat.parse-body-methods|java.lang.String||
|micronaut.server.tomcat.port|int||
|micronaut.server.tomcat.port-offset|int||
|micronaut.server.tomcat.proxy-name|java.lang.String||
|micronaut.server.tomcat.proxy-port|int||
|micronaut.server.tomcat.redirect-port|int||
|micronaut.server.tomcat.scheme|java.lang.String||
|micronaut.server.tomcat.secure|boolean||
|micronaut.server.tomcat.uriencoding|java.lang.String||
|micronaut.server.tomcat.use-body-encoding-for-uri|boolean||
|micronaut.server.tomcat.xpowered-by|boolean||
|micronaut.server.tomcat.use-ipvhosts|boolean||
|micronaut.server.tomcat.encoded-solidus-handling|java.lang.String||
|micronaut.server.tomcat.domain|java.lang.String||
|micronaut.server.tomcat.throw-on-failure|boolean||
|micronaut.server.tomcat.protocol|java.lang.String|使用的协议。默认为 `Defaults to org.apache.coyote.http11.Http11NioProtocol`。|
|micronaut.server.tomcat.attributes|java.util.Map|连接器属性|

或者你也可能注册一个 `BeanCreatedEventListener`：

*Tomcat Server 定制*

```java
import io.micronaut.context.event.BeanCreatedEvent;
import io.micronaut.context.event.BeanCreatedEventListener;
import org.apache.catalina.startup.Tomcat;
import jakarta.inject.Singleton;

@Singleton
public class TomcatServerCustomizer implements BeanCreatedEventListener<Tomcat> {
    @Override
    public Tomcat onCreated(BeanCreatedEvent<Tomcat> event) {
        Tomcat tomcat = event.getBean();
        // perform customizations...
        return tomcat;
    }
}
```

> [英文链接](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/guide/index.html#tomcat)

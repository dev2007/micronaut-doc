---
sidebar_position: 130
---

# 13. 日志

Micronaut 使用 [Slf4j](https://www.slf4j.org/) 来记录信息。通过 Micronaut Launch 创建的应用程序的默认实现是 [Logback](https://logback.qos.ch/)。但也支持任何其他 Slf4j 实现。

## 13.1 日志消息

要记录消息，使用 Slf4j `LoggerFactory` 为你的类获取一个记录器。

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoggerExample {

    private static Logger logger = LoggerFactory.getLogger(LoggerExample.class);

    public static void main(String[] args) {
        logger.debug("Debug message");
        logger.info("Info message");
        logger.error("Error message");
    }
}
```

## 13.2 配置

日志级别可通过配置文件（如 `application.yml`）（以及环境变量）中定义的带有 `logger.levels` 前缀的属性进行配置：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
logger.levels.foo.bar=ERROR
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
logger:
  levels:
    foo.bar: ERROR
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[logger]
  [logger.levels]
    "foo.bar"="ERROR"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
logger {
  levels {
    foo.bar = "ERROR"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  logger {
    levels {
      "foo.bar" = "ERROR"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "logger": {
    "levels": {
      "foo.bar": "ERROR"
    }
  }
}
```

  </TabItem>
</Tabs>

通过设置环境变量 `LOGGER_LEVELS_FOO_BAR`，可以实现相同的配置。请注意，目前还无法为 `foo.barBaz` 等非常规前缀设置日志级别。

**自定义日志回溯 XML 配置**

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
logger.config=custom-logback.xml
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
logger:
  config: custom-logback.xml
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[logger]
  config="custom-logback.xml"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
logger {
  config = "custom-logback.xml"
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  logger {
    config = "custom-logback.xml"
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "logger": {
    "config": "custom-logback.xml"
  }
}
```

  </TabItem>
</Tabs>

你还可以通过 `logger.config` 设置要使用的自定义 Logback XML 配置文件。请注意，**引用的文件应是类路径上可访问的资源！**

**使用属性禁用记录器**

要禁用记录器，需要将记录器级别设置为 `OFF`：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
logger.levels.io.verbose.logger.who.CriedWolf=false
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
logger:
  levels:
    io.verbose.logger.who.CriedWolf: OFF
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[logger]
  [logger.levels]
    "io.verbose.logger.who.CriedWolf"=false
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
logger {
  levels {
    io.verbose.logger.who.CriedWolf = false
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  logger {
    levels {
      "io.verbose.logger.who.CriedWolf" = false
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "logger": {
    "levels": {
      "io.verbose.logger.who.CriedWolf": false
    }
  }
}
```

  </TabItem>
</Tabs>

- 这将禁用类 `io.verbose.logger.who.CriedWolf` 的所有日志记录。

请注意，通过配置控制日志级别的功能是通过 [LoggingSystem](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/logging/LoggingSystem.html) 接口控制的。目前，Micronaut 只包含一个允许为 Logback 库设置日志级别的实现。如果你使用其他库，你应该提供一个实现此接口的 bean。

## 13.3 Logback

要使用 logback 库，请在构建过程中添加以下依赖。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("ch.qos.logback:logback-classic")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

:::tip 注意
Logback 1.3.x+ 包含一个破坏性的二进制更改，可能会妨碍其与 Micronaut 框架 3.8.x 的配合使用。如果你正在使用 Logback 1.3.x+ 并遇到问题，请降级到 Logback 1.2.x。
:::

如果还不存在，请在 resources 文件夹中放置 [logback.xml](https://logback.qos.ch/manual/configuration.html) 文件，并根据需要修改文件内容。例如：

*src/main/resources/logback.xml*

```xml
<configuration>

    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <withJansi>true</withJansi>

        <encoder>
            <pattern>%cyan(%d{HH:mm:ss.SSS}) %gray([%thread]) %highlight(%-5level) %magenta(%logger{36}) - %msg%n
            </pattern>
        </encoder>
    </appender>

    <root level="info">
        <appender-ref ref="STDOUT"/>
    </root>

</configuration>
```

要更改特定类或软件包名称的日志级别，可以在配置部分添加这样的日志记录器条目：

```xml
<configuration>
    ...
    <logger name="io.micronaut.context" level="TRACE"/>
    ...
</configuration>
```

## 13.4 日志系统

Micronaut 框架有一个日志系统的概念。简而言之，这是一个简单的应用程序接口，用于在运行时设置日志执行中的日志级别。为 Logback 和 Log4j2 提供了默认实现。你可以创建自己的 [LoggingSystem](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/logging/LoggingSystem.html) 实现，并使用 [@Replaces](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Replaces.html) 注解替换正在使用的实现，从而重写日志系统的行为。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#logging)

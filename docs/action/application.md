---
sidebar_position: 21
---

# 2.1 应用基础

在上一篇中，我们创建了第一个 Micronaut 的 Web 应用，我们继续介绍一下应用的基础知识。


## 启动类

整个项目中，我们目前只有一个 `Application.java`，我们打开它，代码如下：

```java
package fun.mortnon.demo;

import io.micronaut.runtime.Micronaut;

public class Application {
    public static void main(String[] args) {
        Micronaut.run(Application.class, args);
    }
}
```

`Application` 类中有一个标准的 Java 入口函数 `main`，然后通过 `Micronaut.run()` 函数触发 Micronaut 应用的启动。


## 配置文件

我们打开目录 `resources`，可以看到里面有两个文件：`appilcation.yml` 和 `logback.xml`。

`application.yml` 是应用的配置文件，`logback.xml` 是 `logback` 日志的配置文件。

而 Micronaut 应用支持的配置文件，除了 `application.yml`，还支持 `application.properties`、`application.json` 或 `application.groovy`。

我们看一下 `application.yml` 文件的内容：

```yaml
micronaut:
  application:
    name: firstdemo
netty:
  default:
    allocator:
      max-order: 3
```

其中指定了应用名称 `application.name` 为 “firstdemo”，并声明了 Http Server 使用的 netty 的默认配置。

Micronaut 应用默认端口为 `8080`，如果需要变更端口，类似于 Spring Boot 框架，我们只需要修改配置即可，示例如下：

```yaml
micronaut:
  application:
    name: firstdemo
  server:
    port: 8081
netty:
  default:
    allocator:
      max-order: 3

```

如果我们有自定义的配置属性，也是需要配置在配置文件中。

## 环境

如果我们需要针对不同的环境加载不同的配置项，比如我们做测试时的加载项、配置项与运行是不一样的，那么我们就可以使用环境相关的定义来区分。环境的定义类似于 Maven 中的 profile，也是用于标识当前的环境。

如果我们要标识当前启用的环境是什么，一种方式可以在启动应用时添加环境变量参数，命令示例如下：

```bash
java -Dmicronaut.environments=foo,bar -jar myapp.jar
```

以上这个命令中，就标识了当前启用了环境 `foo` 和 `bar`。

而哪个环境会启用，也有一个环境优先级，优先级如下（从最低到最高优先级）：

- 推断的环境
- `micronaut.environments` 系统属性中的环境
- `MICRONAUT_Environments` 环境变量中的环境
- 通过应用程序上下文生成器显式指定的环境

进一步，我们可以为配置文件添加不同的后缀，比如 `appliction-foo.yaml` 和 `application-bar.yaml`。这样当我们指定使用相应的环境时，应用就会从相应的配置文件中加载变量数据。

## Banner

Banner 中文为横幅，意思是指应用启动时加载的字符画，比如默认情况下，Micronaut 应用启动时加载的字符画如下：

```bash
 __  __ _                                  _   
|  \/  (_) ___ _ __ ___  _ __   __ _ _   _| |_ 
| |\/| | |/ __| '__/ _ \| '_ \ / _` | | | | __|
| |  | | | (__| | | (_) | | | | (_| | |_| | |_ 
|_|  |_|_|\___|_|  \___/|_| |_|\__,_|\__,_|\__|
  Micronaut (v3.8.7)

```

类似于 Spring Boot 框架，我们也可以指定自己的 banner，只要我们找到一个字符画生成网站即可。然后我们创建一个文本文件，`src/main/resources/micronaut-banner.txt`，把内容复制进去保存即可。

再次启动，就可以看到 banner 换成了我们自定义的，如下：

```bash
$$\      $$\                       $$\     $$\                            $$$\           $$$$$$$$\
$$$\    $$$ |                      $$ |    \__|                          $$ $$\          \__$$  __|
$$$$\  $$$$ | $$$$$$\   $$$$$$\  $$$$$$\   $$\  $$$$$$$\  $$$$$$\        \$$$\ |            $$ |    $$$$$$\  $$$$$$$\   $$$$$$\  $$$$$$$\
$$\$$\$$ $$ |$$  __$$\ $$  __$$\ \_$$  _|  $$ |$$  _____|$$  __$$\       $$\$$\$$\          $$ |   $$  __$$\ $$  __$$\ $$  __$$\ $$  __$$\
$$ \$$$  $$ |$$ /  $$ |$$ |  \__|  $$ |    $$ |\$$$$$$\  $$$$$$$$ |      $$ \$$ __|         $$ |   $$$$$$$$ |$$ |  $$ |$$ /  $$ |$$ |  $$ |
$$ |\$  /$$ |$$ |  $$ |$$ |        $$ |$$\ $$ | \____$$\ $$   ____|      $$ |\$$\           $$ |   $$   ____|$$ |  $$ |$$ |  $$ |$$ |  $$ |
$$ | \_/ $$ |\$$$$$$  |$$ |        \$$$$  |$$ |$$$$$$$  |\$$$$$$$\        $$$$ $$\          $$ |   \$$$$$$$\ $$ |  $$ |\$$$$$$  |$$ |  $$ |
\__|     \__| \______/ \__|         \____/ \__|\_______/  \_______|       \____\__|         \__|    \_______|\__|  \__| \______/ \__|  \__|

  Micronaut (v3.8.7)

```

需要注意的一点是，Spring Boot 的 banner 中可以指定变量的字符串替换展示，但是 Micronaut 的 banner 目前还不支持。

## 服务器

Micronaut 的默认服务器使用的是使用 netty 开发的。netty 相关的配置，可以在配置文件中添加。示例如下：

```yaml
micronaut:
  application:
    name: firstdemo
  server:
    netty:
      max-header-size: 500KB
netty:
  default:
    allocator:
      max-order: 3
```

示例中配置了头的最大值为 500KB。

类似于 Spring Boot 框架，Micronaut 框架除了支持默认的 netty 服务器，也支持其他基于 Servlet 的服务器，如 Tomcat、Jetty 或 Undertow。

如果要使用其他服务器，只需要在包依赖中添加相应的服务器依赖即可，示例如下：

`Tomcat`：

```xml
<dependency>
    <groupId>io.micronaut.servlet</groupId>
    <artifactId>micronaut-http-server-tomcat</artifactId>
    <version>3.3.5</version>
</dependency>
```

`Jetty`：

```xml
<dependency>
    <groupId>io.micronaut.servlet</groupId>
    <artifactId>micronaut-http-server-jetty</artifactId>
    <version>3.3.5</version>
</dependency>
```

`UnderTow`：

```xml
<dependency>
    <groupId>io.micronaut.servlet</groupId>
    <artifactId>micronaut-http-server-undertow</artifactId>
    <version>3.3.5</version>
</dependency>
```

这三种服务器，也有各自不同的应用配置项，如果需要配置，参照相关文档配置即可。相关文档参考 [Micronaut Servlet](../servlet/introduction.html)。

另外还需要注意，如果使用这三种基于 Servlet 的服务器，那么在应用中的请求和响应都是 Servlet 标准的 HttpRequest 和 HttpResponse，与默认 netty 的请求和响应是不同的实现。

## JMX 支持

很多情况下，我们开发的应用需要进行运行监控，常规使用的就是 JMX。在 Micronaut 框架中，专门提供一个依赖用于支持 JMX 功能。

如果需要使用 JMX 相关功能，我们先引入相应依赖，如下：

```xml
<dependency>
    <groupId>io.micronaut.jmx</groupId>
    <artifactId>micronaut-jmx</artifactId>
    <version>3.2.0</version>
</dependency>
```

如果还需要更多配置，按照 [JMX 文档](../jmx/jmx.html)进行配置即可。

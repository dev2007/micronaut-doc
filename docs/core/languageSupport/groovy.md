---
sidebar_position: 20
---

# 14.2 Groovy 版 Micronaut

[Groovy](https://groovy-lang.org/) 在 Micronaut 中拥有一流的支持。

## 特定于 Groovy 的模块

Groovy 的其他专用模块可改善整体体验。下表详细介绍了这些模块：

*表 1.Groovy 专用模块*

|依赖|描述|
|--|--|
|`io.micronaut:micronaut-inject-groovy`|包括 AST 转换，用于生成 bean 定义。应在 classpath 上为 `compileOnly`。|
|`io.micronaut:micronaut-runtime-groovy`|新增以 Groovy 格式（即 `application.groovy`）指定 `src/main/resources` 下配置的功能|
|`io.micronaut:micronaut-function-groovy`|包含 AST 转换，使 AWS Lambda [函数](/core/serverlessFunctions.html)的编写更加轻松|

你需要的最常见模块是 `micronaut-inject-groovy`，它可以为 Groovy 类实现 DI 和 AOP。

---

## CLI 中的 Groovy 支持

Micronaut 命令行界面包含对 Groovy 的特殊支持。要创建 Groovy 应用程序，请使用 groovy lang 选项。例如：

*创建 Micronaut Groovy 应用程序*

```bash
$ mn create-app hello-world --lang groovy
```

上述代码会生成一个用 Gradle 构建的 Groovy 项目。使用 `-build maven` 标志可生成一个使用 Maven 构建的项目。

使用 `groovy` 特性创建应用程序后，`create-controller`、`create-client` 等命令会生成 Groovy 文件，而不是 Java 文件。下面的示例演示了使用 CLI 交互模式时的情况：

*创建一个 Bean*

```bash
$ mn
| Starting interactive mode...
| Enter a command name to run. Use TAB for completion:
mn>

create-bean          create-client        create-controller
create-job           help

mn> create-bean helloBean
| Rendered template Bean.groovy to destination src/main/groovy/hello/world/HelloBean.groovy
```

上面的示例演示了创建一个类似下面的 Groovy Bean：

*Micronaut Bean*

```groovy
package hello.world

import javax.inject.Singleton

@Singleton
class HelloBean {

}
```

:::caution 警告
Groovy 会自动导入 `groovy.lang.Singleton`，这可能会造成混乱，因为它与 `javax.inject.Singleton` 相冲突。在声明 Micronaut 单例 Bean 时，请确保使用 `javax.inject.Singleton`，以避免出现令人惊讶的行为。
:::

我们还可以创建一个客户端--别忘了 Micronaut 可以充当客户端或服务器！

*创建客户端*

```bash
mn> create-client helloClient
| Rendered template Client.groovy to destination src/main/groovy/hello/world/HelloClient.groovy
```

*Micronaut Client*

```groovy
package hello.world

import io.micronaut.http.client.annotation.Client
import io.micronaut.http.annotation.Get
import io.micronaut.http.HttpStatus

@Client("hello")
interface HelloClient {

    @Get
    HttpStatus index()
}
```

现在，让我们创建一个控制器：

*创建控制器*

```bash
mn> create-controller helloController
| Rendered template Controller.groovy to destination src/main/groovy/hello/world/HelloController.groovy
| Rendered template ControllerSpec.groovy to destination src/test/groovy/hello/world/HelloControllerSpec.groovy
mn>
```

*Micronaut 控制器*

```groovy
package hello.world

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.HttpStatus

@Controller("/hello")
class HelloController {

    @Get
    HttpStatus index() {
        return HttpStatus.OK
    }
}
```

从 CLI 的输出中可以看到，还为你生成了一个 Spock 测试，演示了如何测试控制器：

 *HelloControllerSpec.groovy*

```groovy
...
    void "test index"() {
        given:
        HttpResponse response = client.toBlocking().exchange("/hello")

        expect:
        response.status == HttpStatus.OK
    }
...
```

请注意你是如何将 Micronaut 同时用作客户端和服务器来测试自身的。

---

## 使用 GroovyRouterBuilder 创建程序化路由

如果你喜欢以编程方式创建路由（类似于 Grails 的 `UrlMappings`），可以使用一个特殊的 `io.micronaut.web.router.GroovyRouteBuilder`，它具有一些增强功能，可以使 DSL 更好。

下面的示例展示了 `GroovyRouteBuilder` 的运行：

 *使用 GroovyRouteBuilder*

 ```groovy
 @Singleton
static class MyRoutes extends GroovyRouteBuilder {

    MyRoutes(ApplicationContext beanContext) {
        super(beanContext)
    }

    @Inject
    void bookResources(BookController bookController, AuthorController authorController) {
        GET(bookController) {
            POST("/hello{/message}", bookController.&hello) (1)
        }
        GET(bookController, ID) { (2)
            GET(authorController)
        }
    }
}
```

1. 你可以使用注入式控制器按惯例创建路由，也可以使用 Groovy 方法引用创建方法路由。
2. ID 属性可用于引用包含 `{id}` 的 URI 变量

上述示例产生了以下路由：
- `/book` —— 映射到 `BookController.index()`
- `/book/hello/{message}` ——  映射到 `BookController.hello(String)`
- `/book/{id}` —— 映射到 `BookController.show(String id)`
- `/book/{id}/author` —— 映射到 `AuthorController.index`

---

## 在 Groovy 应用程序中使用 GORM

[GORM](https://gorm.grails.org/) 是一个数据访问工具包，最初是作为 Grails 的一部分创建的。它支持多种数据库类型。下表总结了使用 GORM 所需的模块以及文档链接。

*表 2.GORM 模块*

|依赖|描述|
|--|--|
|`io.micronaut.groovy:micronaut-hibernate-gorm`|为 Groovy 应用程序配置 [Hibernate 版 GORM](https://gorm.grails.org/latest/hibernate/manual)。参阅 [Hibernate 支持文档](/core/configurations/dataAccess#1222-配置-hibernate)。|
|`io.micronaut.groovy:micronaut-mongo-gorm`|为 Groovy 应用程序配置 [MongoDB 版 GORM](https://gorm.grails.org/latest/mongodb/manual)。参阅 [Mongo 支持文档](/core/configurations/dataAccess#1223-配置-mongodb)。|
|`io.micronaut.groovy:micronaut-neo4j-gorm`|为 Groovy 应用程序配置 [Neo4j 版 GORM](https://gorm.grails.org/latest/neo4j/manual)。参阅 [Neo4j 支持文档](/core/configurations/dataAccess#1224-配置-neo4j)。|

一旦你按照上表中的说明配置了 GORM 实现，你就可以使用 GORM 的所有功能。

GORM 数据服务还可以参与依赖注入和生命周期方法：

*GORM 数据服务 VehicleService.groovy*

```groovy
@Service(Vehicle)
abstract class VehicleService {
    @PostConstruct
    void init() {
       // do something on initialization
    }

    abstract Vehicle findVehicle(@NotBlank String name)

    abstract Vehicle saveVehicle(@NotBlank String name)
}
```

你也可以将服务定义为接口而不是抽象类，让 GORM 为你实现方法。

---

## 使用 Groovy 的无服务器函数

微服务应用程序只是 Micronaut 的一种使用方式。你还可以将其用于无服务器功能，如 AWS Lambda。

借助 function-groovy 模块，Micronaut 增强了对以 Groovy 编写的函数的支持。

更多信息，参阅[无服务器函数](/core/serverlessFunctions)一节。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#groovy)

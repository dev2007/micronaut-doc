---
sidebar_position: 25
---

# 2.5 深入 Controller

经过前面几节的介绍与学习，我们实现基本的控制器、服务类，了解了依赖注入的基本使用和不同实现的标识与区别。作为应用的门面，控制器类中包含了应用的 API 的端点，这些端点用于接收用户请求并响应用户。

类似于 Spring Boot 框架的控制器，Micronaut 框架的控制器设计中，我们通过注解来标识哪些类是控制器，哪些函数是 API 端点、 RESTful API 的 HTTP 方法是什么、URI 是什么以及如何获取用户请求数据等。

## 再看 Controller

在之前的学习中，我们知道为一个类添加注解 `@Controller`，即标明该类为控制器。如之前示例代码中的 `HelloController`：

```java
@Controller
public class HelloController {

    @Inject
    @Named("HelloOne")
    private HelloService helloService;

    @Inject
    @HelloQualifier("Three")
    private HelloService helloThreeService;

    @Get("/hello")
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return helloThreeService.hello();
    }

    @Post("/echo")
    @Consumes(MediaType.TEXT_PLAIN)
    public String echo(String txt) {
        return helloThreeService.echo(txt);
    }
}
```

类似于 Spring Boot 框架，我们可以在 `@Controller` 注解中为整个控制器的 API 端点添加统一的 URI 前缀，比如我们添加一个前缀 `/v1`：

```java
@Controller("/v1")
public class HelloController {
//...
}
```

这样修改后，所有 API 端点都会添加前缀，比如原 `@Get("/hello")` 的完整 URI为 `http://localhost:8080/hello`，URI 将会变为 `http://localhost:8080/v1/hello`。

在 `@Controller` 中添加 URI 前缀，最大用途就是为整个控制类的 API 统一添加前缀，避免重复工作。需要这种配置比较常见的场景有两种，一种是整个控制器的 API 端点具有统一的前缀，减少重复字符的输入；二是在版本迭代升级后，我们需要实现新版本的 API 时，为旧版本 API 统一添加版本前缀，如示例中的 `/v1`。

在注解 `@Controller` 中，我们可以看到，除了属性 `value` 用于配置 URI，还有 `produces` 用于配置响应数据类型（即响应头中的 `Content-Type`，默认为 `application/json`），还有 `consumes` 用于配置接收数据类型（即请求头中的 `Content-Type`，默认为 `application.json`）。

而这两个配置数据类型的参数，一般情况下都用不上。一是因为默认值即为 RESTful API 用得最多的 `application/json`，二是不同的 API 端口如果要指定数据类型，自行指定即可，不需要在控制器上统一修改。

## HTTP 方法

 
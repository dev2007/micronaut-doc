---
sidebar_position: 23
---

# 2.3 服务与控制反转

在上一节中，我们学习了 Micronaut 的 API 入口：控制器（Controller），有了它，我们就可以实现我们的业务代码了。但实际项目中，由于项目要实现的业务很多，代码量会比较大，将所有的代码写在控制器里是很难有效的维护项目的。

我们会使用很多方法对代码实现进行分层，这些分层的思想总结出来就是我们常用的项目架构，如：MVC、MVVM 等。按最简单、最常用的 MVC 架构来对代码分层，控制器（C，Controller）用于对外接受请求、响应数据等，具体的业务实现我们会再增加一层代码目录，一般叫作“服务（service）”用于实现具体的业务操作，而这些业务操作抽离为服务的类之后，可以被不同的控制器组合使用。

而服务的类要被使用，需要先实例化为一个对象。在原生的 Java 代码中，我们直接使用 `new XxxService()` 来生成实例化的对象，但是在框架中，如 Spring Boot 或 Micronaut 中，框架都会为我们提供控制反转（IoC）来生成实例对象，有了这个，也就实现了依赖注入（DI）。在 Micronaut 框架中，我们通过注解的方式来实现控制反转。

## Service

我们首先创建一个服务类，名叫 `HelloService`，该类中我们提供两个实现，用于实现上一节中 `HelloController` 两个接口实现的逻辑。代码如下：

```java
package fun.mortnon.demo;

import jakarta.inject.Singleton;

/**
 * @author dev2007
 * @date 2023/5/26
 */
@Singleton
public class HelloService {
    public String hello() {
        return "hello world";
    }

    public String echo(String txt) {
        return "response:" + txt;
    }
}
```

在类中，我们看到有一个注解 `@Singleton`，该注解表明该类需要由框架的 IoC 进行实例化，并且实例化的对象是一个单例的（即，每个使用它的地方都是使用的同一个对象）。

接着，我们修改 `HelloController`，将原有的逻辑调整为调用 `HelloService` 的方法，代码如下：

```java
package fun.mortnon.demo;

import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import jakarta.inject.Inject;

/**
 * @author dev2007
 * @date 2023/3/24
 */
@Controller
public class HelloController {

    @Inject
    private HelloService helloService;

    @Get("/hello")
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return helloService.hello();
    }

    @Post("/echo")
    @Consumes(MediaType.TEXT_PLAIN)
    public String echo(String txt) {
        return helloService.echo(txt);
    }
}

```
代码中，我们可以看到声明了一个字段 `private HelloService helloService;`，同时它带有一个注解 `@Inject`。在整个 `HelloController` 中都没有 `new HelloService()` 的代码，全通过 Micronaut 框识别到注解 `@Inject` 后，自动为 `helloService` 生成了实例。

以上代码运行后，效果与上一节中的效果完全一致。

## IoC 注解

在以上的代码中，`HelloService` 使用了一个注解 `@Singleton`，它代表的是通过控制反转生成的对象是单例的。在 Micronaut 框架中，有多种注解用于声明控制反转，他们各自有自己的适用情况。如下表 1。

**表 1**

|类型|描述|
|--|--|
|`@Singleton`|Singleton 作用域表示只存在 bean 的一个实例|
|`@Context`|Context 作用域表示 bean 将与 `ApplicationContext` 同时创建（急切初始化）|
|`@Prototype`|Prototype 作用域表示每次注入 bean 时都会创建一个新的 bean 实例|
|`@Infrastructure`|Infrastructure 作用域表示不能使用 `@Replaces` 重写或替换的 bean，因为它对系统的运行至关重要。|
|`@ThreadLocal`|`@ThreadLocal` 作用域是一个自定义作用域，通过 ThreadLocal 为每个线程关联一个 bean|
|`@Refreshable`|`@Refreshable` 作用域是一个自定义作用域，允许通过 `/refresh` 端点刷新bean的状态。|
|`@RequestScope`|`@RequestScope` 作用域是一个自定义作用域，它指示创建了 bean 的新实例并与每个 HTTP 请求相关联|

以上这些注解中，我们最常用的就是 `@Singleton`，其他的注解按具体的需求使用即可。


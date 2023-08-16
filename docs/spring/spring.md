---
description: Micronaut for Spring
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut for Spring,spring,spring boot,spring cloud]
---

# Micronaut for Spring

集成 Micronaut 和 Spring 的扩展。

## 1. 简介

Micronaut 采用超前编译（AOT）技术，在编译时预先计算应用程序的需求。这样做的结果是大大降低了内存需求，加快了启动时间，并实现了无反射框架基础架构。

该项目由各种组件组成，可让你更轻松地实现以下功能：

- 将 Spring 组件集成到 Micronaut 应用程序中
- 将 Spring 应用程序作为 Micronaut 应用程序运行
- 将 Micronaut Beans 公开给 Spring 应用程序

为了实现这一目标，该项目提供了使用基于 Spring 注解的编程模型的子集来构建 Micronaut 应用程序的能力。我们的目标并不一定是为 Spring 提供另一种运行时，而是使我们能够构建同时适用于 Spring 和 Micronaut 的库。

## 2. 发布历史

关于此项目，你可以在此处找到发布版本列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-spring/releases

## 3. 将 Spring 应用程序转换为 Micronaut 应用程序

Micronaut for Spring 允许你使用传统的 Spring 注释，这些注释会在编译时映射到 Micronaut 注解。这样，你编写的应用程序就可以导入到另一个 Spring 或 Micronaut 应用程序中而无需更改。

与传统的基于运行时反射的框架不同，Micronaut 使用超前编译（AOT），因此不存在支持额外注解集（在本例中为 Spring 的注解编程模型）的运行时开销。

作为本项目的一部分，我们提供了一个[示例应用程序](https://github.com/micronaut-projects/micronaut-guides/pull/839)，它的源代码中不包含 Micronaut 本身的依赖关系（只包含 Spring 依赖关系），但在编译时会计算成 Micronaut 应用程序。

其价值如下：

- 你可以将编译后的应用程序包含到另一个 Spring 或 Micronaut 应用程序中而无需更改，这对于库作者来说是一个巨大的胜利。
- 如果你有一个现有的 Spring 开发团队，他们无需学习新的注解 DSL 就能使用 Micronaut。
- IntelliJ IDEA 和 STS 4.0 等现有工具与 Micronaut "配合使用"

需要注意的是，Spring 非常庞大，虽然只支持 Spring 的一个子集，但足以构建可与 Micronaut 或 Spring 配合使用的实际应用程序和库。以下文档涵盖了支持的注解和 Spring 接口。

:::tip 注意
如果本文档中未提及 Spring 的注解或接口，则视为不支持该注解或接口。
:::

### 3.1 构建配置

有关 Gradle 或 Maven 的构建配置示例，参阅指南[将 Spring Boot 应用程序作为 Micronaut 应用程序运行](https://guides.micronaut.io/latest/micronaut-spring-boot.html)中的示例项目。


### 3.2 支持的 Spring 注解

下表总结了 Micronaut for Spring 支持的注解及其在编译时映射到的 Micronaut 注解：

*表 1.支持的 Spring 注解*

|Spring 注解|目标注解|说明|
|--|--|--|
|[@Component](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Component.html)|[@Bean](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Bean.html)|示例 `@Component("myBean")`。需要 `micronaut-context` 依赖。|
|[@Service](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html)|[@Bean](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Bean.html)|示例 `@Service("myBean")`。需要 `micronaut-context` 依赖。|
|[@Repository](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)|[@Bean](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Bean.html)|示例 `@Repository("myBean")`。需要 `micronaut-context` 依赖。|
|[@Autowired](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/beans/factory/annotation/Autowired.html)|`@javax.inject.Inject`|例如 `@Autowired`。`required=false` 添加 `@Nullable`|
|[@Value](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/beans/factory/annotation/Value.html)|[@Value](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Value.html)|示例 `@Value("${foo.bar}`|")
|[@Qualifier](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/beans/factory/annotation/Qualifier.html)|`@javax.inject.Named`|示例 `@Qualifier("myBean")`|
|[@Configuration](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)|[@Factory](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Factory.html)|示例 `@Configuration`|
|[@Profile](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Profile.html)|`@Requires(env="test")`|示例 `@Profile("test")`|
|[@Bean](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Bean.html)|[@Bean](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Bean.html)|示例 `@Bean`。需要 `micronaut-context` 依赖。|
|[@Import](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Import.html)|[@Import](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Import.html)|示例 `@Import(MyConfiguration.class)`。需要 `micronaut-context` 依赖。|
|[@Primary](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Primary.html)|[@Primary](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Primary.html)|示例 `@Primary`。需要 `microronaut-context` 依赖。|
|[@EventListener](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/event/EventListener.html)|[@EventListener](https://docs.micronaut.io/latest/api/io/micronaut/runtime/event/annotation/EventListener.html)|示例 `@EventListener`。需要 `micronaut-inject` 依赖。|
|[@Async](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)|[@Async](https://docs.micronaut.io/latest/api/io/micronaut/scheduling/annotation/Async.html)|示例 `@Async`。需要 `micronaut-context` 依赖。|
|[@Scheduled](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Scheduled.html)|[@Scheduled](https://docs.micronaut.io/latest/api/io/micronaut/scheduling/annotation/Scheduled.html)|示例 `@Scheduled`。需要 `micronaut-context` 依赖。|
|[@Transactional](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)|[TransactionInterceptor](https://docs.micronaut.io/latest/api/io/micronaut/spring/tx/annotation/TransactionInterceptor.html)|示例 `@Transactional`。需要 `micronaut-spring` 依赖。|
|[@Cacheable](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)|[@Cacheable](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/annotation/Cacheable.html)|需要 `micronaut-runtime` 和已配置的缓存。仅支持 `cacheNames` 成员。|
|[@CacheEvict](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/cache/annotation/CacheEvict.html)|[@CacheInvalidate](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/annotation/CacheInvalidate.html)|需要 `micronaut-runtime` 和已配置的缓存。仅支持 `cacheNames` 成员。|
|[@CachePut](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/cache/annotation/CachePut.html)|[@CachePut](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/annotation/CachePut.html)|需要 `micronaut-runtime` 和已配置的缓存。仅支持 `cacheNames` 成员。|

### 3.3 支持的 Spring 接口

支持以下 Spring 接口，并可将其注入任何 Bean：

*表 1.支持的可注入接口*
|Spring 接口|适配目标|描述|
|--|--|--|
|[Environment](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/core/env/Environment.html)|[Environment](https://docs.micronaut.io/latest/api/io/micronaut/context/env/Environment.html)|应用环境|
|[ConversionService](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/core/convert/ConversionService.html)|[ConversionService](https://docs.micronaut.io/latest/api/io/micronaut/core/convert/ConversionService.html)|用于转换类型|
|[ApplicationEventPublisher](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/ApplicationEventPublisher.html)|[ApplicationEventPublisher](https://docs.micronaut.io/latest/api/io/micronaut/context/event/ApplicationEventPublisher.html)|用于发布事件|
|[ApplicationContext](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/ApplicationContext.html)|[ApplicationContext](https://docs.micronaut.io/latest/api/io/micronaut/context/ApplicationContext.html)|应用上下文|
|[BeanFactory](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/beans/factory/BeanFactory.html)|[BeanContext](https://docs.micronaut.io/latest/api/io/micronaut/context/BeanContext.html)|bean 上下文|

为兼容起见，支持以下 `Aware` 接口：

*表 2. 支持的 `Aware` 接口*

|Spring 接口|描述|
|--|--|
|[EnvironmentAware](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/EnvironmentAware.html)|用于查找 `Environment`（但更推荐 `@Autowired`）|
|[ApplicationContextAware](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/ApplicationContextAware.html)|用于查找 `ApplicationContext`（但更推荐 `@Autowired`）|
|[BeanFactoryAware](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/beans/factory/BeanFactoryAware.html)|用于查找 `BeanFactory`（但更推荐 `@Autowired`）|

### 3.4 支持的 Spring 事件

为兼容起见，支持以下 ApplicationEvent 实例：

*表 1.支持的 Spring 事件*

|Spring 事件|描述|
|--|--|
|[ContextStartedEvent](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/event/ContextStartedEvent.html)|应用程序上下文启动时触发|
|[ContextClosedEvent](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/event/ContextClosedEvent.html)|应用程序上下文关闭时触发|

你可以编写注解为 [@EventListener](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/event/EventListener.html) 的方法来接收任一框架中的事件。

### 3.5 编写 Spring MVC 控制器

你可以编写在编译时计算成 Micronaut 控制器的 Spring MVC 控制器。该编程模型在很大程度上与 Spring Web Reactive 兼容。

有关将 Spring Web Reactive 应用程序转换为 Micronaut 应用程序的示例，参阅指南[将 Spring Boot 应用程序作为 Micronaut 应用程序运行](https://guides.micronaut.io/latest/micronaut-spring-boot.html)中的示例项目。

只支持 `@RestController` 语义，这对大多数微服务用例来说都没问题。`micronaut-spring-web` 依赖提供了特殊支持，允许返回 [ResponseEntity](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/http/ResponseEntity.html)。

:::note 提示
参阅[示例应用程序](https://github.com/micronaut-projects/micronaut-guides/pull/839)，了解如何构建可计算 Micronaut 的 Spring MVC 应用程序。
:::

Micronaut 文档中描述的绑定语义一般与 Spring MVC 的行为方式相同。

此外，还支持以下 Spring 特有的方法参数类型：

*表 1. 支持的方法参数类型*

|类型|说明|
|--|--|
|[ServerHttpRequest](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/http/server/reactive/ServerHttpRequest.html)|用于接收整个响应式请求|
|java.security.Principal|必需 `micronaut-security` 模块|
|[HttpMethod](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/http/HttpMethod.html)|HTTP 方法|
|[ModelMap](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/ui/ModelMap.html), [Model](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/ui/Model.html)|使用 `micronaut-views` 模块。参阅[服务器端视图渲染](/core/httpserver/views)。|

支持以下返回类型：

*表 2. 支持的返回类型*

|类型|说明|
|--|--|
|HttpEntity, ResponseEntity|用于自定义响应|
|HttpHeaders|用于只发回头|
|java.lang.String|视图名称与 `Model`|
|任何响应式或 POJO 返回类型|计算为合适的 JSON 响应|

支持以下 Spring MVC 注解：

*表 3.支持的 Spring MVC 注解*

|Spring 注解|目标注解|说明|
|--|--|--|
|[@RestController](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html)|[@Controller](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Controller.html)|示例 `@RestController`|
|[@RequestMapping](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestMapping.html)|[@UriMapping](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/UriMapping.html)|示例：`@RequestMapping("/foo/bar")`|
|[@GetMapping](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/GetMapping.html)|[@Get](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Get.html)|示例：`@GetMapping("/foo/bar")`|
|[@PostMapping](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/PostMapping.html)|[@Post](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Post.html)|示例：`@PostMapping("/foo/bar")`|
|[@DeleteMapping](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/DeleteMapping.html)|[@Delete](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Delete.html)|示例： `@DeleteMapping("/foo/bar")`|
|[@PatchMapping](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/PatchMapping.html)|[@Patch](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Patch.html)|示例： `@PatchMapping("/foo/bar")`|
|[@PutMapping](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/PutMapping.html)|[@Put](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Put.html)|示例：`@PutMapping("/foo/bar")`|
|[@RequestHeader](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestHeader.html)|[@Header](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Header.html)|示例：`@RequestHeader("Accept")`|
|[@RequestAttribute](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestAttribute.html)|无等价的|示例：`@RequestAttribute("Accept")`|
|[@RequestBody](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestBody.html)|[@Body](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Body.html)|示例：`@RequestBody`|
|[@RequestParam](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/ResponseStatus.html)|[@QueryValue](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/QueryValue.html)|示例：@RequestParam("myParam")|
|[@ResponseStatus](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/ResponseStatus.html)|[@Status](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Status.html)|示例：`@ResponseStatus(value=HttpStatus.NOT_FOUND)`|
|[@ExceptionHandler](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/ExceptionHandler.html)|[@Error](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Error.html)示例：`@ExceptionHandler`|
|[@CookieValue](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/CookieValue.html)|[@CookieValue](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/CookieValue.html)|示例：`@CookieValue("myCookie")`|

### 3.6 支持的 Spring Boot 注解

支持以下 Spring Boot 特定注解：

*表 1.支持的 Spring Boot 注释*

|Spring Boot 注解|目标注解|说明|
|--|--|--|
|[@ConfigurationProperties](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/context/properties/ConfigurationProperties.html)|[@ConfigurationProperties](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/ConfigurationProperties.html)|示例 `@ConfigurationProperties("foo.bar")`|
|[@ConditionalOnBean](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/condition/ConditionalOnBean.html)|[@Requires](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Requires.html)|映射为 `@Requires(beans=Foo.class)`|
|[@ConditionalOnClass](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/condition/ConditionalOnClass.html)|[@Requires](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Requires.html)|映射为 `@Requires(classes=Foo.class)`|
|[@ConditionalOnMissingBean](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/condition/ConditionalOnMissingBean.html)|[@Requires](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Requires.html)|映射为 `@Requires(missingBeans=Foo.class)`|
|[@ConditionalOnMissingClass](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/condition/ConditionalOnMissingClass.html)|[@Requires](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Requires.html)|映射为 `@Requires(missing=Foo.class)`|
|[@ConditionalOnNotWebApplication](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/condition/ConditionalOnNotWebApplication.html)|[@Requires](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Requires.html)|映射为 `@Requires(missingBeans=EmbeddedServer.class)`|
|[@ConditionalOnProperty](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/condition/ConditionalOnProperty.html)|[@Requires](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Requires.html)|映射为 `@Requires(property="foo.bar")`|
|[@ConditionalOnSingleCandidate](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/condition/ConditionalOnSingleCandidate.html)|`@RequiresSingleCandidateCondition`|映射为 `@RequiresSingleCandidateCondition(Foo.class)`|
|[@ConditionalOnWebApplication](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/condition/ConditionalOnWebApplication.html)|[@Requires](https://docs.micronaut.io/latest/api/io/micronaut/context/annotation/Requires.html)|映射为 `@Requires(beans=EmbeddedServer.class)`|

通过对 `@Configuration` 和大多数 Spring Boot 条件的支持，我们可以构建同时适用于 Spring Boot 和 Micronaut 的自动配置。

此外，还支持以下 Spring Boot Actuator 注解：

*表 2. 支持的 Spring Boot 执行器注解*

|Spring Actuator Boot 注解|目标注解|说明|
|--|--|--|
|[@Endpoint](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/endpoint/annotation/Endpoint.html)[|@Endpoint](https://docs.micronaut.io/latest/api/io/micronaut/management/endpoint/annotation/Endpoint.html)|示例 `@Endpoint("features")`|
|[@ReadOperation](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/endpoint/annotation/ReadOperation.html)|[@Read](https://docs.micronaut.io/latest/api/io/micronaut/management/endpoint/annotation/Read.html)|示例 `@ReadOperation`|
|[@WriteOperation](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/endpoint/annotation/WriteOperation.html)|[@Write](https://docs.micronaut.io/latest/api/io/micronaut/management/endpoint/annotation/Write.html)|示例 `@WriteOperation`|
|[@DeleteOperation](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/endpoint/annotation/DeleteOperation.html)|[@Delete](https://docs.micronaut.io/latest/api/io/micronaut/management/endpoint/annotation/Delete.html)|示例 `@DeleteOperation`|
|[@Selector](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/endpoint/annotation/Selector.html)|[@Selector](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/endpoint/annotation/Selector.html)|示例 `@Selector`|

这样就能编写同时适用于 Spring Boot 和 Micronaut 的管理端点。

### 3.7 不支持的 Spring 功能

如前所述，Spring 只实现了一个子集，但足以构建实际应用程序。在使用 Spring 时，你必须问自己一个问题：你需要多少 Spring 功能？

目前，Micronaut for Spring 也不支持以下值得注意的功能，一般来说，如果这里没有记录某项功能，就认为它是不支持的：

- **AspectJ** —— 不支持 Spring 的 AOP 实现，但你可以使用 [Micronaut AOP](/core/aop)，它不需要编译时间和反射。
- **Spring Expression Language (SpEL)** —— 不支持 SpEL 表达式，但支持属性占位符。
- **Servlet API** —— 不支持对 Servlet API 的任何引用。

### 3.8 使用 Micronaut 的 HTTP 客户端

由于注解值是在编译时映射的，这也影响了 Micronaut 的编译时声明式 HTTP 客户端的编写。

你基本上可以使用 Spring 注解来定义编译时 HTTP 客户端：

*Spring `@Client` 实现*

```java
/*
 * Copyright 2017-2019 original authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.micronaut.spring.web.annotation;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Header;
import io.micronaut.http.client.annotation.Client;
import org.springframework.web.bind.annotation.*;

@Client("/")
public interface GreetingClient {

    @GetMapping("/")
    String home();

    @PostMapping("/request")
    @Header(name = "Foo", value = "Bar")
    Greeting requestTest(@RequestBody Greeting greeting);

    @GetMapping("/greeting{?name}")
    Greeting greet(@Nullable String name);

    @PostMapping("/greeting")
    Greeting greetByPost(@RequestBody Greeting greeting);

    @DeleteMapping("/greeting")
    HttpResponse<?> deletePost();

    @GetMapping("/nested/greeting{?name}")
    Greeting nestedGreet(@Nullable String name);

    @GetMapping("/greeting-status{?name}")
    HttpResponse<Greeting> greetWithStatus(@Nullable String name);
}
```

这也意味着你可以在 Spring 应用程序的客户端和服务器之间定义一个通用接口，并在编译时计算客户端名称。

## 4 在 Spring 和 Micronaut 之间共享库

如果你有很多现有的 Spring 应用程序，在 Micronaut 和 Spring 之间共享库可能会很有用。

如果你想共享可添加到 classpath 的通用可注入组件，这是一个常见需求。

如果你有这种用例，你可以通过使用 Spring 注解来解决，例如使用 [@Configuration](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)、[@Component](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Component.html) 和 [@Bean](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Component.html) 注解来定义组件。

例如：

*示例 Spring 配置*

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class MyConfiguration {

    @Bean
    @Primary
    public MyBean myBean() {
        return new MyBean("default");
    }


    @Bean("another")
    public MyBean anotherBean() {
        return new MyBean("another");
    }


    public static class MyBean {
        private final String name;

        MyBean(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }
}
```

上述配置公开了 `MyBean` 类型的 Bean，任何 Spring 应用程序都可以使用如下声明的 [@Import](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Import.html) 注解导入并使用该 Bean：

*使用 @Import*

```java
import org.springframework.context.annotation.Import;

@Import(MyConfiguration.class)
class Application {}
```

如果你已经正确配置了 Micronaut for Spring，你还可以在 Micronaut 应用程序中使用相同的配置，方法是使用与上述相同的声明。有关如何为 Spring 配置 Micronaut，参阅指南[将 Spring Boot 应用程序作为 Micronaut 应用程序运行](https://guides.micronaut.io/latest/micronaut-spring-boot.html)中的示例项目。

Micronaut 会在编译时导入所有已声明的 Bean。唯一的限制是，需要运行时接口（如 BeanClassLoaderAware）的 `ImportBeanDefinitionRegistrar` 将无法导入，并伴有编译错误，因为导入处理是在 Micronaut 的编译过程中进行的。在创建共享组件时，尽量避免定义依赖于以下接口之一的 `ImportBeanDefinitionRegistrar` 类型：

- `BeanClassLoaderAware`
- `BeanFactoryAware`
- `EnvironmentAware`
- `ResourceLoaderAware`

## 5. 将 Micronaut 模块与 Spring 结合使用

可能需要在 Spring 或 Spring Boot 应用程序中使用 Micronaut 模块或库。例如，你可能希望在 Spring 应用程序中使用 Micronaut HTTP 客户端或 Micronaut 数据。将 Micronaut 集成到 Spring 应用程序中有以下几种方法。

### 5.1 使用 Micronaut Spring Boot 启动器

在 Spring 中使用 Micronaut 的最简单方法是使用 Micronaut Spring Boot 启动器，首先在 Spring Boot 应用程序的 Gradle 构建配置中包含 Micronaut BOM：

*在Gradle中添加Micronaut BOM*

```groovy
implementation platform("io.micronaut.platform:micronaut-platform:4.0.0")
annotationProcessor platform("io.micronaut.platform:micronaut-platform:4.0.0")
```

或 Maven：

*将 Micronaut BOM 添加到 Maven*

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.micronaut.platform</groupId>
            <artifactId>micronaut-platform</artifactId>
            <version>4.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

:::tip 注意
如果你不想导入 BOM，也可以这样做，但请注意，你必须明确声明依赖版本。
:::

然后在构建配置中添加 Micronaut 注解处理器：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut:micronaut-inject-java")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut</groupId>
        <artifactId>micronaut-inject-java</artifactId>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

然后，你需要明确指定对使用 `jakarta` 命名空间而非 `javax` 命名空间（2.0.x 及以上版本）的 Jakarta 注释模块版本的依赖关系。这是因为 Spring Boot BOM 会自动将该模块的版本降级为使用 javax 命名空间的版本，而 `javax` 命令空间与 Micronaut 不兼容：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("jakarta.annotation:jakarta.annotation-api:2.1.1")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>jakarta.annotation</groupId>
        <artifactId>jakarta.annotation-api</artifactId>
        <version>2.1.1</version>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("jakarta.annotation:jakarta.annotation-api:2.1.1")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>jakarta.annotation</groupId>
    <artifactId>jakarta.annotation-api</artifactId>
    <version>2.1.1</version>
</dependency>
```

  </TabItem>
</Tabs>

最后，可以在构建过程中添加对 `micronaut-spring-boot-starter` 的依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.spring:micronaut-spring-boot-starter")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.spring</groupId>
    <artifactId>micronaut-spring-boot-starter</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

当 Spring Boot 应用程序启动时，Micronaut 提供的所有 Bean 也将作为 Spring Bean 公开。

:::note 注意
你可以在 `Application` 类上使用 [@EnableMicronaut](https://micronaut-projects.github.io/micronaut-spring/latest/api/io/micronaut/spring/boot/starter/EnableMicronaut.html) 注解，并指定 [MicronautBeanFilter](https://micronaut-projects.github.io/micronaut-spring/latest/api/io/micronaut/spring/boot/starter/MicronautBeanFilter.html) 从 Micronaut 中包含或排除 Bean，从而控制哪些 Bean 会暴露给 Spring。
:::

**使用 Micronaut Data**

可通过添加 Micronaut Data 注解处理器来使用 Micronaut Data：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut.data:micronaut-data-processor")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut.data</groupId>
        <artifactId>micronaut-data-processor</artifactId>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

以及你感兴趣的模块，例如 Micronaut Data JDBC：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.data:micronaut-data-jdbc")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.data</groupId>
    <artifactId>micronaut-data-jdbc</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

不过，需要注意的是，你需要再次指定使用 `jakarta` 命名空间而非 `javax` 命名空间的 Jakarta Persistence API 版本，因为 Spring Boot BOM 在 Spring Boot 2.x 中强制使用旧版本：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("jakarta.persistence:jakarta.persistence-api:3.1.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>jakarta.persistence</groupId>
        <artifactId>jakarta.persistence-api</artifactId>
        <version>3.1.0</version>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("jakarta.persistence:jakarta.persistence-api:3.1.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>jakarta.persistence</groupId>
    <artifactId>jakarta.persistence-api</artifactId>
    <version>3.1.0</version>
</dependency>
```

  </TabItem>
</Tabs>

### 5.2 使用 Micronaut 父上下文

你也可以使用 Micronaut for Spring 作为常规 Spring 应用程序的父应用上下文。

这样做有很多好处，例如，你可以使用 Micronaut 定义 Bean，并在 Spring 应用程序中使用任何 Micronaut Bean，从而减少 Spring 使用的内存，并拥有无反射的基础架构。

你还可以在常规的 Spring Boot 或 Spring 应用程序中使用 Micronaut 的任何功能，包括为 [HTTP 声明客户端](/core/httpclient/clientAnnotation)和 [Kafka](/core/messaging#101-kafka-支持) 。

你还可以在 Spring 中使用 Micronaut 的任何编译工具，例如 Micronaut 对 [Swagger](/core/httpserver/openapi) 的支持。

下面的示例展示了如何使用 SpringApplicationBuilder 通过 Micronaut 支持的父应用程序上下文配置 Spring Boot 应用程序：

*使用 Micronaut 父上下文*

```java
SpringApplicationBuilder builder = new SpringApplicationBuilder();
MicronautApplicationContext context = new MicronautApplicationContext();
context.start();
builder.parent(context);
builder.sources(Application);
builder.build().run();
```

## 5.3 使用 Bean 后处理器

[MicronautBeanProcessor](https://micronaut-projects.github.io/micronaut-spring/latest/api/io/micronaut/spring/beans/MicronautBeanProcessor.html) 类是一个 BeanFactoryPostProcessor，可将 Micronaut Bean 添加到 Spring 应用程序上下文中。

`MicronautBeanProcessor` 的实例应添加到 Spring `应用程序上下文中。MicronautBeanProcessor` 需要一个构造函数参数，该参数表示应添加到 Spring 应用程序上下文的 Micronaut Bean 类型列表。该处理器可用于任何 Spring 应用程序。例如，Grails 3 应用程序可以利用 MicronautBeanProcessor 将所有 Micronaut HTTP Client Bean 添加到 Spring 应用程序上下文中，具体如下：

```groovy
// grails-app/conf/spring/resources.groovy
import io.micronaut.spring.beans.MicronautBeanProcessor
import io.micronaut.http.client.annotation.Client

beans = {
    httpClientBeanProcessor MicronautBeanProcessor, Client
}
```

可指定多个类型：

```groovy
// grails-app/conf/spring/resources.groovy
import io.micronaut.spring.beans.MicronautBeanProcessor
import io.micronaut.http.client.annotation.Client
import com.sample.Widget

beans = {
    httpClientBeanProcessor MicronautBeanProcessor, [Client, Widget]
}
```

在非 Grails 应用程序中，可以使用任何 Spring 的 Bean 定义样式来指定类似的内容：

```groovy
@Configuration
class ByAnnotationTypeConfig {

    @Bean
    MicronautBeanProcessor beanProcessor() {
        new MicronautBeanProcessor(Prototype, Singleton)
    }
}
```

## 6 仓库

你可以在此资源库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-spring

> [英文链接](https://micronaut-projects.github.io/micronaut-spring/latest/guide/)

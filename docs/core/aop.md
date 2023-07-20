---
sidebar_position: 50
---


# 5. 面向切面编程（AOP）

面向方面编程（AOP）在历史上有许多化身和一些非常复杂的实现。通常，AOP可以被认为是一种定义交叉关注点（日志记录、事务、跟踪等）的方法，以定义建议的方面的形式与应用程序代码分离。

通常有两种形式的建议：

- 环绕通知——装饰方法或类
- 引入通知——将新行为引入类。

在现代 Java 应用程序中，声明建议通常采用注解的形式。Java 世界中最著名的注解建议可能是 `@Transactional`，它在 Spring 和 Grails 应用程序中划定了事务边界。

传统的 AOP 方法的缺点是严重依赖运行时代理的创建和反射，这会降低应用程序的性能，使调试更加困难，并增加内存消耗。

Micronaut 试图通过提供一个不使用反射的简单编译时 AOP API 来解决这些问题。

## 5.1 环绕通知

你可能想应用的最常见的建议类型是“围绕”通知，它可以让你装饰一种方法的行为。

### 编写环绕通知

第一步是定义一个注解，该注解将触发 [MethodInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInterceptor.html)。

*环绕通知注解示例*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.aop.Around;
import java.lang.annotation.*;
import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Retention(RUNTIME) // (1)
@Target({TYPE, METHOD}) // (2)
@Around // (3)
public @interface NotNull {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.aop.Around
import java.lang.annotation.*
import static java.lang.annotation.ElementType.*
import static java.lang.annotation.RetentionPolicy.RUNTIME

@Documented
@Retention(RUNTIME) // (1)
@Target([TYPE, METHOD]) // (2)
@Around // (3)
@interface NotNull {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.aop.Around
import kotlin.annotation.AnnotationRetention.RUNTIME
import kotlin.annotation.AnnotationTarget.CLASS
import kotlin.annotation.AnnotationTarget.FILE
import kotlin.annotation.AnnotationTarget.FUNCTION
import kotlin.annotation.AnnotationTarget.PROPERTY_GETTER
import kotlin.annotation.AnnotationTarget.PROPERTY_SETTER

@MustBeDocumented
@Retention(RUNTIME) // (1)
@Target(CLASS, FILE, FUNCTION, PROPERTY_GETTER, PROPERTY_SETTER) // (2)
@Around // (3)
annotation class NotNull
```

  </TabItem>
</Tabs>

1. 注解的保留策略应为 `RUNTIME`
2. 通常，你希望能够在类或方法级别应用建议，因此目标类型是 `TYPE` 和 `METHOD`
3. 添加 [@Around](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/Around.html)注解是为了告诉 Micronaut 该注解是环绕通知

定义环绕通知的下一步是实现 [MethodInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInterceptor.html)。例如，以下拦截器不允许具有 `null` 值的参数：

*MethodInterceptor 示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.aop.InterceptorBean;
import io.micronaut.aop.MethodInterceptor;
import io.micronaut.aop.MethodInvocationContext;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.core.type.MutableArgumentValue;

import jakarta.inject.Singleton;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Singleton
@InterceptorBean(NotNull.class) // (1)
public class NotNullInterceptor implements MethodInterceptor<Object, Object> { // (2)
    @Nullable
    @Override
    public Object intercept(MethodInvocationContext<Object, Object> context) {
        Optional<Map.Entry<String, MutableArgumentValue<?>>> nullParam = context.getParameters()
            .entrySet()
            .stream()
            .filter(entry -> {
                MutableArgumentValue<?> argumentValue = entry.getValue();
                return Objects.isNull(argumentValue.getValue());
            })
            .findFirst(); // (3)
        if (nullParam.isPresent()) {
            throw new IllegalArgumentException("Null parameter [" + nullParam.get().getKey() + "] not allowed"); // (4)
        }
        return context.proceed(); // (5)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.aop.InterceptorBean
import io.micronaut.aop.MethodInterceptor
import io.micronaut.aop.MethodInvocationContext
import io.micronaut.core.annotation.Nullable
import io.micronaut.core.type.MutableArgumentValue

import jakarta.inject.Singleton

@Singleton
@InterceptorBean(NotNull) // (1)
class NotNullInterceptor implements MethodInterceptor<Object, Object> { // (2)
    @Nullable
    @Override
    Object intercept(MethodInvocationContext<Object, Object> context) {
        Optional<Map.Entry<String, MutableArgumentValue<?>>> nullParam = context.parameters
            .entrySet()
            .stream()
            .filter({entry ->
                MutableArgumentValue<?> argumentValue = entry.value
                return Objects.isNull(argumentValue.value)
            })
            .findFirst() // (3)
        if (nullParam.present) {
            throw new IllegalArgumentException("Null parameter [${nullParam.get().key}] not allowed") // (4)
        }
        return context.proceed() // (5)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.aop.InterceptorBean
import io.micronaut.aop.MethodInterceptor
import io.micronaut.aop.MethodInvocationContext
import java.util.Objects
import jakarta.inject.Singleton

@Singleton
@InterceptorBean(NotNull::class) // (1)
class NotNullInterceptor : MethodInterceptor<Any, Any> { // (2)
    override fun intercept(context: MethodInvocationContext<Any, Any>): Any? {
        val nullParam = context.parameters
                .entries
                .stream()
                .filter { entry ->
                    val argumentValue = entry.value
                    Objects.isNull(argumentValue.value)
                }
                .findFirst() // (3)
        return if (nullParam.isPresent) {
            throw IllegalArgumentException("Null parameter [${nullParam.get().key}] not allowed") // (4)
        } else {
            context.proceed() // (5)
        }
    }
}
```

  </TabItem>
</Tabs>

1. [@InterceptorBean](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/InterceptorBean.html) 注解用于指示与拦截器关联的注解。请注意，[@InterceptorBean](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/InterceptorBean.html) 是用默认作用域 `@Singleton` 进行元注解的，因此，如果你希望创建一个新的拦截器并与每个被拦截的 bean 相关联，则应该用 [@Prototype](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Prototype.html) 对拦截器进行注解。
2. 拦截器实现 [MethodInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInterceptor.html) 接口。
3. 传递的 [MethodInvocationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInvocationContext.html) 用于查找第一个为 `null` 的参数
4. 如果发现 `null` 参数，则引发异常
5. 否则将调用 [processed()](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/InvocationContext.html#proceed--) 以继续进行方法调用。

:::tip 注意
Micronaut AOP拦截器不使用反射，这提高了性能并减少了堆栈跟踪大小，从而改进了调试。
:::

将注解应用于目标类以使新的 `MethodInterceptor` 工作：

*围绕通知使用示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import jakarta.inject.Singleton;

@Singleton
public class NotNullExample {

    @NotNull
    void doWork(String taskName) {
        System.out.println("Doing job: " + taskName);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import jakarta.inject.Singleton

@Singleton
class NotNullExample {

    @NotNull
    void doWork(String taskName) {
        println "Doing job: $taskName"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import jakarta.inject.Singleton

@Singleton
open class NotNullExample {

    @NotNull
    open fun doWork(taskName: String?) {
        println("Doing job: $taskName")
    }
}
```

  </TabItem>
</Tabs>

每当 `NotNullExample` 类型被注入到类中时，就会注入编译时生成的代理，该代理使用前面定义的 `@NotNull` 建议装饰方法调用。你可以通过写一个测试来验证这个建议是否有效。以下测试验证当参数为 `null` 时是否引发了预期的异常：

*环绕通知测试*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Rule
public ExpectedException thrown = ExpectedException.none();

@Test
public void testNotNull() {
    try (ApplicationContext applicationContext = ApplicationContext.run()) {
        NotNullExample exampleBean = applicationContext.getBean(NotNullExample.class);

        thrown.expect(IllegalArgumentException.class);
        thrown.expectMessage("Null parameter [taskName] not allowed");

        exampleBean.doWork(null);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void "test not null"() {
    when:
    def applicationContext = ApplicationContext.run()
    def exampleBean = applicationContext.getBean(NotNullExample)

    exampleBean.doWork(null)

    then:
    IllegalArgumentException e = thrown()
    e.message == 'Null parameter [taskName] not allowed'

    cleanup:
    applicationContext.close()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Test
fun testNotNull() {
    val applicationContext = ApplicationContext.run()
    val exampleBean = applicationContext.getBean(NotNullExample::class.java)

    val exception = shouldThrow<IllegalArgumentException> {
        exampleBean.doWork(null)
    }
    exception.message shouldBe "Null parameter [taskName] not allowed"
    applicationContext.close()
}
```

  </TabItem>
</Tabs>

:::tip 注意
由于 Micronaut 注入发生在编译时，通常建议应该打包在一个依赖的 JAR 文件中，该文件在编译上述测试时位于 classpath 上。它不应该在同一个代码库中，因为你不希望在编译建议本身之前编译测试。
:::

### 自定义代理生成

环绕注解的默认行为是在编译时生成一个代理，该代理是代理类的子类。换句话说，在前面的例子中，将生成NotNullExample类的编译时子类，其中代理方法用拦截器处理进行修饰，并且通过调用super来调用原始行为。

这种行为更有效，因为只需要一个bean实例，但根据用例的不同，你可能希望更改这种行为。@Around注解支持各种属性，这些属性允许你更改此行为，包括：

- `proxyTarget`（默认为 `false`）——如果设置为 `true`，则代理将委托给原始bean实例，而不是调用super的子类
- `hotswap`（默认为 `false`）——与 `proxyTarget=true` 相同，但除此之外，代理实现了 [HotSwappableInterceptedProxy](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/HotSwappableInterceptedProxy.html)，它将每个方法调用封装在 `ReentrantReadWriteLock` 中，并允许在运行时交换目标实例。
- `lazy`（默认为 `false`）——默认情况下，Micronaut 在创建代理时急切地初始化代理目标。如果设置为 `true`，则会为每个方法调用延迟解析代理目标。

### @Factory Bean 上的 AOP 通知

当应用于 [Bean 工厂](../core/ioc.html#38-bean-工厂)时，AOP 通知的语义与普通 Bean 不同，应用了以下规则：

1. 在 [@Factory](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Factory.html) bean 的类级别应用的 AOP 通知将该建议应用于工厂本身，而不是应用于使用 [@Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 注解定义的任何 bean。
2. 应用于 bean 作用域注解的方法上的 AOP 通知，将会把 AOP 通知应用于工厂生产的 bean。

考虑以下两个示例：

*`@Factory` 类型级别的 AOP 通知*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Timed
@Factory
public class MyFactory {

    @Prototype
    public MyBean myBean() {
        return new MyBean();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Timed
@Factory
class MyFactory {

    @Prototype
    MyBean myBean() {
        new MyBean()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Timed
@Factory
open class MyFactory {

    @Prototype
    open fun myBean(): MyBean {
        return MyBean()
    }
}
```

  </TabItem>
</Tabs>

上面的例子记录了创建 `MyBean` bean 所花费的时间。

现在考虑这个例子：

*@Factory 方法级别的 AOP 通知*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Factory
public class MyFactory {

    @Prototype
    @Timed
    public MyBean myBean() {
        return new MyBean();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Factory
class MyFactory {

    @Prototype
    @Timed
    MyBean myBean() {
        new MyBean()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Factory
open class MyFactory {

    @Prototype
    @Timed
    open fun myBean(): MyBean {
        return MyBean()
    }
}
```

  </TabItem>
</Tabs>

上面的例子记录了执行 `MyBean` bean 的公共方法所花费的时间，但没有记录 bean 的创建。

这种行为的基本原理是，你有时可能希望向工厂应用通知，有时则希望向工厂生产的 bean 应用通知。

请注意，目前没有办法在方法级别将通知应用于 [@Factory](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Factory.html) bean，所有针对工厂的通知都必须在类型级别应用。通过将未应用通知的方法定义为非公共方法，可以控制哪些方法应用了通知。


## 5.2 引入通知

引入通知和环绕通知的不同之处在于，它涉及提供一个实现，而不是装饰。

引入通知的示例包括为你实现持久性逻辑的 [GORM](https://gorm.grails.org/) 和 [Spring Data](https://projects.spring.io/spring-data)。

Micronaut 的 [Client](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/annotation/Client.html) 注解是引入通知的另一个示例，其中 Micronaut 在编译时为你实现 HTTP 客户端接口。

实施引入通知的方式与实施环绕通知的方式非常相似。

你首先要定义一个注解，为引入通知提供能力。举个例子，假设你想要实现通知，为接口中的每个方法返回一个存根值（测试框架中的常见要求）。考虑以下 `@Stub` 注解：

*引入通知注解示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.aop.Introduction;
import io.micronaut.context.annotation.Bean;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Introduction // (1)
@Bean // (2)
@Documented
@Retention(RUNTIME)
@Target({TYPE, ANNOTATION_TYPE, METHOD})
public @interface Stub {
    String value() default "";
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.aop.Introduction
import io.micronaut.context.annotation.Bean

import java.lang.annotation.Documented
import java.lang.annotation.Retention
import java.lang.annotation.Target

import static java.lang.annotation.ElementType.ANNOTATION_TYPE
import static java.lang.annotation.ElementType.METHOD
import static java.lang.annotation.ElementType.TYPE
import static java.lang.annotation.RetentionPolicy.RUNTIME

@Introduction // (1)
@Bean // (2)
@Documented
@Retention(RUNTIME)
@Target([TYPE, ANNOTATION_TYPE, METHOD])
@interface Stub {
    String value() default ""
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.aop.Introduction
import io.micronaut.context.annotation.Bean
import kotlin.annotation.AnnotationRetention.RUNTIME
import kotlin.annotation.AnnotationTarget.ANNOTATION_CLASS
import kotlin.annotation.AnnotationTarget.CLASS
import kotlin.annotation.AnnotationTarget.FILE
import kotlin.annotation.AnnotationTarget.FUNCTION
import kotlin.annotation.AnnotationTarget.PROPERTY_GETTER
import kotlin.annotation.AnnotationTarget.PROPERTY_SETTER

@Introduction // (1)
@Bean // (2)
@MustBeDocumented
@Retention(RUNTIME)
@Target(CLASS, FILE, ANNOTATION_CLASS, FUNCTION, PROPERTY_GETTER, PROPERTY_SETTER)
annotation class Stub(val value: String = "")
```

  </TabItem>
</Tabs>

1. 引入通知带有 [Introduction](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/Introduction.html)
2. 添加 [Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 注解，以便所有使用 `@Stub` 注解的类型都成为 Bean

上一个例子中提到的 `StubIntroduction` 类必须实现 [MethodInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInterceptor.html) 接口，就像环绕通知一样。

以下是一个示例实现：

*StubIntroduction*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.aop.*;
import io.micronaut.core.annotation.Nullable;
import jakarta.inject.Singleton;

@Singleton
@InterceptorBean(Stub.class) // (1)
public class StubIntroduction implements MethodInterceptor<Object, Object> { // (2)

    @Nullable
    @Override
    public Object intercept(MethodInvocationContext<Object, Object> context) {
        return context.getValue( // (3)
                Stub.class,
                context.getReturnType().getType()
        ).orElse(null); // (4)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.aop.MethodInterceptor
import io.micronaut.aop.MethodInvocationContext
import io.micronaut.aop.InterceptorBean
import io.micronaut.core.annotation.Nullable
import jakarta.inject.Singleton

@Singleton
@InterceptorBean(Stub) // (1)
class StubIntroduction implements MethodInterceptor<Object,Object> { // (2)

    @Nullable
    @Override
    Object intercept(MethodInvocationContext<Object, Object> context) {
        context.getValue( // (3)
                Stub,
                context.returnType.type
        ).orElse(null) // (4)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.aop.*
import jakarta.inject.Singleton

@Singleton
@InterceptorBean(Stub::class) // (1)
class StubIntroduction : MethodInterceptor<Any, Any> { // (2)

    override fun intercept(context: MethodInvocationContext<Any, Any>): Any? {
        return context.getValue<Any>( // (3)
                Stub::class.java,
                context.returnType.type
        ).orElse(null) // (4)
    }
}
```

  </TabItem>
</Tabs>

1. [InterceptorBean](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/InterceptorBean.html) 注解用于将拦截器与 @Stub 注解相关联
2. 该类使用 `@Singleton` 进行注解，并实现 [MethodInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInterceptor.html) 接口
3. 从上下文中读取 `@Stub` 注解的值，并尝试将该值转换为返回类型
4. 否则返回 `null`

现在要在应用程序中使用此介绍建议，请使用 `@Stub` 注解抽象类或接口：

*StubExample*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
StubExample stubExample = applicationContext.getBean(StubExample.class);

assertEquals(10, stubExample.getNumber());
assertNull(stubExample.getDate());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
when:
def stubExample = applicationContext.getBean(StubExample)

then:
stubExample.number == 10
stubExample.date == null
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val stubExample = applicationContext.getBean(StubExample::class.java)

stubExample.number.shouldBe(10)
stubExample.date.shouldBe(null)
```

  </TabItem>
</Tabs>

请注意，如果引入通知无法实现该方法，请调用 [MethodInvocationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInvocationContext.html) 的 `proceed` 方法。这允许其他引入通知拦截器实现该方法，并且如果没有建议可以实现该方法则将抛出UnsupportedOperationException。

此外，如果存在多个引入通知，你可能希望覆盖 [MethodInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInterceptor.html) 的 `getOrder()` 方法来控制通知的优先级。

以下部分介绍了 Micronaut 提供的核心建议类型。

## 5.3 方法适配器通知

在某些情况下，你希望基于方法上注解的存在来引入新的 bean。一个例子是 [@EventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/event/annotation/EventListener.html) 注解，它为调用注解方法的每个注解方法生成 [ApplicationEventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ApplicationEventListener.html) 的实现。

例如，以下代码段在 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 启动时运行方法中包含的逻辑：

```java
import io.micronaut.context.event.StartupEvent;
import io.micronaut.runtime.event.annotation.EventListener;
...

@EventListener
void onStartup(StartupEvent event) {
    // startup logic here
}
```

[@EventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/event/annotation/EventListener.html) 注解的存在导致 Micronaut 创建一个新的类，该类实现 [ApplicationEventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ApplicationEventListener.html) 并调用上面 bean 中定义的 `onStartup` 方法。

[@EventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/event/annotation/EventListener.html) 的实际实现是微不足道的；它只需使用 [@Adapter](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/Adapter.html) 注解来指定它所适应的 SAM（单个抽象方法）类型：

```java
import io.micronaut.aop.Adapter;
import io.micronaut.context.event.ApplicationEventListener;
import io.micronaut.core.annotation.Indexed;

import java.lang.annotation.*;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Retention(RUNTIME)
@Target({ElementType.ANNOTATION_TYPE, ElementType.METHOD})
@Adapter(ApplicationEventListener.class) (1)
@Indexed(ApplicationEventListener.class)
@Inherited
public @interface EventListener {
}
```

1. [@Adapter](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/Adapter.html) 注解指示要适配的 SAM 类型，在本例中为  [ApplicationEventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ApplicationEventListener.html)。

:::tip 注意
如果指定了通用类型，Micronaut 还会自动对齐 SAM 接口的通用类型。
:::

使用此机制，你可以定义自定义注解，这些注解使用 [@Adapter](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/Adapter.html) 注解和 SAM 接口在编译时为你自动实现 bean。

## 5.4 Bean 生命周期通知

有时你可能需要将建议应用于 bean 的生命周期。在这种情况下，有三种类型的建议适用：

- 拦截 bean 的构造
- 拦截 bean 的 `@PostConstruct` 调用
- 拦截 bean 的 `@PreDestroy` 调用

Micronaut 通过允许定义额外的 [@InterceptorBinding](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/InterceptorBinding.html) 元注解来支持这3个用例。

考虑以下注解定义：

*AroundConstruct 示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.aop.*;
import io.micronaut.context.annotation.Prototype;
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@AroundConstruct // (1)
@InterceptorBinding(kind = InterceptorKind.POST_CONSTRUCT) // (2)
@InterceptorBinding(kind = InterceptorKind.PRE_DESTROY) // (3)
@Prototype // (4)
public @interface ProductBean {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.aop.*
import io.micronaut.context.annotation.Prototype
import java.lang.annotation.*

@Retention(RetentionPolicy.RUNTIME)
@AroundConstruct // (1)
@InterceptorBinding(kind = InterceptorKind.POST_CONSTRUCT) // (2)
@InterceptorBinding(kind = InterceptorKind.PRE_DESTROY) // (3)
@Prototype // (4)
@interface ProductBean {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.aop.AroundConstruct
import io.micronaut.aop.InterceptorBinding
import io.micronaut.aop.InterceptorBindingDefinitions
import io.micronaut.aop.InterceptorKind
import io.micronaut.context.annotation.Prototype

@Retention(AnnotationRetention.RUNTIME)
@AroundConstruct // (1)
@InterceptorBindingDefinitions(
    InterceptorBinding(kind = InterceptorKind.POST_CONSTRUCT), // (2)
    InterceptorBinding(kind = InterceptorKind.PRE_DESTROY) // (3)
)
@Prototype // (4)
annotation class ProductBean
```

  </TabItem>
</Tabs>

1. 添加 [@AroundConstruct](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/AroundConstruct.html) 注解以指示应该发生对构造函数的拦截
2. [@InterceptorBinding](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/InterceptorBinding.html) 定义用于指示应进行 @PostConstruct 拦截
3. [@InterceptorBinding](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/InterceptorBinding.html) 定义用于指示应进行 @PreDestroy 拦截
4. bean 被定义为 [@Prototype](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Prototype.html)，因此每个注入点都需要一个新的实例

请注意，如果你不需要 `@PostConstruct` 和 `@PreDestroy` 拦截，你可以简单地删除这些绑定。

然后可以在目标类上使用 `@ProductBean` 注解：

*使用 AroundConstruct 元注解*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Parameter;

import jakarta.annotation.PreDestroy;

@ProductBean // (1)
public class Product {
    private final String productName;
    private boolean active = false;

    public Product(@Parameter String productName) { // (2)
        this.productName = productName;
    }

    public String getProductName() {
        return productName;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @PreDestroy // (3)
    void disable() {
        active = false;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Parameter
import jakarta.annotation.PreDestroy

@ProductBean // (1)
class Product {
    final String productName
    boolean active = false

    Product(@Parameter String productName) { // (2)
        this.productName = productName
    }

    @PreDestroy // (3)
    void disable() {
        active = false
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Parameter
import jakarta.annotation.PreDestroy

@ProductBean // (1)
class Product(@param:Parameter val productName: String ) { // (2)

    var active: Boolean = false
    @PreDestroy
    fun disable() { // (3)
        active = false
    }
}
```

  </TabItem>
</Tabs>

1. `@ProductBean` 注解是在 `Product` 类型的类上定义的
2. [@Parameter](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Parameter.html) 注解指示此 bean 需要一个参数来完成构造
3. 任何 `@PreDestroy` 或 `@PostConstruct` 方法都是在拦截器链中最后执行的

现在，你可以为构造函数拦截定义 [ConstructorInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/ConstructorInterceptor.html) bean，为 `@PostConstruct` 或 `@PreDestroy` 拦截定义 [MethodInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInterceptor.html)  bean。

以下工厂定义了一个 [ConstructorInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/ConstructorInterceptor.html)，它拦截 `Product` 实例的构造，并将它们注册到一个假设的 `ProductService` 中，首先验证产品名称：

*定义构造函数拦截器*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.aop.*;
import io.micronaut.context.annotation.Factory;

@Factory
public class ProductInterceptors {
    private final ProductService productService;

    public ProductInterceptors(ProductService productService) {
        this.productService = productService;
    }
}

@InterceptorBean(ProductBean.class)
ConstructorInterceptor<Product> aroundConstruct() { // (1)
    return context -> {
        final Object[] parameterValues = context.getParameterValues(); // (2)
        final Object parameterValue = parameterValues[0];
        if (parameterValue == null || parameterValues[0].toString().isEmpty()) {
            throw new IllegalArgumentException("Invalid product name");
        }
        String productName = parameterValues[0].toString().toUpperCase();
        parameterValues[0] = productName;
        final Product product = context.proceed(); // (3)
        productService.addProduct(product);
        return product;
    };
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.aop.*
import io.micronaut.context.annotation.Factory


@Factory
class ProductInterceptors {
    private final ProductService productService

    ProductInterceptors(ProductService productService) {
        this.productService = productService
    }
}

@InterceptorBean(ProductBean.class)
ConstructorInterceptor<Product> aroundConstruct() { // (1)
    return  { context ->
        final Object[] parameterValues = context.parameterValues // (2)
        final Object parameterValue = parameterValues[0]
        if (parameterValue == null || parameterValues[0].toString().isEmpty()) {
            throw new IllegalArgumentException("Invalid product name")
        }
        String productName = parameterValues[0].toString().toUpperCase()
        parameterValues[0] = productName
        final Product product = context.proceed() // (3)
        productService.addProduct(product)
        return product
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.aop.*
import io.micronaut.context.annotation.Factory

@Factory
class ProductInterceptors(private val productService: ProductService) {
}

@InterceptorBean(ProductBean::class)
fun aroundConstruct(): ConstructorInterceptor<Product> { // (1)
    return ConstructorInterceptor { context: ConstructorInvocationContext<Product> ->
        val parameterValues = context.parameterValues // (2)
        val parameterValue = parameterValues[0]
        require(!(parameterValue == null || parameterValues[0].toString().isEmpty())) { "Invalid product name" }
        val productName = parameterValues[0].toString().uppercase()
        parameterValues[0] = productName
        val product = context.proceed() // (3)
        productService.addProduct(product)
        product
    }
}
```

  </TabItem>
</Tabs>

1. 一个新的 [@InterceptorBean](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/InterceptorBean.html) 被定义为[ConstructorInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/ConstructorInterceptor.html)
2. 构造函数参数值可以根据需要进行检索和修改
3. 构造函数可以使用 `processed()` 方法调用

定义拦截 `@PostConstruct` 和 `@PreDestroy` 方法的 [MethodInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInterceptor.html) 实例与为常规方法定义拦截器没有什么不同。然而，请注意，你可以使用传递的 [MethodInvocationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInvocationContext.html) 来识别正在发生的拦截类型，并相应地调整代码，如以下示例所示：

*定义一个构造函数拦截器*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@InterceptorBean(ProductBean.class) // (1)
MethodInterceptor<Product, Object> aroundInvoke() {
    return context -> {
        final Product product = context.getTarget();
        switch (context.getKind()) {
            case POST_CONSTRUCT: // (2)
                product.setActive(true);
                return context.proceed();
            case PRE_DESTROY: // (3)
                productService.removeProduct(product);
                return context.proceed();
            default:
                return context.proceed();
        }
    };
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@InterceptorBean(ProductBean.class) // (1)
MethodInterceptor<Product, Object> aroundInvoke() {
    return { context ->
        final Product product = context.getTarget()
        switch (context.kind) {
            case InterceptorKind.POST_CONSTRUCT: // (2)
                product.setActive(true)
                return context.proceed()
            case InterceptorKind.PRE_DESTROY: // (3)
                productService.removeProduct(product)
                return context.proceed()
            default:
                return context.proceed()
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@InterceptorBean(ProductBean::class)
fun  aroundInvoke(): MethodInterceptor<Product, Any> { // (1)
    return MethodInterceptor { context: MethodInvocationContext<Product, Any> ->
        val product = context.target
        return@MethodInterceptor when (context.kind) {
            InterceptorKind.POST_CONSTRUCT -> { // (2)
                product.active = true
                context.proceed()
            }
            InterceptorKind.PRE_DESTROY -> { // (3)
                productService.removeProduct(product)
                context.proceed()
            }
            else -> context.proceed()
        }
    }
}
```

  </TabItem>
</Tabs>

1. 一个新的 [@InterceptorBean](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/InterceptorBean.html) 被定义为 [MethodInterceptor](https://docs.micronaut.io/3.8.4/api/io/micronaut/aop/MethodInterceptor.html)
2. 处理 `@PostConstruct` 拦截
3. 处理 `@PreDestroy` 拦截

## 5.5 验证通知

验证通知（Validation Advice）是你可能希望在应用程序中使用的最常见的通知类型之一。

验证通知建立在 [Bean Validation JSR 380](https://beanvalidation.org/2.0/spec/) 之上，这是一种用于 Bean 验证的 Java API 规范，它使用 `javax.Validation` 注解，如 `@NotNull`、`@Min` 和 `@Max`，确保 bean 的属性符合特定标准。

Micronaut 为带有 `micronaut-validation` 依赖的 `javax.validation` 注解提供本机支持：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-validation")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-validation</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

或者完全符合 JSR380 的 micronaut-hibernate-validator 依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-hibernate-validator")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-hibernate-validator</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

## 5.6 缓存通知

与 Spring 和 Grails 一样，Micronaut 在 [io.Micronaut.cache](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/package-summary.html) 包中提供缓存注解。

[CacheManager](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/CacheManager.html) 接口允许根据需要插入不同的缓存实现。

[SyncCache](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/SyncCache.html) 接口提供用于缓存的同步 API，而 [AsyncCache](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/AsyncCache.html) API 允许非阻塞操作。

### 缓存注解

支持以下缓存注解：

- [@Cacheable ](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/annotation/Cacheable.html)——表示方法在指定的缓存中是可缓存的
- [@CachePut](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/annotation/CachePut.html)——指示应该缓存方法调用的返回值。与 `@Cacheable` 不同的是，从未跳过原始操作。
- [@CacheInvalidate](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/annotation/CacheInvalidate.html)——指示方法的调用应导致一个或多个缓存失效。

使用其中一个注解会激活 [CacheInterceptor](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/interceptor/CacheInterceptor)，在 `@Cacheable` 的情况下，它会缓存方法的返回值。

如果方法返回类型是非阻塞类型（[CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html) 或 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 实例），则会缓存发出的结果。

此外，如果底层缓存实现支持非阻塞缓存操作，则在不阻塞的情况下读取缓存值，从而产生非阻塞缓存运算。

### 配置缓存

默认情况下，[Caffeine](https://github.com/ben-manes/caffeine) 用于从应用程序配置创建缓存。例如 `application.yml`：

*缓存配置示例*

```yaml
micronaut:
  caches:
    my-cache:
      maximum-size: 20
```

上面的例子配置了一个名为“my-cache”的缓存，最大大小为 20。

:::tip 注意
*命名缓存*

以 kebab 风格（小写和连字符分隔）定义 `micronaut.caches` 下的缓存名称；如果使用驼峰风格，则名称将标准化为 kebab 风格。例如， `myCache` 将成为 `my-cache`。引用 [@Cacheable](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/annotation/Cacheable.html) 注解中的缓存时，必须使用 kebab 风格。
:::

要配置与 `maximumWeight` 配置一起使用的权重，请创建一个实现 `io.micronaut.caffeine.cache.weigher` 的 bean。要将给定的权重仅与特定的缓存关联，请使用 `@Named(<cache name>)` 注解 bean。没有命名限定符的权重适用于所有没有命名权重的缓存。如果没有找到 bean，则使用默认实现。

有关所有可用的配置选项，参阅[配置参考](https://micronaut-projects.github.io/micronaut-cache/latest/guide/configurationreference.html#io.micronaut.cache.caffeine.DefaultCacheConfiguration)。

### 动态缓存创建

对于无法提前配置缓存的用例，可以注册 [DynamicCacheManagerbean](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/DynamicCacheManager.html)。当试图检索未预定义的缓存时，会调用动态缓存管理器来创建并返回缓存。

默认情况下，如果应用程序中没有定义其他动态缓存管理器，Micronaut 会注册 [DefaultDynamicCacheManager](https://micronaut-projects.github.io/micronaut-cache/latest/api/io/micronaut/cache/caffeine/DefaultDynamicCacheManager.html) 的实例，该实例会创建具有默认值的 Caffeine 缓存。

### 其他缓存实现

详细信息，参阅 [Micronaut Cache](../cache/introduction.html) 项目。

## 5.7 重试通知

在分布式系统和微服务环境中，失败是你必须计划的事情，如果操作失败，尝试重试是很常见的。如果第一次没有成功，请再试一次！

考虑到这一点，Micronaut 包含了一个 [Retryable](https://docs.micronaut.io/3.8.4/api/io/micronaut/retry/annotation/Retryable.html) 注解。

### 简单重试

最简单的重试形式就是将 `@Retryable` 注解添加到类型或方法中。`@Retryable` 的默认行为是重试三次，每次重试之间有一秒的指数延迟。（第一次尝试延迟 1s，第二次尝试延迟2s，第三次尝试延迟3s）。

例如：

*简单重试示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Retryable
public List<Book> listBooks() {
    // ...
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Retryable
List<Book> listBooks() {
    // ...
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Retryable
open fun listBooks(): List<Book> {
    // ...
```

  </TabItem>
</Tabs>

在上面的例子中，如果 `listBooks()` 方法抛出 RuntimeException，则会重试，直到达到最大尝试次数。

`@Retryable` 注解的 `multiplier` 可用于配置用于计算重试之间延迟的乘数，从而支持指数重试。

要自定义重试行为，请设置 `attempts` 和 `delay` 成员。例如，配置五次延迟两秒的尝试：

*设置重试尝试*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Retryable(attempts = "5",
           delay = "2s")
public Book findBook(String title) {
    // ...
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Retryable(attempts = "5",
           delay = "2s")
Book findBook(String title) {
    // ...
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Retryable(attempts = "5",
           delay = "2s")
open fun findBook(title: String): Book {
    // ...
```

  </TabItem>
</Tabs>

请注意，`attempts` 和 `delay` 是如何定义为字符串的。这是为了通过注解元数据支持可配置性。例如，你可以允许使用属性占位符解析来配置重试策略：

*通过配置设置重试*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Retryable(attempts = "${book.retry.attempts:3}",
           delay = "${book.retry.delay:1s}")
public Book getBook(String title) {
    // ...
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Retryable(attempts = '${book.retry.attempts:3}',
           delay = '${book.retry.delay:1s}')
Book getBook(String title) {
    // ...
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Retryable(attempts = "\${book.retry.attempts:3}",
           delay = "\${book.retry.delay:1s}")
open fun getBook(title: String): Book {
    // ...
```

  </TabItem>
</Tabs>

有了以上内容，如果在配置中指定了 `book.retry.attempts`，它将通过注解元数据绑定到 `@Retryable` 注解的 `attempts` 成员的值。

---

### 响应式重试

`@Retryable` 通知也可以应用于返回响应类型的方法，例如 `Publisher`（[Project Reactor](https://projectreactor.io/) 的 `Flux` 或 [RxJava](https://github.com/ReactiveX/RxJava) 的 `Flowable`）。例如：

*将重试策略应用于响应类型*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Retryable
public Publisher<Book> streamBooks() {
    // ...
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Retryable
Flux<Book> streamBooks() {
    // ...
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Retryable
open fun streamBooks(): Flux<Book> {
    // ...
```

  </TabItem>
</Tabs>

在这个例子中，`@Retryable` 建议将重试策略应用于响应类型。

---

### 断路器

重试在微服务环境中很有用，但在某些情况下，由于客户端反复尝试失败的操作，过多的重试可能会使系统不堪重负。

[断路器](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern)模式旨在解决此问题，方法是允许一定数量的失败请求，然后打开一个在允许额外重试之前保持打开状态一段时间的电路。

[CircuitBreaker](https://docs.micronaut.io/3.8.4/api/io/micronaut/retry/annotation/CircuitBreaker.html) 注解是 `@Retryable` 注解的变体，它支持一个 `reset` 成员，该成员指示环路在重置之前应保持断开的时间（默认值为 20 秒）。

*应用 CircuitBreaker 通知*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@CircuitBreaker(reset = "30s")
public List<Book> findBooks() {
    // ...
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@CircuitBreaker(reset = "30s")
List<Book> findBooks() {
    // ...
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@CircuitBreaker(reset = "30s")
open fun findBooks(): List<Book> {
    // ...
```

  </TabItem>
</Tabs>

上面的示例重试 `findBooks` 方法三次，然后断开环路 30 秒，重新抛出原始异常并防止潜在的下游流量，如 HTTP 请求和 I/O 操作淹没系统。

---

### 工厂 Bean 重试

当 [@Retryable](https://docs.micronaut.io/3.8.4/api/io/micronaut/retry/annotation/Retryable.html) 被应用于 bean 工厂方法时，它的行为就像注解被放置在要返回的类型上一样。当调用返回对象上的方法时，将应用重试行为。请注意，**不会**重试 bean 工厂方法本身。如果你希望重试创建 bean 的功能，则应该将其委托给另一个应用了 [@Retryable](https://docs.micronaut.io/3.8.4/api/io/micronaut/retry/annotation/Retryable.html) 注解的单例。

例如：

```java
@Factory (1)
public class Neo4jDriverFactory {
    ...
    @Retryable(ServiceUnavailableException.class) (2)
    @Bean(preDestroy = "close")
    public Driver buildDriver() {
        ...
    }
}
```

1. 创建了一个工厂 bean，它定义了创建 bean 的方法
2. [@Retryable](https://docs.micronaut.io/3.8.4/api/io/micronaut/retry/annotation/Retryable.html) 注解用于捕获 `Driver` 上执行的方法引发的异常

### 重试事件

你可以将 [RetryEventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/retry/event/RetryEventListener.html) 实例注册为 bean，以侦听每次重试操作时发布的 [RetryEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/retry/event/RetryEvent.html) 事件。

此外，你可以为 [CircuitOpenEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/retry/event/CircuitOpenEvent.html) 注册事件侦听器，以在断路器环路打开时得到通知，或为 [CircuitClosedEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/retry/event/CircuitClosedEvent.html) 注册，以便当环路关闭时得到通知。

## 5.8 调度任务

与 Spring 和 Grails 类似，Micronaut 具有用于调度后台任务的 [Scheduled](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/annotation/Scheduled.html) 注解。

### 使用 @Scheduled 注解

[Scheduled](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/annotation/Scheduled.html) 注解可以添加到 bean 的任何方法中，并且你应该设置 `fixedRate`、`fixedDelay` 或 `cron` 其中一个成员。

:::tip 注意
请记住，bean 的范围会影响行为。每次执行调度的方法时，`@Singleton` bean 都会共享状态（实例的字段），而对于 `@Prototype` bean，每次执行都会创建一个新实例。
:::

**固定频率调度**

要按固定频率调度任务，请使用 `fixedRate` 成员。例如：

*固定频率示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Scheduled(fixedDelay = "5m")
void fiveMinutesAfterLastExecution() {
    System.out.println("Executing fiveMinutesAfterLastExecution()");
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Scheduled(fixedDelay = "5m")
void fiveMinutesAfterLastExecution() {
    println "Executing fiveMinutesAfterLastExecution()"
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Scheduled(fixedDelay = "5m")
internal fun fiveMinutesAfterLastExecution() {
    println("Executing fiveMinutesAfterLastExecution()")
}
```

  </TabItem>
</Tabs>

**Cron 任务调度**

要调度 [Cron](https://en.wikipedia.org/wiki/Cron) 任务，请使用 `cron` 成员：

*Cron 示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Scheduled(cron = "0 15 10 ? * MON")
void everyMondayAtTenFifteenAm() {
    System.out.println("Executing everyMondayAtTenFifteenAm()");
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Scheduled(cron = "0 15 10 ? * MON")
void everyMondayAtTenFifteenAm() {
    println "Executing everyMondayAtTenFifteenAm()"
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Scheduled(cron = "0 15 10 ? * MON")
internal fun everyMondayAtTenFifteenAm() {
    println("Executing everyMondayAtTenFifteenAm()")
}
```

  </TabItem>
</Tabs>

上面的示例每周一上午 10:15 在服务器的时区运行任务。

**只有初始延迟的调度**

要调度任务，使其在服务器启动后运行一次，请使用 `initialDelay` 成员：

*初始延迟示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Scheduled(initialDelay = "1m")
void onceOneMinuteAfterStartup() {
    System.out.println("Executing onceOneMinuteAfterStartup()");
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Scheduled(initialDelay = "1m")
void onceOneMinuteAfterStartup() {
    println "Executing onceOneMinuteAfterStartup()"
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Scheduled(initialDelay = "1m")
internal fun onceOneMinuteAfterStartup() {
    println("Executing onceOneMinuteAfterStartup()")
}
```

  </TabItem>
</Tabs>

上面的示例只运行一次，即服务器启动后一分钟。

### 编程调用任务

要以编程方式调度任务，请使用 [TaskScheduler](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/TaskScheduler.html) bean，该 bean 可以按如下方式注入：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Inject
@Named(TaskExecutors.SCHEDULED)
TaskScheduler taskScheduler;
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Inject
@Named(TaskExecutors.SCHEDULED)
TaskScheduler taskScheduler
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Inject
@Named(TaskExecutors.SCHEDULED)
lateinit var taskScheduler: TaskScheduler
```

  </TabItem>
</Tabs>

### 使用注解元数据配置计划任务

要使应用程序的任务可配置，可以使用注解元数据和属性占位符配置。例如：

*允许任务被配置*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Scheduled(fixedRate = "${my.task.rate:5m}",
        initialDelay = "${my.task.delay:1m}")
void configuredTask() {
    System.out.println("Executing configuredTask()");
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Scheduled(fixedRate = '${my.task.rate:5m}',
        initialDelay = '${my.task.delay:1m}')
void configuredTask() {
    println "Executing configuredTask()"
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Scheduled(fixedRate = "\${my.task.rate:5m}",
        initialDelay = "\${my.task.delay:1m}")
internal fun configuredTask() {
    println("Executing configuredTask()")
}
```

  </TabItem>
</Tabs>

上述示例允许使用属性 `my.task.rate` 配置任务执行频率，并使用属性 `my_task.delay` 配置初始延迟。

### 配置调度任务线程池

默认情况下，由 `@Scheduled` 执行的任务在 [ScheduledExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledExecutorService.html) 上运行，该服务配置为具有两倍于可用处理器的线程数。

你可以使用 `application.yml` 配置此线程池，例如：

*配置调度任务线程池*

```yaml
micronaut:
  executors:
    scheduled:
      type: scheduled
      core-pool-size: 30
```

*表 1. [UserExecutorConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/executor/UserExecutorConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.executors.*.n-threads|java.lang.Integer||
|micronaut.executors.*.type|[ExecutorType](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/executor/ExecutorType.html)||
|micronaut.executors.*.parallelism|java.lang.Integer||
|micronaut.executors.*.core-pool-size|java.lang.Integer||
|micronaut.executors.*.thread-factory-class|java.lang.Class||
|micronaut.executors.*.name|java.lang.String|设置执行器名字。|
|micronaut.executors.*.number-of-threads|java.lang.Integer|设置 [FIXED](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/executor/ExecutorType.html#FIXED) 的线程数。默认值（ 2 * Java 虚拟机可用的处理器数量）|

---

### 异常处理

默认情况下，Micronaut 包括一个 [DefaultTaskExceptionHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/DefaultTaskExceptionHandler.html) bean，它实现 [TaskExceptionHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/TaskExceptionHandler.html) 接口，并在调用计划任务时发生错误时简单地记录异常。

如果你有自定义需求，你可以用自己的实现来替换这个 bean（例如发送电子邮件或关闭上下文以快速失败）。要做到这一点，请编写自己的 [TaskExceptionHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/TaskExceptionHandler.html)，并用 @Replaces(DefaultTaskExceptionHandler.class) 对其进行注解。

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#aop)

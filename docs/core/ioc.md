---
sidebar_position: 30
---

# 3. 控制反转（IoC）

与其他依赖于运行时反射和代理的框架不同，Micronaut 使用编译时数据来实现依赖注入。

这是 Google [Dagger](https://google.github.io/dagger/) 等工具采用的类似方法，该工具的设计主要考虑到了 Android。另一方面，Micronaut 是为构建服务器端微服务而设计的，它提供了许多与其他框架相同的工具和实用程序，但没有使用反射或缓存过多的反射元数据。

Micronaut IoC 容器的目标概括如下：
- 将反思作为最后手段
- 避免代理
- 优化启动时间
- 减少内存占用
- 提供清晰易懂的错误处理

请注意，Micronaut 的 IoC 部分可以完全独立于 Micronaut 用于你希望构建的任何应用程序类型。

为此，请将构建配置为包含 `micronaut-inject-java` 依赖项作为注解处理器。

最简单的方法是使用 Micronaut 的 Gradle 或 Maven 插件。例如 Gradle：

*配置 Gradle*

```groovy
plugins {
    id 'io.micronaut.library' version '1.3.2' (1)
}

version "0.1"
group "com.example"

repositories {
    mavenCentral()
}

micronaut {
    version = "3.8.4" (2)
}
```

1. 定义 [Micronaut Library 插件](https://plugins.gradle.org/plugin/io.micronaut.library)
2. 指定使用的 Micronaut 版本

IoC 的入口点是 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 接口，它包括一个 `run` 方法。以下示例演示如何使用它：

*运行 ApplicationContext*

```java
try (ApplicationContext context = ApplicationContext.run()) { (1)
    MyBean myBean = context.getBean(MyBean.class); (2)
    // do something with your bean
}
```

1. 运行 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html)
2. 从 ApplicationContext 获取一个 bean

:::tip 注意
该示例使用 Java [try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) 语法来确保 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 在应用程序退出时完全关闭
:::

## 3.1 定义 Bean

bean 是一个对象，其生命周期由 Micronaut IoC 容器管理。该生命周期可能包括创建、执行和销毁。Micronaut 实现了 [JSR-330（javax.inject—— Java 依赖注入](https://javax-inject.github.io/javax-inject/) 规范，因此要使用 Micronaut，只需使用 [javax.inject 提供的注解](https://docs.oracle.com/javaee/6/api/javax/inject/package-summary.html)即可。

以下是一个简单的示例：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public interface Engine { // (1)
    int getCylinders();
    String start();
}

@Singleton// (2)
public class V8Engine implements Engine {
    private int cylinders = 8;

    @Override
    public String start() {
        return "Starting V8";
    }

    @Override
    public int getCylinders() {
        return cylinders;
    }

    public void setCylinders(int cylinders) {
        this.cylinders = cylinders;
    }
}

@Singleton
public class Vehicle {
    private final Engine engine;

    public Vehicle(Engine engine) {// (3)
        this.engine = engine;
    }

    public String start() {
        return engine.start();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
interface Engine { // (1)
    int getCylinders()
    String start()
}

@Singleton // (2)
class V8Engine implements Engine {
    int cylinders = 8

    @Override
    String start() {
        "Starting V8"
    }
}

@Singleton
class Vehicle {
    final Engine engine

    Vehicle(Engine engine) { // (3)
        this.engine = engine
    }

    String start() {
        engine.start()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
interface Engine {
    // (1)
    val cylinders: Int

    fun start(): String
}

@Singleton// (2)
class V8Engine : Engine {

    override var cylinders = 8

    override fun start(): String {
        return "Starting V8"
    }
}

@Singleton
class Vehicle(private val engine: Engine) { // (3)
    fun start(): String {
        return engine.start()
    }
}
```

  </TabItem>
</Tabs>

1. 定义了通用 `Engine` 接口
2. `V8Engine` 实现被定义并标记为 `Singleton` 作用域
3. 通过构造函数注入来注入 `Engine`

要执行依赖注入，请使用 `run()` 方法运行 [BeanContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/BeanContext.html)，并使用 `getBean(Class)` 查找 bean，如下例所示：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
final BeanContext context = BeanContext.run();
Vehicle vehicle = context.getBean(Vehicle.class);
System.out.println(vehicle.start());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
def context = BeanContext.run()
Vehicle vehicle = context.getBean(Vehicle)
println vehicle.start()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val context = BeanContext.run()
val vehicle = context.getBean(Vehicle::class.java)
println(vehicle.start())
```

  </TabItem>
</Tabs>

Micronaut 自动发现 classpath 上的依赖注入元数据，并根据你定义的注入点将 bean 连接在一起。

Micronaut 支持以下类型的依赖注入：

- 构造函数注入（必须是一个公共构造函数或带有 `@Inject` 注解的单个构造函数）
- 字段注入
- JavaBean 属性注入
- 方法参数注入

## 3.2 它如何工作？

此时，你可能想知道 Micronaut 如何在不需要反射的情况下执行上述依赖注入。

关键是一组 AST 转换（对于 Groovy）和注解处理器（对于 Java），它们生成实现 [BeanDefinition](https://docs.micronaut.io/3.8.4/api/io/micronaut/inject/BeanDefinition.html) 接口的类。

Micronaut 使用 ASM 字节码库来生成类，因为 Micronaut 提前知道注入点，所以不需要像其他框架，如 Spring 那样在运行时扫描所有方法、字段、构造函数等。

此外，由于在构建 bean 时不使用反射，JVM 可以更好地内联和优化代码，从而提高运行时性能并减少内存消耗。这对于应用程序性能依赖于 bean 创建性能的非单例作用域尤为重要。

此外，使用 Micronaut，你的应用程序启动时间和内存消耗不会受到代码库大小的影响，与使用反射的框架一样。基于反射的 IoC 框架为代码中的每个字段、方法和构造函数加载和缓存反射数据。因此，随着代码大小的增加，内存需求也会随之增加，而使用 Micronaut 时情况并非如此。

## 3.3 BeanContext

[BeanContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/BeanContext.html) 是所有 bean 定义的容器对象（它还实现了 [BeanDefinitionRegistry](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/BeanDefinitionRegistry.html)）。

这也是 Micronaut 的初始化点。然而，一般来说，你不直接与 `BeanContext` API 交互，只需使用 `jakarta.inject` 注解和 [io.micronaut.context.annotation](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/package-summary.html) 包中的注解即可满足依赖注入需求。

## 3.4 可注入容器类型

除了能够注入 bean 之外，Micronaut 还支持注入以下类型：

*表1. 可注入容器类型*

|类型|描述|示例|
|--|--|--|
|[java.util.Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)|`Optional` 的 bean。如果 bean 不存在，注入 `empty()`|`Optional<Engine>`|
|[java.lang.Collection](https://docs.oracle.com/javase/8/docs/api/java/util/Collection.html)|`Collection` 或 `Collection` 子类型（如，`List`、`Set` 等)|`Collection<Engine>`|
|[java.util.stream.Stream](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html)|懒 `Stream` 的 bean|`Stream<Engine>`|
|[Array](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/Array.html)|给定类型的 bean 的本地数组|`Engine[]`|
|[Provider](https://docs.oracle.com/javaee/6/api/javax/inject/Provider.html)|如果循环依赖需要它，是一个 `javax.inject.Provider`，或者为每个 `get` 调用实例化一个原型。|`Provider<Engine>`|
|[Provider](https://jakarta.ee/specifications/platform/9/apidocs/jakarta/inject/Provider.html)|如果循环依赖需要它，是一个 `jakarta.inject.Provider`，或者为每个 `get` 调用实例化一个原型。|`Provider<Engine>`|
|[BeanProvider](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/BeanProvider.html)|如果循环依赖需要它，是一个 `io.micronaut.context.BeanProvider`，或者为每个 `get` 调用实例化一个原型。|`BeanProvider<Engine>`|

:::tip 注意
支持 3 种不同的提供器类型，但我们建议使用 `BeanProvider`。
:::

:::tip 注意
当将 `java.lang.Collection` 或 `java.util.stream.stream`、`Array` 的 bean 注入到与注入类型匹配的 bean 中时，所属 bean 将不会是注入集合的成员。证明这一点的一种常见模式是聚合。例如：

```java
@Singleton
class AggregateEngine implements Engine {
  @Inject
  List<Engine> engines;

  @Override
  public void start() {
    engines.forEach(Engine::start);
  }

  ...
}
```

在此示例中，注入的成员变量 `engines` 将不包含 `AggregateEngine` 的实例
:::

:::note 提示
原型 bean 将在注入 bean 的每个位置创建一个实例。当将原型bean作为提供器注入时，每次调用 `get()` 都会创建一个新实例。
:::

**集合排序**

在注入 bean 集合时，默认情况下不会对它们进行排序。实现 [Ordered](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/order/Ordered.html) 接口以注入有序集合。如果请求的 bean 类型未实现 [Ordered](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/order/Ordered.html)，Micronaut 将在 bean 上搜索 [@Order](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Order.html) 注解。

 [@Order](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Order.html) 注解特别适用于对工厂创建的 bean 进行排序，其中 bean 类型是第三方库中的类。在此示例中，`LowRateLimit` 和 `HighRateLimit` 都实现 `RateLimit` 接口。

 *带 @Order 的工厂*

 <Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Factory;
import io.micronaut.core.annotation.Order;

import jakarta.inject.Singleton;
import java.time.Duration;

@Factory
public class RateLimitsFactory {

    @Singleton
    @Order(20)
    LowRateLimit rateLimit2() {
        return new LowRateLimit(Duration.ofMinutes(50), 100);
    }

    @Singleton
    @Order(10)
    HighRateLimit rateLimit1() {
        return new HighRateLimit(Duration.ofMinutes(50), 1000);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Factory
import io.micronaut.core.annotation.Order

import jakarta.inject.Singleton
import java.time.Duration

@Factory
class RateLimitsFactory {

    @Singleton
    @Order(20)
    LowRateLimit rateLimit2() {
        new LowRateLimit(Duration.ofMinutes(50), 100);
    }

    @Singleton
    @Order(10)
    HighRateLimit rateLimit1() {
        new HighRateLimit(Duration.ofMinutes(50), 1000);
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Factory
import io.micronaut.core.annotation.Order
import java.time.Duration
import jakarta.inject.Singleton

@Factory
class RateLimitsFactory {

    @Singleton
    @Order(20)
    fun rateLimit2(): LowRateLimit {
        return LowRateLimit(Duration.ofMinutes(50), 100)
    }

    @Singleton
    @Order(10)
    fun rateLimit1(): HighRateLimit {
        return HighRateLimit(Duration.ofMinutes(50), 1000)
    }
}
```

  </TabItem>
</Tabs>

当从上下文请求 `RateLimit` bean 集合时，将根据注解中的值以升序返回它们。

**按顺序注入 Bean**

当注入 bean 的单个实例时，[@Order](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Order.html) 注解也可以用于定义哪个 bean 具有最高优先级，因而应该注入。

:::tip 注意
选择单个实例时不考虑 [Ordered](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/order/Ordered.html) 接口，因为这需要实例化 bean 来解析顺序
:::

## 3.5 Bean 限定符

如果给定接口有多个可能的实现要注入，则需要使用限定符。

Micronaut 再次利用 JSR-330 以及 [Qualifier](https://docs.oracle.com/javaee/6/api/javax/inject/Qualifier.html) 和 [Named](https://docs.oracle.com/javaee/6/api/javax/inject/Named.html) 注解来支持此用例。

### 按名字限定

要按名称限定，请使用 [Named](https://docs.oracle.com/javaee/6/api/javax/inject/Named.html) 注解。例如，考虑以下类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public interface Engine { // (1)
    int getCylinders();
    String start();
}

@Singleton
public class V6Engine implements Engine {  // (2)
    @Override
    public String start() {
        return "Starting V6";
    }

    @Override
    public int getCylinders() {
        return 6;
    }
}

@Singleton
public class V8Engine implements Engine {  // (3)
    @Override
    public String start() {
        return "Starting V8";
    }

    @Override
    public int getCylinders() {
        return 8;
    }

}

@Singleton
public class Vehicle {
    private final Engine engine;

    @Inject
    public Vehicle(@Named("v8") Engine engine) {// (4)
        this.engine = engine;
    }

    public String start() {
        return engine.start();// (5)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
interface Engine { // (1)
    int getCylinders()
    String start()
}

@Singleton
class V6Engine implements Engine { // (2)
    int cylinders = 6

    @Override
    String start() {
        "Starting V6"
    }
}

@Singleton
class V8Engine implements Engine { // (3)
    int cylinders = 8

    @Override
    String start() {
        "Starting V8"
    }
}

@Singleton
class Vehicle {
    final Engine engine

    @Inject Vehicle(@Named('v8') Engine engine) { // (4)
        this.engine = engine
    }

    String start() {
        engine.start() // (5)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
interface Engine { // (1)
    val cylinders: Int
    fun start(): String
}

@Singleton
class V6Engine : Engine {  // (2)

    override var cylinders: Int = 6

    override fun start(): String {
        return "Starting V6"
    }
}

@Singleton
class V8Engine : Engine {

    override var cylinders: Int = 8

    override fun start(): String {
        return "Starting V8"
    }

}

@Singleton
class Vehicle @Inject
constructor(@param:Named("v8") private val engine: Engine) { // (4)

    fun start(): String {
        return engine.start() // (5)
    }
}
```

  </TabItem>
</Tabs>

1. `Engine` 接口定义通用合同
2. `V6Engine` 类是第一个实现
3. `V8Engine` 类是第二个实现
4. [javax.inject.Named](https://docs.oracle.com/javaee/6/api/javax/inject/Named.html) 注解表示需要 `V8Engine` 实现
5. 调用 start 方法打印：`"Starting V8"`

Micronaut 能够在前面的示例中注入 `V8Engine`，因为：

`@Named` 限定符（`v8`）+ 注入的类型简单名称（`Engine`）==（不区分大小写）== `Engine` 类型的 bean 的简单名称（`V8Engine`）

你还可以在 bean 的类级别声明 [@Named](https://docs.oracle.com/javaee/6/api/javax/inject/Named.html)，以显式定义 bean 的名称。

### 按注解限定

除了能够按名称限定外，还可以使用 [Qualifier](https://docs.oracle.com/javaee/6/api/javax/inject/Qualifier.html) 注解构建自己的限定符。例如，考虑以下注解：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import jakarta.inject.Qualifier;
import java.lang.annotation.Retention;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Qualifier
@Retention(RUNTIME)
public @interface V8 {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import jakarta.inject.Qualifier
import java.lang.annotation.Retention

import static java.lang.annotation.RetentionPolicy.RUNTIME

@Qualifier
@Retention(RUNTIME)
@interface V8 {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import jakarta.inject.Qualifier
import java.lang.annotation.Retention
import java.lang.annotation.RetentionPolicy.RUNTIME

@Qualifier
@Retention(RUNTIME)
annotation class V8
```

  </TabItem>
</Tabs>

上面的注解本身使用 `@Qualifier` 进行注解，以将其指定为限定符。然后可以在代码中的任何注入点使用注解。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Inject Vehicle(@V8 Engine engine) {
    this.engine = engine;
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.NonBinding
import jakarta.inject.Qualifier
import java.lang.annotation.Retention

import static java.lang.annotation.RetentionPolicy.RUNTIME

@Qualifier // (1)
@Retention(RUNTIME)
@interface Cylinders {
    int value();

    @NonBinding // (2)
    String description() default "";
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.NonBinding
import jakarta.inject.Qualifier
import kotlin.annotation.Retention

@Qualifier // (1)
@Retention(AnnotationRetention.RUNTIME)
annotation class Cylinders(
    val value: Int,
    @get:NonBinding // (2)
    val description: String = ""
)
```

  </TabItem>
</Tabs>

1. `@Cylinders` 注解使用 `@Qualifier` 进行元注解
2. 注解有两个成员。[@NonBinding](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/NonBinding.html) 注解用于在依赖项解析期间排除描述成员。

然后，你可以在任何 bean 上使用 `@Cylinders` 注解，并且在依赖关系解析期间会考虑未使用 [@NonBinding](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/NonBinding.html) 注解的成员：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
@Cylinders(value = 6, description = "6-cylinder V6 engine")  // (1)
public class V6Engine implements Engine { // (2)

    @Override
    public int getCylinders() {
        return 6;
    }

    @Override
    public String start() {
        return "Starting V6";
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
@Cylinders(value = 6, description = "6-cylinder V6 engine")  // (1)
class V6Engine implements Engine { // (2)

    @Override
    int getCylinders() {
        return 6
    }

    @Override
    String start() {
        return "Starting V6"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
@Cylinders(value = 6, description = "6-cylinder V6 engine") // (1)
class V6Engine : Engine { // (2)
    // (2)
    override val cylinders: Int
        get() = 6

    override fun start(): String {
        return "Starting V6"
    }
}
```

  </TabItem>
</Tabs>

1. 此处，`V6Engine` 类型的 `value` 成员设置为 `6`
2. 该类实现 `Engine` 接口

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
@Cylinders(value = 8, description = "8-cylinder V8 engine") // (1)
public class V8Engine implements Engine { // (2)
    @Override
    public int getCylinders() {
        return 8;
    }

    @Override
    public String start() {
        return "Starting V8";
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
@Cylinders(value = 8, description = "8-cylinder V8 engine") // (1)
class V8Engine implements Engine { // (2)
    @Override
    int getCylinders() {
        return 8
    }

    @Override
    String start() {
        return "Starting V8"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
@Cylinders(value = 8, description = "8-cylinder V8 engine") // (1)
class V8Engine : Engine { // (2)
    override val cylinders: Int
        get() = 8

    override fun start(): String {
        return "Starting V8"
    }
}
```

  </TabItem>
</Tabs>

1. 这里，`V8Engine` 类型的 `value` 成员设置为 `8`
2. 该类实现 `Engine` 接口

然后可以在任何注入点上使用 `@Cylinder` 限定符来选择要注入的正确 bean。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public interface Engine<T extends CylinderProvider> { // (1)
    default int getCylinders() {
        return getCylinderProvider().getCylinders();
    }

    default String start() {
        return "Starting " + getCylinderProvider().getClass().getSimpleName();
    }

    T getCylinderProvider();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
interface CylinderProvider {
    int getCylinders()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
class Vehicle(@param:Cylinders(8) val engine: Engine) {
    fun start(): String {
        return engine.start()
    }
}
```

  </TabItem>
</Tabs>

### 按泛型类型参数限定

从 Micronaut 3.0 开始，可以根据类或接口的泛型类型参数选择要注入的 bean。考虑以下示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public interface CylinderProvider {
    int getCylinders();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
interface CylinderProvider {
    int getCylinders()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
interface CylinderProvider {
    val cylinders: Int
}
```

  </TabItem>
</Tabs>

`CylinderProvider` 接口提供 cylinder 数。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public interface Engine<T extends CylinderProvider> { // (1)
    default int getCylinders() {
        return getCylinderProvider().getCylinders();
    }

    default String start() {
        return "Starting " + getCylinderProvider().getClass().getSimpleName();
    }

    T getCylinderProvider();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
interface Engine<T extends CylinderProvider> { // (1)
    default int getCylinders() { cylinderProvider.cylinders }

    default String start() { "Starting ${cylinderProvider.class.simpleName}" }

    T getCylinderProvider()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
interface Engine<T : CylinderProvider> { // (1)
    val cylinders: Int
        get() = cylinderProvider.cylinders

    fun start(): String {
        return "Starting ${cylinderProvider.javaClass.simpleName}"
    }

    val cylinderProvider: T
}
```

  </TabItem>
</Tabs>

1. 引擎类定义了一个泛型类型参数 `<T>`，该参数必须是 `CylinderProvider` 的实例

你可以使用不同的泛型类型参数定义 `Engine` 接口的实现。例如，对于 V6 engine：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public class V6 implements CylinderProvider {
    @Override
    public int getCylinders() {
        return 6;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
class V6Engine implements Engine<V6> {  // (1)
    @Override
    V6 getCylinderProvider() { new V6() }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
class V8 : CylinderProvider {
    override val cylinders: Int = 8
}
```

  </TabItem>
</Tabs>

上面定义了一个实现 `CylinderProvider` 接口的 V8 类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Inject
public Vehicle(Engine<V8> engine) {
    this.engine = engine;
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Inject
Vehicle(Engine<V8> engine) {
    this.engine = engine
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
class V8Engine : Engine<V8> { // (1)
    override val cylinderProvider: V8
        get() = V8()
}
```

  </TabItem>
</Tabs>

### 首选及备选 Bean

[Primary](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Primary.html) 是一个限定符，表示在多个接口实现的情况下，bean 要选择的首选 bean。

考虑以下示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public interface ColorPicker {
    String color();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
interface ColorPicker {
    String color()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
interface ColorPicker {
    fun color(): String
}
```

  </TabItem>
</Tabs>

`ColorPicker` 由以下类实现：

*首选 Bean*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Primary;
import jakarta.inject.Singleton;

@Primary
@Singleton
class Green implements ColorPicker {

    @Override
    public String color() {
        return "green";
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Primary
import jakarta.inject.Singleton

@Primary
@Singleton
class Green implements ColorPicker {

    @Override
    String color() {
        return "green"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Primary
import jakarta.inject.Singleton

@Primary
@Singleton
class Green: ColorPicker {
    override fun color(): String {
        return "green"
    }
}
```

  </TabItem>
</Tabs>

`Green` bean 类实现 `ColorPicker`，并用 `@Primary` 注解。

*同类型的另一个 Bean*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import jakarta.inject.Singleton;

@Singleton
public class Blue implements ColorPicker {

    @Override
    public String color() {
        return "blue";
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import jakarta.inject.Singleton

@Singleton
class Blue implements ColorPicker {

    @Override
    String color() {
        return "blue"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import jakarta.inject.Singleton

@Singleton
class Blue: ColorPicker {
    override fun color(): String {
        return "blue"
    }
}
```

  </TabItem>
</Tabs>

`Blue` bean 类还实现了 `ColorPicker`，因此在注入 `ColorPicker` 接口时有两个可能的候选对象。由于 `Green` 是首选的，因此它将一直受到青睐。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/testPrimary")
public class TestController {

    protected final ColorPicker colorPicker;

    public TestController(ColorPicker colorPicker) { // (1)
        this.colorPicker = colorPicker;
    }

    @Get
    public String index() {
        return colorPicker.color();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/test")
class TestController {

    protected final ColorPicker colorPicker

    TestController(ColorPicker colorPicker) { // (1)
        this.colorPicker = colorPicker
    }

    @Get
    String index() {
        colorPicker.color()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/test")
class TestController(val colorPicker: ColorPicker) { // (1)

    @Get
    fun index(): String {
        return colorPicker.color()
    }
}
```

  </TabItem>
</Tabs>

1. 虽然有两个 `ColorPicker` bean，但由于 `@Primary` 注解，`Green` 被注入

如果存在多个可能的候选项，并且未定义 `@Primary`，则引发 [NonUniqueBeaException](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/exceptions/NonUniqueBeanException.html)。

除了 `@Primary`，还有一个 [Secondary](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Secondary.html) 注解，它会产生相反的效果，并允许取消 bean 的优先级。

### 注入任意 Bean

如果你不知道注入哪个 bean，那么可以使用 [@Any](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Any.html) 限定符来注入第一个可用的 bean，例如：

*注入任意 Bean*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Inject @Any
Engine engine;
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Inject @Any
Engine engine
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Inject
@field:Any
lateinit var engine: Engine
```

  </TabItem>
</Tabs>

[@Any](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Any.html) 限定符通常与 [BeanProvider](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/BeanProvider.html) 接口一起使用，以允许更动态的用例。例如，如果 bean 存在，以下 `Vehicle` 实现将启动 `Engine`：

*带 Any 使用 BeanProvider*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.BeanProvider;
import io.micronaut.context.annotation.Any;
import jakarta.inject.Singleton;

@Singleton
public class Vehicle {
    final BeanProvider<Engine> engineProvider;

    public Vehicle(@Any BeanProvider<Engine> engineProvider) { // (1)
        this.engineProvider = engineProvider;
    }
    void start() {
        engineProvider.ifPresent(Engine::start); // (2)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.BeanProvider
import io.micronaut.context.annotation.Any
import jakarta.inject.Singleton

@Singleton
class Vehicle {
    final BeanProvider<Engine> engineProvider

    Vehicle(@Any BeanProvider<Engine> engineProvider) { // (1)
        this.engineProvider = engineProvider
    }
    void start() {
        engineProvider.ifPresent(Engine::start) // (2)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.BeanProvider
import io.micronaut.context.annotation.Any
import jakarta.inject.Singleton

@Singleton
class Vehicle(@param:Any val engineProvider: BeanProvider<Engine>) { // (1)
    fun start() {
        engineProvider.ifPresent { it.start() } // (2)
    }
    fun startAll() {
        if (engineProvider.isPresent) { // (1)
            engineProvider.forEach { it.start() } // (2)
        }
}
```

  </TabItem>
</Tabs>

1. 使用 `@Any` 注入 [BeanProvider](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/BeanProvider.html)
2. 如果使用 `ifPresent` 方法存在基础 bean，则调用 `start` 方法

如果有多个 bean，你也可以调整行为。以下示例启动 `Vehicle` 中安装的所有发动机（如果有）：

*带 Any 使用 BeanProvider*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
void startAll() {
    if (engineProvider.isPresent()) { // (1)
        engineProvider.stream().forEach(Engine::start); // (2)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void startAll() {
    if (engineProvider.isPresent()) { // (1)
        engineProvider.each {it.start() } // (2)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
fun startAll() {
    if (engineProvider.isPresent) { // (1)
        engineProvider.forEach { it.start() } // (2)
    }
```

  </TabItem>
</Tabs>

1. 检查是否有 bean
2. 如果是这样，则通过 `stream().forEach(..)` 方法迭代每个引擎，启动引擎

## 3.6 限制可注入类型

默认情况下，当你使用作用域（如 `@Singleton`）注解 bean 时，bean 类及其实现的所有接口和扩展的超级类都可以通过 `@Inject` 注入。

考虑上一节中关于定义 bean 的以下示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
public class V8Engine implements Engine {  // (3)
    @Override
    public String start() {
        return "Starting V8";
    }

    @Override
    public int getCylinders() {
        return 8;
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
class V8Engine implements Engine { // (3)
    int cylinders = 8

    @Override
    String start() {
        "Starting V8"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
class V8Engine : Engine {

    override var cylinders: Int = 8

    override fun start(): String {
        return "Starting V8"
    }

}
```

  </TabItem>
</Tabs>

在上述情况下，应用程序中的其他类可以选择注入接口 `Engine` 或具体实现 `V8Engine`。

如果这是不希望的，可以使用 [@Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 注解的 `typed` 成员来限制公开的类型。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
@Bean(typed = Engine.class) // (1)
public class V8Engine implements Engine {  // (2)
    @Override
    public String start() {
        return "Starting V8";
    }

    @Override
    public int getCylinders() {
        return 8;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
@Bean(typed = Engine) // (1)
class V8Engine implements Engine {  // (2)
    @Override
    String start() { "Starting V8" }

    @Override
    int getCylinders() { 8 }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
@Bean(typed = [Engine::class]) // (1)
class V8Engine : Engine { // (2)
    override fun start(): String {
        return "Starting V8"
    }

    override val cylinders: Int = 8
}
```

  </TabItem>
</Tabs>

1. `@Bean(typed=..)` 用于仅允许注入接口 `Engine`，而不允许注入具体类型
2. 该类必须实现由 `typed` 定义的类或接口，否则将发生编译错误

以下测试演示了使用编程查找和 [BeanContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/BeanContext.html) API 进行 `typed` 的行为：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@MicronautTest
public class EngineSpec {
    @Inject
    BeanContext beanContext;

    @Test
    public void testEngine() {
        assertThrows(NoSuchBeanException.class, () ->
                beanContext.getBean(V8Engine.class) // (1)
        );
        final Engine engine = beanContext.getBean(Engine.class); // (2)
        assertTrue(engine instanceof V8Engine);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
class EngineSpec extends Specification {
    @Shared @AutoCleanup
    ApplicationContext beanContext = ApplicationContext.run()

    void 'test engine'() {
        when:'the class is looked up'
        beanContext.getBean(V8Engine) // (1)

        then:'a no such bean exception is thrown'
        thrown(NoSuchBeanException)

        and:'it is possible to lookup by the typed interface'
        beanContext.getBean(Engine) instanceof V8Engine // (2)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MicronautTest
class EngineSpec {
    @Inject
    lateinit var beanContext: BeanContext

    @Test
    fun testEngine() {
        assertThrows(NoSuchBeanException::class.java) {
            beanContext.getBean(V8Engine::class.java) // (1)
        }

        val engine = beanContext.getBean(Engine::class.java) // (2)
        assertTrue(engine is V8Engine)
    }
}
```

  </TabItem>
</Tabs>

1. 尝试查找 `V8Engine` 引发 [NoSuchBeaException](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/exceptions/NoSuchBeanException.html)
2. 查找 `Engine` 接口时成功

## 3.7 作用域

Micronaut 具有基于 JSR-330 的可扩展 bean 作用域机制。支持以下默认作用域：

### 3.7.1 内置作用域

*表1。Micronaut 内置作用域*

|类型|描述|
|--|--|
|[@Singleton](https://docs.oracle.com/javaee/6/api/javax/inject/Singleton.html)|Singleton 作用域表示只存在bean的一个实例|
|[@Context](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Context.html)|Context 作用域表示 bean 将与 `ApplicationContext` 同时创建（急切初始化）|
|[@Prototype](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Prototype.html)|Prototype 作用域表示每次注入 bean 时都会创建一个新的 bean 实例|
|[@Infrastructure](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Infrastructure.html)|Infrastructure 作用域表示不能使用 [@Replaces](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Replaces.html) 重写或替换的 bean，因为它对系统的运行至关重要。|
|[@ThreadLocal](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/context/scope/ThreadLocal.html)|`@ThreadLocal` 作用域是一个自定义作用域，通过 ThreadLocal 为每个线程关联一个 bean|
|[@Refreshable](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/context/scope/Refreshable.html)|`@Refreshable` 作用域是一个自定义作用域，允许通过 `/refresh` 端点刷新bean的状态。|
|[@RequestScope](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/http/scope/RequestScope.html)|`@RequestScope` 作用域是一个自定义作用域，它指示创建了 bean 的新实例并与每个 HTTP 请求相关联|

:::tip 注意
[@Prototype](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Prototype.html) 注解是 [@Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 的同义词，因为默认作用域是 Prototype。
:::

通过定义实现 [CustomScope](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/scope/CustomScope.html) 接口的`@Singleton` bean，可以添加其他作用域。

注意，在启动 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 时，默认情况下，`@Singleton` 作用域 bean 是按需创建的。这是为了优化启动时间而设计的。

如果这给你的用例带来了问题，你可以选择使用 [@Context](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Context.html) 注解，该注解将对象的生命周期绑定到 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 的生命周期。换句话说，当 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 启动时，将创建 bean。

或者，用 [@Parallel](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Parallel.html) 注解任何 `@Singleton` 作用域的 bean，它允许并行初始化 bean 而不影响整个启动时间。

:::tip 注意
如果 bean 未能并行初始化，应用程序将自动关闭。
:::

#### 3.7.1.1 Singleton 的急切初始化

在某些情况下，例如在 AWS Lambda 上，分配给 Lambda 构造的 CPU 资源多于执行的 CPU 资源，可能需要对 `@Singleton` bean 进行急切初始化。

你可以使用 [ApplicationContextBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContextBuilder.html) 接口指定是否急切地初始化 `@Singleton` 作用域的 bean：

*启用单例的急切初始化*

```java
public class Application {

    public static void main(String[] args) {
        Micronaut.build(args)
            .eagerInitSingletons(true) (1)
            .mainClass(Application.class)
            .start();
    }
}
```

1. 将急切初始化设置为 `true` 将初始化所有单例

在[无服务器函数](https://docs.micronaut.io/3.8.4/guide/index.html#serverlessFunctions)等环境中使用 Micronaut 时，你将没有 Application 类，而是扩展了 Micronaut 提供的类。在这些情况下，Micronaut 提供了可以重写以增强 [ApplicationContextBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContextBuilder.html) 的方法

*重载 newApplicationContextBuilder()*

```java
public class MyFunctionHandler extends MicronautRequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
...
    @Nonnull
    @Override
    protected ApplicationContextBuilder newApplicationContextBuilder() {
        ApplicationContextBuilder builder = super.newApplicationContextBuilder();
        builder.eagerInitSingletons(true);
        return builder;
    }
    ...
}
```

[@ConfigurationReader](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationReader.html) bean，如 [@EachProperty](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/EachProperty.html) 或[@ConfigurationProperties](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationProperties.html)是单例 bean。要急切地初始化配置，但保持其他 `@Singleton` 作用域内的 bean 懒创建，请使用 `eagerInitConfiguration`：

*启用急切配置初始化*

```java
public class Application {

    public static void main(String[] args) {
        Micronaut.build(args)
            .eagerInitConfiguration(true) (1)
            .mainClass(Application.class)
            .start();
    }
}
```

1. 将急切初始化设置为 `true` 将初始化所有配置读取器 bean

### 3.7.2 Refreshable 作用域

[Refreshable](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/context/scope/Refreshable.html) 作用域是一个自定义作用域，允许通过以下方式刷新 bean 的状态：

- `/refresh` 端点。
- [RefreshEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/context/scope/refresh/RefreshEvent.html) 的发布。

以下示例说明了 `@Refreshable` 作用域的行为。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Refreshable // (1)
public static class WeatherService {
    private String forecast;

    @PostConstruct
    public void init() {
        forecast = "Scattered Clouds " + new SimpleDateFormat("dd/MMM/yy HH:mm:ss.SSS").format(new Date());// (2)
    }

    public String latestForecast() {
        return forecast;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Refreshable // (1)
static class WeatherService {

    String forecast

    @PostConstruct
    void init() {
        forecast = "Scattered Clouds ${new SimpleDateFormat("dd/MMM/yy HH:mm:ss.SSS").format(new Date())}" // (2)
    }

    String latestForecast() {
        return forecast
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Refreshable // (1)
open class WeatherService {
    private var forecast: String? = null

    @PostConstruct
    open fun init() {
        forecast = "Scattered Clouds " + SimpleDateFormat("dd/MMM/yy HH:mm:ss.SSS").format(Date())// (2)
    }

    open fun latestForecast(): String? {
        return forecast
    }
}
```

  </TabItem>
</Tabs>

1. `WeatherService` 使用 `@Refreshable` 作用域进行注解，它存储实例，直到触发刷新事件
2. 在创建 bean 时，`forecast` 属性的值设置为固定值，在刷新 bean 之前不会更改

如果你两次调用 `latestForecast()`，你将看到相同的响应，如 `"Scattered Clouds 01/Feb/18 10:29.199"`。

当调用 `/refresh` 端点或发布 [RefreshEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/context/scope/refresh/RefreshEvent.html) 时，该实例将无效，并在下次请求对象时创建新实例。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
applicationContext.publishEvent(new RefreshEvent());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
applicationContext.publishEvent(new RefreshEvent())
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
applicationContext.publishEvent(RefreshEvent())
```

  </TabItem>
</Tabs>

### 3.7.3 元注解作用域

可以在元注解上定义作用域，然后可以将其应用于类。考虑以下元注解示例：

*Driver java 注解*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Requires;

import jakarta.inject.Singleton;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Requires(classes = Car.class) // (1)
@Singleton // (2)
@Documented
@Retention(RUNTIME)
public @interface Driver {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Requires

import jakarta.inject.Singleton
import java.lang.annotation.Documented
import java.lang.annotation.Retention

import static java.lang.annotation.RetentionPolicy.RUNTIME

@Requires(classes = Car.class) // (1)
@Singleton // (2)
@Documented
@Retention(RUNTIME)
@interface Driver {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Requires
import jakarta.inject.Singleton
import kotlin.annotation.AnnotationRetention.RUNTIME

@Requires(classes = [Car::class]) // (1)
@Singleton // (2)
@MustBeDocumented
@Retention(RUNTIME)
annotation class Driver
```

  </TabItem>
</Tabs>

1. 作用域使用 [Requires](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Requires.html) 声明 `Car` 类上的需求
2. 注解声明为 `@Singleton`

在上面的示例中，`@Singleton` 注解应用于 `@Driver` 注解，这会导致用 `@Driver` 进行注解的每个类都被视为单例。

注意，在这种情况下，应用注解时不可能更改作用域。例如，以下内容不会覆盖 `@Driver` 声明的作用域，并且无效：

*声明另一个作用域*

```java
@Driver
@Prototype
class Foo {}
```

要使作用域可重写，请在 `@Driver` 上使用 [DefaultScope](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/DefaultScope.html) 注解，如果没有其他作用域，则允许指定默认作用域：

*使用 @DefaultScope*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Requires(classes = Car.class)
@DefaultScope(Singleton.class) (1)
@Documented
@Retention(RUNTIME)
public @interface Driver {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Requires(classes = Car.class)
@DefaultScope(Singleton.class) (1)
@Documented
@Retention(RUNTIME)
@interface Driver {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Requires(classes = [Car::class])
@DefaultScope(Singleton::class) (1)
@Documented
@Retention(RUNTIME)
annotation class Driver
```

  </TabItem>
</Tabs>

1. [DefaultScope](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/DefaultScope.html) 声明了未指定时要使用的作用域

## 3.8 Bean 工厂

在许多情况下，你可能希望将不属于代码库的类（如第三方库提供的类）作为bean提供。在这种情况下，不能对编译的类进行注解。相反，实现一个 [@Factory](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Factory.html)。

工厂是一个用 [Factory](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Factory.html) 注解的注解类，它提供了一个或多个注解的方法（用 bean 作用域注解）。你使用的注解取决于你希望 bean 位于哪个作用域中。更多信息，参阅 [bean 作用域](#37-作用域)一节。

:::tip 注意
工厂具有默认作用域 singleton ，并将随上下文一起销毁。如果你想在工厂生成 bean 后处理它，请使用 `@Prototype` 作用域。
:::

用 bean 作用域注解来注解的方法的返回类型是 bean 类型。这最好用一个例子来说明：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
class CrankShaft {
}

class V8Engine implements Engine {
    private final int cylinders = 8;
    private final CrankShaft crankShaft;

    public V8Engine(CrankShaft crankShaft) {
        this.crankShaft = crankShaft;
    }

    @Override
    public String start() {
        return "Starting V8";
    }
}

@Factory
class EngineFactory {

    @Singleton
    Engine v8Engine(CrankShaft crankShaft) {
        return new V8Engine(crankShaft);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
class CrankShaft {
}

class V8Engine implements Engine {
    final int cylinders = 8
    final CrankShaft crankShaft

    V8Engine(CrankShaft crankShaft) {
        this.crankShaft = crankShaft
    }

    @Override
    String start() {
        "Starting V8"
    }
}

@Factory
class EngineFactory {

    @Singleton
    Engine v8Engine(CrankShaft crankShaft) {
        new V8Engine(crankShaft)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
internal class CrankShaft

internal class V8Engine(private val crankShaft: CrankShaft) : Engine {
    private val cylinders = 8

    override fun start(): String {
        return "Starting V8"
    }
}

@Factory
internal class EngineFactory {

    @Singleton
    fun v8Engine(crankShaft: CrankShaft): Engine {
        return V8Engine(crankShaft)
    }
}
```

  </TabItem>
</Tabs>

在本例中，`V8Engine` 由 `EngineFactory` 类的 `V8Engine` 方法创建。注意，你可以将参数注入到方法中，它们将被解析为 bean。生成的 `V8Engine` bean 将是一个单例。

一个工厂可以有多个用 bean 作用域注解的方法，每个方法都返回一个不同的 bean 类型。

:::tip 注意
如果采用这种方法，则不应在类内部调用其他 bean 方法。相反，通过参数注入类型。
:::

:::note 提示
要允许生成的 bean 参与应用程序上下文关闭过程，请使用 [@Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 注解该方法，并将 `preDestroy` 参数设置为要调用以关闭 bean 的方法的名称。
:::

**来自字段的 Bean**

使用 Micronaut 3.0 或更高版本，也可以通过在字段上声明 [@Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 注解来从字段生成 Bean。

虽然一般情况下，这种方法应该不鼓励使用工厂方法，因为工厂方法提供了更多的灵活性，但它确实简化了测试代码。例如，使用 bean 字段，你可以在测试代码中轻松生成模拟：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.*;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Test;
import jakarta.inject.Inject;

import static org.junit.jupiter.api.Assertions.assertEquals;

@MicronautTest
public class VehicleMockSpec {
    @Requires(beans = VehicleMockSpec.class)
    @Bean @Replaces(Engine.class)
    Engine mockEngine = () -> "Mock Started"; // (1)

    @Inject Vehicle vehicle; // (2)

    @Test
    void testStartEngine() {
        final String result = vehicle.start();
        assertEquals("Mock Started", result); // (3)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.*
import io.micronaut.test.extensions.spock.annotation.MicronautTest
import spock.lang.Specification
import jakarta.inject.Inject

@MicronautTest
class VehicleMockSpec extends Specification {
    @Requires(beans=VehicleMockSpec.class)
    @Bean @Replaces(Engine.class)
    Engine mockEngine = {-> "Mock Started" } as Engine  // (1)

    @Inject Vehicle vehicle // (2)

    void "test start engine"() {
        given:
        final String result = vehicle.start()

        expect:
        result == "Mock Started" // (3)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Bean
import io.micronaut.context.annotation.Replaces
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import jakarta.inject.Inject

@MicronautTest
class VehicleMockSpec {
    @get:Bean
    @get:Replaces(Engine::class)
    val mockEngine: Engine = object : Engine { // (1)
        override fun start(): String {
            return "Mock Started"
        }
    }

    @Inject
    lateinit var vehicle : Vehicle // (2)

    @Test
    fun testStartEngine() {
        val result = vehicle.start()
        Assertions.assertEquals("Mock Started", result) // (3)
    }
}
```

  </TabItem>
</Tabs>

1. bean 是从替换现有 `Engine` 的字段中定义的。
2. `Vehicle` 被注入。
3. 代码断言调用了模拟实现。

请注意，非基元类型仅支持公共或包保护字段。如果字段是 `static`、`private` 或 `protected` 的，则会发生编译错误。

:::tip 注意
如果bean方法/字段包含作用域或限定符，则将省略该类型中的任何作用域或限制符。
:::

:::tip 注意
工厂实例的限定符不会继承到bean
:::

**基本 bean 和数组**

从 Micronaut 3.1 开始，可以从工厂定义和注入基本类型和数组类型。

例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Bean;
import io.micronaut.context.annotation.Factory;
import jakarta.inject.Named;

@Factory
class CylinderFactory {
    @Bean
    @Named("V8") // (1)
    final int v8 = 8;

    @Bean
    @Named("V6") // (1)
    final int v6 = 6;
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Bean
import io.micronaut.context.annotation.Factory
import jakarta.inject.Named

@Factory
class CylinderFactory {
    @Bean
    @Named("V8") // (1)
    final int v8 = 8

    @Bean
    @Named("V6") // (1)
    final int v6 = 6
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Bean
import io.micronaut.context.annotation.Factory
import jakarta.inject.Named

@Factory
class CylinderFactory {
    @get:Bean
    @get:Named("V8") // (1)
    val v8 = 8

    @get:Bean
    @get:Named("V6") // (1)
    val v6 = 6
}
```

  </TabItem>
</Tabs>

1. 使用不同的名称定义了两个基本整数 bean

基本 bean 可以像任何其他 bean 一样被注入：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import jakarta.inject.Named;
import jakarta.inject.Singleton;

@Singleton
public class V8Engine {
    private final int cylinders;

    public V8Engine(@Named("V8") int cylinders) { // (1)
        this.cylinders = cylinders;
    }

    public int getCylinders() {
        return cylinders;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import jakarta.inject.Named
import jakarta.inject.Singleton

@Singleton
class V8Engine {
    private final int cylinders

    V8Engine(@Named("V8") int cylinders) { // (1)
        this.cylinders = cylinders
    }

    int getCylinders() {
        return cylinders
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import jakarta.inject.Named
import jakarta.inject.Singleton

@Singleton
class V8Engine(
    @param:Named("V8") val cylinders: Int // (1)
)
```

  </TabItem>
</Tabs>

请注意，基元 bean 和基本数组 bean 具有以下限制：

- [AOP advice](/core/aop.html) 不能应用于原语或包装器类型
- 由于上述自定义作用域，不支持代理
- 不支持 `@Bean(preDestroy=..)` 成员

**编程禁用 Bean**

工厂方法可以抛出 [DisabledBeanException](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/exceptions/DisabledBeanException.html) 以有条件地禁用 bean。使用 [@Requires](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Requires.html) 应该始终是有条件地创建 bean 的首选方法；只有在无法使用 [@Requires](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Requires.html) 时，才能在工厂方法中引发异常。

例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public interface Engine {
    Integer getCylinders();
}

@EachProperty("engines")
public class EngineConfiguration implements Toggleable {

    private boolean enabled = true;
    private Integer cylinders;

    @NotNull
    public Integer getCylinders() {
        return cylinders;
    }

    public void setCylinders(Integer cylinders) {
        this.cylinders = cylinders;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

}

@Factory
public class EngineFactory {

    @EachBean(EngineConfiguration.class)
    public Engine buildEngine(EngineConfiguration engineConfiguration) {
        if (engineConfiguration.isEnabled()) {
            return engineConfiguration::getCylinders;
        } else {
            throw new DisabledBeanException("Engine configuration disabled");
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
interface Engine {
    Integer getCylinders()
}

@EachProperty("engines")
class EngineConfiguration implements Toggleable {
    boolean enabled = true
    @NotNull
    Integer cylinders
}

@Factory
class EngineFactory {

    @EachBean(EngineConfiguration)
    Engine buildEngine(EngineConfiguration engineConfiguration) {
        if (engineConfiguration.enabled) {
            (Engine){ -> engineConfiguration.cylinders }
        } else {
            throw new DisabledBeanException("Engine configuration disabled")
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
interface Engine {
    fun getCylinders(): Int
}

@EachProperty("engines")
class EngineConfiguration : Toggleable {

    var enabled = true

    @NotNull
    val cylinders: Int? = null

    override fun isEnabled(): Boolean {
        return enabled
    }
}

@Factory
class EngineFactory {

    @EachBean(EngineConfiguration::class)
    fun buildEngine(engineConfiguration: EngineConfiguration): Engine? {
        return if (engineConfiguration.isEnabled) {
            object : Engine {
                override fun getCylinders(): Int {
                    return engineConfiguration.cylinders!!
                }
            }
        } else {
            throw DisabledBeanException("Engine configuration disabled")
        }
    }
}
```

  </TabItem>
</Tabs>

**注入点**

工厂的一个常见用例是从注入对象的点利用注解元数据，从而可以基于所述元数据修改行为。

考虑以下注解：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Documented
@Retention(RUNTIME)
@Target(ElementType.PARAMETER)
public @interface Cylinders {
    int value() default 8;
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Documented
@Retention(RUNTIME)
@Target(ElementType.PARAMETER)
@interface Cylinders {
    int value() default 8
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MustBeDocumented
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.VALUE_PARAMETER)
annotation class Cylinders(val value: Int = 8)
```

  </TabItem>
</Tabs>

上述注解可用于自定义我们希望在定义的注入点处注入到车辆中的发动机类型：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
class Vehicle {

    private final Engine engine;

    Vehicle(@Cylinders(6) Engine engine) {
        this.engine = engine;
    }

    String start() {
        return engine.start();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
class Vehicle {

    private final Engine engine

    Vehicle(@Cylinders(6) Engine engine) {
        this.engine = engine
    }

    String start() {
        return engine.start()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
internal class Vehicle(@param:Cylinders(6) private val engine: Engine) {
    fun start(): String {
        return engine.start()
    }
}
```

  </TabItem>
</Tabs>

上述 `Vehicle` 类指定了 `@Cylinders(6)` 的注解值，表示需要六个气缸的 `Engine`。

要实现此用例，请定义一个接受 [InjectionPoint](https://docs.micronaut.io/3.8.4/api/io/micronaut/inject/InjectionPoint.html) 实例的工厂，以分析定义的注解值：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Factory
class EngineFactory {

    @Prototype
    Engine v8Engine(InjectionPoint<?> injectionPoint, CrankShaft crankShaft) { // (1)
        final int cylinders = injectionPoint
                .getAnnotationMetadata()
                .intValue(Cylinders.class).orElse(8); // (2)
        switch (cylinders) { // (3)
            case 6:
                return new V6Engine(crankShaft);
            case 8:
                return new V8Engine(crankShaft);
            default:
                throw new IllegalArgumentException("Unsupported number of cylinders specified: " + cylinders);
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Factory
class EngineFactory {

    @Prototype
    Engine v8Engine(InjectionPoint<?> injectionPoint, CrankShaft crankShaft) { // (1)
        final int cylinders = injectionPoint
                .getAnnotationMetadata()
                .intValue(Cylinders.class).orElse(8) // (2)
        switch (cylinders) { // (3)
            case 6:
                return new V6Engine(crankShaft)
            case 8:
                return new V8Engine(crankShaft)
            default:
                throw new IllegalArgumentException("Unsupported number of cylinders specified: $cylinders")
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Factory
internal class EngineFactory {

    @Prototype
    fun v8Engine(injectionPoint: InjectionPoint<*>, crankShaft: CrankShaft): Engine { // (1)
        val cylinders = injectionPoint
                .annotationMetadata
                .intValue(Cylinders::class.java).orElse(8) // (2)
        return when (cylinders) { // (3)
            6 -> V6Engine(crankShaft)
            8 -> V8Engine(crankShaft)
            else -> throw IllegalArgumentException("Unsupported number of cylinders specified: $cylinders")
        }
    }
}
```

  </TabItem>
</Tabs>

1. 工厂方法定义了 [InjectionPoint](https://docs.micronaut.io/3.8.4/api/io/micronaut/inject/InjectionPoint.html) 类型的参数。
2. 注解元数据用于获取 `@Cylinder` 注解的值
3. 该值用于构造引擎，如果无法构造引擎，则引发异常。

:::tip 注意
需要注意的是，工厂声明为 [@Prototype](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Prototype.html) 作用域，因此每个注入点都会调用该方法。如果 `V8Engine` 和 `V6Engine` 类型需要是单体的，工厂应该使用 Map 来确保对象只构造一次
:::

## 3.9 条件 Bean

有时，你可能希望基于各种潜在因素，包括类路径、配置、其他bean的存在等，有条件地加载bean。

[Requires](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Requires.html) 注解提供了在 bean 上定义一个或多个条件的能力。

考虑以下示例：

*使用 @Requires*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
@Requires(beans = DataSource.class)
@Requires(property = "datasource.url")
public class JdbcBookService implements BookService {

    DataSource dataSource;

    public JdbcBookService(DataSource dataSource) {
        this.dataSource = dataSource;
    }
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
@Requires(beans = DataSource)
@Requires(property = "datasource.url")
class JdbcBookService implements BookService {

    DataSource dataSource
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
@Requirements(Requires(beans = [DataSource::class]), Requires(property = "datasource.url"))
class JdbcBookService(internal var dataSource: DataSource) : BookService {
```

  </TabItem>
</Tabs>

上面的 bean 定义了两个需求。第一个指示必须存在 `DataSource` bean 才能加载该 bean。第二个要求确保在加载 `JdbcBookService` bean 之前设置 `datasource.url` 属性。

:::tip 注意
Kotlin 目前不支持可重复注解。当需要多个需求时，使用 `@Requirements` 注解。例如，`@Requirements(Requires(…​), Requires(…​))`。参阅 [https://youtrack.jetbrains.com/issue/KT-12794](https://youtrack.jetbrains.com/issue/KT-12794) 以跟踪此功能。
:::

如果多个 bean 需要相同的需求组合，则可以使用要求定义元注解：

*使用 @Requires 元注解*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PACKAGE, ElementType.TYPE})
@Requires(beans = DataSource.class)
@Requires(property = "datasource.url")
public @interface RequiresJdbc {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target([ElementType.PACKAGE, ElementType.TYPE])
@Requires(beans = DataSource)
@Requires(property = "datasource.url")
@interface RequiresJdbc {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Documented
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FILE)
@Requirements(Requires(beans = [DataSource::class]), Requires(property = "datasource.url"))
annotation class RequiresJdbc
```

  </TabItem>
</Tabs>

在上面的示例中，`RequiresJdbc` 注解可以在 `JdbcBookService` 上使用：

*使用元注解*

```java
@RequiresJdbc
public class JdbcBookService implements BookService {
    ...
}
```

如果你有多个 bean 需要在加载之前满足给定的需求，那么你可能需要考虑一个 bean 配置组，如下一节所述。

### 配置要求

[@Requires](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Requires.html) 注解非常灵活，可以用于各种用例。下表总结了一些可能性：

|要求|示例|
|--|--|
|要求存在一个或多个类|`@Requires(classes=javax.servlet.Servlet)`|
|要求缺少一个或多个类|`@Requires(missing=javax.servlet.Servlet)`|
|要求存在一个或多个 bean|`@Requires(beans=javax.sql.DataSource)`|
|要求缺少一个或多个 bean|`@Requires(missingBeans=javax.sql.DataSource)`|
|要求应用环境变量|`@Requires(env="test")`|
|要求不应用环境变量|`@Requires(notEnv="test")`|
|要求另一个配置包|`@Requires(configuration="foo.bar")`|
|要求缺少另一个配置包|`@Requires(missingConfigurations="foo.bar")`|
|要求特定 SDK 版本|`@Requires(sdk=Sdk.JAVA, value="1.8")`|
|要求通过包扫描向应用程序提供带有给定注解的类|`@Requires(entities=javax.persistence.Entity)`|
|要求具有可选值的属性|`@Requires(property="data-source.url")`|
|要求属性不是配置的一部分|`@Requires(missingProperty="data-source.url")`|
|要求文件系统中存在一个或多个文件|`@Requires(resources="file:/path/to/file")`|
|要求存在一个或多个类路径资源|`@Requires(resources="classpath:myFile.properties")`|
|要求当前操作系统在列表中|`@Requires(os={Requires.Family.WINDOWS})`|
|要求当前操作系统**不**在列表中|`@Requires(notOs={Requires.Family.WINDOWS})`|
|如果未指定 beanProperty，则要求 bean|`@Requires(bean=Config.class)`|
|要求存在 bean 的指定属性|`@Requires(bean=Config.class, beanProperty="enabled")`|

**属性要求附加说明。**

在属性上添加需求具有一些附加功能。你可以要求属性为特定值，而不是特定值，如果未设置，则在这些检查中使用默认值。

```java
@Requires(property="foo") (1)
@Requires(property="foo", value="John") (2)
@Requires(property="foo", value="John", defaultValue="John") (3)
@Requires(property="foo", notEquals="Sally") (4)
```

1. 需要设置属性
2. 要求属性为 "John"
3. 要求属性为 "John" 或未设置
4. 要求属性不为 "Sally" 或未设置

**在 @Requires 中引用 bean 属性**

你还可以在 `@Requires` 中引用其他 bean 属性，以有条件地加载 bean。与 `property` 要求类似，你可以指定所需的 `value` 或设置值 bean 属性不应等于使用 `notEquals` 注解成员。对于要检查的 bean 属性，bean 注解成员中指定的 bean 类型应该存在于上下文中，否则将不会加载条件 bean。

```java
@Requires(bean=Config.class, beanProperty="foo") (1)
@Requires(bean=Config.class, beanProperty="foo", value="John") (2)
@Requires(bean=Config.class, beanProperty="foo", notEquals="Sally") (3)
```

1. 要求 `Config` bean 上的 "foo" 属性
2. 要求 `Config` bean 上的 "foo" 属性为 "John"
3. 要求 `Config` bean 上的 "foo" 属性不为 "Sally" 或不设置

指定的 bean 属性通过相应的 getter 方法访问，其存在性和可用性将在编译时检查。

注意，如果 bean 属性的值不为 null，则认为它存在。请记住，基本属性是用默认值初始化的，例如布尔值为 false，int 值为 0，因此即使没有为它们显式指定值，也会将它们视为已设置。

### 调试条件 Bean

如果你有多个条件和复杂的需求，那么可能很难理解为什么没有加载特定的 bean。

为了帮助解决条件 bean 的问题，你可以为 `io.micronaut.context.condition` 包启用调试日志记录，该包将记录未加载 bean 的原因。

*logback.xml*

```xml
<logger name="io.micronaut.context.condition" level="DEBUG"/>
```

有关[如何设置日志](/core/logging.html)的详细信息，参阅日志一章。

## 3.10 Bean 替换

Micronaut 的依赖注入系统和 Spring 的一个显著区别是 bean 的替换方式。

在 Spring 应用程序中，bean 具有名称，并通过创建具有相同名称的 bean 来覆盖，而不考虑 bean 的类型。Spring 还具有 bean 注册顺序的概念，因此在 Spring Boot 中有 `@AutoConfigureBefore` 和 `@AutoConfigureAfter `注解，它们控制 bean 如何相互覆盖。

此策略会导致难以调试的问题，例如：

- Bean 加载顺序更改，导致意外结果
- 具有相同名称的bean覆盖具有不同类型的另一个bean

为了避免这些问题，Micronaut 的 DI 没有 bean 名称或加载顺序的概念。bean 有一种类型和 [Qualifier](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/Qualifier.html)。不能用另一个完全不同类型的 bean 重写。

Spring 方法的一个有用的好处是它允许重写现有 bean 来定制行为。为了支持相同的功能，Micronaut 的 DI 提供了一个显式的 [@Replaces](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Replaces.html) 注解，它与对[条件 Bean](#39-条件-bean)的支持很好地集成在一起，并清晰地记录和表达了开发人员的意图。

任何现有的 bean 都可以被声明 [@Replaces](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Replaces.html) 的另一个 bean 替换。例如，考虑以下类：

*JdbcBookService*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
@Requires(beans = DataSource.class)
@Requires(property = "datasource.url")
public class JdbcBookService implements BookService {

    DataSource dataSource;

    public JdbcBookService(DataSource dataSource) {
        this.dataSource = dataSource;
    }
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
@Requires(beans = DataSource)
@Requires(property = "datasource.url")
class JdbcBookService implements BookService {

    DataSource dataSource
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
@Requirements(Requires(beans = [DataSource::class]), Requires(property = "datasource.url"))
class JdbcBookService(internal var dataSource: DataSource) : BookService {
```

  </TabItem>
</Tabs>

你可以在 `src/test/java` 中定义一个类，该类仅用于测试：

*使用 @Replaces*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Replaces(JdbcBookService.class) // (1)
@Singleton
public class MockBookService implements BookService {

    Map<String, Book> bookMap = new LinkedHashMap<>();

    @Override
    public Book findBook(String title) {
        return bookMap.get(title);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Replaces(JdbcBookService.class) // (1)
@Singleton
class MockBookService implements BookService {

    Map<String, Book> bookMap = [:]

    @Override
    Book findBook(String title) {
        bookMap.get(title)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Replaces(JdbcBookService::class) // (1)
@Singleton
class MockBookService : BookService {

    var bookMap: Map<String, Book> = LinkedHashMap()

    override fun findBook(title: String): Book? {
        return bookMap[title]
    }
}
```

  </TabItem>
</Tabs>

1. `MockBookService` 声明它将替换 `JdbcBookService`

**工厂替换**

`@Replaces` 注解还支持 `factory` 参数。该参数允许替换整个工厂 bean 或工厂创建的特定类型。

例如，可能需要替换所有或部分给定工厂类别：

*BookFactory*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Factory
public class BookFactory {

    @Singleton
    Book novel() {
        return new Book("A Great Novel");
    }

    @Singleton
    TextBook textBook() {
        return new TextBook("Learning 101");
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Factory
class BookFactory {

    @Singleton
    Book novel() {
        new Book('A Great Novel')
    }

    @Singleton
    TextBook textBook() {
        new TextBook('Learning 101')
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Factory
class BookFactory {

    @Singleton
    internal fun novel(): Book {
        return Book("A Great Novel")
    }

    @Singleton
    internal fun textBook(): TextBook {
        return TextBook("Learning 101")
    }
}
```

  </TabItem>
</Tabs>

:::warning 警告
要完全替换工厂，工厂方法必须与替换工厂中所有方法的返回类型匹配。
:::

在本例中，`BookFactory#textBook()` **未**被替换，因为该工厂没有返回 `TextBook` 的工厂方法。

*CustomBookFactory*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Factory
@Replaces(factory = BookFactory.class)
public class CustomBookFactory {

    @Singleton
    Book otherNovel() {
        return new Book("An OK Novel");
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Factory
@Replaces(factory = BookFactory)
class CustomBookFactory {

    @Singleton
    Book otherNovel() {
        new Book('An OK Novel')
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Factory
@Replaces(factory = BookFactory::class)
class CustomBookFactory {

    @Singleton
    internal fun otherNovel(): Book {
        return Book("An OK Novel")
    }
}
```

  </TabItem>
</Tabs>

要替换一个或多个工厂方法，但保留其余方法，请在方法上应用 `@Replaces` 注解，并表示要应用的工厂。

*TextBookFactory*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Factory
public class TextBookFactory {

    @Singleton
    @Replaces(value = TextBook.class, factory = BookFactory.class)
    TextBook textBook() {
        return new TextBook("Learning 305");
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Factory
class TextBookFactory {

    @Singleton
    @Replaces(value = TextBook, factory = BookFactory)
    TextBook textBook() {
        new TextBook('Learning 305')
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Factory
class TextBookFactory {

    @Singleton
    @Replaces(value = TextBook::class, factory = BookFactory::class)
    internal fun textBook(): TextBook {
        return TextBook("Learning 305")
    }
}
```

  </TabItem>
</Tabs>

`BookFactory#novel()` 方法不会被替换，因为 TextBook 类是在注解中定义的。

**默认实现**

在公开 API 时，最好不要将接口的默认实现公开为公共 API 的一部分。这样做会阻止用户替换实现，因为他们将无法引用类。解决方案是用 [DefaultImplementation](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/DefaultImplementation.html) 注解接口，以指示如果用户创建了 `@Replaces(YourInterface.class` 的bean，则要替换哪个实现。

例如，考虑：

public API 约定

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.DefaultImplementation;

@DefaultImplementation(DefaultResponseStrategy.class)
public interface ResponseStrategy {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.DefaultImplementation

@DefaultImplementation(DefaultResponseStrategy)
interface ResponseStrategy {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.DefaultImplementation

@DefaultImplementation(DefaultResponseStrategy::class)
interface ResponseStrategy
```

  </TabItem>
</Tabs>

默认实现

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import jakarta.inject.Singleton;

@Singleton
class DefaultResponseStrategy implements ResponseStrategy {

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import jakarta.inject.Singleton

@Singleton
class DefaultResponseStrategy implements ResponseStrategy {

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import jakarta.inject.Singleton

@Singleton
internal class DefaultResponseStrategy : ResponseStrategy
```

  </TabItem>
</Tabs>

自定义实现

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Replaces;
import jakarta.inject.Singleton;

@Singleton
@Replaces(ResponseStrategy.class)
public class CustomResponseStrategy implements ResponseStrategy {

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Replaces
import jakarta.inject.Singleton

@Singleton
@Replaces(ResponseStrategy)
class CustomResponseStrategy implements ResponseStrategy {

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Replaces
import jakarta.inject.Singleton

@Singleton
@Replaces(ResponseStrategy::class)
class CustomResponseStrategy : ResponseStrategy
```

  </TabItem>
</Tabs>

在上面的示例中，`CustomResponseStrategy` 替换了 `DefaultResponsePolicy`，因为 [DefaultImplementation](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/DefaultImplementation.html) 注解指向 `DefaultResponceStrategy`。

## 3.11 Bean 配置

一个带 [@Configuration](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Configuration.html) 的 bean 是包中多个 bean 定义的分组。

`@Configuration` 注解应用于包级别，并通知 Micronaut 与包一起定义的 bean 形成了一个逻辑分组。

`@Configuration` 注解通常应用于 `package-info` 类。例如：

*package-info.groovy*

```groovy
@Configuration
package my.package

import io.micronaut.context.annotation.Configuration
```

当 bean 配置通过 `@Requires` 注解设置为有条件时，这种分组变得有用。例如：

*package-info.groovy*

```groovy
@Configuration
@Requires(beans = javax.sql.DataSource)
package my.package
```

在上面的示例中，只有当 `javax.sql.DataSource` bean 存在时，才会加载带注解包中的所有 bean 定义并使其可用。这允许你实现 bean 定义的条件自动配置。

:::tip 注意
Java 和 Kotlin 也通过 `package-info.java` 支持此功能。Kotlin 不支持 1.3 版的 `package-ininfo.kt`。
:::

## 3..12 生命周期方法


### 当构建 Bean 时

要在构建 bean 时调用方法，请使用 `jakarta.annotation.PostConstruct` 注解：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import jakarta.annotation.PostConstruct; // (1)
import jakarta.inject.Singleton;

@Singleton
public class V8Engine implements Engine {

    private int cylinders = 8;
    private boolean initialized = false; // (2)

    @Override
    public String start() {
        if (!initialized) {
            throw new IllegalStateException("Engine not initialized!");
        }

        return "Starting V8";
    }

    @Override
    public int getCylinders() {
        return cylinders;
    }

    public boolean isInitialized() {
        return initialized;
    }

    @PostConstruct // (3)
    public void initialize() {
        initialized = true;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import jakarta.annotation.PostConstruct // (1)
import jakarta.inject.Singleton

@Singleton
class V8Engine implements Engine {

    int cylinders = 8
    boolean initialized = false // (2)

    @Override
    String start() {
        if (!initialized) {
            throw new IllegalStateException("Engine not initialized!")
        }

        return "Starting V8"
    }

    @PostConstruct // (3)
    void initialize() {
        initialized = true
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import jakarta.annotation.PostConstruct
import jakarta.inject.Singleton

@Singleton
class V8Engine : Engine {

    override val cylinders = 8

    var initialized = false
        private set // (2)

    override fun start(): String {
        check(initialized) { "Engine not initialized!" }

        return "Starting V8"
    }

    @PostConstruct // (3)
    fun initialize() {
        initialized = true
    }
}
```

  </TabItem>
</Tabs>

1. `PostConstruct` 注解已导入
2. 定义了需要初始化的字段
3. 一个方法用 `@PostConstruct` 注解，一旦对象被构造并完全注入，就会被调用。

要管理何时构建 bean，请参阅 [bean 作用域](##37-作用域)一节。

### 当销毁 Bean 时

要在销毁 bean 时调用方法，请使用 `jakarta.annotation.PreDestroy` 注解：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import jakarta.annotation.PreDestroy; // (1)
import jakarta.inject.Singleton;
import java.util.concurrent.atomic.AtomicBoolean;

@Singleton
public class PreDestroyBean implements AutoCloseable {

    AtomicBoolean stopped = new AtomicBoolean(false);

    @PreDestroy // (2)
    @Override
    public void close() throws Exception {
        stopped.compareAndSet(false, true);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import jakarta.annotation.PreDestroy // (1)
import jakarta.inject.Singleton
import java.util.concurrent.atomic.AtomicBoolean

@Singleton
class PreDestroyBean implements AutoCloseable {

    AtomicBoolean stopped = new AtomicBoolean(false)

    @PreDestroy // (2)
    @Override
    void close() throws Exception {
        stopped.compareAndSet(false, true)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import jakarta.annotation.PreDestroy // (1)
import jakarta.inject.Singleton
import java.util.concurrent.atomic.AtomicBoolean

@Singleton
class PreDestroyBean : AutoCloseable {

    internal var stopped = AtomicBoolean(false)

    @PreDestroy // (2)
    @Throws(Exception::class)
    override fun close() {
        stopped.compareAndSet(false, true)
    }
}
```

  </TabItem>
</Tabs>

1. 导入 `PreDestroy` 注解
2. 方法用 `@PreDestroy` 注解，并将在上下文关闭时调用。

对于工厂 Bean，[Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 注解中的 `preDestroy` 值告诉 Micronaut 要调用哪个方法。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Bean;
import io.micronaut.context.annotation.Factory;

import jakarta.inject.Singleton;

@Factory
public class ConnectionFactory {

    @Bean(preDestroy = "stop") // (1)
    @Singleton
    public Connection connection() {
        return new Connection();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Bean
import io.micronaut.context.annotation.Factory

import jakarta.inject.Singleton

@Factory
class ConnectionFactory {

    @Bean(preDestroy = "stop") // (1)
    @Singleton
    Connection connection() {
        new Connection()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Bean
import io.micronaut.context.annotation.Factory

import jakarta.inject.Singleton

@Factory
class ConnectionFactory {

    @Bean(preDestroy = "stop") // (1)
    @Singleton
    fun connection(): Connection {
        return Connection()
    }
}
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import java.util.concurrent.atomic.AtomicBoolean;

public class Connection {

    AtomicBoolean stopped = new AtomicBoolean(false);

    public void stop() { // (2)
        stopped.compareAndSet(false, true);
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import java.util.concurrent.atomic.AtomicBoolean

class Connection {

    AtomicBoolean stopped = new AtomicBoolean(false)

    void stop() { // (2)
        stopped.compareAndSet(false, true)
    }

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import java.util.concurrent.atomic.AtomicBoolean

class Connection {

    internal var stopped = AtomicBoolean(false)

    fun stop() { // (2)
        stopped.compareAndSet(false, true)
    }

}
```

  </TabItem>
</Tabs>

1. `preDestroy` 值设置在注解上
2. 注解值与方法名称匹配

:::tip 注意
简单地实现 `Closeable` 或 `AutoCloseable` 接口不足以使 bean 与上下文一起关闭。必须使用上述方法之一。
:::

### 依赖 Bean

依赖 bean 是构建 bean 时使用的 bean。如果依赖 bean 的作用域为 `@Prototype` 或未知，它将与实例一起销毁。

## 3.13 上下文事件

Micronaut 通过上下文支持通用事件系统。[ApplicationEventPublisher](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ApplicationEventPublisher.html) API 发布事件，[ApplicationEventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ApplicationEventPublisher.html) API 用于侦听事件。事件系统不限于 Micronaut 发布并支持用户创建的自定义事件。

**发布事件**

[ApplicationEventPublisher](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ApplicationEventPublisher.html) API 支持任何类型的事件，尽管 Micronaut 发布的所有事件都继承 ApplicationEvent。

要发布事件，请使用依赖注入获取 [ApplicationEventPublisher](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ApplicationEventPublisher.html) 的实例，其中泛型类型是事件的类型，并使用事件对象调用 `publishEvent` 方法。

**发布事件**

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public class SampleEvent {
    private String message = "Something happened";

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

import io.micronaut.context.event.ApplicationEventPublisher;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;

@Singleton
public class SampleEventEmitterBean {

    @Inject
    ApplicationEventPublisher<SampleEvent> eventPublisher;

    public void publishSampleEvent() {
        eventPublisher.publishEvent(new SampleEvent());
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
class SampleEvent {
    String message = "Something happened"
}

import io.micronaut.context.event.ApplicationEventPublisher
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class SampleEventEmitterBean {

    @Inject
    ApplicationEventPublisher<SampleEvent> eventPublisher

    void publishSampleEvent() {
        eventPublisher.publishEvent(new SampleEvent())
    }

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
data class SampleEvent(val message: String = "Something happened")

import io.micronaut.context.event.ApplicationEventPublisher
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class SampleEventEmitterBean {

    @Inject
    internal var eventPublisher: ApplicationEventPublisher<SampleEvent>? = null

    fun publishSampleEvent() {
        eventPublisher!!.publishEvent(SampleEvent())
    }

}
```

  </TabItem>
</Tabs>

:::warning 警告
默认情况下，发布事件是**同步**的！在执行所有侦听器之前，`publishEvent` 方法不会返回。如果时间密集，将此工作移到线程池。
:::

**监听事件**

要侦听事件，请注册一个实现 [ApplicationEventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ApplicationEventListener.html) 的 bean，其中泛型类型是事件类型。

*使用 ApplicationEventListener 侦听事件*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.event.ApplicationEventListener;
import io.micronaut.docs.context.events.SampleEvent;
import jakarta.inject.Singleton;

@Singleton
public class SampleEventListener implements ApplicationEventListener<SampleEvent> {
    private int invocationCounter = 0;

    @Override
    public void onApplicationEvent(SampleEvent event) {
        invocationCounter++;
    }

    public int getInvocationCounter() {
        return invocationCounter;
    }
}

import io.micronaut.context.ApplicationContext;
import io.micronaut.docs.context.events.SampleEventEmitterBean;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class SampleEventListenerSpec {

    @Test
    public void testEventListenerIsNotified() {
        try (ApplicationContext context = ApplicationContext.run()) {
            SampleEventEmitterBean emitter = context.getBean(SampleEventEmitterBean.class);
            SampleEventListener listener = context.getBean(SampleEventListener.class);
            assertEquals(0, listener.getInvocationCounter());
            emitter.publishSampleEvent();
            assertEquals(1, listener.getInvocationCounter());
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.event.ApplicationEventListener
import io.micronaut.docs.context.events.SampleEvent
import jakarta.inject.Singleton

@Singleton
class SampleEventListener implements ApplicationEventListener<SampleEvent> {
    int invocationCounter = 0

    @Override
    void onApplicationEvent(SampleEvent event) {
        invocationCounter++
    }
}

import io.micronaut.context.ApplicationContext
import io.micronaut.docs.context.events.SampleEventEmitterBean
import spock.lang.Specification

class SampleEventListenerSpec extends Specification {

    void "test event listener is notified"() {
        given:
        ApplicationContext context = ApplicationContext.run()
        SampleEventEmitterBean emitter = context.getBean(SampleEventEmitterBean)
        SampleEventListener listener = context.getBean(SampleEventListener)

        expect:
        listener.invocationCounter == 0

        when:
        emitter.publishSampleEvent()

        then:
        listener.invocationCounter == 1

        cleanup:
        context.close()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.event.ApplicationEventListener
import io.micronaut.docs.context.events.SampleEvent
import jakarta.inject.Singleton

@Singleton
class SampleEventListener : ApplicationEventListener<SampleEvent> {
    var invocationCounter = 0

    override fun onApplicationEvent(event: SampleEvent) {
        invocationCounter++
    }
}

import io.kotest.matchers.shouldBe
import io.kotest.core.spec.style.AnnotationSpec
import io.micronaut.context.ApplicationContext
import io.micronaut.docs.context.events.SampleEventEmitterBean

class SampleEventListenerSpec : AnnotationSpec() {

    @Test
    fun testEventListenerWasNotified() {
        val context = ApplicationContext.run()
        val emitter = context.getBean(SampleEventEmitterBean::class.java)
        val listener = context.getBean(SampleEventListener::class.java)
        listener.invocationCounter.shouldBe(0)
        emitter.publishSampleEvent()
        listener.invocationCounter.shouldBe(1)

        context.close()
    }
}
```

  </TabItem>
</Tabs>

:::tip 注意
可以重写 [supports](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ApplicationEventListener.html#supports-E-) 方法以进一步澄清要处理的事件。
:::

或者，如果你不希望实现接口或使用内置事件之一，如 [StartupEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/StartupEvent.html) 和 [ShutdownEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ShutdownEvent.html)，请使用 [@EventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/event/annotation/EventListener.html) 注解：

*使用 `@EventListener` 监听事件*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.docs.context.events.SampleEvent;
import io.micronaut.context.event.StartupEvent;
import io.micronaut.context.event.ShutdownEvent;
import io.micronaut.runtime.event.annotation.EventListener;

@Singleton
public class SampleEventListener {
    private int invocationCounter = 0;

    @EventListener
    public void onSampleEvent(SampleEvent event) {
        invocationCounter++;
    }

    @EventListener
    public void onStartupEvent(StartupEvent event) {
        // startup logic here
    }

    @EventListener
    public void onShutdownEvent(ShutdownEvent event) {
        // shutdown logic here
    }

    public int getInvocationCounter() {
        return invocationCounter;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.docs.context.events.SampleEvent
import io.micronaut.context.event.StartupEvent
import io.micronaut.context.event.ShutdownEvent
import io.micronaut.runtime.event.annotation.EventListener

@Singleton
class SampleEventListener {
    int invocationCounter = 0

    @EventListener
    void onSampleEvent(SampleEvent event) {
        invocationCounter++
    }

    @EventListener
    void onStartupEvent(StartupEvent event) {
        // startup logic here
    }

    @EventListener
    void onShutdownEvent(ShutdownEvent event) {
        // shutdown logic here
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.docs.context.events.SampleEvent
import io.micronaut.context.event.StartupEvent
import io.micronaut.context.event.ShutdownEvent
import io.micronaut.runtime.event.annotation.EventListener

@Singleton
class SampleEventListener {
    var invocationCounter = 0

    @EventListener
    internal fun onSampleEvent(event: SampleEvent) {
        invocationCounter++
    }

    @EventListener
    internal fun onStartupEvent(event: StartupEvent) {
        // startup logic here
    }

    @EventListener
    internal fun onShutdownEvent(event: ShutdownEvent) {
        // shutdown logic here
    }
}
```

  </TabItem>
</Tabs>

如果侦听器执行的工作可能需要一段时间，请使用 [@Async](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/annotation/Async.html) 注解在单独的线程上运行该操作：

*使用 @EventListener 异步监听事件*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java

```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.docs.context.events.SampleEvent
import io.micronaut.runtime.event.annotation.EventListener
import io.micronaut.scheduling.annotation.Async

@Singleton
class SampleEventListener {
    AtomicInteger invocationCounter = new AtomicInteger(0)

    @EventListener
    @Async
    void onSampleEvent(SampleEvent event) {
        invocationCounter.getAndIncrement()
    }
}

import io.micronaut.context.ApplicationContext
import io.micronaut.docs.context.events.SampleEventEmitterBean
import spock.lang.Specification
import spock.util.concurrent.PollingConditions

class SampleEventListenerSpec extends Specification {

    void "test event listener is notified"() {
        given:
        def context = ApplicationContext.run()
        def emitter = context.getBean(SampleEventEmitterBean)
        def listener = context.getBean(SampleEventListener)

        expect:
        listener.invocationCounter.get() == 0

        when:
        emitter.publishSampleEvent()

        then:
        new PollingConditions(timeout: 5).eventually {
            listener.invocationCounter.get() == 1
        }

        cleanup:
        context.close()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.docs.context.events.SampleEvent
import io.micronaut.runtime.event.annotation.EventListener
import io.micronaut.scheduling.annotation.Async
import java.util.concurrent.atomic.AtomicInteger

@Singleton
open class SampleEventListener {

    var invocationCounter = AtomicInteger(0)

    @EventListener
    @Async
    open fun onSampleEvent(event: SampleEvent) {
        println("Incrementing invocation counter...")
        invocationCounter.getAndIncrement()
    }
}

import io.kotest.assertions.timing.eventually
import io.kotest.matchers.shouldBe
import io.kotest.core.spec.style.AnnotationSpec
import io.micronaut.context.ApplicationContext
import io.micronaut.docs.context.events.SampleEventEmitterBean
import org.opentest4j.AssertionFailedError
import kotlin.time.DurationUnit
import kotlin.time.ExperimentalTime
import kotlin.time.toDuration

@ExperimentalTime
class SampleEventListenerSpec : AnnotationSpec() {

    @Test
    suspend fun testEventListenerWasNotified() {
        val context = ApplicationContext.run()
        val emitter = context.getBean(SampleEventEmitterBean::class.java)
        val listener = context.getBean(SampleEventListener::class.java)
        listener.invocationCounter.get().shouldBe(0)
        emitter.publishSampleEvent()

        eventually(5.toDuration(DurationUnit.SECONDS), AssertionFailedError::class) {
            println("Current value of counter: " + listener.invocationCounter.get())
            listener.invocationCounter.get().shouldBe(1)
        }

        context.close()
    }
}
```

  </TabItem>
</Tabs>

默认情况下，事件侦听器在计划的执行器上运行。你可以在 `application.yml` 中根据需要配置此线程池：

*配置计划任务线程池*

```yaml
micronaut:
  executors:
    scheduled:
      type: scheduled
      core-pool-size: 30
```

## 3.14 Bean 事件

你可以使用以下接口之一钩住 bean 的创建：

- [BeanInitializedEventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/BeanInitializedEventListener.html) ——允许在设置属性之后、但在 `@PostConstruct` 事件钩子之前修改或替换 bean。
- [BeanCreatedEventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/BeanCreatedEventListener.html) ——允许在 bean 完全初始化并调用所有 `@PostConstruct` 钩子后修改或替换 bean。

`BeanInitializedEventListener` 接口通常与 [Factory](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Factory.html) bean 结合使用。考虑以下示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public class V8Engine implements Engine {
    private final int cylinders = 8;
    private double rodLength; // (1)

    public V8Engine(double rodLength) {
        this.rodLength = rodLength;
    }

    @Override
    public String start() {
        return "Starting V" + getCylinders() + " [rodLength=" + getRodLength() + ']';
    }

    @Override
    public final int getCylinders() {
        return cylinders;
    }

    public double getRodLength() {
        return rodLength;
    }

    public void setRodLength(double rodLength) {
        this.rodLength = rodLength;
    }
}

@Factory
public class EngineFactory {

    private V8Engine engine;
    private double rodLength = 5.7;

    @PostConstruct
    public void initialize() {
        engine = new V8Engine(rodLength); // (2)
    }

    @Singleton
    public Engine v8Engine() {
        return engine;// (3)
    }

    public void setRodLength(double rodLength) {
        this.rodLength = rodLength;
    }
}

@Singleton
public class EngineInitializer implements BeanInitializedEventListener<EngineFactory> { // (4)
    @Override
    public EngineFactory onInitialized(BeanInitializingEvent<EngineFactory> event) {
        EngineFactory engineFactory = event.getBean();
        engineFactory.setRodLength(6.6);// (5)
        return engineFactory;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
class V8Engine implements Engine {
    final int cylinders = 8
    double rodLength // (1)

    @Override
    String start() {
        return "Starting V$cylinders [rodLength=$rodLength]"
    }
}

@Factory
class EngineFactory {
    private V8Engine engine
    double rodLength = 5.7

    @PostConstruct
    void initialize() {
        engine = new V8Engine(rodLength: rodLength) // (2)
    }

    @Singleton
    Engine v8Engine() {
        return engine // (3)
    }
}

@Singleton
class EngineInitializer implements BeanInitializedEventListener<EngineFactory> { // (4)
    @Override
    EngineFactory onInitialized(BeanInitializingEvent<EngineFactory> event) {
        EngineFactory engineFactory = event.bean
        engineFactory.rodLength = 6.6 // (5)
        return engineFactory
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
class V8Engine(var rodLength: Double) : Engine {  // (1)

    override val cylinders = 8

    override fun start(): String {
        return "Starting V$cylinders [rodLength=$rodLength]"
    }
}

@Factory
class EngineFactory {

    private var engine: V8Engine? = null
    private var rodLength = 5.7

    @PostConstruct
    fun initialize() {
        engine = V8Engine(rodLength) // (2)
    }

    @Singleton
    fun v8Engine(): Engine? {
        return engine// (3)
    }

    fun setRodLength(rodLength: Double) {
        this.rodLength = rodLength
    }
}

@Singleton
class EngineInitializer : BeanInitializedEventListener<EngineFactory> { // (4)
    override fun onInitialized(event: BeanInitializingEvent<EngineFactory>): EngineFactory {
        val engineFactory = event.bean
        engineFactory.setRodLength(6.6) // (5)
        return engineFactory
    }
}
```

  </TabItem>
</Tabs>

1. `V8Engine` 类定义了 `rodLength` 属性
2. `EngineFactory` 初始化 `rodLength` 的值并创建实例
3. 创建的实例作为 [Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 返回
4. 实现 `BeanInitializedEventListener` 接口以监听工厂的初始化
5. 在 `onInitialized` 方法中，`rodLength` 在工厂 bean 创建引擎之前被重写。

[BeanCreatedEventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/BeanCreatedEventListener.html) 接口通常用于修饰或增强完全初始化的 bean，例如通过创建代理。

:::danger 注意
Bean 事件监听器在类型转换器**前**初始化。如果事件监听器通过依赖配置属性 bean 或任何其他机制依赖类型转换，则可能会看到与类型转换相关的错误。
:::

## 3.15 Bean 自省

从 Micronaut 1.1 开始，JDK 的 [Introspector](https://docs.oracle.com/javase/8/docs/api/java/beans/Introspector.html) 类就包含了编译时替换。

[BeanIntrospector](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanIntrospector.html) 和 [BeanIntrospection](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanIntrospection.html) 接口允许查找 bean 自省来实例化和读/写 bean 属性，而无需使用反射或缓存反射元数据，因为反射元数据会为大型 bean 消耗过多内存。

**让 Bean 可供自省**

与 JDK 的 [Introspector](https://docs.oracle.com/javase/8/docs/api/java/beans/Introspector.html) 不同，不是每个类都可以自动进行内省。要使一个类可用于自省，你必须在构建中至少启用 Micronaut 的注解处理器（`micronaut-inject-java` 用于 Java 和 Kotlin，`micronaut-inject-groovy` 用于 Groovy），并确保有依赖 `micronaut-core` 的运行时。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut:micronaut-inject-java:3.8.4")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut</groupId>
        <artifactId>micronaut-inject-java</artifactId>
        <version>3.8.4</version>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

:::tip 注意
对于 Kotlin，在 `kapt` 范围中添加 `micronaut-inject-java` 依赖，对于 Groovy，在 `compileOnly` 范围中添加 `micronaut-inject-groovy`。
:::

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.micronaut:micronaut-core:3.8.4")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-core</artifactId>
    <version>3.8.4</version>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

**使用 `@Introspected` 注解**

[@Introspected](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Introspected.html) 注解可用于任何类，以使其可用于自省。简单使用 [@Introspected](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Introspected.html) 注解类:

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Introspected;

@Introspected
public class Person {

    private String name;
    private int age = 18;

    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import groovy.transform.Canonical
import io.micronaut.core.annotation.Introspected

@Introspected
@Canonical
class Person {

    String name
    int age = 18

    Person(String name) {
        this.name = name
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.annotation.Introspected

@Introspected
data class Person(var name : String) {
    var age : Int = 18
}
```

  </TabItem>
</Tabs>

一旦在编译时生成了自省数据，就可以通过 [BeanTranspection](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanIntrospection.html) API 检索它：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
final BeanIntrospection<Person> introspection = BeanIntrospection.getIntrospection(Person.class); // (1)
Person person = introspection.instantiate("John"); // (2)
System.out.println("Hello " + person.getName());

final BeanProperty<Person, String> property = introspection.getRequiredProperty("name", String.class); // (3)
property.set(person, "Fred"); // (4)
String name = property.get(person); // (5)
System.out.println("Hello " + person.getName());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
def introspection = BeanIntrospection.getIntrospection(Person) // (1)
Person person = introspection.instantiate("John") // (2)
println("Hello $person.name")

BeanProperty<Person, String> property = introspection.getRequiredProperty("name", String) // (3)
property.set(person, "Fred") // (4)
String name = property.get(person) // (5)
println("Hello $person.name")
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val introspection = BeanIntrospection.getIntrospection(Person::class.java) // (1)
val person : Person = introspection.instantiate("John") // (2)
print("Hello ${person.name}")

val property : BeanProperty<Person, String> = introspection.getRequiredProperty("name", String::class.java) // (3)
property.set(person, "Fred") // (4)
val name = property.get(person) // (5)
print("Hello ${person.name}")
```

  </TabItem>
</Tabs>

1. 你可以使用静态 `getIntrospection` 方法检索 [BeanIntrospection](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanIntrospection.html)
2. 一旦有了 [BeanIntrospection](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanIntrospection.html)，就可以使用 `instantiate` 方法实例化一个 bean。
3. 可以从自省中检索 [BeanProperty](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanProperty.html)
4. 使用 `set` 方法设置属性值
5. 使用 `get` 方法检索属性值

**@Introspected 和 @AccessorsStyle 共同使用**

可以将 [@AccessorsStyle](https://docs.micronaut.io/3.8.4/guide/index.html#configurationPropertiesAccessorsStyle) 注解与 @Introspected 一起使用：

```java
import io.micronaut.core.annotation.AccessorsStyle;
import io.micronaut.core.annotation.Introspected;

@Introspected
@AccessorsStyle(readPrefixes = "", writePrefixes = "") (1)
public class Person {

    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String name() { (2)
        return name;
    }

    public void name(String name) { (2)
        this.name = name;
    }

    public int age() { (2)
        return age;
    }

    public void age(int age) { (2)
        this.age = age;
    }
}
```

1. 用 `@AccessorsStyle` 注解类，为 getter 和 setter 定义空的读写前缀。
2. 定义不带前缀的 getter 和 setter。

现在，可以使用 [BeanTurpection](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanIntrospection.html) API 检索编译时生成的自省：

```java
BeanIntrospection<Person> introspection = BeanIntrospection.getIntrospection(Person.class);
Person person = introspection.instantiate("John", 42);

Assertions.assertEquals("John", person.name());
Assertions.assertEquals(42, person.age());
```

**Bean 字段**

默认情况下，Java 自省仅将 JavaBean getter/setter 或 Java 16 记录组件视为 bean 属性。但是，你可以使用 [@Introspected](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Introspected.html) 注解的 `accessKind` 成员在 Java 中定义带有公共或包保护字段的类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Introspected;

@Introspected(accessKind = Introspected.AccessKind.FIELD)
public class User {
    public final String name; // (1)
    public int age = 18; // (2)

    public User(String name) {
        this.name = name;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Introspected

@Introspected(accessKind = Introspected.AccessKind.FIELD)
class User {
    public final String name // (1)
    public int age = 18 // (2)

    User(String name) {
        this.name = name
    }
}
```

  </TabItem>
</Tabs>

1. final 字段被视为只读属性
2. 可变字段被视为读写属性

:::tip 注意
`accessKind` 接受一个数组，因此可以允许两种类型的访问器，但根据它们在注释中出现的顺序，更喜欢其中一种。列表中的第一个具有优先级。
:::

:::danger 严重
在 Kotlin 中无法对字段进行自省，因为无法直接声明字段。
:::

**构造方法**

对于具有多个构造函数的类，将 [@Creator](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Creator.html) 注解应用于要使用的构造函数。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Creator;
import io.micronaut.core.annotation.Introspected;

import javax.annotation.concurrent.Immutable;

@Introspected
@Immutable
public class Vehicle {

    private final String make;
    private final String model;
    private final int axles;

    public Vehicle(String make, String model) {
        this(make, model, 2);
    }

    @Creator // (1)
    public Vehicle(String make, String model, int axles) {
        this.make = make;
        this.model = model;
        this.axles = axles;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public int getAxles() {
        return axles;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Creator
import io.micronaut.core.annotation.Introspected

import javax.annotation.concurrent.Immutable

@Introspected
@Immutable
class Vehicle {

    final String make
    final String model
    final int axles

    Vehicle(String make, String model) {
        this(make, model, 2)
    }

    @Creator // (1)
    Vehicle(String make, String model, int axles) {
        this.make = make
        this.model = model
        this.axles = axles
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.annotation.Creator
import io.micronaut.core.annotation.Introspected

import javax.annotation.concurrent.Immutable

@Introspected
@Immutable
class Vehicle @Creator constructor(val make: String, val model: String, val axles: Int) { // (1)

    constructor(make: String, model: String) : this(make, model, 2) {}
}
```

  </TabItem>
</Tabs>

1. [@Creator](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Creator.html) 注解表示要使用的构造函数

:::tip 注意
该类没有默认构造函数，因此在没有参数的情况下调用实例化会引发 [InstantiationException](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/reflect/exception/InstantiationException.html)。
:::

**静态 Creator 方法**

[@Creator](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Creator.html) 注解可以应用于创建类实例的静态方法。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Creator;
import io.micronaut.core.annotation.Introspected;

import javax.annotation.concurrent.Immutable;

@Introspected
@Immutable
public class Business {

    private final String name;

    private Business(String name) {
        this.name = name;
    }

    @Creator // (1)
    public static Business forName(String name) {
        return new Business(name);
    }

    public String getName() {
        return name;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Creator
import io.micronaut.core.annotation.Introspected

import javax.annotation.concurrent.Immutable

@Introspected
@Immutable
class Business {

    final String name

    private Business(String name) {
        this.name = name
    }

    @Creator // (1)
    static Business forName(String name) {
        new Business(name)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.annotation.Creator
import io.micronaut.core.annotation.Introspected

import javax.annotation.concurrent.Immutable

@Introspected
@Immutable
class Business private constructor(val name: String) {
    companion object {

        @Creator // (1)
        fun forName(name: String): Business {
            return Business(name)
        }
    }

}
```

  </TabItem>
</Tabs>

1. [@Creator](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Creator.html) 注解应用于实例化类的静态方法

:::notice 提示
可以注释多个“creator”方法。如果有一个没有参数，它将是默认的构造方法。第一个带参数的方法将用作主要构造方法。
:::

**枚举**

也可以对枚举进行内省。将注解添加到枚举中，它可以通过标准 `valueOf` 方法构造。

**在配置类中使用 `@Introspected`**

如果要自省的类已经编译并且不在你的控制之下，另一种选择是使用 [@Introspected](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Introspected.html) 注解集的 `classes` 成员定义一个配置类。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Introspected;

@Introspected(classes = Person.class)
public class PersonConfiguration {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Introspected

@Introspected(classes = Person)
class PersonConfiguration {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.annotation.Introspected

@Introspected(classes = [Person::class])
class PersonConfiguration
```

  </TabItem>
</Tabs>

在上面的示例中，`PersonConfiguration` 类为 `Person` 类生成自省。

:::tip 注意
你还可以使用 [@Introspected](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/Introspected.html) 的 `packages` 成员，该包在编译时扫描并为包中的所有类生成自省。注意，此功能目前被视为实验性。
:::

**编写 AnnotationMapper 以自省现有注解**

如果默认情况下你希望自省现有注解，则可以编写 [AnnotationMap](https://docs.micronaut.io/3.8.4/api/io/micronaut/inject/annotation/AnnotationMapper.html)。

这方面的一个例子是 [EntityIntrospectedAnnotationMap](https://github.com/micronaut-projects/micronaut-core/blob/master/inject/src/main/java/io/micronaut/inject/beans/visitor/EntityIntrospectedAnnotationMapper.java)，它确保所有用 `javax.persistence.Entity` 注解的 bean 在默认情况下都是可自省的。

:::tip 注意
`AnnotationMap` 必须位于注解处理器 classpath 上。
:::

**BeanWrapper API**

[BeanProperty](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanProperty.html) 提供了读取和写入给定类的属性值的原始访问，不提供任何自动类型转换。

传递给 `set` 和 `get` 方法的值应与基础属性类型匹配，否则将发生异常。

为了提供额外的类型转换智能，[BeanWrapper](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanWrapper.html) 接口允许包装现有 bean 实例，设置并获取 bean 的属性，并根据需要执行类型转换。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
final BeanWrapper<Person> wrapper = BeanWrapper.getWrapper(new Person("Fred")); // (1)

wrapper.setProperty("age", "20"); // (2)
int newAge = wrapper.getRequiredProperty("age", int.class); // (3)

System.out.println("Person's age now " + newAge);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
final BeanWrapper<Person> wrapper = BeanWrapper.getWrapper(new Person("Fred")) // (1)

wrapper.setProperty("age", "20") // (2)
int newAge = wrapper.getRequiredProperty("age", Integer) // (3)

println("Person's age now $newAge")
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val wrapper = BeanWrapper.getWrapper(Person("Fred")) // (1)

wrapper.setProperty("age", "20") // (2)
val newAge = wrapper.getRequiredProperty("age", Int::class.java) // (3)

println("Person's age now $newAge")
```

  </TabItem>
</Tabs>

1. 使用静态 `getWrapper` 方法获取 bean 实例的 [BeanWrapper](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanWrapper.html)。
2. 你可以设置财产，[BeanWrapper](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanWrapper.html) 将执行类型转换，如果转换不可能，则抛出 [ConversionErrorException](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/exceptions/ConversionErrorException.html)。
3. 你可以使用 `getRequiredProperty` 检索属性并请求适当的类型。如果属性不存在，则引发 [IntrospectionException](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/exceptions/IntrospectionException.html)，如果无法转换，则引发  [ConversionErrorException](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/exceptions/ConversionErrorException.html)。

**Jackson 与 Bean 自省**

Jackson 被配置为使用 [BeanIntrospection](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/beans/BeanIntrospection.html) API 来读写属性值和构造对象，从而实现无反射的序列化/反序列化。从性能角度来看，这是有益的，并且需要较少的配置才能在运行时（如 GraalVM 本地）中正确运行。

默认情况下启用此功能；通过将 `jackson.bean-introspection-module` 配置设置为 `false` 来禁用它。

:::tip 注意
目前只支持 bean 属性（带有公共 getter/setter 的私有字段），不支持使用公共字段。
:::

:::tip 注意
该功能目前处于试验阶段，将来可能会发生变化。
:::

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#ioc)

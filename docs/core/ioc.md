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
2. `V8Engine` 实现被定义并标记为 `Singleton` 范围
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

- 构造函数注入（必须是一个公共构造函数或带有 `@Inject` 注释的单个构造函数）
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

当从上下文请求 `RateLimit` bean 集合时，将根据注释中的值以升序返回它们。

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

上面的注解本身使用 `@Qualifier` 进行注解，以将其指定为限定符。然后可以在代码中的任何注入点使用注释。例如：

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

1. `@Cylinders` 注解使用 `@Qualifier` 进行元注释
2. 注解有两个成员。[@NonBinding](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/NonBinding.html) 注解用于在依赖项解析期间排除描述成员。

然后，您可以在任何 bean 上使用 `@Cylinders` 注解，并且在依赖关系解析期间会考虑未使用 [@NonBinding](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/NonBinding.html) 注解的成员：

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

默认情况下，当你使用作用域（如 `@Singleton`）注释 bean 时，bean 类及其实现的所有接口和扩展的超级类都可以通过 `@Inject` 注入。

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

## 3.7 范围

Micronaut 具有基于 JSR-330 的可扩展 bean 范围机制。支持以下默认范围：

### 3.7.1 内置范围

*表1。Micronaut 内置范围*

|类型|描述|
|--|--|
|[@Singleton](https://docs.oracle.com/javaee/6/api/javax/inject/Singleton.html)|Singleton 范围表示只存在bean的一个实例|
|[@Context](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Context.html)|Context 范围表示 bean 将与 `ApplicationContext` 同时创建（急切初始化）|
|[@Prototype](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Prototype.html)|Prototype 范围表示每次注入 bean 时都会创建一个新的 bean 实例|
|[@Infrastructure](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Infrastructure.html)|Infrastructure 范围表示不能使用 [@Replaces](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Replaces.html) 重写或替换的 bean，因为它对系统的运行至关重要。|
|[@ThreadLocal](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/context/scope/ThreadLocal.html)|`@ThreadLocal` 范围是一个自定义作用域，通过 ThreadLocal 为每个线程关联一个 bean|
|[@Refreshable](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/context/scope/Refreshable.html)|`@Refreshable` 范围是一个自定义范围，允许通过 `/refresh` 端点刷新bean的状态。|
|[@RequestScope](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/http/scope/RequestScope.html)|`@RequestScope` 范围是一个自定义作用域，它指示创建了 bean 的新实例并与每个 HTTP 请求相关联|

:::tip 注意
[@Prototype](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Prototype.html) 注解是 [@Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 的同义词，因为默认范围是 Prototype。
:::

通过定义实现 [CustomScope](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/scope/CustomScope.html) 接口的`@Singleton` bean，可以添加其他作用域。

注意，在启动 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 时，默认情况下，`@Singleton` 作用域 bean 是按需创建的。这是为了优化启动时间而设计的。

如果这给您的用例带来了问题，你可以选择使用 [@Context](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Context.html) 注解，该注解将对象的生命周期绑定到 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 的生命周期。换句话说，当 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 启动时，将创建 bean。

或者，用 [@Parallel](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Parallel.html) 注解任何 `@Singleton` 作用域的 bean，它允许并行初始化 bean 而不影响整个启动时间。

:::tip 注意
如果 bean 未能并行初始化，应用程序将自动关闭。
:::

#### 3.7.1.1 Singleton 的急切初始化

在某些情况下，例如在 AWS Lambda 上，分配给 Lambda 构造的 CPU 资源多于执行的 CPU 资源，可能需要对 `@Singleton` bean 进行急切初始化。

你可以使用 [ApplicationContextBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContextBuilder.html) 接口指定是否急切地初始化 `@Singleton` 范围的 bean：

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

[@ConfigurationReader](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationReader.html) bean，如 [@EachProperty](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/EachProperty.html) 或[@ConfigurationProperties](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationProperties.html)是单例 bean。要急切地初始化配置，但保持其他 `@Singleton` 范围内的 bean 懒创建，请使用 `eagerInitConfiguration`：

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

### 3.7.2 Refreshable 范围

[Refreshable](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/context/scope/Refreshable.html) 范围是一个自定义范围，允许通过以下方式刷新 bean 的状态：

- `/refresh` 端点。
- [RefreshEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/context/scope/refresh/RefreshEvent.html) 的发布。

以下示例说明了 `@Refreshable` 范围的行为。

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

1. `WeatherService` 使用 `@Refreshable` 范围进行注释，它存储实例，直到触发刷新事件
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

### 3.7.3 元注解范围

可以在元注解上定义作用域，然后可以将其应用于类。考虑以下元注释示例：

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

1. 范围使用 [Requires](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Requires.html) 声明 `Car` 类上的需求
2. 注解声明为 `@Singleton`

在上面的示例中，`@Singleton` 注解应用于 `@Driver` 注解，这会导致用 `@Driver` 进行注解的每个类都被视为单例。

注意，在这种情况下，应用注解时不可能更改范围。例如，以下内容不会覆盖 `@Driver` 声明的范围，并且无效：

*声明另一个范围*

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

在许多情况下，您可能希望将不属于代码库的类（如第三方库提供的类）作为bean提供。在这种情况下，不能对编译的类进行注释。相反，实现一个 [@Factory](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Factory.html)。

工厂是一个用 [Factory](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Factory.html) 注解的注解类，它提供了一个或多个注解的方法（用 bean 范围注解）。您使用的注解取决于您希望 bean 位于哪个作用域中。更多信息，参阅 [bean 作用域](#37-范围)一节。

:::tip 注意
工厂具有默认作用域 singleton ，并将随上下文一起销毁。如果您想在工厂生成 bean 后处理它，请使用 `@Prototype` 范围。
:::

用 bean 范围注解来注解的方法的返回类型是 bean 类型。这最好用一个例子来说明：

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

在本例中，`V8Engine` 由 `EngineFactory` 类的 `V8Engine` 方法创建。注意，您可以将参数注入到方法中，它们将被解析为 bean。生成的 `V8Engine` bean 将是一个单例。

一个工厂可以有多个用 bean 范围注解的方法，每个方法都返回一个不同的 bean 类型。

:::tip 注意
如果采用这种方法，则不应在类内部调用其他 bean 方法。相反，通过参数注入类型。
:::

:::note 提示
要允许生成的 bean 参与应用程序上下文关闭过程，请使用 [@Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 注解该方法，并将 `preDestroy` 参数设置为要调用以关闭 bean 的方法的名称。
:::

**来自字段的 Bean**

使用 Micronaut 3.0 或更高版本，也可以通过在字段上声明 [@Bean](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Bean.html) 注解来从字段生成 Bean。

虽然一般情况下，这种方法应该不鼓励使用工厂方法，因为工厂方法提供了更多的灵活性，但它确实简化了测试代码。例如，使用 bean 字段，您可以在测试代码中轻松生成模拟：

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



> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#ioc)

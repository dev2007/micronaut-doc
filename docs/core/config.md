---
sidebar_position: 40
---

# 4. 应用配置

Micronaut 中的配置灵感来自 Spring Boot 和 Grails，将来自多个源的配置属性直接集成到核心 IoC 容器中。

默认情况下，可以在 Java 属性、YAML、JSON 或 Groovy 文件中提供配置。约定是搜索名为 `application.yml`、`application.properties`、`application.json` 或 `application.groovy` 的文件。

此外，与 Spring 和 Grails 一样，Micronaut 允许通过系统属性或环境变量覆盖任何属性。

每个配置源都使用 [PropertySource](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/PropertySource.html) 接口进行建模，并且该机制是可扩展的，允许实现其他 [PropertySourceLoader](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/PropertySourceLoader.html) 实现。

## 4.1 环境

应用程序环境由 [Environment](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/Environment.html) 接口建模，该接口允许在创建 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 时指定一个或多个唯一的环境名称。

*初始化环境*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
ApplicationContext applicationContext = ApplicationContext.run("test", "android");
Environment environment = applicationContext.getEnvironment();

assertTrue(environment.getActiveNames().contains("test"));
assertTrue(environment.getActiveNames().contains("android"));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
when:
ApplicationContext applicationContext = ApplicationContext.run("test", "android")
Environment environment = applicationContext.getEnvironment()

then:
environment.activeNames.contains("test")
environment.activeNames.contains("android")
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val applicationContext = ApplicationContext.run("test", "android")
val environment = applicationContext.environment

assertTrue(environment.activeNames.contains("test"))
assertTrue(environment.activeNames.contains("android"))
```

  </TabItem>
</Tabs>

活动环境名称允许根据环境加载不同的配置文件，还可以使用 [@Requires](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Requires.html) 注解有条件地加载 bean 或 bean [@Configuration](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Configuration.html) 包。

此外，Micronaut 还试图检测当前的环境。例如，在 Spock 或 JUnit 测试中，[TEST](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/Environment.html#TEST) 环境会自动激活。

可以使用 `micronaut.environments` 系统属性或 `MICRONAUT_ENVIRONMENTS` 环境变量指定其他活动环境。这些被指定为逗号分隔的列表。例如：

*指定环境*

```bash
$ java -Dmicronaut.environments=foo,bar -jar myapp.jar
```

以上内容激活了名为 `foo` 和 `bar` 的环境。

最后，还会检测云环境名称。详细信息，参阅[云配置](../core/cloud.html#81-云配置)部分。

### 环境优先级

Micronaut 根据指定的环境加载属性源，如果特定于某个环境的多个属性源中存在相同的属性键，则环境顺序将确定要使用的值。

Micronaut 使用以下层次结构进行环境处理（从最低到最高优先级）：
- 推断的环境
- `micronaut.environments` 系统属性中的环境
- `MICRONAUT_Environments` 环境变量中的环境
- 通过应用程序上下文生成器显式指定的环境

:::tip 注意
也适用于 `@MicronautTest(environments = …​)`
:::

### 禁用环境检测

通过将 `micronaut.env.deuction` 系统属性或 `MICRONAUT_ENV_DEDUCTION` 环境变量设置为 `false`，可以禁用环境的自动检测。这防止了 Micronaut 在仍然使用如上所示专门提供的任何环境的情况下检测当前环境。

*通过系统属性禁用环境检测*

```bash
$  java -Dmicronaut.env.deduction=false -jar myapp.jar
```

或者，你也可以在设置应用程序时使用 [ApplicationContextBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContextBuilder.html) 的 `deduceEnvironment` 方法禁用环境推断。

*通过 ApplicationContextBuilder 禁用环境推断*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Test
public void testDisableEnvironmentDeductionViaBuilder() {
    ApplicationContext ctx = ApplicationContext.builder()
            .deduceEnvironment(false)
            .properties(Collections.singletonMap("micronaut.server.port", -1))
            .start();
    assertFalse(ctx.getEnvironment().getActiveNames().contains(Environment.TEST));
    ctx.close();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void "test disable environment deduction via builder"() {
    when:
    ApplicationContext ctx = ApplicationContext.builder().deduceEnvironment(false).start()

    then:
    !ctx.environment.activeNames.contains(Environment.TEST)

    cleanup:
    ctx.close()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
"test disable environment deduction via builder"() {
    val ctx = ApplicationContext.builder().deduceEnvironment(false).start()
    assertFalse(ctx.environment.activeNames.contains(Environment.TEST))
    ctx.close()
}
```

  </TabItem>
</Tabs>

### 默认环境

Micronaut 支持一个或多个默认环境的概念。默认环境是指只有在没有明确指定或推导其他环境的情况下才应用的环境。环境可以通过应用程序上下文生成器 `Micronaut.build().environments(…​)` ，由 `micronaut.environments` 系统属性或 `MICRONAUT_ENVIRONMENTS` 环境变量显式指定。环境可以推断为自动应用适合于云部署的环境。如果通过上述任何方式找到环境，则不会应用默认环境。

要设置默认环境，请包含一个实现 [ApplicationContextConfigurer](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContextConfigurer.html) 并用 [ContextConfigurer](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ContextConfigurer.html) 进行注解的公共静态类：

```java
public class Application {

    @ContextConfigurer
    public static class DefaultEnvironmentConfigurer implements ApplicationContextConfigurer {
        @Override
        public void configure(@NonNull ApplicationContextBuilder builder) {
            builder.defaultEnvironments(defaultEnvironment);
        }
    }

    public static void main(String[] args) {
        Micronaut.run(Application.class, args);
    }
}
```

:::tip 注意
以前，我们建议使用 `Micronaut.defaultEnvironments("dev")`，但这不允许提前（AOT）编译器检测默认环境。
:::

### Micronaut 横幅

从 Micronaut 2.3 起，应用程序启动时会显示横幅。它在默认情况下处于启用状态，并且还显示 Micronaut 版本。

```bash
$ ./gradlew run
 __  __ _                                  _
|  \/  (_) ___ _ __ ___  _ __   __ _ _   _| |_
| |\/| | |/ __| '__/ _ \| '_ \ / _` | | | | __|
| |  | | | (__| | | (_) | | | | (_| | |_| | |_
|_|  |_|_|\___|_|  \___/|_| |_|\__,_|\__,_|\__|
  Micronaut (3.8.4)

17:07:22.997 [main] INFO  io.micronaut.runtime.Micronaut - Startup completed in 611ms. Server Running: http://localhost:8080
```

要使用你自己的 ASCII 艺术（目前仅支持纯 ASCII）自定义横幅，请创建 `src/main/resources/micronaut-banner.txt` 文件，然后它将用于替代默认的横幅。

要禁用它，请修改 `Application` 类：

```java
public class Application {

    public static void main(String[] args) {
        Micronaut.build(args)
                 .banner(false) (1)
                 .start();
    }
}
```

1. 禁用横幅

## 4.2 具有 PropertySources 的外部化配置

在初始化 [ApplicationContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContext.html) 之前，可以将其他 [PropertySource](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/PropertySource.html) 实例添加到环境中。

*初始化 Environment*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
ApplicationContext applicationContext = ApplicationContext.run(
        PropertySource.of(
                "test",
                CollectionUtils.mapOf(
                    "micronaut.server.host", "foo",
                    "micronaut.server.port", 8080
                )
        ),
        "test", "android");
Environment environment = applicationContext.getEnvironment();

assertEquals(
        "foo",
        environment.getProperty("micronaut.server.host", String.class).orElse("localhost")
);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
when:
ApplicationContext applicationContext = ApplicationContext.run(
        PropertySource.of(
                "test",
                [
                    "micronaut.server.host": "foo",
                    "micronaut.server.port": 8080
                ]
        ),
        "test", "android")
Environment environment = applicationContext.getEnvironment()

then:
"foo" == environment.getProperty("micronaut.server.host", String.class).orElse("localhost")
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val applicationContext = ApplicationContext.run(
    PropertySource.of(
        "test",
        mapOf(
            "micronaut.server.host" to "foo",
            "micronaut.server.port" to 8080
        )
    ),
    "test", "android"
)
val environment = applicationContext.environment

assertEquals(
    "foo",
    environment.getProperty("micronaut.server.host", String::class.java).orElse("localhost")
)
```

  </TabItem>
</Tabs>

[PropertySource.of](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/PropertySource.html) 方法可用于从值映射创建 `PropertySource`。

或者，可以通过创建 `META-INF/services/io.micronaut.text.env.PropertySourceLoader` 文件来注册 [PropertySourceLoader](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/PropertySourceLoader.html)，该文件包含对 `PropertySourceLoader` 类名的引用。

**包含的 PropertySource 加载程序**

默认情况下，Micronaut 包含从给定位置和优先级加载属性的 `PropertySourceLoader` 实现：

1. 命令行参数
2. 来自 `SPRING_APPLICATION_JSON` 的属性（用于 Spring 兼容性）
3. `MICRONAUT_APPLICATION_JSON` 中的属性
4. Java 系统属性
5. 操作系统环境变量
6. 从系统属性 “micronaut.config.files” 或环境变量 `MICRONAUT_CONFIG_FILES` 按顺序加载的配置文件。该值可以是以逗号分隔的路径列表，最后一个文件具有优先级。文件可以作为路径从文件系统中引用，也可以作为带有 `classpath:` 前缀的类路径引用。
7. 来自 `application-{environment}.{extension}` 特定环境属性
8. 来自 `application.{extension}` 特定应用属性

:::note 提示
`.properties`、`.json`、`.yml` 开箱即用。对于 Groovy 用户，`.groovy` 也是受支持的。
:::

请注意，如果你希望完全控制应用程序从何处加载配置，则可以在启动应用程序时通过调用 [ApplicationContextBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContextBuilder.html) 接口的 `enableDefaultPropertySources(false)` 方法来禁用上面列出的默认 `PropertySourceLoader` 实现。

在这种情况下，将只使用通过 [ApplicationContextBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContextBuilder.html) 接口的 `propertySources(..)` 方法添加的显式 [PropertySource](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/PropertySource.html) 实例。

**通过命令行提供配置**

可以使用 Gradle 或我们的 Maven 插件在命令行提供配置。例如：

*Gradle*

```bash
$ ./gradlew run --args="-endpoints.health.enabled=true -config.property=test"
```

*Maven*

```bash
$ ./mvnw mn:run -Dmn.appArgs="-endpoints.health.enabled=true -config.property=test"
```

要使配置成为上下文的一部分，必须将主方法中的参数传递给上下文生成器。例如：

```java
import io.micronaut.runtime.Micronaut;

public class Application {

    public static void main(String[] args) {
        Micronaut.run(Application.class, args); // passing args
    }
}
```

**机密和敏感配置**

需要重点注意的是，不建议将密码和令牌等敏感配置存储在可能检查到源代码管理系统中的配置文件中。

相反，最好使用外部机密管理器系统（这里有很多选项，许多由云提供商提供）或在应用程序部署期间设置的环境变量，将敏感配置完全从应用程序代码中外部化。你还可以使用属性占位符（参阅以下部分），自定义要使用的环境变量的名称并提供默认值：

*使用属性占位符定义安全配置*

```yaml
datasources:
  default:
    url: ${JDBC_URL:`jdbc:mysql://localhost:3306/db`}
    username: ${JDBC_USER:root}
    password: ${JDBC_PASSWORD:}
    dialect: MYSQL
    driverClassName: ${JDBC_DRIVER:com.mysql.cj.jdbc.Driver}
```

要安全地外部化配置，请考虑使用 Micronaut 支持的机密管理器系统，例如：

- [AWS Secrets Manager](../aws/sdkv2.html#712-机密管理器)
- [Google Cloud Secrets Manager](../gcp/secretManager.html)
- [HashiCorp Vault](../core/cloud.html#813-HashiCorp-Vault-支持)
- [Kubernetes Secrets](../kubernetes/config-client.html)
- [Oracle Cloud Vault](../oracle/vault.html)

**属性值占位符**

如前一节所述，Micronaut 包含一个属性占位符语法，用于在配置值内和使用任何 Micronaot 注解引用配置属性。参阅 [@Value](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Value.html) 和[配置注入](#43-配置注入)部分。

:::note 提示
也可以通过 [PropertyPlaceholderResolver](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/PropertyPlaceholderResolver.html) 接口进行编程使用。
:::

基本语法是将对属性的引用包装在 `${…​}`， 例如在 `application.yml` 中：

*定义属性占位符*

```yaml
myapp:
  endpoint: http://${micronaut.server.host}:${micronaut.server.port}/foo
```

上述示例嵌入了对 `microaut.server.host` 和 `microauT.server.port` 属性的引用。

你可以通过在 `:` 字符后定义一个值来指定默认值。例如：

*使用默认值*

```yaml
myapp:
  endpoint: http://${micronaut.server.host:localhost}:${micronaut.server.port:8080}/foo
```

如果找不到值（而不是抛出异常），则上面的示例默认为 `localhost` 和端口 `8080`。请注意，如果默认值包含 `:` 字符，则必须使用反引号对其进行转义：

*使用反引号*

```yaml
myapp:
  endpoint: ${server.address:`http://localhost:8080`}/foo
```

上面的示例查找 `server.address` 属性，并默认为 http://localhost:8080 。由于此默认值有一个 `:` 字符，因此使用反引号对其进行转义。

**属性值绑定**

请注意，在代码或占位符值中放置引用时，这些属性引用应使用 kebab 风格（小写和连字符分隔）。例如，使用 `micronat.server.default-charset`，而不是使用 `micronaut.server.defaultCharset`。

Micronaut 仍然允许在配置中指定后者，但将属性规范化为 kebab 风格，以优化内存消耗并降低解析属性时的复杂性。下表总结了如何从不同来源规范化属性：

*表 1.属性值标准化*

|配置值|结果属性|属性源|
|--|--|--|
|myApp.myStuff|my-app.my-stuff|Properties、YAML 等|
|my-app.myStuff|my-app.my-stuff|Properties、YAML 等|
|myApp.my-stuff|my-app.my-stuff|Properties、YAML 等|
|MYAPP_MYSTUFF|myapp.mystuff, myapp-mystuff|环境变量|
|MY_APP_MY_STUFF|my.app.my.stuff, my.app.my-stuff, my.app-my.stuff, my.app-my-stuff, my-app.my.stuff, my-app.my-stuff, my-app-my.stuff, my-app-my-stuff|环境变量|

环境变量进行了特殊处理，以提供更大的灵活性。请注意，没有办法引用带有驼峰风格的环境变量。

:::danger 警告
由于生成的属性数量是基于环境变量中 `_` 字符数的指数，因此如果具有多个下划线的环境变量的数量很大，建议优化配置中包括哪些环境变量（如果有）。
:::

要控制环境属性如何参与配置，请调用 `Micronaut` 构建器上的相应方法。

*Application 类*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.runtime.Micronaut;

public class Application {

    public static void main(String[] args) {
        Micronaut.build(args)
                .mainClass(Application.class)
                .environmentPropertySource(false)
                //or
                .environmentVariableIncludes("THIS_ENV_ONLY")
                //or
                .environmentVariableExcludes("EXCLUDED_ENV")
                .start();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.runtime.Micronaut

class Application {

    static void main(String[] args) {
        Micronaut.build()
                .mainClass(Application)
                .environmentPropertySource(false)
                //or
                .environmentVariableIncludes("THIS_ENV_ONLY")
                //or
                .environmentVariableExcludes("EXCLUDED_ENV")
                .start()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.runtime.Micronaut

object Application {

    @JvmStatic
    fun main(args: Array<String>) {
        Micronaut.build(null)
                .mainClass(Application::class.java)
                .environmentPropertySource(false)
                //or
                .environmentVariableIncludes("THIS_ENV_ONLY")
                //or
                .environmentVariableExcludes("EXCLUDED_ENV")
                .start()
    }
}
```

  </TabItem>
</Tabs>

:::tip 注意
上面的配置对属性占位符没有任何影响。无论环境配置是否被禁用，或者即使明确排除了特定属性，仍然可以在占位符中引用环境变量。
:::

**使用随机属性**

你可以使用以下属性来使用 `random` 值。这些可以在配置文件中作为变量使用，如下所示。

```yaml
micronaut:
  application:
    name: myapplication
    instance:
      id: ${random.shortuuid}
```

*表 2.随机值*

|属性|值|
|--|--|
|random.port|可用的随机端口值|
|random.int|随机 int|
|random.integer|随机 int|
|random.long|随机 long|
|random.float|随机 float|
|random.shortuuid|随机 UUID，限定仅 10 字符 （注意：由于不是完整 UUID，可能出现冲突）|
|random.uuid|带连接符的随机 UUID|
|random.uuid2|无连接符的随机 UUID|

`random.int`、`random.integer`、`random.long` 和 `random.float` 属性支持范围后缀，其语法如下：

- `(max)` max 值不包含

- `[min,max]` min 值包含，max 值不包含

```yaml
instance:
  id: ${random.int[5,10]}
  count: ${random.int(5)}
```

:::tip 注意
范围也可能从负值到正值不等
:::

**快速失败属性注入**

对于注入所需属性的 bean，在请求 bean之前，不会发生注入和潜在故障。为了在启动时验证财产是否存在并可以注入，可以使用 [@Context](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Context.html) 对 bean 进行注解。上下文范围的 bean 在启动时被注入，如果缺少任何必需的属性或无法转换为必需的类型，则启动将失败。

## 4.3 配置注入

你可以使用 [@Value](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Value.html) 注解将配置值注入到 bean 中。

**使用 `@Value` 注解**

考虑以下示例：

*@Value 示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Value;

import jakarta.inject.Singleton;

@Singleton
public class EngineImpl implements Engine {

    @Value("${my.engine.cylinders:6}") // (1)
    protected int cylinders;

    @Override
    public int getCylinders() {
        return cylinders;
    }

    @Override
    public String start() {// (2)
        return "Starting V" + getCylinders() + " Engine";
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Value

import jakarta.inject.Singleton

@Singleton
class EngineImpl implements Engine {

    @Value('${my.engine.cylinders:6}') // (1)
    protected int cylinders

    @Override
    int getCylinders() {
        cylinders
    }

    @Override
    String start() { // (2)
        "Starting V$cylinders Engine"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Value

import jakarta.inject.Singleton

@Singleton
class EngineImpl : Engine {

    @Value("\${my.engine.cylinders:6}") // (1)
    override var cylinders: Int = 0
        protected set

    override fun start(): String { // (2)
        return "Starting V$cylinders Engine"
    }
}
```

  </TabItem>
</Tabs>

1. `@Value` 注解接受一个可以嵌入占位符值的字符串（默认值可以通过在冒号 `:` 字符后指定一个值来提供）。还要尽量避免将成员可见性设置为 `private`，因为这需要 Micronaut Framework 使用反射。推荐使用 `protected`。
2. 然后可以在代码中使用注入的值。

注意，`@Value` 也可以用于注入静态值。例如，以下注入数字 10：

*静态 @Value 示例*

```java
@Value("10")
int number;
```

当用于组合静态内容和占位符的注入值时，这甚至更有用。例如，要设置 URL：

*@Value 占位符*

```java
@Value("http://${my.host}:${my.port}")
URL url;
```

在上面的示例中，URL 是由配置中必须存在的两个占位符属性构造的：`my.host` 和 `my.port`。

请记住，要在占位符表达式中指定默认值，请使用冒号 `:` 字符。但是，如果指定的默认值包括冒号，则必须使用反引号转义该值。例如：

*@Value 占位符*

```java
@Value("${my.url:`http://foo.com`}")
URL url;
```

请注意，关于属性值占位符的解析，`@Value` 本身并没有什么特别之处。

由于 Micronaut 对注解元数据的广泛支持，你可以在任何注解上使用属性占位符表达式。例如，要使 `@Controller` 的路径可配置，你可以执行以下操作：

```java
@Controller("${hello.controller.path:/hello}")
class HelloController {
    ...
}
```

在上述例子中，如果在配置中指定了 `hello.controller.path`，则控制器将映射到指定的路径，否则将映射到 `/hello`。

你还可以使 [@Client](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/annotation/Client.html) 的目标服务器可配置（尽管服务发现方法通常更好），例如：

```java
@Client("${my.server.url:`http://localhost:8080`}")
interface HelloClient {
    ...
}
```

在上面的示例中，属性 `my.server.url` 可以用于配置客户端，否则客户端将返回到本地主机地址。

**使用 @Property 注解**

回想一下，[@Value](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Value.html) 注解接收一个 String 值，该值可以是静态内容和占位符表达式的混合。如果你试图执行以下操作，这可能会导致混乱：

*不正确使用 @Value*

```java
@Value("my.url")
String url;
```

在上面的例子中，文本字符串值 `my.url` 被注入并设置为 `url` 字段，而不是应用程序配置中 `my.url` 属性的值。这是因为 `@Value` 只解析指定给它的值中的占位符。

若要注入特定的属性名称，你最好使用 [@Property](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Property.html)：

*使用 @Property*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Property;

import jakarta.inject.Inject;
import jakarta.inject.Singleton;

@Singleton
public class Engine {

    @Property(name = "my.engine.cylinders") // (1)
    protected int cylinders; // (2)

    private String manufacturer;

    public int getCylinders() {
        return cylinders;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    @Inject
    public void setManufacturer(@Property(name = "my.engine.manufacturer") String manufacturer) { // (3)
        this.manufacturer = manufacturer;
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Property

import jakarta.inject.Singleton

@Singleton
class Engine {

    @Property(name = "my.engine.cylinders") // (1)
    protected int cylinders // (2)

    @Property(name = "my.engine.manufacturer") //(3)
    String manufacturer

    int getCylinders() {
        cylinders
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Property

import jakarta.inject.Inject
import jakarta.inject.Singleton


@Singleton
class Engine {

    @field:Property(name = "my.engine.cylinders") // (1)
    protected var cylinders: Int = 0 // (2)

    @set:Inject
    @setparam:Property(name = "my.engine.manufacturer") // (3)
    var manufacturer: String? = null

    fun cylinders(): Int {
        return cylinders
    }
}
```

  </TabItem>
</Tabs>

1. `my.engine.clinders` 属性从配置中解析并注入到字段中。
2. 需要注入的字段不应是私有的，因为必须使用昂贵的反射
3. `@Property` 注解用于通过 setter 注入

:::tip 注意
由于无法使用 `@Property` 定义默认值，因此如果该值不存在或无法转换为所需类型，则 bean 实例化将失败。
:::

相反，上面注入了从应用程序配置中解析的 `my.url` 属性的值。如果在配置中找不到属性，则会引发异常。与其他类型的注入一样，注入点也可以用 `@Nullable` 进行注解，以使注入成为可选的。

你也可以使用此功能来解析子 map。例如，考虑以下配置：

*application.yml 配置示例*

```yaml
datasources:
  default:
    name: 'mydb'
jpa:
  default:
    properties:
      hibernate:
        hbm2ddl:
          auto: update
        show_sql: true
```

要解析仅包含以 hibernate 开头的属性的展平 map，请使用 `@Property`，例如：

*@Property 示例*

```java
@Property(name = "jpa.default.properties")
Map<String, String> jpaProperties;
```

注入的映射将包含键 `hibernate.hbm2ddl.auto` 和 `hibernate.show_sql` 及其值。

:::note 提示
[@MapFormat](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/format/MapFormat.html) 注解可用于自定义注入的映射，具体取决于你想要嵌套键还是展开键，并且它允许通过 [StringConvention](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/naming/conventions/StringConvention.html) 枚举自定义键样式。
:::

## 4.4 配置属性

你可以通过创建用 [@ConfigurationProperties](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationProperties.html) 注解的类来创建类型安全配置。

Micronaut 将生成一个无反射的 `@ConfigurationProperties` bean，并在编译时计算要评估的属性路径，从而大大提高加载 `@ConfigurationProperties` 的速度和效率。

例如：

*@ConfigurationProperties 示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.ConfigurationProperties;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.util.Optional;

@ConfigurationProperties("my.engine") // (1)
public class EngineConfig {

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public int getCylinders() {
        return cylinders;
    }

    public void setCylinders(int cylinders) {
        this.cylinders = cylinders;
    }

    public CrankShaft getCrankShaft() {
        return crankShaft;
    }

    public void setCrankShaft(CrankShaft crankShaft) {
        this.crankShaft = crankShaft;
    }

    @NotBlank // (2)
    private String manufacturer = "Ford"; // (3)

    @Min(1L)
    private int cylinders;

    private CrankShaft crankShaft = new CrankShaft();

    @ConfigurationProperties("crank-shaft")
    public static class CrankShaft { // (4)

        private Optional<Double> rodLength = Optional.empty(); // (5)

        public Optional<Double> getRodLength() {
            return rodLength;
        }

        public void setRodLength(Optional<Double> rodLength) {
            this.rodLength = rodLength;
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.ConfigurationProperties

import javax.validation.constraints.Min
import javax.validation.constraints.NotBlank

@ConfigurationProperties('my.engine') // (1)
class EngineConfig {

    @NotBlank // (2)
    String manufacturer = "Ford" // (3)

    @Min(1L)
    int cylinders

    CrankShaft crankShaft = new CrankShaft()

    @ConfigurationProperties('crank-shaft')
    static class CrankShaft { // (4)
        Optional<Double> rodLength = Optional.empty() // (5)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.ConfigurationProperties
import java.util.Optional
import javax.validation.constraints.Min
import javax.validation.constraints.NotBlank

@ConfigurationProperties("my.engine") // (1)
class EngineConfig {

    @NotBlank // (2)
    var manufacturer = "Ford" // (3)

    @Min(1L)
    var cylinders: Int = 0

    var crankShaft = CrankShaft()

    @ConfigurationProperties("crank-shaft")
    class CrankShaft { // (4)
        var rodLength: Optional<Double> = Optional.empty() // (5)
    }
}
```

  </TabItem>
</Tabs>

1. `@ConfigurationProperties` 注解采用配置前缀
2. 你可以使用 `javax.validation` 注解来验证配置
3. 可以为特性指定默认值
4. 静态内部类可以提供嵌套配置
5. 可选配置值可以封装在 `java.util.Optional` 中

一旦你准备好了类型安全配置，就可以像任何其他 bean 一样将其注入到你的 bean 中：

*@ConfigurationProperties 依赖注入*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
public class EngineImpl implements Engine {
    private final EngineConfig config;

    public EngineImpl(EngineConfig config) { // (1)
        this.config = config;
    }

    @Override
    public int getCylinders() {
        return config.getCylinders();
    }

    @Override
    public String start() {// (2)
        return getConfig().getManufacturer() + " Engine Starting V" + getConfig().getCylinders() +
                " [rodLength=" + getConfig().getCrankShaft().getRodLength().orElse(6d) + "]";
    }

    public final EngineConfig getConfig() {
        return config;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
class EngineImpl implements Engine {
    final EngineConfig config

    EngineImpl(EngineConfig config) { // (1)
        this.config = config
    }

    @Override
    int getCylinders() {
        config.cylinders
    }

    @Override
    String start() { // (2)
        "$config.manufacturer Engine Starting V$config.cylinders [rodLength=${config.crankShaft.rodLength.orElse(6.0d)}]"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
class EngineImpl(val config: EngineConfig) : Engine {// (1)

    override val cylinders: Int
        get() = config.cylinders

    override fun start(): String {// (2)
        return "${config.manufacturer} Engine Starting V${config.cylinders} [rodLength=${config.crankShaft.rodLength.orElse(6.0)}]"
    }
}
```

  </TabItem>
</Tabs>

1. 注入 `EngineConfig` bean
2. 使用配置属性

然后可以从 [PropertySource](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/PropertySource.html) 实例之一提供配置值。例如：

*应用配置*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Map<String, Object> map = new LinkedHashMap<>(1);
map.put("my.engine.cylinders", "8");
ApplicationContext applicationContext = ApplicationContext.run(map, "test");

Vehicle vehicle = applicationContext.getBean(Vehicle.class);
System.out.println(vehicle.start());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
ApplicationContext applicationContext = ApplicationContext.run(
        ['my.engine.cylinders': '8'],
        "test"
)

def vehicle = applicationContext.getBean(Vehicle)
println(vehicle.start())
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val map = mapOf( "my.engine.cylinders" to "8")
val applicationContext = ApplicationContext.run(map, "test")

val vehicle = applicationContext.getBean(Vehicle::class.java)
println(vehicle.start())
```

  </TabItem>
</Tabs>

以上示例打印 `"Ford Engine Starting V8 [rodLength=6.0]"`

你可以直接引用 `@Requires` 注解中的配置财产，以使用以下语法有条件地加载 bean：`@Requires(bean=Config.class, beanProperty="property", value="true")`

注意，对于更复杂的配置，你可以通过继承来构造 [@ConfigurationProperties](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationProperties.html) bean。

例如，使用 `@ConfigurationProperties('bar')` 创建 `EngineConfig` 的子类将解析路径 `my.engine.bar` 下的所有属性。

### 包含/排除

对于配置属性类从父类继承属性的情况，可能需要从父类中排除属性。[@ConfigurationProperties](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationProperties.html) 注解的 `includes` 和 `excludes` 成员允许该功能。该列表适用于本地属性和继承的属性。

提供给包含/排除列表的名称必须是“属性”名称。例如，如果注入了一个 setter 方法，那么属性名称就是去大写的 setter 名称（`setConnectionTimeout` → `connectionTimeout`）。

---

### 变更访问器风格

从 3.3 开始，Micronaut 支持为 getter 和 setter 定义不同的访问器前缀，而不是为 JavaBeans 定义的默认 `get` 和 `set`。使用 [@AccessorsStyle](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/annotation/AccessorsStyle.html) 注解对 POJO 或 `@ConfigurationProperties` 类进行注解。

当你以流畅的方式编写 getter 和 setter 时，这很有用。例如：

*使用 `@AccessorsStyle`*

```java
import io.micronaut.context.annotation.ConfigurationProperties;
import io.micronaut.core.annotation.AccessorsStyle;

@AccessorsStyle(readPrefixes = "", writePrefixes = "") (1)
@ConfigurationProperties("my.engine")
public class EngineConfig {

    private String manufacturer;
    private int cylinders;

    public EngineConfig(String manufacturer, int cylinders) {
        this.manufacturer = manufacturer;
        this.cylinders = cylinders;
    }

    public String manufacturer() { (2)
        return manufacturer;
    }

    public void manufacturer(String manufacturer) { (2)
        this.manufacturer = manufacturer;
    }

    public int cylinders() { (2)
        return cylinders;
    }

    public void cylinders(int cylinders) { (2)
        this.cylinders = cylinders;
    }

}
```

1. Micronaut 将为 getter 和 setter 使用一个空前缀。
2. 使用空前缀定义 getter 和 setter。

现在，你可以注入 `EngineConfig`，并将其与 `engineConfig.manufacturer()` 和 `engineConfig.clinders()` 一起使用，以从配置中检索值。

---

### 属性类型转换

Micronaut 在解析属性时使用 [ConversionService](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/ConversionService.html) bean 转换值。通过定义实现 [TypeConverter](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/TypeConverter.html) 接口的 bean，可以为Micronaut不支持的类型注册其他转换器。

Micronaut 具有一些有用的内置转换功能，具体如下。

**周期转换**

可以通过在单位后面附加一个数字来指定工期。支持的单位为 `s`、`ms`、`m` 等。下表总结了示例：

*表 1. 周期转换*

|配置值|结果值|
|--|--|
|10ms|10 毫秒周期|
|10m|10 分钟周期|
|10s|10 秒周期|
|10d|10 天周期|
|10h|10 小时周期|
|10ns|10 纳秒周期|
|PT15M|使用 ISO-8601 格式的 15 分钟周期|

例如，要配置默认的 HTTP 客户端读取超时：

*使用周期值*

```yaml
micronaut:
  http:
    client:
      read-timeout: 15s
```

**列表/数组转换**

列表和数组可以在 Java 属性文件中指定为逗号分隔的值，也可以在 YAML 中使用本地 YAML 列表。泛型类型用于转换值。例如，在 YAML 中：

*在 YAML 中特定的列表或数组*

```yaml
my:
  app:
    integers:
      - 1
      - 2
    urls:
      - http://foo.com
      - http://bar.com
```

或 Java 属性文件格式：

*在 Java 属性中指定以逗号分隔的列表或数组*

```yaml
my.app.integers=1,2
my.app.urls=http://foo.com,http://bar.com
```

或者，你可以使用索引：

*使用索引指定 Java 属性中的列表或数组*

```yaml
my.app.integers[0]=1
my.app.integers[1]=2
```

对于上述示例配置，你可以使用泛型提供的目标类型定义要绑定的属性：

```java
List<Integer> integers;
List<URL> urls;
```

**可读字节**

你可以用 [@ReadableBytes](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/format/ReadableBytes.html) 注解任何 setter 参数，以允许使用指定字节、千字节等的简写语法来设置值。例如，以下内容取自 [HttpClientConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/HttpClientConfiguration.html)：

*使用 `@ReadableBytes`*

```java
public void setMaxContentLength(@ReadableBytes int maxContentLength) {
    this.maxContentLength = maxContentLength;
}
```

有了以上内容，你可以使用以下值设置 `micronaut.http.client.max-content-length`：

*表 2.@ReadableBytes 转换*

|配置值|结果值|
|--|--|
|10mb|10 兆字节|
|10kb|10 千字节|
|10gb|10 十亿字节|
|1024|原始字节长度|

**格式化日期**

在 setter 上可以使用 [@Format](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/format/Format.html) 注解来指定绑定 `java.time` 日期对象时要使用的日期格式。

*对日期使用 `@Format`*

```java
public void setMyDate(@Format("yyyy-MM-dd") LocalDate date) {
    this.myDate = date;
}
```

---

### 配置构造器

许多框架和工具已经使用构造器风格的类来构建配置。

你可以使用 [@ConfigurationBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationBuilder.html) 注解来用配置值填充生成器样式类。[ConfigurationBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationBuilder.html) 可以应用于用 [@ConfigurationProperties](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationProperties.html) 注解的类中的字段或方法。

由于在 Java 世界中没有一致的方法来定义构造器，因此可以在注解中指定一个或多个方法前缀，以支持像 `withXxx` 或 `setXxx` 这样的构造器方法。如果构造器方法没有前缀，请为参数指定一个空字符串。

还可以指定配置前缀来告诉 Micronaut 在哪里查找配置值。默认情况下，构建器方法使用类级别 [@ConfigurationProperties](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationProperties.html) 注解中指定的配置前缀。

例如：

*@ConfigurationBuilder 示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.ConfigurationBuilder;
import io.micronaut.context.annotation.ConfigurationProperties;

@ConfigurationProperties("my.engine") // (1)
class EngineConfig {

    @ConfigurationBuilder(prefixes = "with") // (2)
    EngineImpl.Builder builder = EngineImpl.builder();

    @ConfigurationBuilder(prefixes = "with", configurationPrefix = "crank-shaft") // (3)
    CrankShaft.Builder crankShaft = CrankShaft.builder();

    private SparkPlug.Builder sparkPlug = SparkPlug.builder();

    SparkPlug.Builder getSparkPlug() {
        return sparkPlug;
    }

    @ConfigurationBuilder(prefixes = "with", configurationPrefix = "spark-plug") // (4)
    void setSparkPlug(SparkPlug.Builder sparkPlug) {
        this.sparkPlug = sparkPlug;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.ConfigurationBuilder
import io.micronaut.context.annotation.ConfigurationProperties

@ConfigurationProperties('my.engine') // (1)
class EngineConfig {

    @ConfigurationBuilder(prefixes = "with") // (2)
    EngineImpl.Builder builder = EngineImpl.builder()

    @ConfigurationBuilder(prefixes = "with", configurationPrefix = "crank-shaft") // (3)
    CrankShaft.Builder crankShaft = CrankShaft.builder()

    SparkPlug.Builder sparkPlug = SparkPlug.builder()

    @ConfigurationBuilder(prefixes = "with", configurationPrefix = "spark-plug") // (4)
    void setSparkPlug(SparkPlug.Builder sparkPlug) {
        this.sparkPlug = sparkPlug
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.ConfigurationBuilder
import io.micronaut.context.annotation.ConfigurationProperties

@ConfigurationProperties("my.engine") // (1)
internal class EngineConfig {

    @ConfigurationBuilder(prefixes = ["with"])  // (2)
    val builder = EngineImpl.builder()

    @ConfigurationBuilder(prefixes = ["with"], configurationPrefix = "crank-shaft") // (3)
    val crankShaft = CrankShaft.builder()

    @set:ConfigurationBuilder(prefixes = ["with"], configurationPrefix = "spark-plug") // (4)
    var sparkPlug = SparkPlug.builder()
}
```

  </TabItem>
</Tabs>

1. `@ConfigurationProperties` 注解采用配置前缀
2. 可以在没有类配置前缀的情况下配置第一构造器；它继承了上面的内容。
3. 第二个构造器可以用类配置前缀 + `configurationPrefix` 值进行配置。
4. 第三个构造器演示了注解既可以应用于方法，也可以应用于属性。

:::tip 注意
默认情况下，只支持单参数生成器方法。对于没有参数的方法，请将注解的 `allowZeroArgs` 参数设置为 `true`。
:::

与前面的例子一样，我们可以构造一个 `EngineImpl`。由于我们使用的是构造器，所以我们可以使用工厂类从构造器中构建引擎。

*工厂 Bean*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Factory;

import jakarta.inject.Singleton;

@Factory
class EngineFactory {

    @Singleton
    EngineImpl buildEngine(EngineConfig engineConfig) {
        return engineConfig.builder.build(engineConfig.crankShaft, engineConfig.getSparkPlug());
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Factory

import jakarta.inject.Singleton

@Factory
class EngineFactory {

    @Singleton
    EngineImpl buildEngine(EngineConfig engineConfig) {
        engineConfig.builder.build(engineConfig.crankShaft, engineConfig.sparkPlug)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Factory
import jakarta.inject.Singleton

@Factory
internal class EngineFactory {

    @Singleton
    fun buildEngine(engineConfig: EngineConfig): EngineImpl {
        return engineConfig.builder.build(engineConfig.crankShaft, engineConfig.sparkPlug)
    }
}
```

  </TabItem>
</Tabs>

然后，可以在需要发动机的任何地方将返回的发动机进行注入。

可以从 [PropertySource](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/env/PropertySource.html) 实例之一提供配置值。例如：

*应用配置*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
        Map<String, Object> properties = new HashMap<>();
        properties.put("my.engine.cylinders"             ,"4");
        properties.put("my.engine.manufacturer"          , "Subaru");
        properties.put("my.engine.crank-shaft.rod-length", 4);
        properties.put("my.engine.spark-plug.name"       , "6619 LFR6AIX");
        properties.put("my.engine.spark-plug.type"       , "Iridium");
        properties.put("my.engine.spark-plug.companyName", "NGK");
        ApplicationContext applicationContext = ApplicationContext.run(properties, "test");

        Vehicle vehicle = applicationContext.getBean(Vehicle.class);
        System.out.println(vehicle.start());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
        ApplicationContext applicationContext = ApplicationContext.run(
                ['my.engine.cylinders'             : '4',
                 'my.engine.manufacturer'          : 'Subaru',
                 'my.engine.crank-shaft.rod-length': 4,
                 'my.engine.spark-plug.name'       : '6619 LFR6AIX',
                 'my.engine.spark-plug.type'       : 'Iridium',
                 'my.engine.spark-plug.companyName': 'NGK'
                ],
                "test"
        )

        Vehicle vehicle = applicationContext.getBean(Vehicle)
        println(vehicle.start())
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
        val applicationContext = ApplicationContext.run(
                mapOf(
                        "my.engine.cylinders" to "4",
                        "my.engine.manufacturer" to "Subaru",
                        "my.engine.crank-shaft.rod-length" to 4,
                        "my.engine.spark-plug.name" to "6619 LFR6AIX",
                        "my.engine.spark-plug.type" to "Iridium",
                        "my.engine.spark-plug.company" to "NGK"
                ),
                "test"
        )

        val vehicle = applicationContext.getBean(Vehicle::class.java)
        println(vehicle.start())
```

  </TabItem>
</Tabs>

以上示例打印：`"Subaru Engine Starting V4 [rodLength=4.0, sparkPlug=Iridium(NGK 6619 LFR6AIX)]"`

---

### MapFormat

对于某些用例，可能需要接受可提供给 bean 的任意配置属性的 map，特别是如果 bean 代表第三方 API，其中并非所有可能的配置属性都已知。例如，数据源可以接受特定于特定数据库驱动程序的配置属性 map，允许用户在 map 中指定任何所需的选项，而无需显式编码每个属性。

为此，使用 [MapFormat](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/format/MapFormat.html) 注解可以将映射绑定到单个配置属性，并指定是接受键到值的平面 map，还是接受嵌套 map（其中值可以是其他 map）。

*@MapFormat 格式*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.ConfigurationProperties;
import io.micronaut.core.convert.format.MapFormat;

import javax.validation.constraints.Min;
import java.util.Map;

@ConfigurationProperties("my.engine")
public class EngineConfig {

    @Min(1L)
    private int cylinders;

    @MapFormat(transformation = MapFormat.MapTransformation.FLAT) //(1)
    private Map<Integer, String> sensors;

    public int getCylinders() {
        return cylinders;
    }

    public void setCylinders(int cylinders) {
        this.cylinders = cylinders;
    }

    public Map<Integer, String> getSensors() {
        return sensors;
    }

    public void setSensors(Map<Integer, String> sensors) {
        this.sensors = sensors;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.ConfigurationProperties
import io.micronaut.core.convert.format.MapFormat

import javax.validation.constraints.Min

@ConfigurationProperties('my.engine')
class EngineConfig {

    @Min(1L)
    int cylinders

    @MapFormat(transformation = MapFormat.MapTransformation.FLAT) //(1)
    Map<Integer, String> sensors
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.ConfigurationProperties
import io.micronaut.core.convert.format.MapFormat
import javax.validation.constraints.Min

@ConfigurationProperties("my.engine")
class EngineConfig {

    @Min(1L)
    var cylinders: Int = 0

    @MapFormat(transformation = MapFormat.MapTransformation.FLAT) //(1)
    var sensors: Map<Int, String>? = null
}
```

  </TabItem>
</Tabs>

1. 注意注解中的 `transformation` 参数；可能的值为 `MapTransformation.FLAT`（用于平面 map）和 `MapTransformation.NESTED`（用于嵌套 map）

*EngineImpl*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
public class EngineImpl implements Engine {

    @Inject
    EngineConfig config;

    @Override
    public Map getSensors() {
        return config.getSensors();
    }

    @Override
    public String start() {
        return "Engine Starting V" + getConfig().getCylinders() +
               " [sensors=" + getSensors().size() + "]";
    }

    public EngineConfig getConfig() {
        return config;
    }

    public void setConfig(EngineConfig config) {
        this.config = config;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
class EngineImpl implements Engine {

    @Inject EngineConfig config

    @Override
    Map getSensors() {
        config.sensors
    }

    @Override
    String start() {
        "Engine Starting V$config.cylinders [sensors=${sensors.size()}]"
    }
} 
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
class EngineImpl : Engine {

    override val sensors: Map<*, *>?
        get() = config!!.sensors

    @Inject
    var config: EngineConfig? = null

    override fun start(): String {
        return "Engine Starting V${config!!.cylinders} [sensors=${sensors!!.size}]"
    }
}
```

  </TabItem>
</Tabs>

现在可以向 `my.engine.sensors` 配置属性提供属性的 map。

*使用 Map 配置*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Map<String, Object> map = new LinkedHashMap<>(2);
map.put("my.engine.cylinders", "8");

Map<Integer, String> map1 = new LinkedHashMap<>(2);
map1.put(0, "thermostat");
map1.put(1, "fuel pressure");

map.put("my.engine.sensors", map1);

ApplicationContext applicationContext = ApplicationContext.run(map, "test");

Vehicle vehicle = applicationContext.getBean(Vehicle.class);
System.out.println(vehicle.start());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
ApplicationContext applicationContext = ApplicationContext.run(
        ['my.engine.cylinders': '8',
         'my.engine.sensors'  : [0: 'thermostat',
                                 1: 'fuel pressure']],
        "test"
)

def vehicle = applicationContext.getBean(Vehicle)
println(vehicle.start())
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val subMap = mapOf(
    0 to "thermostat",
    1 to "fuel pressure"
)
val map = mapOf(
    "my.engine.cylinders" to "8",
    "my.engine.sensors" to subMap
)

val applicationContext = ApplicationContext.run(map, "test")

val vehicle = applicationContext.getBean(Vehicle::class.java)
println(vehicle.start())
```

  </TabItem>
</Tabs>

以上例子打印：`"Engine Starting V8 [sensors=2]"`

## 4.5 自定义类型转换器

Micronaut 包括一个可扩展的类型转换机制。要添加额外的类型转换器，你需要注册类型为 [TypeConverter](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/TypeConverter.html) 的 bean。

以下示例显示了如何使用内置转换器之一（映射到对象）或创建自己的转换器。

请考虑以下 [ConfigurationProperties](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ConfigurationProperties.html)：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
private static ApplicationContext ctx;

@BeforeClass
public static void setupCtx() {
    ctx = ApplicationContext.run(
            new LinkedHashMap<String, Object>() {{
                put("myapp.updatedAt", // (1)
                        new LinkedHashMap<String, Integer>() {{
                            put("day", 28);
                            put("month", 10);
                            put("year", 1982);
                        }}
                );
            }}
    );
}

@AfterClass
public static void teardownCtx() {
    if(ctx != null) {
        ctx.stop();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@AutoCleanup
@Shared
ApplicationContext ctx = ApplicationContext.run(
        "myapp.updatedAt": [day: 28, month: 10, year: 1982]  // (1)
)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
lateinit var ctx: ApplicationContext

@BeforeEach
fun setup() {
    ctx = ApplicationContext.run(
        mapOf(
            "myapp.updatedAt" to mapOf( // (1)
                "day" to 28,
                "month" to 10,
                "year" to 1982
            )
        )
    )
}

@AfterEach
fun teardown() {
    ctx?.close()
}
```

  </TabItem>
</Tabs>

1. 注意我们如何在上面的 `MyConfigurationProperties` 类中匹配 `myapp` 前缀和 `updatedAt` 属性名称

默认情况下，这将不起作用，因为没有从 `Map` 到 `LocalDate` 的内置转换。要解决此问题，请定义一个自定义 [TypeConverter](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/TypeConverter.html)：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.convert.ConversionContext;
import io.micronaut.core.convert.ConversionService;
import io.micronaut.core.convert.TypeConverter;

import jakarta.inject.Singleton;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Singleton
public class MapToLocalDateConverter implements TypeConverter<Map, LocalDate> { // (1)
    @Override
    public Optional<LocalDate> convert(Map propertyMap, Class<LocalDate> targetType, ConversionContext context) {
        Optional<Integer> day = ConversionService.SHARED.convert(propertyMap.get("day"), Integer.class);
        Optional<Integer> month = ConversionService.SHARED.convert(propertyMap.get("month"), Integer.class);
        Optional<Integer> year = ConversionService.SHARED.convert(propertyMap.get("year"), Integer.class);
        if (day.isPresent() && month.isPresent() && year.isPresent()) {
            try {
                return Optional.of(LocalDate.of(year.get(), month.get(), day.get())); // (2)
            } catch (DateTimeException e) {
                context.reject(propertyMap, e); // (3)
                return Optional.empty();
            }
        }

        return Optional.empty();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.convert.ConversionContext
import io.micronaut.core.convert.ConversionService
import io.micronaut.core.convert.TypeConverter

import jakarta.inject.Singleton
import java.time.DateTimeException
import java.time.LocalDate

@Singleton
class MapToLocalDateConverter implements TypeConverter<Map, LocalDate> { // (1)
    @Override
    Optional<LocalDate> convert(Map propertyMap, Class<LocalDate> targetType, ConversionContext context) {
        Optional<Integer> day = ConversionService.SHARED.convert(propertyMap.day, Integer)
        Optional<Integer> month = ConversionService.SHARED.convert(propertyMap.month, Integer)
        Optional<Integer> year = ConversionService.SHARED.convert(propertyMap.year, Integer)
        if (day.present && month.present && year.present) {
            try {
                return Optional.of(LocalDate.of(year.get(), month.get(), day.get())) // (2)
            } catch (DateTimeException e) {
                context.reject(propertyMap, e) // (3)
                return Optional.empty()
            }
        }
        return Optional.empty()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.convert.ConversionContext
import io.micronaut.core.convert.ConversionService
import io.micronaut.core.convert.TypeConverter
import java.time.DateTimeException
import java.time.LocalDate
import java.util.Optional
import jakarta.inject.Singleton

@Singleton
class MapToLocalDateConverter : TypeConverter<Map<*, *>, LocalDate> { // (1)
    override fun convert(propertyMap: Map<*, *>, targetType: Class<LocalDate>, context: ConversionContext): Optional<LocalDate> {
        val day = ConversionService.SHARED.convert(propertyMap["day"], Int::class.java)
        val month = ConversionService.SHARED.convert(propertyMap["month"], Int::class.java)
        val year = ConversionService.SHARED.convert(propertyMap["year"], Int::class.java)
        if (day.isPresent && month.isPresent && year.isPresent) {
            try {
                return Optional.of(LocalDate.of(year.get(), month.get(), day.get())) // (2)
            } catch (e: DateTimeException) {
                context.reject(propertyMap, e) // (3)
                return Optional.empty()
            }
        }

        return Optional.empty()
    }
}
```

  </TabItem>
</Tabs>

1. 该类实现了 [TypeConverter](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/TypeConverter.html)，它有两个泛型参数，一个是从中转换的类型，另一个是转换为的类型
2. 实现委托给默认的共享转换服务，以转换用于创建 `LocalDate` 的 Map 中的值
3. 如果绑定过程中发生异常，请调用 `reject(..)`，它会将附加信息传播到容器



> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#config)

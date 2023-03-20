---
sidebar_position: 30
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

- [AWS Secrets Manager](https://micronaut-projects.github.io/micronaut-aws/latest/guide/#secretsmanager)
- [Google Cloud Secrets Manager](https://micronaut-projects.github.io/micronaut-gcp/latest/guide/#secretManager)
- [HashiCorp Vault](https://docs.micronaut.io/latest/guide/#distributedConfigurationVault)
- [Kubernetes Secrets](https://micronaut-projects.github.io/micronaut-kubernetes/latest/guide/index.html#config-client)
- [Oracle Cloud Vault](https://micronaut-projects.github.io/micronaut-oracle-cloud/latest/guide/#vault)

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

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#config)

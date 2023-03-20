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

活动环境名称允许根据环境加载不同的配置文件，还可以使用 [@Requires](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Requires.html) 注释有条件地加载 bean 或 bean [@Configuration](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/Configuration.html) 包。

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

要设置默认环境，请包含一个实现 [ApplicationContextConfigurer](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/ApplicationContextConfigurer.html) 并用 [ContextConfigurer](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/annotation/ContextConfigurer.html) 进行注释的公共静态类：

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

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#config)

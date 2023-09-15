---
description: Micronaut Groovy
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut Groovy,Groovy,java,maven,kotlin]
---

# Micronaut Groovy

增强 Micronaut 和 Groovy 语言体验的项目。

## 1. 简介

该项目包括各种子项目，以改善 Groovy 用户的 Micronaut 体验。

## 2. 发布历史

对于此项目，你可以在这里找到一个发布列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-groovy/releases

## 3. Groovy 配置

`micronaut-runtime-groovy` 模块增加了使用 Groovy 来定义配置的能力。

要使用这个模块，请将 `micronaut-runtime-groovy` 添加到你的构建配置中：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.groovy:micronaut-runtime-groovy")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.groovy</groupId>
    <artifactId>micronaut-runtime-groovy</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后你可以在 `src/main/resources/application.groovy` 中以 [ConfigSlurper](http://docs.groovy-lang.org/latest/html/gapi/groovy/util/ConfigSlurper.html) 格式定义配置 Groovy 配置。由于 `ConfigSlurper` 配置文件中的属性名称必须是有效的 Groovy 标识符，且不能包含破折号，因此你可以通过将其转换为驼峰或蛇形风格来指定配置项。

*application.groovy*

```groovy
//set server-url property
serverUrl = "https://localhost:8080"
//alternatively
server_url = "https://localhost:8080"
```

## 4. Groovy 函数

`micronaut-function-groovy` 增加了将 Serverless 函数定义为 Groovy 脚本的能力。

:::note 提示
如果你安装了 Micronaut CLI，你可以用 `mn creat-function hello-world --lang groovy` 快速创建一个 Groovy 函数。
:::

首先，添加 `function-groovy` 依赖（而不是提供者特定的依赖），它提供了额外的 AST 转换，使编写函数更加简单。例如，在 `build.gradle` 中：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.groovy:micronaut-function-groovy")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.groovy</groupId>
    <artifactId>micronaut-function-groovy</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

现在你可以在 `src/main/groovy` 下将你的函数创建为 Groovy 脚本。你将把你项目的**主**类属性设置为这个函数（而不是像 Java/Kotlin 中的 `FunctionApplication`）。比如：

*示例 build.gradle*

```groovy
mainClassName = "example.HelloGroovyFunction"
```

*HelloGroovyFunction.groovy*

```groovy
String hello(String name) {
    "Hello ${name}!"
}
```

你定义的函数应遵循以下规则：
1. 定义的输入不超过2个
2. 使用 Java 原生或简单类型或 POJO 作为参数和返回值

为了在你的 Groovy 函数中使用依赖注入，除了 `@Inject` 注解外，还要使用 `groovy.transform.Field` 注解变换。

*HelloGroovyFunction.groovy*

```groovy
import groovy.transform.Field
import javax.inject.Inject

@Field @Inject HelloService helloService

String hello(String name) {
    helloService.hello(name)
}
```

## 5. GROM 模块

该表总结了 GORM 模块和你应该添加到你的构建中以启用它们的依赖。

*表 1.数据访问配置模块*

|依赖|描述|
|--|--|
|io.micronaut.groovy:micronaut-hibernate-gorm|为 Groovy 应用程序配置 [Hibernate 的 GORM](http://gorm.grails.org/latest/hibernate/manual)|
|io.micronaut.groovy:micronaut-mongo-gorm|为 Groovy 应用程序配置 [MongoDB 的 GORM](http://gorm.grails.org/latest/mongodb/manual)|
|io.micronaut.groovy:micronaut-neo4j-gorm|为 Groovy 应用程序配置 [Neo4j 的 GORM](http://gorm.grails.org/latest/neo4j/manual)|

### 为 Hibernate 使用 GORM

:::note 提示
*使用 CLI*

 如果你使用 Micronaut CLI 创建你的项目，提供 `hibernate-gorm` 功能，在你的项目中包括 GORM，一个基本的连接池配置，和一个默认的 H2 数据库驱动：

 ```bash
 $ mn create-app my-app --features hibernate-gorm
 ```
:::

对于 Groovy 用户和熟悉 Grails 框架的用户，GORM 对 Hibernate 的特殊支持是可用的。要使用 [Hibernate 的 GROM](http://gorm.grails.org/)，你不应该包括 Micronaut 的内置 SQL 支持或 `hibernate-jpa` 依赖，因为 GORM 本身负责创建 `DataSource`、`SessionFactory` 等。

相反，你只需要在你的项目中包括 `hibernate-gorm` 依赖，一个连接池的实现，以及所需的 JDBC 驱动。比如说：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.groovy:micronaut-hibernate-gorm")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.groovy</groupId>
    <artifactId>micronaut-hibernate-gorm</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

你可能想添加一个连接池的实现，并可能添加 `h2` 数据库进行内存测试：

*为 Hibernate 配置 GORM*

```groovy
  // Use Tomcat connection pool
  runtime 'org.apache.tomcat:tomcat-jdbc'
  // Use H2 database driver
  runtime  'com.h2database:h2'
```

现在你可以使用 [GORM 文档中描述的相同配置属性](http://gorm.grails.org/latest/hibernate/manual/index.html#configuration)。比如说：

*为 Hibernate 配置 GORM*

```yaml
dataSource:
    pooled: true
    dbCreate: create-drop
    url: jdbc:h2:mem:devDb
    driverClassName: org.h2.Driver
    username: sa
    password:
hibernate:
    cache:
        queries: false
        use_second_level_cache: true
        use_query_cache: false
        region.factory_class: org.hibernate.cache.ehcache.EhCacheRegionFactory
```

关于在 Micronaut 中为 Hibernate 使用 GORM，应该注意以下几点：
- 你希望成为 GORM 实体的每一个类都应该用 `grails.gorm.annotation.Entity` 注解来注解。
- 每个与 GORM 交互的方法都应该用 GORM 的 `grails.gorm.transactions.Transactional` 注解，以确保有一个会话存在。你也可以在类中添加 `@Transactional` 注解。
- 默认情况下，Micronaut 将扫描与你的应用程序类相关的实体。如果你想自定义，在启动你的应用程序时通过 [ApplicationContextBuilder](https://docs.micronaut.io/latest/api/io/micronaut/context/ApplicationContextBuilder.html) 指定额外的包。

**包扫描**

例如，如果你所有的 GORM 实体都在 `package example.micronaut.entities` 中。

替代：

```groovy
import io.micronaut.runtime.Micronaut
import groovy.transform.CompileStatic

@CompileStatic
class Application {
    static void main(String[] args) {
        Micronaut.run(Application)
    }
}
```

使用：

```groovy
import io.micronaut.runtime.Micronaut
import groovy.transform.CompileStatic

@CompileStatic
class Application {
    static void main(String[] args) {
        Micronaut.build(args)
                .packages("example.micronaut.entities")
                .mainClass(Application.class)
                .start()
    }
}
```

在测试中，如果你手动开始一个 `ApplicationContext`，使用：

```groovy
class BookServiceSpec extends Specification {

    @AutoCleanup
    @Shared
    ApplicationContext applicationContext = ApplicationContext.build()
            .packages("example.micronaut.entities")
            .build()
            .start()

    @Shared
    @Subject
    BookService bookService = applicationContext.getBean(BookService)
```

在测试中，如果你使用 `@MicronautTest`，请使用：

```groovy
@MicronautTest(packages = "example.micronaut.entities")
class MicronautTestBookServiceSpec extends Specification {

    @Inject
    BookService bookService
```

---

### 为 MongoDB 使用 GORM

:::note 提示
*使用 CLI*

如果你正在使用 Micronaut CLI 创建你的项目，提供 `mongo-gorm` 功能，在你的项目中为 MongoDB 配置 GORM：

```bash
$ mn create-app my-app --features mongo-gorm
```

:::

对于 Groovy 用户和熟悉 Grails 的用户，Micronaut 已经添加了对使用 [MongoDB 的 GORM](http://gorm.grails.org/latest/mongodb/manual) 的特别支持。

要添加对 MongoDB 的 GORM 的支持，首先按照本指南前面的说明配置 MongoDB 连接，然后在你的应用程序中添加以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.groovy:micronaut-mongo-gorm")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.groovy</groupId>
    <artifactId>micronaut-mongo-gorm</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

:::caution 警告
对于 MongoDB 的 GORM，你将需要单独配置数据库名称，作为 `application.yml` 中的 `grails.mongodb.datataseName` 属性。
:::

关于在Micronaut中为MongoDB使用GORM，应该注意以下几点：
- 你希望成为 GORM 实体的每个类都应该用 `grails.gorm.annotation.Entity` 注解。
- 每个与 GOR M交互的方法都应该用 GORM 的 `grails.gorm.transaction.Transactional` 注解，以确保有一个会话存在。你也可以在类中添加 `@Transactional` 注解。
- 默认情况下，Micronaut将扫描与你的应用程序类相关的实体。如果你想自定义，在启动你的应用程序时通过 [ApplicationContextBuilder](https://docs.micronaut.io/latest/api/io/micronaut/context/ApplicationContextBuilder.html) 指定额外的包。

---

### 为 Neo4j 使用 GORM

:::note 提示
*使用 CLI*

如果你是使用 Micronaut CLI 创建你的项目，提供 `neo4j-gorm` 功能，在你的项目中为 Neo4j 配置 GORM：

```bash
$ mn create-app my-app --features neo4j-gorm
```

:::

对于 Groovy 用户和熟悉 Grails 的用户，Micronaut 已经添加了对使用 [Neo4j 的 GORM](http://gorm.grails.org/latest/neo4j/manual) 的特别支持。

要添加对 Neo4j 的 GORM 支持，首先按照本指南前面的说明配置 Neo4j 连接，然后在你的应用程序中添加以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.groovy:micronaut-neo4j-gorm")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.groovy</groupId>
    <artifactId>micronaut-neo4j-gorm</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

关于在 Micronaut 中为 Neo4j 使用 GORM，应该注意以下几点：
- 你希望成为GORM实体的每一个类都应该用 `grails.gorm.annotation.Entity` 注解。
- 每个与GORM交互的方法都应该用 GORM 的 `grails.gorm.transaction.Transactional` 注解，以确保有一个会话存在。你也可以在类中添加  `@Transactional` 注解。
- 默认情况下，Micronaut 将扫描与你的应用程序类相关的实体。如果你想自定义，在启动你的应用程序时通过 [ApplicationContextBuilder](https://micronaut-projects.github.io/micronaut-groovy/latest/api/io/micronaut/context/ApplicationContextBuilder.html) 指定额外的包。

### 5.1 多租户 GORM

GORM 支持多租户并与 Micronaut 多租户支持集成。

要使用 Micronaut 和 GORM 的多租户功能，你必须在 classpath 上有 multitenancy-gorm 的依赖。例如，在 build.gradle 中：

*build.gradle*

```groovy
compile "io.micronaut.configuration:micronaut-multitenancy-gorm"
```

GORM 是一个强大的基于 Groovy 的数据访问工具包，用于 JVM，实现了多种数据访问技术（Hibernate、Neo4j、MongoDB、GraphQL ……）。

GORM支持以下不同的多租户模式：

- `DATABASE` —— 一个单独的数据库与一个单独的连接池被用来存储每个租户的数据。
- `SCHEMA` —— 相同的数据库，但不同的模式被用来存储每个租户的数据。
- `DISCRIMINATOR` —— 同一个数据库，使用鉴别器来划分和隔离数据。


为了使用 GORM —— 多租户，你将需要配置以下属性：`grails.gorm.multiTenancy.mode` 和 `grails.gorm.multiTenancy.tenantResolverClass`。

Micronaut 对多租户的支持与 GORM集成。

下表包含了所有与 `multitenancy-gorm` 模块一起发出的 `TenantResolver` 实现，且开箱可用。


|名字|描述|
|--|--|
|[CookieTenantResolver](https://micronaut-projects.github.io/micronaut-groovy/latest/api/io/micronaut/multitenancy/gorm/CookieTenantResolver.html)|从一个 HTTP cookie 中解析当前租户。|
|[FixedTenantResolver](https://micronaut-projects.github.io/micronaut-groovy/latest/api/io/micronaut/multitenancy/gorm/FixedTenantResolver.html)|针对一个固定的租户 id 进行解析|
|[HttpHeaderTenantResolver](https://micronaut-projects.github.io/micronaut-groovy/latest/api/io/micronaut/multitenancy/gorm/HttpHeaderTenantResolver.html)|从请求的 HTTP 头中解析当前租户。|
|[PrincipalTenantResolver](https://micronaut-projects.github.io/micronaut-groovy/latest/api/io/micronaut/multitenancy/gorm/PrincipalTenantResolver.html)|从认证的用户名中解析当前租户。|
|[SessionTenantResolver](https://micronaut-projects.github.io/micronaut-groovy/latest/api/io/micronaut/multitenancy/gorm/SessionTenantResolver.html)|从 HTTP 会话中的解析当前租户。|
|[SubdomainTenantResolver](https://micronaut-projects.github.io/micronaut-groovy/latest/api/io/micronaut/multitenancy/gorm/SubdomainTenantResolver.html)|从子域中解析租户 id。|
|[SystemPropertyTenantResolver](https://micronaut-projects.github.io/micronaut-groovy/latest/api/io/micronaut/multitenancy/gorm/SystemPropertyTenantResolver.html)|从一个系统属性中解析租户 id。|

你将需要在你的应用程序配置中添加类似以下代码的东西：

```yaml
grails:
    gorm:
        multiTenancy:
            mode: DISCRIMINATOR
            tenantResolverClass: 'io.micronaut.multitenancy.gorm.PrincipalTenantResolver'
```

请阅读 [GORM 多租户文档](http://gorm.grails.org/latest/hibernate/manual/index.html#multiTenancy)以了解更多信息

## 6. 仓库

你可以在这个仓库中找到这个项目的源代码：

https://github.com/micronaut-projects/micronaut-groovy

> [英文链接](https://micronaut-projects.github.io/micronaut-groovy/latest/guide/index.html)

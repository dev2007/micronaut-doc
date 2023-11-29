---
sidebar_position: 90
---

# 9 Micronaut Data 如何工作

Micronaut Data 使用 [Micronaut](https://micronaut.io/) 的两个关键特性：[TypeElementVisitor](https://docs.micronaut.io/latest/api/io/micronaut/inject/visitor/TypeElementVisitor.html) API 和 Introduction Advice。

Micronaut Data 定义了一个 [RepositoryTypeElementVisitor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/processor/visitors/RepositoryTypeElementVisitor.html)，它能在编译时访问源代码树中用 [@Repository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Repository.html) 注解的所有接口。

`RepositoryTypeElementVisitor` 使用服务加载器加载所有可用的 [MethodCandidate](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/processor/visitors/finders/MethodCandidate.html) 实现并遍历它们。

:::note 提示
你可以通过创建一个依赖于 `micronaut-data-processor` 的库，并为候选方法定义 `META-INF/services` 来添加其他候选方法。新库应添加到注解处理器路径中。
:::

`MethodCandidate` 接口有一个 `isMethodMatch` 方法，可以匹配一个 [MethodElement](https://docs.micronaut.io/latest/api/io/micronaut/inject/ast/MethodElement.html)。一旦方法元素匹配成功，`MethodCandidate` 的 `buildMatchInfo` 方法就会被调用，并返回一个 [MethodMatchInfo](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/processor/visitors/finders/MethodMatchInfo.html) 实例。

`MethodMatchInfo` 的构造函数允许指定要执行的运行时 [DataInterceptor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/intercept/DataInterceptor.html)（通常根据所需的返回类型和行为而有所不同），以及一个可选的 [Query](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/Query.html) 实例（代表要执行的查询的查询模型）。

`RepositoryTypeElementVisitor` 接收 `MethodMatchInfo`，并使用 [@Repository](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/annotation/Repository.html) 注解配置的 [QueryBuilder](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/builder/QueryBuilder.html) 将 [Query](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/model/query/Query.html) 实例转换为等效的基于字符串的查询（如 JPA-QL）。

运行时方法参数和命名的查询参数之间也会创建绑定。

被访问的 `MethodElement` 会动态注解以下信息：

- 构建的基于字符串的查询（例如 JPA-QL）
- 参数绑定（包含查询中作为键的命名参数和作为值的方法参数名称的映射）
- 运行时要执行的 [DataInterceptor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/intercept/DataInterceptor.html)。

在运行时，[DataInterceptor](https://micronaut-projects.github.io/micronaut-data/latest/api/io/micronaut/data/intercept/DataInterceptor.html) 所要做的就是检索查询、使用参数绑定读取方法参数值并执行查询。

> [英文链接](https://micronaut-projects.github.io/micronaut-data/latest/guide/#howItWorks)

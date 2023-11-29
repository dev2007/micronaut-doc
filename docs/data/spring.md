---
sidebar_position: 110
---

# 11. Spring Data 支持

Micronaut Data 具有通过 `micronaut-data-spring` 依赖提供的一般 Spring 支持：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.data:micronaut-data-spring")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.data</groupId>
    <artifactId>micronaut-data-spring</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

除了这个依赖外，你还需要在 classpath 上添加 `spring-orm`（用于 Hibernate）或 `spring-jdbc`（用于 JDBC），以支持基于 Spring 的事务管理：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("org.springframework:spring-orm:5.2.0.RELEASE")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-orm</artifactId>
    <version>5.2.0.RELEASE</version>
</dependency>
```

  </TabItem>
</Tabs>

然后，您可以编译现有的 Spring Data 仓库接口，并在应用程序中使用 Spring 注解，如 `org.springframework.transaction.annotation.Transactional`。

您可以扩展现有的 Spring Data 接口，如 `CrudRepository`、`PagingAndSortingRepository` 等。

还支持以下 Spring 数据类型：

- [Pageable](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Pageable.html)
- [Sort](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Sort.html)
- [Page](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Slice.html)
- [PageRequest](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/PageRequest.html)
- [CrudRepository](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)
- [PagingAndSortingRepository](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/PagingAndSortingRepository.html)

**Spring Data JPA 规范支持**

要在使用 Hibernate 和 JPA 时获得对 [Spring Data JPA 规范](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#specifications)的额外支持，应在类路径中添加以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.data:micronaut-data-spring")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.data</groupId>
    <artifactId>micronaut-data-spring</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后，您可以根据 [Spring Data JPA 文档](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#specifications)实现 `JpaSpecificationExecutor`（接口的泛型参数应为领域类）接口。

**Spring TX 管理器**

用 Spring JDBC 替代程序替换内部数据源 TX 管理器，包括：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.data:micronaut-data-spring-jdbc")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.data</groupId>
    <artifactId>micronaut-data-spring-jdbc</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

用 Spring Hibernate 替代方案替换内部 Hibernate TX 管理器包括：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.data:micronaut-data-spring-jpa")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.data</groupId>
    <artifactId>micronaut-data-spring-jpa</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

> [英文链接](https://micronaut-projects.github.io/micronaut-data/latest/guide/#spring)

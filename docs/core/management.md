---
sidebar_position: 150
---

# 15. 管理与监控

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用管理功能配置项目中的管理端点：

```bash
$ mn create-app my-app --features management
```
:::

受 Spring Boot 和 Grails 的启发，Micronaut `management` 依赖项增加了对通过端点监控应用程序的支持：特殊的 URI 可返回有关应用程序健康和状态的详细信息。`management` 端点还与 Micronaut 的 `security` 依赖关系集成，允许将敏感数据限制给安全系统中的认证用户（参阅安全部分的[内置端点访问](/security/securityRule#94-内置端点安全性)）。

要使用本节所述的 `management` 特性，请将此依赖添加到你的构建中：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-management")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-management</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#management)

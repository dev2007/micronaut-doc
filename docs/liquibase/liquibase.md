---
description: Micronaut Liquibase
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut Liquibase,Liquibase]
---

# Micronaut Liquibase

## 1. 简介

Micronaut Liquibase 集成运行 Liquibase 更新日志。它不创建更新日志。

要使用Micronaut与Liquibase的集成，你必须在 classpath 上有 `micronaut-liquibase` 依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.liquibase:micronaut-liquibase")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.liquibase</groupId>
    <artifactId>micronaut-liquibase</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

## 2. 发布历史

关于此项目，你可以在此处找到发布版本列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-liquibase/releases

## 3. 重大变更

:::caution 警告
Micronaut Framework 4 使用 Groovy 4，**不支持 GORM 7**。一旦出现使用 Groovy 4 构建的 GORM 版本，Micronaut Liquibase 将支持 GORM。
:::

## 4. 配置

你可以为每个数据源定义 liquibase 配置。下面的示例演示了如何使用它：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
datasources.default.url=jdbc:h2:mem:liquibaseDisabledDb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=TRUE
datasources.default.username=sa
datasources.default.password=
datasources.default.driverClassName=org.h2.Driver
jpa.default.packages-to-scan[0]=example.micronaut
jpa.default.properties.hibernate.hbm2ddl.auto=none
jpa.default.properties.hibernate.show_sql=true
liquibase.datasources.default.change-log=classpath:db/liquibase-changelog.xml
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
datasources:
    default:
        url: 'jdbc:h2:mem:liquibaseDisabledDb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=TRUE'
        username: 'sa'
        password: ''
        driverClassName: 'org.h2.Driver'
jpa:
    default:
        packages-to-scan:
            - 'example.micronaut'
        properties:
            hibernate:
                hbm2ddl:
                    auto: none
                show_sql: true
liquibase:
    datasources: # (2)
        default: # (3)
            change-log: 'classpath:db/liquibase-changelog.xml' # (4)
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[datasources]
  [datasources.default]
    url="jdbc:h2:mem:liquibaseDisabledDb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=TRUE"
    username="sa"
    password=""
    driverClassName="org.h2.Driver"
[jpa]
  [jpa.default]
    packages-to-scan=[
      "example.micronaut"
    ]
    [jpa.default.properties]
      [jpa.default.properties.hibernate]
        [jpa.default.properties.hibernate.hbm2ddl]
          auto="none"
        show_sql=true
[liquibase]
  [liquibase.datasources]
    [liquibase.datasources.default]
      change-log="classpath:db/liquibase-changelog.xml"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
datasources {
  'default' {
    url = "jdbc:h2:mem:liquibaseDisabledDb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=TRUE"
    username = "sa"
    password = ""
    driverClassName = "org.h2.Driver"
  }
}
jpa {
  'default' {
    packagesToScan = ["example.micronaut"]
    properties {
      hibernate {
        hbm2ddl {
          auto = "none"
        }
        show_sql = true
      }
    }
  }
}
liquibase {
  datasources {
    'default' {
      changeLog = "classpath:db/liquibase-changelog.xml"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  datasources {
    default {
      url = "jdbc:h2:mem:liquibaseDisabledDb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=TRUE"
      username = "sa"
      password = ""
      driverClassName = "org.h2.Driver"
    }
  }
  jpa {
    default {
      packages-to-scan = ["example.micronaut"]
      properties {
        hibernate {
          hbm2ddl {
            auto = "none"
          }
          show_sql = true
        }
      }
    }
  }
  liquibase {
    datasources {
      default {
        change-log = "classpath:db/liquibase-changelog.xml"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "datasources": {
    "default": {
      "url": "jdbc:h2:mem:liquibaseDisabledDb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=TRUE",
      "username": "sa",
      "password": "",
      "driverClassName": "org.h2.Driver"
    }
  },
  "jpa": {
    "default": {
      "packages-to-scan": ["example.micronaut"],
      "properties": {
        "hibernate": {
          "hbm2ddl": {
            "auto": "none"
          },
          "show_sql": true
        }
      }
    }
  },
  "liquibase": {
    "datasources": {
      "default": {
        "change-log": "classpath:db/liquibase-changelog.xml"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- `properties.hibernate.hbm2ddl.auto` 设置为 `none` 将禁用模式 DDL 创建。
- `liquibase.datasources` 定义了所有 liquibase 配置，例如示例中的 `default`。
- 根更新日志是 `src/main/resources/db/liquibase-changelog.xml`。

通常，你会有一个根更新日志：

*resources/db/liquibase-changelog.xml*

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
  xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
         http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.1.xsd">
  <include file="changelog/01-create-books-schema.xml" relativeToChangelogFile="true"/>
  <include file="changelog/02-insert-data-books.xml" relativeToChangelogFile="true"/>
</databaseChangeLog>
```

它可以导入更新日志，这些日志会随着应用程序的演进而不断生成：

*resources/db/changelog/01-create-books-schema.xml*

```xml
<?xml version="1.0" encoding="UTF-8"?>

<databaseChangeLog
  xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
         http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.1.xsd">
  <changeSet id="01" author="sdelamo">
    <createTable tableName="books"
      remarks="A table to contain all books">
      <column name="id" type="int">
        <constraints nullable="false" unique="true" primaryKey="true"/>
      </column>
      <column name="name" type="varchar(255)">
        <constraints nullable="false" unique="true"/>
      </column>
    </createTable>
  </changeSet>
</databaseChangeLog>
```

:::tip 注意
Liquibase 迁移会在创建数据源时执行。由于 Micronaut Bean 在默认情况下是懒散创建的，如果你没有在某个地方注入 `Datasource`，迁移就不会执行。当你在一个单独的模块中创建一个命令来运行迁移时，可能就会出现这种情况，例如使用 Micronaut 对 [picocli](/core/commandLineApps) 的支持。在这种情况下，只需在任何单子中注入一个 `Datasource `，迁移就会被执行。
:::

### 手动运行迁移

如果需要更多控制来决定何时执行迁移，可以这样配置应用程序：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
liquibase.enabled=true
liquibase.datasources.default.enabled=false
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
liquibase:
  enabled: true
  datasources:
    default:
      enabled: false
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[liquibase]
  enabled=true
  [liquibase.datasources]
    [liquibase.datasources.default]
      enabled=false
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
liquibase {
  enabled = true
  datasources {
    'default' {
      enabled = false
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  liquibase {
    enabled = true
    datasources {
      default {
        enabled = false
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "liquibase": {
    "enabled": true,
    "datasources": {
      "default": {
        "enabled": false
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- 需要启用 Liquibase
- 可针对特定数据源禁用 Liquibase 迁移

现在，你可以注入 `LiquibaseMigrator` Bean 并手动调用 run 方法，以便在需要时执行迁移。

有几种可用的配置选项：

*表 1. [LiquibaseConfigurationProperties](https://micronaut-projects.github.io/micronaut-liquibase/latest/api/io/micronaut/liquibase/LiquibaseConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|liquibase.datasources.*.test-rollback-on-update|boolean|返回是否在更新时测试回滚。|
|liquibase.datasources.*.database-change-log-lock-table|java.lang.String|用于跟踪 Liquibase 并发使用情况的表格名称。|
|liquibase.datasources.*.database-change-log-table|java.lang.String|用于跟踪历史更改的表格名称。|
|liquibase.datasources.*.liquibase-tablespace|java.lang.String|用于 Liquibase 对象的表空间。|
|liquibase.datasources.*.liquibase-schema|java.lang.String|用于 Liquibase 对象的模式。
|liquibase.datasources.*.change-log|java.lang.String||
|liquibase.datasources.*.rollback-file-path|java.lang.String||
|liquibase.datasources.*.drop-first|boolean||
|liquibase.datasources.*.default-schema|java.lang.String||
|liquibase.datasources.*.parameters|java.util.Map||
|liquibase.datasources.*.tag|java.lang.String||
|liquibase.datasources.*.contexts|java.lang.String|用逗号分隔的运行时上下文列表。|
|liquibase.datasources.*.labels|java.lang.String|用逗号分隔的运行时标签列表。|
|liquibase.datasources.*.enabled|boolean|设置是否启用该 Liquibase 配置。|
|liquibase.datasources.*.async|boolean||

---

### 日志记录

Liquibase 4.0 改变了日志记录方式，现在它基于 Java Util Logging (JUL)。这意味着，如果不做任何操作，日志格式将与 Micronaut 中的通常格式不同：

```bash
16:39:58.744 [main] INFO  com.zaxxer.hikari.HikariDataSource - HikariPool-1 - Starting...
16:39:58.945 [main] INFO  com.zaxxer.hikari.HikariDataSource - HikariPool-1 - Start completed.
Nov 10, 2020 4:39:59 PM liquibase.lockservice
INFO: Successfully acquired change log lock
Nov 10, 2020 4:39:59 PM liquibase.changelog
INFO: Creating database history table with name: PUBLIC.DATABASECHANGELOG
Nov 10, 2020 4:39:59 PM liquibase.changelog
INFO: Reading from PUBLIC.DATABASECHANGELOG
Nov 10, 2020 4:39:59 PM liquibase.changelog
INFO: Table users created
Nov 10, 2020 4:39:59 PM liquibase.changelog
INFO: ChangeSet db/changelog/01-create-users-table.xml::01::ilopmar ran successfully in 10ms
Nov 10, 2020 4:39:59 PM liquibase.changelog
INFO: New row inserted into users
Nov 10, 2020 4:39:59 PM liquibase.changelog
INFO: New row inserted into users
Nov 10, 2020 4:39:59 PM liquibase.changelog
INFO: ChangeSet db/changelog/02-insert-users-data.xml::02::ilopmar ran successfully in 4ms
Nov 10, 2020 4:39:59 PM liquibase.lockservice
INFO: Successfully released change log lock
16:40:00.277 [main] INFO  io.micronaut.runtime.Micronaut - Startup completed in 2392ms. Server Running: http://localhost:8080
```

如果要集成 JUL 和 Logback，需要在应用程序中执行以下操作：

- 添加依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("org.slf4j:jul-to-slf4j:1.7.30")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>jul-to-slf4j</artifactId>
    <version>1.7.30</version>
</dependency>
```

  </TabItem>
</Tabs>

- 在 `logback.xml` 中添加以下 `contextListener`：

*src/main/resources/logback.xml*

```xml
<configuration>

    <contextListener class="ch.qos.logback.classic.jul.LevelChangePropagator">
        <resetJUL>true</resetJUL>
    </contextListener>

    <appender ...>
        ...
    </appender>

    ...

</configuration>
```

- 初始化 JUL 到 Slf4j 桥接器。你可以在 *Application* 类中添加以下内容：

*src/main/java/my/package/Application.java*

```java
public static void main(String[] args) {
    // Bridge JUL to Slf4j
    SLF4JBridgeHandler.removeHandlersForRootLogger();
    SLF4JBridgeHandler.install();

    Micronaut.run(Application.class, args);
}
```

使用之前的配置后，再次启动应用程序就能正确显示日志：

```bash
16:47:10.868 [main] INFO  com.zaxxer.hikari.HikariDataSource - HikariPool-1 - Starting...
16:47:11.042 [main] INFO  com.zaxxer.hikari.HikariDataSource - HikariPool-1 - Start completed.
16:47:11.344 [main] INFO  liquibase.lockservice - Successfully acquired change log lock
16:47:11.744 [main] INFO  liquibase.changelog - Creating database history table with name: PUBLIC.DATABASECHANGELOG
16:47:11.747 [main] INFO  liquibase.changelog - Reading from PUBLIC.DATABASECHANGELOG
16:47:11.844 [main] INFO  liquibase.changelog - Table users created
16:47:11.844 [main] INFO  liquibase.changelog - ChangeSet db/changelog/01-create-users-table.xml::01::ilopmar ran successfully in 20ms
16:47:11.857 [main] INFO  liquibase.changelog - New row inserted into users
16:47:11.858 [main] INFO  liquibase.changelog - New row inserted into users
16:47:11.859 [main] INFO  liquibase.changelog - ChangeSet db/changelog/02-insert-users-data.xml::02::ilopmar ran successfully in 3ms
16:47:11.861 [main] INFO  liquibase.lockservice - Successfully released change log lock
16:47:12.288 [main] INFO  io.micronaut.runtime.Micronaut - Startup completed in 2213ms. Server Running: http://localhost:8080
```

## 5. GraalVM 支持

Micronaut Liquibase 与 [GraalVM](https://www.graalvm.org/) 兼容，因此可以创建本地镜像并在应用程序启动时运行迁移。

一切都由库自动处理，因此用户无需任何特殊配置。

:::tip 注意
更多信息，参阅用户指南中有关 [GraalVM](/core/languageSupport/graal) 的部分。
:::

## 6. 端点

该配置提供了一个内置端点，用于公开 `/liquibase` 中所有已应用的迁移。

要启用端点，请在配置中添加以下内容：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.liquibase.enabled=true
endpoints.liquibase.sensitive=false
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
    liquibase:
        enabled: true
        sensitive: false
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.liquibase]
    enabled=true
    sensitive=false
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  liquibase {
    enabled = true
    sensitive = false
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    liquibase {
      enabled = true
      sensitive = false
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "liquibase": {
      "enabled": true,
      "sensitive": false
    }
  }
}
```

  </TabItem>
</Tabs>

- `/liquibase` 端点已启用（这是默认设置），并开放供未经认证的访问。

```json
$ curl http://localhost:8080/liquibase

[{
    "name": "default",
    "changeSets": [{
        "author": "sdelamo",
        "changeLog": "classpath:db/changelog/01-create-books-and-author-schema.xml",
        "comments": "",
        "contexts": [],
        "dateExecuted": "2018-10-29T16:33:05Z",
        "deploymentId": "0830784929",
        "description": "createTable tableName=books; createTable tableName=authors; addForeignKeyConstraint baseTableName=books, constraintName=author_fk, referencedTableName=authors",
        "execType": "EXECUTED",
        "id": "01",
        "labels": [],
        "checksum": "8:140eb966bb6a14bccade2c2d9133b7d3",
        "orderExecuted": 1,
        "tag": "tag1"
    }, {
        "author": "sdelamo",
        "changeLog": "classpath:db/changelog/02-insert-data-authors.xml",
        "comments": "Inserting Authors",
        "contexts": [],
        "dateExecuted": "2018-10-29T16:33:05Z",
        "deploymentId": "0830784929",
        "description": "insert tableName=authors; insert tableName=authors; insert tableName=authors; insert tableName=authors; insert tableName=authors",
        "execType": "EXECUTED",
        "id": "02",
        "labels": [],
        "checksum": "8:6204c525ce5c1c55f064888d078b8f05",
        "orderExecuted": 2,
        "tag": null
    }]
}]
```

:::tip 注意
有关详细信息，参阅用户指南中有关[内置端点](/core/management/providedEndpoints)的部分。
:::

## 7. 7 资料库

你可以在此资源库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-liquibase

> [英文链接](https://micronaut-projects.github.io/micronaut-liquibase/latest/guide/index.html)

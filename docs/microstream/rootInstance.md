---
sidebar_position: 50
---

# 5. 根实例

以下示例创建一个[根实例](https://docs.microstream.one/manual/storage/root-instances.html)来存储 `Customers`：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package io.micronaut.microstream.docs;

import io.micronaut.core.annotation.NonNull;

import java.util.HashMap;
import java.util.Map;

public class Data {
    private Map<String, Customer> customers = new HashMap<>();

    @NonNull
    public Map<String, Customer> getCustomers() {
        return this.customers;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package io.micronaut.microstream.docs

import io.micronaut.core.annotation.Introspected

@Introspected // 
class Data {
    Map<String, Customer> customers = [:]
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package io.micronaut.microstream.docs

import io.micronaut.core.annotation.Introspected

@Introspected // 
data class Data(val customers: MutableMap<String, Customer> = mutableMapOf())
```

  </TabItem>
</Tabs>

`Customer` 定义为：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package io.micronaut.microstream.docs;

import io.micronaut.core.annotation.NonNull;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.serde.annotation.Serdeable;

import javax.validation.constraints.NotBlank;

@Serdeable // 
public class Customer {
    @NonNull
    @NotBlank
	private final String id;

    @NonNull
    @NotBlank
	private String firstName;

    @Nullable
	private String lastName;

    public Customer(@NonNull String id, @NonNull String firstName, @Nullable String lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @NonNull
    public String getId() {
        return id;
    }

    public void setFirstName(@NonNull String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(@Nullable String lastName) {
        this.lastName = lastName;
    }

    @NonNull
    public String getFirstName() {
        return firstName;
    }

    @Nullable
    public String getLastName() {
        return lastName;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package io.micronaut.microstream.docs

import io.micronaut.core.annotation.Introspected
import io.micronaut.core.annotation.NonNull
import io.micronaut.core.annotation.Nullable

import javax.validation.constraints.NotBlank

@Introspected
class Customer {
    @NonNull
    @NotBlank
    String id

    @NonNull
    @NotBlank
    String firstName

    @Nullable
    String lastName

    Customer(@NonNull String id, @NonNull String firstName, @Nullable String lastName) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package io.micronaut.microstream.docs

import io.micronaut.core.annotation.Introspected

@Introspected
class Customer(val id: String, var firstName: String, var lastName: String?)
```

  </TabItem>
</Tabs>

1. 该类型使用 [@Serdeable](https://micronaut-projects.github.io/micronaut-serialization/snapshot/api/io/micronaut/serde/annotation/Serdeable.html) 进行注解，以启用序列化/反序列化

你可以通过配置指定根类：

*src/main/resources/application.yml*

```yaml
microstream:
  storage:
    main: 
      root-class: 'io.micronaut.microstream.docs.Data' 
      storage-directory: '/Users/sdelamo/Documents/MicroStreamData'
```

1. `main`：为 MicroStream 实例指定名称限定符
2. `root-class`：指定实体图根的类

> [英文链接](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/guide/index.html#rootInstance)

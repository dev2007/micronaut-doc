---
sidebar_position: 30
---

# 3. 依赖

首先，将以下依赖项添加到 classpath。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut.microstream:micronaut-microstream-annotations")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut.microstream</groupId>
        <artifactId>micronaut-microstream-annotations</artifactId>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.microstream:micronaut-microstream-annotations")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.microstream</groupId>
    <artifactId>micronaut-microstream-annotations</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.microstream:micronaut-microstream")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.microstream</groupId>
    <artifactId>micronaut-microstream</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

> [英文链接](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/guide/index.html#dependency)
